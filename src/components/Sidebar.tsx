'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, Home, Gamepad2, Flame, Sparkles } from 'lucide-react'
import { getCategories } from '@/lib/games'
import { siteConfig } from '@/config/site'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [categoriesExpanded, setCategoriesExpanded] = useState(false)
  const categories = getCategories()

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-border shrink-0">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
          <Image
            src={siteConfig.logoUrl}
            alt={siteConfig.name}
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-lg font-bold text-text-primary">{siteConfig.name}</span>
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-card-hover hover:text-primary transition-colors text-sm font-medium"
          onClick={() => setIsOpen(false)}
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
        <Link
          href="/games"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-card-hover hover:text-primary transition-colors text-sm font-medium"
          onClick={() => setIsOpen(false)}
        >
          <Gamepad2 className="w-4 h-4" />
          All Games
        </Link>
        <Link
          href="/popular"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-card-hover hover:text-primary transition-colors text-sm font-medium"
          onClick={() => setIsOpen(false)}
        >
          <Flame className="w-4 h-4" />
          Popular
        </Link>
        <Link
          href="/new"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-card-hover hover:text-primary transition-colors text-sm font-medium"
          onClick={() => setIsOpen(false)}
        >
          <Sparkles className="w-4 h-4" />
          New
        </Link>

        {/* Categories section */}
        <div className="pt-3 mt-2 border-t border-border">
          <button
            onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-text-muted hover:text-primary hover:bg-card-hover transition-colors text-xs font-semibold uppercase tracking-wider"
          >
            Categories
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${categoriesExpanded ? 'rotate-180' : ''}`}
            />
          </button>
          {categoriesExpanded && (
            <div className="mt-1 space-y-0.5">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/c/${cat.slug}`}
                  className="block px-5 py-2 rounded-lg text-text-secondary hover:text-primary hover:bg-card-hover transition-colors text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger button (fixed top-left) */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-card border border-border shadow-sm text-text-primary hover:bg-card-hover transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop: fixed left sidebar (always visible) */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 w-56 bg-card border-r border-border">
        {sidebarContent}
      </aside>

      {/* Mobile: overlay drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          {/* Drawer */}
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-card border-r border-border shadow-2xl animate-slide-in">
            <div className="flex items-center justify-end px-4 py-3 border-b border-border">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-card-hover transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
