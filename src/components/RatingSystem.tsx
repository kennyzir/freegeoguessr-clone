'use client'

import { useState } from 'react'
import { Star, ThumbsUp } from 'lucide-react'
import { siteConfig } from '@/config/site'

interface RatingSystemProps {
  gameSlug: string
  initialRating: number
}

export default function RatingSystem({ gameSlug, initialRating }: RatingSystemProps) {
  const storageKey = `${siteConfig.slug}-vote-${gameSlug}`
  const [userRating, setUserRating] = useState(() => {
    if (typeof window === 'undefined') return 0
    return Number(window.localStorage.getItem(storageKey) || 0)
  })
  const [hasVoted, setHasVoted] = useState(() => userRating > 0)
  const [voteCount, setVoteCount] = useState(() => Math.round(initialRating * 47 + 120))

  function handleVote(rating: number) {
    if (hasVoted) return
    setUserRating(rating)
    setHasVoted(true)
    setVoteCount((c) => c + 1)
    localStorage.setItem(storageKey, String(rating))
  }

  const displayRating = hasVoted
    ? ((initialRating * 47 + 120 + userRating) / 48).toFixed(1)
    : initialRating.toFixed(1)

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleVote(star)}
            disabled={hasVoted}
            className={`transition-colors ${
              hasVoted ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
            aria-label={`Rate ${star} stars`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= (hasVoted ? userRating : Math.round(initialRating))
                  ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.5)]'
                  : 'text-text-muted/40'
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-base font-bold text-yellow-500 tabular-nums">{displayRating}</span>
      <span className="text-xs text-text-muted">({voteCount} votes)</span>
      {hasVoted && (
        <span className="text-xs text-green-600 flex items-center gap-1 ml-1">
          <ThumbsUp className="w-3 h-3" /> Voted
        </span>
      )}
    </div>
  )
}
