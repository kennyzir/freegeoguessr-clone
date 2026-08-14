import Link from 'next/link'
import Image from 'next/image'
import RatingSystem from '@/components/RatingSystem'
import { ArrowRight, ChevronRight, Flame, Play, Star } from 'lucide-react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getGameBySlug, getAllGames } from '@/lib/games'
import type { Game } from '@/types'
import GamePlayer from '@/components/GamePlayer'
import FAQAccordion from '@/components/FAQAccordion'
import GameActionBar from '@/components/GameActionBar'
import AdUnit from '@/components/AdUnit'
import { absoluteUrl, siteConfig } from '@/config/site'

export async function generateStaticParams() {
  const games = getAllGames()
  return games.map((game) => ({ slug: game.slug }))
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params
  const game = getGameBySlug(slug)

  if (!game) {
    return { title: 'Game Not Found' }
  }

  const canonicalUrl = absoluteUrl(`/games/${game.slug}`)
  const title = `${game.h1}: ${game.slogan} - Play Now`

  return {
    title,
    description: game.meta_description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: game.meta_description,
      url: canonicalUrl,
      images: [
        {
          url: game.screenshotUrl,
          width: 800,
          height: 450,
          alt: game.name,
        },
      ],
      type: 'website',
    },
  }
}

function formatPlays(plays: number): string {
  if (plays >= 1000) return `${(plays / 1000).toFixed(1)}k`
  return plays.toString()
}

// Category-aware "Why You'll Love It" copy — adapts to game genre instead of using one-size-fits-all text
function getWhyLoveCopy(game: Game): string {
  const cat = game.categories[0] || 'casual'
  const templates: Record<string, string> = {
    'casual': `If you're a fan of pick-up-and-play games that respect your time, ${game.name} is tailor-made for you. It's perfect for those moments when you want quick, satisfying fun without a steep learning curve — offering a refreshing blend of simplicity and addictive gameplay. The easy-to-learn controls and instant action ensure you're always just one click away from a great time.`,
    'puzzle-game': `If you're a fan of elegant puzzle games, a good brain workout, and the sheer satisfaction of solving a tricky problem, ${game.name} is tailor-made for you. It's perfect for those moments when you want to unwind with a mentally stimulating activity, offering a refreshing blend of challenge and accessibility. The gradual difficulty curve ensures that you're always learning and growing, making every solved puzzle feel like a true victory.`,
    'arcade': `If you're a fan of fast-paced arcade action and the thrill of chasing high scores, ${game.name} is tailor-made for you. It's perfect for those moments when you want to test your reflexes and push your limits, offering a pure adrenaline rush with every round. The instant restart and escalating challenge keep you coming back for 'just one more try.'`,
    'racing-game': `If you're a fan of high-speed action and the thrill of pushing your limits, ${game.name} is tailor-made for you. It's perfect for those moments when you want an adrenaline-pumping escape, offering a refreshing blend of speed and skill-based challenge. The progressive difficulty ensures that you're always improving, making every race feel like a new victory.`,
    'action-game': `If you're a fan of intense action and the rush of overcoming impossible odds, ${game.name} is tailor-made for you. It's perfect for those moments when you want to dive into heart-pounding gameplay, offering a refreshing blend of excitement and skill-based mastery. The escalating challenges ensure that you're always on your toes, making every victory feel earned.`,
    'sports': `If you're a fan of competitive sports and the thrill of outplaying your opponents, ${game.name} is tailor-made for you. It's perfect for those moments when you want to scratch that competitive itch, offering a refreshing blend of skill and strategy. The dynamic gameplay ensures that every match feels unique, making every win a satisfying achievement.`,
    'clicker': `If you're a fan of idle games and the satisfying loop of watching numbers go up, ${game.name} is tailor-made for you. It's perfect for those moments when you want to relax while still feeling a sense of progression, offering a blend of strategic upgrading and hands-off fun. The upgrade tree keeps you engaged, making every prestige run feel like a fresh start with bigger rewards.`,
    'adventure': `If you're a fan of immersive adventures and the joy of discovering new worlds, ${game.name} is tailor-made for you. It's perfect for those moments when you want to escape into a compelling journey, offering a refreshing blend of exploration and challenge. The unfolding story and growing stakes ensure that you're always curious about what comes next.`,
  }
  return templates[cat] || templates['casual']
}

