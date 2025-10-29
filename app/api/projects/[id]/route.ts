import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/server";

/**
 * GET /api/projects/[id]
 * Get full project details including all context fields
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const projectId = params.id;

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

    // Fetch full project with all context fields
    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("owner_id", userId)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("[Projects API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


