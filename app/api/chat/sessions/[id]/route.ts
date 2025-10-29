import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";

/**
 * PATCH /api/chat/sessions/[id] - Update a chat session (e.g., title)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("[Sessions PATCH] Starting session update...");
    
    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Dev mode: Use a demo user ID if not authenticated
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sessionId } = await params;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Update session in database
    console.log("[Sessions PATCH] Updating session:", sessionId);
    const { data: session, error } = await supabase
      .from("chat_sessions")
      .update({ title: title.trim() })
      .eq("id", sessionId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("[Sessions PATCH] Database error:", error);
      return NextResponse.json(
        { error: "Failed to update session", details: error.message || error },
        { status: 500 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    console.log("[Sessions PATCH] Session updated successfully");
    return NextResponse.json({ session });
  } catch (error) {
    console.error("[Sessions PATCH] Caught exception:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/chat/sessions/[id] - Delete a chat session
 */
export async function DELETE(
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

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    // Delete session (messages will cascade delete)
    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("user_id", userId);

    if (error) {
      console.error("[DELETE /api/chat/sessions] Failed to delete session:", sessionId, error);
      return NextResponse.json(
        { error: "Failed to delete session" },
        { status: 500 }
      );
    }

    console.log("[DELETE /api/chat/sessions] Successfully deleted session:", sessionId);
    console.log("[DELETE /api/chat/sessions] Cascading message deletion handled by database");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/chat/sessions] API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
