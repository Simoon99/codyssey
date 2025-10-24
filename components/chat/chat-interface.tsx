"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "./message";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Paperclip, ArrowLeft } from "lucide-react";
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
  stepContext?: {
    orbId: string;
    stepIndex: number;
    levelIndex: number;
    tasks: string[];
    requiredTasks: string[];
    firstMessage: string;
    cta: string;
  };
  projectContext?: {
    id: string;
    name: string;
    description?: string;
    goal?: string;
    location?: string;
    type?: string;
    stage?: string;
    techStack?: string[];
    targetAudience?: string;
    keyFeatures?: string[];
    links?: {
      cursor?: string;
      lovable?: string;
      bolt?: string;
      github?: string;
      demo?: string;
      figma?: string;
      notion?: string;
    };
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
  stepContext,
  projectContext,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [tasksExpanded, setTasksExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      if (onSendMessage) {
        await onSendMessage(currentInput);
      } else {
        // Create assistant message with empty content
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "",
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsStreaming(true);

        // Make API call with context
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            helper,
            message: currentInput,
            chatId: chatId || "default",
            projectId: projectContext?.id || "demo-1",
            stepContext,
            projectContext,
            tasks: tasks.map(t => ({
              id: t.id,
              title: t.title,
              description: t.description,
              required: t.required,
              status: t.status,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response stream");
        }

        let fullContent = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6));
              
              if (data.done) {
                continue;
              }

              if (data.content) {
                // Stop showing thinking card once first character appears
                if (fullContent === "") {
                  setIsStreaming(false);
                }

                fullContent += data.content;
                setMessages((prev) => {
                  const updatedMessages = [...prev];
                  updatedMessages[updatedMessages.length - 1] = {
                    ...updatedMessages[updatedMessages.length - 1],
                    content: fullContent,
                  };
                  return updatedMessages;
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
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-white p-3">
      <div className="flex h-full max-h-full w-full max-w-7xl overflow-hidden rounded-3xl shadow-2xl">
        {/* Left Column - Helper Info Card with Gradient */}
        <div className={`flex w-64 flex-col bg-gradient-to-b ${currentTheme.dark} p-6 text-white`}>
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

        {/* Helper Description */}
        <div className="mb-6">
          <p className="text-center text-sm leading-relaxed text-white/90">
            {helperData.description}
          </p>
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

        {/* Right Column - Chat Area with Light Gradient */}
        <div className={`flex flex-1 flex-col bg-gradient-to-b ${currentTheme.light}`}>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 relative">
          {/* Active Tasks Card - Overlay Dropdown */}
          {tasks && tasks.length > 0 && (
            <div className="absolute top-6 left-6 z-10">
              <button
                onClick={() => setTasksExpanded(!tasksExpanded)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-md hover:shadow-lg hover:bg-zinc-50 transition-all"
              >
                <h3 className="text-xs font-bold text-zinc-800">Tasks</h3>
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                  {completedTasks}/{totalTasks}
                </span>
                <svg
                  className={`w-3 h-3 text-zinc-600 transition-transform ${tasksExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              
              {tasksExpanded && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-xl bg-white shadow-xl border border-zinc-200 z-50 overflow-hidden">
                  <div className="max-h-80 overflow-y-auto">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-2 px-3 py-2.5 border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition-colors text-[11px]">
                        <div className="flex h-3.5 w-3.5 items-center justify-center rounded bg-gradient-to-br from-amber-400 to-orange-500 text-[8px] font-bold text-white flex-shrink-0">
                          {task.status === 'done' ? '✓' : task.status === 'in_progress' ? '⟳' : '○'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-zinc-800 truncate">
                            {task.title}
                            {!task.required && <span className="text-[9px] font-normal text-zinc-500 ml-1">(optional)</span>}
                          </p>
                        </div>
                        <span className="text-[9px] font-medium text-zinc-500 whitespace-nowrap ml-2">{task.xp_reward}xp</span>
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
                <div className="mb-4 text-5xl">{helperData.emoji}</div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-700">
                  Start a conversation with {helperData.name}
                </h3>
                <p className="text-sm text-zinc-500">
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
                <div className="flex gap-3 py-4">
                  <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                    <span className="text-sm text-zinc-600">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area - Floating with Pop-out Effect */}
        <div className="p-6 pt-4">
          <form onSubmit={handleSubmit} className={`flex items-center gap-2 rounded-full bg-gradient-to-r ${currentTheme.light} px-4 py-2 shadow-lg transition-all`}>
            <button 
              type="button" 
              className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-white/30"
            >
              <Paperclip size={18} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's on your mind?"
              disabled={isLoading}
              className="flex-1 bg-transparent px-2 py-2 text-sm text-zinc-800 placeholder-zinc-500 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r ${currentTheme.dark} text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
}
