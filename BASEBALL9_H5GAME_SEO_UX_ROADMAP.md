# Baseball9 H5 游戏站模板 SEO / UX 改造路线图

> 目标：把当前 `baseball-9-clone` 从可运行的 H5 游戏站 MVP，升级为可复用、可规模化、适合搜索流量获取和广告审核的 H5 游戏站模板。
>
> 审计日期：2026-06-24；最新实施更新：2026-07-17
>
> 当前状态：核心 P0、P1 与部署模板改造已完成；lint、静态构建、数据审计与静态 SEO 审计全部通过。

## 0. 实施状态更新

> 更新日期：2026-07-17

已实施：

- 新增 `src/config/site.ts`，集中管理站点名、域名、邮箱、Logo、AdSense、GA4、GSC、分类 SEO 和高价值 tag。
- 全站 layout 改用统一配置，未配置 AdSense publisher ID 时不再加载广告脚本。
- 首页、游戏列表页、热门页、新游戏页、分类页、标签页、法律页补齐独立 metadata 和 canonical。
- 游戏详情页改为直接在 JSX 中输出 `VideoGame`、`FAQPage`、`BreadcrumbList` JSON-LD，静态 HTML 中可见。
- sitemap 补入 `/popular`、`/new` 和可索引 tag 页面；低价值 tag 可 `noindex, follow`。
- robots 改用统一站点 URL，并加入 `/api/` disallow。
- preroll 广告默认关闭，仅当 `NEXT_PUBLIC_ENABLE_PREROLL_ADS=true` 时启用。
- `GamePlayer` iframe 增加 `title`，广告倒计时修正为 `useEffect`。
- 修复 lint 中的内部 `<a>`、`any`、render 随机数、未使用 import 等问题。
- 移除 manifest / service worker 对不存在 `favicon.svg` 的引用。
- 新增 `npm run audit:seo` 和 `npm run audit:data`。
- 25 个游戏页完成独立 overview、gameplay、how-to-play、结构化 controls 和人工 similarGames，模板内容警告清零。
- 游戏详情页展示独立 Gameplay、控制表和设备提示；推荐顺序改为人工精选优先。
- 6 个分类页补齐精选游戏、分类导览、可见 FAQ、Breadcrumb 与 FAQPage Schema。
- tag 索引阈值调整为 3 个游戏，高价值 tag 例外；低价值 tag 保持 `noindex, follow` 且不进入 sitemap。
- 移除无真实后端和审核流程的模拟评论，避免虚假 Player Reviews 信号。
- 播放器增加加载状态、超时提示和新标签页 fallback。
- 移除构建阶段对 Google Fonts 的网络依赖，离线构建更稳定。
- 参数化 `deploy.py` / `setup_deploy.py`、GitHub Actions 与环境变量示例，清除其他项目路径和硬编码账号。

当前验证结果：

- `npm run lint` 通过。
- `npm run build` 通过。
- `npm run audit:seo` 通过，错误 0，警告 0。
- `npm run audit:data` 通过，错误 0，警告 0。
- sitemap 当前共 53 个 URL：25 个游戏页、6 个分类页、15 个可索引 tag 页，以及核心静态页。

上线前仍需人工确认：

- 使用真实 AdSense publisher / slot 信息更新环境变量与 `ads.txt`；未获批前保持 preroll 关闭。
- 逐个实机验证第三方 iframe 的控制说明、移动端适配和可嵌入状态。
- 接入真实评论存储、身份与 moderation 之前，不恢复评论模块。

---

## 1. 总体判断

当前模板具备 H5 游戏站的基础骨架：

- 首页有主游戏播放器、推荐游戏、分类入口和 SEO 内容块。
- 游戏详情页有 iframe 播放器、评分、操作按钮、目录、分类/标签、推荐区、FAQ、评论和广告位。
- 使用 `src/data/games.json` 驱动静态页面生成，适合批量复制新站。
- `next.config.ts` 使用 `output: "export"`，适合 Cloudflare Pages 静态部署。

