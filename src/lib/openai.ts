import OpenAI from "openai";
import type { Tone } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // 支持中转站/自定义API地址：填了就用，没填默认走 OpenAI 官方
  baseURL: process.env.OPENAI_BASE_URL || undefined,
});

// 模型名可配置，选项见 .env.example
// 默认使用 DeepSeek V4 Flash（当前最便宜、上下文 1M）：deepseek-v4-flash
// 如需使用 OpenAI 官方模型，请设置 OPENAI_BASE_URL=https://api.openai.com/v1 和 OPENAI_MODEL=gpt-4o-mini
const MODEL = process.env.OPENAI_MODEL || "deepseek-v4-flash";

const TONE_PROMPTS: Record<Tone, string> = {
  professional:
    "Use a professional, authoritative tone suitable for a business blog.",
  casual:
    "Use a casual, conversational tone that feels like chatting with a friend.",
  tutorial:
    "Use a tutorial/instructional tone with clear step-by-step guidance.",
};

export async function generateBlogPost(
  transcript: string,
  tone: Tone
): Promise<{ title: string; content: string; wordCount: number }> {
  const systemPrompt = `You are an expert content writer who converts YouTube video transcripts into well-structured, engaging blog posts. You write in markdown format with proper H2 subheadings, bullet points where appropriate, and SEO-friendly structure. Always include a compelling title.`;

  const userPrompt = `Convert this YouTube video transcript into a well-structured blog post.

${TONE_PROMPTS[tone]}

Requirements:
- Start with a compelling H1 title
- Use H2 subheadings to organize content
- Include bullet points where appropriate
- Add a brief introduction (2-3 sentences)
- Add a conclusion with key takeaways
- Format in markdown
- Make it SEO-friendly
- Keep the core message and key points from the video
- Do NOT include timestamps
- Do NOT mention "transcript" or "video" — write it as a standalone blog post

Transcript:
${transcript}`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 4000,
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content || "";

  // Extract title from first H1
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : "Untitled Blog Post";

  // Remove the H1 from content (it's shown separately)
  const bodyContent = content.replace(/^#\s+.+\n?/m, "").trim();

  const fullContent = bodyContent;
  const wordCount = fullContent.split(/\s+/).length;

  return { title, content: fullContent, wordCount };
}
