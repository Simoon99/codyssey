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
    // Compress project info: only essential details to avoid token bloat
    if (context.projectName) {
      instructions += `\n\n**Project: ${context.projectName}**`;
      
      // Add BRIEF project summary (max 100 chars)
      if (context.projectDescription) {
        const briefDesc = context.projectDescription.substring(0, 100);
        instructions += ` — ${briefDesc}${context.projectDescription.length > 100 ? '...' : ''}`;
      }
      
      // Add ONE key detail based on helper type
      if (helper === "muse" && context.problemStatement) {
        instructions += `\n**Problem:** ${context.problemStatement.substring(0, 80)}`;
      } else if (helper === "architect" && context.projectTechStack) {
        instructions += `\n**Tech:** ${context.projectTechStack}`;
      } else if (helper === "crafter" && context.targetAudience) {
        instructions += `\n**Audience:** ${context.targetAudience}`;
      }
    }

    // Add scope boundaries based on helper type
    if (helper === "muse") {
      instructions += `\n\n**STAY FOCUSED:** You validate ideas and research markets. Keep responses SHORT (max 500 words). Don't architect, design, or implement—just validate. If they ask for technical details, direct them to Architect.`;
    } else if (helper === "architect") {
      instructions += `\n\n**STAY FOCUSED:** You design systems and tech stacks. Don't write code—keep it architectural. Don't design UI—that's Crafter. Don't debug—that's Hacker. Keep responses focused on structure and constraints.`;
    } else if (helper === "crafter") {
      instructions += `\n\n**STAY FOCUSED:** You design UI/UX and improve copy. Don't write code or backend logic. Keep responses visual and user-focused. If they need implementation help, direct them to Hacker.`;
    } else if (helper === "hacker") {
      instructions += `\n\n**STAY FOCUSED:** You implement code and unblock technical issues. Don't design architecture—that's Architect. Don't sketch UX—that's Crafter. Be direct and code-focused.`;
    }

    // Journey progress: concise summary
    if (context.journeyProgress) {
      const { currentLevel, completedCount, totalTasks } = context.journeyProgress;
      const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
      instructions += `\n**Progress:** Level ${currentLevel} • ${progress}% tasks done`;
    }

    // Current step: what they're focused on NOW
    if (context.currentStep) {
      instructions += `\n**Current:** ${context.currentStep.stepTitle} (${context.currentStep.cta})`;
    }

    // Tasks: only incomplete ones, limited to 4
    if (context.tasks && context.tasks.length > 0) {
      const incompleteTasks = context.tasks.filter(t => t.status !== 'done').slice(0, 4);
      if (incompleteTasks.length > 0) {
        instructions += `\n**Active Tasks:**`;
        incompleteTasks.forEach(task => {
          const statusIcon = task.status === 'in_progress' ? '🔄' : '⭕';
          instructions += `\n- ${statusIcon} ${task.title}`;
        });
      }
    }

    // Recent conversation history: understand what was just discussed
    if (context.recentMessages && context.recentMessages.length > 0) {
      const recentMsgs = context.recentMessages.slice(-2); // Last 2 exchanges
      instructions += `\n\n**Recent conversation:**`;
      recentMsgs.forEach((msg: { role: string; content: string }) => {
        const label = msg.role === 'user' ? 'User' : 'You';
        const preview = msg.content.substring(0, 60);
        instructions += `\n${label}: ${preview}${msg.content.length > 60 ? '...' : ''}`;
      });
      instructions += `\n\nUse this context to understand what they're asking about.`;
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

## How to Help
You have context about the user's project and what they've been working on. Reference this when relevant, but stay focused on the current request. Don't overwhelm them with all the details—just what's needed for helpful, fast responses.`;

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
  let model = process.env.OPENAI_RESPONSES_MODEL || "gpt-5-mini";
  
  // Fallback to gpt-4o if gpt-5-mini isn't available
  // gpt-5-mini is very new and might not be available in all accounts
  const validModels = ["gpt-5-mini", "gpt-4o", "gpt-4-turbo"];
  if (!validModels.includes(model)) {
    console.warn(`[Responses] Model ${model} not recognized, falling back to gpt-4o`);
    model = "gpt-4o";
  }
  
  const instructions = buildAgentInstructions(helper, context);
  const assistantTools = getHelperTools(helper);
  const convertedTools = convertToolsForResponsesAPI(assistantTools);

  async function* runner(): AsyncGenerator<StreamEvent> {
    // Build conversation history with recent context
    const conversationHistory: any[] = [
      { role: "system", content: instructions },
    ];
    
    // Include recent messages from the chat (if provided)
    if (context?.recentMessages && context.recentMessages.length > 0) {
      // Add last few messages to give context
      context.recentMessages.forEach((msg) => {
        conversationHistory.push({
          role: msg.role,
          content: msg.content,
        });
      });
    }
    
    // Add current message
    conversationHistory.push({ role: "user", content: message });

    console.log("[Responses] Starting initial stream with model:", model);
    console.log("[Responses] Instructions length:", instructions.length);
    console.log("[Responses] Conversation history messages:", conversationHistory.length);
    console.log("[Responses] Message:", message.substring(0, 100));
    
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
      // Removed reasoning to allow immediate text streaming
      // reasoning: { summary: "auto" },  // This was blocking text until thinking completed
    });

    let pendingToolCalls: any[] = [];
    let currentToolCall: any = null;

    // Process stream
    let chunkCount = 0;
    for await (const chunk of stream) {
      chunkCount++;
      console.log(`[Responses] Chunk #${chunkCount}:`, (chunk as any).type);
      const chunkAny = chunk as any;

      // Stream text content
      // The Responses API sends "response.output_text.delta" for actual text output
      if (chunkAny.type === "content.delta" && chunkAny.delta) {
        console.log(`[Responses] Text delta:`, chunkAny.delta.substring(0, 50));
        yield { type: "text", content: chunkAny.delta };
      }
      
      // Handle Responses API format: response.output_text.delta
      if (chunkAny.type === "response.output_text.delta" && chunkAny.delta) {
        console.log(`[Responses] Output text delta:`, chunkAny.delta.substring(0, 50));
        yield { type: "text", content: chunkAny.delta };
      }

      // Collect tool call arguments as they stream in
      if (chunkAny.type === "response.function_call_arguments.delta" && chunkAny.delta) {
        if (!currentToolCall) {
          currentToolCall = { arguments: "" };
        }
        currentToolCall.arguments += chunkAny.delta;
        console.log(`[Responses] Building tool call arguments...`);
      }

      // When an output item completes, check if it was a tool call
      if (chunkAny.type === "response.output_item.done") {
        console.log(`[Responses] Output item done - checking if tool call...`);
        // The completed output will have the tool call info
        if (chunkAny.item && chunkAny.item.type === "function_call") {
          console.log(`[Responses] Found function call:`, chunkAny.item.name);
          pendingToolCalls.push({
            name: chunkAny.item.name,
            arguments: chunkAny.item.arguments,
            id: chunkAny.item.id,
          });
        } else if (currentToolCall && currentToolCall.arguments) {
          // Fallback: we were building arguments, this is likely a tool call
          console.log(`[Responses] Tool call collected from arguments`);
          pendingToolCalls.push(currentToolCall);
          currentToolCall = null;
        }
      }

      // Collect tool calls (old format, keep for compatibility)
      if (chunkAny.type === "response.function_call" || chunkAny.type === "function_call") {
        console.log(`[Responses] Tool call:`, (chunkAny.name || chunkAny.function?.name));
        pendingToolCalls.push(chunkAny);
      }

      // Handle response completion
      // Responses API sends "response.completed" instead of "response.done"
      if (chunkAny.type === "response.done" || chunkAny.type === "response.completed") {
        console.log(`[Responses] Stream done. Total chunks: ${chunkCount}, Pending tool calls: ${pendingToolCalls.length}`);
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
              console.error("[Responses] Failed to parse tool args:", e);
              args = {};
            }

            console.log("[Responses] Executing tool:", fnName, "with args:", JSON.stringify(args).substring(0, 100));

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
            // Don't use reasoning here - we want fast response after tool execution
            // reasoning: { summary: "auto" },
          });

          // Process the new stream
          for await (const chunk2 of stream) {
            const chunk2Any = chunk2 as any;
            // Handle both content.delta and response.output_text.delta
            if (chunk2Any.type === "content.delta" && chunk2Any.delta) {
              yield { type: "text", content: chunk2Any.delta };
            }
            if (chunk2Any.type === "response.output_text.delta" && chunk2Any.delta) {
              yield { type: "text", content: chunk2Any.delta };
            }
            if (chunk2Any.type === "response.done" || chunk2Any.type === "response.completed") {
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

