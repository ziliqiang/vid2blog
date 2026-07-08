/**
 * 客户端 YouTube 字幕获取工具
 * 通过自有 API 代理获取字幕，彻底解决 CORS 问题
 */

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

/**
 * 通过自有 API 获取字幕（无 CORS 问题）
 * 浏览器 → /api/transcript（我们自己的服务器）→ youtubetranscript.com / YouTube
 */
async function fetchTranscriptViaProxy(videoId: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/transcript?v=${videoId}`);
    if (!res.ok) {
      console.warn(`[ClientYouTube] API returned ${res.status}`);
      return null;
    }
    const data = await res.json();
    if (data.transcript && data.transcript.length > 10) {
      return data.transcript;
    }
    return null;
  } catch (e) {
    console.warn("[ClientYouTube] Proxy fetch failed:", e);
    return null;
  }
}

/**
 * 通过 oembed 获取视频标题
 */
async function fetchVideoTitle(videoId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${videoId}`
      )}&format=json`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.title || null;
  } catch {
    return null;
  }
}

/**
 * 主入口：获取 YouTube 字幕
 * 调用自有 API 代理，服务器端处理所有字幕获取逻辑
 */
export async function fetchYouTubeTranscript(
  url: string
): Promise<{
  transcript: string;
  videoId: string;
  title: string;
  thumbnailUrl: string;
}> {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error("Invalid YouTube URL. Please provide a valid video link.");
  }

  // 获取标题
  const title = (await fetchVideoTitle(videoId)) || `YouTube Video ${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  // 通过自有 API 代理获取字幕
  console.log("[ClientYouTube] Fetching transcript via proxy API...");
  const transcript = await fetchTranscriptViaProxy(videoId);

  if (!transcript) {
    throw new Error(
      "This video doesn't have captions enabled. Try a different video."
    );
  }

  // 截断超长字幕
  const maxChars = 50000;
  const finalTranscript =
    transcript.length > maxChars
      ? transcript.substring(0, maxChars) + "..."
      : transcript;

  return { transcript: finalTranscript, videoId, title, thumbnailUrl };
}

/**
 * 校验 YouTube URL 是否有效
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}
