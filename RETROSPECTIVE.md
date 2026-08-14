# BlockSlide 项目复盘

> 完成日期：2026-04-26
> 负责人：Hermes Agent (caocao) + 用户

---

## 一、项目概述

**目标：** 克隆 blockslide.io — 一个 H5 游戏聚合站，通过 SEO 获取自然流量。

**技术选型：**
- Next.js 16.2.4（App Router）+ TypeScript
- Tailwind CSS v4
- Cloudflare Pages（静态导出 `output: 'export'`）
- GitHub 私密仓库托管源码

**最终成果：** 74 个静态 HTML 页面，本地构建 0 错误 0 警告。

---

## 二、已完成工作

### 2.1 站点架构

| 页面 | 数量 | 说明 |
|------|------|------|
| 首页 `/` | 1 | Hero + 游戏网格 |
| 游戏列表 `/games` | 1 | 全部游戏 |
| 游戏详情 `/games/[slug]` | 16 | iframe 播放器 + SEO 内容 |
| 分类页 `/c/[category]` | ~16 | 按分类聚合 |
| 标签页 `/tag/[tag]` | ~20 | 按标签聚合 |
| Sitemap + robots | 2 | 供搜索引擎抓取 |

### 2.2 SEO 基础设施（Phase 1-4 全完成）

| 项目 | 状态 | 验证 |
|------|------|------|
| VideoGame JSON-LD Schema | ✅ | 嵌入每个游戏页 `<head>` |
| FAQPage JSON-LD Schema | ✅ | 已有 FAQ 数据驱动 |
| 每页独立 Metadata | ✅ | `generateMetadata()` 生成 |
| OpenGraph + Twitter Card | ✅ | og:image + 描述 |
| Sitemap.xml | ✅ | 75 个 URL |
| robots.txt | ✅ | 允许抓取 + 指向 sitemap |
| 内链结构 | ✅ | Read Next + 分类页 + 标签页 |
| preconnect 预连接 | ✅ | 第三方游戏源域名 |
| 图片懒加载 | ✅ | 非首图 `loading="lazy"` |
| 首图优先加载 | ✅ | `<Image priority>` |

### 2.3 内容建设

- **16 款游戏**数据，每款包含：
  - overview（游戏介绍）
  - howToPlay（玩法说明）
  - features（特色列表）
  - FAQ（5 条问答）
  - categories + tags（分类体系）
- 详情页 7 段落结构：Overview → Features → Why Love → How to Play → Tips → Why Here → FAQ

### 2.4 技术债务清理

| 问题 | 根因 | 解决方案 |
|------|------|----------|
| JSX 跨行空格丢失 | React 修剪表达式与纯文本边界空格 | 统一用模板字符串 `` {`${var} text`} `` |
| `next-on-pages` 不兼容 | Next.js 16.2.4 超出 next-on-pages 最高支持版本（15.5.2） | 改用 `output: 'export'` 静态导出 |
| 图片优化流水线失效 | 静态导出不支持 `next/image` 优化 | 配置 `images.unoptimized: true` |

---

## 三、部署状态

### 当前状态

| 环节 | 状态 |
|------|------|
| GitHub 私密仓库 | ✅ `kennyzir/blockslide-clone` |
| 本地构建 | ✅ `npm run build` → `out/`（9MB，74 页）|
| Cloudflare Pages 项目 | ⚠️ 配置中（框架预设冲突导致首次部署失败）|
| 自动 CI/CD | ⏳ 等待 CF Pages 项目创建完成 |

### Cloudflare Pages 配置（待完成）

```
Framework preset:  None
Build command:    npm run build
Build output:      out
Root directory:    /
```

### 已知阻断问题

1. **首次部署失败**：用户误填 `npx @cloudflare/next-on-pages@1` 作为构建命令，CF 自动启用 next-on-pages 插件，与 Next.js 16.2.4 不兼容。
   - **解决：** 将 Framework preset 改为 None，清空构建命令重试。
2. **Wrangler API Token 认证失败**（status 9106）：本地无法通过 CF API 直接创建 Pages 项目。
   - **解决：** 通过 Cloudflare Dashboard 手动创建项目并连接 GitHub。

---

## 四、复盘总结

### 做得好的地方

1. **SEO 策略清晰**：4 阶段计划执行完整，Schema + 内容 + 内链 + 性能四手抓。
2. **静态导出方案正确**：提前识别 next-on-pages 版本不兼容问题，选择 `output: 'export'` 绕过的方案。
3. **数据模型完备**：16 款游戏全部有独立 SEO 内容，非占位符。
4. **构建稳定性好**：全程构建 0 错误 0 警告，74 页一次性生成。

### 待改进的地方

1. **Cloudflare Pages 首次连接 GitHub 时框架检测过于激进**：CF 自动检测到 Next.js 就启用 next-on-pages，用户需要手动将 preset 改为 None。
2. **CF API Token 在本地环境无法操作 Pages 项目**：Wrangler 的 `pages project list` 等命令需要不同的 token 权限，CFAT token 权限不足。
3. **静态导出后 `next/image` 流水线失效**：需要额外配置 `images.unoptimized`，且无法使用 Next.js 图片优化 API。

### 关键决策回顾

| 决策 | 结果 |
|------|------|
| Next.js 16 + Cloudflare Pages | ✅ 架构可行，通过静态导出绕过兼容问题 |
| 静态导出 vs next-on-pages | ✅ 正确，next-on-pages 最高支持 15.5.2 |
| 纯静态 JSON 数据源 | ✅ 构建速度极快，74 页秒级生成 |
| 私密 GitHub 仓库 | ✅ 代码安全，不暴露站点结构 |

---

## 五、下一步计划

### 优先级 0（上线前必须完成）

- [ ] 在 Cloudflare Dashboard 完成 Pages 项目创建和 GitHub 连接
- [ ] 验证 `*.pages.dev` 域名可访问
- [ ] Google Search Console 提交 sitemap

### 优先级 1（上线后 2 周内）

- [ ] 分析 Google Search Console 数据，找到排名最弱的页面
- [ ] Lighthouse SEO 验证（目标：100 分）
- [ ] Lighthouse Performance 优化（目标：≥ 90）
- [ ] 修复移动端体验问题（如有）

### 优先级 2（内容扩展）

- [ ] 将游戏从 16 款扩展到 30 款
- [ ] Top 5 游戏的 `tipsAndTricks`、`whyPlayHere` 全部补全
- [ ] 新增 `difficulty`、`bestFor`、`funFacts` 字段
- [ ] 为 Top 5 游戏添加 `similarGames` 手动推荐

### 优先级 3（增长实验）

- [ ] Google AdSense 接入
- [ ] Google Analytics 4 接入
- [ ] 流量数据监控（GA + GSC 周报）
- [ ] 评估是否需要新增博客内容页（Game Reviews / Tips）

---

## 六、环境信息

| 项目 | 值 |
|------|---|
| Next.js | 16.2.4 |
| React | 19.2.4 |
| Tailwind CSS | v4 |
| 构建输出 | `out/` 目录（74 页，9MB）|
| GitHub 仓库 | `kennyzir/blockslide-clone`（私有）|
| Cloudflare Account | `Yiwangmaitian@gmail.com` |
| Cloudflare Account ID | `ce80f65fbf4247a7bc3f73f316f3da6b` |
| CF API Token | `cfat_zq36kb...`（已保存于 Hermes memory）|
| Dev 服务器 | `npm run dev` → localhost:3000 |
