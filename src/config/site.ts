export const siteConfig = {
  name: "Free GeoGuessr",
  slug: "freegeoguessr",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://freegeoguessr-clone.pages.dev",
  description: "Play Free GeoGuessr and a curated collection of free browser games with practical guides and instant access.",
  homepageTitle: "Free GeoGuessr - Play Free Online Games",
  keywords: [
  "free geoguessr",
  "free online games",
  "browser games",
  "html5 games"
],
  email: "contact@freegeoguessr-clone.pages.dev",
  themeColor: "#4045ed",
  logoUrl: '/brand-mark.svg',
  adsensePublisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || '',
  enablePrerollAds: process.env.NEXT_PUBLIC_ENABLE_PREROLL_ADS === 'true',
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '',
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || '',
  socials: {
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || '',
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '',
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '',
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '',
    tiktok: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK || '',
    discord: process.env.NEXT_PUBLIC_SOCIAL_DISCORD || '',
    reddit: process.env.NEXT_PUBLIC_SOCIAL_REDDIT || '',
    github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB || '',
  },
} as const

export function absoluteUrl(path = ''): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${siteConfig.url}${normalizedPath === '/' ? '' : normalizedPath}`
}

export const categorySeo: Record<string, { title: string; description: string }> = {
  "action-game": {
    "title": "Action Game (action-game) Games - Play Free Online",
    "description": "Play free action game games online on Free GeoGuessr. Browse practical guides and start instantly in your browser."
  },
  "drawing-guessing-game": {
    "title": "Drawing Guessing Game (drawing-guessing-game) Games - Play Free Online",
    "description": "Play free drawing guessing game games online on Free GeoGuessr. Browse practical guides and start instantly in your browser."
  },
  "geography-game": {
    "title": "Geography Game (geography-game) Games - Play Free Online",
    "description": "Play free geography game games online on Free GeoGuessr. Browse practical guides and start instantly in your browser."
  },
  "geography-games": {
    "title": "Geography Games (geography-games) Games - Play Free Online",
    "description": "Play free geography games games online on Free GeoGuessr. Browse practical guides and start instantly in your browser."
  },
  "puzzle-game": {
    "title": "Puzzle Game (puzzle-game) Games - Play Free Online",
    "description": "Play free puzzle game games online on Free GeoGuessr. Browse practical guides and start instantly in your browser."
  },
  "puzzle-games": {
    "title": "Puzzle Games (puzzle-games) Games - Play Free Online",
    "description": "Play free puzzle games games online on Free GeoGuessr. Browse practical guides and start instantly in your browser."
  },
  "quiz-games": {
    "title": "Quiz Games (quiz-games) Games - Play Free Online",
    "description": "Play free quiz games games online on Free GeoGuessr. Browse practical guides and start instantly in your browser."
  }
}

export const highValueTagSlugs = new Set<string>([
  "brain-teaser",
  "browser-game",
  "casual",
  "drawing-guessing",
  "educational",
  "guessing-game",
  "io-game",
  "logic-puzzle",
  "multiplayer",
  "online-game",
  "puzzle",
  "puzzle-game",
  "skill-game",
  "trivia"
])
