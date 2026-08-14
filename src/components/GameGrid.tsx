import GameCard from '@/components/GameCard'
import { Game } from '@/types'

interface GameGridProps {
  games: Game[]
  emptyMessage?: string
}

export default function GameGrid({
  games,
  emptyMessage = 'No games found.',
}: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="py-16 text-center text-text-muted">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameCard key={game.slug} game={game} />
      ))}
    </div>
  )
}
