"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, MapPin, Rocket, Camera } from "lucide-react";
import { ProjectContextPanel } from "./project-context-panel";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    goal?: string;
    location?: string;
    avatarUrl?: string;
    problemStatement?: string;
    targetAudience?: string;
    valueProposition?: string;
    techStack?: string;
    currentStage?: string;
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
  const [avatarUrl, setAvatarUrl] = useState(project.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleEditClick = () => {
    console.log("Edit clicked! Opening panel...");
    setIsPanelOpen(true);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        if (onUpdate) {
          onUpdate({ ...project, avatarUrl: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (updatedProject: any) => {
    console.log("[ProjectCard] 💾 Saving project context:", updatedProject);
    
    try {
      // Save to database via API
      const response = await fetch(`/api/projects/${project.id}/context`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProject),
      });
      
      if (response.ok) {
        console.log("[ProjectCard] ✅ Project context saved successfully");
        if (onUpdate) {
          const { project: savedProject } = await response.json();
          onUpdate(savedProject ?? updatedProject);
        }
      } else {
        console.error("[ProjectCard] ❌ Failed to save project context");
        alert("Failed to save project context. Please try again.");
      }
    } catch (error) {
      console.error("[ProjectCard] ❌ Error saving project context:", error);
      alert("Error saving project context. Please try again.");
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />
      <Card className="overflow-hidden">
        <CardContent className="p-3 md:p-4">
          {/* Header with Avatar and Edit Button */}
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 md:gap-3">
              {/* Project Avatar - Clickable */}
              <div 
                className="group relative flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 md:h-16 md:w-16 md:text-2xl"
                onClick={handleAvatarClick}
                title="Click to change avatar"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Project avatar" className="h-full w-full rounded-full object-cover" />
                ) : (
                  getInitials(project.name)
                )}
                {/* Camera overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera size={16} className="text-white md:size-5" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                {/* Project Name */}
                <h2 className="mb-0.5 truncate text-base font-bold text-zinc-900 md:text-xl">
                  {project.name}
                </h2>

                {/* Username */}
                <p className="mb-1 text-xs text-zinc-500">
                  @{user.displayName.toLowerCase().replace(" ", "")}
                </p>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-zinc-600 truncate">
                  <MapPin size={12} className="text-blue-500 flex-shrink-0" />
                  <span className="truncate">{project.location || "Not set"}</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleEditClick}
              className="h-8 w-8 flex-shrink-0 bg-transparent text-zinc-400 hover:bg-transparent hover:text-zinc-600 focus:bg-transparent active:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
              title="Edit project context"
            >
              <Edit2 size={16} />
            </Button>
          </div>

          {/* About Project */}
          <div className="mb-3">
            <h3 className="mb-1.5 text-xs font-semibold text-zinc-700">
              About Project
            </h3>
            <p className="text-xs leading-relaxed text-zinc-600 line-clamp-2 md:line-clamp-none">
              {project.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-3 grid grid-cols-4 gap-2">
            <div className="text-center">
              <p className="text-lg font-bold text-zinc-900 md:text-2xl">{user.stats.level}</p>
              <p className="text-[10px] text-zinc-500">Level</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-zinc-900 md:text-2xl">{user.stats.xp}</p>
              <p className="text-[10px] text-zinc-500">XP</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-zinc-900 md:text-2xl">
                {user.stats.tasksCompleted}
              </p>
              <p className="text-[10px] text-zinc-500">Done</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-zinc-900 md:text-2xl">
                {user.stats.totalTasks}
              </p>
              <p className="text-[10px] text-zinc-500">Total</p>
            </div>
          </div>

          {/* Project Goal */}
          <div>
            <h3 className="mb-2 text-xs font-semibold text-zinc-700">
              Project Goal
            </h3>
            <div className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-2 shadow-md md:px-4 md:py-3">
              <Rocket size={14} className="text-white flex-shrink-0 md:size-4" />
              <span className="truncate text-xs font-semibold text-white md:text-sm">
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
