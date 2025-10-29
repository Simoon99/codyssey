import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: sessionId } = await params;
    const body = await request.json();
    const { messages } = body || {};

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ restored: false, reason: "no_messages" }, { status: 200 });
    }

    const supabase = await getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("id, user_id")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const { count } = await supabase
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("session_id", sessionId);

    if ((count as number) > 0) {
      return NextResponse.json({ restored: false, reason: "messages_exist" }, { status: 200 });
    }

    const sanitized = messages
      .filter((msg: any) => typeof msg?.content === "string" && msg.content.trim().length > 0)
      .slice(-100)
      .map((msg: any) => ({
        id: randomUUID(),
        session_id: sessionId,
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
        tool_calls: msg.toolCalls ?? null,
        search_results: msg.searchResults ?? null,
        created_at: msg.createdAt ?? new Date().toISOString(),
      }));

    if (sanitized.length === 0) {
      return NextResponse.json({ restored: false, reason: "no_valid_messages" }, { status: 200 });
    }

    const { data: inserted, error } = await supabase
      .from("chat_messages")
      .insert(sanitized)
      .select();

    if (error) {
      console.error("[ChatRestore] Failed to insert messages:", error);
      return NextResponse.json({ error: "Failed to restore messages" }, { status: 500 });
    }

    const latestCreatedAt = sanitized[sanitized.length - 1].created_at;
    await supabase
      .from("chat_sessions")
      .update({ last_message_at: latestCreatedAt })
      .eq("id", sessionId)
      .eq("user_id", userId);

    return NextResponse.json({ restored: true, insertedCount: sanitized.length, messages: inserted });
  } catch (error) {
    console.error("[ChatRestore] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


