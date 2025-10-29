import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";

/**
 * GET /api/user/state?projectId=xxx
 * Get user's application state for a project
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId parameter" },
        { status: 400 }
      );
    }

    // Get user state from database
    const { data: userState, error } = await supabase
      .from("user_app_state")
      .select("*")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error("[User State] Error fetching state:", error);
      return NextResponse.json(
        { error: "Failed to fetch user state" },
        { status: 500 }
      );
    }

    // Return state or null if not found
    return NextResponse.json({
      state: userState ? {
        selectedHelper: userState.selected_helper,
        activeOrbId: userState.active_orb_id,
        stepContext: userState.step_context,
        viewMode: userState.view_mode,
        lastUpdated: userState.updated_at,
      } : null,
    });
  } catch (error) {
    console.error("[User State] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/state
 * Save user's application state
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    const userId = user?.id || (isDev ? "00000000-0000-0000-0000-000000000001" : null);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, selectedHelper, activeOrbId, stepContext, viewMode } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId" },
        { status: 400 }
      );
    }

    // Upsert user state
    const { data: savedState, error } = await supabase
      .from("user_app_state")
      .upsert({
        user_id: userId,
        project_id: projectId,
        selected_helper: selectedHelper,
        active_orb_id: activeOrbId,
        step_context: stepContext,
        view_mode: viewMode,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,project_id'
      })
      .select()
      .single();

    if (error) {
      console.error("[User State] Error saving state:", error);
      return NextResponse.json(
        { error: "Failed to save user state" },
        { status: 500 }
      );
    }

    // CRITICAL: Sync with journey_progress table if we have an active orb
    // This ensures database consistency between UI state and journey data
    if (activeOrbId && selectedHelper) {
      console.log("[User State] 🔄 Syncing journey_progress with active orb:", activeOrbId);
      
      const { error: syncError } = await supabase
        .from("journey_progress")
        .upsert({
          user_id: userId,
          project_id: projectId,
          current_level_id: activeOrbId,
          helper: selectedHelper,
          is_active: true,
          started_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,project_id,current_level_id,helper'
        });
      
      if (syncError) {
        console.warn("[User State] ⚠️ Failed to sync journey_progress:", syncError);
        // Don't fail the request, just log the warning
      } else {
        console.log("[User State] ✅ Journey progress synced with active orb");
      }
    }

    console.log("[User State] ✅ Saved state for user:", userId, "project:", projectId);

    return NextResponse.json({
      success: true,
      state: savedState,
    });
  } catch (error) {
    console.error("[User State] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

