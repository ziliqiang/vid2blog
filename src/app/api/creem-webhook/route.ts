import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import type { SubscriptionTier } from "@/types";
import crypto from "crypto";

function verifyCreemSignature(body: string, signature: string): boolean {
  const secret = process.env.CREEM_SECRET_KEY || "";
  if (!secret || !signature) {
    console.error("Missing CREEM_SECRET_KEY or signature");
    return false;
  }

  // Creem 使用 HMAC-SHA256 签名，格式: sha256=<hash>
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(body);
  const expectedSignature = `sha256=${hmac.digest("hex")}`;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("creem-signature") || "";

    // ✅ 验证 Webhook 签名（防止伪造请求）
    if (!verifyCreemSignature(body, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

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
