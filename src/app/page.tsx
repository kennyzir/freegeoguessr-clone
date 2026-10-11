import type { Metadata } from 'next'
import GameGrid from '@/components/GameGrid'
import GamePlayer from '@/components/GamePlayer'
import GameActionBar from '@/components/GameActionBar'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Star, ArrowRight, Puzzle, Gamepad2, Trophy, Zap, Car, Flame } from 'lucide-react'
import { getFeaturedGames, getAllGames, getCategories } from '@/lib/games'
import RatingSystem from '@/components/RatingSystem'
import AdUnit from '@/components/AdUnit'
import { absoluteUrl, siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: siteConfig.homepageTitle,
  description: siteConfig.description,
  alternates: {
    canonical: absoluteUrl('/'),
  },
  openGraph: {
    title: siteConfig.homepageTitle,
    description: siteConfig.description,
    url: absoluteUrl('/'),
    type: 'website',
  },
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'sports': <Trophy className="w-6 h-6" />,
  'puzzle-game': <Puzzle className="w-6 h-6" />,
  'racing-game': <Car className="w-6 h-6" />,
  'arcade': <Gamepad2 className="w-6 h-6" />,
  'action-game': <Zap className="w-6 h-6" />,
  'casual': <Gamepad2 className="w-6 h-6" />,
  'adventure': <Gamepad2 className="w-6 h-6" />,
}

