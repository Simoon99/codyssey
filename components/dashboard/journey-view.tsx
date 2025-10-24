"use client";

import React from "react";
import { Check, Star, Edit2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAllOrbs, getOrbById, getHelperGradient } from "@/lib/journey-mapper";

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
    name: string;
    links?: any;
  };
}

export function JourneyView({ levels, currentXP, onStartLevel, onHelperSelect, user, project }: JourneyViewProps) {
  const [selectedOrbId, setSelectedOrbId] = React.useState<string | null>(null);

  // Load all orbs from journey config
  const allOrbs = getAllOrbs();

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
      {/* Main Journey Content - Full Width with Orbs and Project Card */}
      <div className="relative flex flex-1 flex-row items-start justify-between gap-16 overflow-y-auto px-8 py-12">
        {/* Header Badge */}
        <div className="absolute left-1/2 top-6 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg">
            <span className="text-xl">🎯</span>
            <span className="text-xs font-bold text-zinc-700">Project Journey</span>
          </div>
        </div>

        {/* Orbs Container - Smooth Wave Pattern */}
        <div className="relative z-10 mt-2 ml-48 flex flex-col items-start gap-4">
          {allOrbs.map((orb, index) => {
            const isFirstOrb = index === 0; // First orb is current/active

            // Smooth wave pattern with natural jitter
            const baseWave = Math.sin(index * 0.5) * 80;
            const jitterOffsets = [5, -3, 7, -5, 4, -6, 3, -4, 6, -2, 5, -7, 4, -3, 6];
            const jitter = jitterOffsets[index % jitterOffsets.length];
            const extraOffset = index === 3 ? 35 : 0;
            const waveOffset = Math.round((baseWave + jitter + extraOffset) * 100) / 100;

            return (
              <div key={orb.id} className="relative">
                {/* Orb with Wave positioning - First orb is distinctive */}
                <div className="relative" style={{ marginLeft: `${waveOffset}px` }}>
                  <div
                    className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full shadow-xl transition-all hover:scale-110 ${
                      isFirstOrb
                        ? `bg-gradient-to-br ${orb.helperGradient} scale-105 ring-2 ring-white/50`
                        : orb.bgColor
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrbId(selectedOrbId === orb.id ? null : orb.id);
                    }}
                  >
                    <span className={`text-3xl ${isFirstOrb ? "text-white" : "text-zinc-500"}`}>
                      {isFirstOrb ? "★" : "○"}
                    </span>
                  </div>
                </div>

                {/* Floating Current Level Card - For ANY selected orb */}
                {selectedOrbId === orb.id && (
                  <div
                    className={`absolute left-24 top-0 z-50 w-80 rounded-3xl bg-gradient-to-br ${orb.helperGradient} p-6 shadow-2xl animate-in fade-in slide-in-from-left-4`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrbId(null);
                      }}
                      className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-zinc-600 transition-colors hover:bg-white hover:text-zinc-800"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>

                    {/* Step Title */}
                    <div className="mb-3 flex items-center gap-2">
                      <div className="text-lg">🎯</div>
                      <div>
                        <div className="text-xs font-semibold text-white opacity-90">
                          Level {orb.levelIndex + 1}: {levelTitles[orb.levelIndex]}
                        </div>
                        <div className="text-sm font-bold text-white">
                          {orb.title}
                        </div>
                      </div>
                    </div>

                    {/* CTA and Description */}
                    <div className="mb-4">
                      <p className="text-xs leading-relaxed text-white opacity-95">
                        {orb.cta}
                      </p>
                    </div>

                    {/* Task Count Badge */}
                    <div className="mb-4 flex gap-2">
                      <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                        {orb.requiredTasks.length} required
                      </div>
                      <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
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
                      className="w-full rounded-full bg-white py-3 text-center text-sm font-bold text-zinc-800 shadow-md transition-all hover:scale-105 hover:shadow-lg"
                    >
                      Let's go 🚀
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Project Info Card - Far Right with Static Shadow */}
        <div className="mt-2 ml-auto flex w-96 flex-shrink-0 flex-col gap-6 pr-8">
          {/* User/Project Card - Force White Background */}
          <Card className="border border-zinc-200 bg-white shadow-2xl" style={{ backgroundColor: "#ffffff" }}>
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14 border-2 border-amber-400">
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-xl font-bold text-white">
                      {project?.name?.charAt(0)?.toUpperCase() || "P"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-800">{project?.name || "My Project"}</h3>
                    <p className="text-xs text-zinc-500">@{user?.displayName || "user"}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                      <span>🌎</span>
                      <span>Massachusetts, United States</span>
                    </div>
                  </div>
                </div>
                <button className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100">
                  <Edit2 size={16} />
                </button>
              </div>

              <div className="mb-4">
                <h4 className="mb-1 text-sm font-bold text-zinc-800">About Project</h4>
                <p className="text-sm text-zinc-600">
                  {project?.name || "My First Project"} - Building something amazing with Codyssey
                </p>
              </div>

              <div className="mb-4 grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-zinc-800">{user?.stats.level || 1}</div>
                  <div className="text-xs text-zinc-500">Level</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-zinc-800">{user?.stats.xp || 0}</div>
                  <div className="text-xs text-zinc-500">XP</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-zinc-800">{user?.stats.tasksCompleted || 0}</div>
                  <div className="text-xs text-zinc-500">Tasks Done</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-zinc-800">{user?.stats.totalTasks || 5}</div>
                  <div className="text-xs text-zinc-500">Total</div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-bold text-zinc-800">Project Goal</h4>
                <button className="w-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg">
                  🚀 Launch in 30 days
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Community Card with Static Shadow - Force White Background */}
          <Card className="border border-zinc-200 bg-white shadow-2xl" style={{ backgroundColor: "#ffffff" }}>
            <CardContent className="p-6">
              <p className="mb-4 text-center text-sm text-zinc-600">
                Join our discord to get help from our community
              </p>
              <div className="flex gap-3">
                <button className="flex-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg">
                  Get help
                </button>
                <button className="flex-1 rounded-full bg-gradient-to-r from-zinc-600 to-zinc-700 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg">
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
