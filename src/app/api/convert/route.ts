import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/supabase-server";
import { fetchYouTubeData } from "@/lib/youtube";
import { generateBlogPost } from "@/lib/openai";
import { isDemoMode, DEMO_USER } from "@/lib/demo-mode";
import { generateDemoBlogPost } from "@/lib/demo-data";
import { TIER_LIMITS, type Tone, type SubscriptionTier } from "@/types";

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { youtubeUrl, tone } = await request.json();

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: "YouTube URL is required" },
        { status: 400 }
      );
    }

    const validTones: Tone[] = ["professional", "casual", "tutorial"];
    if (!validTones.includes(tone)) {
      return NextResponse.json(
        { error: "Invalid tone selection" },
        { status: 400 }
      );
    }

    // Demo mode: return mock data
    if (isDemoMode()) {
      // Simulate processing delay
      await new Promise((r) => setTimeout(r, 2000));

      const result = generateDemoBlogPost(youtubeUrl, tone);

      return NextResponse.json({
        ...result,
        postId: result.postId,
        demoMode: true,
      });
    }

    // Check usage limit
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { supabaseAdmin } = await import("@/lib/supabase-server");

    // Get user's tier
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    const tier = (userData?.subscription_tier as SubscriptionTier) || "free";
    const limit = TIER_LIMITS[tier];

    if (limit !== -1) {
      const { count } = await supabaseAdmin
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", startOfMonth.toISOString());

      if ((count || 0) >= limit) {
        return NextResponse.json(
          {
            error: `You've reached your monthly limit of ${limit} posts. Please upgrade your plan.`,
            limitReached: true,
          },
          { status: 403 }
        );
      }
    }

    // Fetch YouTube transcript
    const youtubeData = await fetchYouTubeData(youtubeUrl);

    // Generate blog post
    const blogPost = await generateBlogPost(youtubeData.text, tone);

    // Save to database
    const { data: post, error } = await supabaseAdmin
      .from("posts")
      .insert({
        user_id: user.id,
        youtube_url: youtubeUrl,
        video_title: blogPost.title,
        content: blogPost.content,
        tone,
        word_count: blogPost.wordCount,
        thumbnail_url: youtubeData.thumbnailUrl,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
    }

    return NextResponse.json({
      title: blogPost.title,
      content: blogPost.content,
      wordCount: blogPost.wordCount,
      thumbnailUrl: youtubeData.thumbnailUrl,
      postId: post?.id,
    });
  } catch (error) {
    console.error("Convert error:", error);
    const message =
      error instanceof Error ? error.message : "Conversion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
