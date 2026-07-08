"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function PricingCards({
  demoMode = false,
  userEmail,
}: {
  demoMode?: boolean;
  userEmail?: string;
}) {
  const { t } = useI18n();

  const handleUpgrade = async (plan: string) => {
    console.log("[PricingCards] Upgrade button clicked, plan:", plan);

    if (demoMode || !userEmail) {
      console.log("[PricingCards] Demo mode or no user email, redirecting to dashboard");
      window.location.href = "/dashboard";
      return;
    }

    try {
      console.log("[PricingCards] Getting session...");
      const { supabase } = await import("@/lib/supabase");
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("[PricingCards] Session error:", sessionError);
        alert("获取登录信息失败，请重新登录");
        return;
      }

      const accessToken = sessionData.session?.access_token || "";
      console.log("[PricingCards] Access token:", accessToken ? "exists" : "missing");

      if (!accessToken) {
        alert("登录已过期，请重新登录");
        window.location.href = "/dashboard";
        return;
      }

      console.log("[PricingCards] Calling API:", "/api/creem-checkout");
      const response = await fetch("/api/creem-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ plan }),
      });

      console.log("[PricingCards] API response status:", response.status);
      const data = await response.json();
      console.log("[PricingCards] API response data:", data);

      if (data.checkoutUrl) {
        console.log("[PricingCards] Redirecting to:", data.checkoutUrl);
        window.location.href = data.checkoutUrl;
      } else if (data.error) {
        console.error("[PricingCards] API error:", data.error);
        alert(`升级失败: ${data.error}`);
      } else {
        console.error("[PricingCards] No checkout URL in response");
        alert("升级失败，请重试或联系支持");
      }
    } catch (error) {
      console.error("[PricingCards] Checkout error:", error);
      alert(`升级失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  };

  const tiers = [
    {
      name: t("pricing.free"),
      price: "$0",
      period: "/mo",
      description: t("pricing.freeDesc"),
      features: [
        t("pricing.freeF1"),
        t("pricing.freeF2"),
        t("pricing.freeF3"),
        t("pricing.freeF4"),
      ],
      cta: t("pricing.freeCta"),
      plan: "free",
      highlighted: false,
      isPaid: false,
    },
    {
      name: t("pricing.pro"),
      price: "$19",
      period: "/mo",
      description: t("pricing.proDesc"),
      features: [
        t("pricing.proF1"),
        t("pricing.proF2"),
        t("pricing.proF3"),
        t("pricing.proF4"),
        t("pricing.proF5"),
        t("pricing.proF6"),
      ],
      cta: t("pricing.proCta"),
      plan: "pro",
      highlighted: true,
      isPaid: true,
    },
    {
      name: t("pricing.business"),
      price: "$49",
      period: "/mo",
      description: t("pricing.businessDesc"),
      features: [
        t("pricing.businessF1"),
        t("pricing.businessF2"),
        t("pricing.businessF3"),
        t("pricing.businessF4"),
        t("pricing.businessF5"),
        t("pricing.businessF6"),
      ],
      cta: t("pricing.businessCta"),
      plan: "business",
      highlighted: false,
      isPaid: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {tiers.map((tier) => {
        const showDemoNote = demoMode && tier.isPaid;

        return (
          <div
            key={tier.name}
            className={`relative rounded-2xl p-8 ${
              tier.highlighted
                ? "bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-primary-600 text-white">
                  {t("pricing.popular")}
                </span>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {tier.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {tier.description}
              </p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {tier.price}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {tier.period}
                </span>
              </div>
            </div>

            <ul className="mt-8 space-y-4">
              {tier.features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {showDemoNote ? (
              <a
                href={`https://www.creem.io/payment/${
                  tier.plan === "pro"
                    ? "prod_69wBhfIEyyrBfkrsdQF7l5"
                    : "prod_3Q2gQr6tRtPMxmcefqzTfA"
                }?email=demo@vid2blog.app&success_url=${encodeURIComponent(
                  process.env.NEXT_PUBLIC_APP_URL + "/dashboard?checkout=success"
                )}`}
                className={`mt-8 block text-center py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${
                  tier.highlighted
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {tier.cta}
              </a>
            ) : tier.isPaid ? (
              <button
                onClick={() => handleUpgrade(tier.plan)}
                className={`mt-8 w-full text-center py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${
                  tier.highlighted
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {tier.cta}
              </button>
            ) : (
              <Link
                href="/dashboard"
                className={`mt-8 block text-center py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${
                  tier.highlighted
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {tier.cta}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
