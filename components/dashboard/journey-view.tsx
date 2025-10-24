"use client";

import React from "react";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllOrbs } from "@/lib/journey-mapper";
import { ProjectCard } from "./project-card";

interface Level {
  id: number;
  title: string;
  description: string;
  xpRequired: number;
  unlocked: boolean;
  completed: boolean;
  current: boolean;
}

interface JourneyViewProps {
  levels: Level[];
  currentXP: number;
  onStartLevel: (levelId: number) => void;
  onHelperSelect?: (helper: string, stepContext?: {
    orbId: string;
    stepIndex: number;
    levelIndex: number;
    tasks: string[];
    requiredTasks: string[];
    firstMessage: string;
    cta: string;
  }) => void;
  user?: {
    displayName: string;
    avatarUrl?: string;
    about?: string;
    stats: {
      level: number;
      xp: number;
      xpToNextLevel: number;
      tasksCompleted: number;
      totalTasks: number;
    };
  };
  project?: {
    id: string;
    name: string;
    description: string;
    goal?: string;
    location?: string;
    links?: any;
  };
  tasks?: Array<{
    id: string;
    title: string;
    description: string;
    xp_reward: number;
    required: boolean;
    status: "todo" | "in_progress" | "done";
  }>;
  activeOrbId?: string | null;
}

