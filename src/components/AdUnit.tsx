'use client'

import { useEffect } from 'react'
import { siteConfig } from '@/config/site'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

interface AdUnitProps {
  /** AdSense ad unit slot ID (from AdSense dashboard) */
  slot: string
  /** Format: 'auto' | 'horizontal' | 'vertical' | 'rectangle' */
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle'
  /** Optional className override for the wrapper */
  className?: string
}

/**
 * Google AdSense Ad Unit component.
 *
 * Usage:
 *   <AdUnit slot="1234567890" format="horizontal" />
 *
 * Ad is rendered client-side by the AdSense script loaded in layout.tsx.
 * The <ins> element is the ad placeholder — AdSense replaces it at runtime.
 *
 * Publisher ID is read from NEXT_PUBLIC_ADSENSE_PUBLISHER_ID env var.
 * Slot IDs come from AdSense dashboard → Ads → Ad units.
 */
export default function AdUnit({ slot, format = 'auto', className = '' }: AdUnitProps) {
  const publisherId = siteConfig.adsensePublisherId

  useEffect(() => {
    if (!publisherId) return
    // Push ad to the queue after mount (handles SPA navigation with static export)
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({})
      }
    } catch {
      // AdSense script not loaded (adblocker, dev, or publisher ID not configured)
    }
  }, [publisherId])

  if (!publisherId) {
    return null
  }

  // Responsive sizing: fluid on mobile, fixed leaderboard on desktop
  const sizeStyles: Record<string, React.CSSProperties> = {
    auto: {
      display: 'block',
      width: '100%',
      minHeight: '100px',
    },
    horizontal: {
      display: 'block',
      width: '100%',
      maxWidth: '728px',
      height: '90px',
      margin: '0 auto',
    },
    vertical: {
      display: 'block',
      width: '160px',
      height: '600px',
    },
    rectangle: {
      display: 'block',
      width: '100%',
      maxWidth: '336px',
      height: '280px',
      margin: '0 auto',
    },
  }

  return (
    <div className={`flex justify-center my-6 w-full ${className}`}>
      <ins
        className="adsbygoogle"
        style={sizeStyles[format] || sizeStyles.auto}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      {/* Fallback placeholder (visible when ad is blocked / not loaded) */}
      <div className="adsbygoogle-fallback hidden w-full h-[90px] bg-card border border-dashed border-border rounded-xl items-center justify-center mx-auto" style={{ maxWidth: '728px' }}>
        <span className="text-xs text-text-muted">Advertisement</span>
      </div>
    </div>
  )
}