但它还不是最佳实践模板。核心短板不是缺少页面，而是每类页面的搜索意图和可信度不够清晰：

- 分类页、标签页、列表页共用默认 metadata，导致批量页面 title / description 重复。
- sitemap 缺失 tag、popular、new 等实际生成页面。
- 游戏详情页准备了 VideoGame / FAQ Schema，但静态 HTML 中没有真实输出。
- 游戏内容高度模板化，只替换游戏名，容易被识别为低价值批量页。
- 广告位较多，首屏广告和 preroll 对 AdSense 审核期不够稳。
- 品牌、域名、广告 ID、社交信息分散硬编码，不适合复制新站。

---

## 2. 改造原则

### 2.1 搜索优先级

H5 游戏站的 SEO 页面优先级应为：

1. 首页：承接品牌词、主游戏词、主分类词。
2. 主游戏详情页：承接 `game name online`、`play game name`、`game name unblocked` 等长尾词。
3. 分类页：承接 `free online sports games`、`browser puzzle games` 等集合型词。
4. 标签页：只保留有明确搜索价值的标签页，低价值标签不要全部索引。
5. 列表页：`/games`、`/popular`、`/new` 用于爬虫发现和用户浏览，不应与首页抢同一组关键词。

### 2.2 内容原则

每个可索引页面都必须有独立价值：

- 独立 title。
- 独立 meta description。
- 独立 H1。
- 独立正文内容。
- 明确的内链出口。
- 可见内容与结构化数据一致。

游戏详情页不能只换游戏名。每个游戏至少要回答：

- 这是什么游戏。
- 核心玩法是什么。
- 如何操作。
- 适合手机还是桌面。
- 与同类游戏有什么差异。
- 玩家为什么应该留在本站玩。
- 遇到加载、全屏、控制问题怎么办。

### 2.3 广告原则

上线和 AdSense 审核期应优先内容体验：

- 不在首屏播放器前强插过多广告。
- 不让广告贴近 Play 按钮造成误点。
- preroll 广告默认关闭，审核通过且有流量后再开启。
- 所有广告容器必须固定尺寸，避免 CLS。
- 没有配置 publisher ID 时不加载广告脚本。

---

## 3. P0：上线前必须修复

### P0.1 修复所有可索引页面 metadata

问题：

当前生成产物中，大量页面复用默认值：

- `/games`
- `/popular`
- `/new`
- `/c/{category}`
- `/tag/{tag}`
- `/about`
- `/contact`
- `/privacy-policy`

实际审计结果：

- 约 67 个页面复用 `Baseball 9 - Free Online Baseball Games`。
- 约 69 个页面复用 `Play Baseball 9 and the best free online sports games...`。

改造文件：

- `src/app/games/page.tsx`
- `src/app/popular/page.tsx`
- `src/app/new/page.tsx`
- `src/app/c/[category]/page.tsx`
- `src/app/tag/[tag]/page.tsx`
- `src/app/about/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/privacy-policy/page.tsx`

执行方案：

为每类页面增加 `generateMetadata()` 或静态 `metadata`：

```ts
export async function generateMetadata(
  props: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await props.params
  const currentCategory = getCategories().find((c) => c.slug === category)

  if (!currentCategory) {
    return { title: 'Category Not Found' }
  }

  const name = currentCategory.name

  return {
    title: `${name} Games - Play Free Online`,
    description: `Play the best free ${name.toLowerCase()} games online. No downloads, no sign-ups, instant browser gameplay on Baseball 9.`,
    alternates: {
      canonical: `${siteConfig.url}/c/${currentCategory.slug}`,
    },
    openGraph: {
      title: `${name} Games - Play Free Online`,
      description: `Browse ${currentCategory.count} free ${name.toLowerCase()} games you can play instantly in your browser.`,
      url: `${siteConfig.url}/c/${currentCategory.slug}`,
      type: 'website',
    },
  }
}
```

验收标准：

