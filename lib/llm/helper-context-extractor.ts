import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface ExtractedHelperContext {
  keyInsights: string[];
  decisionsMade: string[];
  artifactsCreated: string[];
  contextSummary: string;
  helperSpecificData: Record<string, any>;
}

/**
 * Extracts structured context from a helper conversation
 * This runs after significant conversations to build helper-specific knowledge
 * Includes logic to merge/update existing context instead of duplicating
 */
export async function extractHelperContext(
  helper: string,
  projectName: string,
  conversation: ConversationMessage[],
  existingContext?: {
    keyInsights?: string[];
    decisionsMade?: string[];
    artifactsCreated?: string[];
    contextSummary?: string;
    helperSpecificData?: Record<string, any>;
  },
): Promise<ExtractedHelperContext> {
  const helperPrompts: Record<string, string> = {
    muse: `Extract key insights about problem validation, target users, and MVP scope decisions.
    
Helper-specific data to extract:
- problem: refined problem statement
- targetUsers: user personas and pain points
- mvpScope: core features locked for MVP
- competitorInsights: key competitive differentiators`,

    architect: `Extract technical architecture and stack decisions.
    
Helper-specific data to extract:
- techStack: chosen frameworks, languages, tools
- hosting: cloud provider and deployment strategy
- database: database type and schema approach
- auth: authentication provider
- architecture: overall system design pattern
- integrations: third-party services
- costEstimate: monthly infrastructure cost range`,

    crafter: `Extract design system and UI decisions.
    
Helper-specific data to extract:
- designSystem: color palette, typography, spacing rules
- componentStructure: key UI components and patterns
- designTools: v0/Lovable/Figma prompts and templates
- visualDirection: overall aesthetic and inspiration sources`,

    hacker: `Extract prompt engineering and build optimization strategies.
    
Helper-specific data to extract:
- aiTools: Cursor/Bolt/Copilot configurations
- promptMacros: reusable prompt templates
- caoStructure: Context-Action-Output patterns
- buildWorkflow: step-by-step build process`,

    hypebeast: `Extract launch strategy and marketing plans.
    
Helper-specific data to extract:
- launchChannels: Product Hunt, Twitter, Reddit strategies
- contentCalendar: pre/during/post-launch content
- launchGoals: target metrics and success criteria
- teaserCampaign: early awareness tactics`,

    sensei: `Extract growth strategy and optimization insights.
    
Helper-specific data to extract:
- growthMetrics: key KPIs to track
- retentionPlaybook: user retention strategies
- optimizationAreas: A/B tests and improvements
- scalingPlan: roadmap from MVP to scale`,
  };

  const existingContextText = existingContext
    ? `\n\nEXISTING CONTEXT (merge with, don't duplicate):
Key Insights: ${JSON.stringify(existingContext.keyInsights || [])}
Decisions Made: ${JSON.stringify(existingContext.decisionsMade || [])}
Artifacts Created: ${JSON.stringify(existingContext.artifactsCreated || [])}
Summary: ${existingContext.contextSummary || "None"}
Helper Data: ${JSON.stringify(existingContext.helperSpecificData || {})}`
    : "";

  const systemPrompt = `You are analyzing a conversation between a user and ${helper} helper.
Extract structured insights from this conversation.

${helperPrompts[helper] || "Extract key insights and decisions made."}
${existingContextText}

IMPORTANT MERGING RULES:
1. If new info contradicts existing context → REPLACE the old info
2. If new info adds to existing context → MERGE it in
3. If new info is redundant → DON'T duplicate it
4. Update contextSummary to reflect the LATEST state (not cumulative)
5. For helperSpecificData: merge new fields, overwrite changed fields

Return a JSON object with:
{
  "keyInsights": ["insight 1", "insight 2", ...], // NEW or UPDATED insights only (max 5 most relevant)
  "decisionsMade": ["decision 1", "decision 2", ...], // NEW decisions only
  "artifactsCreated": ["artifact 1", "artifact 2", ...], // NEW artifacts only
  "contextSummary": "1-2 sentence summary of CURRENT state (not history)",
  "helperSpecificData": { /* helper-specific data - only include NEW or CHANGED fields */ },
  "supersededInsights": ["old insight 1", ...], // List any OLD insights that should be REMOVED
  "supersededDecisions": ["old decision 1", ...]  // List any OLD decisions that should be REMOVED
}

Be concise and factual. Focus on actionable insights. Avoid duplication.`;

  const conversationText = conversation
    .map((msg) => `${msg.role === "user" ? "User" : helper}: ${msg.content}`)
    .join("\n\n");

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_JSON_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Project: ${projectName}\n\nConversation:\n${conversationText}\n\nExtract insights:`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const extracted = JSON.parse(response.choices[0].message.content || "{}");

    return {
      keyInsights: extracted.keyInsights || [],
      decisionsMade: extracted.decisionsMade || [],
      artifactsCreated: extracted.artifactsCreated || [],
      contextSummary: extracted.contextSummary || "",
      helperSpecificData: extracted.helperSpecificData || {},
    };
  } catch (error) {
    console.error("[Helper Context Extractor] Error:", error);
    // Return empty structure on error
    return {
      keyInsights: [],
      decisionsMade: [],
      artifactsCreated: [],
      contextSummary: "",
      helperSpecificData: {},
    };
  }
}

