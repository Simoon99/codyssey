"use client";

import { useState } from "react";
import { HELPERS, type HelperType } from "@/lib/types/helpers";
import { Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SidebarProps {
  currentHelper?: HelperType;
  currentLevel: number;
  onHelperSelect: (helper: HelperType) => void;
  onNavigate: (route: 'home' | 'settings') => void;
  onNewChat?: () => void;
}

export function Sidebar({
  currentHelper,
  currentLevel,
  onHelperSelect,
  onNavigate,
  onNewChat,
}: SidebarProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const allHelpers = Object.values(HELPERS);
  
  // Helper-specific gradient colors for sidebar
  const helperGradients: Record<string, string> = {
    muse: 'from-purple-400 to-pink-500',
    architect: 'from-blue-400 to-cyan-500',
    crafter: 'from-pink-400 to-rose-500',
    hacker: 'from-green-400 to-emerald-500',
    hypebeast: 'from-orange-400 to-red-500',
    sensei: 'from-amber-400 to-yellow-500'
  };
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex h-full w-20 flex-col items-center bg-gradient-to-b from-amber-50 to-pink-50 py-4 overflow-hidden">
      {/* Character Header - Compact */}
      <div className="mb-4">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-2xl shadow-md">
              🎓
            </div>
          </div>
        </div>
      </div>

      {/* AI Helpers Section - All Available, No Scrolling Needed */}
      <div className="flex flex-1 flex-col items-center justify-center space-y-1 py-2 px-1">
        {allHelpers.map((helper) => (
          <button
            key={helper.id}
            onClick={() => onHelperSelect(helper.id)}
            title={helper.name}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl text-xl transition-all duration-200 active:scale-95 flex-shrink-0",
              currentHelper === helper.id
                ? `bg-gradient-to-br ${helperGradients[helper.id]} text-white shadow-lg scale-100`
                : "hover:scale-105 active:scale-95"
            )}
          >
            {helper.emoji}
          </button>
        ))}
      </div>

      {/* Bottom Navigation - Icon Only */}
      <div className="space-y-2 pt-4">
        <button
          onClick={() => onNavigate('settings')}
          title="Settings"
          className="flex h-12 w-12 items-center justify-center rounded-lg text-zinc-600 transition-colors duration-200 active:bg-zinc-200 hover:bg-zinc-100"
        >
          <Settings size={20} />
        </button>
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={isLoggingOut ? "Logging out..." : "Logout"}
          className="flex h-12 w-12 items-center justify-center rounded-lg text-zinc-600 transition-colors duration-200 active:bg-zinc-200 hover:bg-zinc-100 disabled:opacity-50"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}
