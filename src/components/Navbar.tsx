"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase, isDemoMode } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n/context";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    setDemo(isDemoMode());

    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      setUser(u ? { email: u.email || "" } : null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user;
        setUser(u ? { email: u.email || "" } : null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    if (demo) {
      setUser(null);
    }
  };

  const navLinks = user
    ? [
        { href: "/dashboard", label: t("nav.dashboard") },
        { href: "/posts", label: t("nav.myPosts") },
        { href: "/pricing", label: t("nav.pricing") },
        { href: "/settings", label: t("nav.settings") },
      ]
    : [
        { href: "/#features", label: t("nav.features") },
        { href: "/pricing", label: t("nav.pricing") },
      ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary-600">
                  Vid2Blog
                </span>
                {demo && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                    {t("nav.demo")}
                  </span>
                )}
              </Link>

              <div className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "text-primary-600"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  {t("nav.signOut")}
                </button>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    {t("nav.signIn")}
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                  >
                    {t("nav.getStarted")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {demo && user && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-2 text-center">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            <span className="font-medium">{t("nav.demo")}</span> — {t("nav.demoBanner")}
          </p>
        </div>
      )}
    </>
  );
}
