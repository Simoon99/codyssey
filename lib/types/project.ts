/**
 * Project context types for AI awareness
 */

export interface ProjectContext {
  id: string;
  name: string;
  description: string;
  goal?: string;
  location?: string;
  // Extended context for AI
  problemStatement?: string;
  targetAudience?: string;
  valueProposition?: string;
  techStack?: string;
  currentStage?: string;
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
  problemStatement?: string;
  targetAudience?: string;
  valueProposition?: string;
  techStack?: string;
  currentStage?: string;
}

/**
 * Convert project to context for AI
 */
export function projectToContext(project: ProjectContext): {
  projectName: string;
  projectDescription: string;
  projectGoal?: string;
  projectLocation?: string;
  problemStatement?: string;
  targetAudience?: string;
  valueProposition?: string;
  techStack?: string;
  currentStage?: string;
} {
  return {
    projectName: project.name,
    projectDescription: project.description,
    projectGoal: project.goal,
    projectLocation: project.location,
    problemStatement: project.problemStatement,
    targetAudience: project.targetAudience,
    valueProposition: project.valueProposition,
    techStack: project.techStack,
    currentStage: project.currentStage,
  };
}

/**
 * Format project context as a comprehensive string for AI system prompts
 */
export function formatProjectContextForAI(project: ProjectContext): string {
  const sections: string[] = [];

  sections.push(`**Project:** ${project.name}`);
  sections.push(`**Description:** ${project.description}`);

  if (project.goal) {
    sections.push(`**Goal:** ${project.goal}`);
  }

  if (project.problemStatement) {
    sections.push(`\n**Problem Statement:**\n${project.problemStatement}`);
  }

  if (project.targetAudience) {
    sections.push(`\n**Target Audience:**\n${project.targetAudience}`);
  }

  if (project.valueProposition) {
    sections.push(`\n**Value Proposition:**\n${project.valueProposition}`);
  }

  if (project.techStack) {
    sections.push(`\n**Tech Stack:** ${project.techStack}`);
  }

  if (project.currentStage) {
    sections.push(`**Current Stage:** ${project.currentStage}`);
  }

  return sections.join("\n");
}
