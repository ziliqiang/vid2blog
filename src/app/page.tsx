"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCards from "@/components/PricingCards";
import { useI18n } from "@/lib/i18n/context";

export default function LandingPage() {
  const { t } = useI18n();

  const steps = [
    { step: "1", title: t("landing.step1Title"), description: t("landing.step1Desc") },
    { step: "2", title: t("landing.step2Title"), description: t("landing.step2Desc") },
    { step: "3", title: t("landing.step3Title"), description: t("landing.step3Desc") },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            {t("landing.badge")}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white max-w-3xl mx-auto leading-tight">
            {t("landing.heroTitle1")}{" "}
            <span className="text-primary-600">{t("landing.heroTitleHighlight")}</span>{" "}
            {t("landing.heroTitle2")}
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("landing.heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="btn-primary text-base">
              {t("landing.ctaPrimary")}
            </Link>
            <Link
              href="#features"
              className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-base"
            >
              {t("landing.ctaSecondary")}
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            {t("landing.noCardRequired")}
          </p>
        </div>

        {/* Decorative gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-200/30 dark:bg-primary-900/10 rounded-full blur-3xl -z-10" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("landing.featuresTitle")}
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {t("landing.featuresSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("landing.feature1Title")}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t("landing.feature1Desc")}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("landing.feature2Title")}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t("landing.feature2Desc")}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("landing.feature3Title")}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t("landing.feature3Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("landing.howTitle")}
            </h2>
          </div>

          <div className="space-y-8">
            {steps.map((item) => (
              <div key={item.step} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("landing.pricingTitle")}
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {t("landing.pricingSubtitle")}
            </p>
          </div>

          <PricingCards />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("landing.ctaTitle")}
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {t("landing.ctaSubtitle")}
          </p>
          <Link href="/dashboard" className="btn-primary mt-8 inline-block text-base">
            {t("landing.ctaPrimary")}
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
