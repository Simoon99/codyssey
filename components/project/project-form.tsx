"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Loader2 } from "lucide-react";

interface ProjectFormProps {
  project?: {
    id: string;
    name: string;
    description: string;
    external_links: {
      cursor?: string;
      lovable?: string;
      bolt?: string;
      github?: string;
      demo?: string;
    };
  };
  onSave?: (data: any) => Promise<void>;
  onCancel?: () => void;
}

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    cursor: project?.external_links?.cursor || "",
    lovable: project?.external_links?.lovable || "",
    bolt: project?.external_links?.bolt || "",
    github: project?.external_links?.github || "",
    demo: project?.external_links?.demo || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (onSave) {
        await onSave({
          name: formData.name,
          description: formData.description,
          external_links: {
            cursor: formData.cursor || undefined,
            lovable: formData.lovable || undefined,
            bolt: formData.bolt || undefined,
            github: formData.github || undefined,
            demo: formData.demo || undefined,
          },
        });
      }
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? "Edit Project" : "Create Project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-zinc-700">
              Project Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Awesome Project"
              required
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-zinc-700">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What are you building?"
              rows={3}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* External Links */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-zinc-700">External Links</p>

            <div>
              <label htmlFor="github" className="mb-1 flex items-center gap-1 text-xs text-zinc-600">
                <ExternalLink size={12} />
                GitHub Repository
              </label>
              <input
                id="github"
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/user/repo"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label htmlFor="demo" className="mb-1 flex items-center gap-1 text-xs text-zinc-600">
                <ExternalLink size={12} />
                Live Demo URL
              </label>
              <input
                id="demo"
                type="url"
                value={formData.demo}
                onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
                placeholder="https://myapp.com"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label htmlFor="cursor" className="mb-1 flex items-center gap-1 text-xs text-zinc-600">
                <ExternalLink size={12} />
                Cursor Project
              </label>
              <input
                id="cursor"
                type="url"
                value={formData.cursor}
                onChange={(e) => setFormData({ ...formData, cursor: e.target.value })}
                placeholder="https://cursor.com/..."
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label htmlFor="lovable" className="mb-1 flex items-center gap-1 text-xs text-zinc-600">
                <ExternalLink size={12} />
                Lovable Project
              </label>
              <input
                id="lovable"
                type="url"
                value={formData.lovable}
                onChange={(e) => setFormData({ ...formData, lovable: e.target.value })}
                placeholder="https://lovable.app/..."
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label htmlFor="bolt" className="mb-1 flex items-center gap-1 text-xs text-zinc-600">
                <ExternalLink size={12} />
                Bolt Project
              </label>
              <input
                id="bolt"
                type="url"
                value={formData.bolt}
                onChange={(e) => setFormData({ ...formData, bolt: e.target.value })}
                placeholder="https://bolt.new/..."
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !formData.name}
              className="flex-1"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Save Project"
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

