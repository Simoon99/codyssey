"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { ProfileCard } from "./profile-card";
import { JourneyView } from "./journey-view";
import { ChatInterface } from "@/components/chat/chat-interface";
import { TasksSection } from "./tasks-section";
import { ToastNotification } from "@/components/ui/toast-notification";
import { SettingsPopup } from "./settings-popup";
import { type HelperType } from "@/lib/types/helpers";
import { Menu, X } from "lucide-react";

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
    description: string;
    goal?: string;
    location?: string;
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
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleNewChat = () => {
    // When opening new chat from sidebar, don't show tasks
    setShowTasksInChat(false);
    setFilteredTasks([]);
    setStepContext(null);
    setViewMode("chat");
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleNavigate = (route: 'home' | 'settings') => {
    if (route === 'home') {
      setViewMode("journey");
    } else if (route === 'settings') {
      setShowSettings(true);
    }
    setSidebarOpen(false); // Close sidebar after navigation
  };

  const handleStartLevel = (levelId: number) => {
    setViewMode("tasks");
    setSidebarOpen(false); // Close sidebar on mobile
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
          setToast({ message: `Congratulations! You leveled up! You earned ${data.xpAwarded} XP!`, type: "success" });
          setViewMode("journey"); // Navigate to journey to see new level
        } else {
          setToast({ message: `Task completed! You earned ${data.xpAwarded} XP!`, type: "success" });
        }
      }
    } catch (error) {
      console.error("Failed to complete task:", error);
      setToast({ message: "Failed to complete task. Please try again.", type: "error" });
    }
  };

  const handleSendTaskToHelper = (taskId: string, taskTitle: string, taskDescription: string) => {
    // Switch to chat view
    setViewMode("chat");
    
    // Create a task-specific prompt
    const prompt = `I need help with this task: "${taskTitle}"\n\nDescription: ${taskDescription}\n\nCan you guide me through completing this?`;
    
    // Send the message to the currently selected helper
    // This will be handled by the ChatInterface component receiving the initial message
    console.log("Sending task to helper:", { taskId, taskTitle, prompt });
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden md:flex-row">
      {/* Floating Hamburger Button - Mobile Only */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-3 left-3 z-50 flex h-10 w-10 items-center justify-center rounded-lg p-2 hover:bg-white/20 md:hidden shadow-lg transition-all"
        aria-label="Toggle sidebar"
        title={sidebarOpen ? "Close menu" : "Open menu"}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Hidden on mobile unless opened */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-20 transform bg-gradient-to-b from-amber-50 to-pink-50 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ top: 0 }}
      >
        <Sidebar
          currentHelper={viewMode === "chat" ? selectedHelper : undefined}
          currentLevel={user.stats.level}
          onHelperSelect={handleHelperSelect}
          onNavigate={handleNavigate}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Main Content - Full Screen on Mobile */}
      <main className="flex-1 overflow-hidden w-full">
        {viewMode === "journey" ? (
          <JourneyView
            levels={levels}
            currentXP={user.stats.xp}
            onStartLevel={handleStartLevel}
            user={user}
            project={project}
            tasks={localTasks}
            activeOrbId={stepContext?.orbId}
            onHelperSelect={handleHelperSelect}
          />
        ) : viewMode === "tasks" ? (
          <div className="h-full overflow-y-auto bg-gradient-to-b from-amber-50 to-pink-50 md:p-8">
            <div className="mx-auto max-w-3xl md:p-0">
              <div className="mb-6 px-4 md:px-0">
                <h2 className="mb-2 text-xl font-bold text-zinc-800 md:text-2xl">
                  Level {user.stats.level} Tasks
                </h2>
                <p className="text-sm text-zinc-600 md:text-base">
                  Complete these tasks to earn XP and progress to the next level
                </p>
              </div>
              <div className="px-4 md:px-0">
                <TasksSection tasks={localTasks} onCompleteTask={handleCompleteTask} onSendToHelper={handleSendTaskToHelper} />
              </div>
            </div>
          </div>
        ) : (
          <ChatInterface 
            helper={selectedHelper} 
            onBackToJourney={() => setViewMode("journey")} 
            tasks={showTasksInChat ? filteredTasks : []}
            onCompleteTask={handleCompleteTask}
            stepContext={stepContext ?? undefined}
            project={project ? {
              name: project.name,
              description: project.description,
              techStack: undefined, // Can be added to project type later
              stage: undefined, // Can be added to project type later
            } : undefined}
          />
        )}
      </main>
      {toast && (
        <ToastNotification 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <SettingsPopup 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

