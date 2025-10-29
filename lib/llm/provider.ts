import OpenAI from "openai";
import { type HelperType, getHelperById } from "@/lib/types/helpers";
import { buildTaskAwarePrompt } from "./task-prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Enhanced context for AI helpers
 */
export interface HelperContext {
  projectName?: string;
  projectDescription?: string;
  projectTechStack?: string;
  projectStage?: string;
  projectGoal?: string;
  projectLocation?: string;
  problemStatement?: string;
  targetAudience?: string;
  valueProposition?: string;
  currentStep?: {
    levelTitle: string;
    stepTitle: string;
    cta: string;
  };
  tasks?: Array<{
    id: string;
    title: string;
    description: string;
    required: boolean;
    status: "todo" | "in_progress" | "done";
    xp_reward: number;
  }>;
  requiredTasks?: string[];
  // Cross-helper and journey context
  allCompletedTasks?: Array<{
    id: string;
    title: string;
    level: number;
    completedAt: string;
  }>;
  otherHelperConversations?: Array<{
    helper: string;
    recentMessages: Array<{ role: string; content: string }>;
  }>;
  journeyProgress?: {
    currentLevel: number;
    xp: number;
    totalTasks: number;
    completedCount: number;
  };
  // Recent messages from current chat session
  recentMessages?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  // Structured insights from each helper
  helperInsights?: Array<{
    helper: string;
    summary?: string;
    keyInsights?: Array<string>;
    decisionsMade?: Array<string>;
    artifactsCreated?: Array<string>;
    museValidation?: any;
    architectBlueprint?: any;
    crafterDesign?: any;
    hackerPrompts?: any;
    hypebeastLaunch?: any;
    senseiGrowth?: any;
  }>;
}

/**
 * Base system prompts for each helper persona
 */
const BASE_SYSTEM_PROMPTS: Record<HelperType, string> = {
  muse: `You are Muse, the Ideator—a playful, strategic thinker who sparks viral app ideas.

Your role: Help users define their core problem, research competitors, and identify market opportunities.

Style: Enthusiastic, conversational, validating. Use emojis occasionally to keep energy high.

When helping users:
- Ask probing questions about problem-solution fit
- Challenge assumptions constructively
- Generate 1-paragraph problem statements
- Provide 3-5 competitor insights with strengths/weaknesses
- Identify 3+ opportunities to differentiate
- Keep responses energetic and encouraging (3-4 paragraphs max)

Focus on market validation and user needs. Be creative but grounded in reality.`,

  architect: `You are Architect, the Stack Master—a constraints-first thinker who loves building with structure.

Your role: Help users design their tech stack, system architecture, and technical solutions.

Style: Methodical, practical, grounded. Direct but accessible.

When helping users:
- Recommend technologies based on their constraints (time, skill, budget)
- Break down MVPs into clear milestones and tasks
- Provide opinionated but justified recommendations
- Warn about common pitfalls and over-engineering
- Output structured plans with timelines
- Focus on shipping fast

Provide tech stack recommendations, system architecture descriptions, data flow overviews, and risk mitigation strategies.`,

  crafter: `You are Crafter, the Brand Weaver—a detail-oriented designer who loves clarity and user delight.

Your role: Help users refine their interface, user experience, and visual design.

Style: Visual, iterative, empowering. Precise and design-focused.

When helping users:
- Suggest color palettes, typography, and design patterns
- Improve copy and messaging
- Provide specific, actionable design feedback
- Focus on modern, accessible design principles
- Reference successful design patterns
- Create wireframe descriptions and UI system guidelines

Include examples when helpful. Think about spacing, consistency, and delight.`,

  hacker: `You are Hacker, the Unblocker—pragmatic, solution-focused, ship-first.

Your role: Help users solve technical problems, debug issues, and build features.

Style: Direct, technical, solution-focused. Code-aware and practical.

When helping users:
- Provide focused code fixes and implementations
- Debug issues systematically
- Suggest optimal approaches for features
- Share code snippets and commands when relevant
- Unblock developers quickly with clear solutions
- Output step-by-step instructions

Be technical but clear. Include example code, diffs, or terminal commands when helpful.`,

  hypebeast: `You are Hypebeast, the Launch Maestro—narrative, energy, virality.

Your role: Help users craft compelling launch content and marketing strategies.

Style: Energetic, creative, storytelling-focused. Marketing-savvy.

When helping users:
- Write tweet threads and announcement posts
- Develop launch strategies for Product Hunt, Twitter, HN, etc.
- Create hooks and attention-grabbing messaging
- Suggest viral growth tactics
- Generate ideas for visuals and demos
- Craft landing page copy with strong CTAs

Focus on making noise and getting traction. Be energetic and creative.`,

  sensei: `You are Sensei, the Growth Sage—deep wisdom on behavior and retention.

Your role: Guide users from 0 to 100+ users with strategic growth insights.

Style: Thoughtful, strategic, growth-focused. Wise and behavioral science-aware.

When helping users:
- Analyze metrics and identify bottlenecks
- Suggest growth experiments and tactics
- Focus on retention and engagement
- Provide frameworks for scaling
- Share lessons from successful products
- Design habit loops and activation strategies

Think long-term but start with quick wins. Be strategic and data-informed.`,
};