- 每个 HTML 页面只有一个 `<title>`。
- 分类页 title 包含分类名。
- 标签页 title 包含标签名。
- `/games`、`/popular`、`/new` 不再使用首页默认 title。
- 所有可索引页面都有 canonical。

验证命令：

```bash
npm run build
python3 - <<'PY'
from pathlib import Path
import re, collections
rows=[]
for p in Path('out').glob('**/*.html'):
    txt=p.read_text(errors='ignore')
    m=re.search(r'<title>(.*?)</title>', txt)
    d=re.search(r'<meta name="description" content="([^"]*)"', txt)
    if m:
        rows.append((str(p), m.group(1), d.group(1) if d else ''))
print(collections.Counter(t for _,t,_ in rows).most_common(10))
print(collections.Counter(d for *_,d in rows).most_common(10))
PY
```

---

### P0.2 修复详情页 JSON-LD 静态输出

问题：

`src/app/games/[slug]/page.tsx` 在 `generateMetadata().other` 里写入 `script:ld+json`，但静态导出后真实 HTML 只看到全站 `LocalBusiness`，没有游戏页需要的 `VideoGame` 和 `FAQPage`。

改造文件：

- `src/app/games/[slug]/page.tsx`

执行方案：

删除或停止依赖 `generateMetadata().other['script:ld+json']`。在页面 JSX 顶部直接输出：

- `VideoGame`
- `FAQPage`
- `BreadcrumbList`

建议结构：

```tsx
const videoGameSchema = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: game.name,
  description: game.meta_description,
  image: game.screenshotUrl,
  url: `${siteConfig.url}/games/${game.slug}`,
  gamePlatform: 'Web Browser',
  operatingSystem: 'Any',
  applicationCategory: 'Game',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: game.seoContent.faq.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}
```

注意：

- 如果 rating、ratingCount 不是真实用户数据，不要写入 `aggregateRating`。
- FAQ Schema 必须与页面可见 FAQ 一致。
- 评论是 client component，默认不进入静态 HTML，不建议拿它做 Review Schema。

验收标准：

- `view-source:/games/baseball-9` 可以看到 `VideoGame`。
- `view-source:/games/baseball-9` 可以看到 `FAQPage`。
- Rich Results Test 不报结构化数据格式错误。

---

### P0.3 完整 sitemap

问题：

当前 `sitemap.xml` 只有 36 条 URL：

- 首页和静态页。
- 25 个游戏页。
- 6 个分类页。

缺失：

- `/tag/{tag}` 约 57 个页面。
- `/popular`
- `/new`

改造文件：

- `src/app/sitemap.ts`

执行方案：

加入：

- `getTags()` 生成 tag URL。
- `/popular` 和 `/new`。
- 后续如果加入分页，也要同步 sitemap。

建议规则：

- 首页 priority 1.0。
- `/games` priority 0.9。
- 主游戏页 priority 0.8。
- 普通游戏页 priority 0.7。
- 分类页 priority 0.6。
- 高价值 tag 页 priority 0.45。
- 低价值 tag 页不进 sitemap，或者直接 noindex。

验收标准：

```bash
python3 - <<'PY'
from pathlib import Path
s=Path('out/sitemap.xml').read_text()
print('urls', s.count('<loc>'))
print('games', s.count('/games/'))
print('categories', s.count('/c/'))
print('tags', s.count('/tag/'))
print('/popular', '/popular' in s)
print('/new', '/new' in s)
PY
```

---

### P0.4 建立统一 `siteConfig`

问题：

当前品牌和域名分散硬编码：

- `src/app/layout.tsx`
- `src/app/games/[slug]/page.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/components/Sidebar.tsx`
- `src/components/Footer.tsx`
- `src/components/EmbedSection.tsx`
- `public/manifest.json`
- `public/sw.js`
- `deploy.py`
- `.github/workflows/deploy.yml`

这会导致复制新站时漏改 canonical、sitemap、广告 ID、邮箱、PWA 名称。

改造文件：

- 新建 `src/config/site.ts`

建议结构：

