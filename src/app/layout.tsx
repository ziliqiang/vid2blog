import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";

export const metadata: Metadata = {
  title: "Vid2Blog - Turn YouTube Videos Into Blog Posts in One Click",
  description:
    "Save 2 hours per video. Paste a YouTube URL, get a publication-ready blog post powered by AI.",
  openGraph: {
    title: "Vid2Blog - Turn YouTube Videos Into Blog Posts",
    description:
      "Paste a YouTube URL, get a publication-ready blog post in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
