import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ExtractedProjectContext {
  goal?: string;
  description?: string;
  location?: string;
  problemStatement?: string;
  targetAudience?: string;
  valueProposition?: string;
  techStack?: string;
  currentStage?: string;
  confidence?: number;
  reasoning?: string;
}

interface ExtractionRequest {
  projectName?: string;
  existingContext?: Partial<ExtractedProjectContext> & {
    description?: string;
    goal?: string;
    location?: string;
  };
  conversation: Array<{ role: "user" | "assistant"; content: string }>;
}

function buildPrompt({
  projectName,
  existingContext,
  conversation,
}: ExtractionRequest): string {
  const existingLines: string[] = [];

  if (existingContext) {
    Object.entries(existingContext).forEach(([key, value]) => {
      if (value && typeof value === "string" && value.trim().length > 0) {
        existingLines.push(`${key}: ${value.trim()}`);
      }
    });
  }

  const transcript = conversation
    .map((item) => {
      const speaker = item.role === "assistant" ? "Muse" : "User";
      return `${speaker}: ${item.content}`;
    })
    .join("\n");

  const projectLine = projectName ? `Project: ${projectName}` : "";
  const existingBlock =
    existingLines.length > 0
      ? `Existing context (for reference, only overwrite if the conversation provides a clearer or updated version):\n${existingLines.join("\n")}`
      : "No reliable context saved yet.";

  return `${projectLine}

${existingBlock}

Conversation transcript:
${transcript}

Extract ONLY what the assistant and user explicitly agreed on. If the conversation does not clearly update a field, leave it empty. Focus on concise, user-facing phrasing.`;
}

export async function extractProjectContext(
  request: ExtractionRequest,
): Promise<ExtractedProjectContext> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const prompt = buildPrompt(request);

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_JSON_MODEL || "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a precise analyst that extracts project context fields from chat transcripts. Return JSON with fields goal, description, location, problemStatement, targetAudience, valueProposition, techStack, currentStage, confidence (0-1 number), reasoning (short sentence). Leave fields as empty strings if there is no new information or the conversation is uncertain.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("Failed to extract project context");
  }

  try {
    const parsed = JSON.parse(raw) as ExtractedProjectContext;
    return parsed;
  } catch (error) {
    console.error("[ContextExtractor] Failed to parse response:", raw, error);
    throw new Error("Invalid JSON returned from context extractor");
  }
}


