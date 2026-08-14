import { MetadataRoute } from 'next'
import { getAllGames, getCategories, getTags } from '@/lib/games'
import { absoluteUrl, highValueTagSlugs } from '@/config/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const games = getAllGames()
  const categories = getCategories()
  const tags = getTags()
  const indexableTags = tags.filter((tag) => tag.count >= 3 || highValueTagSlugs.has(tag.slug))

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: absoluteUrl('/games'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/popular'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/new'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/privacy-policy'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/about'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: absoluteUrl('/contact'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  const gamePages: MetadataRoute.Sitemap = games.map((game) => ({
    url: absoluteUrl(`/games/${game.slug}`),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: game.featured ? 0.8 : 0.7,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: absoluteUrl(`/c/${cat.slug}`),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const tagPages: MetadataRoute.Sitemap = indexableTags.map((tag) => ({
    url: absoluteUrl(`/tag/${tag.slug}`),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: highValueTagSlugs.has(tag.slug) ? 0.5 : 0.4,
  }))

  return [...staticPages, ...gamePages, ...categoryPages, ...tagPages]
}
