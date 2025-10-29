"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getHelperById, type HelperType } from "@/lib/types/helpers";
import { SearchResults } from "./search-results";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark.css";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  domain: string;
}

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  helper?: HelperType;
  searchResults?: { results: SearchResult[]; query: string; summary?: string };
}

export function Message({ role, content, helper, searchResults }: MessageProps) {
  const isUser = role === "user";
  const helperData = helper ? getHelperById(helper) : null;

  return (
    <div
      className={cn(
        "flex gap-3 py-4 pt-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && helperData && (
        <Avatar className="h-8 w-8 border-2 border-zinc-200 mt-1">
          <AvatarFallback className={cn("bg-gradient-to-br text-sm", helperData.color)}>
            {helperData.emoji}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(isUser ? "max-w-[70%]" : "max-w-[90%]")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm",
            isUser
              ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white"
              : "bg-white border border-zinc-200 text-zinc-800 shadow-sm"
          )}
        >
          {!isUser && helperData && (
            <p className="mb-1 text-xs font-semibold opacity-70">{helperData.name}</p>
          )}
          {isUser ? (
            <div className="whitespace-pre-wrap">{content}</div>
          ) : (
            <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-zinc-900 prose-p:text-zinc-800 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-code:text-sm prose-code:bg-zinc-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-ul:list-disc prose-ol:list-decimal prose-li:text-zinc-800 prose-strong:text-zinc-900 prose-strong:font-semibold">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                components={{
                  code: ({ node, inline, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline ? (
                      <code
                        className={`${className} block overflow-x-auto`}
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  a: ({ node, children, ...props }: any) => (
                    <a {...props} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {/* Remove citation numbers [1], [2], etc. from content before rendering */}
                {content.replace(/\[\d+\]/g, "")}
              </ReactMarkdown>
            </div>
          )}
        </div>
        
        {/* Display search results as clickable cards */}
        {searchResults && !isUser && (
          <div className="mt-2">
            <SearchResults
              results={searchResults.results}
              query={searchResults.query}
              summary={searchResults.summary}
            />
          </div>
        )}
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

