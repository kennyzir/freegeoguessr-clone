'use client'

import { useState } from 'react'
import { Heart, Share2, Maximize2, MonitorPlay } from 'lucide-react'

interface GameActionBarProps {
  gameName: string
}

function getInitialLikes(gameName: string): number {
  let hash = 0
  for (const char of gameName) {
    hash = (hash * 31 + char.charCodeAt(0)) % 997
  }
  return 20 + (hash % 80)
}

export default function GameActionBar({ gameName }: GameActionBarProps) {
  const [likes, setLikes] = useState(() => getInitialLikes(gameName))
  const [liked, setLiked] = useState(false)

  const handleLike = () => {
    if (!liked) {
      setLikes(l => l + 1)
      setLiked(true)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: gameName, url })
      } else {
        await navigator.clipboard.writeText(url)
      }
    } catch {
      // User cancelled or error
    }
  }

  const handleFullscreen = () => {
    // ── Only fullscreen the GAME iframe, not the AdSense iframes ──
    // Strategy: find the iframe that has allowFullScreen and is NOT an ad/tracker
    const AD_PATTERNS = ['googleads', 'googlesyndication', 'doubleclick', 'recaptcha', 'cloudflareinsights']
    const iframes = document.querySelectorAll('iframe')
    for (const iframe of iframes) {
      const src = iframe.getAttribute('src') || ''
      if (
        iframe.allowFullscreen &&
        src &&
        !AD_PATTERNS.some((p) => src.includes(p))
      ) {
        iframe.requestFullscreen?.()
        return
      }
    }
  }

  const handleTheater = () => {
    const html = document.documentElement
    const isTheater = html.hasAttribute('data-theater')
    if (isTheater) {
      html.removeAttribute('data-theater')
    } else {
      html.setAttribute('data-theater', '')
    }
  }

  return (
    <div className="flex items-center gap-2 shrink-0 ml-4">
      {/* Like button */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
          liked
            ? 'bg-primary/20 text-primary border-primary/30'
            : 'bg-card-hover hover:bg-primary/10 text-text-secondary hover:text-primary border-border'
        }`}
        aria-label="Like"
        title="Like"
      >
        <Heart className={`w-4 h-4 ${liked ? 'fill-primary' : ''}`} />
        <span>{likes}</span>
      </button>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-card-hover hover:bg-primary/10 text-text-secondary hover:text-primary rounded-lg border border-border transition-colors"
        aria-label="Share"
        title="Share"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {/* Separator */}
      <span className="w-px h-6 bg-border" />

      {/* Fullscreen */}
      <button
        onClick={handleFullscreen}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-card-hover hover:bg-primary/10 text-text-secondary hover:text-primary rounded-lg border border-border transition-colors"
        aria-label="Open fullscreen"
        title="Fullscreen"
      >
        <Maximize2 className="w-4 h-4" />
        <span className="hidden sm:inline">Fullscreen</span>
      </button>

      {/* Theater mode */}
      <button
        onClick={handleTheater}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-card-hover hover:bg-primary/10 text-text-secondary hover:text-primary rounded-lg border border-border transition-colors"
        aria-label="Open theater mode"
        title="Theater Mode"
      >
        <MonitorPlay className="w-4 h-4" />
        <span className="hidden sm:inline">Theater</span>
      </button>
    </div>
  )
}
