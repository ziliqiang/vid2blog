"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, isDemoMode } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n/context";
import { getDemoPosts } from "@/lib/client-demo";
import Link from "next/link";
import type { Post } from "@/types";

export default function PostsPage() {
  const { t } = useI18n();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const demo = isDemoMode();

    if (demo) {
      // Demo mode: read from localStorage
      setAuthed(true);
      setPosts(getDemoPosts());
      setLoading(false);
      return;
    }

    // Real mode: call API
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session?.user) {
        setLoading(false);
        return;
      }
      setAuthed(true);

      try {
        const res = await fetch("/api/posts", {
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
          },
        });
        if (res.ok) {
          setPosts(await res.json());
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    });
  }, []);

  if (!authed && !loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">{t("posts.pleaseSignIn")}</p>
            <Link href="/dashboard" className="btn-primary">
              {t("nav.signIn")}
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t("posts.title")}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {t("posts.subtitle")}
              </p>
            </div>
            <Link href="/dashboard" className="btn-primary text-sm">
              {t("posts.newConversion")}
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t("posts.yourFirstPost")}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t("posts.getStarted")}
              </p>
              <Link href="/dashboard" className="btn-primary mt-6 inline-block text-sm">
                {t("posts.createFirst")}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {post.thumbnail_url && (
                      <img
                        src={post.thumbnail_url}
                        alt={post.video_title}
                        className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {post.video_title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{post.word_count} {t("convert.words")}</span>
                        <span className="capitalize">{post.tone}</span>
                        <span>
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
