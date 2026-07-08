import { NextResponse } from "next/server";

/**
 * 获取 YouTube 字幕的代理 API
 * 客户端通过此接口获取字幕，避免 CORS 问题
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("v");

  if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
    return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
  }

  try {
    // 方案 1: youtubetranscript.com API（服务端请求，无 CORS 限制）
    console.log("[Transcript API] Fetching from youtubetranscript.com...");
    const res = await fetch(
      `https://youtubetranscript.com/?v=${videoId}&format=json`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
        },
        // 设置 10 秒超时
        signal: AbortSignal.timeout(10000),
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const transcript = data
          .map((s: { text: string }) => s.text)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        console.log(
          `[Transcript API] Success: ${transcript.length} chars`
        );
        return NextResponse.json({ transcript, source: "youtubetranscript.com" });
      }
    }

    // 方案 2: 尝试从 YouTube timedtext API 直接获取
    console.log("[Transcript API] Fallback to YouTube timedtext API...");
    const htmlRes = await fetch(
      `https://www.youtube.com/watch?v=${videoId}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (htmlRes.ok) {
      const html = await htmlRes.text();
      const captionMatch = html.match(/"captionTracks":\s*(\[.*?\])/);

      if (captionMatch) {
        const tracks = JSON.parse(captionMatch[1]);
        if (tracks && tracks.length > 0) {
          const track =
            tracks.find((t: { languageCode: string }) =>
              t.languageCode.startsWith("en")
            ) || tracks[0];

          if (track.baseUrl) {
            const captionRes = await fetch(track.baseUrl, {
              headers: { "User-Agent": "Mozilla/5.0" },
              signal: AbortSignal.timeout(10000),
            });

            if (captionRes.ok) {
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

              if (texts.length > 0) {
                const transcript = texts.join(" ").replace(/\s+/g, " ").trim();
                console.log(`[Transcript API] Fallback success: ${transcript.length} chars`);
                return NextResponse.json({ transcript, source: "youtube-timedtext" });
              }
            }
          }
        }
      }
    }

    // 全部失败
    console.log("[Transcript API] All methods failed");
    return NextResponse.json(
      { error: "This video doesn't have captions enabled." },
      { status: 404 }
    );
  } catch (error) {
    console.error("[Transcript API] Error:", error);
    const msg =
      error instanceof Error ? error.message : "Failed to fetch transcript";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