export default function HomePage() {
  const featured = getFeaturedGames()
  const allGames = getAllGames()

  const heroGame = featured[0]
  if (!heroGame) return null

  // More games to play: top 8 by plays, excluding hero
  const trendingGames = [...allGames]
    .filter(g => g.slug !== heroGame.slug)
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 8)

  // Sidebar: next 6 by plays, excluding hero + trending
  const trendingSlugs = new Set(trendingGames.map(g => g.slug))
  const sidebarGames = allGames
    .filter(g => g.slug !== heroGame.slug && !trendingSlugs.has(g.slug))
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 6)

  function formatPlays(plays: number): string {
    if (plays >= 1000) return `${(plays / 1000).toFixed(1)}k`
    return plays.toString()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* === TOP GAME INFO (full-width breadcrumb) === */}
      <div className="relative bg-card rounded-xl border border-border px-4 py-3 mb-6 overflow-hidden">
        {/* Decorative dots */}
        <div className="absolute top-4 right-12 w-3 h-3 rounded-full bg-primary/20" />
        <div className="absolute top-2 right-24 w-2 h-2 rounded-full bg-primary/10" />
        <div className="absolute bottom-8 right-16 w-4 h-4 rounded-full border border-primary/20" />
        <div className="absolute top-8 left-3/4 w-2 h-2 rounded-full bg-primary/10" />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text-primary">{heroGame.name}</span>
        </nav>
      </div>

      {/* === AD 1: Banner between breadcrumb and iframe === */}
      <AdUnit slot="2040301015" format="horizontal" className="mb-6" />

      {/* === MAIN LAYOUT: content (72%) + sidebar (28%) === */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Main content */}
        <div className="lg:w-[72%] space-y-8">
          {/* Game Player + Header bar */}
          <div className="bg-card rounded-xl overflow-hidden border border-border">
            <GamePlayer
              embedUrl={heroGame.embedUrl}
              screenshotUrl={heroGame.screenshotUrl}
              name={heroGame.name}
              type={heroGame.slug === 'openguessr' ? 'popup' : 'iframe'}
              adOverlay={siteConfig.enablePrerollAds ? (
                <AdUnit slot="3367781436" format="rectangle" />
              ) : undefined}
            />

            {/* header-game bar */}
            <div className="px-4 py-3 border-t border-border">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg font-bold text-text-primary truncate">{heroGame.h1}</h1>
                  {heroGame.slogan && (
                    <p className="text-xs text-text-muted truncate mt-0.5">{heroGame.slogan}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <RatingSystem gameSlug={heroGame.slug} initialRating={heroGame.rating} />
                </div>
                <GameActionBar gameName={heroGame.name} />
              </div>
            </div>
          </div>

          {/* === AD 4: Banner between title bar and description === */}
          <AdUnit slot="2040301015" format="horizontal" />

          {/* Description + tags */}
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-text-secondary leading-relaxed text-sm mb-4">
              {heroGame.seoContent.overview}
            </p>
            <Link
              href={`/games/${heroGame.slug}`}
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover font-medium"
            >
              Read more about {heroGame.name} →
            </Link>
            {/* Categories + Tags */}
            <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-border">
              {heroGame.categories.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-text-muted">Categories:</span>
                  {heroGame.categories.map(cat => (
                    <Link
                      key={cat}
                      href={`/c/${cat}`}
                      className="px-3 py-1 text-xs font-medium text-white bg-primary hover:bg-primary-hover rounded-full transition-colors"
                    >
                      {cat.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              )}
              {heroGame.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-text-muted">Tags:</span>
                  {heroGame.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/tag/${tag}`}
                      className="px-3 py-1 bg-card text-text-secondary hover:text-primary text-xs rounded-full border border-border hover:border-primary transition-colors"
                    >
                      {tag.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* === Mobile: Horizontal scroll Trending now (above main content, below Hero) === */}
          <section className="lg:hidden">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Trending now</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
              {sidebarGames.map((tg, i) => (
                <Link
                  key={tg.slug}
                  href={`/games/${tg.slug}`}
                  className="flex-shrink-0 w-[140px] snap-start group"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-card border border-border">
                    <Image
                      src={tg.screenshotUrl}
                      alt={tg.name}
                      fill
                      sizes="140px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute top-1.5 left-1.5 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {i + 1}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                    {tg.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] text-text-muted">{tg.rating}</span>
                    <span className="text-[10px] text-text-muted ml-auto">{formatPlays(tg.plays)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar: Trending now (social proof, 6 games) */}
        <aside className="lg:w-[28%] shrink-0">
          <div className="sticky top-8 space-y-6">
            {/* === AD 3: Square ad above sidebar === */}
            <AdUnit slot="3367781436" format="rectangle" className="my-0" />

            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
                <h3 className="flex items-center gap-2 text-base font-bold text-text-primary">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <Flame className="w-4 h-4" aria-hidden="true" />
                  </span>
                  Trending now
                </h3>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  Hot
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3">
                {sidebarGames.map((tg, i) => (
                  <Link
                    key={tg.slug}
                    href={`/games/${tg.slug}`}
                    className="group min-w-0 rounded-lg p-1.5 hover:bg-card-hover transition-colors"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-card-hover">
                      <Image
                        src={tg.screenshotUrl}
                        alt={tg.name}
                        fill
                        sizes="(min-width: 1024px) 135px, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className={`absolute top-1.5 left-1.5 flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-[11px] font-bold text-white backdrop-blur-sm ${i < 3 ? 'bg-primary' : 'bg-black/70'}`}>
                        {i + 1}
                      </span>
                    </div>
                    <div className="min-w-0 px-0.5 pt-2">
                      <p className="text-sm font-semibold leading-snug text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                        {tg.name}
                      </p>
                      <div className="flex items-center justify-between gap-1 mt-1.5">
                        <span className="flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-[10px] text-text-muted">{tg.rating}</span>
                        </span>
                        <span className="text-[10px] text-text-muted truncate">{formatPlays(tg.plays)} plays</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/games"
                className="block mt-3 pt-3 border-t border-border text-center text-xs text-primary hover:underline font-medium"
              >
                View all games →
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* ===== Below Hero: full-width sections ===== */}
      <div className="pt-16 space-y-16">
        {/* More games to play */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-text-primary">More games to play</h2>
            <Link href="/games" className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <GameGrid games={trendingGames} />
        </section>

        {/* AdSense — between Trending and Categories */}
        <AdUnit slot="2040301015" format="horizontal" />

        {/* Browse by Category */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Browse by Category</h2>
            <Link href="/games" className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors">
              All Categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {getCategories().slice(0, 8).map(cat => (
              <Link
                key={cat.slug}
                href={`/c/${cat.slug}`}
                className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all group"
              >
                <div className="text-primary group-hover:scale-110 transition-transform">
                  {CATEGORY_ICONS[cat.slug] || <Puzzle className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">{cat.name}</p>
                  <p className="text-xs text-text-muted">{cat.count} games</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Editorial context and internal links */}
        <section className="max-w-3xl mx-auto prose prose-sm prose-invert">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Play free online games instantly
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            {siteConfig.name} is a curated collection of browser games with playable embeds, practical controls,
            and original guides. Start with {heroGame.name}, compare related categories, or browse the full
            library without installing a separate game client.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            Popular choices include{' '}
            {trendingGames.slice(0, 3).map((game, index) => (
              <span key={game.slug}>
                {index > 0 ? (index === 2 ? ', and ' : ', ') : ''}
                <Link href={`/games/${game.slug}`} className="text-primary hover:underline font-medium">
                  {game.name}
                </Link>
              </span>
            ))}. Each detail page connects gameplay information with category and tag links so players can
            continue with a relevant game instead of returning to a generic list.
          </p>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Why play on {siteConfig.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-card rounded-lg border border-border p-3">
              <h4 className="text-sm font-semibold text-text-primary mb-1">100% Free</h4>
              <p className="text-xs text-text-muted">Every game is completely free. Play as long as you want with no paywalls or hidden costs.</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-3">
              <h4 className="text-sm font-semibold text-text-primary mb-1">No Downloads</h4>
              <p className="text-xs text-text-muted">All games run directly in your browser. No apps, plugins, or installations required.</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-3">
              <h4 className="text-sm font-semibold text-text-primary mb-1">Play Anywhere</h4>
              <p className="text-xs text-text-muted">The responsive player supports desktop, tablet, and phone when the game provider offers compatible controls.</p>
            </div>
          </div>
          <p className="text-text-secondary leading-relaxed">
            <Link href="/games" className="text-primary hover:underline font-medium">Browse all {allGames.length} games →</Link>
          </p>
        </section>

        {/* Browse All CTA */}
        <section className="py-12 text-center">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary/30"
          >
            Browse All Games <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </div>
    </div>
  )
}
