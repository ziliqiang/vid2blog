import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demo-mode";
import { TIER_LIMITS, type SubscriptionTier } from "@/types";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Demo mode: return demo usage
    if (isDemoMode()) {
      return NextResponse.json({
        postsUsed: 3,
        postsLimit: 30,
        tier: "pro" as SubscriptionTier,
      });
    }

    const { supabaseAdmin } = await import("@/lib/supabase-server");

    // Get user's tier
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    const tier = (userData?.subscription_tier as SubscriptionTier) || "free";
    const limit = TIER_LIMITS[tier];

    // Count posts this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabaseAdmin
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString());

    return NextResponse.json({
      postsUsed: count || 0,
      postsLimit: limit,
      tier,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 }
    );
  }
}
