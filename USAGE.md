<<<<<<< HEAD
# 北川哈气物 Perpage 使用手册

## 目录

- [项目结构](#项目结构)
- [技术栈](#技术栈)
- [本地运行](#本地运行)
- [模板体系](#模板体系)
  - [Partials 公共片段](#partials-公共片段)
  - [页面数据 pageData](#页面数据-pagedata)
  - [页面分类](#页面分类)
  - [新建内容页](#新建内容页)
  - [新建带目录页](#新建带目录页)
- [链接 / 联系方式](#链接--联系方式)
  - [添加社交媒体图标（首页 Hero）](#添加社交媒体图标首页-hero)
  - [添加联系方式卡片（Links 页）](#添加联系方式卡片links-页)
- [微信二维码弹窗](#微信二维码弹窗)
  - [弹窗用途](#弹窗用途)
  - [替换二维码图片](#替换二维码图片)
  - [修改交互方式](#修改交互方式)
- [Google Analytics](#google-analytics)
  - [更换 Measurement ID](#更换-measurement-id)
  - [合规说明](#合规说明)
- [图标体系](#图标体系)
  - [Font Awesome（主力）](#font-awesome主力)
  - [iconfont（中文平台补充）](#iconfont中文平台补充)
  - [内联 SVG（兜底）](#内联-svg兜底)
- [主题切换](#主题切换)
- [SEO 配置](#seo-配置)
- [404 页面处理](#404-页面处理)
- [部署（Cloudflare Pages）](#部署cloudflare-pages)

***

## 项目结构

```
perpage-disconnect/
├── partials/                    # Handlebars 公共片段
│   ├── head.hbs                 # <head> 中的 meta/OG/preload
│   ├── top-bar.hbs              # 顶部导航栏
│   ├── footer.hbs               # 页脚
│   ├── sidebar.hbs              # 侧边栏（含 sidebar-footer）
│   ├── cookie-banner.hbs        # Cookie 同意横幅
│   └── wechat-popup.hbs         # 微信二维码弹窗
├── public/                      # 静态资源（原样复制到 dist/）
│   ├── css/
│   │   ├── style.css            # 全局样式
│   │   └── 404.css              # 404 页面专属样式
│   ├── js/
│   │   ├── main.js              # 全局脚本（主题/GA/Cookie/微信弹窗/TOC）
│   │   └── 404.js               # 404 页面专属脚本
│   ├── robots.txt               # 搜索引擎爬虫规则
│   └── sitemap.xml              # 站点地图
├── index.html                   # 首页（Handlebars 模板）
├── about.html                   # 关于
├── projects.html                # 项目展示
├── links.html                   # 链接 / 联系方式
├── privacy.html                 # 隐私政策
├── statements.html              # 网站声明
├── AIGC-Statement.html          # 生成式人工智能使用声明
├── 404.html                     # 自定义 404 页面
├── vite.config.js               # Vite 构建配置 + pageData + 404 插件
├── package.json                 # 项目依赖与脚本
├── .gitignore                   # Git 忽略规则
├── LICENSE
├── README.md
└── USAGE.md                     # 本文件
```

构建后生成 `dist/` 目录，结构等同于纯静态站点，可直接部署。

***

## 技术栈

| 组件                     | 说明                        |
| ---------------------- | ------------------------- |
| Vite 6                 | 构建工具，多页面应用模式              |
| vite-plugin-handlebars | 模板引擎，支持 partials 和页面级变量   |
| Font Awesome 6         | 图标库（jsDelirror CDN）       |
| Noto Sans SC           | 主字体（上海交大 Google Fonts 镜像） |
| Google Analytics 4     | 流量分析（按 Cookie 同意条件加载）     |
| 一言 Hitokoto API        | 首页随机句子                    |

***

## 本地运行

```bash
# 安装依赖
npm install

# 开发模式（热更新，支持 Handlebars 编译）
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

开发服务器默认 `http://localhost:5173/`，预览服务器默认 `http://localhost:4173/`。

### 验证 404 页面

访问 `http://localhost:4173/任意不存在的路径` 即可看到自定义 404 页面。404 处理由 `vite.config.js` 中的 `serve404()` 插件实现，开发模式和预览模式均生效。

***

## 模板体系

项目使用 Vite + Handlebars 实现模板化，公共部分通过 partials 解耦，页面差异通过 pageData 变量管理。

### Partials 公共片段

| Partial               | 文件                           | 用途                              |
| --------------------- | ---------------------------- | ------------------------------- |
| `{{> head}}`          | `partials/head.hbs`          | `<head>` 中的 meta 标签、OG 信息、字体预加载 |
| `{{> top-bar}}`       | `partials/top-bar.hbs`       | 顶部导航栏（Logo + MENU 按钮）           |
| `{{> footer}}`        | `partials/footer.hbs`        | 页脚（版权、ICP、声明链接）                 |
| `{{> sidebar}}`       | `partials/sidebar.hbs`       | 侧边栏（导航 + sidebar-footer）        |
| `{{> cookie-banner}}` | `partials/cookie-banner.hbs` | Cookie 同意横幅                     |
| `{{> wechat-popup}}`  | `partials/wechat-popup.hbs`  | 微信二维码弹窗                         |

修改 partial 文件后，所有引用该 partial 的页面自动更新，无需逐页修改。

### 页面数据 pageData

每个页面的差异化信息集中在 `vite.config.js` 的 `pageData` 对象中管理：

```js
const pageData = {
  '/index.html': {
    title: '北川哈气物',              // <title> 和 og:title
    description: '北川哈气物 - ...',   // <meta name="description"> 和 og:description
    url: 'https://chatongxue.top/',   // <link rel="canonical"> 和 og:url
    bodyClass: 'home-page',           // <body> 的 class
  },
  '/about.html': {
    title: '关于我 - 北川哈气物',
    description: '了解北川哈气物。',
    url: 'https://chatongxue.top/about.html',
    bodyClass: 'content-page-mode',
    currentPage: 'About',             // 面包屑当前页名称
    contentTitle: 'About',            // <h1> 标题
  },
  // ...
}
```

在 HTML 模板中通过 `{{变量名}}` 引用：

```html
<title>{{title}}</title>
<meta name="description" content="{{description}}">
<body class="{{bodyClass}}">
<span class="current">{{currentPage}}</span>
```

### 页面分类

| 类型   | 页面                                        | 特点                      |
| ---- | ----------------------------------------- | ----------------------- |
| 首页   | `index.html`                              | Hero + 一言 + 底部网格 + 社交图标 |
| 内容页  | `about.html` `projects.html` `links.html` | 面包屑 + 标题 + 正文           |
| 带目录页 | `privacy.html` `AIGC-Statement.html`      | 面包屑 + 标题 + TOC 目录 + 正文  |
| 声明页  | `statements.html`                         | 面包屑 + 标题 + 正文（无 TOC）    |
| 特殊页  | `404.html`                                | 独立 CSS/JS，红色主题，横向滚动动画   |

### 新建内容页

1. 在 `vite.config.js` 的 `pageData` 中添加新页面数据：

```js
'/new-page.html': {
  title: '新页面 - 北川哈气物',
  description: '新页面的描述。',
  url: 'https://chatongxue.top/new-page.html',
  bodyClass: 'content-page-mode',
  currentPage: 'New Page',
  contentTitle: 'New Page',
},
```

1. 在 `vite.config.js` 的 `rollupOptions.input` 中添加入口：

```js
newpage: resolve(__dirname, 'new-page.html'),
```

1. 创建 `new-page.html`，使用 partials 组装：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    {{> head}}
    <link rel="stylesheet" href="/css/style.css">
</head>
<body id="pageBody" class="{{bodyClass}}">
    <div id="page-progress"></div>
    <div class="hero-bg"></div>
    <div class="overlay" onclick="toggleSidebar()"></div>

    <div class="page-container content-page">
        {{> top-bar}}

        <main class="content-main">
            <nav class="breadcrumb">
                <a href="index.html">Home</a>
                <span class="separator">/</span>
                <span class="current">{{currentPage}}</span>
            </nav>

            <h1 class="content-title">{{contentTitle}}</h1>

            <div class="content-body">
                <p>在这里填入内容。</p>
            </div>
        </main>

        {{> footer}}
    </div>

    {{> sidebar}}

    <script defer src="/js/main.js"></script>
</body>
</html>
```

1. 在 `public/sitemap.xml` 中添加新 URL

### 新建带目录页

在内容页基础上额外操作：

1. 给 `.content-main` 添加 `content-main--with-toc` 类
2. 将 `.content-body` 包裹在 `.content-layout` 中
3. 在 `.content-layout` 末尾添加 `<nav class="toc">` 目录导航
4. 给每个 `<h2>` 添加唯一 `id`（如 `id="sec-overview"`）
5. TOC 的 `<a>` 链接指向对应 `#sec-xxx`

TOC 的滚动高亮由 `main.js` 中的 `initTOC()` 自动处理（使用 IntersectionObserver）。

***

## 链接 / 联系方式

### 添加社交媒体图标（首页 Hero）

位置：`index.html` 的 `.hero-social` 容器内。

使用 Font Awesome 图标：

```html
<a href="https://你的链接" target="_blank" rel="noopener noreferrer"
   class="social-icon" aria-label="平台名" title="平台名">
    <i class="fa-brands fa-平台图标类名"></i>
</a>
```

可用的 FA 图标类名：

| 平台        | FA class                  |
| --------- | ------------------------- |
| GitHub    | `fa-brands fa-github`     |
| YouTube   | `fa-brands fa-youtube`    |
| Telegram  | `fa-brands fa-telegram`   |
| Twitter/X | `fa-brands fa-x-twitter`  |
| Facebook  | `fa-brands fa-facebook-f` |
| 微博        | `fa-brands fa-weibo`      |
| Bilibili  | `fa-brands fa-bilibili`   |
| 抖音        | `fa-brands fa-tiktok`     |
| Email     | `fa-solid fa-envelope`    |

### 添加联系方式卡片（Links 页）

位置：`links.html` 的 `.contact-cards` 容器内。

```html
<a href="https://你的链接" target="_blank" rel="noopener noreferrer" class="contact-card">
    <span class="contact-card-icon"><i class="fa-brands fa-平台图标类名"></i></span>
    <span class="contact-card-name">平台名</span>
    <span class="contact-card-handle">@用户名或说明</span>
</a>
```

卡片自动使用 flex 栅格布局：

- 默认双列
- ≥900px 三列
- ≥1200px 四列

***

## 微信二维码弹窗

### 弹窗用途

首页和 Links 页的微信图标点击后弹出居中弹窗，内含两个二维码：

- 微信公众号
- 微信视频号

弹窗弹出后图片才下载（使用 `loading="lazy"` + CSS 隐藏控制），首屏不加载，不浪费带宽。

二维码图片路径统一在 `partials/wechat-popup.hbs` 中管理，修改一处即可同步所有页面。

### 替换二维码图片

编辑 `partials/wechat-popup.hbs`，修改两处 `src`：

```html
<img src="https://img-cfr2.chatongxue.top/wechat-qr-mf.webp" alt="微信公众号二维码" ...>
<img src="https://img-cfr2.chatongxue.top/wechat-qr-channel.webp" alt="微信视频号二维码" ...>
```

图片尺寸由 CSS 控制，非正方形二维码自动适应（`max-height` 限制纵向拉长）。

### 修改交互方式

交互逻辑由 `main.js` 中的 WeChat QR 模块控制。触发元素的交互模式通过 `data-wechat-trigger` 属性决定：

| 属性值     | 行为                            |
| ------- | ----------------------------- |
| 无（默认）   | 桌面端 hover 弹出，移动端 click toggle |
| `click` | 全设备（含桌面）click toggle          |

```html
<!-- hover 模式 -->
<span class="social-icon wechat-trigger">...</span>

<!-- click 模式 -->
<span class="social-icon wechat-trigger" data-wechat-trigger="click">...</span>
```

关闭方式：

1. 点击半透明遮罩
2. 点击右上角 × 按钮
3. 移动端 / clickOnly 模式下再次点击触发元素
4. 按下 ESC 键
5. hover 模式下鼠标完全移出 0.15s 后自动关闭

***

## Google Analytics

GA4 通过 `main.js` 动态注入，存在 **三重防护** 确保仅在用户同意后运行：

1. Consent Mode v2 默认 `analytics_storage: 'denied'`
2. 用户未点击「允许全部」前，gtag.js 脚本不注入
3. 用户选择「仅必要」后，清除所有 GA cookies

### 更换 Measurement ID

在 `public/js/main.js` 中找到：

```js
const GA_MEASUREMENT_ID = 'G-QXMV93M6HE';
```

替换为你的 GA4 Measurement ID 即可。不需要修改任何 HTML。

### 合规说明

- IP 匿名化已开启（`anonymize_ip: true`）
- 数据保留期 14 个月
- Google Signals 已禁用
- Cookie Banner 显示隐私政策链接
- 隐私政策页（`privacy.html`）包含 GDPR、CCPA、中国网络安全法三套法规说明
- 主题偏好仅在用户选择「允许全部 Cookie」时持久化到 localStorage，选择「仅必要」时自动清除

***

## 图标体系

### Font Awesome（主力）

- **CDN**：`cdn.jsdmirror.com`（大陆镜像，jsDelivr 在国内慢）
- **版本**：Font Awesome Free 6
- **使用**：`<i class="fa-brands fa-图标名"></i>` 或 `<i class="fa-solid fa-图标名"></i>`
- **覆盖**：国际主流平台（GitHub, YouTube, Telegram, X/Twitter, Facebook, TikTok 等）
- **引入页面**：`index.html`、`links.html`、`privacy.html`（按需引入，不使用的页面不加载）

### iconfont（中文平台补充）

- **CDN**：`at.alicdn.com`（阿里图标库）
- **用途**：补充 Font Awesome 不包含的中文平台图标
- **接入方法**：
  1. 打开 [iconfont.cn](https://www.iconfont.cn)，创建/登录项目
  2. 搜索并添加所需图标（今日头条、小红书、知乎、CSDN 等）
  3. 选择 Font Class 方式，复制 CDN 链接
  4. 替换 `links.html` 中 iconfont 的 `<link>` href
- **调用**：`<i class="iconfont icon-类名"></i>`（类名在 iconfont 项目中自定义）

**注意**：iconfont 上的部分图标可能是上传者导入的位图而非矢量，如果出现模糊或锯齿，改用内联 SVG 兜底。

### 内联 SVG（兜底）

当 iconfont 图标质量不佳时，用内联 SVG 替代。CSS 已预置 `.svg-icon` 基础样式，放入 `.social-icon` 或 `.contact-card-icon` 容器中会自动适配尺寸和颜色。

```html
<span class="contact-card-icon">
    <svg class="svg-icon" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
        <!-- 在这里放入 SVG path -->
    </svg>
</span>
```

***

## 主题切换

- 主题偏好存储在 `localStorage.themeMode`
- 切换按钮在 sidebar 顶部（`☽ 模式`）
- 三档：浅色 / 深色 / 自动（跟随系统）
- **GDPR 合规**：仅在用户选择「允许全部 Cookie」时持久化主题偏好；选择「仅必要」时自动清除 `themeMode`，下次访问使用系统默认

***

## SEO 配置

### 页面 Meta 管理

每个页面的 title、description、canonical URL、OG 信息统一在 `vite.config.js` 的 `pageData` 中管理，构建时自动注入到 `{{> head}}` partial。

添加新页面时，只需在 `pageData` 中补充对应条目，无需手动编写 meta 标签。

### 排除页

- `404.html` — `noindex, nofollow`（404 页，不让搜索引擎收录）
- `robots.txt` 中已声明排除 `/404.html`

### 新增页面后

1. 在 `vite.config.js` 的 `pageData` 中添加新页面数据
2. 在 `public/sitemap.xml` 中添加新 URL
3. 侧边栏和页脚链接通过修改 `partials/sidebar.hbs` 和 `partials/footer.hbs` 自动同步所有页面

***

## 404 页面处理

404 页面使用独立的 CSS（`404.css`）和 JS（`404.js`），不引入公共的 `style.css` 和 `main.js`，避免样式冲突和不必要的资源加载。

### 开发 / 预览模式

由 `vite.config.js` 中的 `serve404()` Vite 插件处理：

- **dev server**：将无扩展名的路径重写为 `/404.html`
- **preview server**：拦截 sirv 返回的 404 响应，替换为 `dist/404.html` 内容并保持 HTTP 404 状态码

### 生产部署

Cloudflare Pages 等托管平台支持自定义 404 页面，只需在输出目录中放置 `404.html` 即可自动生效。

***

## 部署（Cloudflare Pages）

1. 将仓库推送到 GitHub
2. 在 Cloudflare Pages 中连接仓库
3. 构建配置：
   - 框架预设：**Vite**
   - 构建命令：`npm run build`
   - 输出目录：`dist`
4. 在 Pages 设置中绑定自定义域名 `chatongxue.top`
5. Cloudflare Pages 会自动将 `dist/404.html` 作为 404 回退页面

> **提示**：构建产物 `dist/` 目录中的所有资源引用均使用绝对路径（以 `/` 开头），不会因子路径深度而丢失样式和脚本。

=======
# 使用手册（v2 重构版）

> 目标：5 分钟跑起来，改一个文件就能上线。

---

## 一、快速上线

### 1. 本地跑起来

```bash
npm install    # 安装依赖（只需一次）
npm run dev    # 启动开发服务器 → http://localhost:5173
```

看到首页就说明跑通了。`npm run build` 构建产物在 `dist/`，`npm run preview` 预览构建结果。

---

### 2. 改成你自己的网站（最小改动清单）

v2 的核心改进：**站点全局信息集中在 `src/data/site.js`，改一处全站生效。**

#### ① src/data/site.js — 改站名、域名、版权、OG 图片

```js
export const site = {
  name: '你的网站名',                              // ← 改
  domain: 'https://你的域名.com',                   // ← 改
  copyright: '©2020 - 2026 你的名字 All Rights Reserved', // ← 改
  ogImage: 'https://你的CDN/og-image.webp',        // ← 改
  icp: '你的ICP备案号',                             // ← 改
};
```

**改这一个文件 → top-bar、footer、sidebar、head 全部自动同步。**

#### ② src/data/pages.js — 改各页面标题和描述

把每个页面条目里的 `title`、`description`、`url` 换成你自己的。`bodyClass`、`currentPage`、`contentTitle` 一般不需要改。

#### ③ index.html — 改首页社交图标链接

找到 `.hero-social` 容器，替换 `<a href="...">` 的链接地址。不需要的平台删掉即可。

#### ④ links.html — 改联系方式

把 `.contact-cards` 里的每个 `<a>` 换成你自己的链接和用户名。

#### ⑤ main.js — 换 GA4 测量 ID（选做）

`public/js/main.js` 顶部常量：
```js
const GA_MEASUREMENT_ID = 'G-你的测量ID';
```

---

### 3. 构建并部署

```bash
npm run build          # 生成 dist/
```

把 `dist/` 部署到 Cloudflare Pages 或其他静态托管平台。Cloudflare Pages 配置：
- 框架预设：**Vite**
- 构建命令：`npm run build`
- 输出目录：`dist`

---

## 二、v2 与原版的区别

| 改进项 | 原版 (portfolio) | v2 (portfolio-v2) |
|--------|:---:|:---:|
| 站点全局变量 | 无，站名散落在 3 个文件中 | `src/data/site.js` 一处改全站生效 |
| 页面数据位置 | `vite.config.js` 内 168 行 | `src/data/pages.js` 独立文件 |
| 404 插件位置 | `vite.config.js` 内 40 行 | `src/plugins/serve-404.js` 独立文件 |
| vite.config.js | 238 行（配置+数据+插件混一起） | 34 行（纯构建声明） |
| 首页 top-bar | 内联 HTML | 使用 `{{> top-bar}}`，改 partial 全站同步 |
| 内容页骨架 | 6 个页面各自重复 35 行骨架 | `layout-top.hbs` + `layout-bottom.hbs` 包裹 |
| main.js 结构 | 单文件 639 行 | 单文件，按功能分区注释组织 |
| partial 硬编码 | top-bar/footer/sidebar/head 各有硬编码 | 全部变量化 `{{siteName}}` `{{copyright}}` `{{ogImage}}` |

---

## 三、模块详解

### 模块 1：数据层（src/data/）

**涉及文件**：

| 文件 | 作用 |
|------|------|
| `src/data/site.js` | 全站共享变量：站名、域名、版权、OG 图、ICP |
| `src/data/pages.js` | 每页 title/description/url 等，构建时自动注入 site 变量 |

site.js 的每一个字段都会作为 Handlebars 变量传入所有页面和 partial：

| 变量 | 来源 |
|------|------|
| `{{siteName}}` | `site.name` |
| `{{domain}}` | `site.domain` |
| `{{copyright}}` | `site.copyright` |
| `{{ogImage}}` | `site.ogImage` |
| `{{icp}}` | `site.icp` |

**新增页面**：在 `pages.js` 的 `rawPages` 中添加条目 + 在 `vite.config.js` 的 `rollupOptions.input` 中添加入口 + 创建 HTML。

---

### 模块 2：布局层（partials/）

**涉及文件**：

| 文件 | 作用 |
|------|------|
| `partials/head.hbs` | `<head>` meta/OG/字体预加载（OG 图来自 `{{ogImage}}`） |
| `partials/top-bar.hbs` | 顶部导航栏（logo 文字来自 `{{siteName}}`） |
| `partials/footer.hbs` | 页脚（版权来自 `{{copyright}}`，ICP 来自 `{{icp}}`） |
| `partials/sidebar.hbs` | 侧边栏导航 + 版权 |
| `partials/layout-top.hbs` | 内容页上半部骨架（doctype → `<h1>`） |
| `partials/layout-bottom.hbs` | 内容页下半部骨架（`</main>` → `</html>`） |
| `partials/cookie-banner.hbs` | Cookie 同意横幅 |
| `partials/wechat-popup.hbs` | 微信二维码弹窗 |
| `partials/external-link-modal.hbs` | 外站跳转确认弹窗 |

#### layout-top / layout-bottom 用法

**普通内容页**（about / projects / statements）：
```html
{{> layout-top}}
            <div class="content-body">
                <p>你的内容</p>
            </div>
{{> layout-bottom}}
```

**带 TOC 目录页**（privacy / AIGC-Statement）：
```html
{{> layout-top}}
                <div class="content-body">
                    <h2 id="sec-xxx">标题</h2>
                    <p>...</p>
                </div>
                <nav class="toc" id="toc">
                    <ul>
                        <li><a href="#sec-xxx">标题</a></li>
                    </ul>
                </nav>
{{> layout-bottom}}
```

> `layout-top.hbs` 根据 pageData 中的 `toc: true` 自动添加 `content-main--with-toc` 类和 `.content-layout` 包裹。

---

### 模块 3：首页（index.html）

**涉及文件**：`index.html`、`public/css/style.css`

使用 `{{> top-bar}}` 而非内联 HTML，Hero 标题也使用 `{{siteName}}` 变量：
```html
<h1 id="mainHeroText">{{siteName}}</h1>
```

社交图标在 `.hero-social` 中直接编辑 `<a href="...">`。

---

### 模块 4：联系方式页（links.html）

与首页社交图标类似，直接在 `.contact-cards` 中编辑链接和用户名。

Font Awesome 图标速查：

| 平台 | class |
|------|-------|
| GitHub | `fa-brands fa-github` |
| YouTube | `fa-brands fa-youtube` |
| Telegram | `fa-brands fa-telegram` |
| X/Twitter | `fa-brands fa-x-twitter` |
| 微博 | `fa-brands fa-weibo` |
| Bilibili | `fa-brands fa-bilibili` |
| 抖音 | `fa-brands fa-tiktok` |
| 微信 | `fa-brands fa-weixin` |
| Email | `fa-solid fa-envelope` |

---

### 模块 5：微信二维码弹窗

**涉及文件**：`partials/wechat-popup.hbs`

替换二维码图片：修改两处 `<img src="...">`。弹窗逻辑在 `public/js/main.js` 底部 IIFE 中。

触发方式：`data-wechat-trigger="click"` → 全设备 click；不加属性 → 桌面 hover / 移动 click。

---


### 模块 6：外站跳转确认弹窗

**涉及文件**：`partials/external-link-modal.hbs`、`public/js/main.js`

**作用**：点击指向其他域名的链接时，弹出确认弹窗防止钓鱼。

#### 域名豁免规则

`main.js` 中的 `sameSite()` 决定哪些域名**不弹窗**：

| 条件 | 示例 |
|------|------|
| 与当前页完全相同 | `chatongxue.top` → `chatongxue.top` |
| 当前域名的子域名 | `blog.chatongxue.top`（以 `.chatongxue.top` 结尾） |
| 页面 canonical 域名及其子域 | dev 模式 `localhost` 下也能正确豁免生产域名 |

代码位置 `main.js` 第 492-497 行：
```js
var canonicalEl = document.querySelector("link[rel=canonical]");
var canonicalHost = canonicalEl ? new URL(canonicalEl.href).hostname : "";
var currentHost = window.location.hostname;
function sameSite(h) { return h === currentHost || h.endsWith("." + currentHost) || h === canonicalHost || h.endsWith("." + canonicalHost); }
var isExternal = link.hostname && !sameSite(link.hostname);
```

> **修改方法**：如果你有多个域名（如 `.com` + `.cn`），在 `sameSite()` 中追加 `|| h.endsWith(".你的其他域名")` 即可。

#### 单链接跳过弹窗

给 `<a>` 加 `data-no-ext-confirm` 属性即可跳过（侧边栏博客链接已使用）：

```html
<a href="https://blog.chatongxue.top" data-no-ext-confirm>博客</a>
```

#### 修改弹窗文案

编辑 `partials/external-link-modal.hbs` 中的标题和提示文字。

---

### 模块 6：JavaScript

**涉及文件**：

| 文件 | 功能 |
|------|------|
| `public/js/main.js` | 主脚本（Cookie、主题、GA、一言、Hero 悬停、侧边栏、转场、TOC、外链确认、微信弹窗） |
| `public/js/404.js` | 404 页面精简脚本（Cookie、主题、侧边栏、外链确认） |

main.js 按功能分区组织，各模块通过注释分隔：
- Cookie 同意管理
- Google Analytics 加载/卸载
- 主题切换（auto/dark/light）
- 一言 API
- Hero 悬停交互
- 侧边栏
- TOC 目录高亮
- 外站跳转确认弹窗
- 页面转场动画 + 进度条
- 微信二维码弹窗

**暴露到 window 的函数**：`setCookieConsent`、`toggleDarkMode`、`toggleSidebar`、`changeHeroText`、`resetHeroText`、`hideWechatQR`、`closeExtLinkModal`

---

### 模块 7：SEO

| 文件 | 作用 |
|------|------|
| `src/data/pages.js` | 每页 title / description / canonical / OG |
| `partials/head.hbs` | 渲染 meta 标签（`{{ogImage}}` 变量化） |
| `public/robots.txt` | 爬虫规则（已排除 /404.html） |
| `public/sitemap.xml` | 站点地图 |

新增页面后需更新 `sitemap.xml`。

---

### 模块 8：404 页面

**涉及文件**：`404.html`、`public/css/404.css`、`public/js/404.js`

独立 CSS/JS，不引入公共资源。开发模式自动拦截，生产环境 Cloudflare Pages 自动使用。

---

### 模块 9：项目结构速览

```
portfolio-v2/
├── src/                        ← 构建期代码
│   ├── data/
│   │   ├── site.js             ← 全站全局变量（改这里）
│   │   └── pages.js            ← 每页 meta 数据
│   └── plugins/
│       └── serve-404.js        ← 404 中间件
│
├── partials/                   ← Handlebars 公共片段
│   ├── head.hbs
│   ├── top-bar.hbs
│   ├── footer.hbs
│   ├── sidebar.hbs
│   ├── layout-top.hbs          ← 内容页上半部骨架
│   ├── layout-bottom.hbs       ← 内容页下半部骨架
│   ├── cookie-banner.hbs
│   ├── wechat-popup.hbs
│   └── external-link-modal.hbs
│
├── public/                     ← 静态资源
│   ├── css/
│   │   ├── style.css
│   │   └── 404.css
│   ├── js/
│   │   ├── main.js             ← 主脚本（按功能分区注释组织）
│   │   └── 404.js              ← 404 页面精简脚本
│   ├── robots.txt
│   └── sitemap.xml
│
├── index.html
├── about.html
├── projects.html
├── links.html
├── statements.html
├── privacy.html
├── AIGC-Statement.html
├── 404.html
├── vite.config.js              ← 34 行纯构建声明
└── package.json
```

---

## 技术栈

| 组件 | 说明 |
|------|------|
| Vite 6 | 构建工具 |
| vite-plugin-handlebars | 模板引擎 |
| Font Awesome 6 | 图标（jsdmirror CDN） |
| Noto Sans SC | 主字体（上海交大镜像） |
| Google Analytics 4 | 可选分析 |
| 一言 API | 首页随机句子 |
>>>>>>> 5814db1 (rewrite:通通用vite重写，详见usage)
