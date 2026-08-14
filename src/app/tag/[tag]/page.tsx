import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getGamesByTag, getTags } from '@/lib/games'
import GameGrid from '@/components/GameGrid'
import { absoluteUrl, highValueTagSlugs, siteConfig } from '@/config/site'

export async function generateStaticParams() {
  const tags = getTags()
  return tags.map((tag) => ({ tag: tag.slug }))
}

export async function generateMetadata(
  props: { params: Promise<{ tag: string }> }
): Promise<Metadata> {
  const { tag } = await props.params
  const currentTag = getTags().find((t) => t.slug === tag)

  if (!currentTag) {
    return {
      title: 'Tag Not Found',
    }
  }

  const shouldIndex = currentTag.count >= 3 || highValueTagSlugs.has(currentTag.slug)
  const title = `${currentTag.name} Games - Play Free Online`
  const description = `Play ${currentTag.count} free ${currentTag.name.toLowerCase()} game${currentTag.count === 1 ? '' : 's'} on ${siteConfig.name}. Browse related browser games and start instantly.`

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/tag/${currentTag.slug}`),
    },
    robots: {
      index: shouldIndex,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/tag/${currentTag.slug}`),
      type: 'website',
    },
  }
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const { tag } = await props.params
  const games = getGamesByTag(tag)
  const tags = getTags()
  const currentTag = tags.find((t) => t.slug === tag)

  if (!currentTag) {
    notFound()
  }

  const relatedTags = tags
    .filter((candidate) => candidate.slug !== currentTag.slug && (candidate.count >= 3 || highValueTagSlugs.has(candidate.slug)))
    .slice(0, 8)
  const shouldIndex = currentTag.count >= 3 || highValueTagSlugs.has(currentTag.slug)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/games" className="hover:text-primary transition-colors">
          Games
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-text-primary">{currentTag.name}</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">
          Free Online {currentTag.name} Games
        </h1>
        <p className="mt-3 text-text-secondary max-w-3xl leading-relaxed">
          Browse {games.length} free browser game{games.length !== 1 ? 's' : ''} connected to {currentTag.name.toLowerCase()} gameplay.
          Compare related titles, open a game guide for controls and practical tips, and start playing without a site account or download.
        </p>
        {!shouldIndex && (
          <p className="mt-2 text-sm text-text-muted">
            This is a narrow browsing filter with a limited number of matching games.
          </p>
        )}
      </div>

      <GameGrid
        games={games}
        emptyMessage={`No games tagged with "${currentTag.name}".`}
      />

      {relatedTags.length > 0 && (
        <nav className="mt-12 pt-8 border-t border-border" aria-label="Related game tags">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Explore related game styles</h2>
          <div className="flex flex-wrap gap-3">
            {relatedTags.map((relatedTag) => (
              <Link
                key={relatedTag.slug}
                href={`/tag/${relatedTag.slug}`}
                className="px-3 py-2 text-sm rounded-lg border border-border text-text-secondary hover:text-primary hover:border-primary/50 transition-colors"
              >
                {relatedTag.name} games ({relatedTag.count})
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
