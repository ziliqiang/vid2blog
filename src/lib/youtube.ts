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
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Transcript fetch error:", errorMsg);

    // 尝试备用方案：直接调用 youtubetranscript.com API
    console.log("Trying fallback: youtubetranscript.com API");
    try {
      transcriptText = await fetchTranscriptFallback(videoId);
    } catch (fallbackError) {
      const fallbackMsg = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
      console.error("Fallback also failed:", fallbackMsg);
      throw new Error(
        `Could not fetch captions: ${errorMsg} | Fallback: ${fallbackMsg}`
      );
    }
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
  // 使用 youtube-transcript 包
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

/**
 * 备用方案：直接调用 youtubetranscript.com 的免费 API
 * 这个服务专门用于获取 YouTube 字幕，稳定可靠
 */
async function fetchTranscriptFallback(videoId: string): Promise<string> {
  const res = await fetch(
    `https://youtubetranscript.com/?v=${videoId}&t=text`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`youtubetranscript.com returned ${res.status}`);
  }

  const text = await res.text();
  if (!text || text.trim().length < 10) {
    throw new Error("Empty transcript from fallback");
  }

  return text.trim();
}

export function validateYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}
