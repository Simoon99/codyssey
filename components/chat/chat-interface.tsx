"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { MutableRefObject } from "react";
import { Message } from "./message";
import { PromptModal } from "./prompt-modal";
import { PromptQualityInlineBadge } from "./prompt-quality-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Send,
  Loader2,
  Paperclip,
  ArrowLeft,
  CheckCircle2,
  Info,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit2,
  X,
  ListTodo,
} from "lucide-react";
import { type HelperType, getHelperById } from "@/lib/types/helpers";
import {
  getTemplatesForHelper,
  type PromptTemplate,
} from "@/lib/template-library";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  domain: string;
}

interface ChatCacheRefs {
  sessions: MutableRefObject<Map<HelperType, ChatSession[]>>;
  messages: MutableRefObject<Map<string, ChatMessage[]>>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: Array<{
    tool_name: string;
    tool_args: any;
    result?: any;
  }>;
  searchResults?: {
    results: Array<{
      title: string;
      url: string;
      snippet: string;
      domain: string;
    }>;
    query: string;
    summary?: string;
    citations?: Array<{
      index: number;
      title: string;
      url: string;
      snippet?: string;
      domain?: string;
      date?: string | null;
    }>;
  };
}

interface ChatInterfaceProps {
  helper: HelperType;
  chatId?: string;
  initialMessages?: ChatMessage[];
  onSendMessage?: (content: string) => Promise<void>;
  onBackToJourney?: () => void;
  tasks?: Array<{
    id: string;
    title: string;
    description: string;
    xp_reward: number;
    required: boolean;
    status: "todo" | "in_progress" | "done";
  }>;
  onCompleteTask?: (taskId: string) => Promise<void>;
  stepContext?: {
    orbId: string;
    stepIndex: number;
    levelIndex: number;
    tasks: string[];
    requiredTasks: string[];
    firstMessage: string;
    cta: string;
  };
  project?: {
    id?: string;
    name: string;
    description: string;
    goal?: string;
    location?: string;
    problemStatement?: string;
    targetAudience?: string;
    valueProposition?: string;
    techStack?: string;
    currentStage?: string;
  };
  // NEW: Pre-loaded journey data from parent (no need to fetch)
  journeyProgress?: any;
  journeyTasks?: any[];
  onRefreshJourneyProgress?: () => Promise<void>;
  cache?: ChatCacheRefs;
  triggerJourneyStart?: boolean;
  onJourneyStartTriggered?: () => void;
  onProjectContextUpdated?: (project: any, updatedFields: string[]) => void;
}

// Sample recommendations based on helper
const getRecommendations = (helper: HelperType) => {
  const recommendations: Record<
    HelperType,
    Array<{
      title: string;
      subtitle: string;
      description: string;
      emoji: string;
    }>
  > = {
    muse: [
      {
        title: "Problem-Solution Fit",
        subtitle: "Market Research",
        description:
          "Deep dive into validating your idea with target users and understanding pain points.",
        emoji: "🎯",
      },
      {
        title: "Competitive Analysis",
        subtitle: "Market Landscape",
        description:
          "Analyze your competitors' strengths and weaknesses to find your unique angle.",
        emoji: "🔍",
      },
      {
        title: "MVP Scope Definition",
        subtitle: "Feature Planning",
        description:
          "Identify the core 3-5 features that will make your first version valuable.",
        emoji: "✨",
      },
    ],
    architect: [
      {
        title: "Tech Stack Selection",
        subtitle: "Modern & Scalable",
        description:
          "Choose the right frameworks and tools that fit your timeline and team skills.",
        emoji: "🏗️",
      },
      {
        title: "System Architecture",
        subtitle: "Clean Design",
        description:
          "Design a maintainable architecture that can scale with your product.",
        emoji: "📐",
      },
      {
        title: "Database Schema",
        subtitle: "Data Modeling",
        description:
          "Create efficient database structures with proper relationships and indexes.",
        emoji: "🗄️",
      },
    ],
    crafter: [
      {
        title: "UI Design System",
        subtitle: "Consistent & Beautiful",
        description:
          "Build a cohesive design language with colors, typography, and components.",
        emoji: "🎨",
      },
      {
        title: "User Experience Flow",
        subtitle: "Seamless Interactions",
        description:
          "Craft intuitive user journeys that make your product easy to use.",
        emoji: "✨",
      },
      {
        title: "Brand Identity",
        subtitle: "Memorable Style",
        description:
          "Develop a unique brand personality that resonates with your audience.",
        emoji: "🌟",
      },
    ],
    hacker: [
      {
        title: "Debug & Fix Issues",
        subtitle: "Problem Solving",
        description:
          "Systematic approach to identifying and resolving technical bugs.",
        emoji: "⚡",
      },
      {
        title: "Code Optimization",
        subtitle: "Performance",
        description: "Improve code efficiency and application performance.",
        emoji: "🚀",
      },
      {
        title: "Feature Implementation",
        subtitle: "Build Fast",
        description: "Ship new features quickly with clean, maintainable code.",
        emoji: "💻",
      },
    ],
    hypebeast: [
      {
        title: "Launch Strategy",
        subtitle: "Go-to-Market",
        description:
          "Plan your product launch across multiple channels for maximum impact.",
        emoji: "🚀",
      },
      {
        title: "Content Creation",
        subtitle: "Social Media",
        description:
          "Craft compelling tweets, posts, and announcements that go viral.",
        emoji: "📱",
      },
      {
        title: "Community Building",
        subtitle: "Early Adopters",
        description:
          "Build a loyal community around your product before and after launch.",
        emoji: "👥",
      },
    ],
    sensei: [
      {
        title: "Growth Experiments",
        subtitle: "Data-Driven",
        description:
          "Design and run experiments to find sustainable growth channels.",
        emoji: "📊",
      },
      {
        title: "Retention Strategy",
        subtitle: "Keep Users Coming",
        description:
          "Implement features and flows that keep users engaged long-term.",
        emoji: "🔄",
      },
      {
        title: "Scaling to 100+",
        subtitle: "Sustainable Growth",
        description:
          "Proven tactics to grow from first users to 100+ active customers.",
        emoji: "📈",
      },
    ],
  };

  return recommendations[helper] || [];
};

export interface ChatSession {
  id: string;
  helper: HelperType;
  thread_id: string;
  title: string;
  last_message_preview?: string;
  last_message_at: string;
  created_at: string;
}