```ts
export const siteConfig = {
  name: 'Baseball 9',
  slug: 'baseball-9',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://baseball-9.com',
  description: 'Play Baseball 9 and the best free online sports games. No downloads, no sign-ups.',
  email: 'contact@baseball-9.com',
  themeColor: '#4045ed',
  adsensePublisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || '',
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '',
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || '',
  logoUrl: 'https://img.qizhilu.org/...',
}
```

验收标准：

- `rg "baseball-9.com|Baseball 9|ca-pub-" src public .github *.py` 只剩必要的 config 或数据内容。
- 新站复制时只改 `siteConfig`、`manifest.json`、游戏数据和部署项目名。

---

### P0.5 广告默认关闭和审核期降密度

问题：

当前广告配置存在两个风险：

- 没有环境变量时仍使用默认 publisher ID。
- 详情页首屏和游戏启动链路广告较多。

涉及文件：

- `src/app/layout.tsx`
- `src/components/AdUnit.tsx`
- `src/components/GamePlayer.tsx`
- `src/app/page.tsx`
- `src/app/games/[slug]/page.tsx`

执行方案：

1. 没有 `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` 时，不加载 AdSense 脚本。
2. `AdUnit` 没有 publisher ID 时只渲染固定尺寸占位，或完全不渲染。
3. 新站审核期默认关闭播放器 preroll。
4. 详情页审核期建议保留：
   - 正文中部 1 个 horizontal。
   - 侧栏 1 个 rectangle。
   - 页面底部 1 个 horizontal。
5. 首页审核期建议保留：
   - More games 后 1 个 horizontal。
   - 不在首屏播放器前插广告。

验收标准：

- 未配置 publisher ID 时，页面没有加载 `pagead2.googlesyndication.com`。
- Play 按钮附近没有导致误点的广告。
- 移动端首屏可以看到游戏标题、截图和 Play 按钮，而不是被广告挤压。

---

### P0.6 修复 lint 和 React 基础问题

当前 `npm run lint` 不通过，主要问题：

- 内链 `<a>` 应替换为 Next `<Link>`。
- `AdUnit` 使用 `any`。
- `GameActionBar` render 中调用 `Math.random()`。
- `RatingSystem` effect 中同步 setState。
- 多个未使用 import。

涉及文件：

- `src/app/about/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/privacy-policy/page.tsx`
- `src/app/games/[slug]/page.tsx`
- `src/components/AdUnit.tsx`
- `src/components/GameActionBar.tsx`
- `src/components/RatingSystem.tsx`
- `src/components/Sidebar.tsx`

验收标准：

```bash
npm run lint
npm run build
```

两者都必须通过，才能把该项目作为稳定模板复制。

---

## 4. P1：排名增长核心改造

### P1.1 重写游戏详情页内容模型

问题：

当前 25 个游戏的 overview 和 howToPlay 都是通用模板，只替换游戏名。这类内容很难获得长尾排名。

改造文件：

- `src/types/index.ts`
- `src/data/games.json`
- `src/app/games/[slug]/page.tsx`

建议扩展字段：

```ts
interface SEOContent {
  overview: string
  gameplay: string
  controls: { action: string; input: string }[]
  mobileTips?: string
  desktopTips?: string
  howToPlay: string
  features: string[]
  tipsAndTricks: string[]
  whyPlayHere: { title: string; desc: string }[]
  funFacts?: string
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  bestFor?: string
  troubleshooting?: { q: string; a: string }[]
  faq: { q: string; a: string }[]
  comments?: Comment[]
}
```

每个主力游戏详情页建议结构：

1. 播放器和 Play 按钮。
2. 80-120 字快速介绍。
3. `If you enjoyed X` 推荐。
4. Game Overview，150-250 字。
5. Gameplay，描述真实机制。
6. Controls，桌面和移动端分别说明。
7. Tips，4-6 条真实技巧。
8. Why Play Here，强调本站体验。
9. FAQ，5-8 条。
10. More category games。

验收标准：

