"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Sidebar } from "./sidebar";
import { ProfileCard } from "./profile-card";
import { JourneyView } from "./journey-view";
import { ChatInterface, type ChatMessage, type ChatSession } from "@/components/chat/chat-interface";
import { TasksSection } from "./tasks-section";
import { ToastNotification } from "@/components/ui/toast-notification";
import { SettingsPopup } from "./settings-popup";
import { type HelperType } from "@/lib/types/helpers";
import { Menu, X } from "lucide-react";
import { getOrbById } from "@/lib/journey-mapper";

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
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [triggerJourneyStart, setTriggerJourneyStart] = useState(false);
  
  // Shared chat caches (persist across view changes)
  const sessionsCacheRef = useRef<Map<HelperType, ChatSession[]>>(new Map());
  const messageCacheRef = useRef<Map<string, ChatMessage[]>>(new Map());

  const applyStepContextFromOrb = useCallback((orbId: string | null) => {
    if (!orbId) {
      console.log("[Dashboard] applyStepContextFromOrb: clearing stepContext (no orbId)");
      setStepContext(null);
      return null;
    }

    console.log("[Dashboard] applyStepContextFromOrb: rebuilding context from orb", orbId);
    const orbData = getOrbById(orbId);
    if (!orbData) {
      console.warn("[Dashboard] applyStepContextFromOrb: orb not found", orbId);
      return null;
    }

    const context: StepContext = {
      orbId: orbData.id,
      stepIndex: orbData.stepIndex,
      levelIndex: orbData.levelIndex,
      tasks: orbData.tasks,
      requiredTasks: orbData.requiredTasks,
      firstMessage: orbData.firstMessage,
      cta: orbData.cta,
    };

    setStepContext((prev) => {
      if (prev?.orbId === context.orbId) {
        console.log("[Dashboard] applyStepContextFromOrb: context already set", context.orbId);
        return prev;
      }
      console.log("[Dashboard] applyStepContextFromOrb: context set", context);
      return context;
    });

    return context;
  }, []);
 
  // Centralized journey progress data for ALL helpers - loaded once on mount
  const [allJourneyProgress, setAllJourneyProgress] = useState<Record<HelperType, {
    progress: any;
    tasks: any[];
  }>>({
    muse: { progress: null, tasks: [] },
    architect: { progress: null, tasks: [] },
    crafter: { progress: null, tasks: [] },
    hacker: { progress: null, tasks: [] },
    hypebeast: { progress: null, tasks: [] },
    sensei: { progress: null, tasks: [] },
  });

  // Compute active orbs from journey progress and stepContext
  const activeOrbIds = useMemo(() => {
    console.log("[Dashboard] 🔍 Computing activeOrbIds (useMemo)");
    console.log("[Dashboard] 📊 allJourneyProgress keys:", Object.keys(allJourneyProgress));
    
    const map: Record<HelperType, string | null> = {
      muse: null,
      architect: null,
      crafter: null,
      hacker: null,
      hypebeast: null,
      sensei: null,
    };

    (Object.keys(allJourneyProgress) as HelperType[]).forEach((helper) => {
      const progressData = allJourneyProgress[helper];
      const currentLevelId = progressData?.progress?.current_level_id;
      
      console.log(`[Dashboard] 🔍 ${helper}:`, {
        hasProgress: !!progressData?.progress,
        currentLevelId,
        fullProgress: progressData?.progress
      });
      
      map[helper] = currentLevelId ?? null;
    });

    // Override with stepContext if present for the selected helper
    if (stepContext?.orbId) {
      console.log("[Dashboard] ⭐ Overriding", selectedHelper, "with stepContext orbId:", stepContext.orbId);
      map[selectedHelper] = stepContext.orbId;
    }

    console.log("[Dashboard] ✅ Final activeOrbIds map:", map);
    return map;
  }, [allJourneyProgress, stepContext, selectedHelper]);

  const ensureStepContextFromProgress = useCallback((helperType: HelperType) => {
    const progressOrbId = allJourneyProgress[helperType]?.progress?.current_level_id;
    if (!progressOrbId) {
      console.log(`[Dashboard] ensureStepContextFromProgress: helper ${helperType} has no stored orb`);
      return null;
    }

    if (stepContext?.orbId === progressOrbId) {
      console.log(`[Dashboard] ensureStepContextFromProgress: helper ${helperType} already using orb`, progressOrbId);
      return stepContext;
    }

    console.log(`[Dashboard] ensureStepContextFromProgress: syncing helper ${helperType} to orb`, progressOrbId);
    const newContext = applyStepContextFromOrb(progressOrbId);
    return newContext;
  }, [allJourneyProgress, stepContext, applyStepContextFromOrb]);

  // Full project context including all rich fields for AI helpers
  const [projectContext, setProjectContext] = useState<any>(project);

  const projectId = project?.id || "00000000-0000-0000-0000-000000000002";

  // Load full project context with all rich fields
  const loadProjectContext = async () => {
    if (!projectId) return;
    
    try {
      console.log("[Dashboard] 📋 Loading full project context...");
      const response = await fetch(`/api/projects/${projectId}`);
      
      if (response.ok) {
        const { project: fullProject } = await response.json();
        setProjectContext(fullProject);
        console.log("[Dashboard] ✅ Project context loaded:", {
          name: fullProject.name,
          hasDescription: !!fullProject.description,
          hasProblemStatement: !!fullProject.problem_statement,
          hasTargetAudience: !!fullProject.target_audience,
          hasValueProp: !!fullProject.value_proposition,
          hasTechStack: !!fullProject.tech_stack,
          currentStage: fullProject.current_stage,
        });
      } else {
        console.warn("[Dashboard] ⚠️ Could not load project context, using prop data");
        setProjectContext(project);
      }
    } catch (error) {
      console.error("[Dashboard] ❌ Error loading project context:", error);
      setProjectContext(project); // Fallback to prop data
    }
  };

  // Load ALL journey progress for ALL helpers once - central data source
  const loadAllJourneyProgress = async () => {
    if (!projectId) return;
    
    const helpers: HelperType[] = ['muse', 'architect', 'crafter', 'hacker', 'hypebeast', 'sensei'];
    
    console.log("[Dashboard] 📊 Loading journey progress for all helpers...");
    
    // Load all helpers' journey data in parallel for efficiency
    const progressPromises = helpers.map(async (helper) => {
      try {
        const response = await fetch(`/api/journey/progress?projectId=${projectId}&helper=${helper}`);
        if (response.ok) {
          const data = await response.json();
          console.log(`[Dashboard] 📥 Journey data for ${helper}:`, {
            hasProgress: !!data.journeyProgress,
            currentLevelId: data.journeyProgress?.current_level_id,
            isActive: data.journeyProgress?.is_active,
            tasksCount: data.tasks?.length || 0,
            stats: data.stats,
          });
          return { helper, data };
        }
        return { helper, data: { journeyProgress: null, tasks: [] } };
      } catch (error) {
        console.error(`[Dashboard] ❌ Error loading progress for ${helper}:`, error);
        return { helper, data: { journeyProgress: null, tasks: [] } };
      }
    });
    
    const results = await Promise.all(progressPromises);
    
    // Update state with all journey progress
    const newProgressData: Record<HelperType, { progress: any; tasks: any[] }> = {
      muse: { progress: null, tasks: [] },
      architect: { progress: null, tasks: [] },
      crafter: { progress: null, tasks: [] },
      hacker: { progress: null, tasks: [] },
      hypebeast: { progress: null, tasks: [] },
      sensei: { progress: null, tasks: [] },
    };
    
    results.forEach(({ helper, data }) => {
      newProgressData[helper as HelperType] = {
        progress: data.journeyProgress,
        tasks: data.tasks || [],
      };
    });
    
    setAllJourneyProgress(newProgressData);
    
    // Log which helpers have active journeys and tasks
    const activeHelpers = Object.entries(newProgressData)
      .filter(([_, data]) => data.progress?.current_level_id)
      .map(([helper, data]) => ({
        helper,
        orbId: data.progress.current_level_id,
        tasksCount: data.tasks.length,
        isActive: data.progress.is_active,
      }));
    
    console.log("[Dashboard] ✅ All journey progress loaded and cached");
    console.log("[Dashboard] 📋 Active helpers with tasks:", activeHelpers);
    console.log("[Dashboard] 📊 Helpers that should show Tasks Button:", 
      activeHelpers.filter(h => h.tasksCount > 0).map(h => h.helper)
    );
    
    if (selectedHelper) {
      console.log("[Dashboard] loadAllJourneyProgress: syncing context for helper", selectedHelper);
      ensureStepContextFromProgress(selectedHelper);
    }
  };

  // PREFETCH: Load all chat sessions and messages for ALL helpers on mount
  useEffect(() => {
    const prefetchAllHelperData = async () => {
      if (!projectId) return;
      
      const helpers: HelperType[] = ['muse', 'architect', 'crafter', 'hacker', 'hypebeast', 'sensei'];
      console.log("[Dashboard] 🚀 PREFETCHING chat data for all helpers...");
      
      const prefetchPromises = helpers.map(async (helper) => {
        // Skip helpers we've already cached
        if (sessionsCacheRef.current.has(helper)) {
          console.log(`[Dashboard] ⏭️ Skipping ${helper} (already cached)`);
          return;
        }
        
        try {
          const sessionsResponse = await fetch(
            `/api/chat/sessions?projectId=${projectId}&helper=${helper}`
          );
          
          if (!sessionsResponse.ok) return;
          
          const { sessions = [] } = await sessionsResponse.json();
          sessionsCacheRef.current.set(helper, sessions);
          console.log(`[Dashboard] ✅ Prefetched ${sessions.length} sessions for ${helper}`);
          
          if (sessions.length === 0) {
            // Mark as cached even if empty to avoid re-fetching
            return;
          }
          
          const mostRecentSession = sessions[0];
          
          // Skip if messages already cached
          if (messageCacheRef.current.has(mostRecentSession.id)) {
            console.log(`[Dashboard] ⏭️ Messages already cached for ${helper}'s latest session`);
            return;
          }
          
          try {
            const messagesResponse = await fetch(
              `/api/chat/sessions/${mostRecentSession.id}/messages`
            );
            if (messagesResponse.ok) {
              const { messages = [] } = await messagesResponse.json();
              messageCacheRef.current.set(mostRecentSession.id, messages);
              console.log(`[Dashboard] ✅ Prefetched ${messages.length} messages for ${helper}`);
            }
          } catch (msgError) {
            console.error(`[Dashboard] ❌ Error prefetching messages for ${helper}:`, msgError);
          }
        } catch (error) {
          console.error(`[Dashboard] ❌ Error prefetching ${helper}:`, error);
        }
      });
      
      await Promise.all(prefetchPromises);
      console.log("[Dashboard] 🎉 All helper chat data prefetched!", {
        cachedHelpers: Array.from(sessionsCacheRef.current.keys()),
      });
    };
    
    prefetchAllHelperData();
  }, [projectId]);

  // Load state from database on mount - Load EVERYTHING once
  useEffect(() => {
    const loadState = async () => {
      if (!projectId) return;
      
      try {
        console.log("[Dashboard] 🚀 Initial app load - Loading all data...");
        setIsLoadingState(true);
        
        // Load user state (UI preferences, active orb, etc.)
        const stateResponse = await fetch(`/api/user/state?projectId=${projectId}`);
        
        if (stateResponse.ok) {
          const { state } = await stateResponse.json();
          
          if (state) {
            console.log("[Dashboard] ✅ Loaded user state:", state);
            
            // Restore state
            if (state.selectedHelper) setSelectedHelper(state.selectedHelper as HelperType);
            if (state.stepContext) {
              console.log("[Dashboard] ✅ Restoring stepContext with orbId:", state.stepContext.orbId);
              setStepContext(state.stepContext);
            }
            if (state.viewMode) setViewMode(state.viewMode as ViewMode);
          } else {
            console.log("[Dashboard] ℹ️ No saved state found, using defaults");
          }
        }
        
        // Load ALL journey progress for ALL helpers (parallel load)
        // Load full project context (all fields for AI helpers)
        await loadProjectContext();
        
        await loadAllJourneyProgress();
        
        console.log("[Dashboard] ✅ All app data loaded successfully");
      } catch (error) {
        console.error("[Dashboard] ❌ Error during initial load:", error);
      } finally {
        setIsLoadingState(false);
      }
    };

    loadState();
  }, [projectId]);

  // Save state to database when it changes
  useEffect(() => {
    // Don't save during initial load
    if (isLoadingState) return;
    
    const saveState = async () => {
      if (!projectId) return;
      
      try {
        console.log("[Dashboard] Saving state with orbId:", stepContext?.orbId);
        await fetch("/api/user/state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            selectedHelper,
            activeOrbId: stepContext?.orbId,
            stepContext,
            viewMode,
          }),
        });
        
        console.log("[Dashboard] State saved to database");
      } catch (error) {
        console.error("[Dashboard] Error saving state:", error);
      }
    };

    // Debounce state saves
    const timeoutId = setTimeout(saveState, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedHelper, stepContext, viewMode, isLoadingState, projectId]);

  // Log stepContext changes
  useEffect(() => {
    console.log("[Dashboard] stepContext changed:", stepContext);
  }, [stepContext]);

  const handleHelperSelect = (helper: HelperType | string, orbContextOrData?: StepContext | { levelIndex: number; taskRange: [number, number] }) => {
    const helperType = helper as HelperType;
    setSelectedHelper(helperType);

    // Handle new stepContext format (from orb click)
    if (orbContextOrData && 'orbId' in orbContextOrData) {
      const context = orbContextOrData as StepContext;
      console.log("[Dashboard] handleHelperSelect: received orb context", { helperType, context });
      
      // Check if this is the same orb we're already on
      const isSameOrb = stepContext?.orbId === context.orbId && selectedHelper === helperType;
      
      // Check if there are existing sessions with messages for this helper
      const existingSessions = sessionsCacheRef.current.get(helperType) || [];
      const hasExistingMessages = existingSessions.length > 0 && 
        existingSessions.some(session => {
          const cachedMessages = messageCacheRef.current.get(session.id);
          return cachedMessages && cachedMessages.length > 0;
        });
      
      console.log("[Dashboard] Orb click check:", {
        isSameOrb,
        hasExistingSessions: existingSessions.length > 0,
        hasExistingMessages,
        currentOrbId: stepContext?.orbId,
        clickedOrbId: context.orbId,
      });
      
      setStepContext(context);
      
      // Only trigger journey start if:
      // 1. It's a different orb OR
      // 2. There are no existing messages for this helper
      const shouldTriggerJourneyStart = !isSameOrb || !hasExistingMessages;
      
      if (shouldTriggerJourneyStart) {
        // Set flag to trigger journey start in ChatInterface (immediately for smooth UX)
        console.log("[Dashboard] 🚀 Setting triggerJourneyStart = TRUE for", helperType);
        setTriggerJourneyStart(true);
        
        // Initialize journey in database (non-blocking, fast)
        // Don't await - let it run in parallel for faster UX
        fetch("/api/journey/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            helper: helperType,
            levelId: context.orbId,
          }),
        })
          .then(async (response) => {
            if (response.ok) {
              const data = await response.json();
              console.log("[Dashboard] ✅ Journey initialized:", {
                helper: helperType,
                orbId: context.orbId,
                tasksCreated: data.tasks?.length || 0,
              });
              
              // Reload journey progress to update active orbs (non-blocking)
              loadAllJourneyProgress().catch(err => 
                console.error("[Dashboard] Error reloading progress:", err)
              );
            } else {
              console.error("[Dashboard] ❌ Failed to initialize journey:", await response.text());
            }
          })
          .catch((error) => {
            console.error("[Dashboard] ❌ Error initializing journey:", error);
          });
      } else {
        console.log("[Dashboard] ⏭️ Skipping journey start - same orb with existing messages");
      }
      
      // Filter tasks by the task slugs specified in context
      if (context.tasks && Array.isArray(context.tasks)) {
        const tasksForStep = localTasks.filter(task => 
          context.tasks.includes(task.id) || 
          context.tasks.some(slug => task.description?.includes(slug))
        );
        setFilteredTasks(tasksForStep.length > 0 ? tasksForStep : []);
        setShowTasksInChat(true); // Show tasks when from orb flow
        console.log("[Dashboard] handleHelperSelect: tasks button active", {
          helper: helperType,
          tasksCount: tasksForStep.length,
          showTasksInChat: true,
        });
      } else {
        setFilteredTasks([]);
        setShowTasksInChat(false);
        console.log("[Dashboard] handleHelperSelect: no tasks for orb", {
          helper: helperType,
          showTasksInChat: false,
        });
      }
    } 
    // Handle legacy taskRange format (from sidebar)
    else if (orbContextOrData && 'taskRange' in orbContextOrData) {
      const orbData = orbContextOrData as { levelIndex: number; taskRange: [number, number] };
      console.log("[Dashboard] handleHelperSelect: legacy selection", { helperType, orbData });
      setStepContext(null);
      setShowTasksInChat(false); // Don't show tasks for sidebar navigation
      console.log("[Dashboard] handleHelperSelect: legacy/side helper selection", {
        helper: helperType,
        showTasksInChat: false,
      });

      const [start, end] = orbData.taskRange;
      const tasksForStep = localTasks.slice(start, end);
      setFilteredTasks(tasksForStep);
    } 
    // No orb data - sidebar or direct helper selection
    else {
      // Don't clear stepContext - preserve active orb state
      // Only clear tasks since this is direct helper selection
      console.log("[Dashboard] handleHelperSelect: direct helper select", helperType);
      setFilteredTasks([]);
      setShowTasksInChat(false);
      ensureStepContextFromProgress(helperType);
      console.log("[Dashboard] handleHelperSelect: direct helper select", {
        helper: helperType,
        showTasksInChat: false,
      });
    }

    console.log("[Dashboard] handleHelperSelect: final state", {
      helperType,
      viewMode: "chat",
      stepContext: stepContext?.orbId,
      showTasksInChat,
    });
    setViewMode("chat");
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleNewChat = () => {
    // When opening new chat from sidebar, don't show tasks
    // But preserve stepContext to maintain active orb state
    setShowTasksInChat(false);
    setFilteredTasks([]);
    console.log("[Dashboard] handleNewChat: tasks button hidden", {
      helper: selectedHelper,
      showTasksInChat: false,
    });
    setViewMode("chat");
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleNavigate = (route: 'home' | 'settings') => {
    if (route === 'home') {
      setViewMode("journey");
      console.log("[Dashboard] Navigating to journey, current stepContext:", stepContext);
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

  const handleProjectContextUpdated = useCallback((updatedProject: any, updatedFields: string[] = []) => {
    if (updatedProject) {
      setProjectContext(updatedProject);
    }

    if (updatedFields && updatedFields.length > 0) {
      const labelMap: Record<string, string> = {
        goal: "Project goal",
        description: "Description",
        location: "Location",
        problemStatement: "Problem statement",
        targetAudience: "Target audience",
        valueProposition: "Value proposition",
        techStack: "Tech stack",
        currentStage: "Current stage",
      };

      const labelList = updatedFields
        .map((field) => labelMap[field] || field)
        .join(", ");

      setToast({
        message: `Muse updated your project context: ${labelList}`,
        type: "success",
      });
    }
  }, []);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden md:flex-row">
      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        /* Modern subtle scrollbar for dashboard */
        .dashboard-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .dashboard-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .dashboard-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db; /* light grey */
          border-radius: 4px;
        }
        
        .dashboard-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af; /* slightly darker grey */
        }
        
        /* Firefox */
        .dashboard-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }
      `}</style>
      
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
            project={projectContext ? {
              id: projectContext.id,
              name: projectContext.name,
              description: projectContext.description,
              goal: projectContext.goal,
              location: projectContext.location,
              avatarUrl: projectContext.avatar_url,
              problemStatement: projectContext.problem_statement,
              targetAudience: projectContext.target_audience,
              valueProposition: projectContext.value_proposition,
              techStack: projectContext.tech_stack,
              currentStage: projectContext.current_stage,
              links: projectContext.external_links,
            } : project}
            tasks={localTasks}
            activeOrbIds={activeOrbIds}
            onHelperSelect={handleHelperSelect}
            onProjectUpdate={(updated) => handleProjectContextUpdated(updated)}
            journeyProgressData={allJourneyProgress}
          />
        ) : viewMode === "tasks" ? (
          <div className="h-full overflow-y-auto dashboard-scrollbar bg-gradient-to-b from-amber-50 to-pink-50 md:py-8">
            <div className="mx-auto max-w-full">
              <div className="mb-6 px-4 md:px-8">
                <h2 className="mb-2 text-xl font-bold text-zinc-800 md:text-2xl">
                  Level {user.stats.level} Tasks
                </h2>
                <p className="text-sm text-zinc-600 md:text-base">
                  Complete these tasks to earn XP and progress to the next level
                </p>
              </div>
              <div className="px-4 md:px-8">
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
            project={projectContext ? {
              id: projectContext.id,
              name: projectContext.name,
              description: projectContext.description,
              goal: projectContext.goal,
              location: projectContext.location,
              problemStatement: projectContext.problem_statement,
              targetAudience: projectContext.target_audience,
              valueProposition: projectContext.value_proposition,
              techStack: projectContext.tech_stack,
              currentStage: projectContext.current_stage,
            } : undefined}
            journeyProgress={allJourneyProgress[selectedHelper]?.progress}
            journeyTasks={allJourneyProgress[selectedHelper]?.tasks || []}
            onRefreshJourneyProgress={loadAllJourneyProgress}
            cache={{ sessions: sessionsCacheRef, messages: messageCacheRef }}
            triggerJourneyStart={triggerJourneyStart}
            onJourneyStartTriggered={() => {
              console.log("[Dashboard] ✅ Journey start triggered callback - clearing flag");
              setTriggerJourneyStart(false);
            }}
            onProjectContextUpdated={handleProjectContextUpdated}
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

