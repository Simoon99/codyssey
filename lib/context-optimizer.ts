/**
 * Context Optimizer - Smart Memory & Token Management System
 * 
 * This module optimizes context window usage by:
 * 1. Summarizing old conversations
 * 2. Extracting key decisions and insights
 * 3. Selecting only relevant context
 * 4. Compressing verbose information
 */

import { type HelperType } from "./types/helpers";

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ProjectMemory {
  // Core decisions (persistent)
  problemStatement?: string;
  targetAudience?: string;
  valueProposition?: string;
  mvpScope?: string;
  techStack?: string;
  
  // Key insights per helper (compressed)
  helperInsights: Record<HelperType, string[]>;
  
  // Completed milestones (summary only)
  completedMilestones: string[];
  
  // Current focus (most recent)
  currentFocus?: string;
  lastUpdated: string;
}

export interface OptimizedContext {
  // Essential project info (always included)
  coreProject: {
    name: string;
    description: string;
    goal?: string;
  };
  
  // Compressed memory (key decisions only)
  memory: ProjectMemory;
  
  // Current session context (recent + relevant)
  currentSession: {
    helper: HelperType;
    activeTasks: Array<{
      id: string;
      title: string;
      description: string;
      required: boolean;
    }>;
    recentMessages: ConversationMessage[]; // Last 4-6 messages
  };
  
  // Cross-helper context (ultra-compressed)
  crossHelperSummaries?: Record<string, string>; // One sentence per helper
  
  // Token count estimate
  estimatedTokens: number;
}

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Summarize a conversation into key insights (1-2 sentences per insight)
 */
export function summarizeConversation(
  messages: ConversationMessage[],
  maxInsights: number = 5
): string[] {
  // This is a simplified version - in production, you could use an LLM to generate summaries
  const insights: string[] = [];
  
  // Group messages by topic/theme
  // Look for user questions and assistant answers with key decisions
  for (let i = 0; i < messages.length; i += 2) {
    if (insights.length >= maxInsights) break;
    
    const userMsg = messages[i];
    const assistantMsg = messages[i + 1];
    
    if (!userMsg || !assistantMsg) continue;
    
    // Extract key points (looking for decisions, specifications, etc.)
    const hasDecision = 
      assistantMsg.content.includes("decided") ||
      assistantMsg.content.includes("chose") ||
      assistantMsg.content.includes("selected") ||
      assistantMsg.content.includes("defined");
    
    if (hasDecision) {
      // Truncate to first 150 chars of assistant response
      const summary = assistantMsg.content
        .substring(0, 150)
        .replace(/\n/g, " ")
        .trim() + "...";
      insights.push(summary);
    }
  }
  
  return insights;
}

/**
 * Compress other helper conversations into one-line summaries
 */
export function compressHelperConversations(
  helperConversations: Array<{
    helper: string;
    recentMessages: ConversationMessage[];
  }>
): Record<string, string> {
  const summaries: Record<string, string> = {};
  
  helperConversations.forEach(({ helper, recentMessages }) => {
    if (recentMessages.length === 0) return;
    
    // Take the most recent assistant message and compress to one sentence
    const lastAssistant = recentMessages
      .filter(m => m.role === "assistant")
      .pop();
    
    if (lastAssistant) {
      const firstSentence = lastAssistant.content
        .split(/[.!?]/)[0]
        .trim()
        .substring(0, 100);
      summaries[helper] = firstSentence;
    }
  });
  
  return summaries;
}

/**
 * Build optimized context with smart token management
 * Target: Keep under 4000 tokens for context (leaving room for response)
 */
export function buildOptimizedContext(params: {
  projectName: string;
  projectDescription: string;
  projectGoal?: string;
  currentHelper: HelperType;
  activeTasks: Array<{
    id: string;
    title: string;
    description: string;
    required: boolean;
    status: string;
  }>;
  recentMessages?: ConversationMessage[];
  projectMemory?: ProjectMemory;
  otherHelperConversations?: Array<{
    helper: string;
    recentMessages: ConversationMessage[];
  }>;
  allCompletedTasks?: Array<{ title: string; level: number }>;
}): OptimizedContext {
  const {
    projectName,
    projectDescription,
    projectGoal,
    currentHelper,
    activeTasks,
    recentMessages = [],
    projectMemory,
    otherHelperConversations = [],
    allCompletedTasks = [],
  } = params;

  // 1. Core Project (always include - ~200 tokens)
  const coreProject = {
    name: projectName,
    description: projectDescription.substring(0, 300), // Limit description
    goal: projectGoal?.substring(0, 200),
  };

  // 2. Memory (compressed key decisions - ~500-800 tokens)
  const memory: ProjectMemory = projectMemory || {
    helperInsights: {
      muse: [],
      architect: [],
      crafter: [],
      hacker: [],
      hypebeast: [],
      sensei: [],
    },
    completedMilestones: [],
    lastUpdated: new Date().toISOString(),
  };

  // Add milestone summary (compress completed tasks)
  if (allCompletedTasks.length > 0) {
    const milestoneGroups = new Map<number, number>();
    allCompletedTasks.forEach(task => {
      milestoneGroups.set(task.level, (milestoneGroups.get(task.level) || 0) + 1);
    });
    
    memory.completedMilestones = Array.from(milestoneGroups.entries())
      .map(([level, count]) => `L${level}: ${count} tasks`)
      .slice(0, 5); // Only keep recent 5 levels
  }

  // 3. Current Session (recent + relevant - ~1000-1500 tokens)
  const currentSession = {
    helper: currentHelper,
    activeTasks: activeTasks
      .filter(t => t.required || t.status !== "todo") // Only required or active tasks
      .slice(0, 5) // Limit to 5 most relevant tasks
      .map(t => ({
        id: t.id,
        title: t.title,
        description: t.description.substring(0, 150), // Truncate descriptions
        required: t.required,
      })),
    recentMessages: recentMessages.slice(-6), // Last 6 messages (3 exchanges)
  };

  // 4. Cross-helper summaries (ultra-compressed - ~200-400 tokens)
  const crossHelperSummaries = compressHelperConversations(
    otherHelperConversations.slice(0, 3) // Only 3 most relevant helpers
  );

  // Calculate estimated tokens
  let estimatedTokens = 0;
  estimatedTokens += estimateTokens(JSON.stringify(coreProject));
  estimatedTokens += estimateTokens(JSON.stringify(memory));
  estimatedTokens += estimateTokens(JSON.stringify(currentSession));
  estimatedTokens += estimateTokens(JSON.stringify(crossHelperSummaries));

  return {
    coreProject,
    memory,
    currentSession,
    crossHelperSummaries,
    estimatedTokens,
  };
}

