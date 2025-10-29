import { NextRequest, NextResponse } from "next/server";
import { generateVibecodingPrompt, generateQuickPrompt } from "@/lib/prompt-generator";

export const runtime = "edge";

interface GeneratePromptRequest {
  projectId: string;
  currentTask?: string;
  focusArea?: string;
  promptType?: "full" | "quick";
}

/**
 * POST /api/prompt/generate - Generate Vibecoding prompt
 */
export async function POST(request: NextRequest) {
  try {
    const body: GeneratePromptRequest = await request.json();
    const { projectId, currentTask, focusArea, promptType = "full" } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId" },
        { status: 400 }
      );
    }

    // Fetch context
    const contextResponse = await fetch(
      `${request.nextUrl.origin}/api/context?projectId=${projectId}`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!contextResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch context" },
        { status: 500 }
      );
    }

    const { context } = await contextResponse.json();

    // Generate prompt
    const prompt = promptType === "quick" 
      ? generateQuickPrompt({ projectId, currentTask, focusArea, context })
      : generateVibecodingPrompt({ projectId, currentTask, focusArea, context });

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Prompt generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

