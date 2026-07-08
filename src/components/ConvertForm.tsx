"use client";

import { useState } from "react";
import { supabase, isDemoMode } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n/context";
import { convertDemoVideo } from "@/lib/client-demo";
import { fetchYouTubeTranscript, isValidYouTubeUrl } from "@/lib/client-youtube";
import type { Tone, ConvertResult } from "@/types";

type ConvertState = "idle" | "fetching" | "generating" | "done" | "error";

export default function ConvertForm({
  onConvertComplete,
}: {
  onConvertComplete?: (result: ConvertResult) => void;
}) {
  const { t } = useI18n();
  const [url, setUrl] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [state, setState] = useState<ConvertState>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [demo, setDemo] = useState(false);

  // Check demo mode on mount
  useState(() => {
    setDemo(isDemoMode());
  });

  const handleConvert = async () => {
    if (!url.trim()) {
      setError(t("convert.enterUrl"));
      return;
    }

    // 客户端验证 URL 格式
    if (!isValidYouTubeUrl(url)) {
      setError("Invalid YouTube URL. Please provide a valid video link.");
      return;
    }

    setState("fetching");
    setError("");

    try {
      // Demo mode
      if (demo) {
        setState("generating");
        await new Promise((r) => setTimeout(r, 1500));
        const data = convertDemoVideo(url, tone);
        setResult(data);
        setState("done");
        onConvertComplete?.(data);
        return;
      }

      // 第一步：在浏览器获取字幕（绕过 Vercel IP 限制）
      setState("fetching");
      console.log("[ConvertForm] Fetching transcript client-side...");
      const youtubeData = await fetchYouTubeTranscript(url);
      console.log(
        "[ConvertForm] Transcript obtained:",
        youtubeData.transcript.length,
        "chars"
      );

      // 第二步：获取 access token
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;

      if (!accessToken) {
        setError(t("convert.signInRequired"));
        setState("error");
        return;
      }

      // 第三步：调用后端 API 进行 AI 生成和存储
      setState("generating");
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          youtubeUrl: url,
          tone,
          transcript: youtubeData.transcript,
          videoTitle: youtubeData.title,
          thumbnailUrl: youtubeData.thumbnailUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Conversion failed");
      }

      setResult(data);
      setState("done");
      onConvertComplete?.(data);
    } catch (err) {
      console.error("[ConvertForm] Error:", err);
      setError(err instanceof Error ? err.message : t("auth.errorDefault"));
      setState("error");
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(
        `# ${result.title}\n\n${result.content}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (result) {
      const markdown = `# ${result.title}\n\n${result.content}`;
      const blob = new Blob([markdown], { type: "text/markdown" });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${result.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}.md`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    }
  };

  const handleReset = () => {
    setUrl("");
    setResult(null);
    setState("idle");
    setError("");
  };

  const isLoading = state === "fetching" || state === "generating";

  return (
    <div className="w-full">
      {/* Input Form */}
      {state !== "done" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("convert.urlLabel")}
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t("convert.urlPlaceholder")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("convert.toneLabel")}
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isLoading}
              >
                <option value="professional">{t("convert.toneProfessional")}</option>
                <option value="casual">{t("convert.toneCasual")}</option>
                <option value="tutorial">{t("convert.toneTutorial")}</option>
              </select>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleConvert}
              disabled={isLoading || !url.trim()}
              className="w-full py-3 px-6 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {state === "fetching"
                    ? t("convert.fetching")
                    : t("convert.generating")}
                </>
              ) : (
                t("convert.convertBtn")
              )}
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {state === "done" && result && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-fade-in">
          {result.demoMode && (
            <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                {t("convert.demoOutput")}
              </p>
            </div>
          )}

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {result.wordCount} {t("convert.words")}
              </p>
            </div>
          </div>

          {result.thumbnailUrl && (
            <img
              src={result.thumbnailUrl}
              alt={result.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}

          <div className="prose dark:prose-invert max-w-none mb-6">
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {result.content}
            </pre>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              {copied ? t("convert.copiedBtn") : t("convert.copyBtn")}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              {t("convert.downloadBtn")}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              {t("convert.anotherBtn")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
