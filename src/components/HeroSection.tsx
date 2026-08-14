'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Play,
  Star,
  Users,
  Maximize2,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
} from 'lucide-react'
import { Game } from '@/types'

interface HeroSectionProps {
  game: Game
  relatedGames?: Game[]
  showCarousel?: boolean  // hide bottom carousel when sidebar is used
}

function formatPlays(plays: number): string {
  if (plays >= 1000) return `${(plays / 1000).toFixed(1)}k`
  return plays.toString()
}

export default function HeroSection({ game, relatedGames = [], showCarousel = true }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [liked, setLiked] = useState(false)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const controls = game.seoContent.controls || []

  const prevRelated = () =>
    setCarouselIdx(i => (i - 1 + relatedGames.length) % Math.max(relatedGames.length, 1))
  const nextRelated = () =>
    setCarouselIdx(i => (i + 1) % Math.max(relatedGames.length, 1))

  const handlePlay = () => {
    setIframeLoaded(false)
    setIsPlaying(true)
  }

  // iframe loading: show spinner for 800ms after play click
  useEffect(() => {
    if (!isPlaying) return
    const timer = setTimeout(() => setIframeLoaded(true), 800)
    return () => clearTimeout(timer)
  }, [isPlaying])

  return (
    <div className="bg-background">
      {/* ── Page-level container (matches yoplay.io .container 1430px) ── */}
      <div className="max-w-[1430px] mx-auto px-4 sm:px-6">

        {/* ── Game area: iframe within centered container ─────────── */}
        <section
          className="relative bg-black w-full overflow-hidden rounded-t-2xl mt-6"
          style={{
            height: '600px',
            // yoplay.io iframe_box_inner_container: height:600px
            // border-radius matches yoplay.io box_embed2: border-top-left/right-radius: 10px
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
        >
          {/* Screenshot / pre-play state */}
          {!isPlaying ? (
            <div className="relative w-full h-full">
              <Image
                src={game.screenshotUrl}
                alt={game.name}
                fill
                sizes="(max-width: 768px) 100vw, 1085px"
                className="object-cover object-center"
                priority
              />
              {/* yoplay.io overlay gradient */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(142deg, rgba(61,99,205,0.5), rgba(100,36,219,0.5)), rgba(0,0,0,0.7)',
                  borderTopLeftRadius: '10px',
                  borderTopRightRadius: '10px',
                }}
              />

              {/* Play button — yoplay.io exact style */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10">
                <p className="text-white font-bold text-xl md:text-2xl text-center">
                  {game.name}
                </p>
                <button
                  onClick={handlePlay}
                  className="flex items-center gap-3 px-10 py-4 rounded-full text-white font-bold text-xl transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(94.63deg, #3d63cd 10.2%, #6424db 89.98%)',
                    boxShadow: '6px 2px 20px 0 rgba(0,0,0,0.3)',
                    minWidth: '185px',
                  }}
                >
                  <span
                    className="flex items-center justify-center w-11 h-11 bg-white rounded-full shrink-0"
                    style={{ paddingLeft: '2px' }}
                  >
                    <Play className="w-5 h-5 fill-purple-600 text-purple-600" />
                  </span>
                  <span className="text-2xl font-bold">Play now</span>
                </button>
              </div>

              {/* Bottom-right: Like + Share */}
              <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
                <button
                  onClick={() => setLiked(l => !l)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm transition-colors ${
                    liked ? 'bg-red-500/80 text-white' : 'bg-black/60 text-white/80 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
                  {liked ? '101' : '100'}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-black/60 text-white/80 hover:text-white backdrop-blur-sm transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          ) : (
            /* iframe playing state — matches yoplay.io loading_game() JS */
            <div className="relative w-full h-full">
              {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                  <div
                    className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"
                  />
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={game.embedUrl}
                className="w-full h-full"
                frameBorder="0"
                scrolling="auto"
                allowFullScreen
                title={game.name}
                onLoad={() => setIframeLoaded(true)}
                style={{ opacity: iframeLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
              />
              {/* Fullscreen button — top right */}
              <a
                href={game.embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/70 hover:bg-black/90 text-white text-xs font-medium rounded-lg backdrop-blur-sm transition-colors z-10"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Fullscreen
              </a>
            </div>
          )}
        </section>

        {/* ── Game info bar (matches yoplay.io .top_game_info) ─────── */}
        <div className="flex flex-wrap items-start gap-4 py-4 border-b border-border bg-card rounded-b-2xl px-1">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-extrabold text-text-primary">
              {game.h1}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-text-muted">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="font-semibold text-text-primary">{game.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className="font-semibold text-text-primary">{formatPlays(game.plays)} plays</span>
              </div>
              {game.categories.map(cat => (
                <Link
                  key={cat}
                  href={`/c/${cat}`}
                  className="px-2.5 py-0.5 text-xs font-medium text-white bg-primary/80 hover:bg-primary rounded-full transition-colors capitalize"
                >
                  {cat.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Description + Controls + Tags (3-col grid) ──────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
          {/* Left 2 cols: description + tags */}
          <div className="lg:col-span-2 space-y-5">
            <p className="text-base text-text-secondary leading-relaxed">
              {game.slogan}
            </p>
            {game.seoContent?.overview && (
              <p className="text-sm text-text-muted leading-relaxed line-clamp-3">
                {game.seoContent.overview}
              </p>
            )}
            <Link
              href={`/games/${game.slug}`}
              className="inline-flex items-center text-sm text-primary hover:text-primary-hover font-medium"
            >
              Read more about {game.name} →
            </Link>

            {game.tags.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {game.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/tag/${tag}`}
                      className="px-3 py-1 text-xs font-medium bg-background border border-border text-text-secondary hover:border-primary hover:text-primary rounded-full transition-colors capitalize"
                    >
                      {tag.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right col: Controls */}
          {controls.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-3">
                <Gamepad2 className="w-4 h-4 text-primary" />
                Controls
              </h3>
              <ul className="space-y-2">
                {controls.map((control) => (
                  <li key={`${control.action}-${control.input}`} className="flex items-start gap-2 text-sm">
                    <span className="text-text-muted shrink-0">{control.action}:</span>
                    <code className="text-primary font-mono text-xs bg-primary/10 px-1.5 py-0.5 rounded">
                      {control.input}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ── Related Games (hidden when sidebar provides it) ──────────── */}
      {showCarousel && relatedGames.length > 0 && (
        <section className="border-t border-border bg-card mt-4">
          <div className="max-w-[1430px] mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-text-primary">More Games to Play</h2>
              <div className="flex gap-2">
                <button
                  onClick={prevRelated}
                  className="p-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextRelated}
                  className="p-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-hidden">
              <div
                className="flex gap-4 transition-transform duration-300"
                style={{
                  transform: `translateX(-${carouselIdx * (100 / Math.min(relatedGames.length, 4))}%)`,
                }}
              >
                {relatedGames.map(g => (
                  <Link
                    key={g.slug}
                    href={`/games/${g.slug}`}
                    className="relative shrink-0 w-48 group"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                      <Image
                        src={g.screenshotUrl}
                        alt={g.name}
                        fill
                        sizes="192px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Play className="w-8 h-8 fill-white text-white" />
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-medium text-text-primary group-hover:text-primary transition-colors truncate">
                      {g.name}
                    </p>
                    <p className="text-xs text-text-muted">{formatPlays(g.plays)} plays</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
