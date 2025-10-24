import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getLevelState } from "@/lib/levels/progression";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get or create active project
  let { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  let currentProject = projects?.[0];

  // Create demo project if none exists
  if (!currentProject) {
    const { data: newProject } = await supabase
      .from("projects")
      .insert({
        owner_id: user.id,
        name: "My First Project",
        description: "Building something amazing!",
        external_links: {},
      })
      .select()
      .single();

    currentProject = newProject;

    // Initialize journey
    if (currentProject) {
      await supabase.from("journeys").insert({
        user_id: user.id,
        project_id: currentProject.id,
        current_level: 1,
        xp: 0,
        status: "active",
      });
    }
  }

  // Get level state
  const levelState = currentProject
    ? await getLevelState(user.id, currentProject.id)
    : null;

  const currentLevel = levelState?.currentLevel || 1;

  // Get all levels
  const { data: allLevels } = await supabase
    .from("levels")
    .select("*")
    .order("id", { ascending: true });

  const levels = (allLevels || []).map((level) => ({
    id: level.id,
    title: level.title,
    description: level.description || "",
    xpRequired: level.xp_required,
    unlocked: level.id <= currentLevel,
    completed: level.id < currentLevel,
    current: level.id === currentLevel,
  }));

  // Get tasks for current level
  const { data: levelTasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("level_id", currentLevel)
    .order("order_index", { ascending: true });

  // Get task progress
  const { data: taskProgress } = currentProject
    ? await supabase
        .from("task_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("project_id", currentProject.id)
    : { data: [] };

  const progressMap = new Map(
    (taskProgress || []).map((p) => [p.task_id, p.status])
  );

  const tasks = (levelTasks || []).map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description || "",
    xp_reward: task.xp_reward,
    required: task.required,
    status: (progressMap.get(task.id) as "todo" | "in_progress" | "done") || "todo",
  }));

  const userData = {
    displayName: profile?.display_name || user.email?.split("@")[0] || "User",
    avatarUrl: profile?.avatar_url,
    about: "Building amazing projects with Codyssey",
    stats: {
      level: levelState?.currentLevel || 1,
      xp: levelState?.xp || 0,
      xpToNextLevel: levelState?.xpToNextLevel || 100,
      tasksCompleted: levelState?.tasksCompleted || 0,
      totalTasks: levelState?.totalTasks || 5,
    },
  };

  const projectData = currentProject
    ? {
        id: currentProject.id,
        name: currentProject.name,
        links: currentProject.external_links || {},
      }
    : undefined;

  return <DashboardLayout user={userData} project={projectData} levels={levels} tasks={tasks} />;
}

