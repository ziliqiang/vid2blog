import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/supabase-server";
import { generateBlogPost } from "@/lib/openai";
import { isDemoMode } from "@/lib/demo-mode";
import { generateDemoBlogPost } from "@/lib/demo-data";
import { TIER_LIMITS, type Tone, type SubscriptionTier } from "@/types";

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { youtubeUrl, tone, transcript, videoTitle, thumbnailUrl } =
      await request.json();

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

    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("subscription_tier, is_admin")
      .eq("id", user.id)
      .single();

    const isAdmin = userData?.is_admin === true;
    const tier = (userData?.subscription_tier as SubscriptionTier) || "free";
    const limit = isAdmin ? -1 : TIER_LIMITS[tier];

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

    // 如果没有客户端发来的 transcript，尝试在服务端获取
    let finalTranscript = transcript;
    let finalThumbnail = thumbnailUrl;
    let finalTitle = videoTitle;

    if (!finalTranscript) {
      console.log(
        "[Convert] No client transcript, trying server-side fetch..."
      );
      try {
        const { fetchYouTubeData } = await import("@/lib/youtube");
        const youtubeData = await fetchYouTubeData(youtubeUrl);
        finalTranscript = youtubeData.text;
        finalThumbnail = finalThumbnail || youtubeData.thumbnailUrl;
        finalTitle = finalTitle || youtubeData.title;
      } catch (serverError) {
        console.error("[Convert] Server-side fetch also failed");
        return NextResponse.json(
          {
            error:
              "Could not fetch captions. The video may not have captions enabled, or our server is unable to reach YouTube. Please try again or use a different video.",
          },
          { status: 400 }
        );
      }
    }

    if (!finalTranscript || finalTranscript.trim().length < 10) {
      return NextResponse.json(
        { error: "No transcript content available for this video." },
        { status: 400 }
      );
    }

    // Generate blog post using AI
    const blogPost = await generateBlogPost(finalTranscript, tone);

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
        thumbnail_url: finalThumbnail,
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
      thumbnailUrl: finalThumbnail,
      postId: post?.id,
    });
  } catch (error) {
    console.error("Convert error:", error);
    const message =
      error instanceof Error ? error.message : "Conversion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
