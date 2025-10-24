export interface ProjectContext {
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
    cursor?: string;
    lovable?: string;
    bolt?: string;
  };
}

// Helper function to format project context for AI
export function formatProjectContextForAI(project: ProjectContext): string {
  const sections: string[] = [];

  sections.push("**Project Details:**");
  sections.push(`- **Name:** ${project.name}`);
  sections.push(`- **Description:** ${project.description}`);

  if (project.goal) {
    sections.push(`- **Goal:** ${project.goal}`);
  }

  if (project.type) {
    sections.push(`- **Type:** ${project.type}`);
  }

  if (project.stage) {
    sections.push(`- **Current Stage:** ${project.stage}`);
  }

  if (project.location) {
    sections.push(`- **Location:** ${project.location}`);
  }

  if (project.targetAudience) {
    sections.push(`\n**Target Audience:**`);
    sections.push(project.targetAudience);
  }

  if (project.techStack && project.techStack.length > 0) {
    sections.push(`\n**Tech Stack:**`);
    sections.push(project.techStack.map(tech => `- ${tech}`).join('\n'));
  }

  if (project.keyFeatures && project.keyFeatures.length > 0) {
    sections.push(`\n**Key Features:**`);
    sections.push(project.keyFeatures.map(feature => `- ${feature}`).join('\n'));
  }

  if (project.links) {
    const links: string[] = [];
    if (project.links.github) links.push(`- **GitHub:** ${project.links.github}`);
    if (project.links.demo) links.push(`- **Live Demo:** ${project.links.demo}`);
    if (project.links.figma) links.push(`- **Design:** ${project.links.figma}`);
    if (project.links.notion) links.push(`- **Documentation:** ${project.links.notion}`);
    
    if (links.length > 0) {
      sections.push(`\n**Project Links:**`);
      sections.push(links.join('\n'));
    }
  }

  return sections.join('\n');
}
