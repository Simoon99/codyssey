"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Check, X, MapPin, Rocket } from "lucide-react";

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
  onUpdate?: (updatedProject: {
    name: string;
    description: string;
    goal?: string;
    location?: string;
  }) => void;
}

export function ProjectCard({ project, user, onUpdate }: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: project.name,
    description: project.description,
    goal: project.goal || "Launch in 30 days",
    location: project.location || "Massachusetts, United States",
  });

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData({
      name: project.name,
      description: project.description,
      goal: project.goal || "Launch in 30 days",
      location: project.location || "Massachusetts, United States",
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {/* Header with Avatar and Edit Button */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Project Avatar */}
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-3xl font-bold text-white shadow-lg">
              {getInitials(isEditing ? editedData.name : project.name)}
            </div>

            <div className="flex-1 min-w-0">
              {/* Project Name */}
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.name}
                  onChange={(e) =>
                    setEditedData({ ...editedData, name: e.target.value })
                  }
                  className="mb-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-2xl font-bold focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  placeholder="Project Name"
                />
              ) : (
                <h2 className="mb-1 text-2xl font-bold text-zinc-900">
                  {project.name}
                </h2>
              )}

              {/* Username */}
              <p className="mb-2 text-sm text-zinc-500">
                @{user.displayName.toLowerCase().replace(" ", "")}
              </p>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <MapPin size={14} className="text-blue-500" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.location}
                    onChange={(e) =>
                      setEditedData({ ...editedData, location: e.target.value })
                    }
                    className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-200"
                    placeholder="Location"
                  />
                ) : (
                  <span>{editedData.location}</span>
                )}
              </div>
            </div>
          </div>

          {/* Edit/Save/Cancel Buttons */}
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSave}
                className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
              >
                <Check size={18} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancel}
                className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <X size={18} />
              </Button>
            </div>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 text-zinc-400 hover:text-zinc-600"
            >
              <Edit2 size={18} />
            </Button>
          )}
        </div>

        {/* About Project */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-zinc-700">
            About Project
          </h3>
          {isEditing ? (
            <textarea
              value={editedData.description}
              onChange={(e) =>
                setEditedData({ ...editedData, description: e.target.value })
              }
              rows={3}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              placeholder="Describe your project..."
            />
          ) : (
            <p className="text-sm leading-relaxed text-zinc-600">
              {project.description}
            </p>
          )}
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
          {isEditing ? (
            <input
              type="text"
              value={editedData.goal}
              onChange={(e) =>
                setEditedData({ ...editedData, goal: e.target.value })
              }
              className="w-full rounded-full border border-zinc-300 px-6 py-4 text-center text-lg font-semibold focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              placeholder="Your goal..."
            />
          ) : (
            <div className="flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 shadow-md">
              <Rocket size={20} className="text-white" />
              <span className="text-lg font-semibold text-white">
                {editedData.goal}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

