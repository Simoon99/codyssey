import { createClient } from "@/lib/supabase/server";

interface LevelState {
  currentLevel: number;
  xp: number;
  xpToNextLevel: number;
  tasksCompleted: number;
  totalTasks: number;
  unlockedHelpers: string[];
}

/**
 * Get the current level state for a user's journey
 */
export async function getLevelState(
  userId: string,
  projectId: string
): Promise<LevelState | null> {
  const supabase = await createClient();

  // Get journey
  const { data: journey } = await supabase
    .from("journeys")
    .select("current_level, xp")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .single();

  if (!journey) return null;

  // Get current level details
  const { data: level } = await supabase
    .from("levels")
    .select("xp_required, unlocks")
    .eq("id", journey.current_level)
    .single();

  // Get next level XP requirement
  const { data: nextLevel } = await supabase
    .from("levels")
    .select("xp_required")
    .eq("id", journey.current_level + 1)
    .single();

  // Count completed tasks
  const { count: completedCount } = await supabase
    .from("task_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .eq("status", "done");

  // Count total tasks up to current level
  const { count: totalCount } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .lte("level_id", journey.current_level);

  return {
    currentLevel: journey.current_level,
    xp: journey.xp,
    xpToNextLevel: nextLevel?.xp_required || 1000,
    tasksCompleted: completedCount || 0,
    totalTasks: totalCount || 0,
    unlockedHelpers: level?.unlocks?.helpers || [],
  };
}

/**
 * Complete a task and award XP
 */
export async function completeTask(
  userId: string,
  projectId: string,
  taskId: string
): Promise<{ success: boolean; xpAwarded: number; leveledUp: boolean }> {
  const supabase = await createClient();

  // Get task details
  const { data: task } = await supabase
    .from("tasks")
    .select("xp_reward, level_id")
    .eq("id", taskId)
    .single();

  if (!task) {
    return { success: false, xpAwarded: 0, leveledUp: false };
  }

  // Update task progress
  const { error: progressError } = await supabase
    .from("task_progress")
    .upsert({
      user_id: userId,
      project_id: projectId,
      task_id: taskId,
      status: "done",
      completed_at: new Date().toISOString(),
    });

  if (progressError) {
    console.error("Error updating task progress:", progressError);
    return { success: false, xpAwarded: 0, leveledUp: false };
  }

  // Get current journey
  const { data: journey } = await supabase
    .from("journeys")
    .select("xp, current_level")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .single();

  if (!journey) {
    return { success: true, xpAwarded: task.xp_reward, leveledUp: false };
  }

  const newXP = journey.xp + task.xp_reward;

  // Update journey XP
  await supabase
    .from("journeys")
    .update({ xp: newXP })
    .eq("user_id", userId)
    .eq("project_id", projectId);

  // Update profile total XP
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp_total")
    .eq("id", userId)
    .single();

  if (profile) {
    await supabase
      .from("profiles")
      .update({ xp_total: profile.xp_total + task.xp_reward })
      .eq("id", userId);
  }

  // Check if leveled up
  const leveledUp = await checkAndApplyLevelUp(userId, projectId);

  // Log event
  await supabase.from("events").insert({
    user_id: userId,
    project_id: projectId,
    name: "task_completed",
    data: {
      task_id: taskId,
      xp_awarded: task.xp_reward,
      leveled_up: leveledUp,
    },
  });

  return { success: true, xpAwarded: task.xp_reward, leveledUp };
}

/**
 * Check if user should level up and apply it
 * Note: Levels are not XP-gated; users progress by completing required tasks
 */
async function checkAndApplyLevelUp(
  userId: string,
  projectId: string
): Promise<boolean> {
  const supabase = await createClient();

  // Get current journey
  const { data: journey } = await supabase
    .from("journeys")
    .select("xp, current_level")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .single();

  if (!journey || journey.current_level >= 5) return false;

  // Check required tasks for current level
  const { data: requiredTasks } = await supabase
    .from("tasks")
    .select("id")
    .eq("level_id", journey.current_level)
    .eq("required", true);

  if (!requiredTasks || requiredTasks.length === 0) return false;

  // Check if all required tasks are completed
  const { data: completedTasks } = await supabase
    .from("task_progress")
    .select("task_id")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .eq("status", "done")
    .in(
      "task_id",
      requiredTasks.map((t) => t.id)
    );

  const allRequiredCompleted =
    completedTasks && completedTasks.length === requiredTasks.length;

  // Level up when all required tasks completed (no XP gating)
  if (!allRequiredCompleted) return false;

  // Level up!
  await supabase
    .from("journeys")
    .update({
      current_level: journey.current_level + 1,
      xp: 0, // Reset XP for next level
    })
    .eq("user_id", userId)
    .eq("project_id", projectId);

  // Update profile current level
  await supabase
    .from("profiles")
    .update({ current_level: journey.current_level + 1 })
    .eq("id", userId);

  return true;
}

/**
 * Initialize a new journey for a project
 */
export async function initializeJourney(
  userId: string,
  projectId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.from("journeys").insert({
    user_id: userId,
    project_id: projectId,
    current_level: 1,
    xp: 0,
    status: "active",
  });

  if (error) {
    console.error("Error initializing journey:", error);
    return false;
  }

  return true;
}

