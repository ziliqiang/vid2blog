"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n/context";

export default function SettingsPage() {
  const { t } = useI18n();
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        setUser({
          email: data.session.user.email || "",
          id: data.session.user.id,
        });
        setName(data.session.user.user_metadata?.name || "");
      }
    });
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { name },
      });

      if (!error) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-500">{t("settings.pleaseSignIn")}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {t("settings.title")}
          </h1>

          {/* Profile */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("settings.profile")}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("settings.email")}
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("settings.name")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("settings.namePlaceholder")}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {saved && (
                <p className="text-sm text-green-500">{t("settings.saved")}</p>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50 text-sm"
              >
                {saving ? t("settings.saving") : t("settings.saveChanges")}
              </button>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("settings.subscription")}
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              {t("settings.manageSub")}
            </p>
            <a
              href="/pricing"
              className="inline-block px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium"
            >
              {t("settings.viewPlans")}
            </a>
          </div>

          {/* API Key (future) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("settings.apiAccess")}
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              {t("settings.apiDesc")}
            </p>
            <button
              disabled
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 text-sm font-medium cursor-not-allowed"
            >
              {t("settings.generateKey")}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