/**
 * Update project memory with new insights from a conversation
 */
export function updateProjectMemory(
  currentMemory: ProjectMemory,
  helper: HelperType,
  newMessages: ConversationMessage[],
  extractedDecisions?: {
    problemStatement?: string;
    targetAudience?: string;
    valueProposition?: string;
    mvpScope?: string;
    techStack?: string;
  }
): ProjectMemory {
  const updated = { ...currentMemory };
  
  // Update core decisions if provided
  if (extractedDecisions) {
    Object.assign(updated, extractedDecisions);
  }
  
  // Add new insights for this helper
  const newInsights = summarizeConversation(newMessages, 3);
  updated.helperInsights[helper] = [
    ...updated.helperInsights[helper],
    ...newInsights,
  ].slice(-5); // Keep only last 5 insights per helper
  
  updated.lastUpdated = new Date().toISOString();
  
  return updated;
}

/**
 * Build context string for LLM from optimized context
 */
export function buildContextString(optimizedContext: OptimizedContext): string {
  const { coreProject, memory, currentSession, crossHelperSummaries } = optimizedContext;
  
  let contextStr = `**PROJECT:**\n`;
  contextStr += `Name: ${coreProject.name}\n`;
  contextStr += `Description: ${coreProject.description}\n`;
  if (coreProject.goal) {
    contextStr += `Goal: ${coreProject.goal}\n`;
  }
  
  // Key decisions
  if (memory.problemStatement) {
    contextStr += `\n**PROBLEM:** ${memory.problemStatement}\n`;
  }
  if (memory.targetAudience) {
    contextStr += `**AUDIENCE:** ${memory.targetAudience}\n`;
  }
  if (memory.valueProposition) {
    contextStr += `**VALUE PROP:** ${memory.valueProposition}\n`;
  }
  if (memory.techStack) {
    contextStr += `**TECH STACK:** ${memory.techStack}\n`;
  }
  
  // Progress
  if (memory.completedMilestones.length > 0) {
    contextStr += `\n**PROGRESS:** ${memory.completedMilestones.join(", ")}\n`;
  }
  
  // Current focus
  if (memory.currentFocus) {
    contextStr += `**CURRENT FOCUS:** ${memory.currentFocus}\n`;
  }
  
  // Active tasks
  if (currentSession.activeTasks.length > 0) {
    contextStr += `\n**ACTIVE TASKS:**\n`;
    currentSession.activeTasks.forEach(task => {
      contextStr += `• ${task.title}${task.required ? " (Required)" : ""}\n`;
    });
  }
  
  // Helper insights
  const helperInsights = memory.helperInsights[currentSession.helper];
  if (helperInsights.length > 0) {
    contextStr += `\n**PREVIOUS INSIGHTS (${currentSession.helper}):**\n`;
    helperInsights.forEach((insight, i) => {
      contextStr += `${i + 1}. ${insight}\n`;
    });
  }
  
  // Other helpers' work (compressed)
  if (crossHelperSummaries && Object.keys(crossHelperSummaries).length > 0) {
    contextStr += `\n**OTHER HELPERS:**\n`;
    Object.entries(crossHelperSummaries).forEach(([helper, summary]) => {
      contextStr += `• ${helper}: ${summary}\n`;
    });
  }
  
  return contextStr;
}

/**
 * Smart context selector - chooses what to include based on current task
 */
export function selectRelevantContext(params: {
  fullContext: OptimizedContext;
  currentTaskIds: string[];
  maxTokens?: number;
}): OptimizedContext {
  const { fullContext, currentTaskIds, maxTokens = 3500 } = params;
  
  // Start with essential context
  let selected = { ...fullContext };
  
  // If over budget, start removing less critical elements
  while (selected.estimatedTokens > maxTokens) {
    // 1. Remove old helper summaries first
    if (selected.crossHelperSummaries && Object.keys(selected.crossHelperSummaries).length > 0) {
      const helpers = Object.keys(selected.crossHelperSummaries);
      delete selected.crossHelperSummaries[helpers[helpers.length - 1]];
      continue;
    }
    
    // 2. Reduce recent messages
    if (selected.currentSession.recentMessages.length > 2) {
      selected.currentSession.recentMessages = selected.currentSession.recentMessages.slice(-4);
      continue;
    }
    
    // 3. Reduce active tasks
    if (selected.currentSession.activeTasks.length > 3) {
      selected.currentSession.activeTasks = selected.currentSession.activeTasks.slice(0, 3);
      continue;
    }
    
    // If still over, we've done our best
    break;
  }
  
  // Recalculate tokens
  selected.estimatedTokens = estimateTokens(buildContextString(selected));
  
  return selected;
}


