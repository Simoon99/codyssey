import { NextRequest, NextResponse } from "next/server";
import { createStreamingChatCompletion, type HelperContext } from "@/lib/llm/provider";
import { type HelperType } from "@/lib/types/helpers";

export const runtime = "edge";

interface ChatRequestBody {
  helper: HelperType;
  message: string;
  chatId?: string;
  projectId: string;
  // Context for AI awareness
  context?: {
    projectName?: string;
    projectDescription?: string;
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
    const { helper, message, context } = body;

    if (!helper || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // For demo mode - no database, just stream response
    // In production, you'd save messages to database here

    // Build context for AI
    const helperContext: HelperContext = context || {};

    // Stream response with context
    const stream = await createStreamingChatCompletion(
      helper,
      [{ role: "user", content: message }],
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
