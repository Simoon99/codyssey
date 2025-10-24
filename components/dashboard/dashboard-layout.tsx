"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { ProfileCard } from "./profile-card";
import { JourneyView } from "./journey-view";
import { ChatInterface } from "@/components/chat/chat-interface";
import { TasksSection } from "./tasks-section";
import { type HelperType } from "@/lib/types/helpers";

type ViewMode = "journey" | "chat" | "tasks";

interface Task {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  required: boolean;
  status: "todo" | "in_progress" | "done";
}

interface StepContext {
  orbId: string;
  stepIndex: number;
  levelIndex: number;
  tasks: string[];
  requiredTasks: string[];
  firstMessage: string;
  cta: string;
}

interface DashboardLayoutProps {
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
    id: string;
    name: string;
    links: {
      cursor?: string;
      lovable?: string;
      bolt?: string;
      github?: string;
      demo?: string;
    };
  };
  levels: Array<{
    id: number;
    title: string;
    description: string;
    xpRequired: number;
    unlocked: boolean;
    completed: boolean;
    current: boolean;
  }>;
  tasks: Task[];
}

export function DashboardLayout({ user, project, levels, tasks }: DashboardLayoutProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("journey");
  const [selectedHelper, setSelectedHelper] = useState<HelperType>("muse");
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [stepContext, setStepContext] = useState<StepContext | null>(null);
  const [showTasksInChat, setShowTasksInChat] = useState(false);

  const handleHelperSelect = (helper: HelperType | string, orbContextOrData?: StepContext | { levelIndex: number; taskRange: [number, number] }) => {
    const helperType = helper as HelperType;
    setSelectedHelper(helperType);

    // Handle new stepContext format (from orb click)
    if (orbContextOrData && 'orbId' in orbContextOrData) {
      const context = orbContextOrData as StepContext;
      setStepContext(context);
      
      // Filter tasks by the task slugs specified in context
      if (context.tasks && Array.isArray(context.tasks)) {
        const tasksForStep = localTasks.filter(task => 
          context.tasks.includes(task.id) || 
          context.tasks.some(slug => task.description?.includes(slug))
        );
        setFilteredTasks(tasksForStep.length > 0 ? tasksForStep : []);
        setShowTasksInChat(true); // Show tasks when from orb flow
      } else {
        setFilteredTasks([]);
        setShowTasksInChat(false);
      }
    } 
    // Handle legacy taskRange format (from sidebar)
    else if (orbContextOrData && 'taskRange' in orbContextOrData) {
      const orbData = orbContextOrData as { levelIndex: number; taskRange: [number, number] };
      setStepContext(null);
      setShowTasksInChat(false); // Don't show tasks for sidebar navigation
      
      const [start, end] = orbData.taskRange;
      const tasksForStep = localTasks.slice(start, end);
      setFilteredTasks(tasksForStep);
    } 
    // No orb data - sidebar or direct helper selection
    else {
      setStepContext(null);
      setFilteredTasks([]);
      setShowTasksInChat(false);
    }

    setViewMode("chat");
  };

  const handleNewChat = () => {
    // When opening new chat from sidebar, don't show tasks
    setShowTasksInChat(false);
    setFilteredTasks([]);
    setStepContext(null);
    setViewMode("chat");
  };

  const handleNavigate = (route: 'home' | 'settings') => {
    if (route === 'home') {
      setViewMode("journey");
    }
  };

  const handleStartLevel = (levelId: number) => {
    setViewMode("tasks");
  };

  const handleCompleteTask = async (taskId: string) => {
    if (!project) return;
    
    try {
      const response = await fetch("/api/tasks/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, projectId: project.id }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update local task status
        setLocalTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, status: "done" as const } : task
          )
        );
        
        // Update filtered tasks too
        setFilteredTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, status: "done" as const } : task
          )
        );
        
        // Show celebration if leveled up
        if (data.leveledUp) {
          alert(`🎉 Congratulations! You leveled up! You earned ${data.xpAwarded} XP!`);
          window.location.reload(); // Refresh to show new level
        } else {
          alert(`✅ Task completed! You earned ${data.xpAwarded} XP!`);
        }
      }
    } catch (error) {
      console.error("Failed to complete task:", error);
      alert("Failed to complete task. Please try again.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar - Collapsed */}
      <Sidebar
        currentHelper={viewMode === "chat" ? selectedHelper : undefined}
        currentLevel={user.stats.level}
        onHelperSelect={handleHelperSelect}
        onNavigate={handleNavigate}
        onNewChat={handleNewChat}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {viewMode === "journey" ? (
          <JourneyView
            levels={levels}
            currentXP={user.stats.xp}
            onStartLevel={handleStartLevel}
            user={user}
            project={project}
            onHelperSelect={handleHelperSelect}
          />
        ) : viewMode === "tasks" ? (
          <div className="h-full overflow-y-auto bg-gradient-to-b from-amber-50 to-pink-50 p-8">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6">
                <h2 className="mb-2 text-2xl font-bold text-zinc-800">
                  Level {user.stats.level} Tasks
                </h2>
                <p className="text-zinc-600">
                  Complete these tasks to earn XP and progress to the next level
                </p>
              </div>
              <TasksSection tasks={localTasks} onCompleteTask={handleCompleteTask} />
            </div>
          </div>
        ) : (
          <ChatInterface 
            helper={selectedHelper} 
            onBackToJourney={() => setViewMode("journey")} 
            tasks={showTasksInChat ? filteredTasks : []}
            stepContext={stepContext}
          />
        )}
      </main>
    </div>
  );
}

