import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Puzzle, Gamepad2, Car, Layers, Target } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getGamesByCategory, getCategories } from '@/lib/games'
import GameGrid from '@/components/GameGrid'
import { absoluteUrl, categorySeo, siteConfig } from '@/config/site'

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "geography-game": "Browse geography game games with instant browser play, clear controls, and practical game guides.",
  "puzzle-game": "Browse puzzle game games with instant browser play, clear controls, and practical game guides.",
  "geography-games": "Browse geography games games with instant browser play, clear controls, and practical game guides.",
  "puzzle-games": "Browse puzzle games games with instant browser play, clear controls, and practical game guides.",
  "action-game": "Browse action game games with instant browser play, clear controls, and practical game guides.",
  "drawing-guessing-game": "Browse drawing guessing game games with instant browser play, clear controls, and practical game guides.",
  "quiz-games": "Browse quiz games games with instant browser play, clear controls, and practical game guides."
}

type CategoryContent = {
  intro: string
  guideTitle: string
  guide: string
  faqs: { q: string; a: string }[]
}

const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  "geography-game": {
    "intro": "This geography game collection brings together 6 browser games, including EthnoGuessr 2, CityGuessr, EthnoGuessr. Compare each game's objective, controls, and difficulty before choosing what to play next.",
    "guideTitle": "How to choose a geography game game",
    "guide": "Start with the type of session you want. Open a highly ranked title for a familiar entry point, or compare the controls and gameplay notes on each detail page when you want a specific mechanic. The internal links connect games that share the geography game category, while tags provide a narrower route based on format, input style, or theme.",
    "faqs": [
      {
        "q": "Are these geography game games free to play?",
        "a": "The geography game games listed on Free GeoGuessr can be launched in a browser without purchasing a site subscription."
      },
      {
        "q": "Do geography game games require a download?",
        "a": "No separate game client is required. The playable version loads from its provider inside the browser."
      },
      {
        "q": "How do I choose a geography game game?",
        "a": "Review the game card, detail-page controls, and related tags, then choose a title that matches your device and preferred session length."
      }
    ]
  },
  "puzzle-game": {
    "intro": "This puzzle game collection brings together 16 browser games, including Bubble Shoot Merge Box 2048, Electro.io, FindCat io. Compare each game's objective, controls, and difficulty before choosing what to play next.",
    "guideTitle": "How to choose a puzzle game game",
    "guide": "Start with the type of session you want. Open a highly ranked title for a familiar entry point, or compare the controls and gameplay notes on each detail page when you want a specific mechanic. The internal links connect games that share the puzzle game category, while tags provide a narrower route based on format, input style, or theme.",
    "faqs": [
      {
        "q": "Are these puzzle game games free to play?",
        "a": "The puzzle game games listed on Free GeoGuessr can be launched in a browser without purchasing a site subscription."
      },
      {
        "q": "Do puzzle game games require a download?",
        "a": "No separate game client is required. The playable version loads from its provider inside the browser."
      },
      {
        "q": "How do I choose a puzzle game game?",
        "a": "Review the game card, detail-page controls, and related tags, then choose a title that matches your device and preferred session length."
      }
    ]
  },
  "geography-games": {
    "intro": "This geography games collection brings together 7 browser games, including CityGuessr 2, GeoGuessr, GeoGuessr Official. Compare each game's objective, controls, and difficulty before choosing what to play next.",
    "guideTitle": "How to choose a geography games game",
    "guide": "Start with the type of session you want. Open a highly ranked title for a familiar entry point, or compare the controls and gameplay notes on each detail page when you want a specific mechanic. The internal links connect games that share the geography games category, while tags provide a narrower route based on format, input style, or theme.",
    "faqs": [
      {
        "q": "Are these geography games games free to play?",
        "a": "The geography games games listed on Free GeoGuessr can be launched in a browser without purchasing a site subscription."
      },
      {
        "q": "Do geography games games require a download?",
        "a": "No separate game client is required. The playable version loads from its provider inside the browser."
      },
      {
        "q": "How do I choose a geography games game?",
        "a": "Review the game card, detail-page controls, and related tags, then choose a title that matches your device and preferred session length."
      }
    ]
  },
  "puzzle-games": {
    "intro": "This puzzle games collection brings together 2 browser games, including Coopera.io: Free Puzzle Cube IO Game, Sudoku. Compare each game's objective, controls, and difficulty before choosing what to play next.",
    "guideTitle": "How to choose a puzzle games game",
    "guide": "Start with the type of session you want. Open a highly ranked title for a familiar entry point, or compare the controls and gameplay notes on each detail page when you want a specific mechanic. The internal links connect games that share the puzzle games category, while tags provide a narrower route based on format, input style, or theme.",
    "faqs": [
      {
        "q": "Are these puzzle games games free to play?",
        "a": "The puzzle games games listed on Free GeoGuessr can be launched in a browser without purchasing a site subscription."
      },
      {
        "q": "Do puzzle games games require a download?",
        "a": "No separate game client is required. The playable version loads from its provider inside the browser."
      },
      {
        "q": "How do I choose a puzzle games game?",
        "a": "Review the game card, detail-page controls, and related tags, then choose a title that matches your device and preferred session length."
      }
    ]
  },
  "action-game": {
    "intro": "This action game collection brings together 2 browser games, including Dinosaur Game, slither.io. Compare each game's objective, controls, and difficulty before choosing what to play next.",
    "guideTitle": "How to choose a action game game",
    "guide": "Start with the type of session you want. Open a highly ranked title for a familiar entry point, or compare the controls and gameplay notes on each detail page when you want a specific mechanic. The internal links connect games that share the action game category, while tags provide a narrower route based on format, input style, or theme.",
    "faqs": [
      {
        "q": "Are these action game games free to play?",
        "a": "The action game games listed on Free GeoGuessr can be launched in a browser without purchasing a site subscription."
      },
      {
        "q": "Do action game games require a download?",
        "a": "No separate game client is required. The playable version loads from its provider inside the browser."
      },
      {
        "q": "How do I choose a action game game?",
        "a": "Review the game card, detail-page controls, and related tags, then choose a title that matches your device and preferred session length."
      }
    ]
  },
  "drawing-guessing-game": {
    "intro": "This drawing guessing game collection brings together 8 browser games, including Doodlr.io: Play the Free Draw & Guess Game, Doodly.io, DRAWar.io. Compare each game's objective, controls, and difficulty before choosing what to play next.",
    "guideTitle": "How to choose a drawing guessing game game",
    "guide": "Start with the type of session you want. Open a highly ranked title for a familiar entry point, or compare the controls and gameplay notes on each detail page when you want a specific mechanic. The internal links connect games that share the drawing guessing game category, while tags provide a narrower route based on format, input style, or theme.",
    "faqs": [
      {
        "q": "Are these drawing guessing game games free to play?",
        "a": "The drawing guessing game games listed on Free GeoGuessr can be launched in a browser without purchasing a site subscription."
      },
      {
        "q": "Do drawing guessing game games require a download?",
        "a": "No separate game client is required. The playable version loads from its provider inside the browser."
      },
      {
        "q": "How do I choose a drawing guessing game game?",
        "a": "Review the game card, detail-page controls, and related tags, then choose a title that matches your device and preferred session length."
      }
    ]
  },
  "quiz-games": {
    "intro": "This quiz games collection brings together 8 browser games, including Droll.io Trivia Battle, Flags Quiz, Connect Four. Compare each game's objective, controls, and difficulty before choosing what to play next.",
    "guideTitle": "How to choose a quiz games game",
    "guide": "Start with the type of session you want. Open a highly ranked title for a familiar entry point, or compare the controls and gameplay notes on each detail page when you want a specific mechanic. The internal links connect games that share the quiz games category, while tags provide a narrower route based on format, input style, or theme.",
    "faqs": [
      {
        "q": "Are these quiz games games free to play?",
        "a": "The quiz games games listed on Free GeoGuessr can be launched in a browser without purchasing a site subscription."
      },
      {
        "q": "Do quiz games games require a download?",
        "a": "No separate game client is required. The playable version loads from its provider inside the browser."
      },
      {
        "q": "How do I choose a quiz games game?",
        "a": "Review the game card, detail-page controls, and related tags, then choose a title that matches your device and preferred session length."
      }
    ]
  }
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'puzzle-game': <Puzzle className="w-5 h-5" />,
  'platformer': <Layers className="w-5 h-5" />,
  'arcade': <Gamepad2 className="w-5 h-5" />,
  'racing-game': <Car className="w-5 h-5" />,
  'action-game': <Target className="w-5 h-5" />,
  'adventure': <Target className="w-5 h-5" />,
  'sports': <Gamepad2 className="w-5 h-5" />,
  'casual': <Gamepad2 className="w-5 h-5" />,
}

