import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";

export const metadata: Metadata = {
  title: "Vid2Blog - Turn YouTube Videos Into Blog Posts in One Click",
  description:
    "Turn YouTube videos into SEO-optimized blog posts in one click. Save 2 hours per video with AI-powered content generation. Professional, casual, and tutorial writing styles. Get started free with 3 posts per month.",
  metadataBase: new URL('https://vid2blog.aitk.asia'),
  openGraph: {
    title: "Vid2Blog - Turn YouTube Videos Into Blog Posts",
    description:
      "Save 2 hours per video. Paste a YouTube URL, get a publication-ready blog post with AI-powered content generation.",
    url: 'https://vid2blog.aitk.asia',
    siteName: 'Vid2Blog',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vid2Blog - Turn YouTube Videos Into Blog Posts'
      }
    ],
    locale: 'en_US',
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vid2Blog - Turn YouTube Videos Into Blog Posts',
    description: 'Save 2 hours per video with AI-powered content generation.',
    images: ['/og-image.png']
  },
  alternates: {
    canonical: 'https://vid2blog.aitk.asia'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