// Table of contents items
const TOC_ITEMS = [
  { id: 'game-overview', label: 'Game Overview' },
  { id: 'gameplay', label: 'Gameplay' },
  { id: 'key-features', label: 'Key Features' },
  { id: 'why-love-it', label: "Why You'll Love It" },
  { id: 'how-to-play', label: 'How to Play' },
  { id: 'tips-tricks', label: 'Tips & Tricks' },
  { id: 'why-play-here', label: 'Why Play Here?' },
  { id: 'faq', label: 'FAQ' },
]

function getGameSchemas(game: Game) {
  const gameUrl = absoluteUrl(`/games/${game.slug}`)
  const schemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: game.name,
      headline: game.h1,
      description: game.meta_description,
      image: game.screenshotUrl,
      url: gameUrl,
      genre: game.categories.map((cat) => cat.replace(/-/g, ' ')),
      gamePlatform: 'Web Browser',
      operatingSystem: 'Any',
      playMode: 'SinglePlayer',
      applicationCategory: 'Game',
      publisher: {
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/PlayAction',
        userInteractionCount: game.plays,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteConfig.url,
        },
        ...(game.categories[0]
          ? [
              {
                '@type': 'ListItem',
                position: 2,
                name: game.categories[0].replace(/-/g, ' '),
                item: absoluteUrl(`/c/${game.categories[0]}`),
              },
            ]
          : []),
        {
          '@type': 'ListItem',
          position: game.categories[0] ? 3 : 2,
          name: game.name,
          item: gameUrl,
        },
      ],
    },
  ]

  if (game.seoContent.faq.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: game.seoContent.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    })
  }

  return schemas
}

