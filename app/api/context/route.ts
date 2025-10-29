import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";
import { type HelperContext } from "@/lib/llm/provider";

export const runtime = "edge";

/**
 * GET /api/context - Fetch comprehensive context for helpers
 * Includes: project details, journey progress, completed tasks, and other helper conversations
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");
    const currentHelper = searchParams.get("currentHelper");

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId parameter" },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Dev mode: Use a demo user ID if not authenticated
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch project details
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("owner_id", userId)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Fetch journey progress
    const { data: journey } = await supabase
      .from("journeys")
      .select("current_level, xp, status")
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .single();

    // Fetch all completed tasks with task details
    const { data: completedTasks } = await supabase
      .from("task_progress")
      .select(
        `
        task_id,
        completed_at,
        tasks!inner (
          id,
          title,
          level_id
        )
      `
      )
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .eq("status", "done")
      .order("completed_at", { ascending: true });

    // Count total tasks up to current level
    const currentLevel = journey?.current_level || 1;
    const { count: totalTasksCount } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .lte("level_id", currentLevel);

    // Fetch conversations from other helpers (excluding current one)
    // Limit to reduce token usage - only get last 2 messages per helper
    const { data: otherChats } = await supabase
      .from("helper_chats")
      .select(
        `
        id,
        helper,
        chat_messages (
          role,
          content,
          created_at
        )
      `
      )
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .neq("helper", currentHelper || "none")
      .order("created_at", { ascending: false });

    // Fetch all helper contexts (insights from previous helpers)
    const { data: helperContexts } = await supabase
      .from("helper_context")
      .select("*")
      .eq("project_id", projectId)
      .eq("user_id", userId);

    // Build comprehensive context
    const context: Partial<HelperContext> = {
      projectName: project.name,
      projectDescription: project.description,
      projectTechStack: project.external_links?.techStack,
      projectStage: project.external_links?.stage,
      projectGoal: project.external_links?.goal,
      projectLocation: project.external_links?.location,
      problemStatement: project.external_links?.problemStatement,
      targetAudience: project.external_links?.targetAudience,
      valueProposition: project.external_links?.valueProposition,
    };

    // Add journey progress
    if (journey) {
      context.journeyProgress = {
        currentLevel: journey.current_level,
        xp: journey.xp,
        totalTasks: totalTasksCount || 0,
        completedCount: completedTasks?.length || 0,
      };
    }

    // Add completed tasks
    if (completedTasks && completedTasks.length > 0) {
      context.allCompletedTasks = completedTasks.map((taskProgress: any) => ({
        id: taskProgress.tasks.id,
        title: taskProgress.tasks.title,
        level: taskProgress.tasks.level_id,
        completedAt: taskProgress.completed_at,
      }));
    }

    // Add other helper conversations (last 2 messages from each to save tokens)
    if (otherChats && otherChats.length > 0) {
      context.otherHelperConversations = otherChats
        .filter((chat: any) => chat.chat_messages && chat.chat_messages.length > 0)
        .map((chat: any) => ({
          helper: chat.helper,
          recentMessages: chat.chat_messages
            .sort(
              (a: any, b: any) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
            .slice(0, 2) // Reduced from 5 to 2 for token optimization
            .reverse()
            .map((msg: any) => ({
              role: msg.role,
              content: msg.content,
            })),
        }));
    }

    // Add helper context data (structured insights from each helper)
    if (helperContexts && helperContexts.length > 0) {
      context.helperInsights = helperContexts.map((hc: any) => ({
        helper: hc.helper,
        summary: hc.context_summary,
        keyInsights: hc.key_insights || [],
        decisionsMade: hc.decisions_made || [],
        artifactsCreated: hc.artifacts_created || [],
        // Include helper-specific data
        museValidation: hc.muse_validation,
        architectBlueprint: hc.architect_blueprint,
        crafterDesign: hc.crafter_design,
        hackerPrompts: hc.hacker_prompts,
        hypebeastLaunch: hc.hypebeast_launch,
        senseiGrowth: hc.sensei_growth,
      }));
    }

    return NextResponse.json({ context });
  } catch (error) {
    console.error("Context API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

