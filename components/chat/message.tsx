"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getHelperById, type HelperType } from "@/lib/types/helpers";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  helper?: HelperType;
}

export function Message({ role, content, helper }: MessageProps) {
  const isUser = role === "user";
  const helperData = helper ? getHelperById(helper) : null;

  return (
    <div
      className={cn(
        "flex gap-3 py-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && helperData && (
        <Avatar className="h-8 w-8 border-2 border-zinc-200">
          <AvatarFallback className={cn("bg-gradient-to-br text-sm", helperData.color)}>
            {helperData.emoji}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3 text-sm",
          isUser
            ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white"
            : "bg-white border border-zinc-200 text-zinc-800 shadow-sm"
        )}
      >
        {!isUser && helperData && (
          <p className="mb-1 text-xs font-semibold opacity-70">{helperData.name}</p>
        )}
        <div className="whitespace-pre-wrap">{content}</div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 border-2 border-amber-500">
          <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm">
            👤
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

