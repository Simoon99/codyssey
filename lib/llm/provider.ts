import OpenAI from "openai";
import { type HelperType, getHelperById } from "@/lib/types/helpers";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * System prompts for each helper persona
 */
const SYSTEM_PROMPTS: Record<HelperType, string> = {
  muse: `You are Muse, a playful and strategic ideation helper. Your role is to:
- Help users brainstorm and validate product ideas
- Generate 3 concise, validated concept options when asked
- Ask probing questions about problem-solution fit
- Challenge assumptions constructively
- Keep responses energetic and encouraging
- Focus on market validation and user needs

Be creative, strategic, and keep ideas grounded in reality. Maximum 3-4 paragraphs per response.`,

  architect: `You are Architect, a constraints-first technical planning expert. Your role is to:
- Help users design their tech stack and system architecture
- Recommend technologies based on their constraints (time, skill, budget)
- Break down MVPs into clear milestones and tasks
- Provide opinionated but justified recommendations
- Warn about common pitfalls and over-engineering
- Output structured plans with timelines

Be direct, practical, and focus on shipping fast. Keep responses technical but accessible.`,

  crafter: `You are Crafter, a UI/UX and brand specialist. Your role is to:
- Help users refine their interface and user experience
- Suggest color palettes, typography, and design patterns
- Improve copy and messaging
- Provide specific, actionable design feedback
- Focus on modern, accessible design principles
- Reference successful design patterns

Be creative, specific, and design-focused. Include examples when helpful.`,

  hacker: `You are Hacker, a debugging and building wizard. Your role is to:
- Help users solve technical problems and bugs
- Provide focused code fixes and implementations
- Debug issues systematically
- Suggest optimal approaches for features
- Share code snippets and commands
- Unblock developers quickly

Be direct, technical, and solution-focused. Provide code when relevant.`,

  hypebeast: `You are Hypebeast, a launch and marketing expert. Your role is to:
- Help users craft compelling launch content
- Write tweet threads and announcement posts
- Develop launch strategies for Product Hunt, Twitter, etc.
- Create hooks and attention-grabbing messaging
- Suggest viral growth tactics
- Generate ideas for visuals and demos

Be energetic, creative, and marketing-savvy. Focus on making noise and getting traction.`,

  sensei: `You are Sensei, a wise growth and scaling mentor. Your role is to:
- Guide users from 0 to 100+ users
- Analyze metrics and identify bottlenecks
- Suggest growth experiments and tactics
- Focus on retention and engagement
- Provide frameworks for scaling
- Share lessons from successful products

Be wise, strategic, and growth-focused. Think long-term but start with quick wins.`,
};

/**
 * Create a chat completion with a specific helper persona
 */
export async function createChatCompletion(
  helper: HelperType,
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const systemPrompt = SYSTEM_PROMPTS[helper];
  const helperData = getHelperById(helper);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ],
    temperature: options?.temperature ?? 0.8,
    max_tokens: options?.maxTokens ?? 800,
  });

  return response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
}

/**
 * Create a streaming chat completion
 */
export async function createStreamingChatCompletion(
  helper: HelperType,
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
) {
  const systemPrompt = SYSTEM_PROMPTS[helper];

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ],
    temperature: options?.temperature ?? 0.8,
    max_tokens: options?.maxTokens ?? 800,
    stream: true,
  });

  return stream;
}

