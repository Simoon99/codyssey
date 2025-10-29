import { NextRequest, NextResponse } from "next/server";
import { createClient, getSupabaseClient } from "@/lib/supabase/server";

/**
 * GET /api/chat/sessions/[id]/messages - Get all messages for a session
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Dev mode: Use a demo user ID if not authenticated
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sessionId } = await params;

    // Verify user owns this session
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Get all messages for this session
    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch messages:", error);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      session,
      messages: messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        toolCalls: msg.tool_calls,
        searchResults: msg.search_results, // Include search results
        createdAt: msg.created_at,
      }))
    });
  } catch (error) {
    console.error("Get messages API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/sessions/[id]/messages - Add a message to a session
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Dev mode: Use a demo user ID if not authenticated
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sessionId } = await params;
    const body = await request.json();
    const { role, content, toolCalls, searchResults } = body;

    if (!role || !content) {
      return NextResponse.json(
        { error: "Missing role or content" },
        { status: 400 }
      );
    }

    // Verify user owns this session
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Add message
    const { data: message, error } = await supabase
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        role,
        content,
        tool_calls: toolCalls || null,
        search_results: searchResults || null, // Save search results
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to add message:", error);
      return NextResponse.json(
        { error: "Failed to add message" },
        { status: 500 }
      );
    }

    // Update session title if this is the first user message
    if (role === "user") {
      const { data: messageCount } = await supabase
        .from("chat_messages")
        .select("id", { count: "exact", head: true })
        .eq("session_id", sessionId)
        .eq("role", "user");

      if (messageCount && (messageCount as any).count === 1) {
        // Generate title from first message (first 50 chars)
        const title = content.substring(0, 50) + (content.length > 50 ? "..." : "");
        await supabase
          .from("chat_sessions")
          .update({ title })
          .eq("id", sessionId);
      }
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Add message API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

