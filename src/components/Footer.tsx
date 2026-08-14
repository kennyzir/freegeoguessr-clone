import Link from 'next/link'
import { Gamepad2 } from 'lucide-react'
import { siteConfig } from '@/config/site'

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold text-text-primary">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 text-text-secondary text-sm max-w-xs">
              Your destination for the best free online games. Play instantly — no
              downloads, no sign-ups, just fun.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/games"
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  All Games
                </Link>
              </li>
              <li>
                <Link
                  href="/popular"
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  Popular Games
                </Link>
              </li>
              <li>
                <Link
                  href="/new"
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  New Games
                </Link>
              </li>
              <li>
                <Link
                  href="/c/sports"
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  Sports Games
                </Link>
              </li>
              <li>
                <Link
                  href="/c/puzzle-game"
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  Puzzle Games
                </Link>
              </li>
              <li>
                <Link
                  href="/c/racing-game"
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  Racing Games
                </Link>
              </li>
              <li>
                <Link
                  href="/c/action-game"
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  Action Games
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-text-secondary hover:text-primary transition-colors text-sm"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-text-muted text-sm">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            {' · '}
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            {' · '}
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
