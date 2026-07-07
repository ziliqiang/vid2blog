import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import type { SubscriptionTier } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("creem-signature") || "";

    // Verify webhook (implement proper signature verification in production)
    // const isValid = await verifyWebhookSignature(body, signature);
    // if (!isValid) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    const event = JSON.parse(body);

    switch (event.type) {
      case "checkout.completed": {
        const customerId = event.data.customer_id;
        const email = event.data.customer_email;
        const productId = event.data.product_id;

        // Determine tier from product ID
        let tier: SubscriptionTier = "free";
        if (productId === process.env.CREEM_PRO_PRODUCT_ID) {
          tier = "pro";
        } else if (productId === process.env.CREEM_BUSINESS_PRODUCT_ID) {
          tier = "business";
        }

        // Update or create user record
        const { error } = await supabaseAdmin
          .from("users")
          .update({
            subscription_tier: tier,
            creem_customer_id: customerId,
          })
          .eq("email", email);

        if (error) {
          console.error("Failed to update user subscription:", error);
        }

        break;
      }

      case "subscription.cancelled": {
        const customerId = event.data.customer_id;

        const { error } = await supabaseAdmin
          .from("users")
          .update({ subscription_tier: "free" })
          .eq("creem_customer_id", customerId);

        if (error) {
          console.error("Failed to cancel subscription:", error);
        }

        break;
      }

      default:
        // Unhandled event type
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
