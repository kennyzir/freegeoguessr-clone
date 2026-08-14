import type { Metadata } from 'next'
import GameGrid from '@/components/GameGrid'
import { getAllGames } from '@/lib/games'
import { absoluteUrl, siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'New Games - Latest Free Online Games',
  description: `Discover the latest free online games added to ${siteConfig.name}. Play new browser games instantly with no downloads or sign-ups.`,
  alternates: {
    canonical: absoluteUrl('/new'),
  },
  openGraph: {
    title: `New Games - ${siteConfig.name}`,
    description: 'Find the newest free browser games and play instantly.',
    url: absoluteUrl('/new'),
    type: 'website',
  },
}

export default function NewPage() {
  // "New" = games sorted by featuredOrder descending (most recently added/featured first)
  const games = getAllGames()
    .sort((a, b) => (b.featuredOrder || 99) - (a.featuredOrder || 99))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">New Games</h1>
        <p className="mt-2 text-text-secondary">
          The latest additions to our free online games library. Check back often!
        </p>
      </div>

      <GameGrid games={games} />
    </div>
  )
}
