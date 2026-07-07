import type { SubscriptionTier } from "@/types";

const CREEM_BASE_URL = "https://api.creem.io/v1";

export function getCheckoutUrl(
  productId: string,
  userEmail: string,
  successUrl: string
): string {
  const params = new URLSearchParams({
    email: userEmail,
    success_url: successUrl,
  });
  return `https://www.creem.io/payment/${productId}?${params.toString()}`;
}

export function getProCheckoutUrl(userEmail: string): string {
  const productId = process.env.CREEM_PRO_PRODUCT_ID!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vid2blog-two.vercel.app";
  return getCheckoutUrl(productId, userEmail, `${appUrl}/dashboard?checkout=success`);
}

export function getBusinessCheckoutUrl(userEmail: string): string {
  const productId = process.env.CREEM_BUSINESS_PRODUCT_ID!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vid2blog-two.vercel.app";
  return getCheckoutUrl(productId, userEmail, `${appUrl}/dashboard?checkout=success`);
}

export async function verifyWebhookSignature(
  payload: string,
  signature: string
): Promise<boolean> {
  const secret = process.env.CREEM_SECRET_KEY!;
  // Creem uses HMAC-SHA256 for webhook verification
  // In production, implement proper signature verification
  // For now, we check if signature matches the secret
  return signature === secret;
}

export async function handleSubscriptionUpdate(
  customerId: string,
  tier: SubscriptionTier
): Promise<void> {
  // Update user's subscription tier in database
  const { supabaseAdmin } = await import("@/lib/supabase-server");

  const { error } = await supabaseAdmin
    .from("users")
    .update({ subscription_tier: tier })
    .eq("creem_customer_id", customerId);

  if (error) {
    console.error("Failed to update subscription:", error);
    throw error;
  }
}