export function ChatInterface({
  helper,
  chatId,
  initialMessages = [],
  onSendMessage,
  onBackToJourney,
  tasks = [],
  onCompleteTask,
  stepContext,
  project,
  journeyProgress: propsJourneyProgress,
  journeyTasks: propsJourneyTasks = [],
  onRefreshJourneyProgress,
  cache,
  triggerJourneyStart,
  onJourneyStartTriggered,
  onProjectContextUpdated,
}: ChatInterfaceProps) {
  console.log("[ChatInterface] 🔄 COMPONENT RENDER");
  console.log("[ChatInterface] Helper:", helper);
  console.log("[ChatInterface] triggerJourneyStart prop:", triggerJourneyStart);
  console.log("[ChatInterface] stepContext:", stepContext?.orbId);
  
  // Session-based state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [tasksExpanded, setTasksExpanded] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [showHelperInfoMobile, setShowHelperInfoMobile] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [templatesExpanded, setTemplatesExpanded] = useState(false);
  const [currentToolCalls, setCurrentToolCalls] = useState<
    Array<{ tool_name: string; tool_args: any; result?: any }>
  >([]); // Active tool calls
  const currentToolCallsRef = useRef<
    Array<{ tool_name: string; tool_args: any; result?: any }>
  >([]);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isStartingJourney, setIsStartingJourney] = useState(false);
  
  // Use journey data from parent props (pre-loaded, no fetching needed)
  const journeyTasks = propsJourneyTasks;
  const journeyProgress = propsJourneyProgress;
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);
  const isHandlingJourneyStartRef = useRef(false); // Prevent concurrent journey starts
  const tasksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    currentToolCallsRef.current = currentToolCalls;
  }, [currentToolCalls]);
 
  // Message and session caches (shared from parent if provided)
  const fallbackMessageCache = useRef<Map<string, ChatMessage[]>>(new Map());
  const fallbackSessionsCache = useRef<Map<HelperType, ChatSession[]>>(new Map());
  const messageCache = cache?.messages ?? fallbackMessageCache;
  const sessionsCache = cache?.sessions ?? fallbackSessionsCache;
  // Track if we're loading a session vs streaming new messages
  const isLoadingSessionRef = useRef(false);
  const restoredSessionsRef = useRef<Set<string>>(new Set());

  const isBrowser = typeof window !== "undefined";
  const backupKey = useCallback((sessionId: string) => `chat-backup:${sessionId}`, []);

  const loadMessagesFromBackup = useCallback(
    (sessionId: string): ChatMessage[] => {
      if (!isBrowser) return [];
      try {
        const raw = window.localStorage.getItem(backupKey(sessionId));
        if (!raw) return [];
        const parsed = JSON.parse(raw) as ChatMessage[];
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error("[ChatInterface] Failed to load backup messages:", error);
        return [];
      }
    },
    [backupKey, isBrowser],
  );

  const saveMessagesToBackup = useCallback(
    (sessionId: string, msgs: ChatMessage[]) => {
      if (!isBrowser) return;
      try {
        if (!msgs || msgs.length === 0) {
          window.localStorage.removeItem(backupKey(sessionId));
          return;
        }
        window.localStorage.setItem(backupKey(sessionId), JSON.stringify(msgs));
      } catch (error) {
        console.error("[ChatInterface] Failed to save backup messages:", error);
      }
    },
    [backupKey, isBrowser],
  );

  const removeMessagesBackup = useCallback(
    (sessionId: string) => {
      if (!isBrowser) return;
      try {
        window.localStorage.removeItem(backupKey(sessionId));
      } catch (error) {
        console.error("[ChatInterface] Failed to remove backup messages:", error);
      }
    },
    [backupKey, isBrowser],
  );

  const restoreSessionMessages = useCallback(
    async (sessionId: string, messagesToRestore: ChatMessage[]) => {
      if (messagesToRestore.length === 0) return;
      try {
        const response = await fetch(`/api/chat/sessions/${sessionId}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messagesToRestore.map((msg) => ({
              role: msg.role,
              content: msg.content,
              toolCalls: msg.toolCalls ?? null,
              searchResults: msg.searchResults ?? null,
              createdAt: (msg as any)?.createdAt ?? undefined,
            })),
          }),
        });

        if (!response.ok) {
          console.warn("[ChatInterface] Failed to restore messages on server:", await response.text());
        }
      } catch (error) {
        console.error("[ChatInterface] Error restoring messages:", error);
      }
    },
    [],
  );

  const projectId = project?.id || "00000000-0000-0000-0000-000000000002";
  const templates = getTemplatesForHelper(helper);

  const syncProjectContext = useCallback(
    async (sessionId: string) => {
      if (helper !== "muse") return;
      if (!project?.id) return;

      const cached = messageCache.current.get(sessionId) || [];
      const snippet = cached
        .slice(-6)
        .map((msg) => ({ role: msg.role, content: msg.content }))
        .filter((msg) => msg.content && msg.content.trim().length > 0);

      if (snippet.length === 0) return;

      try {
        const response = await fetch(`/api/projects/${project.id}/context/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            helper,
            conversation: snippet,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.updated && data.project && onProjectContextUpdated) {
            onProjectContextUpdated(data.project, data.updatedFields || []);
          }
        } else {
          console.warn("[ChatInterface] Context sync failed", await response.text());
        }
      } catch (error) {
        console.error("[ChatInterface] Error syncing project context:", error);
      }
    },
    [helper, project?.id, messageCache, onProjectContextUpdated],
  );

  // Update helper context after significant conversation milestones
  const updateHelperContext = useCallback(
    async (sessionId: string, messageId?: string) => {
      if (!project?.id) return;

      const cached = messageCache.current.get(sessionId) || [];
      // Only update if we have at least 4 messages (2 exchanges)
      if (cached.length < 4) return;

      // Get recent conversation for analysis
      const recentConversation = cached
        .slice(-10)
        .map((msg) => ({ role: msg.role, content: msg.content }))
        .filter((msg) => msg.content && msg.content.trim().length > 0);

      if (recentConversation.length === 0) return;

      try {
        // Extract and update helper context
        const response = await fetch(`/api/projects/${project.id}/context/helper/extract`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            helper,
            projectName: project.name,
            conversation: recentConversation,
            messageId,
          }),
        });

        if (!response.ok) {
          console.warn("[ChatInterface] Helper context update failed", await response.text());
        }
      } catch (error) {
        console.error("[ChatInterface] Error updating helper context:", error);
      }
    },
    [helper, project?.id, project?.name, messageCache],
  );

  // Load messages for a specific session (with caching)
  const loadSession = useCallback(
    async (session: ChatSession) => {
      try {
        console.log("[loadSession] 📥 Loading messages for session:", session.id);
        console.log("[loadSession] Current messages count:", messages.length);

        const backupMessages = loadMessagesFromBackup(session.id);

        if (messageCache.current.has(session.id)) {
          const cachedMessages = messageCache.current.get(session.id)!;
          console.log("[loadSession] ✅ Using cached messages, count:", cachedMessages.length);
          console.log("[loadSession] Cached message IDs:", cachedMessages.map(m => m.id));
          console.log("[loadSession] Cached message roles:", cachedMessages.map(m => m.role));

          isLoadingSessionRef.current = true;
          setMessages(cachedMessages);
          setCurrentSession(session);
          setEditingSessionId(null);
          saveMessagesToBackup(session.id, cachedMessages);
          return;
        }

        console.log("[loadSession] 📡 Fetching from API (not in cache)");
        const response = await fetch(`/api/chat/sessions/${session.id}/messages`);

        if (response.ok) {
          const { messages: loadedMessages } = await response.json();
          const normalizedMessages: ChatMessage[] = Array.isArray(loadedMessages) ? loadedMessages : [];
          console.log("[loadSession] ✅ Received from API, count:", normalizedMessages.length);

          if (normalizedMessages.length === 0 && backupMessages.length > 0) {
            console.warn("[loadSession] Using backup messages for session", session.id);
            messageCache.current.set(session.id, backupMessages);
            isLoadingSessionRef.current = true;
            setMessages(backupMessages);
            setCurrentSession(session);
            setEditingSessionId(null);
            if (!restoredSessionsRef.current.has(session.id)) {
              restoredSessionsRef.current.add(session.id);
              restoreSessionMessages(session.id, backupMessages);
            }
            return;
          }

          messageCache.current.set(session.id, normalizedMessages);
          saveMessagesToBackup(session.id, normalizedMessages);

          isLoadingSessionRef.current = true;
          setMessages(normalizedMessages);
          setCurrentSession(session);
          setEditingSessionId(null);
        } else {
          console.error("[loadSession] Failed to load session, status:", response.status);
          const errorData = await response.json().catch(() => ({}));
          console.error("[loadSession] Error data:", errorData);

          if (backupMessages.length > 0) {
            console.warn("[loadSession] Falling back to backup after error for session", session.id);
            messageCache.current.set(session.id, backupMessages);
            isLoadingSessionRef.current = true;
            setMessages(backupMessages);
            setCurrentSession(session);
            setEditingSessionId(null);
          }
        }
      } catch (error) {
        console.error("[loadSession] Error loading session:", error);
        const backupMessages = loadMessagesFromBackup(session.id);
        if (backupMessages.length > 0) {
          console.warn("[loadSession] Using backup after exception for session", session.id);
          messageCache.current.set(session.id, backupMessages);
          isLoadingSessionRef.current = true;
          setMessages(backupMessages);
          setCurrentSession(session);
          setEditingSessionId(null);
        }
      }
    },
    [messages.length, loadMessagesFromBackup, messageCache, saveMessagesToBackup, restoreSessionMessages],
  );

  useEffect(() => {
    if (!currentSession) return;
    saveMessagesToBackup(currentSession.id, messages);
  }, [currentSession, messages, saveMessagesToBackup]);

  // Load all sessions for all helpers on mount (once)
  useEffect(() => {
    const loadAllSessions = async () => {
      const helpers: HelperType[] = ['muse', 'architect', 'crafter', 'hacker', 'hypebeast', 'sensei'];
      
      for (const h of helpers) {
        // Skip if already cached
        if (sessionsCache.current.has(h)) continue;
        
        try {
          console.log("[ChatInterface] Pre-loading sessions for helper:", h);
          const response = await fetch(
            `/api/chat/sessions?projectId=${projectId}&helper=${h}`,
          );
          if (response.ok) {
            const { sessions: loadedSessions } = await response.json();
            sessionsCache.current.set(h, loadedSessions || []);
            console.log(`[ChatInterface] Cached ${loadedSessions?.length || 0} sessions for ${h}`);
            
            // Also pre-load messages for the most recent session
            if (loadedSessions && loadedSessions.length > 0) {
              const mostRecentSession = loadedSessions[0];
              try {
                console.log(`[ChatInterface] Pre-loading messages for most recent ${h} session:`, mostRecentSession.id);
                const messagesResponse = await fetch(
                  `/api/chat/sessions/${mostRecentSession.id}/messages`
                );
                if (messagesResponse.ok) {
                  const { messages: loadedMessages } = await messagesResponse.json();
                  messageCache.current.set(mostRecentSession.id, loadedMessages || []);
                  saveMessagesToBackup(mostRecentSession.id, loadedMessages || []);
                  console.log(`[ChatInterface] Cached ${loadedMessages?.length || 0} messages for ${h}`);
                }
              } catch (msgError) {
                console.error(`Failed to pre-load messages for ${h}:`, msgError);
              }
            }
          }
        } catch (error) {
          console.error(`Failed to pre-load sessions for ${h}:`, error);
        }
      }
    };

    loadAllSessions();
  }, [projectId]);

  // When helper changes, use cached sessions instead of re-fetching
  useEffect(() => {
    console.log("[Helper Switch] 🔄 Effect triggered - helper:", helper, "isStartingJourney:", isStartingJourney, "triggerJourneyStart:", triggerJourneyStart);
    
    // Skip session loading if we're starting a journey OR about to start one
    // This prevents race conditions and message duplication
    if (isStartingJourney || triggerJourneyStart) {
      console.log("[Helper Switch] ⏭️ Skipping session load, journey is starting or will start");
      return;
    }
    
    // Don't clear cache when switching helpers - just switch to that helper's sessions
    const cachedSessions = sessionsCache.current.get(helper) || [];
    console.log("[Helper Switch] Switched to helper:", helper, "with", cachedSessions.length, "cached sessions");
    setSessions(cachedSessions);
    
    // If there are sessions, load the most recent one
    if (cachedSessions.length > 0) {
      console.log("[Helper Switch] Loading most recent session:", cachedSessions[0].id);
      
      // Check current messages before loading
      setMessages((prevMessages) => {
        console.log("[Helper Switch] Current messages before loadSession:", prevMessages.length);
        return prevMessages;
      });
      
      loadSession(cachedSessions[0]);
    } else {
      // No sessions for this helper yet
      console.log("[Helper Switch] No sessions for this helper, clearing UI");
      setMessages((prevMessages) => {
        console.log("[Helper Switch] Clearing messages, previous count:", prevMessages.length);
        return [];
      });
      setCurrentSession(null);
    }
    
    setIsLoadingSessions(false);
    
    // Journey progress is now provided by parent (pre-loaded), no need to fetch
    console.log("[ChatInterface] Using pre-loaded journey data:", {
      tasksCount: journeyTasks.length,
      hasProgress: !!journeyProgress,
      stepContext,
    });
  }, [helper, loadSession, isStartingJourney, triggerJourneyStart]);

  // Close templates dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        templatesRef.current &&
        !templatesRef.current.contains(event.target as Node)
      ) {
        setTemplatesExpanded(false);
      }
    };

    if (templatesExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [templatesExpanded]);

  // Close tasks dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tasksRef.current &&
        !tasksRef.current.contains(event.target as Node)
      ) {
        setTasksExpanded(false);
      }
    };

    if (tasksExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [tasksExpanded]);

  // Auto-trigger journey start when coming from "Let's go" button
  const hasTriggeredRef = useRef<Record<HelperType, boolean>>({
    muse: false,
    architect: false,
    crafter: false,
    hacker: false,
    hypebeast: false,
    sensei: false,
  });
  const currentSessionRef = useRef(currentSession);
  
  // Keep ref in sync with current session
  useEffect(() => {
    currentSessionRef.current = currentSession;
  }, [currentSession]);
  
  // Reset trigger ref when helper changes
  useEffect(() => {
    console.log("[Auto-trigger] 🔄 Helper changed to", helper, "- resetting trigger ref and lock");
    hasTriggeredRef.current[helper] = false;
    isHandlingJourneyStartRef.current = false; // Reset lock on helper change
  }, [helper]);
  
  useEffect(() => {
    console.log("[Auto-trigger] 🔍 Effect check - triggerJourneyStart:", triggerJourneyStart, "hasTriggered for", helper, ":", hasTriggeredRef.current[helper], "messages.length:", messages.length);
    
    if (triggerJourneyStart && !hasTriggeredRef.current[helper]) {
      // Check if there are already messages - if so, don't auto-start (user is returning to active chat)
      if (messages.length > 0) {
        console.log("[ChatInterface] ⏭️ Skipping auto-trigger - session already has", messages.length, "messages");
        hasTriggeredRef.current[helper] = true; // Mark as triggered to prevent future attempts
        
        // Clear the trigger flag
        if (onJourneyStartTriggered) {
          onJourneyStartTriggered();
        }
        return;
      }
      
      console.log("[ChatInterface] 🚀 Auto-trigger FIRING for helper:", helper);
      
      hasTriggeredRef.current[helper] = true; // Prevent duplicate triggers for this helper
      
      // Clear the trigger flag immediately (no loading state to manage)
      if (onJourneyStartTriggered) {
        onJourneyStartTriggered();
      }
      
      // Start journey immediately for smooth, fast experience
      console.log("[ChatInterface] ⚡ Executing auto-start journey NOW (no delay)");
      
      // Use requestAnimationFrame for smooth transition to next paint cycle
      requestAnimationFrame(() => {
        try {
          // handleStartJourney will show its own loading state (streaming animation)
          handleStartJourney(currentSessionRef.current || undefined);
          console.log("[ChatInterface] ✅ handleStartJourney called successfully");
        } catch (error) {
          console.error("[ChatInterface] ❌ Error calling handleStartJourney:", error);
        }
      });
    }
    
    // Reset the ref when trigger is cleared
    if (!triggerJourneyStart && hasTriggeredRef.current[helper]) {
      console.log("[ChatInterface] 🔄 Resetting trigger ref for", helper);
      hasTriggeredRef.current[helper] = false;
    }
  }, [triggerJourneyStart, helper, onJourneyStartTriggered, messages.length]);

  // Delete a session
  const deleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this chat session?")) {
      return;
    }
    try {
      console.log("[deleteSession] Deleting session:", sessionId);
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("[deleteSession] Session deleted from DB successfully");
        
        // Remove from local message cache
        if (messageCache.current.has(sessionId)) {
          messageCache.current.delete(sessionId);
          console.log("[deleteSession] Removed from local message cache");
        }
        removeMessagesBackup(sessionId);
        restoredSessionsRef.current.delete(sessionId);
        
        // Remove from sessions list
        setSessions((prev) => {
          const updated = prev.filter((s) => s.id !== sessionId);
          console.log("[deleteSession] Updated sessions list, remaining:", updated.length);
          return updated;
        });
        
        // Update sessions cache for the current helper
        sessionsCache.current.set(helper, 
          (sessionsCache.current.get(helper) || []).filter(s => s.id !== sessionId)
        );
        console.log("[deleteSession] Updated sessions cache for helper:", helper);
        
        // Clear current session if it was deleted
        if (currentSession?.id === sessionId) {
          setCurrentSession(null);
          setMessages([]);
          console.log("[deleteSession] Cleared current session from UI");
        }
      } else {
        console.error("[deleteSession] Failed to delete session, status:", response.status);
      }
    } catch (error) {
      console.error("[deleteSession] Failed to delete session:", error);
    }
  };

  // Update session title
  const updateSessionTitle = async (sessionId: string, newTitle: string) => {
    if (!newTitle.trim()) {
      setEditingSessionId(null);
      return;
    }
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      if (response.ok) {
        // Update in sessions list
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle } : s)),
        );
        
        // Update in sessions cache for all helpers (might be in different helper's cache)
        for (const [helperKey, sessions] of sessionsCache.current.entries()) {
          const updatedSessions = sessions.map((s) =>
            s.id === sessionId ? { ...s, title: newTitle } : s
          );
          sessionsCache.current.set(helperKey, updatedSessions);
        }
        
        // Update current session if it was edited
        if (currentSession?.id === sessionId) {
          setCurrentSession({ ...currentSession, title: newTitle });
        }
        setEditingSessionId(null);
      }
    } catch (error) {
      console.error("Failed to update session title:", error);
    }
  };

  // Save a message to the database
  const saveMessage = async (
    sessionId: string,
    role: "user" | "assistant",
    content: string,
    toolCalls?: any,
    searchResults?: { results: SearchResult[]; query: string; summary?: string },
  ) => {
    try {
      console.log("[saveMessage] Saving message:", {
        sessionId,
        role,
        contentLength: content.length,
        hasToolCalls: !!toolCalls,
        hasSearchResults: !!searchResults,
      });
      const response = await fetch(`/api/chat/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, content, toolCalls, searchResults }),
      });
      if (!response.ok) {
        console.error(
          "[saveMessage] Failed to save message, status:",
          response.status,
        );
      } else {
        console.log("[saveMessage] ✅ Message saved successfully to database");
        // Note: We do NOT delete the cache here because:
        // 1. The cache was already updated immediately after streaming (in handleStartJourney)
        // 2. Deleting it creates a race condition where switching helpers might load stale/duplicate data
        // 3. The cache already contains the correct, current state
        console.log("[saveMessage] 💾 Cache preserved (contains current correct state)");
      }
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  };

  // Calculate task completion stats
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length;

  const helperData = getHelperById(helper);

  // Helper-specific gradient themes
  const helperThemes: Record<
    HelperType,
    { dark: string; light: string; button: string; lightEnd: string }
  > = {
    muse: {
      dark: "from-purple-500 via-pink-500 to-rose-500",
      light: "from-purple-100 via-pink-100 to-rose-100",
      button: "from-purple-400 via-pink-400 to-rose-400",
      lightEnd: "bg-rose-100",
    },
    architect: {
      dark: "from-blue-500 via-cyan-500 to-teal-500",
      light: "from-blue-100 via-cyan-100 to-teal-100",
      button: "from-blue-400 via-cyan-400 to-teal-400",
      lightEnd: "bg-teal-100",
    },
    crafter: {
      dark: "from-pink-500 via-rose-500 to-red-500",
      light: "from-pink-100 via-rose-100 to-red-100",
      button: "from-pink-400 via-rose-400 to-red-400",
      lightEnd: "bg-red-100",
    },
    hacker: {
      dark: "from-green-500 via-emerald-500 to-teal-500",
      light: "from-green-100 via-emerald-100 to-teal-100",
      button: "from-green-400 via-emerald-400 to-teal-400",
      lightEnd: "bg-teal-100",
    },
    hypebeast: {
      dark: "from-orange-500 via-red-500 to-pink-500",
      light: "from-orange-100 via-red-100 to-pink-100",
      button: "from-orange-400 via-red-400 to-pink-400",
      lightEnd: "bg-pink-100",
    },
    sensei: {
      dark: "from-amber-500 via-yellow-500 to-orange-500",
      light: "from-amber-100 via-yellow-100 to-orange-100",
      button: "from-amber-400 via-yellow-400 to-orange-400",
      lightEnd: "bg-orange-100",
    },
  };

  const currentTheme = helperThemes[helper];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToLastMessage = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    // If loading a session, scroll to top of last message
    if (isLoadingSessionRef.current) {
      isLoadingSessionRef.current = false;
      scrollToLastMessage();
    } else {
      // Otherwise, scroll to bottom (for streaming)
    scrollToBottom();
    }
  }, [messages]);

  // Create a new chat session
  const handleNewChat = async () => {
    try {
      console.log("[handleNewChat] Creating new session for helper:", helper);
      const response = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          helper,
          title: "New Chat",
        }),
      });

      if (response.ok) {
        const { session } = await response.json();
        console.log("[handleNewChat] Received session from API:", {
          id: session?.id,
          helper,
          title: session?.title,
          threadId: session?.thread_id,
        });
        
        setSessions((prev) => [session, ...prev]);
        
        // Add new session to the sessions cache
        const cachedSessions = sessionsCache.current.get(helper) || [];
        sessionsCache.current.set(helper, [session, ...cachedSessions]);
        console.log("[handleNewChat] Added new session to cache for helper:", helper);
        console.log("[handleNewChat] Cache now contains", sessionsCache.current.get(helper)?.length || 0, "sessions");
        
        // Set current session and clear messages for fresh chat
        setCurrentSession(session);
        setMessages([]);
        setInput("");
        console.log("[handleNewChat] New session ready for user to start typing");
      } else {
        console.error("[handleNewChat] Failed to create session, status:", response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error("[handleNewChat] Error:", errorData);
      }
    } catch (error) {
      console.error("[handleNewChat] Error creating new session:", error);
    }
  };

  const handleStartJourney = async (session?: ChatSession) => {
    console.log("[handleStartJourney] 🎬 STARTING - session provided:", !!session, "currentSession:", !!currentSession);
    
    // CRITICAL: Prevent concurrent executions (React Strict Mode or rapid clicks)
    if (isHandlingJourneyStartRef.current) {
      console.log("[handleStartJourney] ⚠️ BLOCKED - Already executing, preventing duplicate");
      return;
    }
    
    isHandlingJourneyStartRef.current = true;
    console.log("[handleStartJourney] 🔒 Lock acquired");
    
    // Set flag to prevent session loading from overriding our assistant message
    setIsStartingJourney(true);
    
    // Create session if one doesn't exist
    let activeSession = session || currentSession;
    console.log("[handleStartJourney] Active session:", activeSession?.id);
    
    if (!activeSession) {
      console.log("[handleStartJourney] 📝 Creating new session for", helper);
      
      try {
        const response = await fetch("/api/chat/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            helper,
            title: "New Chat",
          }),
        });

        if (response.ok) {
          const { session: newSession } = await response.json();
          activeSession = newSession;
          console.log("[handleStartJourney] ✅ Session created:", newSession.id);
          
          setSessions((prev) => [newSession, ...prev]);
          setCurrentSession(newSession);
          
          // Update cache with new session
          const existingCache = sessionsCache.current.get(helper) || [];
          sessionsCache.current.set(helper, [newSession, ...existingCache]);
          console.log("[handleStartJourney] Added new session to cache for", helper);
        } else {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          console.error("[handleStartJourney] ❌ Failed to create session:", response.status, errorData);
          alert(
            `Failed to create session: ${errorData.error || "Unknown error"}. Check browser console and terminal for details.`,
          );
          setIsStartingJourney(false);
          isHandlingJourneyStartRef.current = false; // Release lock on error
          return;
        }
      } catch (error) {
        console.error("[handleStartJourney] ❌ Error creating session:", error);
        setIsStartingJourney(false);
        isHandlingJourneyStartRef.current = false; // Release lock on error
        return;
      }
    }

    // Journey initialization already handled by dashboard for faster UX
    // Just refresh progress in background (non-blocking)
    if (onRefreshJourneyProgress) {
      console.log("[handleStartJourney] 🔄 Refreshing journey progress in background");
      onRefreshJourneyProgress().catch(err => 
        console.error("[handleStartJourney] Error refreshing progress:", err)
      );
    }

    setIsLoading(true);
    setIsStreaming(true);

    try {
      // Create empty assistant message that will be filled by streaming
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "",
      };

      // Add empty assistant message to state (with duplicate check)
      setMessages((prev) => {
        console.log("[handleStartJourney] Adding assistant message, current messages count:", prev.length);
        
        // Check if we already have an assistant message with no content (prevents duplicates)
        const hasEmptyAssistant = prev.some(m => m.role === 'assistant' && m.content === '');
        if (hasEmptyAssistant) {
          console.log("[handleStartJourney] ⚠️ Empty assistant message already exists, skipping duplicate");
          return prev;
        }
        
        return [...prev, assistantMessage];
      });

      // Call API with startJourney flag to generate opening message
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          helper,
          message: "", // Empty message signals we want opening message
          threadId: activeSession?.thread_id,
          projectId,
          startJourney: true, // Special flag for opening message
          context: {
            projectName: project?.name || "Untitled Project",
            projectDescription: project?.description || "A new project",
            projectTechStack: project?.techStack,
            projectStage: project?.currentStage,
            projectGoal: project?.goal,
            problemStatement: project?.problemStatement,
            targetAudience: project?.targetAudience,
            valueProposition: project?.valueProposition,
            currentStep: stepContext
              ? {
                  levelTitle: `Level ${stepContext.levelIndex + 1}`,
                  stepTitle: stepContext.orbId,
                  cta: stepContext.cta,
                }
              : undefined,
            tasks: tasks.length > 0 ? tasks : undefined,
            requiredTasks: stepContext?.requiredTasks,
            // Add recent chat history
            recentMessages: messages.slice(-4).map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from API");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            if (data.type === "text" && data.content) {
              // First character - stop showing thinking indicator
              if (assistantMessage.content === "") {
                setIsStreaming(false);
              }

              assistantMessage.content += data.content;

              // Only update if we're still on this session
              setMessages((prev) => {
                const msgs = [...prev];
                // Safety check: ensure we have messages and last message exists
                if (msgs.length === 0 || !msgs[msgs.length - 1]) {
                  console.warn("[Chat] No message to update during streaming, messages count:", msgs.length);
                  return msgs;
                }
                msgs[msgs.length - 1] = {
                  ...msgs[msgs.length - 1],
                  content: (msgs[msgs.length - 1].content || "") + data.content,
                };
                return msgs;
              });
            }

            if (data.type === "tool_call") {
              // Agent is using a tool
              setCurrentToolCalls((prev) => [
                ...prev,
                {
                  tool_name: data.tool_name,
                  tool_args: data.tool_args,
                },
              ]);
            }

            if (data.type === "tool_result") {
              // Tool execution result
              setCurrentToolCalls((prev) =>
                prev.map((tc) =>
                  tc.tool_name === data.tool_name && !tc.result
                    ? { ...tc, result: data.result }
                    : tc,
                ),
              );

              if (data.tool_name === "web_search" && data.result?.data) {
                const resultData = data.result.data;
                const resultsArray = resultData.results || [];
                if (resultsArray.length > 0) {
                  setMessages((prev) => {
                    const msgs = [...prev];
                    if (
                      msgs.length > 0 &&
                      msgs[msgs.length - 1].role === "assistant"
                    ) {
                      msgs[msgs.length - 1] = {
                        ...msgs[msgs.length - 1],
                        searchResults: {
                          results: resultsArray,
                          query: resultData.query,
                          summary: resultData.summary,
                          citations: resultData.citations,
                        },
                      };
                    }
                    return msgs;
                  });
                }
              }
            }

            if (data.type === "done") {
              // Get final content from state (not from assistantMessage ref which is stale)
              console.log(
                "[handleStartJourney] Stream done, checking message state",
              );
              let finalContent = "";
              let finalSearchResults: ChatMessage["searchResults"] | undefined;

              setMessages((prev) => {
                const copied = prev.map((msg) => ({ ...msg }));
                const finalMsg = copied[copied.length - 1];
                finalContent = finalMsg?.content || "";
                finalSearchResults = finalMsg?.searchResults;

                if (activeSession && copied.length > 0) {
                  console.log("[handleStartJourney] 💾 Caching messages for session:", activeSession.id);
                  console.log("[handleStartJourney] 💾 Caching message count:", copied.length);
                  console.log("[handleStartJourney] 💾 Message IDs being cached:", copied.map(m => m.id));
                  console.log("[handleStartJourney] 💾 Message roles being cached:", copied.map(m => m.role));
                  messageCache.current.set(activeSession.id, copied);
                  console.log("[handleStartJourney] 💾 Cache updated successfully");
                }

                return prev;
              });

              if (activeSession && finalContent.length > 0) {
                console.log(
                  "[handleStartJourney] Saving assistant message...",
                );
                const toolCallsSnapshot =
                  currentToolCallsRef.current.length > 0
                    ? currentToolCallsRef.current.map((tc) => ({ ...tc }))
                    : undefined;
                await saveMessage(
                  activeSession.id,
                  "assistant",
                  finalContent,
                  toolCallsSnapshot,
                  finalSearchResults,
                );
                syncProjectContext(activeSession.id).catch((error) =>
                  console.error("[handleStartJourney] Context sync error", error),
                );
                updateHelperContext(activeSession.id).catch((error) =>
                  console.error("[handleStartJourney] Helper context update error", error),
                );
              } else {
                console.log(
                  "[handleStartJourney] Not saving - activeSession:",
                  !!activeSession,
                  "content length:",
                  finalContent.length,
                );
              }

              setCurrentToolCalls([]);
              setIsStreaming(false);
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error("[handleStartJourney] ❌ Failed to start journey:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error starting our conversation. Please try again!",
      };

      // Add error message
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      console.log("[handleStartJourney] 🏁 FINALLY block - cleaning up flags");
      console.log("[handleStartJourney] Current messages count:", messages.length);
      setIsLoading(false);
      setIsStreaming(false);
      setIsStartingJourney(false); // Clear flag to allow normal session loading
      isHandlingJourneyStartRef.current = false; // Release lock
      console.log("[handleStartJourney] 🔓 Lock released");
      console.log("[handleStartJourney] ✅ Journey start complete");
    }
  };

  const handleSubmitMessage = async (messageContent: string) => {
    // Create session if one doesn't exist
    let activeSession = currentSession;
    if (!activeSession) {
      const response = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          helper,
          title:
            messageContent.substring(0, 50) +
            (messageContent.length > 50 ? "..." : ""),
        }),
      });

      if (response.ok) {
        const { session: newSession } = await response.json();
        activeSession = newSession;
        setSessions((prev) => [newSession, ...prev]);
        setCurrentSession(newSession);
      } else {
        console.error("Failed to create session");
        return;
      }
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
    };

    // Add user message to state
    setMessages((prev) => [...prev, userMessage]);

    // Save user message to database
    if (activeSession) {
      await saveMessage(activeSession.id, "user", messageContent);
    }

    setIsLoading(true);

    try {
      if (onSendMessage) {
        await onSendMessage(messageContent);
      } else {
        // Call the OpenAI API via our backend
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "",
        };

        // Add empty assistant message to state
        setMessages((prev) => [...prev, assistantMessage]);
        setIsStreaming(true);

        // Make API call to chat endpoint
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            helper,
            message: messageContent,
            threadId: activeSession?.thread_id,
            projectId,
            context: {
              // TIER 1: Essential Project Identity (always sent)
              projectName: project?.name || "My First Project",
              projectDescription:
                project?.description ||
                "Building something amazing with Codyssey",
              projectGoal: project?.goal,
              projectLocation: project?.location,
              projectStage: project?.currentStage,
              
              // TIER 2: Rich Context Details (provides deep understanding)
              problemStatement: project?.problemStatement,
              targetAudience: project?.targetAudience,
              valueProposition: project?.valueProposition,
              techStack: project?.techStack,
              
              // TIER 3: Journey Intelligence (auto-generated)
              currentStep: stepContext
                ? {
                    levelTitle: `Level ${stepContext.levelIndex + 1}`,
                    stepTitle: stepContext.orbId,
                    cta: stepContext.cta,
                  }
                : undefined,
              tasks: tasks.length > 0 ? tasks : undefined,
              requiredTasks: stepContext?.requiredTasks,
              journeyProgress: journeyProgress,
              
              // Conversation awareness
              recentMessages: messages.slice(-4).map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response from API");
        }

        // Handle agentic streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response body");
        }

        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6));

              if (data.type === "text" && data.content) {
                if (assistantMessage.content === "") {
                  setIsStreaming(false);
                }

              assistantMessage.content += data.content;

                // Only update if we're still on this session
                setMessages((prev) => {
                  const msgs = [...prev];
                  msgs[msgs.length - 1] = {
                    ...msgs[msgs.length - 1],
                    content: msgs[msgs.length - 1].content + data.content,
                  };
                  return msgs;
                });
              }

              if (data.type === "tool_call") {
                setCurrentToolCalls((prev) => [
                  ...prev,
                  {
                    tool_name: data.tool_name,
                    tool_args: data.tool_args,
                  },
                ]);
              }

              if (data.type === "tool_result") {
                setCurrentToolCalls((prev) =>
                  prev.map((tc) =>
                    tc.tool_name === data.tool_name && !tc.result
                      ? { ...tc, result: data.result }
                      : tc,
                  ),
                );

                if (data.tool_name === "web_search" && data.result?.data) {
                  const resultData = data.result.data;
                  const resultsArray = resultData.results || [];
                  if (resultsArray.length > 0) {
                    setMessages((prev) => {
                      if (currentSession?.id !== activeSession?.id) {
                        return prev;
                      }
                      const msgs = [...prev];
                      if (
                        msgs.length > 0 &&
                        msgs[msgs.length - 1].role === "assistant"
                      ) {
                        msgs[msgs.length - 1] = {
                          ...msgs[msgs.length - 1],
                          searchResults: {
                            results: resultsArray,
                            query: resultData.query,
                            summary: resultData.summary,
                            citations: resultData.citations,
                          },
                        };
                      }
                      return msgs;
                    });
                  }
                }
              }

              if (data.type === "done") {
                // Get final content from state (not from assistantMessage ref which is stale)
                console.log(
                  "[handleSubmitMessage] Stream done, checking message state",
                );
                let finalContent = "";
                let finalSearchResults: ChatMessage["searchResults"] | undefined;

                setMessages((prev) => {
                  const copied = prev.map((msg) => ({ ...msg }));
                  const finalMsg = copied[copied.length - 1];
                  finalContent = finalMsg?.content || "";
                  finalSearchResults = finalMsg?.searchResults;

                  if (activeSession && copied.length > 0) {
                    console.log(
                      "[handleSubmitMessage] 💾 Caching messages for session:",
                      activeSession.id,
                    );
                    messageCache.current.set(activeSession.id, copied);
                  }

                  return prev;
                });

                if (activeSession && finalContent.length > 0) {
                  console.log(
                    "[handleSubmitMessage] Saving assistant message...",
                  );
                  const toolCallsSnapshot =
                    currentToolCallsRef.current.length > 0
                      ? currentToolCallsRef.current.map((tc) => ({ ...tc }))
                      : undefined;
                  await saveMessage(
                    activeSession.id,
                    "assistant",
                    finalContent,
                    toolCallsSnapshot,
                    finalSearchResults,
                  );
                  syncProjectContext(activeSession.id).catch((error) =>
                    console.error("[handleSubmitMessage] Context sync error", error),
                  );
                  updateHelperContext(activeSession.id).catch((error) =>
                    console.error("[handleSubmitMessage] Helper context update error", error),
                  );
                } else {
                  console.log(
                    "[handleSubmitMessage] Not saving - activeSession:",
                    !!activeSession,
                    "content length:",
                    finalContent.length,
                  );
                }

                setCurrentToolCalls([]);
                setIsStreaming(false);
                break;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again!",
      };

      // Add error message
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input.trim();
    setInput("");

    await handleSubmitMessage(currentInput);
  };

  const handleGeneratePrompt = async () => {
    setIsGeneratingPrompt(true);
    setShowPromptModal(true);
    setGeneratedPrompt("");

    try {
      const response = await fetch("/api/prompt/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          currentTask: input.trim() || undefined,
          promptType: "full",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate prompt");
      }

      const { prompt } = await response.json();
      setGeneratedPrompt(prompt);
    } catch (error) {
      console.error("Failed to generate prompt:", error);
      setGeneratedPrompt("Failed to generate prompt. Please try again.");
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleTemplateSelect = (template: PromptTemplate) => {
    setInput(template.prompt);
    setTemplatesExpanded(false);
    // Auto-submit the template prompt
    setTimeout(() => {
      const event = new Event('submit', { bubbles: true });
      const form = document.querySelector('form[class*="flex items-end"]') as HTMLFormElement;
      if (form) {
        form.dispatchEvent(event);
      }
    }, 0);
  };

  return (
    <div className="flex h-full items-center justify-center bg-white p-2 md:p-3">
      {/* Scrollbar Styles for Chat */}
      <style jsx>{`
        .chat-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }

        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        .chat-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }

        /* Sidebar scrollbar - lighter for dark backgrounds */
        .chat-sidebar-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .chat-sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.4);
          border-radius: 3px;
        }

        .chat-sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.6);
        }
      `}</style>

      <div className="flex h-full max-h-full w-full max-w-7xl overflow-hidden rounded-2xl shadow-2xl md:rounded-3xl">
        {/* Left Column - Helper Info Card with Gradient (Hidden on Mobile) */}
        <div
          className={`hidden w-64 flex-col bg-gradient-to-b ${currentTheme.dark} p-6 text-white md:flex`}
        >
          {/* Helper Title & Subtitle with Back Arrow */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex-1">
              <h2 className="mb-1 text-2xl font-bold text-white drop-shadow-md">
                {helperData.name}
              </h2>
              <p className="text-sm font-medium text-white/90">
                {helperData.title}
              </p>
            </div>
            <button
              onClick={onBackToJourney}
              className="ml-4 flex items-center justify-center rounded-lg p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          {/* + New Chat Button */}
          <button
            onClick={handleNewChat}
            disabled={isLoading}
            className={`mb-6 w-full rounded-full bg-gradient-to-r ${currentTheme.button} py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            + New Chat
          </button>

          {/* Helper Graphic Placeholder Card */}
          <div className="mb-6 flex justify-center rounded-2xl bg-white/10 p-10 shadow-lg backdrop-blur-sm">
            <div className="text-7xl">{helperData.emoji}</div>
          </div>

          {/* Chat History - Modern Scrollbar */}
          <div
            className="flex-1 space-y-2 overflow-y-auto pr-1 chat-sidebar-scrollbar"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255, 255, 255, 0.4) transparent",
            }}
          >
            <style>{`
            ::-webkit-scrollbar {
              width: 6px;
            }
            ::-webkit-scrollbar-track {
              background: transparent;
            }
            ::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.4);
              border-radius: 3px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.6);
            }
          `}</style>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
              Chat History
            </p>
            <div className="space-y-2">
              {isLoadingSessions ? (
                <div className="rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <p className="text-xs text-white/60">Loading...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <p className="text-xs text-white/60">No previous chats</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group rounded-lg transition-all relative ${
                      currentSession?.id === session.id
                        ? "bg-white/20 backdrop-blur-sm"
                        : "bg-white/10 backdrop-blur-sm hover:bg-white/15"
                    }`}
                  >
                    {editingSessionId === session.id ? (
                      // Edit mode - minimalistic with just input and save icon
                      <div className="p-3 flex items-center gap-2">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          placeholder="Title..."
                          className="flex-1 min-w-0 bg-white/20 text-white text-xs rounded px-2 py-1.5 placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 truncate"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateSessionTitle(session.id, editingTitle);
                            } else if (e.key === "Escape") {
                              setEditingSessionId(null);
                            }
                          }}
                        />
                        <button
                          onClick={() =>
                            updateSessionTitle(session.id, editingTitle)
                          }
                          className="text-green-400 hover:text-green-300 transition-colors flex-shrink-0"
                          title="Save title"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          onClick={() => setEditingSessionId(null)}
                          className="text-white/60 hover:text-white/80 transition-colors flex-shrink-0"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      // Normal mode
                      <>
                        <button
                          onClick={() => loadSession(session)}
                          className="w-full px-4 py-3 text-left"
                        >
                          <p className="text-xs font-medium text-white truncate pr-16">
                            {session.title}
                          </p>
                          {session.last_message_preview && (
                            <p className="text-[10px] text-white/60 truncate mt-1">
                              {session.last_message_preview}
                            </p>
                          )}
                          <p className="text-[9px] text-white/40 mt-1">
                            {new Date(
                              session.last_message_at,
                            ).toLocaleDateString()}
                          </p>
                        </button>

                        {/* Action icons - top right corner, visible on hover */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingSessionId(session.id);
                              setEditingTitle(session.title);
                            }}
                            className="p-1.5 text-white/60 hover:text-white hover:bg-white/20 rounded transition-colors"
                            title="Edit title"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => deleteSession(session.id)}
                            className="p-1.5 text-white/60 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                            title="Delete session"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Chat Area with Light Gradient (Mobile optimized) */}
        <div
          className={`flex flex-1 flex-col bg-gradient-to-b ${currentTheme.light} relative`}
        >
          {/* Mobile Header with Back Button and Info Icon */}
          <div className="flex items-center justify-between border-b border-white/20 px-3 py-2.5 md:hidden md:border-b-0 md:p-0">
            <button
              onClick={() => setShowHelperInfoMobile(!showHelperInfoMobile)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-200"
              title="View helper info"
            >
              <Info size={18} />
            </button>
            <div className="flex-1 px-2">
              <h3 className="truncate text-center text-sm font-bold text-zinc-800">
                {helperData.name}
              </h3>
            </div>
            <button
              onClick={onBackToJourney}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-200"
              title="Back to journey"
            >
              <ArrowLeft size={18} />
            </button>
          </div>

          {/* Mobile Helper Info Card - Slide down when info button clicked */}
          {showHelperInfoMobile && (
            <div
              className={`md:hidden border-b border-white/20 bg-gradient-to-br ${currentTheme.dark} p-4 animate-in slide-in-from-top-2 rounded-b-3xl`}
            >
              <div className="flex items-center gap-2">
                <div className="text-3xl">{helperData.emoji}</div>
                <div>
                  <h3 className="font-bold text-white">{helperData.name}</h3>
                  <p className="text-xs text-white/80">{helperData.title}</p>
                </div>
              </div>
            </div>
          )}

          {/* Helper Level Tasks - Floating Top Left (outside scroll) - Only show if journey is active */}
          {journeyTasks.length > 0 && (
            <div
              ref={tasksRef}
              className="absolute top-3 left-4 z-20 md:top-4 md:left-6"
            >
              <button
                onClick={() => setTasksExpanded(!tasksExpanded)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r ${currentTheme.button} shadow-lg hover:shadow-xl transition-all hover:scale-110 md:gap-2 md:px-4 md:py-2.5`}
              >
                <ListTodo className="h-3.5 w-3.5 text-white md:h-4 md:w-4" />
                <span className="text-[11px] font-bold text-white md:text-xs">
                  {`${journeyTasks.filter(t => t.is_completed).length}/${journeyTasks.length}`}
                </span>
                <svg
                  className={`w-2.5 h-2.5 text-white transition-transform md:w-3 md:h-3 ${tasksExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {tasksExpanded && (
                <div className="absolute top-full left-0 mt-1.5 w-64 rounded-lg bg-white shadow-lg border border-zinc-200 z-50 overflow-hidden md:mt-2 md:w-72 md:rounded-xl md:shadow-xl">
                  <div className="max-h-64 overflow-y-auto md:max-h-80">
                    {journeyTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between gap-1 px-2.5 py-2 border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition-colors text-[10px] md:gap-2 md:px-3 md:py-2.5 md:text-[11px]"
                      >
                        <div className="flex items-center gap-1.5 flex-1 min-w-0 md:gap-2">
                          <div
                            className={`flex h-3 w-3 items-center justify-center rounded text-[7px] font-bold text-white flex-shrink-0 md:h-3.5 md:w-3.5 md:text-[8px] ${
                              task.is_completed
                                ? "bg-gradient-to-br from-green-400 to-emerald-500"
                                : task.is_required
                                ? "bg-gradient-to-br from-blue-400 to-indigo-500"
                                : "bg-gradient-to-br from-amber-400 to-orange-500"
                            }`}
                          >
                            {task.is_completed ? "✓" : task.is_required ? "!" : "○"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-zinc-800 truncate">
                              {task.task_title}
                            </p>
                            {task.task_goal && (
                              <p className="text-[9px] text-zinc-500 truncate md:text-[10px]">
                                {task.task_goal}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Icons */}
                        <div className="flex items-center gap-0.5 flex-shrink-0 md:gap-1">
                          {/* Send to Helper */}
                          <button
                            onClick={() =>
                              setInput(
                                `Help me with: ${task.task_title}. ${task.task_goal || ""}`,
                              )
                            }
                            className="p-0.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors md:p-1"
                            title="Send to helper"
                          >
                            <Send size={10} className="md:size-3" />
                          </button>

                          {/* Mark Complete */}
                          {!task.is_completed && (
                            <button
                              onClick={async () => {
                                setCompletingTaskId(task.id);
                                try {
                                  const response = await fetch(
                                    `/api/journey/tasks/${task.id}/complete`,
                                    { method: "POST" }
                                  );
                                  if (response.ok) {
                                    // Refresh all journey progress from parent
                                    if (onRefreshJourneyProgress) {
                                      await onRefreshJourneyProgress();
                                    }
                                  }
                                } catch (error) {
                                  console.error(
                                    "Failed to complete task:",
                                    error,
                                  );
                                } finally {
                                  setCompletingTaskId(null);
                                }
                              }}
                              disabled={completingTaskId === task.id}
                              className="p-0.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors disabled:opacity-50 md:p-1"
                              title="Mark as complete"
                            >
                              {completingTaskId === task.id ? (
                                <Loader2
                                  size={10}
                                  className="animate-spin md:size-3"
                                />
                              ) : (
                                <CheckCircle2 size={10} className="md:size-3" />
                              )}
                            </button>
                          )}
                        </div>

                        <span className="text-[8px] font-medium text-zinc-500 whitespace-nowrap ml-1 md:text-[9px]">
                          {task.xp_reward}xp
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions Floating Icon Row - Fixed position outside scroll */}
          <div
            ref={templatesRef}
            className="absolute top-3 right-4 z-20 md:top-4 md:right-6"
          >
            <div className="flex items-center gap-2">
              {/* Expanded Template Icons - Slide from right */}
              <div
                className={`flex items-center gap-2 transition-all duration-300 ease-in-out origin-right ${
                  templatesExpanded
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0 w-0"
                }`}
              >
                {templatesExpanded &&
                  templates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleTemplateSelect(template)}
                      className="group relative flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all hover:scale-110 md:h-9 md:w-9"
                      title={template.title}
                    >
                      <span className="text-lg md:text-xl">
                        {template.icon}
                      </span>

                      {/* Tooltip below icon */}
                      <div className="absolute top-full mt-2 hidden group-hover:block">
                        <div className="bg-zinc-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                          {/* Arrow pointing up */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-1px]">
                            <div className="border-4 border-transparent border-b-zinc-900"></div>
                          </div>
                          <div className="font-semibold">{template.title}</div>
                          <div className="text-zinc-300 text-[10px] mt-0.5">
                            {template.category}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>

              {/* Toggle Icon Button - Always visible with gradient */}
              <button
                onClick={() => setTemplatesExpanded(!templatesExpanded)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-blue-400 shadow-lg transition-all hover:scale-110 hover:shadow-xl md:h-9 md:w-9"
                title="Quick Actions"
              >
                <Sparkles
                  className={`h-4 w-4 md:h-4.5 md:w-4.5 transition-transform duration-300 text-white ${
                    templatesExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Messages Area - Bottom padding prevents content from going under input */}
          <div
            className="flex-1 overflow-y-auto chat-scrollbar px-3 py-3 pb-28 relative md:px-6 md:py-6 md:pb-32"
          >
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-2xl text-center px-4">
                  <div className="mb-3 text-5xl md:mb-6 md:text-7xl animate-in fade-in zoom-in duration-300">
                    {helperData.emoji}
                  </div>
                  <h3 className="mb-2 text-base font-bold text-zinc-800 md:mb-3 md:text-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                    Welcome! I'm {helperData.name}, your {helperData.title}
                  </h3>
                  <p className="mb-4 text-xs text-zinc-600 md:mb-6 md:text-base animate-in fade-in slide-in-from-bottom-3 duration-700">
                    {helperData.description}.{" "}
                    {stepContext?.firstMessage
                      ? "I'm here to guide you through this journey step by step."
                      : "I'm here to help you succeed."}
                  </p>

                  {/* Start Button - No loading state, auto-trigger works directly */}
                  <button
                    onClick={() => handleStartJourney()}
                    disabled={isLoading}
                    className={`group relative inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r ${currentTheme.dark} text-white font-semibold text-sm md:text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-in fade-in zoom-in duration-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Starting...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">🚀</span>
                        <span>Start Your Journey with {helperData.name}</span>
                      </>
                    )}
                  </button>

                  <p className="mt-6 text-xs text-zinc-400 md:text-sm animate-in fade-in duration-1000">
                    Or type your own question below to get started
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div key={message.id} ref={index === messages.length - 1 ? lastMessageRef : null}>
                  <Message
                    role={message.role}
                    content={message.content}
                    helper={message.role === "assistant" ? helper : undefined}
                    searchResults={message.searchResults}
                  />
                  </div>
                ))}
                {isStreaming && (
                  <div className="flex gap-2 py-3 md:gap-3 md:py-4">
                    <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 shadow-sm md:px-4 md:py-3">
                      <Loader2 className="h-3 w-3 animate-spin text-amber-500 md:h-4 md:w-4" />
                      <span className="text-xs text-zinc-600 md:text-sm">
                        Thinking...
                      </span>
                    </div>
                  </div>
                )}
                {/* Agent Tool Usage Display - Consolidated Single Card */}
                {currentToolCalls.length > 0 && (
                  <div className="py-2 md:py-3">
                    <div className="flex items-start gap-2 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 px-3 py-2.5 shadow-sm transition-all duration-300 md:gap-3 md:px-4 md:py-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {currentToolCalls.every(tc => tc.result) ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 md:h-5 md:w-5" />
                        ) : (
                          <Loader2 className="h-4 w-4 animate-spin text-purple-500 md:h-5 md:w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        {currentToolCalls.map((toolCall, index) => (
                          <div key={index} className="flex items-center gap-2 transition-opacity duration-200">
                            {toolCall.result && (
                              <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                            )}
                            <span className={`text-xs font-medium ${toolCall.result ? 'text-green-700' : 'text-purple-700'} md:text-sm`}>
                              {toolCall.tool_name
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                            {!toolCall.result && (
                              <span className="text-[10px] text-purple-600 animate-pulse md:text-xs">
                                In progress...
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Floating Input Area - Within chat area */}
          <div className="absolute bottom-2 left-3 right-3 z-10 md:bottom-3 md:left-6 md:right-6">
            {/* Prompt Quality Indicator - Shows for Hacker (coding) and Crafter (UI) when user is typing */}
            {helper === "hacker" && input.trim().length >= 10 && (
              <div className="mb-2 flex items-center justify-end">
                <PromptQualityInlineBadge prompt={input} tool="cursor" />
              </div>
            )}
            {helper === "crafter" && input.trim().length >= 10 && (
              <div className="mb-2 flex items-center justify-end">
                <PromptQualityInlineBadge prompt={input} tool="v0" />
              </div>
            )}

            <div className="relative">
              {/* Opaque background with gradient */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${currentTheme.light} opacity-100`} />
              <div className="absolute inset-0 rounded-full bg-white/60 backdrop-blur-sm" />

            <form
              onSubmit={handleSubmit}
                className="relative flex items-end gap-1.5 rounded-full px-3 py-1.5 shadow-xl transition-all md:gap-2 md:px-4 md:py-2"
            >
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-white/30 flex-shrink-0 md:h-10 md:w-10"
              >
                <Paperclip size={16} className="md:size-4.5" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What's on your mind?"
                disabled={isLoading}
                rows={1}
                className="flex-1 bg-transparent px-2 py-1.5 text-xs text-zinc-800 placeholder-zinc-500 focus:outline-none disabled:opacity-50 md:px-2 md:py-2 md:text-sm resize-none overflow-hidden"
                style={{
                  minHeight: '1.5rem',
                  maxHeight: '4rem',
                }}
                onInput={(e) => {
                  const textarea = e.currentTarget;
                  textarea.style.height = 'auto';
                  textarea.style.height = Math.min(textarea.scrollHeight, 64) + 'px';
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r ${currentTheme.dark} text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:w-10`}
              >
                <Send size={16} className="md:size-4.5" />
              </button>
            </form>
          </div>
          </div>

          {/* Bottom padding section - Same color as chat background to block content */}
          <div className={`h-4 ${currentTheme.lightEnd} md:h-6`} />
        </div>
      </div>

      {/* Prompt Modal */}
      <PromptModal
        isOpen={showPromptModal}
        onClose={() => setShowPromptModal(false)}
        prompt={generatedPrompt}
        isGenerating={isGeneratingPrompt}
        helperName={helperData.name}
      />
    </div>
  );
}
