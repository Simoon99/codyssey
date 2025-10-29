import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";
import { createThread } from "@/lib/llm/agent-provider";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const helper = searchParams.get("helper");

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId" },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[GET /api/chat/sessions] Fetching sessions for user:", userId, "project:", projectId, "helper:", helper);

    let query = supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .order("last_message_at", { ascending: false });

    if (helper) {
      query = query.eq("helper", helper);
    }

    const { data: sessions, error } = await query;

    if (error) {
      console.error("[GET /api/chat/sessions] Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch sessions" },
        { status: 500 }
      );
    }

    console.log("[GET /api/chat/sessions] Found", sessions?.length || 0, "sessions");
    return NextResponse.json({ sessions: sessions || [] });
  } catch (error) {
    console.error("[GET /api/chat/sessions] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[Sessions POST] Starting session creation...");
    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);

    console.log("[Sessions POST] User ID:", userId, "Dev mode:", isDev);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { helper, projectId, threadId: providedThreadId, title } = body;

    if (!helper || !projectId) {
      return NextResponse.json(
        { error: "Missing required fields: helper, projectId" },
        { status: 400 }
      );
    }

    let threadId = providedThreadId;

    if (!threadId) {
      try {
        threadId = await createThread();
      } catch (error) {
        console.error("[Sessions POST] Failed to create thread:", error);
        return NextResponse.json(
          { error: "Failed to create OpenAI thread" },
          { status: 500 }
        );
      }
    }

    console.log("[Sessions POST] Creating session for helper:", helper);

    const { data: session, error } = await supabase
      .from("chat_sessions")
      .insert([
        {
          user_id: userId,
          project_id: projectId,
          helper,
          thread_id: threadId,
          title: title || `Chat with ${helper}`,
          last_message_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("[Sessions POST] Database error:", error);
      return NextResponse.json(
        { error: "Failed to create session", details: error.message || error },
        { status: 500 }
      );
    }

    console.log("[Sessions POST] Session created successfully:", session?.id);
    console.log("[Sessions POST] Session data:", {
      id: session?.id,
      helper,
      projectId,
      threadId,
      title: session?.title,
      createdAt: session?.created_at,
    });
    
    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    console.error("[Sessions POST] Caught exception:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
