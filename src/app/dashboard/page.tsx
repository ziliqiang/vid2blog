"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConvertForm from "@/components/ConvertForm";
import { supabase, isDemoMode } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n/context";
import { getDemoUsage } from "@/lib/client-demo";
import Link from "next/link";

export default function DashboardPage() {
  const { t } = useI18n();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [usage, setUsage] = useState<{ postsUsed: number; postsLimit: number } | null>(null);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    const isDemo = isDemoMode();
    setDemo(isDemo);

    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      setShowCheckoutSuccess(true);
      setTimeout(() => setShowCheckoutSuccess(false), 5000);
    }

    if (isDemo) {
      // Demo mode: set mock user and usage
      setUser({ email: "demo@vid2blog.app" });
      setUsage(getDemoUsage());
      return;
    }

    // Real mode: use Supabase auth
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session?.user) return;
      setUser({ email: data.session.user.email || "" });

      try {
        const res = await fetch("/api/usage", {
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
          },
        });
        if (res.ok) {
          setUsage(await res.json());
        }
      } catch {
        // ignore
      }
    });
  }, []);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <AuthForm />
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
        {showCheckoutSuccess && (
          <div className="bg-green-500 text-white text-center py-3 text-sm font-medium">
            {t("dashboard.paymentSuccess")}
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("dashboard.title")}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {t("dashboard.subtitle")}
            </p>
          </div>

          {/* Usage indicator */}
          {usage && (
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("dashboard.usageThisMonth")}
                </span>
                <span className="text-sm text-gray-500">
                  {usage.postsUsed} / {usage.postsLimit === -1 ? t("dashboard.unlimited") : usage.postsLimit} {t("dashboard.posts")}
                </span>
              </div>
              {usage.postsLimit !== -1 && (
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (usage.postsUsed / usage.postsLimit) * 100)}%`,
                    }}
                  />
                </div>
              )}
              {usage.postsLimit !== -1 && usage.postsUsed >= usage.postsLimit && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-red-500">
                    {t("dashboard.reachedLimit")}
                  </span>
                  <Link
                    href="/pricing"
                    className="text-sm font-medium text-primary-600 hover:underline"
                  >
                    {t("dashboard.upgradePlan")}
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Demo quick-start */}
          {demo && (
            <div className="mb-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-2">
                {t("dashboard.quickStart")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  "https://www.youtube.com/watch?v=ScMzIvxBSi4",
                  "https://www.youtube.com/watch?v=9bZkp7q19f0",
                ].map((sampleUrl) => (
                  <button
                    key={sampleUrl}
                    onClick={() => {
                      const input = document.querySelector('input[type="url"]') as HTMLInputElement;
                      if (input) {
                        input.value = sampleUrl;
                        input.dispatchEvent(new Event("input", { bubbles: true }));
                      }
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                  >
                    {sampleUrl.split("v=")[1]}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-500">
                {t("dashboard.tipTones")}
              </p>
            </div>
          )}

          <ConvertForm />

          {/* Recent posts link */}
          <div className="mt-8 text-center">
            <Link
              href="/posts"
              className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              {t("dashboard.viewAllPosts")} →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function AuthForm() {
  const { t } = useI18n();
  // 修复：默认为登录模式，从 URL 参数读取模式
  const [mode, setMode] = useState<"signin" | "signup">(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('mode') === 'signup' ? 'signup' : 'signin';
    }
    return 'signin';
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setError(t("auth.checkEmail"));
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // 修复：登录成功后刷新页面以更新状态
        window.location.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.errorDefault"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {mode === "signup" ? t("auth.createAccount") : t("auth.welcomeBack")}
      </h2>

      <button
        onClick={handleGoogle}
        className="w-full py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 mb-4"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        {t("auth.continueGoogle")}
      </button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-400">
            {t("auth.or")}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("auth.email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("auth.password")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {loading
            ? t("auth.loading")
            : mode === "signup"
            ? t("auth.createAccountBtn")
            : t("auth.signInBtn")}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        {mode === "signup"
          ? t("auth.haveAccount")
          : t("auth.noAccount")}{" "}
        <button
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="text-primary-600 hover:underline font-medium"
        >
          {mode === "signup" ? t("auth.signIn") : t("auth.signUp")}
        </button>
      </p>
    </div>
  );
}
