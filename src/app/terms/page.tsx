import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service - Vid2Blog",
  description: "The terms and conditions for using the Vid2Blog service.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-12">Last updated: July 7, 2026</p>

        <div className="prose dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Vid2Blog (the &quot;Service&quot;), operated at
              <a href="https://vid2blog-two.vercel.app" className="text-primary-600 hover:underline"> vid2blog-two.vercel.app</a>,
              you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Description of Service</h2>
            <p>
              Vid2Blog is a SaaS application that converts YouTube videos into blog posts using AI. The Service allows users to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Paste a YouTube URL and retrieve video transcripts</li>
              <li>Generate AI-powered blog posts from video content</li>
              <li>Choose writing tones (professional, casual, tutorial)</li>
              <li>Save and manage generated blog posts</li>
              <li>Upgrade to paid plans for higher usage limits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Subscription Plans and Billing</h2>
            <p className="font-medium text-gray-900 dark:text-white">3.1 Free Plan:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Limited to 3 blog posts per month</li>
              <li>Standard processing speed</li>
              <li>No credit card required</li>
            </ul>
            <p className="font-medium text-gray-900 dark:text-white mt-4">3.2 Pro Plan ($19/month):</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>30 blog posts per month</li>
              <li>Multiple writing tones</li>
              <li>SEO-optimized titles</li>
            </ul>
            <p className="font-medium text-gray-900 dark:text-white mt-4">3.3 Business Plan ($49/month):</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Unlimited blog posts</li>
              <li>Team access</li>
              <li>API access</li>
              <li>Priority support</li>
            </ul>
            <p className="mt-4">
              <strong>Billing:</strong> Subscriptions are billed monthly through our payment provider (Creem). Your subscription will automatically renew each month unless cancelled. You can cancel at any time from your account settings.
            </p>
            <p className="mt-2">
              <strong>Refunds:</strong> Due to the nature of digital services, all payments are non-refundable. You may cancel your subscription to prevent future charges.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Acceptable Use</h2>
            <p>You agree NOT to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Use the Service for any unlawful purpose</li>
              <li>Submit YouTube URLs that contain copyrighted content you do not have rights to</li>
              <li>Attempt to reverse engineer, decompile, or disassemble the Service</li>
              <li>Use the Service to generate spam, misleading, or harmful content</li>
              <li>Share your account credentials with others</li>
              <li>Use bots, scrapers, or automated tools to abuse the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Intellectual Property</h2>
            <p className="font-medium text-gray-900 dark:text-white">5.1 Your Content:</p>
            <p className="mt-2">
              You retain ownership of the blog posts generated through the Service. You are responsible for ensuring you have the right to use the source YouTube content and that generated content complies with applicable laws.
            </p>
            <p className="font-medium text-gray-900 dark:text-white mt-4">5.2 Our Service:</p>
            <p className="mt-2">
              Vid2Blog, including its design, features, and underlying technology, is the intellectual property of Vid2Blog. You may not copy, modify, or distribute any part of the Service without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. YouTube Content Disclaimer</h2>
            <p>
              Vid2Blog retrieves publicly available transcripts/captions from YouTube videos. We do not host or store YouTube video content. Users are responsible for ensuring their use of generated content complies with YouTube&apos;s Terms of Service and applicable copyright laws. Vid2Blog is not affiliated with YouTube or Google.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7. Service Availability</h2>
            <p>
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. The Service may be temporarily unavailable due to maintenance, updates, or factors beyond our control. We are not liable for any downtime or data loss.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8. Limitation of Liability</h2>
            <p>
              Vid2Blog is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. To the fullest extent permitted by law, Vid2Blog shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">9. Account Termination</h2>
            <p>
              You may delete your account at any time. We reserve the right to suspend or terminate your account if you violate these Terms or engage in any behavior that we determine to be harmful to the Service or other users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">10. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify users of significant changes by posting the new Terms on this page with an updated &quot;Last updated&quot; date. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable international e-commerce laws. Any disputes shall be resolved through good-faith negotiation first.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">12. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at:{" "}
              <a href="mailto:support@vid2blog.app" className="text-primary-600 hover:underline">support@vid2blog.app</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
