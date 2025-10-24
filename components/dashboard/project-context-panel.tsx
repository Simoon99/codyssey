"use client";

import { useState } from "react";
import { X, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectContextPanelProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    name: string;
    description: string;
    goal?: string;
    location?: string;
  };
  onSave: (updatedProject: {
    name: string;
    description: string;
    goal?: string;
    location?: string;
    problemStatement?: string;
    targetAudience?: string;
    valueProposition?: string;
    techStack?: string;
    currentStage?: string;
  }) => void;
}

export function ProjectContextPanel({
  isOpen,
  onClose,
  project,
  onSave,
}: ProjectContextPanelProps) {
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    goal: project.goal || "",
    location: project.location || "",
    problemStatement: "",
    targetAudience: "",
    valueProposition: "",
    techStack: "",
    currentStage: "",
  });

  console.log("ProjectContextPanel render - isOpen:", isOpen, "project:", project);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleChange = (
    field: string,
    value: string
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <>
      {/* Light backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/5 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div 
        className="fixed right-0 top-0 z-50 h-full w-[500px] bg-white shadow-2xl transition-transform duration-300 ease-out"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">
                Project Context
              </h2>
              <p className="text-xs text-zinc-500">
                Help AI understand your project better
              </p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 text-zinc-400 hover:text-zinc-600"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="h-[calc(100%-140px)] overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-zinc-900">
                Basic Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-700">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="My Awesome Project"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-700">
                    Short Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    rows={2}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="A one-sentence elevator pitch..."
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-700">
                    Project Goal
                  </label>
                  <input
                    type="text"
                    value={formData.goal}
                    onChange={(e) => handleChange("goal", e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="Launch in 30 days"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-700">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>
            </div>

            {/* Project Context */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-zinc-900">
                Project Context
                <span className="ml-2 text-xs font-normal text-zinc-500">
                  (helps AI give better guidance)
                </span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-700">
                    Problem Statement
                  </label>
                  <textarea
                    value={formData.problemStatement}
                    onChange={(e) =>
                      handleChange("problemStatement", e.target.value)
                    }
                    rows={3}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="What problem are you solving? Who has this problem?"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-700">
                    Target Audience
                  </label>
                  <textarea
                    value={formData.targetAudience}
                    onChange={(e) =>
                      handleChange("targetAudience", e.target.value)
                    }
                    rows={2}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="Who are your ideal users? (e.g., indie developers, small business owners)"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-700">
                    Value Proposition
                  </label>
                  <textarea
                    value={formData.valueProposition}
                    onChange={(e) =>
                      handleChange("valueProposition", e.target.value)
                    }
                    rows={2}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="What unique value do you provide?"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-700">
                    Tech Stack
                  </label>
                  <textarea
                    value={formData.techStack}
                    onChange={(e) =>
                      handleChange("techStack", e.target.value)
                    }
                    rows={2}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="e.g., Next.js, React, Tailwind, Supabase, Vercel"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-700">
                    Current Stage
                  </label>
                  <input
                    type="text"
                    value={formData.currentStage}
                    onChange={(e) =>
                      handleChange("currentStage", e.target.value)
                    }
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="e.g., Ideation, MVP Build, Launching, Growth"
                  />
                </div>
              </div>
            </div>

            {/* AI Context Note */}
            <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-4">
              <div className="flex gap-3">
                <Sparkles size={16} className="mt-0.5 flex-shrink-0 text-purple-600" />
                <div>
                  <p className="text-xs font-medium text-purple-900">
                    AI-Powered Guidance
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-purple-700">
                    The more context you provide, the better our AI Helpers can
                    guide you through your journey. This information helps them
                    give personalized, relevant advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-zinc-200 bg-white px-6 py-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-zinc-600 hover:text-zinc-900"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
          >
            <Save size={16} className="mr-2" />
            Save Context
          </Button>
        </div>
      </div>
    </>
  );
}

