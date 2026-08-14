# Baseball 9 H5 Game Site

A statically exported Next.js H5 game site with game guides, category and tag landing pages, structured data, sitemap generation, and optional AdSense integration.

## Local development

Install dependencies, copy `.env.local.example` to `.env.local`, and set the public site URL. Then run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Site-wide identity and integrations are configured in `src/config/site.ts`; game content lives in `src/data/games.json`.

## Quality checks

Run all checks before publishing:

```bash
npm run lint
npm run audit:data
npm run build
npm run audit:seo
```

`audit:data` validates game fields and detects generic content. `audit:seo` inspects generated static HTML, metadata, canonicals, structured data, sitemap, robots rules, and manifest references.

## Advertising

AdSense is disabled when `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` is empty. Pre-roll ads require an explicit `NEXT_PUBLIC_ENABLE_PREROLL_ADS=true`; leave them disabled during launch and ad-network review.

## Cloudflare Pages

Set the Cloudflare values documented in `.env.local.example`, then create or update the Pages project and deploy:

```bash
npm run deploy:setup
npm run deploy
```

For GitHub Actions, add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets, and add `CLOUDFLARE_PAGES_PROJECT` as a repository variable. The workflow contains no project-specific account values.
