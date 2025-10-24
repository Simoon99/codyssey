"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "./message";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Paperclip, ArrowLeft, CheckCircle2, Info } from "lucide-react";
import { type HelperType, getHelperById } from "@/lib/types/helpers";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
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
}

// Sample recommendations based on helper
const getRecommendations = (helper: HelperType) => {
  const recommendations: Record<HelperType, Array<{title: string, subtitle: string, description: string, emoji: string}>> = {
    muse: [
      { 
        title: "Problem-Solution Fit", 
        subtitle: "Market Research",
        description: "Deep dive into validating your idea with target users and understanding pain points.",
        emoji: "🎯"
      },
      { 
        title: "Competitive Analysis", 
        subtitle: "Market Landscape",
        description: "Analyze your competitors' strengths and weaknesses to find your unique angle.",
        emoji: "🔍"
      },
      { 
        title: "MVP Scope Definition", 
        subtitle: "Feature Planning",
        description: "Identify the core 3-5 features that will make your first version valuable.",
        emoji: "✨"
      },
    ],
    architect: [
      { 
        title: "Tech Stack Selection", 
        subtitle: "Modern & Scalable",
        description: "Choose the right frameworks and tools that fit your timeline and team skills.",
        emoji: "🏗️"
      },
      { 
        title: "System Architecture", 
        subtitle: "Clean Design",
        description: "Design a maintainable architecture that can scale with your product.",
        emoji: "📐"
      },
      { 
        title: "Database Schema", 
        subtitle: "Data Modeling",
        description: "Create efficient database structures with proper relationships and indexes.",
        emoji: "🗄️"
      },
    ],
    crafter: [
      { 
        title: "UI Design System", 
        subtitle: "Consistent & Beautiful",
        description: "Build a cohesive design language with colors, typography, and components.",
        emoji: "🎨"
      },
      { 
        title: "User Experience Flow", 
        subtitle: "Seamless Interactions",
        description: "Craft intuitive user journeys that make your product easy to use.",
        emoji: "✨"
      },
      { 
        title: "Brand Identity", 
        subtitle: "Memorable Style",
        description: "Develop a unique brand personality that resonates with your audience.",
        emoji: "🌟"
      },
    ],
    hacker: [
      { 
        title: "Debug & Fix Issues", 
        subtitle: "Problem Solving",
        description: "Systematic approach to identifying and resolving technical bugs.",
        emoji: "⚡"
      },
      { 
        title: "Code Optimization", 
        subtitle: "Performance",
        description: "Improve code efficiency and application performance.",
        emoji: "🚀"
      },
      { 
        title: "Feature Implementation", 
        subtitle: "Build Fast",
        description: "Ship new features quickly with clean, maintainable code.",
        emoji: "💻"
      },
    ],
    hypebeast: [
      { 
        title: "Launch Strategy", 
        subtitle: "Go-to-Market",
        description: "Plan your product launch across multiple channels for maximum impact.",
        emoji: "🚀"
      },
      { 
        title: "Content Creation", 
        subtitle: "Social Media",
        description: "Craft compelling tweets, posts, and announcements that go viral.",
        emoji: "📱"
      },
      { 
        title: "Community Building", 
        subtitle: "Early Adopters",
        description: "Build a loyal community around your product before and after launch.",
        emoji: "👥"
      },
    ],
    sensei: [
      { 
        title: "Growth Experiments", 
        subtitle: "Data-Driven",
        description: "Design and run experiments to find sustainable growth channels.",
        emoji: "📊"
      },
      { 
        title: "Retention Strategy", 
        subtitle: "Keep Users Coming",
        description: "Implement features and flows that keep users engaged long-term.",
        emoji: "🔄"
      },
      { 
        title: "Scaling to 100+", 
        subtitle: "Sustainable Growth",
        description: "Proven tactics to grow from first users to 100+ active customers.",
        emoji: "📈"
      },
    ],
  };
  
  return recommendations[helper] || [];
};