- 主力 10 个游戏每页正文至少 500-800 英文词。
- 非主力游戏每页至少 250-400 英文词。
- overview 不再出现批量句式 `is a fun and engaging online game`。
- howToPlay 不再全部以 `Getting started with` 开头。

---

### P1.2 分类页信息架构增强

问题：

当前分类页只有标题、短描述、游戏网格和 related categories。对搜索引擎来说是薄集合页。

改造文件：

- `src/app/c/[category]/page.tsx`

建议结构：

1. Breadcrumb。
2. H1：`Free Online Sports Games`。
3. 120-180 字分类介绍。
4. Top 3 featured games in this category。
5. All games grid。
6. 分类玩法说明：`What makes a good sports browser game?`
7. Related categories。
8. FAQ，3-5 条分类级 FAQ。

分类页 metadata 示例：

```txt
Title: Sports Games - Play Free Online Baseball, Basketball & Football Games
Description: Play free sports games online, including baseball, basketball, football, golf, and more. Instant browser gameplay with no downloads.
```

验收标准：

- 每个分类页至少 250-400 英文词。
- H1 包含 `Free Online {Category} Games`。
- 每个分类页有 5 个以上内部链接。
- 分类页有独立 FAQ Schema，前提是 FAQ 可见。

---

### P1.3 标签页筛选策略

问题：

当前每个 tag 都生成页面，但多数 tag 可能搜索价值很低，比如过细的机制标签。全部索引会制造大量薄页面。

改造文件：

- `src/app/tag/[tag]/page.tsx`
- `src/app/sitemap.ts`

执行方案：

把 tag 分为三类：

1. 高价值 tag：如 `baseball`、`basketball`、`football`、`2-player`、`io-game`。允许索引，进 sitemap。
2. 中价值 tag：有 3 个以上游戏时允许索引。
3. 低价值 tag：只有 1 个游戏，页面 `noindex, follow`，不进 sitemap。

建议 metadata：

```ts
robots: gameCount >= 3 ? { index: true, follow: true } : { index: false, follow: true }
```

验收标准：

- tag sitemap 数量受控，不盲目提交所有 tag。
- 低价值 tag 页不会变成搜索质量负担。
- 高价值 tag 页有独立介绍和相关推荐。

---

### P1.4 首页搜索意图重构

问题：

首页目前同时承担主游戏页和游戏目录页功能，方向是对的，但文案偏泛，主关键词不够聚焦。

改造文件：

- `src/app/page.tsx`

建议首页定位：

如果新站是单一游戏品牌站：

- H1：`Baseball 9`
- 副标题：`Play Baseball 9 online for free, plus hand-picked baseball and sports games.`
- 首页首屏放主游戏播放器。
- 下方内容围绕主游戏和同类游戏展开。

如果新站是泛游戏聚合站：

- H1：品牌名或明确品类词。
- 首页首屏不应只服务单个游戏。
- 使用编辑精选、分类入口、新游戏、热门游戏组织。

当前 baseball9 更适合单一主游戏站，所以首页应强化：

- Baseball 9 online。
- Baseball 9 unblocked。
- Free baseball games。
- Sports browser games。

验收标准：

- 首页 title、H1、首段、内链锚文本围绕同一主搜索意图。
- 首页不要和 `/games` 使用同一套 title / description。
- 首页正文至少 500 英文词，但不要堆关键词。

---

### P1.5 内链锚文本升级

当前优点：

- 详情页已有分类链接、标签链接、taste recommendations、more category games、trending sidebar。
- 详情页内部链接数量充足。

问题：

- 锚文本偏通用。
- 口味推荐逻辑只按分类和标签，缺少人工精选权重。
- `/popular`、`/new` 价值没有被充分利用。

改造方案：

1. `games.json` 增加 `similarGames`，用于人工指定最相关推荐。
2. 详情页推荐顺序：
   - 手动 similarGames。
   - 同主分类。
   - 同标签。
   - 全站热门。
3. 段落内链使用自然锚文本：
   - `free baseball games`
   - `browser sports games`
   - `games like Baseball 9`
   - `two-player basketball games`
