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

  // Fetch transcript via timedtext API
  let transcriptText = "";
  try {
    transcriptText = await fetchTranscript(videoId);
  } catch {
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
  // Step 1: Fetch the watch page to get the caption track URL
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const watchRes = await fetch(watchUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!watchRes.ok) {
    throw new Error("Failed to fetch video page");
  }

  const watchHtml = await watchRes.text();

  // Extract caption tracks from the page
  const captionTracksMatch = watchHtml.match(
    /"captionTracks":\s*(\[.*?\])/
  );

  if (!captionTracksMatch) {
    throw new Error("No caption tracks found");
  }

  let captionTracks;
  try {
    captionTracks = JSON.parse(captionTracksMatch[1]);
  } catch {
    throw new Error("Failed to parse caption tracks");
  }

  if (!captionTracks || captionTracks.length === 0) {
    throw new Error("No caption tracks available");
  }

  // Prefer English, otherwise use the first track
  const englishTrack =
    captionTracks.find((t: { languageCode: string }) =>
      t.languageCode.startsWith("en")
    ) || captionTracks[0];

  const captionUrl = englishTrack.baseUrl;
  if (!captionUrl) {
    throw new Error("Caption URL not found");
  }

  // Step 2: Fetch the caption data (XML format)
  const captionRes = await fetch(captionUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  if (!captionRes.ok) {
    throw new Error("Failed to fetch captions");
  }

  const captionXml = await captionRes.text();

  // Parse XML to extract text
  const textSegments = captionXml.matchAll(/<text[^>]*>(.*?)<\/text>/g);
  const texts: string[] = [];

  for (const match of textSegments) {
    let text = match[1];
    // Decode HTML entities
    text = text
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ");
    texts.push(text);
  }

  if (texts.length === 0) {
    throw new Error("No text found in captions");
  }

  return texts.join(" ").replace(/\s+/g, " ").trim();
}

export function validateYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}
