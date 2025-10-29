import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";
import { extractHelperContext } from "@/lib/llm/helper-context-extractor";

/**
 * POST /api/projects/[id]/context/helper/extract
 * Extracts insights from helper conversation and updates helper context
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const projectId = params.id;
    const body = await request.json();
    const { helper, projectName, conversation = [], messageId = null } = body;

    if (!helper || !projectName || !projectId) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    // Prepare the helper-specific field name
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

    // Check if helper context already exists
    const { data: existing } = await supabase
      .from("helper_context")
      .select("*")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .eq("helper", helper)
      .single();

    // Extract insights from conversation using AI
    console.log(
      `[Helper Context Extract] Extracting context for ${helper}...`,
    );
    
    // Get existing context for merging
    const existingContextForExtraction = existing
      ? {
          keyInsights: existing.key_insights || [],
          decisionsMade: existing.decisions_made || [],
          artifactsCreated: existing.artifacts_created || [],
          contextSummary: existing.context_summary || "",
          helperSpecificData: existing[helperField] || {},
        }
      : undefined;
    
    const extracted = await extractHelperContext(
      helper,
      projectName,
      conversation,
      existingContextForExtraction,
    );

    let result;

    if (existing) {
      // Smart merge: remove superseded items, add new ones, keep relevant old ones
      const supersededInsights = (extracted as any).supersededInsights || [];
      const supersededDecisions = (extracted as any).supersededDecisions || [];
      
      const mergedInsights = [
        ...(existing.key_insights || []).filter(
          (insight: string) => !supersededInsights.includes(insight)
        ),
        ...extracted.keyInsights,
      ]
        .filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates
        .slice(-10); // Keep last 10 most relevant

      const mergedDecisions = [
        ...(existing.decisions_made || []).filter(
          (decision: string) => !supersededDecisions.includes(decision)
        ),
        ...extracted.decisionsMade,
      ]
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(-10);

      const mergedArtifacts = [
        ...(existing.artifacts_created || []),
        ...extracted.artifactsCreated,
      ]
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(-10);

      // Merge helper-specific data (new fields override old)
      const existingHelperData = existing[helperField] || {};
      const mergedHelperData = {
        ...existingHelperData,
        ...extracted.helperSpecificData,
      };

      const { data: updated, error: updateError } = await supabase
        .from("helper_context")
        .update({
          key_insights: mergedInsights,
          decisions_made: mergedDecisions,
          artifacts_created: mergedArtifacts,
          [helperField]: mergedHelperData,
          context_summary:
            extracted.contextSummary || existing.context_summary,
          last_updated_by_message_id: messageId,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (updateError) {
        console.error(
          "[Helper Context Extract] Error updating:",
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
          key_insights: extracted.keyInsights,
          decisions_made: extracted.decisionsMade,
          artifacts_created: extracted.artifactsCreated,
          [helperField]: extracted.helperSpecificData,
          context_summary: extracted.contextSummary,
          last_updated_by_message_id: messageId,
        })
        .select()
        .single();

      if (createError) {
        console.error(
          "[Helper Context Extract] Error creating:",
          createError,
        );
        return NextResponse.json(
          { error: "Failed to create helper context" },
          { status: 500 },
        );
      }

      result = created;
    }

    console.log(
      `[Helper Context Extract] ✅ Updated ${helper} context with ${extracted.keyInsights.length} insights`,
    );

    return NextResponse.json({
      success: true,
      helperContext: result,
      extracted,
    });
  } catch (error) {
    console.error("[Helper Context Extract] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