4. Footer 增加核心分类，不要只固定 puzzle / arcade / sports。

验收标准：

- 主力游戏详情页内部链接不少于 20 个。
- 每个主力游戏至少被 5 个相关页面链接到。
- 分类页链接回主力游戏。
- 首页链接到最重要的 8-12 个页面。

---

## 5. P2：UI/UE 和广告体验优化

### P2.1 移动端首屏体验

问题：

移动端播放器使用 `aspect-[4/5]`，加上顶部广告后首屏可能过重。

改造文件：

- `src/components/GamePlayer.tsx`
- `src/app/page.tsx`
- `src/app/games/[slug]/page.tsx`

建议：

- 移动端优先保证标题、截图、Play 按钮进入首屏。
- 首屏前广告审核期关闭。
- 对竖屏游戏和横屏游戏增加 `orientation` 或 `aspectRatio` 字段。

数据模型建议：

```ts
aspectRatio?: '16:9' | '4:3' | '9:16' | '4:5'
preferredDevice?: 'desktop' | 'mobile' | 'both'
```

验收标准：

- iPhone 尺寸下首屏能看到 Play 按钮。
- 标题不被截断到无法识别。
- 广告不会把游戏主体推到首屏外。

---

### P2.2 播放器可访问性和稳定性

问题：

iframe 缺少 `title` 属性。

改造文件：

- `src/components/GamePlayer.tsx`

执行方案：

```tsx
<iframe
  title={`${name} game player`}
  src={embedUrl}
  className="absolute inset-0 w-full h-full"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
/>
```

附加建议：

- iframe 加载失败时显示备用提示。
- 增加 `Open in new tab` fallback。
- 记录 embed 来源，方便批量排查 X-Frame-Options / CSP 问题。

验收标准：

- iframe 有 title。
- 游戏加载失败时用户有下一步动作。
- 全屏和 theater mode 不遮挡页面元素。

---

### P2.3 评论区策略

问题：

当前评论是模拟评论，且 client component 不进入静态 HTML。它有社交证明作用，但 SEO 价值有限，并且不宜用于结构化数据。

改造方案：

- 审核期可以保留可见评论，但不要输出 Review Schema。
- 文案不要暗示评论来自真实用户，除非确实有真实提交和审核流程。
- 如果未来做真实评论，建议静态化已审核评论，进入 HTML。

验收标准：

- 结构化数据不引用模拟评论。
- 评论模块不会成为主内容之前的干扰项。
- 真实评论上线前有 moderation 机制。

---

### P2.4 PWA 和品牌资产

问题：

`manifest.json` 仍引用 `/favicon.svg`，但 `public/` 下没有 `favicon.svg`。

改造文件：

- `public/manifest.json`
- `public/sw.js`
- `src/app/layout.tsx`

执行方案：

- 移除 manifest 中不存在的 `favicon.svg`。
- 确认 `icon-192x192.png`、`icon-512x512.png`、`apple-touch-icon.png` 存在且为真实品牌图。
- `sw.js` 中 precache 列表只保留真实存在文件。
- `CACHE_NAME` 用站点 slug 和版本号。

验收标准：

- Chrome Application 面板中 manifest 无 404。
- Lighthouse PWA 检查无明显资源错误。
- favicon、apple icon、maskable icon 都能加载。

---

## 6. P3：模板化和运维增强

### P3.1 部署脚本参数化

问题：

`deploy.py` 和 `setup_deploy.py` 有硬编码路径、项目名和账号配置。`setup_deploy.py` 还有明显截断内容，不适合复用。

改造方案：

- 删除损坏脚本或重写。
- 用 `.env.local` 或命令行参数读取：
  - Cloudflare account ID。
  - Cloudflare API token。
  - Pages project name。
  - output dir。
  - site domain。

验收标准：

- 新站只需要改 `.env.local` 和 `siteConfig`。
- `npm run build && npm run deploy` 可以部署。
- GitHub Actions 项目名不再硬编码旧站。

---

