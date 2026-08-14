# BlockSlide SEO 流量获取执行路线图

> **目标：** 3 个月内实现 Google 可发现性，核心游戏页面进入搜索结果 Top 10
>
> **起点：** 16 款游戏、基础 SEO 结构已完成、详情页布局对齐
>
> **核心策略：** 精品内容，而非海量长尾。靠每款游戏的独特内容厚度建立壁垒。

---

## 执行概览

```
Phase 1 🔴 → Phase 2 🟡 → Phase 3 🟢 → Phase 4 🔵
  (地基)       (内容)       (内链)       (性能)
  1-2天        2-4天        1-2天        1天
```

---

## 🔴 Phase 1：技术 SEO 地基

> **优先级：上线前必做。** 缺失任一项，搜索引擎无法正确理解网站。

### Task 1.1 — JSON-LD Structured Data

**文件：** `src/app/games/[slug]/page.tsx`

在 `<head>` 中注入两段 Schema：

**VideoGame Schema：** 游戏名、描述、评分、游玩次数、封面图、平台
**FAQPage Schema：** 利用已有 FAQ 数据生成手风琴富文本摘要

**验证：** Rich Results Test 工具识别到 "VideoGame" 和 "FAQ" 两个结构化数据类型

---

### Task 1.2 — Per-Game Metadata

**文件：** `src/app/games/[slug]/page.tsx`

导出 `generateMetadata()`：
- `title` = 游戏 H1（模板自动拼接 ` | BlockSlide`）
- `description` = 游戏专属 `meta_description`
- `openGraph` = 封面图 + 标题 + 描述
- `canonical` = 游戏页面规范 URL

**验证：** `view-source` 中 `<title>` 和 `<meta name="description">` 为游戏专属内容

---

### Task 1.3 — Sitemap

**文件：** `src/app/sitemap.ts`（新建）

包含：
- `/` (priority 1.0)
- `/games` (priority 0.9)
- `/games/*` (priority 0.8, 每个游戏)
- `/c/*` (priority 0.5, 每个分类)
- `/tag/*` (priority 0.4, 每个标签)

**验证：** `GET /sitemap.xml` 返回 200，所有 URL 在列

---

### Task 1.4 — robots.txt

**文件：** `src/app/robots.ts`（新建）

- Allow: `/`
- Disallow: `/api/`
- Sitemap: 指向 sitemap.xml 完整 URL

**验证：** `GET /robots.txt` 返回 200

---

## 🟡 Phase 2：内容深度强化

> **优先级：排名关键。** Google E-E-A-T 评分依赖独特内容厚度。

### Task 2.1 — 扩展数据模型

**文件：** `src/types/index.ts`

`SEOContent` 新增字段：
- `tipsAndTricks: string[]` — 每游戏 4 条独立技巧
- `whyPlayHere: { title: string; desc: string }[]` — 4 张卖点卡片
- `funFacts?: string` — "你知道吗" 趣味知识（差异化内容）
- `difficulty?: "Easy" | "Medium" | "Hard"`
- `bestFor?: string` — "Quick breaks / Deep focus / Kids"
- `similarGames?: string[]` — 手动挑选替代算法推荐

---

### Task 2.2 — 详情页数据驱动

**文件：** `src/app/games/[slug]/page.tsx`

- Tips & Tricks 段落 → 用 `game.seoContent.tipsAndTricks` 驱动，无数据时 fallback 通用版
- Why Play Here 卡片 → 用 `game.seoContent.whyPlayHere` 驱动
- Fun Facts → 如果有数据则渲染一个 callout box
- Difficulty / Best For → 在 info card 中展示

---

### Task 2.3 — 种子页面数据增强

**只做 5 款游戏，做到极致：**

选出搜索量最大的 5 款（block-slide, geometry-dash, slope, drift-hunters, basketball-stars 等）。

每款：
- `overview` 扩写到 150-200 字
- `tipsAndTricks` 4 条原创
- `whyPlayHere` 至少 1 条与游戏直接相关
- `difficulty` / `bestFor` / `funFacts` 各一行
- FAQ 补到 5-6 条

---

## 🟢 Phase 3：内链策略

> **优先级：影响收录速度。** 内链是唯一完全可控的 PageRank 分配机制。

### Task 3.1 — 游戏详情页「Read Next」模块

**位置：** FAQ 之后，页面底部

6 款相关游戏卡片（2×3 网格）。底部链接权重高于侧栏。

---

### Task 3.2 — 首页内容模块增强

- 「Trending Now」— 按 plays 排序 Top 8
- 「Browse by Category」— 横向分类入口
- 「New & Updated」— 最新游戏

---

### Task 3.3 — Category 页面增强

`/c/puzzle-game` 等分类页：
- 独有 H1 + 100 字描述
- 最热门 3 款 + 全部列表
- 底部 "Also browse: Arcade, Action..." 交叉链接

---

## 🔵 Phase 4：性能与体验

### Task 4.1 — 关键图片优化

- 首屏游戏截图：`<Image priority>`
- 视口以下图片：`loading="lazy"`

### Task 4.2 — 资源预连接

```html
<link rel="preconnect" href="https://img.qizhilu.org" />
<link rel="preconnect" href="https://azgames.io" />
```

### Task 4.3 — Lighthouse 验证

目标：Performance ≥ 90, SEO = 100

---

## 验证清单

上线后逐条验证：

- [ ] `view-source` 中存在 `application/ld+json`（两段 Schema）
- [ ] `<title>` 为游戏专属标题
- [ ] `<meta name="description">` 为游戏专属描述
- [ ] `<meta property="og:image">` 存在
- [ ] `/sitemap.xml` 返回 200，包含所有 URL
- [ ] `/robots.txt` 返回 200
- [ ] `/games/block-slide` 返回 200（非重定向/404）
- [ ] Google Search Console 提交 sitemap
- [ ] Rich Results Test 识别到 FAQ 和 VideoGame Schema
- [ ] Lighthouse SEO = 100, Performance ≥ 90

---

## 流量预期时间线

```
Month 1-2: 沙盒期
  → 页面被索引，但排名很低（第 3-5 页）

Month 3-4: 起步期
  → 长尾关键词开始进入 Top 20（"block slide game free online" 等）
  → 域名获得初始权重

Month 5-6: 增长期
  → 核心游戏名开始进入 Top 10
  → 日 UV 从 0 → 100-500

Month 6+:  扩展期
  → 增加更多游戏，复用内容模式
  → 长尾词覆盖量指数增长
```

> **H5 游戏站不是"建站即流量"。前 3 个月看似无效果是正常的。**
>
> 关键是确保每个细节不丢分：Schema 全、Sitemap 全、内容深、速度快、内链密。

---

## 相关文件

| 文件 | 说明 |
|------|------|
| `AGENTS.md` | 项目上下文、技术规范、决策日志 |
| `ROADMAP.md` | 本文件 — SEO 执行路线图 |
| `src/data/games.json` | 游戏数据源（未来新增字段在此扩展） |
| `src/types/index.ts` | 类型定义（未来扩展 SEOContent） |
| `src/app/games/[slug]/page.tsx` | 详情页核心文件 |