export function JourneyView({ levels, currentXP, onStartLevel, onHelperSelect, user, project, tasks = [], activeOrbId }: JourneyViewProps) {
  const [selectedOrbId, setSelectedOrbId] = React.useState<string | null>(null);

  // Load all orbs from journey config
  const allOrbs = getAllOrbs();

  // Helper function to check if an orb's tasks are all completed
  const isOrbCompleted = (orb: any): boolean => {
    if (!orb.tasks || orb.tasks.length === 0) return false;
    return orb.tasks.every((taskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      return task?.status === 'done';
    });
  };

  // Helper function to get orb icon based on state
  const getOrbIcon = (isFirstOrb: boolean, isCompleted: boolean, isOrbActive: boolean): string => {
    if (isCompleted) {
      return "✓";
    }
    if (isFirstOrb || isOrbActive) {
      return "★";
    }
    return "○";
  };

  // Helper-specific gradient colors
  const helperGradients: Record<string, string> = {
    muse: "from-purple-400 via-pink-500 to-rose-500",
    architect: "from-blue-400 via-cyan-500 to-teal-500",
    crafter: "from-pink-400 via-rose-500 to-red-500",
    hacker: "from-green-400 via-emerald-500 to-teal-500",
    hypebeast: "from-orange-400 via-red-500 to-pink-500",
    sensei: "from-amber-400 via-yellow-500 to-orange-500",
  };

  // Close card when clicking anywhere
  React.useEffect(() => {
    const handleClickOutside = () => setSelectedOrbId(null);
    if (selectedOrbId) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [selectedOrbId]);

  // Find which level we're on
  const currentLevelIndex = levels.findIndex((l) => l.current) !== -1 ? levels.findIndex((l) => l.current) : 0;

  // Level titles from props or defaults
  const levelTitles = levels.map((l) => l.title) || [
    "Spark",
    "Build Prep",
    "Core Build",
    "Launch",
    "Grow",
  ];

  return (
    <div className="flex h-full overflow-hidden bg-gradient-to-b from-amber-50 to-pink-50">
      {/* Main Journey Content - Responsive Layout */}
      <div className="relative flex w-full flex-col items-center justify-start gap-4 overflow-y-auto py-6 md:flex-row md:items-start md:justify-between md:gap-16 md:px-8 md:py-12">
        {/* Header Badge */}
        <div className="absolute left-1/2 top-2 z-20 -translate-x-1/2 md:top-6">
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-lg md:px-4 md:py-2">
            <span className="text-lg md:text-xl">🎯</span>
            <span className="text-xs font-bold text-zinc-700">Project Journey</span>
          </div>
        </div>

        {/* Orbs Container - Responsive */}
        <div className="relative z-10 mt-16 flex w-full flex-col items-center gap-2 md:mt-2 md:ml-48 md:w-auto md:items-start md:gap-4">
          {allOrbs.map((orb, index) => {
            const isFirstOrb = index === 0; // First orb is current/active

            // Wave pattern with natural jitter - SAME FOR BOTH MOBILE AND DESKTOP
            const baseWave = Math.sin(index * 0.5) * 80;
            const jitterOffsets = [5, -3, 7, -5, 4, -6, 3, -4, 6, -2, 5, -7, 4, -3, 6];
            const jitter = jitterOffsets[index % jitterOffsets.length];
            const extraOffset = index === 3 ? 35 : 0;
            const waveOffset = Math.round((baseWave + jitter + extraOffset) * 100) / 100;

            // Mobile uses smaller offset (40px instead of 80px for wave)
            const mobileWaveOffset = Math.round((Math.sin(index * 0.5) * 40 + jitter) * 100) / 100;

            return (
              <div key={orb.id} className="relative">
                {/* Orb with Wave positioning - Desktop version */}
                <div 
                  className="relative hidden md:block" 
                  style={{ marginLeft: `${waveOffset}px` }}
                >
                  {(() => {
                    const orbCompleted = isOrbCompleted(orb);
                    const isOrbActive = activeOrbId === orb.id;
                    const shouldShowHelperColor = isFirstOrb || isOrbActive || orbCompleted;
                    
                    return (
                      <div
                        className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full shadow-xl transition-all hover:scale-110 ${
                          shouldShowHelperColor
                            ? `bg-gradient-to-br ${orb.helperGradient} scale-105 ring-2 ring-white/50`
                            : orb.bgColor
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrbId(selectedOrbId === orb.id ? null : orb.id);
                        }}
                      >
                        <span className={`text-3xl ${shouldShowHelperColor ? "text-white" : "text-zinc-500"}`}>
                          {getOrbIcon(isFirstOrb, orbCompleted, isOrbActive)}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Mobile Orb - Wave pattern same as desktop but with smaller offset */}
                <div 
                  className="relative md:hidden" 
                  style={{ marginLeft: `${mobileWaveOffset}px` }}
                >
                  {(() => {
                    const orbCompleted = isOrbCompleted(orb);
                    const isOrbActive = activeOrbId === orb.id;
                    const shouldShowHelperColor = isFirstOrb || isOrbActive || orbCompleted;
                    
                    return (
                      <div
                        className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full shadow-lg transition-all active:scale-95 hover:scale-110 ${
                          shouldShowHelperColor
                            ? `bg-gradient-to-br ${orb.helperGradient} scale-105 ring-2 ring-white/50`
                            : orb.bgColor
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrbId(selectedOrbId === orb.id ? null : orb.id);
                        }}
                      >
                        <span className={`text-2xl ${shouldShowHelperColor ? "text-white" : "text-zinc-500"}`}>
                          {getOrbIcon(isFirstOrb, orbCompleted, isOrbActive)}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Floating Current Level Card - For ANY selected orb (Mobile optimized) */}
                {selectedOrbId === orb.id && (
                  <div
                    className={`fixed md:absolute left-1/2 top-1/2 md:top-0 md:left-24 z-50 w-[calc(100%-2rem)] max-w-sm md:w-80 -translate-x-1/2 md:-translate-x-1/2 -translate-y-1/2 md:translate-y-0 md:translate-x-0 rounded-2xl bg-gradient-to-br ${orb.helperGradient} p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 md:rounded-3xl md:p-6 md:w-80`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrbId(null);
                      }}
                      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-zinc-600 transition-colors hover:bg-white hover:text-zinc-800 md:right-3 md:top-3"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>

                    {/* Step Title */}
                    <div className="mb-3 flex items-start gap-2 pr-6 md:mb-4">
                      <div className="text-base md:text-lg">🎯</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white opacity-90 truncate">
                          Level {orb.levelIndex + 1}: {levelTitles[orb.levelIndex]}
                        </div>
                        <div className="text-sm font-bold text-white break-words">
                          {orb.title}
                        </div>
                      </div>
                    </div>

                    {/* Task Count Badge */}
                    <div className="mb-3 flex flex-wrap gap-2 md:mb-4">
                      <div className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
                        {orb.requiredTasks.length} required
                      </div>
                      <div className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
                        {orb.tasks.length - orb.requiredTasks.length} optional
                      </div>
                    </div>

                    {/* START Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onHelperSelect) {
                          onHelperSelect(orb.helper, {
                            orbId: orb.id,
                            stepIndex: orb.stepIndex,
                            levelIndex: orb.levelIndex,
                            tasks: orb.tasks,
                            requiredTasks: orb.requiredTasks,
                            firstMessage: orb.firstMessage,
                            cta: orb.cta,
                          });
                        }
                      }}
                      className="w-full rounded-full bg-white py-2 text-center text-sm font-bold text-zinc-800 shadow-md transition-all hover:scale-105 hover:shadow-lg md:py-3"
                    >
                      Let's go 🚀
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Project Info Card - Responsive */}
        <div className="mt-2 flex w-full flex-col gap-4 md:ml-auto md:w-96 md:flex-shrink-0 md:gap-6 md:pr-8">
          {/* User/Project Card with Edit Panel */}
          {project && user && (
            <ProjectCard
              project={{
                id: project.id,
                name: project.name,
                description: project.description,
                goal: project.goal,
                location: project.location,
              }}
              user={{
                displayName: user.displayName,
                stats: {
                  level: user.stats.level,
                  xp: user.stats.xp,
                  tasksCompleted: user.stats.tasksCompleted,
                  totalTasks: user.stats.totalTasks,
                },
              }}
              onUpdate={(updatedProject) => {
                console.log("Project updated:", updatedProject);
                // You can add project update logic here if needed
              }}
            />
          )}

          {/* Community Card with Static Shadow - Force White Background */}
          <Card className="border border-zinc-200 bg-white shadow-2xl" style={{ backgroundColor: "#ffffff" }}>
            <CardContent className="p-4 md:p-6">
              <p className="mb-3 text-center text-xs text-zinc-600 md:mb-4 md:text-sm">
                Join our discord to get help from our community
              </p>
              <div className="flex flex-col gap-2 md:flex-row md:gap-3">
                <button className="flex-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg md:px-4 md:py-2.5 md:text-sm">
                  Get help
                </button>
                <button className="flex-1 rounded-full bg-gradient-to-r from-zinc-600 to-zinc-700 px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg md:px-4 md:py-2.5 md:text-sm">
                  Join our discord
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