### P3.2 数据质量检查脚本

新增脚本：

- `scripts/audit-games-data.ts` 或 `scripts/audit_games_data.py`

检查项：

- slug 唯一。
- embedUrl 非空。
- screenshotUrl 非空。
- 每个游戏至少 1 个 category。
- 每个游戏至少 3 个 tags。
- FAQ 至少 4 条。
- overview 不低于 120 字符。
- howToPlay 不低于 120 字符。
- 没有通用模板句式。
- 所有截图 URL 可访问。
- 所有 iframe URL 可访问或有 fallback。

验收标准：

```bash
npm run audit:data
```

输出 0 个 error 后才能发布。

---

### P3.3 SEO 产物检查脚本

新增脚本：

- `scripts/audit-static-seo.py`

检查 `out/`：

- 每页唯一 title。
- 每页唯一 description。
- 每页 canonical。
- sitemap URL 数量与实际可索引页面匹配。
- 游戏页存在 `VideoGame`。
- FAQ 页存在 `FAQPage`。
- OG image 不为空。
- 不存在 404 的 favicon / manifest / icon 引用。

验收标准：

```bash
npm run build
python3 scripts/audit-static-seo.py
```

没有 P0 error。

---

## 7. 推荐实施顺序

### 第 1 天：技术 SEO 地基

1. 新建 `src/config/site.ts`。
2. 替换分散硬编码域名、品牌名、邮箱、广告 ID。
3. 为所有页面补 metadata 和 canonical。
4. 修复 sitemap。
5. 修复详情页 JSON-LD。
6. 移除不存在的 manifest / service worker 资源引用。

交付标准：

- `npm run build` 通过。
- 产物中没有大规模重复 title / description。
- 游戏详情页 HTML 中有 `VideoGame` 和 `FAQPage`。

### 第 2 天：内容和信息架构

1. 扩展 `SEOContent` 数据模型。
2. 先重写 5 个主力游戏内容。
3. 增强分类页结构。
4. 制定 tag index / noindex 规则。
5. 增加分类 FAQ。

交付标准：

- 主力游戏页面内容明显独特。
- 分类页可以独立承接搜索流量。
- 低价值 tag 不进 sitemap。

### 第 3 天：广告和移动端体验

1. 广告默认关闭。
2. 审核期广告位降密度。
3. 关闭 preroll 或通过配置控制。
4. 调整移动端首屏。
5. iframe 增加 title 和 fallback。

交付标准：

- 移动端首屏优先显示游戏。
- Play 按钮附近无误点风险。
- 未配置广告 ID 时不加载广告脚本。

### 第 4 天：质量脚本和模板固化

1. 修复 lint。
2. 增加数据审计脚本。
3. 增加静态 SEO 审计脚本。
4. 参数化部署脚本。
5. 更新 README 的新站复制流程。

交付标准：

- `npm run lint` 通过。
- `npm run build` 通过。
- 数据审计通过。
- 静态 SEO 审计通过。
- 新站复制流程明确。

---

## 8. 最终验收清单

### 技术 SEO

- [ ] 所有可索引页面有独立 title。
- [ ] 所有可索引页面有独立 meta description。
- [ ] 所有可索引页面有 canonical。
- [ ] `/sitemap.xml` 包含所有目标索引页面。
- [ ] `/robots.txt` 指向 sitemap。
- [ ] 游戏详情页包含 `VideoGame` JSON-LD。
- [ ] FAQ 可见时才输出 `FAQPage` JSON-LD。
- [ ] 不使用虚假 `aggregateRating`。
- [ ] 不存在 404 的 favicon / manifest / OG image。

### 内容质量

- [ ] 主力游戏详情页至少 500-800 英文词。
- [ ] 普通游戏详情页至少 250-400 英文词。
- [ ] overview 和 howToPlay 不再批量套模板。
- [ ] 每个游戏 FAQ 至少 5 条。
- [ ] 每个游戏 Tips 至少 4 条。
- [ ] 分类页至少 250-400 英文词。
- [ ] 高价值 tag 页有独立介绍。

