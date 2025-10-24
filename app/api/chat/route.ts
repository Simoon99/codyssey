import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createStreamingChatCompletion } from "@/lib/llm/provider";
import { type HelperType } from "@/lib/types/helpers";

export const runtime = "edge";

interface ChatRequestBody {
  helper: HelperType;
  message: string;
  chatId?: string;
  projectId: string;
}

/**
 * POST /api/chat - Stream chat responses from helper AI
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ChatRequestBody = await request.json();
    const { helper, message, chatId, projectId } = body;

    if (!helper || !message || !projectId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get or create chat
    let currentChatId = chatId;
    if (!currentChatId) {
      const { data: newChat, error: chatError } = await supabase
        .from("helper_chats")
        .insert({
          project_id: projectId,
          user_id: user.id,
          helper,
          title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
        })
        .select()
        .single();

      if (chatError || !newChat) {
        console.error("Error creating chat:", chatError);
        return NextResponse.json(
          { error: "Failed to create chat" },
          { status: 500 }
        );
      }

      currentChatId = newChat.id;
    }

    // Save user message
    await supabase.from("chat_messages").insert({
      chat_id: currentChatId,
      role: "user",
      content: message,
    });

    // Get previous messages for context
    const { data: previousMessages } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("chat_id", currentChatId)
      .order("created_at", { ascending: true })
      .limit(10);

    const contextMessages = previousMessages || [];

    // Stream response
    const stream = await createStreamingChatCompletion(helper, [
      ...contextMessages.slice(-5), // Last 5 messages for context
      { role: "user", content: message },
    ]);

    // Create a readable stream
    const encoder = new TextEncoder();
    let fullResponse = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }

          // Save assistant message
          await supabase.from("chat_messages").insert({
            chat_id: currentChatId,
            role: "assistant",
            content: fullResponse,
          });

          // Log event
          await supabase.from("events").insert({
            user_id: user.id,
            project_id: projectId,
            name: "chat_message_sent",
            data: { helper, chat_id: currentChatId },
          });

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, chatId: currentChatId })}\n\n`));
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

