import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

    // Always use demo mode for now (bypass auth)
    console.log("Demo mode: Task completed", { taskId, projectId });
    
    // Mock XP reward based on task
    const xpReward = 50; // Default XP
    
    return NextResponse.json({
      success: true,
      xpAwarded: xpReward,
      leveledUp: false,
    });

    // Production mode with authentication (disabled for demo)
    // const supabase = await createClient();
    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();

    // if (!user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // // Complete the task
    // const result = await completeTask(user.id, projectId, taskId);

    // if (!result.success) {
    //   return NextResponse.json(
    //     { error: "Failed to complete task" },
    //     { status: 500 }
    //   );
    // }

    // return NextResponse.json({
    //   success: true,
    //   xpAwarded: result.xpAwarded,
    //   leveledUp: result.leveledUp,
    // });
  } catch (error) {
    console.error("Task completion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

