/**
 * 客户端 YouTube 字幕获取工具
 *
 * 核心策略：从浏览器直接调用 YouTube 的 Innertube API
 * ✅ 浏览器有真实用户 IP（不会被封）
 * ✅ YouTube 官方 API 支持 CORS（YouTube 本身就是 SPA 应用）
 * ✅ 不需要任何第三方服务
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
 * YouTube Innertube API 的公共 Key（YouTube 网页版使用的）
 * 这个 key 是公开的，用于浏览器端 API 调用
 */
const INNERTUBE_API_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
const INNERTUBE_URL = `https://www.youtube.com/youtubei/v1/player?key=${INNERTUBE_API_KEY}`;

/**
 * 通过 YouTube Innertube API 获取字幕信息
 * 这是 YouTube 网页版自己使用的内部 API，完全支持 CORS
 */
async function getCaptionTrackUrl(videoId: string): Promise<string | null> {
  try {
    const payload = {
      videoId,
      context: {
        client: {
          clientName: "WEB",
          clientVersion: "2.20240304.00.00",
          hl: "en",
        },
      },
    };

    const res = await fetch(INNERTUBE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn(`[YT Innertube] HTTP ${res.status}`);
      return null;
    }

    const data = await res.json();
    const captions =
      data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!captions || captions.length === 0) {
      console.warn("[YT Innertube] No caption tracks found in response");
      return null;
    }

    // 优先英文，否则用第一个可用的
    const track =
      captions.find(
        (t: { languageCode: string }) =>
          t.languageCode && t.languageCode.startsWith("en")
      ) || captions[0];

    const baseUrl = track?.baseUrl;
    if (!baseUrl) {
      console.warn("[YT Innertube] No baseUrl in caption track");
      return null;
    }

    console.log(
      `[YT Innertube] Found caption track: ${track.languageCode} - ${track.name?.simpleText || ""}`
    );
    return baseUrl;
  } catch (e) {
    console.warn("[YT Innertube] API call failed:", e);
    return null;
  }
}

/**
 * 从 timedtext URL 获取字幕文本
 * 这个 URL 从 YouTube Innertube API 获取，支持 CORS
 */
async function fetchTranscriptFromUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!res.ok) {
      console.warn(`[YT Timedtext] HTTP ${res.status}`);
      return null;
    }

    const xml = await res.text();
    if (!xml || xml.trim().length < 20) {
      console.warn("[YT Timedtext] Empty response");
      return null;
    }

    // 解析字幕 XML
    const texts: string[] = [];
    const regex = /<text[^>]*>(.*?)<\/text>/g;
    let match;
    while ((match = regex.exec(xml)) !== null) {
      let text = match[1]
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ");
      texts.push(text);
    }

    if (texts.length === 0) {
      console.warn("[YT Timedtext] No text extracted from XML");
      return null;
    }

    return texts.join(" ").replace(/\s+/g, " ").trim();
  } catch (e) {
    console.warn("[YT Timedtext] Fetch failed:", e);
    return null;
  }
}

/**
 * 通过 oembed 获取视频标题（也支持 CORS）
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
 * 直接从浏览器调用 YouTube 官方 API（无 CORS 问题，IP 不被封）
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

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  // 并发获取标题和字幕信息
  const [titleResult, captionUrl] = await Promise.all([
    fetchVideoTitle(videoId),
    getCaptionTrackUrl(videoId),
  ]);

  const title = titleResult || `YouTube Video ${videoId}`;

  if (!captionUrl) {
    throw new Error(
      "This video doesn't have captions enabled. Try a different video."
    );
  }

  // 获取字幕文本
  const transcript = await fetchTranscriptFromUrl(captionUrl);

  if (!transcript || transcript.length < 10) {
    throw new Error(
      "Failed to fetch caption text. Try a different video."
    );
  }

  // 截断超长字幕（>3小时视频）
  const maxChars = 50000;
  const finalTranscript =
    transcript.length > maxChars
      ? transcript.substring(0, maxChars) + "..."
      : transcript;

  console.log(
    `[ClientYouTube] Success: "${title}" - ${finalTranscript.length} chars`
  );

  return {
    transcript: finalTranscript,
    videoId,
    title,
    thumbnailUrl,
  };
}

/**
 * 校验 YouTube URL 是否有效
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}
