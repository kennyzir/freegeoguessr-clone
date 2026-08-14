import type { Metadata } from 'next'
import Link from 'next/link'
import { absoluteUrl, siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `${siteConfig.name} Privacy Policy - learn how we collect, use, and protect information when you play free online games on our website.`,
  alternates: {
    canonical: absoluteUrl('/privacy-policy'),
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-text-primary">Privacy Policy</span>
      </nav>

      <article className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
        <p className="text-sm text-text-muted mb-8">Last updated: April 26, 2026</p>

        <div className="space-y-6 text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">1. Information We Collect</h2>
            <p>
              When you visit {siteConfig.name}, we may collect certain information automatically, including your IP address, browser type, operating system, pages visited, and the date and time of your visit. This data is collected through standard server logs and analytics tools to help us understand how visitors use our site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">2. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>To operate and maintain our website</li>
              <li>To improve user experience and site performance</li>
              <li>To analyze usage patterns and optimize our game catalog</li>
              <li>To display relevant advertisements through Google AdSense</li>
              <li>To respond to your inquiries or support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">3. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small text files stored on your device that help us remember your preferences and understand how you interact with our site. You can control or disable cookies through your browser settings, though this may affect certain site functionality.
            </p>
            <p className="mt-2">
              Third-party services we use, including Google Analytics and Google AdSense, may also set their own cookies to deliver targeted advertising based on your browsing history across websites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">4. Google Analytics and AdSense</h2>
            <p>
              We use Google Analytics to analyze site traffic and user behavior. Google Analytics uses cookies to collect anonymous data about your visit. You can opt out of Google Analytics by installing the{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              .
            </p>
            <p className="mt-2">
              We display advertisements through Google AdSense. Google uses cookies to serve ads based on your prior visits to this website and other websites. You can opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Ads Settings
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">5. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites, including embedded games from external providers. These external sites have their own privacy policies and data practices. We are not responsible for the privacy practices or content of any third-party sites. We encourage you to review the privacy policies of any external sites you visit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">6. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information from unauthorized access, alteration, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">7. Children&apos;s Privacy</h2>
            <p>
              Our website is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal data from a child under 13, we will take steps to delete that information promptly. If you are a parent or guardian and believe your child has provided us with personal data, please contact us at the email address below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">8. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data. To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any changes will be posted on this page with an updated &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">10. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong>{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-primary hover:underline">
                {siteConfig.email}
              </a>
            </p>
          </section>
        </div>
      </article>
    </div>
  )
}