export async function generateStaticParams() {
  const categories = getCategories()
  return categories.map((cat) => ({ category: cat.slug }))
}

export async function generateMetadata(
  props: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await props.params
  const categories = getCategories()
  const currentCategory = categories.find((c) => c.slug === category)

  if (!currentCategory) {
    return {
      title: 'Category Not Found',
    }
  }

  const fallbackTitle = `${currentCategory.name} Games - Play Free Online`
  const fallbackDescription = `Play free ${currentCategory.name.toLowerCase()} games online on ${siteConfig.name}. No downloads, no sign-ups, instant browser gameplay.`
  const seo = categorySeo[category] || {
    title: fallbackTitle,
    description: fallbackDescription,
  }

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: absoluteUrl(`/c/${category}`),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrl(`/c/${category}`),
      type: 'website',
    },
  }
}

export default async function CategoryPage(
  props: { params: Promise<{ category: string }> }
) {
  const { category } = await props.params
  const games = getGamesByCategory(category)
  const categories = getCategories()
  const currentCategory = categories.find((c) => c.slug === category)

  if (!currentCategory) {
    notFound()
  }

  const description = CATEGORY_DESCRIPTIONS[category] || `${currentCategory.name} games — play the best free ${currentCategory.name.toLowerCase()} games online. No download required.`
  const content = CATEGORY_CONTENT[category]
  const topGames = [...games].sort((a, b) => b.plays - a.plays).slice(0, 3)
  const relatedCategories = categories.filter((c) => c.slug !== category).slice(0, 4)
  const schemas = content ? [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
        { '@type': 'ListItem', position: 2, name: 'Games', item: absoluteUrl('/games') },
        { '@type': 'ListItem', position: 3, name: currentCategory.name, item: absoluteUrl(`/c/${category}`) },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    },
  ] : []

  return (
    <>
      {schemas.map((schema) => (
        <script
          key={schema['@type']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
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
        <span className="text-text-primary">{currentCategory.name}</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary flex items-center gap-3">
          {CATEGORY_ICONS[category] && (
            <span className="text-primary">{CATEGORY_ICONS[category]}</span>
          )}
          Free Online {currentCategory.name} Games
        </h1>
        <p className="mt-3 text-text-secondary text-base md:text-lg max-w-2xl">
          {content?.intro || description}
        </p>
        <p className="mt-2 text-sm text-text-muted">
          {games.length} game{games.length !== 1 ? 's' : ''} in this category
        </p>
      </div>

      {topGames.length > 0 && (
        <section className="mb-12" aria-labelledby="top-category-games">
          <h2 id="top-category-games" className="text-2xl font-bold text-text-primary mb-4">
            Start with these {currentCategory.name.toLowerCase()} games
          </h2>
          <GameGrid games={topGames} />
        </section>
      )}

      <section aria-labelledby="all-category-games">
        <h2 id="all-category-games" className="text-2xl font-bold text-text-primary mb-4">
          All {currentCategory.name.toLowerCase()} games
        </h2>
      <GameGrid games={games} emptyMessage={`No games found in ${currentCategory.name}.`} />
      </section>

      {content && (
        <section className="mt-14 pt-8 border-t border-border max-w-4xl">
          <h2 className="text-2xl font-bold text-text-primary mb-4">{content.guideTitle}</h2>
          <p className="text-text-secondary leading-relaxed">{content.guide}</p>

          <h2 className="text-2xl font-bold text-text-primary mt-10 mb-4">
            {currentCategory.name} games FAQ
          </h2>
          <div className="divide-y divide-border border-y border-border">
            {content.faqs.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="cursor-pointer font-semibold text-text-primary">{faq.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Categories */}
      {relatedCategories.length > 0 && (
        <div className="mt-16 pt-8 border-t border-border">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Explore Other Categories</h2>
          <div className="flex flex-wrap gap-3">
            {relatedCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/c/${cat.slug}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm text-text-secondary hover:border-primary/50 hover:text-primary transition-all"
              >
                {CATEGORY_ICONS[cat.slug] && (
                  <span className="text-primary">{CATEGORY_ICONS[cat.slug]}</span>
                )}
                {cat.name}
                <span className="text-xs text-text-muted">({cat.count})</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  )
}
