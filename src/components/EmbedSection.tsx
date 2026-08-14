'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { absoluteUrl } from '@/config/site'

interface EmbedSectionProps {
  slug: string
}

export default function EmbedSection({ slug }: EmbedSectionProps) {
  const embedUrl = absoluteUrl(`/games/${slug}.embed`)
  const embedCode = `<iframe src="${embedUrl}" width="1280" height="720" frameborder="0" border="0" scrolling="none" allowfullscreen></iframe>`

  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const copyToClipboard = async (text: string, type: 'url' | 'code') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'url') {
        setCopiedUrl(true)
        setTimeout(() => setCopiedUrl(false), 2000)
      } else {
        setCopiedCode(true)
        setTimeout(() => setCopiedCode(false), 2000)
      }
    } catch {
      // Fallback: ignore
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border">
      {/* Embed URL Row */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <span className="text-xs font-semibold text-text-muted shrink-0">
          Embed URL
        </span>
        <input
          type="text"
          value={embedUrl}
          readOnly
          className="flex-1 bg-background text-text-secondary text-xs px-3 py-1.5 rounded border border-border focus:outline-none focus:border-primary/50"
        />
        <button
          onClick={() => copyToClipboard(embedUrl, 'url')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors shrink-0"
        >
          {copiedUrl ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Embed Code Row */}
      <div className="flex items-center gap-3 p-4">
        <span className="text-xs font-semibold text-text-muted shrink-0">
          Embed Code
        </span>
        <input
          type="text"
          value={embedCode}
          readOnly
          className="flex-1 bg-background text-text-secondary text-xs px-3 py-1.5 rounded border border-border focus:outline-none focus:border-primary/50 font-mono"
        />
        <button
          onClick={() => copyToClipboard(embedCode, 'code')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors shrink-0"
        >
          {copiedCode ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  )
}
