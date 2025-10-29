"use client";

import { useState, useEffect } from "react";
import { analyzePromptQuality, type PromptAnalysis } from "@/lib/prompt-analyzer";
import type { VibecodingTool } from "@/lib/vibecoding-intelligence";

interface PromptQualityBadgeProps {
  prompt: string;
  tool?: VibecodingTool;
  onAnalysisComplete?: (analysis: PromptAnalysis) => void;
  minimal?: boolean;
}

export function PromptQualityBadge({ 
  prompt, 
  tool = "cursor", 
  onAnalysisComplete,
  minimal = false 
}: PromptQualityBadgeProps) {
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Only analyze if prompt is substantial enough
    if (prompt.trim().length >= 10) {
      const result = analyzePromptQuality(prompt, tool);
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } else {
      setAnalysis(null);
    }
  }, [prompt, tool, onAnalysisComplete]);

  if (!analysis) return null;

  // Grade colors
  const gradeColors: Record<typeof analysis.grade, string> = {
    "A+": "bg-green-500 text-white",
    "A": "bg-green-400 text-white",
    "B": "bg-blue-500 text-white",
    "C": "bg-yellow-500 text-white",
    "D": "bg-orange-500 text-white",
    "F": "bg-red-500 text-white",
  };

  const gradeColor = gradeColors[analysis.grade];

  // Minimal view - just the badge
  if (minimal) {
    return (
      <div 
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all hover:scale-105 ${gradeColor}`}
        onClick={() => setIsExpanded(!isExpanded)}
        title={`Prompt Quality: ${analysis.grade} (${analysis.overallScore}/100)`}
      >
        <span className="font-bold">{analysis.grade}</span>
        <span>{analysis.overallScore}/100</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
      {/* Header with score */}
      <div 
        className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${gradeColor}`}>
              {analysis.grade}
            </div>
            <div>
              <div className="font-semibold text-white">
                Prompt Quality: {analysis.estimatedQuality}
              </div>
              <div className="text-sm text-gray-400">
                Score: {analysis.overallScore}/100 · Click to {isExpanded ? 'hide' : 'see'} details
              </div>
            </div>
          </div>
          
          {/* Score breakdown bars */}
          <div className="hidden md:flex flex-col gap-1 min-w-[200px]">
            {Object.entries(analysis.scores).map(([key, data]) => (
              <div key={key} className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 capitalize w-24 text-right">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      data.score >= 80 ? 'bg-green-500' :
                      data.score >= 60 ? 'bg-blue-500' :
                      data.score >= 40 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${data.score}%` }}
                  />
                </div>
                <span className="text-gray-400 w-8">{data.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="border-t border-white/10 p-4 space-y-4">
          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Strengths
              </h4>
              <ul className="space-y-1 text-sm text-gray-300">
                {analysis.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {analysis.improvements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Suggested Improvements
              </h4>
              <div className="space-y-3">
                {analysis.improvements.map((improvement, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-lg ${
                      improvement.priority === 'high' ? 'bg-red-500/10 border border-red-500/20' :
                      improvement.priority === 'medium' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                      'bg-blue-500/10 border border-blue-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-400 uppercase">
                        {improvement.category}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        improvement.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        improvement.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {improvement.priority}
                      </span>
                    </div>
                    <p className="text-sm text-white font-medium mb-1">
                      {improvement.issue}
                    </p>
                    <p className="text-sm text-gray-300 mb-2">
                      {improvement.suggestion}
                    </p>
                    {improvement.example && (
                      <div className="mt-2 p-2 bg-white/5 rounded text-xs text-gray-400 font-mono">
                        {improvement.example}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed component scores */}
          <div>
            <h4 className="text-sm font-semibold text-blue-400 mb-3">Detailed Breakdown</h4>
            <div className="space-y-3">
              {Object.entries(analysis.scores).map(([key, data]) => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`text-sm font-semibold ${
                      data.score >= 80 ? 'text-green-400' :
                      data.score >= 60 ? 'text-blue-400' :
                      data.score >= 40 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {data.score}/100
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        data.score >= 80 ? 'bg-green-500' :
                        data.score >= 60 ? 'bg-blue-500' :
                        data.score >= 40 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">{data.feedback}</p>
                  <ul className="mt-1 space-y-0.5">
                    {data.details.map((detail, i) => (
                      <li key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                        <span className={`mt-0.5 ${detail.startsWith('✓') ? 'text-green-500' : detail.startsWith('✗') ? 'text-red-500' : 'text-yellow-500'}`}>
                          {detail.charAt(0)}
                        </span>
                        <span>{detail.substring(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Improved prompt */}
          {analysis.improvedPrompt && (
            <div>
              <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Improved Version
              </h4>
              <div className="p-3 bg-white/5 rounded-lg border border-purple-500/20">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                  {analysis.improvedPrompt}
                </pre>
                <button
                  className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(analysis.improvedPrompt!);
                  }}
                >
                  Copy improved prompt
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Inline badge for chat input
 */
export function PromptQualityInlineBadge({ 
  prompt, 
  tool = "cursor" 
}: { 
  prompt: string; 
  tool?: VibecodingTool;
}) {
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);

  useEffect(() => {
    if (prompt.trim().length >= 10) {
      const result = analyzePromptQuality(prompt, tool);
      setAnalysis(result);
    } else {
      setAnalysis(null);
    }
  }, [prompt, tool]);

  if (!analysis) return null;

  const gradeColors: Record<typeof analysis.grade, string> = {
    "A+": "bg-green-500/10 text-green-400 border-green-500/20",
    "A": "bg-green-500/10 text-green-400 border-green-500/20",
    "B": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "C": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    "D": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "F": "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const gradeColor = gradeColors[analysis.grade];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border ${gradeColor}`}>
      <span className="font-bold">{analysis.grade}</span>
      <span className="opacity-75">{analysis.overallScore}</span>
    </div>
  );
}

