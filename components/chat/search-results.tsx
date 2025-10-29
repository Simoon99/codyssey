"use client";

import { ExternalLink } from "lucide-react";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  domain: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  summary?: string;
}

export function SearchResults({ results, query, summary }: SearchResultsProps) {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {results.slice(0, 5).map((result, idx) => (
        <a
          key={idx}
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] hover:bg-white/10 transition-colors"
          title={result.title}
        >
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/10 group-hover:bg-blue-500/30 text-[9px] font-semibold text-zinc-600 group-hover:text-blue-400 flex-shrink-0">
            {idx + 1}
          </span>
          <span className="text-zinc-600 group-hover:text-blue-500 truncate max-w-[120px]">
            {result.domain}
          </span>
        </a>
      ))}
    </div>
  );
}
