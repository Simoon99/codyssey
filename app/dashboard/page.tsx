import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default async function DashboardPage() {
  // Demo data - no auth required
  const userData = {
    displayName: "Builder",
    avatarUrl: undefined,
    about: "Building amazing projects with Codyssey",
    stats: {
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      tasksCompleted: 0,
      totalTasks: 15,
    },
  };

  // Demo project
  const projectData = {
    id: "demo-1",
    name: "My First Project",
    links: {},
  };

  // Demo levels
  const levels = [
    {
      id: 1,
      title: "Spark",
      description: "Ignite your idea",
      xpRequired: 0,
      unlocked: true,
      completed: false,
      current: true,
    },
    {
      id: 2,
      title: "Build Prep",
      description: "Prepare your foundation",
      xpRequired: 100,
      unlocked: true,
      completed: false,
      current: false,
    },
    {
      id: 3,
      title: "Core Build",
      description: "Create your MVP",
      xpRequired: 250,
      unlocked: true,
      completed: false,
      current: false,
    },
    {
      id: 4,
      title: "Launch",
      description: "Ship to the world",
      xpRequired: 500,
      unlocked: true,
      completed: false,
      current: false,
    },
    {
      id: 5,
      title: "Grow",
      description: "Scale and iterate",
      xpRequired: 1000,
      unlocked: true,
      completed: false,
      current: false,
    },
  ];

  // Demo tasks
  const tasks = [
    {
      id: "1",
      title: "Define Your Vision",
      description: "Clarify what problem you're solving",
      xp_reward: 50,
      required: true,
      status: "todo" as const,
    },
    {
      id: "2",
      title: "Identify Your Audience",
      description: "Who are you building for?",
      xp_reward: 50,
      required: true,
      status: "todo" as const,
    },
    {
      id: "3",
      title: "Sketch Your Idea",
      description: "Visual mockup or wireframe",
      xp_reward: 30,
      required: false,
      status: "todo" as const,
    },
  ];

  return <DashboardLayout user={userData} project={projectData} levels={levels} tasks={tasks} />;
}