/**
 * Build context-aware system prompt
 */
function buildContextualSystemPrompt(
  helper: HelperType,
  context?: HelperContext
): string {
  let prompt = BASE_SYSTEM_PROMPTS[helper];

  if (context) {
    prompt += "\n\n---\n\n**CURRENT CONTEXT:**\n";

    // Project Information
    if (context.projectName) {
      prompt += `\n**Project:** ${context.projectName}`;
      if (context.projectDescription) {
        prompt += ` — ${context.projectDescription}`;
      }
      if (context.projectGoal) {
        prompt += `\n**Goal:** ${context.projectGoal}`;
      }
      if (context.problemStatement) {
        prompt += `\n**Problem Statement:** ${context.problemStatement}`;
      }
      if (context.targetAudience) {
        prompt += `\n**Target Audience:** ${context.targetAudience}`;
      }
      if (context.valueProposition) {
        prompt += `\n**Value Proposition:** ${context.valueProposition}`;
      }
      if (context.projectTechStack) {
        prompt += `\n**Tech Stack:** ${context.projectTechStack}`;
      }
      if (context.projectStage) {
        prompt += `\n**Current Stage:** ${context.projectStage}`;
      }
      if (context.projectLocation) {
        prompt += `\n**Project Location:** ${context.projectLocation}`;
      }
    }

    // Journey Progress
    if (context.journeyProgress) {
      prompt += `\n\n**Journey Progress:**`;
      prompt += `\n- Level ${context.journeyProgress.currentLevel}`;
      prompt += `\n- ${context.journeyProgress.xp} XP earned`;
      prompt += `\n- ${context.journeyProgress.completedCount}/${context.journeyProgress.totalTasks} total tasks completed`;
    }

    // Current Step
    if (context.currentStep) {
      prompt += `\n\n**Current Step:** ${context.currentStep.levelTitle} → ${context.currentStep.stepTitle}`;
      prompt += `\n**Goal:** ${context.currentStep.cta}`;
    }

    // Active Tasks for Current Step
    if (context.tasks && context.tasks.length > 0) {
      prompt += `\n\n**Tasks for this Step:**`;
      
      context.tasks.forEach(task => {
        const statusIcon = task.status === 'done' ? '✅' : task.status === 'in_progress' ? '🔄' : '⭕';
        prompt += `\n- ${statusIcon} ${task.title} — ${task.description} (${task.xp_reward}xp)`;
      });

      prompt += `\n\n**Your Role:** Help the user complete these tasks by providing guidance, examples, and actionable steps. Reference specific tasks when relevant. Celebrate completed tasks!`;
      
      // Add task-specific guidance if available
      const taskIds = context.tasks.map(t => t.id);
      const taskGuidance = buildTaskAwarePrompt(taskIds, {
        maxTasks: 5,
        maxTokens: 700,
      });
      if (taskGuidance) {
        prompt += taskGuidance;
      }
    }

    // All Completed Tasks (for context, not displayed in UI) - Only recent levels
    if (context.allCompletedTasks && context.allCompletedTasks.length > 0) {
      const currentLevel = context.journeyProgress?.currentLevel || 1;
      // Only show tasks from current and previous level to save tokens
      const recentTasks = context.allCompletedTasks.filter(
        task => task.level >= currentLevel - 1 && task.level <= currentLevel
      );
      
      if (recentTasks.length > 0) {
        prompt += `\n\n**Recent Completed Tasks:** ${recentTasks.map(t => t.title).join(', ')}`;
      }
    }

    // Helper relevance map: which helpers' insights are most relevant to each helper
    const relevanceMap: Record<string, string[]> = {
      muse: [], // Muse is first, no previous context
      architect: ["muse"], // Needs problem validation and MVP scope
      crafter: ["muse", "architect"], // Needs problem/users + tech stack
      hacker: ["architect", "crafter"], // Needs tech stack + design system
      hypebeast: ["muse", "crafter"], // Needs value prop + brand identity
      sensei: ["muse", "architect", "hacker", "hypebeast"], // Needs all previous work
    };

    const relevantHelpers = relevanceMap[helper] || [];

    // Structured Helper Insights (PREFERRED - use if available)
    if (context.helperInsights && context.helperInsights.length > 0) {
      const filteredInsights = context.helperInsights.filter((insight) =>
        relevantHelpers.includes(insight.helper.toLowerCase())
      );

      if (filteredInsights.length > 0) {
        prompt += `\n\n**Insights from Previous Helpers:**`;
        prompt += `\n(Reference these when relevant to the user's question)\n`;

        filteredInsights.forEach((insight) => {
          const helperName =
            insight.helper.charAt(0).toUpperCase() + insight.helper.slice(1);

          if (insight.summary) {
            prompt += `\n**${helperName}:** ${insight.summary}`;
          } else if (
            insight.keyInsights &&
            insight.keyInsights.length > 0
          ) {
            prompt += `\n**${helperName}:** ${insight.keyInsights.slice(0, 3).join("; ")}`;
          }

          // Add helper-specific structured data if relevant
          const helperDataMap: Record<string, string> = {
            muse: "museValidation",
            architect: "architectBlueprint",
            crafter: "crafterDesign",
            hacker: "hackerPrompts",
            hypebeast: "hypebeastLaunch",
            sensei: "senseiGrowth",
          };

          const dataKey = helperDataMap[insight.helper.toLowerCase()];
          if (dataKey && (insight as any)[dataKey]) {
            const data = (insight as any)[dataKey];
            // Show compact version of structured data
            const compactData = Object.entries(data)
              .slice(0, 3)
              .map(([k, v]) => `${k}: ${JSON.stringify(v).slice(0, 50)}`)
              .join("; ");
            if (compactData) {
              prompt += ` | Details: ${compactData}`;
            }
          }
        });
      }
    } else if (
      context.otherHelperConversations &&
      context.otherHelperConversations.length > 0
    ) {
      // Fallback to conversation snippets (filtered by relevancy)
      const filteredHelpers = context.otherHelperConversations.filter(
        (h) =>
          relevantHelpers.includes(h.helper.toLowerCase()) &&
          h.recentMessages.length > 0
      );

      if (filteredHelpers.length > 0) {
        prompt += `\n\n**Insights from Previous Helpers:**`;
        prompt += `\n(Reference these when relevant to the user's question)\n`;

        filteredHelpers.forEach((helperConvo) => {
          const lastAssistantMsg = helperConvo.recentMessages
            .filter((m) => m.role === "assistant")
            .slice(-1)[0];

          if (lastAssistantMsg) {
            const helperName =
              helperConvo.helper.charAt(0).toUpperCase() +
              helperConvo.helper.slice(1);
            const preview = lastAssistantMsg.content.substring(0, 150);
            prompt += `\n**${helperName}:** ${preview}${lastAssistantMsg.content.length > 150 ? "..." : ""}`;
          }
        });
      }
    }
  }

  return prompt;
}

/**
 * Create a chat completion with a specific helper persona
 */
export async function createChatCompletion(
  helper: HelperType,
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  context?: HelperContext,
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  }
): Promise<string> {
  const systemPrompt = buildContextualSystemPrompt(helper, context);
  const model = options?.model || process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ],
    temperature: options?.temperature ?? 0.8,
    max_tokens: options?.maxTokens ?? 1200,
  });

  return response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
}

/**
 * Create a streaming chat completion
 */
export async function createStreamingChatCompletion(
  helper: HelperType,
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  context?: HelperContext,
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  }
) {
  const systemPrompt = buildContextualSystemPrompt(helper, context);
  const model = options?.model || process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

  const stream = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ],
    temperature: options?.temperature ?? 0.8,
    max_tokens: options?.maxTokens ?? 1200,
    stream: true,
  });

  return stream;
}
