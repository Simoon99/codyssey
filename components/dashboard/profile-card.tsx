"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProfileCardProps {
  user: {
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
    links: {
      cursor?: string;
      lovable?: string;
      bolt?: string;
      github?: string;
      demo?: string;
    };
  };
}

export function ProfileCard({ user, project }: ProfileCardProps) {
  return (
    <div className="flex h-full w-80 flex-col gap-4 overflow-y-auto bg-zinc-50 p-4">
      {/* User Profile */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-amber-500">
              <AvatarImage src={user.avatarUrl} alt={user.displayName} />
              <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                {user.displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user.displayName}</h3>
              <p className="text-xs text-zinc-500">@{user.displayName.toLowerCase().replace(' ', '')}</p>
            </div>
          </div>
          <Button size="icon" variant="ghost">
            <Edit size={16} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0">
          {/* About */}
          {user.about && (
            <div>
              <p className="mb-1 text-xs font-semibold text-zinc-500">About</p>
              <p className="text-sm text-zinc-700">{user.about}</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-amber-50 p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{user.stats.level}</p>
              <p className="text-xs text-zinc-600">Level</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{user.stats.xp}</p>
              <p className="text-xs text-zinc-600">XP</p>
            </div>
            <div className="rounded-lg bg-pink-50 p-3 text-center">
              <p className="text-2xl font-bold text-pink-600">{user.stats.tasksCompleted}</p>
              <p className="text-xs text-zinc-600">Tasks Done</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{user.stats.totalTasks}</p>
              <p className="text-xs text-zinc-600">Total Tasks</p>
            </div>
          </div>

          {/* XP Progress */}
          <div>
            <div className="mb-2 flex justify-between text-xs">
              <span className="text-zinc-500">Level {user.stats.level} Progress</span>
              <span className="font-semibold text-zinc-700">
                {user.stats.xp} / {user.stats.xpToNextLevel} XP
              </span>
            </div>
            <Progress value={user.stats.xp} max={user.stats.xpToNextLevel} />
          </div>
        </CardContent>
      </Card>

      {/* Current Project */}
      {project && (
        <Card>
          <CardHeader className="p-4">
            <h4 className="text-sm font-semibold">Current Project</h4>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
            <div>
              <p className="font-medium text-zinc-900">{project.name}</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-zinc-500">Quick Links</p>
              <div className="space-y-1">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-zinc-100 p-2 text-xs hover:bg-zinc-200"
                  >
                    <ExternalLink size={14} />
                    GitHub
                  </a>
                )}
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-zinc-100 p-2 text-xs hover:bg-zinc-200"
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                )}
                {project.links.cursor && (
                  <a
                    href={project.links.cursor}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-zinc-100 p-2 text-xs hover:bg-zinc-200"
                  >
                    <ExternalLink size={14} />
                    Cursor Project
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Community Section */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <p className="text-center text-sm text-zinc-600">
            Join our discord to get help from our community
          </p>
          <div className="flex gap-2">
            <Button variant="default" className="flex-1" size="sm">
              Get Help
            </Button>
            <Button variant="outline" className="flex-1" size="sm">
              Join Discord
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

