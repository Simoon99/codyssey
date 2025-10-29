import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";
import { getOrbById } from "@/lib/journey-mapper";

/**
 * POST /api/journey/initialize
 * Initialize a journey step with tasks for a specific helper
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, helper, levelId } = body;

    if (!projectId || !helper || !levelId) {
      return NextResponse.json(
        { error: "Missing required fields: projectId, helper, levelId" },
        { status: 400 }
      );
    }

    // Get orb/step data from journey config
    const orbData = getOrbById(levelId);
    if (!orbData) {
      return NextResponse.json(
        { error: "Invalid level ID" },
        { status: 400 }
      );
    }

    // Create or update journey progress (supports multiple concurrent helper levels)
    // Note: We don't deactivate other helpers - multiple can be active simultaneously
    const { data: journeyProgress, error: journeyError } = await supabase
      .from("journey_progress")
      .upsert({
        user_id: userId,
        project_id: projectId,
        current_level_id: levelId,
        helper,
        is_active: true,
        started_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,project_id,current_level_id,helper'
      })
      .select()
      .single();

    if (journeyError) {
      console.error("[Journey Initialize] Error creating journey progress:", journeyError);
      return NextResponse.json(
        { error: "Failed to initialize journey" },
        { status: 500 }
      );
    }

    // Get task definitions from journey config
    const tasks = orbData.tasks || [];
    const requiredTasks = orbData.requiredTasks || [];

    // Create task records for this level
    const taskRecords = tasks.map((taskId: string) => ({
      user_id: userId,
      project_id: projectId,
      helper,
      level_id: levelId,
      task_id: taskId,
      task_title: formatTaskTitle(taskId),
      task_goal: getTaskGoal(taskId),
      is_required: requiredTasks.includes(taskId),
      is_completed: false,
      xp_reward: 10,
    }));

    const { data: createdTasks, error: tasksError } = await supabase
      .from("helper_level_tasks")
      .upsert(taskRecords, {
        onConflict: 'user_id,project_id,helper,level_id,task_id',
        ignoreDuplicates: false
      })
      .select();

    if (tasksError) {
      console.error("[Journey Initialize] Error creating tasks:", tasksError);
      return NextResponse.json(
        { error: "Failed to create tasks" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      journeyProgress,
      tasks: createdTasks,
    });
  } catch (error) {
    console.error("[Journey Initialize] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Format task ID into human-readable title
 */
function formatTaskTitle(taskId: string): string {
  return taskId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get task goal/description based on task ID
 */
function getTaskGoal(taskId: string): string {
  const taskGoals: Record<string, string> = {
    // Muse - Idea Discovery
    "define-problem": "Clearly define the problem you're solving",
    "identify-target-users": "Identify who will use your product",
    "lock-mvp-scope": "Lock down your MVP features (3-5 core features)",
    "create-project-brief": "Create a comprehensive project brief",
    
    // Architect - Structure & Plan
    "choose-tech-stack": "Select your frontend, backend, and database",
    "design-data-model": "Design your database schema and relationships",
    "create-structural-prompts": "Generate structural prompts for your build",
    "break-into-build-tasks": "Break project into modular build tasks",
    
    // Crafter - Visual Direction
    "design-component-structure": "Design your component hierarchy and structure",
    "create-ui-prompt-templates": "Create reusable UI prompt templates",
    "master-ai-ui-tools": "Master v0, Lovable, and other AI UI tools",
    "define-design-system": "Define colors, typography, and components",
    
    // Hacker - Build Execution
    "master-cao-structure": "Master Context-Action-Outcome prompt structure",
    "create-prompt-macros": "Create reusable prompt macros for efficiency",
    "design-prompt-chains": "Design prompt chains for complex tasks",
    "choose-ai-tools": "Choose the right AI tools (Cursor, Claude, etc.)",
    
    // Hypebeast - Launch & Story
    "create-landing-copy-prompts": "Create prompts for landing page copy",
    "write-launch-story": "Write your viral launch story",
    "build-social-content": "Build social media content prompts",
    "plan-launch-strategy": "Plan your ProductHunt/Twitter launch",
    
    // Sensei - Review & Improve
    "reflect-on-project": "Reflect on your project journey",
    "analyze-what-worked": "Analyze what worked and what didn't",
    "build-personal-playbook": "Build your personal vibecoding playbook",
    "plan-next-project": "Plan your next project with insights",
  };

  return taskGoals[taskId] || "Complete this task to progress";
}

