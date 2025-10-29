import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";
import { completeTask } from "@/lib/levels/progression";

interface CompleteTaskRequest {
  taskId: string;
  projectId: string;
}

/**
 * POST /api/tasks/complete - Mark a task as complete and award XP
 */
export async function POST(request: NextRequest) {
  try {
    const body: CompleteTaskRequest = await request.json();
    const { taskId, projectId } = body;

    if (!taskId || !projectId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Dev mode: Use a demo user ID if not authenticated
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Complete the task
    const result = await completeTask(userId, projectId, taskId);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to complete task" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      xpAwarded: result.xpAwarded,
      leveledUp: result.leveledUp,
    });
  } catch (error) {
    console.error("Task completion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

