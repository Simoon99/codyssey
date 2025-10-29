import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";

/**
 * POST /api/journey/tasks/[id]/complete
 * Mark a task as completed and award XP
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;

    if (!taskId) {
      return NextResponse.json(
        { error: "Missing task ID" },
        { status: 400 }
      );
    }

    // Get the task
    const { data: task, error: fetchError } = await supabase
      .from("helper_level_tasks")
      .select("*")
      .eq("id", taskId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !task) {
      console.error("[Task Complete] Error fetching task:", fetchError);
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    if (task.is_completed) {
      return NextResponse.json(
        { error: "Task already completed" },
        { status: 400 }
      );
    }

    // Mark task as completed
    const { data: updatedTask, error: updateError } = await supabase
      .from("helper_level_tasks")
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .eq("user_id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("[Task Complete] Error updating task:", updateError);
      return NextResponse.json(
        { error: "Failed to complete task" },
        { status: 500 }
      );
    }

    // Award XP (you can integrate with your XP system here)
    const xpAwarded = task.xp_reward || 10;

    // Check if all required tasks are completed
    const { data: allTasks } = await supabase
      .from("helper_level_tasks")
      .select("*")
      .eq("user_id", userId)
      .eq("project_id", task.project_id)
      .eq("helper", task.helper)
      .eq("level_id", task.level_id);

    const requiredTasks = allTasks?.filter(t => t.is_required) || [];
    const completedRequiredTasks = requiredTasks.filter(t => t.is_completed);
    const levelCompleted = requiredTasks.length > 0 && 
                          completedRequiredTasks.length === requiredTasks.length;

    return NextResponse.json({
      success: true,
      task: updatedTask,
      xpAwarded,
      levelCompleted,
      stats: {
        totalTasks: allTasks?.length || 0,
        completedTasks: allTasks?.filter(t => t.is_completed).length || 0,
        requiredTasks: requiredTasks.length,
        completedRequiredTasks: completedRequiredTasks.length,
      },
    });
  } catch (error) {
    console.error("[Task Complete] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

