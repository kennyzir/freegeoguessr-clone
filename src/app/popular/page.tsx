import type { Metadata } from 'next'
import GameGrid from '@/components/GameGrid'
import { getPopularGames } from '@/lib/games'
import { absoluteUrl, siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Popular Games - Most Played Free Online Games',
  description: `Play the most popular games on ${siteConfig.name}. Browse top free browser games ranked by player interest and start instantly.`,
  alternates: {
    canonical: absoluteUrl('/popular'),
  },
  openGraph: {
    title: `Popular Games - ${siteConfig.name}`,
    description: 'Browse the most-played free online games and jump into instant browser gameplay.',
    url: absoluteUrl('/popular'),
    type: 'website',
  },
}

export default function PopularPage() {
  const games = getPopularGames(16)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Popular Games</h1>
        <p className="mt-2 text-text-secondary">
          Our most-played free online games — ranked by player count. Updated daily.
        </p>
      </div>

      <GameGrid games={games} />
    </div>
  )
}
