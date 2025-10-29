import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";

/**
 * GET /api/journey/progress?projectId=xxx&helper=xxx
 * Get journey progress and tasks for a specific helper
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const helper = searchParams.get("helper");

    if (!projectId || !helper) {
      return NextResponse.json(
        { error: "Missing required parameters: projectId, helper" },
        { status: 400 }
      );
    }

    // Get journey progress for this helper (any status - supports multiple concurrent helpers)
    const { data: journeyProgress, error: progressError } = await supabase
      .from("journey_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .eq("helper", helper)
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (progressError) {
      console.error("[Journey Progress] Error fetching progress:", progressError);
    }

    // Get ALL tasks for this helper (not filtered by level - shows all helper tasks)
    const { data: tasks, error: tasksError } = await supabase
      .from("helper_level_tasks")
      .select("*")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .eq("helper", helper)
      .order("created_at", { ascending: true });

    if (tasksError) {
      console.error("[Journey Progress] Error fetching tasks:", tasksError);
    }

    // Calculate task completion stats
    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter(t => t.is_completed).length || 0;
    const requiredTasks = tasks?.filter(t => t.is_required).length || 0;
    const completedRequiredTasks = tasks?.filter(t => t.is_required && t.is_completed).length || 0;

    return NextResponse.json({
      journeyProgress,
      tasks: tasks || [],
      stats: {
        totalTasks,
        completedTasks,
        requiredTasks,
        completedRequiredTasks,
        completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("[Journey Progress] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

