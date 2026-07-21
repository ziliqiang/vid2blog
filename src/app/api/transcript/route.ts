import { NextResponse } from "next/server";

/**
 * 获取 YouTube 字幕的代理 API
 * 使用 YouTube Innertube API（官方内部 API）
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("v");

  if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
    return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
  }

  try {
    console.log(`[Transcript API] Fetching captions for video: ${videoId}`);

    // 使用 YouTube Innertube API 获取字幕信息
    const INNERTUBE_API_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
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

    const innertubeRes = await fetch(
      `https://www.youtube.com/youtubei/v1/player?key=${INNERTUBE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!innertubeRes.ok) {
      console.error(`[Transcript API] Innertube API failed: ${innertubeRes.status}`);
      return NextResponse.json(
        { error: "Failed to fetch video information" },
        { status: 500 }
      );
    }

    const data = await innertubeRes.json();
    const captions = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!captions || captions.length === 0) {
      console.log("[Transcript API] No captions found");
      return NextResponse.json(
        { error: "This video doesn't have captions enabled." },
        { status: 404 }
      );
    }

    // 优先英文字幕，否则用第一个
    const track =
      captions.find((t: any) => t.languageCode?.startsWith("en")) || captions[0];

    if (!track?.baseUrl) {
      console.log("[Transcript API] No baseUrl in caption track");
      return NextResponse.json(
        { error: "Caption track URL not found" },
        { status: 404 }
      );
    }

    console.log(`[Transcript API] Found caption: ${track.languageCode}`);

    // 获取字幕内容（XML 格式）
    const captionRes = await fetch(track.baseUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!captionRes.ok) {
      console.error(`[Transcript API] Caption fetch failed: ${captionRes.status}`);
      return NextResponse.json(
        { error: "Failed to fetch caption content" },
        { status: 500 }
      );
    }

    const xml = await captionRes.text();

    // 解析 XML 提取文本
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
        .replace(/&nbsp;/g, " ")
        .trim();

      if (text) {
        texts.push(text);
      }
    }

    if (texts.length === 0) {
      console.log("[Transcript API] No text extracted from caption");
      return NextResponse.json(
        { error: "Caption text is empty" },
        { status: 404 }
      );
    }

    const transcript = texts.join(" ").replace(/\s+/g, " ").trim();

    console.log(`[Transcript API] Success: ${transcript.length} chars`);

    return NextResponse.json({
      transcript,
      source: "youtube-innertube",
      language: track.languageCode,
    });

  } catch (error) {
    console.error("[Transcript API] Error:", error);
    const msg = error instanceof Error ? error.message : "Failed to fetch transcript";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
