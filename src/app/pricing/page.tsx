"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCards from "@/components/PricingCards";
import { supabase, isDemoMode } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n/context";

export default function PricingPage() {
  const { t } = useI18n();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [tier, setTier] = useState<string>("free");
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    setDemo(isDemoMode());
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        setUser({ email: data.session.user.email || "" });

        try {
          const res = await fetch("/api/usage", {
            headers: {
              Authorization: `Bearer ${data.session.access_token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setTier(data.tier || "free");
          }
        } catch {
          // ignore
        }
      }
    });
  }, []);

  const faqs = [
    { q: t("pricing.faqQ1"), a: t("pricing.faqA1") },
    { q: t("pricing.faqQ2"), a: t("pricing.faqA2") },
    { q: t("pricing.faqQ3"), a: t("pricing.faqA3") },
    { q: t("pricing.faqQ4"), a: t("pricing.faqA4") },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {t("pricing.choosePlan")}
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {t("pricing.startFree")}
            </p>
          </div>

          {demo && (
            <div className="max-w-md mx-auto mb-8 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm text-center">
              {t("pricing.demoMode")}
            </div>
          )}

          {tier !== "free" && !demo && (
            <div className="max-w-md mx-auto mb-8 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm text-center font-medium">
              {t("pricing.currentPlan", { tier: tier.charAt(0).toUpperCase() + tier.slice(1) })}
            </div>
          )}

          {demo && (
            <div className="max-w-md mx-auto mb-8 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm text-center font-medium">
              {t("pricing.demoProFeatures")}
            </div>
          )}

          <PricingCards demoMode={demo} userEmail={user?.email} />

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
              {t("pricing.faqTitle")}
            </h2>

            <div className="space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
