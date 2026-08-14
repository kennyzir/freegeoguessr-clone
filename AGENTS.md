<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# BlockSlide — Project Context

> Auto-loaded by Hermes Agent on every session in this directory.
> Keep this compact and factual. Update when conventions change.

## What Is This?

A **blockslide.io clone** — an H5 (HTML5) game aggregation site. Users discover and play browser games directly on the site.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Data | Static JSON (`src/data/games.json`, 26 games) |
| Rendering | SSG via `generateStaticParams` |
| Fonts | Geist Sans + Geist Mono |
| Deploy | Cloudflare Pages (static export, output:'export') |

## Current State (2026-04-27)

- **26 games**, all with complete SEO (FAQ/tips/whyPlayHere/comments/funFacts/difficulty/bestFor)
- **Game detail page** layout:
  - iframe + Title bar + Ad → **"If you enjoyed X" (4 grid)** → Overview → FunFacts → Features → HowToPlay → Tips → WhyPlayHere → FAQ → Ad → Comments → Ad → **"More category games" (8 grid)**
  - Right sidebar: **"Trending now"** (6 ranked list + plays)
- **Homepage** layout:
  - Hero iframe + description → Sidebar "Trending now" (6) → **"More games to play" (8 GameGrid)** → Ad → Browse by Category → **About BlockSlide SEO block** → Browse All CTA
- **AdSense**: 11 ad units (7 horizontal + 4 rectangle), publisher ID env-var'd, close button 3s + Skip Ad
- **Comments**: 3 simulated reviews per game + submit form
- **Scheduled**: azgames-hot-game-pick cron (every 3 days, adds 1 game from azgames.io)
- **Build passes**: ~75+ static pages

## Key Conventions

### React/JSX Whitespace
React trims whitespace between adjacent JSX expressions across line breaks. 
- **Fix**: Use single template literal `` {`...${var}...`} `` for any paragraph mixing data + text
- **Avoid**: `{var} text` split across lines → produces "vartext"

### Next.js 16 PageProps
`PageProps` is a **global type helper** — do NOT import from `'next'`.
```tsx
// ✅ Correct
export default async function Page(props: { params: Promise<{ slug: string }> }) {

// ❌ Wrong
import type { PageProps } from 'next'
```

### next/image
External image domains require `remotePatterns` in `next.config.ts`.

### Ad Insertion
- Publisher ID: `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` env var (NOT hardcoded)
- Slot IDs: 2 unique (banner 2040301015, rectangle 3367781436) shared across 11 placements
- Roll replacement: `execute_code` → `search_files('SLOT_PLACEHOLDER')` → `replace_all`

### Adding Games (azgames.io)
Use `add-azgame` skill (`skill_view('add-azgame')`). 5-step pipeline: crawl → assemble → AI SEO → single inject → verify.
- ⚠️ Single write only (no batch splitting — causes race condition data loss)
- ⚠️ AI SEO generation (never hardcode large JSON)

### Naming Rules
- Modules: "Trending now" / "More games to play" / "If you enjoyed X, try these next" / "More {category} games"
- ❌ "Featured Games" / "Popular Games" / "New Games" / "Explore More!" — too salesy/H5-generic
- Comments: US gamer tone, natural, non-salesy

## File Map

```
src/
├── app/
│   ├── layout.tsx          # AdSense SDK + LocalBusiness Schema + GA4/GSC
│   ├── page.tsx            # Homepage: hero + sidebar trending + More games + categories + About SEO
│   ├── globals.css         # Tailwind v4
│   ├── games/
│   │   ├── page.tsx        # /games listing
│   │   └── [slug]/
│   │       └── page.tsx    # Game detail (~600 lines): article + recommendations + comments
│   ├── c/[category]/
│   │   └── page.tsx
│   └── tag/[tag]/
│       └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx     # Legacy (not on current homepage)
│   ├── GameCard.tsx
│   ├── GameGrid.tsx
│   ├── GamePlayer.tsx      # iframe + Play overlay + ad preroll (10s, skip after 3s)
│   ├── GameActionBar.tsx   # Like/Share/Fullscreen/Theater
│   ├── RatingSystem.tsx
│   ├── FAQAccordion.tsx
│   ├── CommentsSection.tsx # Discuss: 3 simulated reviews + input box
│   ├── AdUnit.tsx          # Universal ad unit (slot + format)
│   └── EmbedSection.tsx
├── lib/
│   └── games.ts            # Data access layer
├── data/
│   └── games.json           # 26 games with full SEO
└── types/
    └── index.ts            # Game, SEOContent, Category, Tag
```

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 04-27 | "If you enjoyed X" moved above Game Overview | User flow: read text → see recommendation immediately |
| 04-27 | Taste recs: 6→4 games, grid layout | Compact above the fold, non-overlapping with bottom More category |
| 04-27 | Home trending renamed "More games to play", 4→8 | Avoid name clash with sidebar "Trending now" |
| 04-27 | About BlockSlide SEO block on homepage | Competitor analysis: block-blast.io has long-form homepage content for SEO |
| 04-27 | Ad preroll: skip button at 3s (was 10s locked) | YouTube-style: 3s forced, then optional |
| 04-26 | LocalBusiness Schema + sameAs social matrix | E-E-A-T signal, $0 cost |
| 04-26 | AdSense P0: Privacy/About/Contact pages | AdSense compliance prerequisite |
| 04-26 | 正文内锚文本内链 | block-blast's key SEO pattern; our biggest gap before fix |
| 05-09 | Category-aware "Why You'll Love It" | `getWhyLoveCopy()` with 8 templates (casual/puzzle/arcade/racing/action/sports/clicker/adventure). Old hardcoded "puzzle games" text mismatched non-puzzle games |
| 05-09 | BASE_URL comment warns must-change | 🔴 marker + example domain in page.tsx — prevents cloned sites from keeping blockslide.io canonicals |
| 05-09 | PWA support | manifest.json, sw.js (offline-first), 192/512px icons, apple-mobile-web-app meta, theme-color. Cloned sites get installable PWA for free |
| 05-10 | itch.io embedUrl: CDN, not game page | botstudio/nstefan.itch.io → X-Frame-Options DENY. Extract html-classic.itch.zone CDN URL from data-iframe attr. Don't use *.itch.io as embedUrl |
| 05-10 | itch.io screenshotUrl: /original/ only | /315x250%23c/ unstable (CDN blocks). Extract og:image via browser_console for /original/ URL |
