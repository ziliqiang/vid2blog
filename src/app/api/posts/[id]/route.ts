import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demo-mode";
import { DEMO_POSTS } from "@/lib/demo-data";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Demo mode: find in demo posts
    if (isDemoMode()) {
      const post = DEMO_POSTS.find((p) => p.id === params.id);
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      return NextResponse.json(post);
    }

    const { supabaseAdmin } = await import("@/lib/supabase-server");

    const { data: post, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Demo mode: pretend success
    if (isDemoMode()) {
      return NextResponse.json({ success: true });
    }

    const { supabaseAdmin } = await import("@/lib/supabase-server");

    const { error } = await supabaseAdmin
      .from("posts")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
