export type SubscriptionTier = "free" | "pro" | "business";

export type Tone = "professional" | "casual" | "tutorial";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  subscription_tier: SubscriptionTier;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  youtube_url: string;
  video_title: string;
  content: string;
  tone: Tone;
  word_count: number;
  thumbnail_url: string | null;
  created_at: string;
}

export interface UsageInfo {
  postsUsed: number;
  postsLimit: number;
}

export interface ConvertResult {
  title: string;
  content: string;
  wordCount: number;
  thumbnailUrl: string | null;
  postId?: string;
  demoMode?: boolean;
}

export const TIER_LIMITS: Record<SubscriptionTier, number> = {
  free: 3,
  pro: 30,
  business: -1, // unlimited
};

export const TIER_PRICES: Record<SubscriptionTier, string> = {
  free: "$0",
  pro: "$19",
  business: "$49",
};
