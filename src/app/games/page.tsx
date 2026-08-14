import type { Metadata } from 'next'
import GameGrid from '@/components/GameGrid'
import { getAllGames } from '@/lib/games'
import { absoluteUrl, siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'All Games - Free Online Browser Games',
  description: `Browse every free online game on ${siteConfig.name}. Compare categories, read practical game guides, and start playing in your browser.`,
  alternates: {
    canonical: absoluteUrl('/games'),
  },
  openGraph: {
    title: `All Games - ${siteConfig.name}`,
    description: `Browse the complete ${siteConfig.name} library and play free browser games instantly.`,
    url: absoluteUrl('/games'),
    type: 'website',
  },
}

export default function GamesPage() {
  const games = getAllGames()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">All Games</h1>
        <p className="mt-2 text-text-secondary">
          Browse our collection of {games.length} free online games — play instantly!
        </p>
      </div>

      <GameGrid games={games} />
    </div>
  )
}
