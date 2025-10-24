"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Circle, Loader2, Trophy, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  required: boolean;
  status: "todo" | "in_progress" | "done";
}

interface TasksSectionProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => Promise<void>;
  onSendToHelper?: (taskId: string, taskTitle: string, taskDescription: string) => void;
}

export function TasksSection({ tasks, onCompleteTask, onSendToHelper }: TasksSectionProps) {
  const [completingTask, setCompletingTask] = useState<string | null>(null);

  const handleCompleteTask = async (taskId: string) => {
    setCompletingTask(taskId);
    try {
      await onCompleteTask(taskId);
    } catch (error) {
      console.error("Failed to complete task:", error);
    } finally {
      setCompletingTask(null);
    }
  };

  const handleSendToHelper = (taskId: string, taskTitle: string, taskDescription: string) => {
    if (onSendToHelper) {
      onSendToHelper(taskId, taskTitle, taskDescription);
    }
  };

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const doneTasks = tasks.filter((t) => t.status === "done");

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-6 text-center md:py-8">
          <div className="mb-2 text-3xl md:mb-3 md:text-4xl">🎯</div>
          <p className="text-xs text-zinc-600 md:text-sm">No tasks available yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Active Tasks */}
      {todoTasks.length > 0 && (
        <Card>
          <CardHeader className="pb-2 md:pb-0">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Circle size={16} className="text-amber-500 md:size-4.5" />
              Active Tasks ({todoTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 md:space-y-3">
            {todoTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-2.5 transition-all hover:border-amber-300 hover:shadow-sm md:flex-row md:items-start md:justify-between md:gap-3 md:p-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-1.5 md:gap-2">
                    <h4 className="font-medium text-zinc-900 text-sm md:text-base truncate">{task.title}</h4>
                    {task.required && (
                      <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 md:px-2 md:text-xs">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="mb-2 text-xs text-zinc-600 line-clamp-2 md:line-clamp-none">{task.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-700 md:px-2 md:py-1">
                      <Trophy size={10} className="md:size-3" />
                      +{task.xp_reward} XP
                    </span>
                  </div>
                </div>

                {/* Action Icons */}
                <div className="flex flex-shrink-0 items-center gap-1.5 md:gap-2">
                  {/* Send to Helper Button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleSendToHelper(task.id, task.title, task.description)}
                    title="Send to helper"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 bg-transparent hover:bg-blue-50"
                  >
                    <Send size={14} className="md:size-4" />
                  </Button>

                  {/* Mark Complete Button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={completingTask === task.id}
                    title="Mark as complete"
                    className="h-8 w-8 text-green-600 hover:text-green-700 bg-transparent hover:bg-green-50"
                  >
                    {completingTask === task.id ? (
                      <Loader2 size={14} className="animate-spin md:size-4" />
                    ) : (
                      <CheckCircle2 size={14} className="md:size-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completed Tasks */}
      {doneTasks.length > 0 && (
        <Card>
          <CardHeader className="pb-2 md:pb-0">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Check size={16} className="text-green-500 md:size-4.5" />
              Completed ({doneTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {doneTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2.5 rounded-lg bg-green-50 p-2.5 opacity-75 md:gap-3 md:p-3"
              >
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white md:h-6 md:w-6">
                  <Check size={12} className="md:size-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-zinc-700 line-through truncate md:text-sm">
                    {task.title}
                  </h4>
                </div>
                <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
                  +{task.xp_reward} XP
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