export default async function GamePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const game = getGameBySlug(slug)

  if (!game) {
    notFound()
  }

  const allGames = getAllGames()

  // === 3 non-overlapping recommendation pools ===

  // Pool A: Taste-based picks for "If you enjoyed X" section (Discuss下方)
  // Editorial picks first, then same-category and same-tag fallbacks.
  const tasteGames = (() => {
    const editorial = (game.seoContent.similarGames || [])
      .map((relatedSlug) => allGames.find((candidate) => candidate.slug === relatedSlug))
      .filter((candidate): candidate is Game => Boolean(candidate && candidate.slug !== game.slug))
    const sameCat = allGames
      .filter(g => g.slug !== game.slug && g.categories.some(c => game.categories.includes(c)))
    const sameTag = allGames
      .filter(g => g.slug !== game.slug && !sameCat.includes(g) && g.tags.some(t => game.tags.includes(t)))
    return Array.from(
      new Map([...editorial, ...sameCat, ...sameTag].map((candidate) => [candidate.slug, candidate])).values()
    ).slice(0, 6)
  })()

  // Pool B: Category-dedicated grid for "More {category} games" (AdSense下方)
  const tasteSlugs = new Set(tasteGames.map(g => g.slug))
  const moreCategoryGames = allGames
    .filter(g => g.slug !== game.slug && !tasteSlugs.has(g.slug) && g.categories.some(c => game.categories.includes(c)))
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 8)

  // Pool C: Trending sidebar (全站热度, 排除Pool A+B+当前)
  const usedSlugs = new Set([game.slug, ...tasteSlugs, ...moreCategoryGames.map(g => g.slug)])
  const trendingGames = allGames
    .filter(g => !usedSlugs.has(g.slug))
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 6)
  const schemas = getGameSchemas(game)

  return (
    <>
      {schemas.map((schema) => (
        <script
          key={String(schema['@type'])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* === TOP GAME INFO (full-width with decorative bg) === */}
      <div className="relative bg-card rounded-xl border border-border px-4 py-3 mb-6 overflow-hidden">
        {/* Decorative dots (yoplay.io style) */}
        <div className="absolute top-4 right-12 w-3 h-3 rounded-full bg-primary/20" />
        <div className="absolute top-2 right-24 w-2 h-2 rounded-full bg-primary/10" />
        <div className="absolute bottom-8 right-16 w-4 h-4 rounded-full border border-primary/20" />
        <div className="absolute top-8 left-3/4 w-2 h-2 rounded-full bg-primary/10" />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          {game.categories.length > 0 && (
            <>
              <Link
                href={`/c/${game.categories[0]}`}
                className="hover:text-primary transition-colors capitalize"
              >
                {game.categories[0].replace(/-/g, ' ')}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
          <span className="text-text-primary">{game.name}</span>
        </nav>
      </div>

      {/* === AD 1: Banner between breadcrumb and iframe === */}
      <AdUnit slot="2040301015" format="horizontal" className="mb-6" />

      {/* === MAIN LAYOUT: content (72%) + sidebar (28%) === */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Main content */}
        <div className="min-w-0 flex-1 space-y-8">
          {/* Game Player + Header */}
          <div className="bg-card rounded-xl overflow-hidden border border-border">
            <GamePlayer
              embedUrl={game.embedUrl}
              screenshotUrl={game.screenshotUrl}
              name={game.name}
              type="iframe"
              adOverlay={siteConfig.enablePrerollAds ? (
                <AdUnit slot="3367781436" format="rectangle" />
              ) : undefined}
            />

            {/* Header-game bar (below iframe) */}
            <div className="px-4 py-3 border-t border-border">
              <div className="flex items-center justify-between flex-wrap gap-2">
                {/* H1 Title */}
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg font-bold text-text-primary truncate">
                    {game.h1}
                  </h1>
                  {game.slogan && (
                    <p className="text-xs text-text-muted truncate mt-0.5">
                      {game.slogan}
                    </p>
                  )}
                </div>

                {/* Rating stars + value + votes (prominent) */}
                <div className="flex items-center gap-3 shrink-0">
                  <RatingSystem gameSlug={game.slug} initialRating={game.rating} />
                </div>

                {/* Action buttons */}
                <GameActionBar gameName={game.name} />
              </div>
            </div>
          </div>

          {/* === AD 4: Banner between title bar and TOC === */}
          <AdUnit slot="2040301015" format="horizontal" />

          {/* Table of Contents */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Table of Contents</h3>
            <nav className="flex flex-wrap gap-2">
              {TOC_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="px-3 py-1.5 text-xs text-text-muted hover:text-primary bg-card-hover hover:bg-primary/10 rounded-lg border border-border hover:border-primary/30 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Categories + Tags */}
          <div className="flex flex-wrap items-center gap-3">
            {game.categories.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-text-muted">Categories:</span>
                {game.categories.map((cat) => (
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
            {game.categories.length > 0 && game.tags.length > 0 && (
              <span className="w-px h-4 bg-border" />
            )}
            {game.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-text-muted">Tags:</span>
                {game.tags.map((tag) => (
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

          {/* === Mobile: Horizontal scroll Trending now (inline, above article) === */}
          <section className="lg:hidden">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Trending now</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
              {trendingGames.map((tg, i) => (
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

          {/* ===== Article Sections ===== */}
          <div className="space-y-10 pt-4">
            {/* === Taste-based recommendations (after body text, before FAQ) === */}
            <section>
              <h2 className="text-xl font-bold text-text-primary mb-4">
                {`If you enjoyed ${game.name}, try these next`}
              </h2>
              {tasteGames.length > 0 ? (
                <>
                  {/* Mobile: horizontal scroll */}
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory lg:hidden">
                    {tasteGames.map(g => (
                      <Link
                        key={g.slug}
                        href={`/games/${g.slug}`}
                        className="flex-shrink-0 w-[160px] snap-start group"
                      >
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-card border border-border">
                          <Image
                            src={g.screenshotUrl}
                            alt={g.name}
                            fill
                            sizes="160px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                        <p className="mt-1.5 text-xs font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                          {g.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-[10px] text-text-muted">{g.rating}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {/* Desktop: grid */}
                  <div className="hidden lg:grid grid-cols-4 gap-4">
                    {tasteGames.map(g => (
                      <Link
                        key={g.slug}
                        href={`/games/${g.slug}`}
                        className="group block bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-md"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={g.screenshotUrl}
                            alt={g.name}
                            fill
                            sizes="25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                            {g.name}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs text-text-muted">{g.rating}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-text-muted text-sm py-4">
                  Check out{' '}
                  <Link href="/games" className="text-primary hover:underline font-medium">
                    all games →
                  </Link>
                </p>
              )}
            </section>

            {/* Game Overview */}
            <section id="game-overview">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                {game.h1}: {game.slogan}
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {game.seoContent.overview}
              </p>
              {/* Inline category anchor links */}
              {game.categories.length > 0 && (
                <p className="text-text-secondary leading-relaxed mt-3">
                  {`If you enjoy `}
                  {game.categories.map((cat, i) => (
                    <span key={cat}>
                      <Link
                        href={`/c/${cat}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {cat.replace(/-/g, ' ')}
                      </Link>
                      {i < game.categories.length - 1 ? ' and ' : ''}
                    </span>
                  ))}
                  {`, you'll love our full library of `}
                  <Link
                    href={`/c/${game.categories[0]}`}
                    className="text-primary hover:underline font-medium"
                  >
                    free online {game.categories[0].replace(/-/g, ' ')} games
                  </Link>
                  {` — all playable instantly in your browser, no downloads needed.`}
                </p>
              )}
            </section>

            {game.seoContent.gameplay && (
              <section id="gameplay">
                <h2 className="text-xl font-bold text-text-primary mb-4">
                  {game.name} Gameplay
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {game.seoContent.gameplay}
                </p>
              </section>
            )}

            {/* Fun Facts */}
            {game.seoContent.funFacts && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h3 className="text-sm font-bold text-primary mb-1">Did You Know?</h3>
                    <p className="text-sm text-text-secondary">{game.seoContent.funFacts}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Features */}
            {game.seoContent.features.length > 0 && (
              <section id="key-features">
                <h2 className="text-xl font-bold text-text-primary mb-4">Key Features</h2>
                <div className="space-y-3">
                  {game.seoContent.features.map((feature, i) => {
                    const [title, ...descParts] = feature.split(':')
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-primary mt-0.5 text-lg">★</span>
                        <div>
                          <strong className="text-text-primary text-sm">{title}</strong>
                          {descParts.length > 0 && (
                            <span className="text-text-muted text-sm">: {descParts.join(':')}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Why You'll Love It */}
            <section id="why-love-it">
              <h2 className="text-xl font-bold text-text-primary mb-4">Why You&apos;ll Love It</h2>
              <p className="text-text-secondary leading-relaxed">
                {getWhyLoveCopy(game)}
              </p>
            </section>

            {/* How to Play */}
            <section id="how-to-play">
              <h2 className="text-xl font-bold text-text-primary mb-4">How to Play {game.name}</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                {game.seoContent.howToPlay}
              </p>

              {/* Controls Table */}
              {game.seoContent.controls && game.seoContent.controls.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-border mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-card">
                        <th className="text-left px-4 py-2 text-text-secondary font-medium">Action / Purpose</th>
                        <th className="text-left px-4 py-2 text-text-secondary font-medium">Key(s) / Gesture</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {game.seoContent.controls.map((control) => (
                        <tr key={`${control.action}-${control.input}`} className="bg-card hover:bg-card-hover">
                          <td className="px-4 py-2 text-text-primary text-sm">{control.action}</td>
                          <td className="px-4 py-2 text-text-muted text-xs">{control.input}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {(game.seoContent.desktopTips || game.seoContent.mobileTips) && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {game.seoContent.desktopTips && (
                    <div className="p-3 rounded-lg border border-border bg-card">
                      <h3 className="text-sm font-semibold text-text-primary mb-1">Desktop tip</h3>
                      <p className="text-sm text-text-secondary">{game.seoContent.desktopTips}</p>
                    </div>
                  )}
                  {game.seoContent.mobileTips && (
                    <div className="p-3 rounded-lg border border-border bg-card">
                      <h3 className="text-sm font-semibold text-text-primary mb-1">Mobile tip</h3>
                      <p className="text-sm text-text-secondary">{game.seoContent.mobileTips}</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Tips & Tricks */}
            <section id="tips-tricks">
              <h2 className="text-xl font-bold text-text-primary mb-4">Tips & Tricks</h2>
              <div className="space-y-3">
                {(game.seoContent.tipsAndTricks || [
                  'Take your time to plan your moves before sliding. Rushing often leads to blocked paths.',
                  'Clear the largest blocks first to create more maneuvering space.',
                  'Use the restart key (R) freely — each attempt teaches you something new about the level layout.',
                  'Watch the color patterns carefully — matching blocks to their exits is all about spatial reasoning.',
                ]).map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
                    <span className="text-primary font-bold">{i + 1}.</span>
                    <p className="text-text-secondary text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Why Play Here? */}
            <section id="why-play-here">
              <h2 className="text-xl font-bold text-text-primary mb-4">Why Play Here?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(game.seoContent.whyPlayHere || [
                  { title: 'No Downloads', desc: 'Play instantly in your browser — no sign-up, no installation required.' },
                  { title: 'Always Free', desc: '100% free to play. No paywalls or hidden costs.' },
                  { title: 'Works Everywhere', desc: 'Fully responsive design. Play on desktop, tablet, or mobile browser.' },
                  { title: 'Curated Collection', desc: 'Hand-picked games with complete guides, tips, and FAQs.' },
                ]).map(({ title, desc }) => (
                  <div key={title} className="p-4 bg-card rounded-xl border border-border">
                    <h4 className="text-sm font-semibold text-text-primary mb-1">{title}</h4>
                    <p className="text-xs text-text-muted">{desc}</p>
                  </div>
                ))}
              </div>
              {/* Inline CTA with internal link */}
              <p className="text-text-secondary text-sm mt-4">
                {`Looking for more `}
                {game.categories.map((cat, i) => (
                  <span key={cat}>
                    <Link href={`/c/${cat}`} className="text-primary hover:underline">
                      {cat.replace(/-/g, ' ')}
                    </Link>
                    {i < game.categories.length - 1 ? ' or ' : ''}
                  </span>
                ))}
                {` games? `}
                <Link href="/games" className="text-primary hover:underline font-medium">
                  Browse our full catalog →
                </Link>
              </p>
            </section>

            {/* FAQ */}
            {game.seoContent.faq.length > 0 && (
              <section id="faq">
                <h2 className="text-xl font-bold text-text-primary mb-4">
                  Frequently Asked Questions
                </h2>
                <FAQAccordion faqs={game.seoContent.faq} />
              </section>
            )}

            {/* AdSense Banner — after FAQ */}
            <AdUnit slot="2040301015" format="horizontal" />

            {/* AdSense — mid-content rectangle (best performing position) */}
            <AdUnit slot="3367781436" format="rectangle" />

            {/* === Category-based grid (AdSense下方) === */}
            <section className="border-t border-border pt-8 mt-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">
                {game.categories.length > 0
                  ? `More ${game.categories[0].replace(/-/g, ' ')} games`
                  : 'More games to explore'}
              </h2>
              {moreCategoryGames.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {moreCategoryGames.map(g => (
                    <Link
                      key={g.slug}
                      href={`/games/${g.slug}`}
                      className="group block bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-md"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={g.screenshotUrl}
                          alt={g.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                          {g.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-xs text-text-muted">{g.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-text-muted text-sm py-4">
                  <Link href="/games" className="text-primary hover:underline font-medium">
                    Browse all games →
                  </Link>
                </p>
              )}
            </section>
          </div>
        </div>

        {/* === Right Sidebar: Trending now (social proof, 6 games) === */}
        <aside className="hidden min-w-0 shrink-0 lg:block lg:w-80" data-fullscreen-hide>
          <div className="sticky top-8 space-y-6">
            {/* === AD 3: Square ad above sidebar === */}
            <AdUnit slot="3367781436" format="rectangle" className="my-0" />

            <section className="bg-card rounded-lg border border-border overflow-hidden shadow-sm" aria-labelledby="trending-games-heading">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
                <h2 id="trending-games-heading" className="flex items-center gap-2 text-base font-bold text-text-primary">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <Flame className="w-4 h-4" aria-hidden="true" />
                  </span>
                  Trending games
                </h2>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  Hot
                </span>
              </div>

              {trendingGames[0] && (
                <Link
                  href={`/games/${trendingGames[0].slug}`}
                  className="group block p-3 border-b border-border"
                  aria-label={`Play trending game ${trendingGames[0].name}`}
                >
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-card-hover">
                    <Image
                      src={trendingGames[0].screenshotUrl}
                      alt={trendingGames[0].name}
                      fill
                      sizes="(min-width: 1280px) 336px, 296px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <span
                      className="absolute inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[11px] font-bold text-white shadow-sm"
                      style={{ top: 10, left: 10 }}
                    >
                      <Flame className="w-3 h-3" aria-hidden="true" />
                      #1 Trending
                    </span>
                    <span
                      className="absolute flex items-center justify-center rounded-full bg-white text-primary shadow-md transition-transform group-hover:scale-110"
                      style={{ right: 10, bottom: 10, width: 36, height: 36 }}
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="pt-3 px-0.5">
                    <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                      {trendingGames[0].name}
                    </h3>
                    <p className="mt-1 text-xs text-text-secondary line-clamp-1">
                      {trendingGames[0].slogan}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-text-muted">
                      <span className="inline-flex items-center gap-1 font-semibold text-text-secondary">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                        {trendingGames[0].rating}
                      </span>
                      <span>{formatPlays(trendingGames[0].plays)} plays</span>
                      <span className="ml-auto font-semibold text-primary">Play now</span>
                    </div>
                  </div>
                </Link>
              )}

              <div className="grid grid-cols-2 gap-2 p-3">
                {trendingGames.slice(1).map((tg, i) => (
                  <Link
                    key={tg.slug}
                    href={`/games/${tg.slug}`}
                    className="group min-w-0 rounded-lg p-1.5 hover:bg-card-hover transition-colors"
                    aria-label={`Play trending game ${tg.name}`}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-card-hover">
                      <Image
                        src={tg.screenshotUrl}
                        alt={tg.name}
                        fill
                        sizes="(min-width: 1024px) 140px, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute top-1.5 left-1.5 flex h-6 min-w-6 items-center justify-center rounded-md bg-black/70 px-1.5 text-[11px] font-bold text-white backdrop-blur-sm">
                        {i + 2}
                      </span>
                    </div>
                    <div className="min-w-0 px-0.5 pt-2">
                      <h3 className="text-sm font-semibold leading-snug text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                        {tg.name}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-text-muted line-clamp-1">{tg.slogan}</p>
                      <div className="flex items-center justify-between gap-1 mt-1.5">
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                          <span className="text-[11px] font-medium text-text-secondary">{tg.rating}</span>
                        </span>
                        <span className="text-[11px] text-text-muted truncate">{formatPlays(tg.plays)} plays</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                href="/popular"
                className="group flex items-center justify-center gap-2 border-t border-border px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
              >
                View all popular games
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </section>
          </div>
        </aside>
      </div>
      </div>
    </>
  )
}
