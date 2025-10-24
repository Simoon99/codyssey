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
    title: 'The Ideator',
    description: 'Playful strategist who helps you brainstorm and validate ideas',
    color: 'from-purple-400 to-pink-600',
    emoji: '✨',
    unlockLevel: 1,
  },
  architect: {
    id: 'architect',
    name: 'Architect',
    title: 'The Planner',
    description: 'Constraints-first expert who designs your tech stack and architecture',
    color: 'from-blue-400 to-cyan-600',
    emoji: '🏗️',
    unlockLevel: 2,
  },
  crafter: {
    id: 'crafter',
    name: 'Crafter',
    title: 'The Designer',
    description: 'UI/UX specialist who refines your interface and brand',
    color: 'from-pink-400 to-rose-600',
    emoji: '🎨',
    unlockLevel: 3,
  },
  hacker: {
    id: 'hacker',
    name: 'Hacker',
    title: 'The Builder',
    description: 'Debugging wizard who unblocks you with focused fixes',
    color: 'from-green-400 to-emerald-600',
    emoji: '⚡',
    unlockLevel: 3,
  },
  hypebeast: {
    id: 'hypebeast',
    name: 'Hypebeast',
    title: 'The Launcher',
    description: 'Launch expert who crafts compelling content and strategies',
    color: 'from-orange-400 to-red-600',
    emoji: '🚀',
    unlockLevel: 4,
  },
  sensei: {
    id: 'sensei',
    name: 'Sensei',
    title: 'The Growth Master',
    description: 'Wise mentor who guides your path to 100+ users',
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

