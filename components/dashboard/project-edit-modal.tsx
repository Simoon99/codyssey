"use client";

import { useState } from "react";
import { X, Save, Plus, Trash2, Link as LinkIcon, Target, Users, Zap } from "lucide-react";

interface ProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    name: string;
    description: string;
    goal?: string;
    location?: string;
    type?: string;
    stage?: string;
    techStack?: string[];
    targetAudience?: string;
    keyFeatures?: string[];
    links?: {
      github?: string;
      demo?: string;
      figma?: string;
      notion?: string;
    };
  };
  onSave: (updatedProject: any) => void;
}

export function ProjectEditModal({
  isOpen,
  onClose,
  project,
  onSave,
}: ProjectEditModalProps) {
  const [formData, setFormData] = useState({
    name: project.name || "",
    description: project.description || "",
    goal: project.goal || "",
    location: project.location || "",
    type: project.type || "",
    stage: project.stage || "Ideation",
    techStack: project.techStack || [],
    targetAudience: project.targetAudience || "",
    keyFeatures: project.keyFeatures || [],
    links: {
      github: project.links?.github || "",
      demo: project.links?.demo || "",
      figma: project.links?.figma || "",
      notion: project.links?.notion || "",
    },
  });

  const [newTech, setNewTech] = useState("");
  const [newFeature, setNewFeature] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const addTech = () => {
    if (newTech.trim()) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, newTech.trim()],
      });
      setNewTech("");
    }
  };

  const removeTech = (index: number) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((_, i) => i !== index),
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        keyFeatures: [...formData.keyFeatures, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      keyFeatures: formData.keyFeatures.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header with Gradient */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Zap className="animate-pulse" size={28} />
                Project Context
              </h2>
              <p className="text-sm text-white/90 mt-1">
                🎯 Help your AI Helpers understand your vision
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-white transition-all hover:bg-white/20 hover:rotate-90"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
          <div className="space-y-5">
            {/* Basic Info Section */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-5 border-2 border-purple-200">
              <h3 className="mb-4 text-lg font-bold text-purple-900 flex items-center gap-2">
                <Target size={20} />
                The Basics
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-purple-800">
                    Project Name ✨
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-purple-200 bg-white px-4 py-3 font-medium text-zinc-800 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="My Awesome Project"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-purple-800">
                    What are you building? 🚀
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full rounded-xl border-2 border-purple-200 bg-white px-4 py-3 text-zinc-800 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="Describe your project and the problem it solves..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-purple-800">
                      Type 📱
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full rounded-xl border-2 border-purple-200 bg-white px-4 py-3 text-zinc-800 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    >
                      <option value="">Select...</option>
                      <option value="SaaS">💼 SaaS</option>
                      <option value="Mobile App">📱 Mobile App</option>
                      <option value="Web App">🌐 Web App</option>
                      <option value="Chrome Extension">🧩 Chrome Extension</option>
                      <option value="API/Backend">⚙️ API/Backend</option>
                      <option value="AI Tool">🤖 AI Tool</option>
                      <option value="E-commerce">🛒 E-commerce</option>
                      <option value="Other">✨ Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-purple-800">
                      Stage 🎯
                    </label>
                    <select
                      value={formData.stage}
                      onChange={(e) =>
                        setFormData({ ...formData, stage: e.target.value })
                      }
                      className="w-full rounded-xl border-2 border-purple-200 bg-white px-4 py-3 text-zinc-800 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    >
                      <option value="Ideation">💡 Ideation</option>
                      <option value="Planning">📋 Planning</option>
                      <option value="Building">🔨 Building</option>
                      <option value="Testing">🧪 Testing</option>
                      <option value="Launching">🚀 Launching</option>
                      <option value="Live">✅ Live</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-purple-800">
                      Goal / Timeline ⏰
                    </label>
                    <input
                      type="text"
                      value={formData.goal}
                      onChange={(e) =>
                        setFormData({ ...formData, goal: e.target.value })
                      }
                      className="w-full rounded-xl border-2 border-purple-200 bg-white px-4 py-3 text-zinc-800 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      placeholder="Launch in 30 days"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-purple-800">
                      Location 🌍
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full rounded-xl border-2 border-purple-200 bg-white px-4 py-3 text-zinc-800 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack Section */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-5 border-2 border-blue-200">
              <h3 className="mb-3 text-lg font-bold text-blue-900 flex items-center gap-2">
                ⚡ Tech Stack
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTech()}
                    className="flex-1 rounded-xl border-2 border-blue-200 bg-white px-4 py-2 text-sm text-zinc-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g., Next.js, Supabase, Tailwind..."
                  />
                  <button
                    onClick={addTech}
                    className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-white font-semibold shadow-md transition-all hover:shadow-lg active:scale-95"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.techStack.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700"
                    >
                      <span>{tech}</span>
                      <button
                        onClick={() => removeTech(index)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Audience Section */}
            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-5 border-2 border-green-200">
              <h3 className="mb-3 text-lg font-bold text-green-900 flex items-center gap-2">
                <Users size={20} />
                Who's it for?
              </h3>
              <textarea
                value={formData.targetAudience}
                onChange={(e) =>
                  setFormData({ ...formData, targetAudience: e.target.value })
                }
                rows={2}
                className="w-full rounded-xl border-2 border-green-200 bg-white px-4 py-3 text-zinc-800 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Who are you building this for? e.g., Indie makers, Students, Small businesses..."
              />
            </div>

            {/* Key Features Section */}
            <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 p-5 border-2 border-orange-200">
              <h3 className="mb-3 text-lg font-bold text-orange-900 flex items-center gap-2">
                ✨ Key Features
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addFeature()}
                    className="flex-1 rounded-xl border-2 border-orange-200 bg-white px-4 py-2 text-sm text-zinc-800 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="e.g., User authentication, Real-time chat..."
                  />
                  <button
                    onClick={addFeature}
                    className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-white font-semibold shadow-md transition-all hover:shadow-lg active:scale-95"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.keyFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-xl bg-white border-2 border-orange-200 px-4 py-2.5"
                    >
                      <span className="text-sm font-medium text-orange-900">✓ {feature}</span>
                      <button
                        onClick={() => removeFeature(index)}
                        className="text-orange-600 hover:text-orange-800 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Links Section */}
            <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 p-5 border-2 border-pink-200">
              <h3 className="mb-3 text-lg font-bold text-pink-900 flex items-center gap-2">
                <LinkIcon size={20} />
                Project Links
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-pink-800">
                    🐙 GitHub Repository
                  </label>
                  <input
                    type="url"
                    value={formData.links.github}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        links: { ...formData.links, github: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border-2 border-pink-200 bg-white px-4 py-2 text-sm text-zinc-800 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-pink-800">
                    🌐 Live Demo
                  </label>
                  <input
                    type="url"
                    value={formData.links.demo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        links: { ...formData.links, demo: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border-2 border-pink-200 bg-white px-4 py-2 text-sm text-zinc-800 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                    placeholder="https://yourproject.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-pink-800">
                      🎨 Figma/Design
                    </label>
                    <input
                      type="url"
                      value={formData.links.figma}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: { ...formData.links, figma: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border-2 border-pink-200 bg-white px-4 py-2 text-sm text-zinc-800 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                      placeholder="Figma link"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-pink-800">
                      📝 Notion/Docs
                    </label>
                    <input
                      type="url"
                      value={formData.links.notion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: { ...formData.links, notion: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border-2 border-pink-200 bg-white px-4 py-2 text-sm text-zinc-800 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                      placeholder="Notion link"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Sticky */}
        <div className="sticky bottom-0 flex items-center justify-between border-t-2 border-zinc-200 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4">
          <p className="text-xs text-zinc-600 font-medium">
            💡 This helps AI Helpers give you personalized advice
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border-2 border-zinc-300 bg-white px-5 py-2.5 font-semibold text-zinc-700 transition-all hover:bg-zinc-50 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
            >
              <Save size={18} />
              Save Context
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
