"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Circle, Loader2, Trophy } from "lucide-react";
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
}

export function TasksSection({ tasks, onCompleteTask }: TasksSectionProps) {
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

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const doneTasks = tasks.filter((t) => t.status === "done");

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-3 text-4xl">🎯</div>
          <p className="text-sm text-zinc-600">No tasks available yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active Tasks */}
      {todoTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Circle size={18} className="text-amber-500" />
              Active Tasks ({todoTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todoTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-3 transition-all hover:border-amber-300 hover:shadow-sm"
              >
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h4 className="font-medium text-zinc-900">{task.title}</h4>
                    {task.required && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="mb-2 text-xs text-zinc-600">{task.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 font-semibold text-amber-700">
                      <Trophy size={12} />
                      +{task.xp_reward} XP
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleCompleteTask(task.id)}
                  disabled={completingTask === task.id}
                  className="flex-shrink-0"
                >
                  {completingTask === task.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Check size={16} />
                      Done
                    </>
                  )}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completed Tasks */}
      {doneTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Check size={18} className="text-green-500" />
              Completed ({doneTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {doneTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-lg bg-green-50 p-3 opacity-75"
              >
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                  <Check size={14} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-zinc-700 line-through">
                    {task.title}
                  </h4>
                </div>
                <span className="text-xs font-semibold text-green-700">
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

