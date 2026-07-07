"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, isDemoMode } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n/context";
import { getDemoPostById } from "@/lib/client-demo";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Post } from "@/types";

export default function PostDetailPage() {
  const { t } = useI18n();
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;

    const demo = isDemoMode();

    if (demo) {
      // Demo mode: read from localStorage
      const found = getDemoPostById(id);
      setPost(found);
      setLoading(false);
      return;
    }

    // Real mode: call API
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session?.user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
          },
        });
        if (res.ok) {
          setPost(await res.json());
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    });
  }, [params]);

  const handleCopy = () => {
    if (post) {
      navigator.clipboard.writeText(`# ${post.video_title}\n\n${post.content}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (post) {
      const markdown = `# ${post.video_title}\n\n${post.content}`;
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${post.video_title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent" />
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">{t("posts.notFound")}</p>
            <Link href="/posts" className="btn-primary">
              {t("posts.backToPosts")}
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/posts"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t("posts.backToPosts")}
          </Link>

          {post.thumbnail_url && (
            <img
              src={post.thumbnail_url}
              alt={post.video_title}
              className="w-full h-56 object-cover rounded-xl mb-6"
            />
          )}

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {post.video_title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span>{post.word_count} {t("convert.words")}</span>
            <span className="capitalize">{post.tone}</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>

          <div className="flex gap-3 mb-8">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              {copied ? t("posts.copied") : t("posts.copy")}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              {t("posts.downloadMd")}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {post.content}
              </pre>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
