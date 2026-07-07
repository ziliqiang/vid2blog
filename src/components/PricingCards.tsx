"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { getProCheckoutUrl, getBusinessCheckoutUrl } from "@/lib/creem";

export default function PricingCards({
  demoMode = false,
  userEmail,
}: {
  demoMode?: boolean;
  userEmail?: string;
}) {
  const { t } = useI18n();

  const getCheckoutLink = (tierName: string): string => {
    if (demoMode || !userEmail) return "/pricing";
    const lower = tierName.toLowerCase();
    if (lower.includes("pro") || lower === "pro") {
      return getProCheckoutUrl(userEmail);
    }
    if (lower.includes("business") || lower === "business") {
      return getBusinessCheckoutUrl(userEmail);
    }
    return "/pricing";
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
      href: "/dashboard",
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
      href: getCheckoutLink("pro"),
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
      href: getCheckoutLink("business"),
      highlighted: false,
      isPaid: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {tiers.map((tier) => {
        const showDemoNote = demoMode && tier.isPaid;
        const isExternalCheckout = tier.isPaid && !demoMode && userEmail && tier.href.startsWith("http");

        return (
          <div
            key={tier.name}
            className={`relative rounded-2xl border p-6 ${
              tier.highlighted
                ? "border-primary-500 shadow-lg scale-105 bg-primary-50 dark:bg-primary-900/10"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-medium">
                  {t("pricing.mostPopular")}
                </span>
              </div>
            )}

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {tier.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {tier.description}
            </p>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {tier.price}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {tier.period}
              </span>
            </div>

            <ul className="mt-6 space-y-3">
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <svg
                    className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {showDemoNote ? (
              <div className="mt-8 text-center py-2.5 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 text-sm font-medium cursor-not-allowed">
                {tier.cta} ({t("pricing.demo")})
              </div>
            ) : isExternalCheckout ? (
              <a
                href={tier.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-8 block text-center py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${
                  tier.highlighted
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {tier.cta}
              </a>
            ) : (
              <Link
                href={tier.href}
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
