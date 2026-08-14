'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { getCategories } from '@/lib/games'
import { siteConfig } from '@/config/site'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const categories = getCategories()
  const topCategories = categories.slice(0, 8)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src={siteConfig.logoUrl}
              alt={siteConfig.name}
              width={24}
              height={24}
              className="rounded-md min-w-[2rem] min-h-[2rem] max-w-[4rem]"
            />
            <span className="text-xl font-bold text-text-primary">{siteConfig.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5">
            <Link
              href="/"
              className="text-text-secondary hover:text-primary transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/games"
              className="text-text-secondary hover:text-primary transition-colors text-sm font-medium"
            >
              All Games
            </Link>
            <Link
              href="/popular"
              className="text-text-secondary hover:text-primary transition-colors text-sm font-medium"
            >
              Popular
            </Link>
            <Link
              href="/new"
              className="text-text-secondary hover:text-primary transition-colors text-sm font-medium"
            >
              New
            </Link>
            {/* Top category links */}
            {topCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/c/${cat.slug}`}
                className="text-text-secondary hover:text-primary transition-colors text-sm font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-text-primary"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-text-secondary hover:text-primary transition-colors text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/games"
                className="text-text-secondary hover:text-primary transition-colors text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                All Games
              </Link>
              <Link
                href="/popular"
                className="text-text-secondary hover:text-primary transition-colors text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Popular
              </Link>
              <Link
                href="/new"
                className="text-text-secondary hover:text-primary transition-colors text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                New
              </Link>
              <div className="border-t border-border pt-3 mt-1">
                <span className="text-text-muted text-xs font-medium uppercase tracking-wider px-1">
                  Categories
                </span>
                <div className="flex flex-col gap-2 mt-2">
                  {topCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/c/${cat.slug}`}
                      className="text-text-secondary hover:text-primary transition-colors text-sm pl-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
