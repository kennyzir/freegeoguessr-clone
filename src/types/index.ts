export interface SEOContent {
  overview: string
  gameplay?: string
  controls?: { action: string; input: string }[]
  mobileTips?: string
  desktopTips?: string
  howToPlay: string
  features: string[]
  faq: { q: string; a: string }[]

  // Phase 2 新增字段
  tipsAndTricks?: string[]
  whyPlayHere?: { title: string; desc: string }[]
  funFacts?: string
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  bestFor?: string
  similarGames?: string[]
}

export interface Game {
  slug: string
  name: string
  h1: string
  slogan: string
  meta_description: string
  embedUrl: string
  screenshotUrl: string
  rating: number
  plays: number
  categories: string[]
  tags: string[]
  featured: boolean
  featuredOrder: number
  seoContent: SEOContent
}

export interface Category {
  slug: string
  name: string
  count: number
}

export interface Tag {
  slug: string
  name: string
  count: number
}
