"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="text-lg font-bold text-primary-600 mb-2">
              Vid2Blog
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              {t("footer.desc")}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              {t("footer.product")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t("nav.dashboard")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t("nav.pricing")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t("footer.privacy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t("footer.terms")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            (c) {new Date().getFullYear()} Vid2Blog. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
