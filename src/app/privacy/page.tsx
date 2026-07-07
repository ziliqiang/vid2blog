import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy - Vid2Blog",
  description: "How Vid2Blog collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-12">Last updated: July 7, 2026</p>

        <div className="prose dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Introduction</h2>
            <p>
              Vid2Blog (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website
              <a href="https://vid2blog-two.vercel.app" className="text-primary-600 hover:underline"> vid2blog-two.vercel.app</a>
              and the Vid2Blog SaaS application. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
            <p className="mt-3">
              By using Vid2Blog, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Information We Collect</h2>
            <p className="font-medium text-gray-900 dark:text-white">2.1 Information you provide:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Email address (used for account registration and authentication)</li>
              <li>YouTube URLs you submit for conversion</li>
              <li>Generated blog content stored in your account</li>
              <li>Payment information is processed securely by our payment provider (Creem). We do not store your credit card details.</li>
            </ul>
            <p className="font-medium text-gray-900 dark:text-white mt-4">2.2 Automatically collected:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Usage data (pages visited, features used, timestamps)</li>
              <li>Device and browser information</li>
              <li>IP address (for security and fraud prevention)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and maintain the Vid2Blog service</li>
              <li>To create and manage your account</li>
              <li>To process payments and manage subscriptions</li>
              <li>To send important service notifications and updates</li>
              <li>To detect, prevent, and address technical issues and fraud</li>
              <li>To improve our service based on your usage patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Data Storage and Security</h2>
            <p>
              Your data is stored securely using Supabase (a PostgreSQL-based backend) with Row Level Security enabled. This means your posts and account data are only accessible by you.
            </p>
            <p className="mt-3">
              We use industry-standard encryption (TLS/SSL) for data transmission. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Third-Party Services</h2>
            <p>We use the following third-party services to operate Vid2Blog:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Supabase</strong> — Authentication and database hosting</li>
              <li><strong>Creem</strong> — Payment processing and subscription management</li>
              <li><strong>DeepSeek</strong> — AI-powered content generation</li>
              <li><strong>YouTube</strong> — Video transcript retrieval (we only access publicly available captions)</li>
              <li><strong>Vercel</strong> — Website hosting and deployment</li>
            </ul>
            <p className="mt-3">
              Each of these services has its own privacy policy governing how they handle your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where we are required to retain it for legal or accounting purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Export your generated blog posts</li>
              <li>Opt out of promotional communications</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at the email provided below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8. Cookies</h2>
            <p>
              Vid2Blog uses essential cookies and local storage to maintain your login session, remember your language and theme preferences, and ensure the application functions correctly. We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">9. Children&apos;s Privacy</h2>
            <p>
              Vid2Blog is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:{" "}
              <a href="mailto:support@vid2blog.app" className="text-primary-600 hover:underline">support@vid2blog.app</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
