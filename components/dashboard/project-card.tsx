"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, MapPin, Rocket } from "lucide-react";
import { ProjectEditModal } from "./project-edit-modal";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    goal?: string;
    location?: string;
    type?: string;
    stage?: string;
    techStack?: string[];
    targetAudience?: string;
    keyFeatures?: string[];
    links?: {
      github?: string;
      demo?: string;
      figma?: string;
      notion?: string;
    };
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(project);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProject = localStorage.getItem("codyssey_project");
    if (savedProject) {
      try {
        const parsed = JSON.parse(savedProject);
        setCurrentProject(parsed);
      } catch (e) {
        console.error("Failed to parse saved project:", e);
      }
    }
  }, []);

  const handleProjectUpdate = (updatedProject: any) => {
    setCurrentProject(updatedProject);
    localStorage.setItem("codyssey_project", JSON.stringify(updatedProject));
    if (onUpdate) {
      onUpdate(updatedProject);
    }
  };

  const getInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <Card className="overflow-hidden border-2 border-amber-100 bg-gradient-to-br from-white to-amber-50">
        <CardContent className="p-4">
          {/* Header with Avatar and Edit Button */}
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {/* Project Avatar - Compact */}
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-xl font-bold text-white shadow-md">
                {getInitials(currentProject.name)}
              </div>

              <div className="min-w-0 flex-1">
                {/* Project Name & Meta */}
                <h2 className="text-base font-bold text-zinc-900 truncate">
                  {currentProject.name}
                </h2>
                
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
                  <span>@{user.displayName.toLowerCase().replace(" ", "")}</span>
                  {currentProject.location && (
                    <>
                      <span>•</span>
                      <MapPin size={10} className="inline" />
                      <span className="truncate">{currentProject.location}</span>
                    </>
                  )}
                </div>

                {/* Type & Stage - Compact */}
                {(currentProject.type || currentProject.stage) && (
                  <div className="mt-1.5 flex gap-1.5">
                    {currentProject.type && (
                      <span className="inline-flex rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                        {currentProject.type}
                      </span>
                    )}
                    {currentProject.stage && (
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {currentProject.stage}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsModalOpen(true)}
              className="h-7 w-7 flex-shrink-0 text-amber-600 hover:text-amber-700 hover:bg-amber-100"
              title="Edit project context"
            >
              <Edit2 size={14} />
            </Button>
          </div>

          {/* Description - Compact */}
          <p className="text-xs leading-relaxed text-zinc-600 mb-3 line-clamp-2">
            {currentProject.description}
          </p>

          {/* Stats Grid - Compact */}
          <div className="mb-3 grid grid-cols-4 gap-2">
            <div className="text-center">
              <p className="text-xl font-bold text-amber-600">{user.stats.level}</p>
              <p className="text-[10px] text-zinc-500">Lvl</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-orange-500">{user.stats.xp}</p>
              <p className="text-[10px] text-zinc-500">XP</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-green-600">{user.stats.tasksCompleted}</p>
              <p className="text-[10px] text-zinc-500">Done</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-zinc-600">{user.stats.totalTasks}</p>
              <p className="text-[10px] text-zinc-500">Total</p>
            </div>
          </div>

          {/* Project Goal Button - Compact */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-2 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
          >
            <Rocket size={14} />
            <span className="truncate">{currentProject.goal || "Set your goal"}</span>
          </button>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <ProjectEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={currentProject}
        onSave={handleProjectUpdate}
      />
    </>
  );
}
