export interface YouTubeTranscript {
  text: string;
  videoId: string;
  title: string;
  thumbnailUrl: string;
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function fetchYouTubeData(url: string): Promise<YouTubeTranscript> {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error("Invalid YouTube URL. Please provide a valid video link.");
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  // Fetch video title via oEmbed
  let title = `YouTube Video ${videoId}`;
  try {
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`
    );
    if (oembedRes.ok) {
      const oembed = await oembedRes.json();
      title = oembed.title;
    }
  } catch {
    // keep default title
  }

  // Fetch transcript using youtube-transcript package
  let transcriptText = "";
  try {
    transcriptText = await fetchTranscript(videoId);
  } catch (error) {
    console.error("Transcript fetch error:", error);
    throw new Error(
      "This video doesn't have captions enabled. Try a different video."
    );
  }

  if (!transcriptText || transcriptText.trim().length < 10) {
    throw new Error(
      "This video doesn't have captions enabled. Try a different video."
    );
  }

  // Truncate if too long (3 hours roughly = ~27,000 words)
  const maxChars = 50000;
  if (transcriptText.length > maxChars) {
    transcriptText = transcriptText.substring(0, maxChars) + "...";
  }

  return {
    text: transcriptText,
    videoId,
    title,
    thumbnailUrl,
  };
}

async function fetchTranscript(videoId: string): Promise<string> {
  // 使用 youtube-transcript 包（专业、稳定、已处理所有 edge case）
  // 相比于手写正则解析 HTML，这个包直接调用 YouTube 内部 API
  const { YoutubeTranscript } = await import("youtube-transcript");

  const snippets = await YoutubeTranscript.fetchTranscript(videoId);
  if (!snippets || snippets.length === 0) {
    throw new Error("No transcript available");
  }

  const text = snippets
    .map((s: { text: string }) => s.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

export function validateYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}
