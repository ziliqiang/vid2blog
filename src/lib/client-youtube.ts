/**
 * 客户端 YouTube 字幕获取工具
 * 在浏览器中直接获取字幕，绕过服务器 IP 限制
 */

// 从 YouTube URL 提取视频 ID
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
 * 方案 A: 从 youtubetranscript.com 获取字幕（推荐）
 * 这是一个专门为获取 YouTube 字幕的服务，支持 CORS
 */
async function fetchFromYoutubeTranscript(videoId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://youtubetranscript.com/?v=${videoId}&format=json`
    );
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const text = data
      .map((s: { text: string }) => s.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    return text.length > 10 ? text : null;
  } catch (e) {
    console.warn("[ClientYouTube] youtubetranscript.com failed:", e);
    return null;
  }
}

/**
 * 方案 B: 从 YouTube 页面直接提取字幕
 * 需要获取 watch 页面 HTML 并解析 captionTracks
 * 注意：由于 CORS 限制，YouTube 可能不允许跨域请求
 */
async function fetchFromYouTubeDirect(videoId: string): Promise<string | null> {
  try {
    // 通过 corsproxy 获取页面
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      `https://www.youtube.com/watch?v=${videoId}`
    )}`;

    const res = await fetch(proxyUrl);
    if (!res.ok) return null;

    const html = await res.text();

    // 提取 captionTracks
    const match = html.match(/"captionTracks":\s*(\[.*?\])/);
    if (!match) return null;

    const tracks = JSON.parse(match[1]);
    if (!tracks || tracks.length === 0) return null;

    // 优先英文
    const track =
      tracks.find((t: { languageCode: string }) =>
        t.languageCode.startsWith("en")
      ) || tracks[0];

    const baseUrl = track.baseUrl;
    if (!baseUrl) return null;

    const captionRes = await fetch(baseUrl);
    if (!captionRes.ok) return null;

    const xml = await captionRes.text();
    const texts: string[] = [];
    const regex = /<text[^>]*>(.*?)<\/text>/g;
    let m;
    while ((m = regex.exec(xml)) !== null) {
      let t = m[1]
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ");
      texts.push(t);
    }

    return texts.length > 0
      ? texts.join(" ").replace(/\s+/g, " ").trim()
      : null;
  } catch (e) {
    console.warn("[ClientYouTube] Direct fetch failed:", e);
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
 * 优先尝试方案 A（youtubetranscript.com），失败则尝试方案 B（直接解析）
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

  // 获取字幕 - 方案 A
  let transcript = await fetchFromYoutubeTranscript(videoId);

  // 方案 A 失败，尝试方案 B
  if (!transcript) {
    console.log("[ClientYouTube] Fallback A failed, trying direct fetch...");
    transcript = await fetchFromYouTubeDirect(videoId);
  }

  if (!transcript) {
    throw new Error(
      "This video doesn't have captions enabled. Try a different video."
    );
  }

  // 截断超长字幕
  const maxChars = 50000;
  if (transcript.length > maxChars) {
    transcript = transcript.substring(0, maxChars) + "...";
  }

  return { transcript, videoId, title, thumbnailUrl };
}

/**
 * 校验 YouTube URL 是否有效
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}
