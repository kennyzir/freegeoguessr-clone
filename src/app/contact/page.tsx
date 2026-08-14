import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MessageSquare } from 'lucide-react'
import { absoluteUrl, siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Contact the ${siteConfig.name} team for game suggestions, feedback, broken game reports, and partnership questions.`,
  alternates: {
    canonical: absoluteUrl('/contact'),
  },
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-text-primary">Contact Us</span>
      </nav>

      <div className="space-y-12">
        {/* Hero */}
        <section className="text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Contact Us</h1>
          <p className="text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
            Have a question, feedback, or a game you&apos;d like us to add?
            We&apos;d love to hear from you. Reach out through any of the channels below.
          </p>
        </section>

        {/* Contact Methods */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-6">Get in Touch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <a
              href={`mailto:${siteConfig.email}`}
              className="group flex items-start gap-4 p-6 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="text-primary group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Email Us</h3>
                <p className="text-sm text-text-muted">{siteConfig.email}</p>
                <p className="text-xs text-text-muted mt-1">
                  Best for: General inquiries, game suggestions, business partnerships.
                </p>
              </div>
            </a>

            {/* Feedback Form Info */}
            <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
              <div className="text-primary">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Feedback</h3>
                <p className="text-sm text-text-muted">
                  Send us your thoughts, bug reports, or feature requests directly via email with the
                  subject line: &quot;Feedback: [Your Topic]&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Can Help With */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-4">What We Can Help With</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <div className="text-2xl mb-2">🎮</div>
              <h3 className="font-medium text-text-primary text-sm">Game Suggestions</h3>
              <p className="text-xs text-text-muted mt-1">
                Suggest a game you&apos;d like to see on {siteConfig.name}
              </p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <div className="text-2xl mb-2">🐛</div>
              <h3 className="font-medium text-text-primary text-sm">Report a Bug</h3>
              <p className="text-xs text-text-muted mt-1">
                Found a broken game or page issue? Let us know
              </p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <div className="text-2xl mb-2">🤝</div>
              <h3 className="font-medium text-text-primary text-sm">Partnerships</h3>
              <p className="text-xs text-text-muted mt-1">
                Interested in advertising or content partnerships
              </p>
            </div>
          </div>
        </section>

        {/* Response Time */}
        <section className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <h2 className="font-semibold text-text-primary mb-2">Response Time</h2>
          <p className="text-sm text-text-secondary">
            We typically respond to all inquiries within <strong>1–3 business days</strong>. For urgent
            matters such as copyright reports or security concerns, please include &quot;URGENT&quot; in your
            email subject line.
          </p>
        </section>

        {/* Social Links */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-4">Follow Us</h2>
          <div className="flex items-center gap-4">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors text-sm text-text-secondary"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X (Twitter)
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors text-sm text-text-secondary"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
