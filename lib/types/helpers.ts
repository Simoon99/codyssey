/**
 * Helper persona types and configurations
 */

export type HelperType = 'muse' | 'architect' | 'crafter' | 'hacker' | 'hypebeast' | 'sensei';

export interface Helper {
  id: HelperType;
  name: string;
  title: string;
  description: string;
  color: string;
  emoji: string;
  unlockLevel: number;
}

export const HELPERS: Record<HelperType, Helper> = {
  muse: {
    id: 'muse',
    name: 'Muse',
    title: 'From Idea Chaos to Clarity',
    description: 'Turns vague sparks into clear, buildable ideas with prompt-ready project briefs',
    color: 'from-purple-400 to-pink-600',
    emoji: '🪄',
    unlockLevel: 1,
  },
  architect: {
    id: 'architect',
    name: 'Architect',
    title: 'From Idea to Blueprint',
    description: 'Helps you describe what to build with structural prompts and modular task breakdowns',
    color: 'from-blue-400 to-cyan-600',
    emoji: '🧱',
    unlockLevel: 2,
  },
  crafter: {
    id: 'crafter',
    name: 'Crafter',
    title: 'UI Prompt Optimizer',
    description: 'Teaches elite-level UI prompts with templates and aesthetic mastery for any tool',
    color: 'from-pink-400 to-rose-600',
    emoji: '🎨',
    unlockLevel: 3,
  },
  hacker: {
    id: 'hacker',
    name: 'Hacker',
    title: 'Prompt Engineer\'s Companion',
    description: 'Makes you 10x faster with optimized build prompts, macros, and prompt chaining',
    color: 'from-green-400 to-emerald-600',
    emoji: '⚙️',
    unlockLevel: 3,
  },
  hypebeast: {
    id: 'hypebeast',
    name: 'Hypebeast',
    title: 'The Marketing Prompt Coach',
    description: 'Writes prompts that turn your builds into marketable products and viral stories',
    color: 'from-orange-400 to-red-600',
    emoji: '📢',
    unlockLevel: 4,
  },
  sensei: {
    id: 'sensei',
    name: 'Sensei',
    title: 'Growth and Learning Mentor',
    description: 'Helps you reflect, improve prompts, and upgrade your vibecoding skills after each project',
    color: 'from-amber-400 to-yellow-600',
    emoji: '🧘',
    unlockLevel: 5,
  },
};

export function getHelperById(id: HelperType): Helper {
  return HELPERS[id];
}

export function getUnlockedHelpers(currentLevel: number): Helper[] {
  return Object.values(HELPERS).filter(
    (helper) => helper.unlockLevel <= currentLevel
  );
}

