import { NextRequest, NextResponse } from "next/server";
import { createStreamingChatCompletion, type HelperContext } from "@/lib/llm/provider";
import { type HelperType } from "@/lib/types/helpers";

export const runtime = "edge";

interface ChatRequestBody {
  helper: HelperType;
  message: string;
  chatId?: string;
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
  };
}

/**
 * POST /api/chat - Stream chat responses from helper AI
 */
export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { helper, message, context, startJourney } = body;

    if (!helper) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // For demo mode - no database, just stream response
    // In production, you'd save messages to database here

    // Build context for AI
    const helperContext: HelperContext = context || {};

    // If startJourney is true, generate opening message
    let userMessage = message;
    if (startJourney) {
      // Create a prompt that asks the helper to introduce themselves
      userMessage = `Generate your opening message to greet the user and start the conversation. Introduce yourself with your personality, acknowledge the project and current step, list the tasks we'll work on, and ask the user to share their current situation (where they are, what they want to focus on, constraints).`;
    }

    // Stream response with context
    const stream = await createStreamingChatCompletion(
      helper,
      [{ role: "user", content: userMessage }],
      helperContext
    );

    // Create a readable stream
    const encoder = new TextEncoder();
    
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
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
