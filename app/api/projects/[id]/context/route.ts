import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";

/**
 * GET /api/projects/[id]/context
 * Get project context data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    
    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch project with context fields
    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("owner_id", userId)
      .single();

    if (error) {
      console.error("[Project Context] Error fetching project:", error);
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      project,
    });
  } catch (error) {
    console.error("[Project Context] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/[id]/context
 * Save project context data
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    
    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();

    console.log("[Project Context] Saving context for project:", projectId);

    // Update project with context fields
    const { data: updatedProject, error } = await supabase
      .from("projects")
      .update({
        name: body.name,
        description: body.description,
        goal: body.goal,
        location: body.location,
        avatar_url: body.avatarUrl,
        problem_statement: body.problemStatement,
        target_audience: body.targetAudience,
        value_proposition: body.valueProposition,
        tech_stack: body.techStack,
        current_stage: body.currentStage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .eq("owner_id", userId)
      .select()
      .single();

    if (error) {
      console.error("[Project Context] Error updating project:", error);
      return NextResponse.json(
        { error: "Failed to update project" },
        { status: 500 }
      );
    }

    console.log("[Project Context] ✅ Successfully saved project context");

    return NextResponse.json({
      success: true,
      project: updatedProject,
    });
  } catch (error) {
    console.error("[Project Context] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

