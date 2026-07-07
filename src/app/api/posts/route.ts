import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demo-mode";
import { DEMO_POSTS } from "@/lib/demo-data";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Demo mode: return demo posts
    if (isDemoMode()) {
      return NextResponse.json(DEMO_POSTS);
    }

    const { supabaseAdmin } = await import("@/lib/supabase-server");

    const { data: posts, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
