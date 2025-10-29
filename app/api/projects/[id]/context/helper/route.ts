import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";

/**
 * POST /api/projects/[id]/context/helper
 * Updates helper-specific context as the journey progresses
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const projectId = params.id;
    const body = await request.json();
    const {
      helper,
      keyInsights = [],
      decisionsMade = [],
      artifactsCreated = [],
      helperSpecificData = {},
      contextSummary = "",
      messageId = null,
    } = body;

    if (!helper || !projectId) {
      return NextResponse.json(
        { error: "Missing helper or projectId" },
        { status: 400 },
      );
    }

    // Get user
    const supabase = await getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId =
      user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if helper context already exists
    const { data: existing } = await supabase
      .from("helper_context")
      .select("*")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .eq("helper", helper)
      .single();

    // Prepare the helper-specific field name (e.g., "muse_validation", "architect_blueprint")
    const helperFieldMap: Record<string, string> = {
      muse: "muse_validation",
      architect: "architect_blueprint",
      crafter: "crafter_design",
      hacker: "hacker_prompts",
      hypebeast: "hypebeast_launch",
      sensei: "sensei_growth",
    };

    const helperField = helperFieldMap[helper];
    if (!helperField) {
      return NextResponse.json(
        { error: "Invalid helper type" },
        { status: 400 },
      );
    }

    let result;

    if (existing) {
      // Merge new data with existing
      const updatedKeyInsights = [
        ...(existing.key_insights || []),
        ...keyInsights,
      ];
      const updatedDecisions = [
        ...(existing.decisions_made || []),
        ...decisionsMade,
      ];
      const updatedArtifacts = [
        ...(existing.artifacts_created || []),
        ...artifactsCreated,
      ];

      // Merge helper-specific data
      const existingHelperData = existing[helperField] || {};
      const mergedHelperData = {
        ...existingHelperData,
        ...helperSpecificData,
      };

      const { data: updated, error: updateError } = await supabase
        .from("helper_context")
        .update({
          key_insights: updatedKeyInsights,
          decisions_made: updatedDecisions,
          artifacts_created: updatedArtifacts,
          [helperField]: mergedHelperData,
          context_summary: contextSummary || existing.context_summary,
          last_updated_by_message_id: messageId,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (updateError) {
        console.error(
          "[Helper Context] Error updating helper context:",
          updateError,
        );
        return NextResponse.json(
          { error: "Failed to update helper context" },
          { status: 500 },
        );
      }

      result = updated;
    } else {
      // Create new helper context entry
      const { data: created, error: createError } = await supabase
        .from("helper_context")
        .insert({
          user_id: userId,
          project_id: projectId,
          helper,
          key_insights: keyInsights,
          decisions_made: decisionsMade,
          artifacts_created: artifactsCreated,
          [helperField]: helperSpecificData,
          context_summary: contextSummary,
          last_updated_by_message_id: messageId,
        })
        .select()
        .single();

      if (createError) {
        console.error(
          "[Helper Context] Error creating helper context:",
          createError,
        );
        return NextResponse.json(
          { error: "Failed to create helper context" },
          { status: 500 },
        );
      }

      result = created;
    }

    return NextResponse.json({
      success: true,
      helperContext: result,
    });
  } catch (error) {
    console.error("[Helper Context] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/projects/[id]/context/helper?helper=muse
 * Retrieves helper-specific context
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const projectId = params.id;
    const { searchParams } = new URL(request.url);
    const helper = searchParams.get("helper");

    if (!helper || !projectId) {
      return NextResponse.json(
        { error: "Missing helper or projectId" },
        { status: 400 },
      );
    }

    const supabase = await getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId =
      user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("helper_context")
      .select("*")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .eq("helper", helper)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("[Helper Context] Error fetching:", error);
      return NextResponse.json(
        { error: "Failed to fetch helper context" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      helperContext: data || null,
    });
  } catch (error) {
    console.error("[Helper Context] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

