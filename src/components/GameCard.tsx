import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { Game } from '@/types'

interface GameCardProps {
  game: Game
}

function formatPlays(plays: number): string {
  if (plays >= 1000) {
    return `${(plays / 1000).toFixed(1)}k`
  }
  return plays.toString()
}

const categoryColors: Record<string, string> = {
  'puzzle-game': 'bg-purple-600',
  platformer: 'bg-green-600',
  action: 'bg-red-600',
  sports: 'bg-blue-600',
  arcade: 'bg-yellow-600',
  casual: 'bg-teal-600',
  'farming-simulation': 'bg-emerald-600',
  'driving-racing': 'bg-orange-600',
}

function getCategoryColor(category: string): string {
  return categoryColors[category] || 'bg-primary'
}

export default function GameCard({ game }: GameCardProps) {
  const primaryCategory = game.categories[0] || 'puzzle-game'

  return (
    <Link href={`/games/${game.slug}`} className="group block">
      <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={game.screenshotUrl}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {/* Category badge */}
          <span
            className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium text-white rounded ${getCategoryColor(
              primaryCategory
            )}`}
          >
            {primaryCategory.replace(/-/g, ' ')}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
            {game.name}
          </h3>

          {/* Slogan */}
          <p className="mt-1 text-sm text-text-secondary line-clamp-1">
            {game.slogan}
          </p>

          {/* Meta */}
          <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              <span>{game.rating}</span>
            </div>
            <span>{formatPlays(game.plays)} plays</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
