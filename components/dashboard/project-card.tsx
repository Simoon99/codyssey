"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, MapPin, Rocket } from "lucide-react";
import { ProjectContextPanel } from "./project-context-panel";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    goal?: string;
    location?: string;
  };
  user: {
    displayName: string;
    stats: {
      level: number;
      xp: number;
      tasksCompleted: number;
      totalTasks: number;
    };
  };
  onUpdate?: (updatedProject: any) => void;
}

export function ProjectCard({ project, user, onUpdate }: ProjectCardProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const getInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleSave = (updatedProject: any) => {
    if (onUpdate) {
      onUpdate(updatedProject);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          {/* Header with Avatar and Edit Button */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Project Avatar */}
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-3xl font-bold text-white shadow-lg">
                {getInitials(project.name)}
              </div>

              <div className="flex-1 min-w-0">
                {/* Project Name */}
                <h2 className="mb-1 text-2xl font-bold text-zinc-900">
                  {project.name}
                </h2>

                {/* Username */}
                <p className="mb-2 text-sm text-zinc-500">
                  @{user.displayName.toLowerCase().replace(" ", "")}
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <MapPin size={14} className="text-blue-500" />
                  <span>{project.location || "Not set"}</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsPanelOpen(true)}
              className="h-8 w-8 text-zinc-400 hover:text-zinc-600"
              title="Edit project context"
            >
              <Edit2 size={18} />
            </Button>
          </div>

          {/* About Project */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-zinc-700">
              About Project
            </h3>
            <p className="text-sm leading-relaxed text-zinc-600">
              {project.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-6 grid grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-zinc-900">{user.stats.level}</p>
              <p className="text-xs text-zinc-500">Level</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-zinc-900">{user.stats.xp}</p>
              <p className="text-xs text-zinc-500">XP</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-zinc-900">
                {user.stats.tasksCompleted}
              </p>
              <p className="text-xs text-zinc-500">Tasks Done</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-zinc-900">
                {user.stats.totalTasks}
              </p>
              <p className="text-xs text-zinc-500">Total</p>
            </div>
          </div>

          {/* Project Goal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-700">
              Project Goal
            </h3>
            <div className="flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 shadow-md">
              <Rocket size={20} className="text-white" />
              <span className="text-lg font-semibold text-white">
                {project.goal || "Set your goal"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Context Edit Panel */}
      <ProjectContextPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        project={project}
        onSave={handleSave}
      />
    </>
  );
}
