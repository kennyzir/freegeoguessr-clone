import { Game, Category, Tag } from '@/types'
import gamesData from '@/data/games.json'

const games: Game[] = gamesData as Game[]

export function getAllGames(): Game[] {
  return games
}

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug)
}

export function getFeaturedGames(): Game[] {
  return games
    .filter((g) => g.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder)
}

export function getPopularGames(limit = 8): Game[] {
  return [...games].sort((a, b) => b.plays - a.plays).slice(0, limit)
}

export function getNewGames(limit = 6): Game[] {
  // For now, return the most recently featured/popular as "new"
  return [...games].slice(-limit).reverse()
}

export function getGamesByCategory(category: string): Game[] {
  return games.filter((g) =>
    g.categories.some((c) => c.toLowerCase() === category.toLowerCase())
  )
}

export function getGamesByTag(tag: string): Game[] {
  return games.filter((g) =>
    g.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  )
}

export function getRelatedGames(game: Game, limit = 4): Game[] {
  const categoryGames = games.filter(
    (g) =>
      g.slug !== game.slug &&
      g.categories.some((c) => game.categories.includes(c))
  )
  const tagGames = games.filter(
    (g) =>
      g.slug !== game.slug &&
      !g.categories.some((c) => game.categories.includes(c)) &&
      g.tags.some((t) => game.tags.includes(t))
  )

  const combined = [...categoryGames, ...tagGames].slice(0, limit)
  return combined
}

export function getCategories(): Category[] {
  const categoryMap = new Map<string, number>()

  for (const game of games) {
    for (const cat of game.categories) {
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
    }
  }

  return Array.from(categoryMap.entries())
    .map(([slug, count]) => ({
      slug,
      name: slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      count,
    }))
    .sort((a, b) => b.count - a.count)
}

export function getTags(): Tag[] {
  const tagMap = new Map<string, number>()

  for (const game of games) {
    for (const tag of game.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    }
  }

  return Array.from(tagMap.entries())
    .map(([slug, count]) => ({
      slug,
      name: slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      count,
    }))
    .sort((a, b) => b.count - a.count)
}
