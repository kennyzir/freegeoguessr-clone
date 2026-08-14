import type { Metadata } from 'next'
import Link from 'next/link'
import { Gamepad2, Target, Heart, Users } from 'lucide-react'
import { absoluteUrl, siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${siteConfig.name}, a free online games site focused on instant browser gameplay, curated games, and practical player guides.`,
  alternates: {
    canonical: absoluteUrl('/about'),
  },
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-text-primary">About Us</span>
      </nav>

      <article className="space-y-12">
        {/* Hero */}
        <section className="text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            About {siteConfig.name}
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Your destination for free online puzzle, arcade, and casual browser games.
            No downloads. No sign-ups. Just instant fun.
          </p>
        </section>

        {/* Mission */}
        <section className="bg-card rounded-xl border border-border p-8">
          <div className="flex items-start gap-4">
            <div className="text-primary mt-1">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-3">Our Mission</h2>
              <p className="text-text-secondary leading-relaxed">
                We believe everyone deserves access to quality entertainment without barriers. Our mission is
                to curate and deliver the best free browser-based games in one accessible, fast-loading
                destination. Whether you have five minutes or an hour, {siteConfig.name} is here to make every
                moment a little more fun.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-card rounded-xl border border-border">
              <div className="text-2xl mb-2">🎮</div>
              <h3 className="font-semibold text-text-primary mb-1">Curated Game Library</h3>
              <p className="text-sm text-text-muted">
                We handpick the best free online games across puzzle, platformer, arcade, racing, and more.
                Every game is tested for quality and browser compatibility.
              </p>
            </div>
            <div className="p-5 bg-card rounded-xl border border-border">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-text-primary mb-1">Instant Play</h3>
              <p className="text-sm text-text-muted">
                No downloads, no installations, no sign-ups. Click and play immediately. Our games run
                directly in your browser on desktop, tablet, or mobile.
              </p>
            </div>
            <div className="p-5 bg-card rounded-xl border border-border">
              <div className="text-2xl mb-2">🧩</div>
              <h3 className="font-semibold text-text-primary mb-1">Detailed Game Guides</h3>
              <p className="text-sm text-text-muted">
                Each game page includes how-to-play instructions, key features, tips &amp; tricks, and
                community FAQ to help you get the most out of every game.
              </p>
            </div>
            <div className="p-5 bg-card rounded-xl border border-border">
              <div className="text-2xl mb-2">🌍</div>
              <h3 className="font-semibold text-text-primary mb-1">Always Growing</h3>
              <p className="text-sm text-text-muted">
                We continuously add new games to our catalog, expanding categories and refreshing content
                so there&apos;s always something new to discover.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-6">Our Values</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
              <div className="text-primary mt-0.5">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">User First</h3>
                <p className="text-sm text-text-muted">
                  Every decision we make starts with the question: &quot;Is this better for our users?&quot;
                  Fast load times, clean design, and zero friction are our guiding principles.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
              <div className="text-primary mt-0.5">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Quality Over Quantity</h3>
                <p className="text-sm text-text-muted">
                  We&apos;d rather have 50 excellent games than 5,000 mediocre ones. Each game in our
                  catalog is selected for its entertainment value and browser-based playability.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
              <div className="text-primary mt-0.5">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Community Driven</h3>
                <p className="text-sm text-text-muted">
                  We listen to our players. Your feedback shapes how we grow, what we add, and how we
                  improve the {siteConfig.name} experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <h2 className="text-2xl font-bold text-text-primary mb-3">Ready to Play?</h2>
          <p className="text-text-muted mb-6">
            Browse our full catalog and start playing instantly — no sign-up required.
          </p>
          <Link
            href="/games"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-colors"
          >
            Browse All Games →
          </Link>
        </section>
      </article>
    </div>
  )
}
