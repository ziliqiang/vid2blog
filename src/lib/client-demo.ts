/**
 * Client-side Demo Data Manager
 * Handles all demo operations in the browser using localStorage
 * This allows the app to work as a static site without API routes
 */

import { generateDemoBlogPost, DEMO_POSTS } from "./demo-data";
import type { Post, ConvertResult, Tone } from "@/types";

const STORAGE_KEY = "vid2blog_demo_posts";
const USAGE_KEY = "vid2blog_demo_usage";

/**
 * Get all demo posts (from localStorage + seed data)
 */
export function getDemoPosts(): Post[] {
  if (typeof window === "undefined") return DEMO_POSTS;

  const stored = localStorage.getItem(STORAGE_KEY);
  let userPosts: Post[] = [];
  if (stored) {
    try {
      userPosts = JSON.parse(stored);
    } catch {
      userPosts = [];
    }
  }

  // Combine user-created posts with seed demo posts
  return [...userPosts, ...DEMO_POSTS].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Get a single demo post by ID
 */
export function getDemoPostById(id: string): Post | null {
  const posts = getDemoPosts();
  return posts.find((p) => p.id === id) || null;
}

/**
 * Convert a YouTube URL to a blog post (demo mode - client-side)
 */
export function convertDemoVideo(youtubeUrl: string, tone: Tone): ConvertResult {
  const result = generateDemoBlogPost(youtubeUrl, tone);
  result.demoMode = true;

  // Save to localStorage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    let userPosts: Post[] = [];
    if (stored) {
      try {
        userPosts = JSON.parse(stored);
      } catch {
        userPosts = [];
      }
    }

    const newPost: Post = {
      id: result.postId || `demo-post-${Date.now()}`,
      user_id: "demo-user",
      youtube_url: youtubeUrl,
      video_title: result.title,
      content: result.content,
      tone,
      word_count: result.wordCount,
      thumbnail_url: result.thumbnailUrl,
      created_at: new Date().toISOString(),
    };

    userPosts.unshift(newPost);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userPosts));

    // Increment usage
    incrementDemoUsage();
  }

  return result;
}

/**
 * Get demo usage stats
 */
export function getDemoUsage(): { postsUsed: number; postsLimit: number } {
  if (typeof window === "undefined") {
    return { postsUsed: 3, postsLimit: 30 };
  }

  const stored = localStorage.getItem(USAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fall through
    }
  }

  // Default: 3 posts used (from seed data), Pro tier limit
  return { postsUsed: 3, postsLimit: 30 };
}

/**
 * Increment demo usage counter
 */
function incrementDemoUsage(): void {
  if (typeof window === "undefined") return;

  const current = getDemoUsage();
  localStorage.setItem(
    USAGE_KEY,
    JSON.stringify({
      postsUsed: current.postsUsed + 1,
      postsLimit: current.postsLimit,
    })
  );
}

/**
 * Delete a demo post
 */
export function deleteDemoPost(id: string): void {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  try {
    const posts: Post[] = JSON.parse(stored);
    const filtered = posts.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
}

/**
 * Clear all user-created demo posts (reset to seed data)
 */
export function resetDemoData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(USAGE_KEY);
}
