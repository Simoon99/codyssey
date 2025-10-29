import { NextRequest, NextResponse } from "next/server";
import { type HelperContext } from "@/lib/llm/provider";
import { runAgenticConversation, createThread } from "@/lib/llm/agent-provider";
import { createWebSearchResponse } from "@/lib/llm/websearch-responses";
import { type HelperType } from "@/lib/types/helpers";
import { getSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs"; // Assistants API requires Node.js runtime

interface ChatRequestBody {
  helper: HelperType;
  message: string;
  threadId?: string; // OpenAI thread ID for conversation continuity
  projectId: string;
  startJourney?: boolean; // Flag to generate opening message
  // Context for AI awareness
  context?: {
    projectName?: string;
    projectDescription?: string;
    projectTechStack?: string;
    projectStage?: string;
    currentStep?: {
      levelTitle: string;
      stepTitle: string;
      cta: string;
    };
    tasks?: Array<{
      id: string;
      title: string;
      description: string;
      required: boolean;
      status: "todo" | "in_progress" | "done";
      xp_reward: number;
    }>;
    requiredTasks?: string[];
    // Recent chat messages for conversation awareness
    recentMessages?: Array<{
      role: "user" | "assistant";
      content: string;
    }>;
  };
}

/**
 * POST /api/chat - Stream agentic chat responses with tool usage
 */
function requireTaskList(helperContext: HelperContext) {
  const tasks = helperContext.tasks || [];
  const sorted = [...tasks].sort((a, b) => {
    if (a.required === b.required) return 0;
    return a.required ? -1 : 1;
  });
  return sorted;
}

function generateOpeningPrompt(
  helperName: string,
  helperContext: HelperContext,
  options: {
    intro: string;
    deliverable: string;
    question: string;
  },
) {
  const orderedTasks = requireTaskList(helperContext);
  const tasksList = orderedTasks.map((task) => {
    const marker = task.required ? "🔵" : "⚪";
    return `${marker} ${task.title}`;
  });
  const firstTask = orderedTasks.length > 0 ? orderedTasks[0].title : undefined;

  // Helper relevance map: which helpers' insights are most relevant to each helper
  const relevanceMap: Record<string, string[]> = {
    muse: [], // Muse is first, no previous context
    architect: ["muse"], // Needs problem validation and MVP scope
    crafter: ["muse", "architect"], // Needs problem/users + tech stack
    hacker: ["architect", "crafter"], // Needs tech stack + design system
    hypebeast: ["muse", "crafter"], // Needs value prop + brand identity
    sensei: ["muse", "architect", "hacker", "hypebeast"], // Needs all previous work
  };

  const relevantHelpers = relevanceMap[helperName.toLowerCase()] || [];

  // Build previous helper context from structured insights (filtered by relevancy)
  let previousSection = "";
  if (helperContext.helperInsights && helperContext.helperInsights.length > 0) {
    const insights = helperContext.helperInsights
      .filter((insight) => relevantHelpers.includes(insight.helper.toLowerCase()))
      .filter((insight) => insight.summary || (insight.keyInsights && insight.keyInsights.length > 0))
      .map((insight) => {
        const displayName = insight.helper.charAt(0).toUpperCase() + insight.helper.slice(1);
        if (insight.summary) {
          return `• **${displayName}**: ${insight.summary}`;
        } else if (insight.keyInsights && insight.keyInsights.length > 0) {
          // Show max 2 most relevant insights
          return `• **${displayName}**: ${insight.keyInsights.slice(0, 2).join("; ")}`;
        }
        return null;
      })
      .filter(Boolean)
      .join("\n");

    if (insights) {
      previousSection = `\n**Previous Helper Insights:**\n${insights}\n`;
    }
  } else if (helperContext.otherHelperConversations && helperContext.otherHelperConversations.length > 0) {
    // Fallback to conversation messages if structured insights aren't available yet (also filtered)
    const conversationInsights = helperContext.otherHelperConversations
      .filter((conv) => relevantHelpers.includes(conv.helper.toLowerCase()))
      .filter((conv) => conv.recentMessages && conv.recentMessages.length > 0)
      .map((conv) => {
        const lastAssistantMessage = conv.recentMessages
          .filter((msg) => msg.role === "assistant")
          .slice(-1)[0];
        const displayName = conv.helper.charAt(0).toUpperCase() + conv.helper.slice(1);
        return lastAssistantMessage
          ? `• **${displayName}**: ${lastAssistantMessage.content.slice(0, 150)}...`
          : null;
      })
      .filter(Boolean)
      .join("\n");

    if (conversationInsights) {
      previousSection = `\n**Previous Helper Insights:**\n${conversationInsights}\n`;
    }
  }

  return `You're starting a journey with the user! Help them complete these specific tasks:\n\n${tasksList.length > 0 ? `**Your Tasks to Complete:**\n${tasksList.join("\n")}` : ""}\n\n**Opening Message Structure:**\n1. ${options.intro}\n\n2. Tasks overview:\n${tasksList.map((line) => `   ${line}`).join("\n")}\n\n3. Focus on first task: "Let's start with: **${firstTask ?? nameFallback(orderedTasks)}**"\n\n4. Ask ONE question: ${options.question}\n\n5. Deliverable you'll produce: ${options.deliverable}\n${previousSection}\n**Key Requirements:**\n- MUST list all tasks exactly as shown above\n- Start with the first task in the list\n- Keep under 175 words total\n- Be systematic, concise, and acknowledge prior helper context if available`;
}

function nameFallback(tasks: any[]) {
  if (!tasks || tasks.length === 0) return "your first task";
  const requiredTask = tasks.find((task) => task.required);
  return requiredTask?.title ?? tasks[0].title ?? "your first task";
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { helper, message, context, startJourney, projectId, threadId: existingThreadId } = body;

    if (!helper) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user for auth
    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Dev mode: Use a demo user ID if not authenticated
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch enhanced context from database
    let helperContext: HelperContext = context || {};
    
    // Only fetch from API if:
    // 1. Project ID exists AND
    // 2. No context was provided (or minimal context)
    const hasMinimalContext = context && Object.keys(context).length > 0;
    
    if (projectId && !hasMinimalContext) {
      try {
        console.log("[POST /api/chat] Fetching enhanced context for project:", projectId);
        const contextResponse = await fetch(
          `${request.nextUrl.origin}/api/context?projectId=${projectId}&currentHelper=${helper}`,
          {
            headers: {
              cookie: request.headers.get("cookie") || "",
            },
          }
        );
        
        if (contextResponse.ok) {
          const { context: enhancedContext } = await contextResponse.json();
          console.log("[POST /api/chat] Successfully fetched enhanced context");
          helperContext = enhancedContext || {};
        } else {
          console.warn("[POST /api/chat] Context fetch returned status:", contextResponse.status, "- using minimal context");
          helperContext = context || {};
        }
      } catch (error) {
        console.error("[POST /api/chat] Failed to fetch enhanced context:", error);
        helperContext = context || {};
      }
    } else if (hasMinimalContext) {
      console.log("[POST /api/chat] Using provided context (skipping API fetch)");
      helperContext = context;
    }

    // Create or use existing thread
    // NOTE: OpenAI doesn't allow adding messages to a thread while a run is active
    // So we should always create a new thread for each API call, or wait for run completion
    // For simplicity, we'll create a new thread each time
    let threadId = existingThreadId;
    
    // Create a new thread when starting a journey or when no thread exists yet
    if (!threadId) {
      threadId = await createThread();
      console.log("[POST /api/chat] Created new thread:", threadId);
    }

    // If startJourney is true, generate opening message
    let userMessage = message;
    if (startJourney) {
      // Enhanced task-focused prompts for each helper with actionable guidance
      const initPrompts: Record<string, string> = {
        muse: generateOpeningPrompt(
          "Muse",
          helperContext,
          {
            intro: `Hey! I'm Muse, ready to help you validate ${helperContext.projectName}!`,
            deliverable:
              "a validated problem statement, clear target user profile, locked MVP scope, and comprehensive project brief that will guide the entire journey.",
            question:
              "What's the core problem you're solving, or where are you in defining it?",
          },
        ),

        architect: generateOpeningPrompt(
          "Architect",
          helperContext,
          {
            intro: `I'm Architect, here to turn ${helperContext.projectName} into a solid technical blueprint.`,
            deliverable:
              "a recommended tech stack and architectural blueprint — including chosen frameworks, database, auth, infra/provider, integration patterns, CI/CD outline, rough cost estimate, and ready-to-use AI prompts (Cursor/Bolt/ChatGPT) to accelerate implementation.",
            question:
              "Do you have any constraints or preferences for language/framework, hosting (cloud vs. serverless), database type, auth provider, or monthly budget?",
          },
        ),

        crafter: generateOpeningPrompt(
          "Crafter",
          helperContext,
          {
            intro: `Hey! I'm Crafter, let's design something beautiful for ${helperContext.projectName}!`,
            deliverable:
              "a complete design system, component structure, UI prompt templates, and ready-to-use prompts for v0/Lovable/Midjourney to build your entire interface.",
            question:
              "What's your design vision — do you have any specific styles, inspirations, or existing designs in mind?",
          },
        ),

        hacker: generateOpeningPrompt(
          "Hacker",
          helperContext,
          {
            intro: `I'm Hacker. Let's 10x your build speed for ${helperContext.projectName}.`,
            deliverable:
              "optimized CAO prompt structure, reusable prompt macros, prompt chains for complex workflows, and a custom prompt library to accelerate your building with Cursor/Bolt/Copilot.",
            question:
              "What AI coding tools are you using now, and what's your biggest build blocker?",
          },
        ),

        hypebeast: generateOpeningPrompt(
          "Hypebeast",
          helperContext,
          {
            intro: `Yo! I'm Hypebeast, let's get ${helperContext.projectName} in front of the world!`,
            deliverable:
              "a complete launch strategy with Product Hunt prep, social media content calendar, launch copy, teaser campaigns, and channel-specific tactics to maximize day-1 visibility.",
            question:
              "What's your launch goal — audience size, revenue target, or something else? And which channels are you thinking?",
          },
        ),

        sensei: generateOpeningPrompt(
          "Sensei",
          helperContext,
          {
            intro: `I'm Sensei, here to guide ${helperContext.projectName} toward sustainable growth.`,
            deliverable:
              "a comprehensive growth framework with key metrics, optimization strategies, user retention playbook, and data-driven insights to scale from MVP to thriving product.",
            question:
              "What's your biggest growth challenge right now — finding users, keeping them, or something else?",
          },
        ),
      };

      userMessage = initPrompts[helper] || `Generate your opening message to greet the user and start working on the tasks together. Introduce yourself briefly, acknowledge the project, and ask ONE focused question to understand where they are right now.`;
    }

    // Create a readable stream
    const encoder = new TextEncoder();
    
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Send thread ID first
          console.log("[POST /api/chat] Sending thread ID to client:", threadId);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "thread_id", threadId })}\n\n`)
          );

          // Check if we should use Responses API pipeline (faster, stateless)
          const useResponsesPipeline = process.env.NEXT_PUBLIC_USE_RESPONSES_PIPELINE === "true";
          
          let stream;
          if (useResponsesPipeline) {
            console.log("[POST /api/chat] Using Responses API pipeline (stateless, fast)");
            stream = createWebSearchResponse({
              helper,
              message: userMessage,
              context: helperContext,
              projectContext: {
                projectId,
                userId: userId!,
              }
            });
          } else {
            // Fallback to Assistants API (stateful, slower with long history)
            console.log("[POST /api/chat] Using Assistants API with threadId:", threadId);
            stream = runAgenticConversation(
              helper,
              threadId!,
              userMessage,
              helperContext,
              {
                projectId,
                userId: userId!,
              }
            );
          }

          for await (const event of stream) {
            switch (event.type) {
              case "text":
                // Stream text content
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: "text", content: event.content })}\n\n`)
                );
                break;

              case "tool_call":
                // Notify about tool being called
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ 
                    type: "tool_call",
                    tool_name: event.tool_name,
                    tool_args: event.tool_args,
                  })}\n\n`)
                );
                break;

              case "tool_result":
                // Send tool execution result
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ 
                    type: "tool_result",
                    tool_name: event.tool_name,
                    result: event.tool_result,
                  })}\n\n`)
                );
                break;

              case "done":
                // Conversation complete
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
                );
                break;
            }
          }

          controller.close();
        } catch (error) {
          console.error("Agentic streaming error:", error);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              type: "error", 
              error: error instanceof Error ? error.message : "Unknown error" 
            })}\n\n`)
          );
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