export function ChatInterface({
  helper,
  chatId,
  initialMessages = [],
  onSendMessage,
  onBackToJourney,
  tasks = [],
  onCompleteTask,
  stepContext,
}: ChatInterfaceProps) {
  // Store chat histories for each helper separately
  const [chatHistories, setChatHistories] = useState<Record<HelperType, ChatMessage[]>>({
    muse: [],
    architect: [],
    crafter: [],
    hacker: [],
    hypebeast: [],
    sensei: [],
  });
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [tasksExpanded, setTasksExpanded] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [showHelperInfoMobile, setShowHelperInfoMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`chat:${helper}`);
      if (saved) {
        try {
          const parsed: ChatMessage[] = JSON.parse(saved);
          setChatHistories(prev => ({ ...prev, [helper]: parsed }));
        } catch (error) {
          console.error("Failed to load chat history:", error);
        }
      }
    }
  }, [helper]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined" && chatHistories[helper].length > 0) {
      const data = JSON.stringify(chatHistories[helper]);
      localStorage.setItem(`chat:${helper}`, data);
    }
  }, [chatHistories, helper]);

  // Get messages for current helper
  const messages = chatHistories[helper];

  // Calculate task completion stats
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;

  const helperData = getHelperById(helper);

  // Helper-specific gradient themes
  const helperThemes: Record<HelperType, { dark: string; light: string; button: string }> = {
    muse: {
      dark: 'from-purple-500 via-pink-500 to-rose-500',
      light: 'from-purple-100 via-pink-100 to-rose-100',
      button: 'from-purple-400 via-pink-400 to-rose-400'
    },
    architect: {
      dark: 'from-blue-500 via-cyan-500 to-teal-500',
      light: 'from-blue-100 via-cyan-100 to-teal-100',
      button: 'from-blue-400 via-cyan-400 to-teal-400'
    },
    crafter: {
      dark: 'from-pink-500 via-rose-500 to-red-500',
      light: 'from-pink-100 via-rose-100 to-red-100',
      button: 'from-pink-400 via-rose-400 to-red-400'
    },
    hacker: {
      dark: 'from-green-500 via-emerald-500 to-teal-500',
      light: 'from-green-100 via-emerald-100 to-teal-100',
      button: 'from-green-400 via-emerald-400 to-teal-400'
    },
    hypebeast: {
      dark: 'from-orange-500 via-red-500 to-pink-500',
      light: 'from-orange-100 via-red-100 to-pink-100',
      button: 'from-orange-400 via-red-400 to-pink-400'
    },
    sensei: {
      dark: 'from-amber-500 via-yellow-500 to-orange-500',
      light: 'from-amber-100 via-yellow-100 to-orange-100',
      button: 'from-amber-400 via-yellow-400 to-orange-400'
    }
  };

  const currentTheme = helperThemes[helper];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    // Add user message to current helper's history
    setChatHistories((prev) => ({
      ...prev,
      [helper]: [...prev[helper], userMessage],
    }));
    
    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      if (onSendMessage) {
        await onSendMessage(currentInput);
      } else {
        // Call the OpenAI API via our backend
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "",
        };

        // Add empty assistant message to current helper's history
        setChatHistories((prev) => ({
          ...prev,
          [helper]: [...prev[helper], assistantMessage],
        }));
        setIsStreaming(true);

        // Make API call to chat endpoint
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            helper,
            message: currentInput,
            projectId: "demo-1",
            context: {
              projectName: "My First Project",
              projectDescription: "Building something amazing with Codyssey",
              currentStep: stepContext ? {
                levelTitle: `Level ${stepContext.levelIndex + 1}`,
                stepTitle: stepContext.orbId,
                cta: stepContext.cta,
              } : undefined,
              tasks: tasks.length > 0 ? tasks : undefined,
              requiredTasks: stepContext?.requiredTasks,
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
              
              if (data.done) {
                setIsStreaming(false);
                break;
              }
              
              if (data.content) {
                // First character - stop showing thinking indicator
                if (assistantMessage.content === "") {
                  setIsStreaming(false);
                }
                
                // Update assistant message in current helper's history
                setChatHistories((prev) => {
                  const helperMessages = [...prev[helper]];
                  helperMessages[helperMessages.length - 1] = {
                    ...helperMessages[helperMessages.length - 1],
                    content: helperMessages[helperMessages.length - 1].content + data.content,
                  };
                  return {
                    ...prev,
                    [helper]: helperMessages,
                  };
                });
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
      
      // Add error message to current helper's history
      setChatHistories((prev) => ({
        ...prev,
        [helper]: [...prev[helper], errorMessage],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-white p-2 md:p-3">
      <div className="flex h-full max-h-full w-full max-w-7xl overflow-hidden rounded-2xl shadow-2xl md:rounded-3xl">
        {/* Left Column - Helper Info Card with Gradient (Hidden on Mobile) */}
        <div className={`hidden w-64 flex-col bg-gradient-to-b ${currentTheme.dark} p-6 text-white md:flex`}>
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
        <button className={`mb-6 w-full rounded-full bg-gradient-to-r ${currentTheme.button} py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-105`}>
          + New Chat
        </button>

        {/* Helper Graphic Placeholder Card */}
        <div className="mb-6 flex justify-center rounded-2xl bg-white/10 p-10 shadow-lg backdrop-blur-sm">
          <div className="text-7xl">
            {helperData.emoji}
          </div>
        </div>

        {/* Chat History - Modern Scrollbar */}
        <div className="flex-1 space-y-2 overflow-y-auto pr-1" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.4) transparent'
        }}>
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
            {/* Placeholder for future chat history items */}
            <div className="rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs text-white/60">No previous chats</p>
            </div>
          </div>
        </div>
        </div>

        {/* Right Column - Chat Area with Light Gradient (Mobile optimized) */}
        <div className={`flex flex-1 flex-col bg-gradient-to-b ${currentTheme.light}`}>
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
          <div className={`md:hidden border-b border-white/20 bg-gradient-to-br ${currentTheme.dark} p-4 animate-in slide-in-from-top-2 rounded-b-3xl`}>
            <div className="flex items-center gap-2">
              <div className="text-3xl">{helperData.emoji}</div>
              <div>
                <h3 className="font-bold text-white">{helperData.name}</h3>
                <p className="text-xs text-white/80">{helperData.title}</p>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-3 py-3 relative md:px-6 md:py-6">
          {/* Active Tasks Card - Overlay Dropdown (Mobile optimized) */}
          {tasks && tasks.length > 0 && (
            <div className="absolute top-3 left-3 z-10 md:top-6 md:left-6">
              <button
                onClick={() => setTasksExpanded(!tasksExpanded)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white shadow-md hover:shadow-lg hover:bg-zinc-50 transition-all md:gap-2 md:px-3 md:py-2"
              >
                <h3 className="text-[11px] font-bold text-zinc-800 md:text-xs">Tasks</h3>
                <span className={`text-[9px] font-semibold px-1 py-0.5 rounded md:text-[10px] md:px-1.5 md:py-0.5 ${
                  completedTasks === totalTasks && totalTasks > 0
                    ? 'text-green-700 bg-green-50'
                    : 'text-amber-600 bg-amber-50'
                }`}>
                  {completedTasks}/{totalTasks}
                </span>
                <svg
                  className={`w-2.5 h-2.5 text-zinc-600 transition-transform md:w-3 md:h-3 ${tasksExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              
              {tasksExpanded && (
                <div className="absolute top-full left-0 mt-1.5 w-64 rounded-lg bg-white shadow-lg border border-zinc-200 z-50 overflow-hidden md:mt-2 md:w-72 md:rounded-xl md:shadow-xl">
                  <div className="max-h-64 overflow-y-auto md:max-h-80">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between gap-1 px-2.5 py-2 border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition-colors text-[10px] md:gap-2 md:px-3 md:py-2.5 md:text-[11px]">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0 md:gap-2">
                          <div className={`flex h-3 w-3 items-center justify-center rounded text-[7px] font-bold text-white flex-shrink-0 md:h-3.5 md:w-3.5 md:text-[8px] ${
                            task.status === 'done' 
                              ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                              : 'bg-gradient-to-br from-amber-400 to-orange-500'
                          }`}>
                            {task.status === 'done' ? '✓' : task.status === 'in_progress' ? '⟳' : '○'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-zinc-800 truncate">
                              {task.title}
                              {!task.required && <span className="text-[8px] font-normal text-zinc-500 ml-1 md:text-[9px]">(optional)</span>}
                            </p>
                          </div>
                        </div>

                        {/* Action Icons */}
                        <div className="flex items-center gap-0.5 flex-shrink-0 md:gap-1">
                          {/* Send to Helper */}
                          <button
                            onClick={() => setInput(`Help me with: ${task.title}. ${task.description}`)}
                            className="p-0.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors md:p-1"
                            title="Send to helper"
                          >
                            <Send size={10} className="md:size-3" />
                          </button>

                          {/* Mark Complete */}
                          <button
                            onClick={async () => {
                              if (!onCompleteTask) return;
                              setCompletingTaskId(task.id);
                              try {
                                await onCompleteTask(task.id);
                              } catch (error) {
                                console.error("Failed to complete task:", error);
                              } finally {
                                setCompletingTaskId(null);
                              }
                            }}
                            disabled={completingTaskId === task.id}
                            className="p-0.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors disabled:opacity-50 md:p-1"
                            title="Mark as complete"
                          >
                            {completingTaskId === task.id ? (
                              <Loader2 size={10} className="animate-spin md:size-3" />
                            ) : (
                              <CheckCircle2 size={10} className="md:size-3" />
                            )}
                          </button>
                        </div>

                        <span className="text-[8px] font-medium text-zinc-500 whitespace-nowrap ml-1 md:text-[9px]">{task.xp_reward}xp</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mb-2 text-3xl md:mb-4 md:text-5xl">{helperData.emoji}</div>
                <h3 className="mb-1 text-sm font-semibold text-zinc-700 md:mb-2 md:text-lg">
                  Start a conversation with {helperData.name}
                </h3>
                <p className="text-xs text-zinc-500 md:text-sm">
                  Ask me anything about {helperData.description.toLowerCase()}
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <Message
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  helper={message.role === "assistant" ? helper : undefined}
                />
              ))}
              {isStreaming && (
                <div className="flex gap-2 py-3 md:gap-3 md:py-4">
                  <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 shadow-sm md:px-4 md:py-3">
                    <Loader2 className="h-3 w-3 animate-spin text-amber-500 md:h-4 md:w-4" />
                    <span className="text-xs text-zinc-600 md:text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area - Floating with Pop-out Effect (Mobile optimized) */}
        <div className="p-3 pt-2 md:p-6 md:pt-4">
          <form onSubmit={handleSubmit} className={`flex items-center gap-1.5 rounded-full bg-gradient-to-r ${currentTheme.light} px-3 py-1.5 shadow-lg transition-all md:gap-2 md:px-4 md:py-2`}>
            <button 
              type="button" 
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-white/30 md:h-10 md:w-10"
            >
              <Paperclip size={16} className="md:size-4.5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's on your mind?"
              disabled={isLoading}
              className="flex-1 bg-transparent px-2 py-1.5 text-xs text-zinc-800 placeholder-zinc-500 focus:outline-none disabled:opacity-50 md:px-2 md:py-2 md:text-sm"
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
      </div>
    </div>
  );
}
