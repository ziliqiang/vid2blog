import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demo-mode";
import { getCheckoutUrl } from "@/lib/creem";

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await request.json();

    if (!["pro", "business"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Demo mode: return message
    if (isDemoMode()) {
      return NextResponse.json({
        error: "Payment integration is not available in demo mode. Configure Creem API keys to enable checkout.",
        demoMode: true,
      }, { status: 501 });
    }

    const productId =
      plan === "pro"
        ? process.env.CREEM_PRO_PRODUCT_ID
        : process.env.CREEM_BUSINESS_PRODUCT_ID;

    if (!productId) {
      return NextResponse.json(
        { error: "Payment not configured" },
        { status: 500 }
      );
    }

    const { supabaseAdmin } = await import("@/lib/supabase-server");

    // Get user email
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("email")
      .eq("id", user.id)
      .single();

    const email = userData?.email || user.email;

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`;
    const checkoutUrl = getCheckoutUrl(productId, email, successUrl);

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
