import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

interface SaveMessageRequest {
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: any;
  searchResults?: any;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: SaveMessageRequest = await request.json();
    const { sessionId, role, content, toolCalls, searchResults } = body;

    if (!sessionId || !role || !content) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId, role, content" },
        { status: 400 }
      );
    }

    // Verify the session belongs to the user
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("id, user_id")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (session.user_id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to save to this session" },
        { status: 403 }
      );
    }

    // Save the message
    const { data: message, error: messageError } = await supabase
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        role,
        content,
        tool_calls: toolCalls || null,
        search_results: searchResults || null,
      })
      .select()
      .single();

    if (messageError) {
      console.error("[Save Message] Database error:", messageError);
      return NextResponse.json(
        { error: "Failed to save message" },
        { status: 500 }
      );
    }

    // Update session's last_message_at and preview
    const lastMessagePreview = content.substring(0, 100) + (content.length > 100 ? "..." : "");

    await supabase
      .from("chat_sessions")
      .update({
        last_message_at: new Date().toISOString(),
        last_message_preview: lastMessagePreview,
      })
      .eq("id", sessionId);

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("[Save Message] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
