import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";
import {
  extractProjectContext,
  type ExtractedProjectContext,
} from "@/lib/llm/context-extractor";

interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

const FIELD_MAP: Record<
  keyof Omit<ExtractedProjectContext, "confidence" | "reasoning">,
  string
> = {
  goal: "goal",
  description: "description",
  location: "location",
  problemStatement: "problem_statement",
  targetAudience: "target_audience",
  valueProposition: "value_proposition",
  techStack: "tech_stack",
  currentStage: "current_stage",
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();
    const {
      helper,
      conversation = [],
    }: {
      helper?: string;
      conversation?: ConversationTurn[];
    } = body || {};

    if (helper !== "muse") {
      return NextResponse.json({ skipped: true, reason: "helper_not_supported" });
    }

    if (!Array.isArray(conversation) || conversation.length === 0) {
      return NextResponse.json(
        { error: "Conversation required" },
        { status: 400 },
      );
    }

    const supabase = await getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select(
        "id, owner_id, name, description, goal, location, problem_statement, target_audience, value_proposition, tech_stack, current_stage",
      )
      .eq("id", projectId)
      .eq("owner_id", userId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const trimmedConversation = conversation
      .filter((turn) => turn?.content?.trim())
      .slice(-8);

    if (trimmedConversation.length === 0) {
      return NextResponse.json(
        { error: "Conversation required" },
        { status: 400 },
      );
    }

    const extraction = await extractProjectContext({
      projectName: project.name,
      existingContext: {
        goal: project.goal,
        description: project.description,
        location: project.location,
        problemStatement: project.problem_statement,
        targetAudience: project.target_audience,
        valueProposition: project.value_proposition,
        techStack: project.tech_stack,
        currentStage: project.current_stage,
      },
      conversation: trimmedConversation,
    });

    const updates: Record<string, string> = {};
    const updatedFields: string[] = [];

    (Object.keys(FIELD_MAP) as Array<keyof typeof FIELD_MAP>).forEach((key) => {
      const value = extraction[key];
      if (!value || typeof value !== "string") {
        return;
      }
      const trimmed = value.trim();
      if (!trimmed) {
        return;
      }

      const column = FIELD_MAP[key];
      const currentValue = project[column as keyof typeof project];

      if ((currentValue || "").trim() === trimmed) {
        return;
      }

      updates[column] = trimmed;
      updatedFields.push(key);
    });

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({
        updated: false,
        updatedFields: [],
        confidence: extraction.confidence ?? null,
        reasoning: extraction.reasoning,
      });
    }

    updates.updated_at = new Date().toISOString();

    const { data: updatedProject, error: updateError } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", projectId)
      .eq("owner_id", userId)
      .select()
      .single();

    if (updateError || !updatedProject) {
      console.error("[ContextSync] Failed to update project:", updateError);
      return NextResponse.json(
        { error: "Failed to update project" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      updated: true,
      updatedFields,
      confidence: extraction.confidence ?? null,
      reasoning: extraction.reasoning,
      project: updatedProject,
    });
  } catch (error) {
    console.error("[ContextSync] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


