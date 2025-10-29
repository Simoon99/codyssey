import OpenAI from "openai";
import { type HelperType, getHelperById } from "@/lib/types/helpers";
import { type HelperContext } from "./provider";
import { getHelperTools, executeToolCall } from "./agent-tools";
import { buildTaskAwarePrompt } from "./task-prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ResponseArgs {
  helper: HelperType;
  message: string;
  context?: HelperContext;
  projectContext?: {
    projectId: string;
    userId: string;
  };
}

interface StreamEvent {
  type: "text" | "tool_call" | "tool_result" | "done";
  content?: string;
  tool_name?: string;
  tool_args?: any;
  tool_result?: any;
}

function buildAgentInstructions(helper: HelperType, context?: HelperContext) {
  const helperInfo = getHelperById(helper);
  let instructions = `You are ${helperInfo.name}, ${helperInfo.title}. Stay in your domain expertise and follow the established Vibecoding patterns.`;

  if (context) {
    if (context.projectName) {
      instructions += `\n\nProject: ${context.projectName}`;
      if (context.projectDescription) {
        instructions += ` — ${context.projectDescription}`;
      }
    }

    if (context.currentStep) {
      instructions += `\nCurrent Step: ${context.currentStep.levelTitle} → ${context.currentStep.stepTitle} (Goal: ${context.currentStep.cta})`;
    }

    if (context.tasks && context.tasks.length > 0) {
      const taskIds = context.tasks.map((task) => task.id);
      instructions += buildTaskAwarePrompt(taskIds, {
        maxTasks: 4,
        maxTokens: 600,
      });
    }
  }

  instructions += `

## Web Search & Citation Instructions

When you use web_search:
1. Results include numbered citations [1], [2], [3], etc.
2. **Use ONLY numbers in your response text** - do NOT include URLs or links
3. Example: "According to research [1], trends show X [2]. This means Y [1,3]."
4. The UI will show numbered source cards below your response
5. Keep responses focused on synthesizing the data, not listing sources
6. For each claim, reference its source number
7. Use multiple citations when comparing or synthesizing across sources

IMPORTANT FORMAT:
- Response text: Use citations like [1], [2], [3]
- NO URLs in response text
- NO clickable links in response text
- Source cards appear below with numbered badges
- Users click the numbered badges to visit sources

Example good response:
"Recent analysis [1] shows AI tools are trending. Specifically, Cursor dominates [2] with Lovable following [3]. This suggests a shift toward AI-first development [1,2]."

## Prior Agent Instructions
Follow your domain expertise patterns: use numbered citations, save artifacts when valuable, and teach vibecoding best practices.`;

  return instructions;
}

function convertToolsForResponsesAPI(assistantTools: any[]) {
  return assistantTools.map((tool) => {
    if (tool.type === "function" && tool.function) {
      return {
        type: "function" as const,
        name: tool.function.name,
        description: tool.function.description,
        parameters: tool.function.parameters,
      };
    }
    return tool;
  });
}

export function createWebSearchResponse(args: ResponseArgs) {
  const { helper, message, context, projectContext } = args;
  const model = process.env.OPENAI_RESPONSES_MODEL || "gpt-5-mini";
  const instructions = buildAgentInstructions(helper, context);
  const assistantTools = getHelperTools(helper);
  const convertedTools = convertToolsForResponsesAPI(assistantTools);

  async function* runner(): AsyncGenerator<StreamEvent> {
    const conversationHistory: any[] = [
      { role: "system", content: instructions },
      { role: "user", content: message },
    ];

    console.log("[Responses] Starting initial stream");
    
    // Always use streaming API
    let stream = await openai.responses.stream({
      model,
      input: conversationHistory,
      metadata: {
        helper,
        projectId: projectContext?.projectId ?? "unknown-project",
        userId: projectContext?.userId ?? "unknown-user",
      },
      tools: convertedTools as any,
      reasoning: { summary: "auto" },
    });

    let pendingToolCalls: any[] = [];

    // Process stream
    for await (const chunk of stream) {
      const chunkAny = chunk as any;

      // Stream text content
      if (chunkAny.type === "content.delta" && chunkAny.delta) {
        yield { type: "text", content: chunkAny.delta };
      }

      // Collect tool calls
      if (chunkAny.type === "response.function_call" || chunkAny.type === "function_call") {
        pendingToolCalls.push(chunkAny);
      }

      // Handle response completion
      if (chunkAny.type === "response.done") {
        // If there are tool calls, execute them
        if (pendingToolCalls.length > 0) {
          console.log("[Responses] Executing", pendingToolCalls.length, "tool calls");

          const toolOutputs: any[] = [];

          for (const toolCall of pendingToolCalls) {
            const fnName = toolCall.name || toolCall.function?.name;
            let args: any = {};

            try {
              const argsStr = toolCall.arguments || toolCall.function?.arguments;
              args = argsStr ? JSON.parse(argsStr) : {};
            } catch (e) {
              args = {};
            }

            console.log("[Responses] Executing tool:", fnName);

            yield {
              type: "tool_call",
              tool_name: fnName,
              tool_args: args,
            };

            const result = await executeToolCall(fnName, args, {
              projectId: projectContext?.projectId ?? "unknown",
              userId: projectContext?.userId ?? "unknown",
              helper,
            });

            // Enhance web search results
            if (fnName === "web_search" && result?.data) {
              const total = result.data.total_results || result.data.results?.length || 0;
              result.data.summary = total > 0 ? `${total} results` : "No results";

              if (total > 0 && result.data.results) {
                const citations = result.data.results
                  .slice(0, 5)
                  .map((r: any, i: number) => `[${i + 1}] "${r.title}"\n${r.snippet}\nSource: ${r.url}`)
                  .join("\n\n");
                result.data.citations_for_model = `SEARCH RESULTS:\n\n${citations}\n\nUse [1], [2], etc. to cite these sources.`;
              }
            }

            yield {
              type: "tool_result",
              tool_name: fnName,
              tool_result: result,
            };

            toolOutputs.push({
              call_id: toolCall.call_id || toolCall.id,
              output: JSON.stringify(result),
            });
          }

          // Add tool results to conversation
          const toolResultsText = toolOutputs
            .map((output) => {
              const parsed = JSON.parse(output.output);
              if (parsed.success && parsed.data?.citations_for_model) {
                return parsed.data.citations_for_model;
              }
              return output.output;
            })
            .join("\n\n");

          conversationHistory.push({
            role: "user",
            content: `Here are the results:\n\n${toolResultsText}\n\nPlease answer using numbered citations [1], [2], etc.`,
          });

          // Stream the response with tool results
          console.log("[Responses] Streaming response with tool results");
          stream = await openai.responses.stream({
            model,
            input: conversationHistory,
            metadata: {
              helper,
              projectId: projectContext?.projectId ?? "unknown-project",
              userId: projectContext?.userId ?? "unknown-user",
            },
            reasoning: { summary: "auto" },
          });

          // Process the new stream
          for await (const chunk2 of stream) {
            const chunk2Any = chunk2 as any;
            if (chunk2Any.type === "content.delta" && chunk2Any.delta) {
              yield { type: "text", content: chunk2Any.delta };
            }
            if (chunk2Any.type === "response.done") {
              break;
            }
          }
        }

        // All done
        yield { type: "done" };
        return;
      }
    }
  }

  return runner();
}

