/**
 * Project context types for AI awareness
 */

export interface ProjectContext {
  id: string;
  name: string;
  description: string;
  goal?: string;
  location?: string;
  links?: {
    cursor?: string;
    lovable?: string;
    bolt?: string;
    github?: string;
    demo?: string;
  };
}

export interface ProjectUpdateData {
  name: string;
  description: string;
  goal?: string;
  location?: string;
}

/**
 * Convert project to context for AI
 */
export function projectToContext(project: ProjectContext): {
  projectName: string;
  projectDescription: string;
  projectGoal?: string;
  projectLocation?: string;
} {
  return {
    projectName: project.name,
    projectDescription: project.description,
    projectGoal: project.goal,
    projectLocation: project.location,
  };
}

