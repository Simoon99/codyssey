import { type HelperContext } from "./llm/provider";
import { getHelperById, type HelperType } from "./types/helpers";

export interface VibeCodingPromptOptions {
  projectId: string;
  currentTask?: string;
  focusArea?: string;
  context?: HelperContext;
}

/**
 * Generate a comprehensive prompt for external Vibecoding tools (Cursor, Lovable, Bolt, etc.)
 */
export function generateVibecodingPrompt(
  options: VibeCodingPromptOptions
): string {
  const { context, currentTask, focusArea } = options;
  
  if (!context) {
    return "Unable to generate prompt: No context available.";
  }

  const sections: string[] = [];

  // Header
  sections.push("# PROJECT CONTEXT FOR VIBECODING");
  sections.push("");
  sections.push("This prompt contains comprehensive context about my project, gathered from my journey with the Codyssey team of AI helpers.");
  sections.push("");

  // Project Overview
  sections.push("## PROJECT OVERVIEW");
  sections.push("");
  if (context.projectName) {
    sections.push(`**Project Name:** ${context.projectName}`);
  }
  if (context.projectDescription) {
    sections.push(`**Description:** ${context.projectDescription}`);
  }
  if (context.projectGoal) {
    sections.push(`**Goal:** ${context.projectGoal}`);
  }
  if (context.problemStatement) {
    sections.push("");
    sections.push(`**Problem Statement:**`);
    sections.push(context.problemStatement);
  }
  if (context.targetAudience) {
    sections.push("");
    sections.push(`**Target Audience:** ${context.targetAudience}`);
  }
  if (context.valueProposition) {
    sections.push("");
    sections.push(`**Value Proposition:** ${context.valueProposition}`);
  }
  sections.push("");

  // Technical Context
  if (context.projectTechStack || context.projectLocation) {
    sections.push("## TECHNICAL CONTEXT");
    sections.push("");
    if (context.projectTechStack) {
      sections.push(`**Tech Stack:** ${context.projectTechStack}`);
    }
    if (context.projectStage) {
      sections.push(`**Current Stage:** ${context.projectStage}`);
    }
    if (context.projectLocation) {
      sections.push(`**Project Location:** ${context.projectLocation}`);
    }
    sections.push("");
  }

  // Journey Progress
  if (context.journeyProgress) {
    sections.push("## MY JOURNEY PROGRESS");
    sections.push("");
    sections.push(`- Currently at **Level ${context.journeyProgress.currentLevel}**`);
    sections.push(`- Earned **${context.journeyProgress.xp} XP**`);
    sections.push(`- Completed **${context.journeyProgress.completedCount} out of ${context.journeyProgress.totalTasks}** tasks`);
    sections.push("");
  }

  // Completed Tasks (Milestones)
  if (context.allCompletedTasks && context.allCompletedTasks.length > 0) {
    sections.push("## COMPLETED MILESTONES");
    sections.push("");
    sections.push("Here's what I've already accomplished:");
    sections.push("");
    
    const tasksByLevel: Record<number, typeof context.allCompletedTasks> = {};
    context.allCompletedTasks.forEach(task => {
      if (!tasksByLevel[task.level]) tasksByLevel[task.level] = [];
      tasksByLevel[task.level].push(task);
    });
    
    Object.keys(tasksByLevel).sort().forEach(levelKey => {
      const level = parseInt(levelKey);
      const tasks = tasksByLevel[level];
      sections.push(`### Level ${level}`);
      tasks.forEach(task => {
        sections.push(`- ✅ ${task.title}`);
      });
      sections.push("");
    });
  }

  // Insights from Team of Helpers
  if (context.otherHelperConversations && context.otherHelperConversations.length > 0) {
    sections.push("## INSIGHTS FROM MY TEAM");
    sections.push("");
    sections.push("I've been working with a team of specialized AI helpers. Here are key insights from our conversations:");
    sections.push("");

    const helperOrder: HelperType[] = ['muse', 'architect', 'crafter', 'hacker', 'hypebeast', 'sensei'];
    
    helperOrder.forEach(helperId => {
      const helperConvo = context.otherHelperConversations?.find(
        h => h.helper.toLowerCase() === helperId
      );
      
      if (helperConvo && helperConvo.recentMessages.length > 0) {
        const helperData = getHelperById(helperId);
        sections.push(`### ${helperData.emoji} ${helperData.name} (${helperData.title})`);
        sections.push("");
        
        // Extract key points from conversation
        const userMessages = helperConvo.recentMessages.filter(m => m.role === 'user');
        const assistantMessages = helperConvo.recentMessages.filter(m => m.role === 'assistant');
        
        if (userMessages.length > 0) {
          sections.push("**What I asked about:**");
          userMessages.slice(-2).forEach(msg => {
            const preview = msg.content.length > 200 ? msg.content.substring(0, 200) + '...' : msg.content;
            sections.push(`- ${preview}`);
          });
          sections.push("");
        }
        
        if (assistantMessages.length > 0) {
          sections.push("**Key insights:**");
          assistantMessages.slice(-2).forEach(msg => {
            const preview = msg.content.length > 300 ? msg.content.substring(0, 300) + '...' : msg.content;
            sections.push(preview);
            sections.push("");
          });
        }
      }
    });
  }

  // Current Step
  if (context.currentStep) {
    sections.push("## CURRENT STEP");
    sections.push("");
    sections.push(`**${context.currentStep.levelTitle}** → **${context.currentStep.stepTitle}**`);
    sections.push(`**Goal:** ${context.currentStep.cta}`);
    sections.push("");
  }

  // Active Tasks
  if (context.tasks && context.tasks.length > 0) {
    sections.push("## ACTIVE TASKS");
    sections.push("");
    const incompleteTasks = context.tasks.filter(t => t.status !== 'done');
    
    if (incompleteTasks.length > 0) {
      sections.push("Tasks I'm working on:");
      sections.push("");
      incompleteTasks.forEach(task => {
        const statusIcon = task.status === 'in_progress' ? '🔄' : '⭕';
        const reqLabel = task.required ? '(Required)' : '(Optional)';
        sections.push(`${statusIcon} **${task.title}** ${reqLabel}`);
        sections.push(`   ${task.description}`);
        sections.push("");
      });
    }
  }

  // Current Challenge / What I Need Help With
  sections.push("## WHAT I NEED HELP WITH");
  sections.push("");
  if (currentTask) {
    sections.push(`**Current Task:** ${currentTask}`);
    sections.push("");
  }
  if (focusArea) {
    sections.push(`**Focus Area:** ${focusArea}`);
    sections.push("");
  }
  
  if (!currentTask && !focusArea) {
    sections.push("I need help implementing the features and tasks outlined above.");
    sections.push("");
  }

  // Footer
  sections.push("---");
  sections.push("");
  sections.push("Please help me implement this with clean, maintainable code that follows best practices.");
  sections.push("Consider the context above when making technical decisions.");

  return sections.join("\n");
}

/**
 * Generate a shorter summary prompt (for quick copy-paste)
 */
export function generateQuickPrompt(options: VibeCodingPromptOptions): string {
  const { context, currentTask } = options;
  
  if (!context) {
    return "Unable to generate prompt: No context available.";
  }

  const parts: string[] = [];

  parts.push(`Project: ${context.projectName || 'My Project'}`);
  
  if (context.projectDescription) {
    parts.push(`Description: ${context.projectDescription}`);
  }

  if (context.projectTechStack) {
    parts.push(`Tech Stack: ${context.projectTechStack}`);
  }

  if (currentTask) {
    parts.push(`Task: ${currentTask}`);
  } else if (context.currentStep) {
    parts.push(`Current Goal: ${context.currentStep.cta}`);
  }

  if (context.journeyProgress) {
    parts.push(`Progress: Level ${context.journeyProgress.currentLevel}, ${context.journeyProgress.completedCount}/${context.journeyProgress.totalTasks} tasks completed`);
  }

  return parts.join('\n');
}

