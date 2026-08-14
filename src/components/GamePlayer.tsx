'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Play, ExternalLink } from 'lucide-react'

interface GamePlayerProps {
  embedUrl: string
  screenshotUrl: string
  name: string
  type: 'iframe' | 'popup'
  /** Optional ad overlay shown after clicking Play, before game loads. 10s countdown. */
  adOverlay?: React.ReactNode
}

export default function GamePlayer({
  embedUrl,
  screenshotUrl,
  name,
  type,
  adOverlay,
}: GamePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAd, setShowAd] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadWarning, setLoadWarning] = useState(false)

  const handlePlay = useCallback(() => {
    if (type === 'popup') {
      window.open(embedUrl, '_blank')
      return
    }
    // If ad overlay is provided, show it first
    if (adOverlay) {
      setShowAd(true)
    } else {
      setIsPlaying(true)
      setIsLoading(true)
    }
  }, [type, embedUrl, adOverlay])

  const handleAdComplete = useCallback(() => {
    setShowAd(false)
    setIsPlaying(true)
    setIsLoading(true)
  }, [])

  useEffect(() => {
    if (!isPlaying || !isLoading) return
    const timer = window.setTimeout(() => setLoadWarning(true), 12000)
    return () => window.clearTimeout(timer)
  }, [isPlaying, isLoading])

  return (
    <div className="relative group/gameplayer">
      <div className="relative aspect-[4/5] lg:aspect-video bg-black rounded-t-xl overflow-hidden">
        {isPlaying ? (
          <iframe
            title={`${name} game player`}
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => {
              setIsLoading(false)
              setLoadWarning(false)
            }}
          />
        ) : (
          <>
            <Image
              src={screenshotUrl}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <button
                onClick={handlePlay}
                className="flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-primary/30"
              >
                {type === 'popup' ? (
                  <>
                    <ExternalLink className="w-6 h-6" />
                    Play in New Tab
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6" />
                    Play Now
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {isPlaying && isLoading && (
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-3 bg-black/80 px-4 py-3 text-white">
            <span className="text-sm">
              {loadWarning ? 'The game is taking longer than expected to load.' : 'Loading game...'}
            </span>
            {loadWarning && (
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-primary"
              >
                <ExternalLink className="w-4 h-4" />
                Open game
              </a>
            )}
          </div>
        )}

        {/* Ad Overlay — shown between "Play" click and game start.
            Hidden when game enters fullscreen via the iframe's allowFullScreen.
            We use has-[iframe:fullscreen]:hidden to hide ourselves when the
            embedded iframe takes over the screen. */}
        {showAd && adOverlay && (
          <AdOverlay onComplete={handleAdComplete}>
            {adOverlay}
          </AdOverlay>
        )}
      </div>
    </div>
  )
}

/**
 * Ad overlay with countdown timer.
 * Shows the ad content, enables a close button after 3 seconds.
 */
function AdOverlay({
  children,
  onComplete,
}: {
  children: React.ReactNode
  onComplete: () => void
}) {
  const [remaining, setRemaining] = useState(10)
  const [canSkip, setCanSkip] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanSkip(true)
          return 0
        }
        // Enable skip after 3s elapsed (remaining <= 7)
        if (prev <= 8) {
          setCanSkip(true)
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm">
      {/* Close button — appears after 3s */}
      {canSkip && (
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close ad"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      {/* Countdown badge */}
      <div className="absolute top-4 left-4 z-30">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/20 text-white text-sm font-medium">
          {canSkip ? (
            <button
              onClick={onComplete}
              className="text-primary-foreground bg-primary hover:bg-primary-hover px-4 py-1 rounded-full text-sm font-bold transition-colors"
            >
              Skip Ad →
            </button>
          ) : (
            <>
              <span className="animate-pulse w-2 h-2 rounded-full bg-yellow-400" />
              <span>Ad ends in {remaining}s</span>
            </>
          )}
        </div>
      </div>

      {/* Ad content area */}
      <div className="flex items-center justify-center p-4 w-full max-w-[400px]">
        {children}
      </div>
    </div>
  )
}
