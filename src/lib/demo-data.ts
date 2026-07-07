/**
 * Demo Data - Sample blog posts and mock generation
 * Used when the app runs without real API keys
 */

import type { Post, ConvertResult, Tone } from "@/types";

export const DEMO_POSTS: Post[] = [
  {
    id: "demo-post-1",
    user_id: "demo-user",
    youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    video_title: "The Future of AI: Transforming Industries in 2025",
    content: `Artificial intelligence is no longer a distant dream—it's the reality shaping our world today. In this deep dive, we explore how AI is revolutionizing industries across the board.

## The AI Revolution Is Here

From healthcare to finance, from education to entertainment, AI technologies are creating unprecedented opportunities for innovation and growth. The pace of adoption has accelerated dramatically, with businesses of all sizes recognizing the competitive advantage that AI brings.

### Key Developments

**1. Healthcare Transformation**

AI-powered diagnostic tools are now matching or exceeding human experts in detecting diseases from medical imaging. Machine learning models can analyze X-rays, MRIs, and CT scans with remarkable accuracy, often catching conditions that human eyes might miss.

**2. Financial Services Innovation**

Banks and financial institutions are leveraging AI for fraud detection, risk assessment, and algorithmic trading. Real-time analysis of transaction patterns helps prevent fraud before it causes damage, while AI-driven investment platforms are democratizing access to sophisticated financial strategies.

**3. Educational Personalization**

Adaptive learning platforms use AI to tailor educational content to each student's pace and learning style. This individualized approach is proving especially valuable in subjects like mathematics and languages, where students often progress at very different rates.

## The Road Ahead

As we look to the future, several trends stand out:

- **Multimodal AI** that can process text, images, audio, and video simultaneously
- **Edge AI** bringing intelligence directly to devices without cloud dependency
- **Responsible AI** frameworks ensuring ethical deployment and bias mitigation

The organizations that embrace AI thoughtfully—balancing innovation with responsibility—will be the ones that thrive in the years ahead. The question is no longer whether AI will transform your industry, but how quickly you can adapt to stay ahead.

---

*This blog post was generated from a YouTube video using Vid2Blog's AI-powered conversion. Try it yourself to turn any video into a polished article.*`,
    tone: "professional",
    word_count: 287,
    thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "demo-post-2",
    user_id: "demo-user",
    youtube_url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    video_title: "Building a SaaS in 2025: From Idea to Launch",
    content: `So you want to build a SaaS product? Let me walk you through exactly how I went from an idea to a launched product in under a month.

## The Idea Phase

Every great product starts with a problem worth solving. I noticed that content creators were spending hours transcribing and rewriting YouTube videos into blog posts. That's a massive time sink that AI could easily handle.

The key insight? Don't build something "cool"—build something that saves people time or makes them money. Those are the two things people will happily pay for.

### Validating the Idea

Before writing a single line of code, I did three things:

1. **Posted on Reddit** in relevant subreddits to gauge interest
2. **Created a landing page** with an email signup form
3. **Reached out to 20 potential customers** directly

The response was clear: people wanted this. I had 50+ email signups before building anything.

## The Build Phase

I chose a stack that lets me move fast:

- **Next.js** for the full-stack framework
- **Supabase** for auth and database (saves weeks of backend work)
- **OpenAI GPT-4** for the AI brain
- **Tailwind CSS** for rapid UI development
- **Vercel** for instant deployment

### The MVP

The minimum viable product was simple: paste a URL, get a blog post. That's it. No fancy dashboard, no analytics, no team features. Just the core value proposition.

I launched with that MVP and started getting feedback immediately. Users told me what they actually needed, which was very different from what I assumed they'd need.

## The Launch

Here's what worked for the launch:

- **Product Hunt**: Got 200+ upvotes and our first 100 users
- **Twitter/X**: Thread about the build process went semi-viral
- **Reddit**: Posted in r/Entrepreneur and r/SaaS

The first paying customer came within 48 hours of launch. That's the power of solving a real problem.

## Lessons Learned

If I had to distill everything into one piece of advice: **ship fast, listen harder**. Your first version will be wrong. Your users will tell you how. The faster you get feedback, the faster you find product-market fit.

Now go build something people want! 🚀`,
    tone: "casual",
    word_count: 324,
    thumbnail_url: "https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "demo-post-3",
    user_id: "demo-user",
    youtube_url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    video_title: "Mastering React Server Components: A Complete Guide",
    content: `React Server Components (RSC) represent the biggest shift in React's architecture since Hooks. In this tutorial, we'll cover everything you need to know to start using them effectively.

## What Are React Server Components?

Server Components are React components that render exclusively on the server. They can't use state, effects, or browser APIs, but they can directly access databases, file systems, and other server-side resources.

### Server vs Client Components

| Feature | Server Component | Client Component |
|---------|-----------------|-----------------|
| State (useState) | ❌ | ✅ |
| Effects (useEffect) | ❌ | ✅ |
| Database Access | ✅ | ❌ |
| Browser APIs | ❌ | ✅ |
| Bundle Size Impact | None | Added to bundle |

## Getting Started

### 1. Create a Server Component

\`\`\`tsx
// app/posts/page.tsx (Server Component by default)
import { db } from "@/lib/db";

export default async function PostsPage() {
  const posts = await db.query("SELECT * FROM posts");
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

Notice: no \`use client\` directive. No \`useEffect\`. No \`useState\`. Just async data fetching and rendering.

### 2. Add a Client Component

\`\`\`tsx
"use client";
import { useState } from "react";

export function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <button onClick={() => setLikes(l => l + 1)}>
      {likes} Likes
    </button>
  );
}
\`\`\`

### 3. Compose Them Together

\`\`\`tsx
// Server Component
import { LikeButton } from "./LikeButton";

export default async function Post({ id }) {
  const post = await getPost(id);
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <LikeButton />
    </article>
  );
}
\`\`\`

## Best Practices

1. **Default to Server Components** — Only add "use client" when you need interactivity
2. **Push client components to the leaves** — Keep them small and specific
3. **Pass serializable props** — You can't pass functions from server to client
4. **Use Suspense for streaming** — Wrap slow server components in Suspense boundaries

## Common Pitfalls

- Don't try to use hooks in Server Components
- Don't pass non-serializable props (functions, class instances) to Client Components
- Remember that Server Components re-render on every request

Master RSC and you'll write faster, more scalable React apps. The learning curve is worth it!`,
    tone: "tutorial",
    word_count: 312,
    thumbnail_url: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
];

/**
 * Generate a mock blog post for demo mode
 */
export function generateDemoBlogPost(
  youtubeUrl: string,
  tone: Tone
): ConvertResult {
  // Extract video ID from URL
  const match = youtubeUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  );
  const videoId = match?.[1] || "dQw4w9WgXcQ";
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const toneConfig: Record<Tone, { title: string; content: string }> = {
    professional: {
      title: "Understanding the Key Insights from This Video",
      content: `This video presents a comprehensive analysis of contemporary developments in technology and their broader implications for businesses and consumers alike.

## Executive Summary

The discussion covers several critical areas that warrant attention from decision-makers and industry professionals. The speaker provides a structured overview of current trends, supported by data-driven insights and real-world examples.

### Key Findings

**Strategic Implications**

The video highlights how organizations must adapt to rapidly changing technological landscapes. Companies that fail to embrace these changes risk losing competitive advantage in increasingly crowded markets.

**Implementation Considerations**

Practical guidance is offered for organizations looking to implement these strategies. The emphasis is on phased adoption, starting with pilot programs before scaling to full deployment.

**Risk Assessment**

A thorough analysis of potential risks and mitigation strategies is provided, covering both technical and business-side concerns.

## Conclusion

The insights presented in this video offer valuable guidance for professionals navigating today's complex business environment. The recommended approaches align with industry best practices and provide a clear roadmap for implementation.

---

*This is a demo blog post generated by Vid2Blog. Connect your OpenAI API key to get AI-powered, video-specific content.*`,
    },
    casual: {
      title: "What This Video Taught Me (And Why You Should Watch It)",
      content: `Okay, so I just watched this video and honestly? It's packed with insights that I had to share. Let me break down the best parts for you.

## The Big Takeaways

First off, the video does a fantastic job explaining some pretty complex stuff in a way that actually makes sense. No jargon overload, no boring lectures—just straight-up useful information.

### Here's What Stood Out

**The Real-World Examples**

You know how some videos are all theory and no practice? This one's different. Every concept comes with a concrete example that makes you go "oh, THAT'S how it works."

**The Actionable Advice**

I love that the speaker doesn't just tell you what to think—they tell you what to DO. There are specific, actionable steps you can take right after watching.

**The Energy**

Let's be real, a lot of educational content is dry AF. This one keeps you engaged the whole way through. The pacing is perfect.

## My Favorite Part

The section where they break down the case study? *Chef's kiss.* It's the kind of content that makes you reconsider how you've been doing things.

## Should You Watch It?

Short answer: yes. Long answer: absolutely yes, especially if you're looking to level up your understanding without falling asleep in the process.

Go watch it, then come back and tell me what you think! 👇

---

*This is a demo blog post generated by Vid2Blog. Connect your OpenAI API key to get AI-powered, video-specific content.*`,
    },
    tutorial: {
      title: "Step-by-Step Guide: Everything Covered in This Video",
      content: `In this tutorial, we'll walk through each concept demonstrated in the video, with code examples and implementation details you can follow along with.

## Prerequisites

Before we begin, make sure you have the following:

- Basic understanding of the concepts discussed
- A development environment set up
- Willingness to experiment and learn

## Step 1: Understanding the Fundamentals

The video begins by establishing the core concepts. Let's break these down:

### The Core Architecture

\`\`\`javascript
// Basic setup
const config = {
  option1: true,
  option2: "default",
  timeout: 5000
};

// Initialize
const instance = createInstance(config);
\`\`\`

### Key Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option1 | boolean | true | Enable feature X |
| option2 | string | "default" | Set mode |
| timeout | number | 5000 | Request timeout (ms) |

## Step 2: Implementation

Now let's implement the solution step by step:

\`\`\`javascript
// Step 1: Create the handler
async function handleRequest(req, res) {
  // Validate input
  if (!req.body.data) {
    return res.status(400).json({ error: "Missing data" });
  }
  
  // Process
  const result = await process(req.body.data);
  
  // Return
  return res.json({ success: true, result });
}
\`\`\`

## Step 3: Testing

Always test your implementation:

\`\`\`bash
# Run tests
npm test

# Check coverage
npm run test:coverage
\`\`\`

## Step 4: Deployment

Deploy using your preferred method:

1. Build the project
2. Set environment variables
3. Deploy to your hosting platform

## Common Issues & Solutions

**Issue**: "Module not found" error
**Solution**: Run \`npm install\` to install dependencies

**Issue**: Port already in use
**Solution**: Change the PORT environment variable

## Summary

We covered the complete implementation from setup to deployment. The key steps are:

1. Configure the fundamentals
2. Implement the core logic
3. Test thoroughly
4. Deploy with proper environment variables

---

*This is a demo blog post generated by Vid2Blog. Connect your OpenAI API key to get AI-powered, video-specific content.*`,
    },
  };

  const config = toneConfig[tone];
  const wordCount = config.content.split(/\s+/).length;

  return {
    title: config.title,
    content: config.content,
    wordCount,
    thumbnailUrl,
    postId: `demo-post-${Date.now()}`,
  };
}
