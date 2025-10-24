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

  // Demo tasks - using slugs that match journey-config.json
  const tasks = [
    // Level 1 - Spark: Problem & Market Scan (S1)
    {
      id: "define-problem",
      title: "Define the Problem",
      description: "Clearly articulate the problem you're solving",
      xp_reward: 50,
      required: true,
      status: "todo" as const,
    },
    {
      id: "research-competition",
      title: "Research Competition",
      description: "Analyze your top 3 competitors",
      xp_reward: 50,
      required: true,
      status: "todo" as const,
    },
    {
      id: "identify-target-audience",
      title: "Identify Target Audience",
      description: "Define who your users are",
      xp_reward: 30,
      required: false,
      status: "todo" as const,
    },
    {
      id: "market-size-analysis",
      title: "Market Size Analysis",
      description: "Estimate your addressable market",
      xp_reward: 30,
      required: false,
      status: "todo" as const,
    },
    // Level 1 - Spark: Hypotheses & Validation (S2)
    {
      id: "brainstorm-solutions",
      title: "Brainstorm Solutions",
      description: "Create 3+ solution hypotheses",
      xp_reward: 50,
      required: true,
      status: "todo" as const,
    },
    {
      id: "validate-idea",
      title: "Validate with Users",
      description: "Interview 5+ users to test assumptions",
      xp_reward: 50,
      required: true,
      status: "todo" as const,
    },
    {
      id: "user-interview-analysis",
      title: "Analyze Interview Notes",
      description: "Extract insights and patterns",
      xp_reward: 30,
      required: false,
      status: "todo" as const,
    },
    {
      id: "create-value-hypothesis",
      title: "Create Value Hypothesis",
      description: "Write your value proposition",
      xp_reward: 30,
      required: false,
      status: "todo" as const,
    },
    // Level 1 - Spark: MVP Scope (S3)
    {
      id: "define-mvp-scope",
      title: "Define MVP Scope",
      description: "Lock in 3-5 core features",
      xp_reward: 50,
      required: true,
      status: "todo" as const,
    },
    {
      id: "create-user-stories",
      title: "Create User Stories",
      description: "Write user-centric feature descriptions",
      xp_reward: 30,
      required: false,
      status: "todo" as const,
    },
    {
      id: "design-success-metrics",
      title: "Design Success Metrics",
      description: "Define how you'll measure success",
      xp_reward: 30,
      required: false,
      status: "todo" as const,
    },
  ];

  return <DashboardLayout user={userData} project={projectData} levels={levels} tasks={tasks} />;
}

