/**
 * Demo Mode Detection
 * When env vars are placeholders, the app runs in demo mode
 * with mock data instead of real API calls.
 */

export function isDemoMode(): boolean {
  if (typeof window === "undefined") {
    // Server-side check
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    return url.includes("placeholder") || !url;
  }
  // Client-side: check if the public env var is a placeholder
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") || false
  );
}

export const DEMO_USER = {
  id: "demo-user-00000000",
  email: "demo@vid2blog.app",
  tier: "pro" as const,
};

export const DEMO_TOKEN = "demo-access-token";