### 内链

- [ ] 首页链接到主力游戏、分类页、列表页。
- [ ] 游戏详情页链接到分类、标签、相似游戏、更多分类游戏。
- [ ] 分类页链接到主力游戏和相关分类。
- [ ] Footer 链接到真实核心分类。
- [ ] 每个主力游戏至少有 5 个内部入口。

### UI/UE

- [ ] 移动端首屏能看到游戏截图、标题和 Play 按钮。
- [ ] H1 不被严重截断。
- [ ] iframe 有 `title`。
- [ ] iframe 加载失败有 fallback。
- [ ] 全屏模式不被侧栏、广告、导航遮挡。

### 广告和合规

- [ ] 未配置 publisher ID 时不加载 AdSense。
- [ ] 审核期关闭 preroll。
- [ ] 首屏广告不过度挤压游戏内容。
- [ ] 广告不贴近 Play 按钮造成误点。
- [ ] 广告容器有固定尺寸，避免 CLS。
- [ ] About、Contact、Privacy Policy 页面完整。
- [ ] `ads.txt` 与实际 publisher ID 一致。

### 工程质量

- [ ] `npm run lint` 通过。
- [ ] `npm run build` 通过。
- [ ] 数据审计脚本通过。
- [ ] 静态 SEO 审计脚本通过。
- [ ] 部署脚本无旧路径硬编码。
- [ ] README 写清楚复制新站步骤。

---

## 9. 风险分级

### 立即影响收录和排名

- 重复 title / description。
- sitemap 缺失实际页面。
- 详情页 JSON-LD 未输出。
- 页面内容高度模板化。
- canonical 分散硬编码。

### 影响广告审核和用户体验

- 默认 AdSense publisher ID。
- 首屏广告过多。
- preroll 默认启用。
- Play 按钮附近广告密度过高。
- PWA / manifest 引用不存在资源。

### 影响模板复用效率

- 品牌和域名分散硬编码。
- 部署脚本硬编码。
- 没有数据质量检查。
- 没有静态 SEO 产物检查。

---

## 10. 推荐文件改造地图

| 目标 | 文件 |
| --- | --- |
| 统一站点配置 | `src/config/site.ts` |
| 全站 metadata / AdSense / JSON-LD | `src/app/layout.tsx` |
| 首页搜索意图 | `src/app/page.tsx` |
| 游戏页 metadata / JSON-LD / 内容结构 | `src/app/games/[slug]/page.tsx` |
| 分类页 SEO | `src/app/c/[category]/page.tsx` |
| 标签页 SEO / noindex | `src/app/tag/[tag]/page.tsx` |
| sitemap 完整性 | `src/app/sitemap.ts` |
| robots | `src/app/robots.ts` |
| 播放器体验 | `src/components/GamePlayer.tsx` |
| 广告控制 | `src/components/AdUnit.tsx` |
| 品牌导航 | `src/components/Sidebar.tsx` |
| Footer 内链 | `src/components/Footer.tsx` |
| 数据模型 | `src/types/index.ts` |
| 游戏内容 | `src/data/games.json` |
| PWA | `public/manifest.json`, `public/sw.js` |
| 部署 | `.github/workflows/deploy.yml`, `deploy.py` |
| 数据审计 | `scripts/audit-games-data.*` |
| 静态 SEO 审计 | `scripts/audit-static-seo.*` |

---

## 11. 模板完成标准

完成上述改造后，这个模板才适合作为新的 H5 游戏站基座。完成标准不是“页面能打开”，而是：

- 复制新站时不容易漏改品牌、域名、广告和 sitemap。
- 每个可索引页面都有明确搜索意图。
- 主力游戏详情页有足够独特内容。
- 结构化数据真实出现在 HTML 中。
- 广告体验不会影响审核和首屏游玩。
- 构建、lint、数据审计、SEO 产物审计全部通过。

只有达到这些标准，后续批量创建新 H5 游戏站才不会把技术债、重复内容和广告风险一起复制出去。
