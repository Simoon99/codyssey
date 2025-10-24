import journeyConfig from "@/lib/journey-config.json";

export interface OrbData {
  id: string;
  levelIndex: number;
  stepIndex: number;
  helper: string;
  title: string;
  cta: string;
  firstMessage: string;
  tasks: string[];
  requiredTasks: string[];
  bgColor: string;
  helperGradient: string;
}

export interface StepData {
  id: string;
  helper: string;
  title: string;
  cta: string;
  firstMessage: string;
  tasks: string[];
  requiredTasks: string[];
}

export interface LevelData {
  id: number;
  key: string;
  title: string;
  description: string;
  icon: string;
  steps: StepData[];
  definitionOfDone: string;
}

const helperGradients: Record<string, string> = {
  muse: "from-purple-400 via-pink-500 to-rose-500",
  architect: "from-blue-400 via-cyan-500 to-teal-500",
  crafter: "from-pink-400 via-rose-500 to-red-500",
  hacker: "from-green-400 via-emerald-500 to-teal-500",
  hypebeast: "from-orange-400 via-red-500 to-pink-500",
  sensei: "from-amber-400 via-yellow-500 to-orange-500",
};

/**
 * Get all orbs for the journey view
 */
export function getAllOrbs(): OrbData[] {
  const orbs: OrbData[] = [];
  const levels = journeyConfig.journey.levels;

  levels.forEach((level, levelIndex) => {
    level.steps.forEach((step, stepIndex) => {
      const orbId = `L${level.id}S${stepIndex + 1}`;
      orbs.push({
        id: orbId,
        levelIndex,
        stepIndex,
        helper: step.helper,
        title: step.title,
        cta: step.cta,
        firstMessage: step.firstMessage,
        tasks: step.tasks,
        requiredTasks: step.requiredTasks,
        bgColor: "bg-zinc-300", // Default, will be colorized on select
        helperGradient: helperGradients[step.helper] || "from-gray-400 to-gray-500",
      });
    });
  });

  return orbs;
}

/**
 * Get orb data by ID
 */
export function getOrbById(orbId: string): OrbData | undefined {
  return getAllOrbs().find((orb) => orb.id === orbId);
}

/**
 * Get step data by level and step index
 */
export function getStepData(
  levelIndex: number,
  stepIndex: number
): StepData | undefined {
  const levels = journeyConfig.journey.levels;
  if (levelIndex < 0 || levelIndex >= levels.length) return undefined;

  const level = levels[levelIndex];
  if (stepIndex < 0 || stepIndex >= level.steps.length) return undefined;

  return level.steps[stepIndex];
}

/**
 * Get all levels in journey order
 */
export function getAllLevels(): LevelData[] {
  return journeyConfig.journey.levels.map((level) => ({
    id: level.id,
    key: level.key,
    title: level.title,
    description: level.description,
    icon: level.icon,
    steps: level.steps.map((step) => ({
      id: step.id,
      helper: step.helper,
      title: step.title,
      cta: step.cta,
      firstMessage: step.firstMessage,
      tasks: step.tasks,
      requiredTasks: step.requiredTasks,
    })),
    definitionOfDone: level.definitionOfDone,
  }));
}

/**
 * Get all tasks for a step
 */
export function getStepTasks(orbId: string): string[] {
  const orb = getOrbById(orbId);
  return orb?.tasks || [];
}

/**
 * Get required tasks for a step
 */
export function getRequiredTasks(orbId: string): string[] {
  const orb = getOrbById(orbId);
  return orb?.requiredTasks || [];
}

/**
 * Get first message for a step (to populate helper chat)
 */
export function getFirstMessage(orbId: string): string {
  const orb = getOrbById(orbId);
  return orb?.firstMessage || "";
}

/**
 * Get helper for a step
 */
export function getHelper(orbId: string): string {
  const orb = getOrbById(orbId);
  return orb?.helper || "";
}

/**
 * Get CTA text for a step
 */
export function getStepCTA(orbId: string): string {
  const orb = getOrbById(orbId);
  return orb?.cta || "";
}

/**
 * Get helper gradient color
 */
export function getHelperGradient(helper: string): string {
  return helperGradients[helper] || "from-gray-400 to-gray-500";
}

/**
 * Get helper metadata
 */
export function getHelperMetadata(helper: string) {
  return journeyConfig.helpers[helper as keyof typeof journeyConfig.helpers];
}

/**
 * Get all helpers
 */
export function getAllHelpers() {
  return journeyConfig.helpers;
}

/**
 * Get XP reward for a task slug (helper function for future integration)
 */
export function getTaskXPReward(taskSlug: string): number {
  // This would need to be integrated with the database
  // For now, return a default
  return 20;
}
