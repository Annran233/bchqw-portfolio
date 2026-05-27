# 北川哈气物 Perpage 使用手册

## 目录

- [项目结构](#项目结构)
- [本地运行](#本地运行)
- [页面体系](#页面体系)
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
- [部署（Cloudflare Pages）](#部署cloudflare-pages)

---

## 项目结构

```
perpage/
├── index.html              # 首页
├── about.html              # 关于
├── projects.html           # 项目展示
├── links.html              # 链接 / 联系方式
├── privacy.html            # 隐私政策
├── statements.html         # 网站声明
├── AIGC-Statement.html     # 生成式人工智能使用声明
├── 404.html                # 自定义 404 页面
├── contents.html           # 内容页模板（不发布）
├── css/
│   ├── style.css           # 全局样式
│   └── 404.css             # 404 页面专属样式
├── js/
│   ├── main.js             # 全局脚本（主题/GA/Cookie/微信弹窗）
│   └── 404.js              # 404 页面专属脚本
├── robots.txt              # 搜索引擎爬虫规则
├── sitemap.xml             # 站点地图
├── CNAME                   # 自定义域名
├── README.md               # 项目说明
└── USAGE.md                # 本文件
```

---

## 本地运行

```bash
cd perpage
python -m http.server 8080
```

浏览器打开 `http://localhost:8080/`。

### 验证 404 页面

访问 `http://localhost:8080/任意路径/` 即可看到自定义 404 页面。404 页面所有资源引用使用绝对路径（`/css/404.css`、`/js/404.js`），即使从深层子路径访问也不会丢失样式。

---

## 页面体系

### 页面分类

| 类型 | 页面 | 特点 |
|------|------|------|
| 首页 | `index.html` | Hero + 一言 + 底部网格 + 社交图标 |
| 内容页 | `about.html` `projects.html` `links.html` | 标题 + 正文，无 Hero |
| 带目录页 | `privacy.html` `statements.html` `AIGC-Statement.html` | 标题 + TOC 目录 + 正文 |
| 模板页 | `contents.html` | 新建页面的起点 |
| 特殊页 | `404.html` | 自定义 404，`--accent: #FF0000` |

### 新建内容页

1. 以 `contents.html` 为模板复制一份
2. 修改 `<head>` 中的 `title` / `description` / `canonical` / `og:*`
3. 修改面包屑中的页面名称
4. 修改 `h1.content-title` 标题
5. 在 `.content-body` 中填入内容

### 新建带目录页

在内容页基础上额外操作：

1. 给 `.content-main` 添加 `content-main--with-toc` 类
2. 将 `.content-body` 包裹在 `.content-layout` 中
3. 在 `.content-layout` 末尾添加 `<nav class="toc">` 目录导航
4. 给每个 `<h2>` 添加唯一 `id`（如 `id="sec-overview"`）
5. TOC 的 `<a>` 链接指向对应 `#sec-xxx`

TOC 的滚动高亮由 `main.js` 中的 `initTOC()` 自动处理（使用 IntersectionObserver）。

---

## 链接 / 联系方式

### 添加社交媒体图标（首页 Hero）

位置：[index.html](file:///e:/OPSProject/perpage/index.html) 的 `.hero-social` 容器内。

使用 Font Awesome 图标：

```html
<a href="https://你的链接" target="_blank" rel="noopener noreferrer"
   class="social-icon" aria-label="平台名" title="平台名">
    <i class="fa-brands fa-平台图标类名"></i>
</a>
```

可用的 FA 图标类名：

| 平台 | FA class |
|------|----------|
| GitHub | `fa-brands fa-github` |
| YouTube | `fa-brands fa-youtube` |
| Telegram | `fa-brands fa-telegram` |
| Twitter/X | `fa-brands fa-x-twitter` |
| Facebook | `fa-brands fa-facebook-f` |
| 微博 | `fa-brands fa-weibo` |
| Bilibili | `fa-brands fa-bilibili` |
| 抖音 | `fa-brands fa-tiktok` |
| Email | `fa-solid fa-envelope` |

### 添加联系方式卡片（Links 页）

位置：[links.html](file:///e:/OPSProject/perpage/links.html) 的 `.contact-cards` 容器内。

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

---

## 微信二维码弹窗

### 弹窗用途

首页和 Links 页的微信图标点击后弹出居中弹窗，内含两个二维码：
- 微信公众号
- 微信视频号

弹窗弹出后图片才下载（使用 `loading="lazy"` + CSS 隐藏控制），首屏不加载，不浪费带宽。

### 替换二维码图片

两个文件各有一处图片路径，需要同步修改：

**index.html** — 约 L180-L190：
```html
<img src="https://img-cfr2.chatongxue.top/wechat-qr-mf.webp" ...>
<img src="https://img-cfr2.chatongxue.top/wechat-qr-channel.webp" ...>
```

**links.html** — 约 L135-L148：
```html
<img src="https://img-cfr2.chatongxue.top/wechat-qr-mf.webp" ...>
<img src="https://img-cfr2.chatongxue.top/wechat-qr-channel.webp" ...>
```

图片尺寸由 CSS 控制，非正方形二维码自动适应（`max-height` 限制纵向拉长）。

### 修改交互方式

交互逻辑由 `main.js` 中的 WeChat QR 模块控制。触发元素的交互模式通过 `data-wechat-trigger` 属性决定：

| 属性值 | 行为 |
|--------|------|
| 无（默认） | 桌面端 hover 弹出，移动端 click toggle |
| `click` | 全设备（含桌面）click toggle |

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

---

## Google Analytics

GA4 通过 `main.js` 动态注入，存在 **三重防护** 确保仅在用户同意后运行：

1. Consent Mode v2 默认 `analytics_storage: 'denied'`
2. 用户未点击「允许全部」前，gtag.js 脚本不注入
3. 用户选择「仅必要」后，清除所有 GA cookies

### 更换 Measurement ID

在 [main.js](file:///e:/OPSProject/perpage/js/main.js) 中找到：

```js
const GA_MEASUREMENT_ID = 'G-QXMV93M6HE';
```

替换为你的 GA4 Measurement ID 即可。不需要修改任何 HTML。

### 合规说明

- IP 匿名化已开启（`anonymize_ip: true`）
- 数据保留期 14 个月
- Google Signals 已禁用
- Cookie Banner 显示隐私政策链接
- 隐私政策页（[privacy.html](file:///e:/OPSProject/perpage/privacy.html)）包含 GDPR、CCPA、中国网络安全法三套法规说明

---

## 图标体系

### Font Awesome（主力）

- **CDN**：`cdn.jsdmirror.com`（大陆镜像，jsDelivr 在国内慢）
- **版本**：Font Awesome Free 6
- **使用**：`<i class="fa-brands fa-图标名"></i>` 或 `<i class="fa-solid fa-图标名"></i>`
- **覆盖**：国际主流平台（GitHub, YouTube, Telegram, X/Twitter, Facebook, TikTok 等）

### iconfont（中文平台补充）

- **CDN**：`at.alicdn.com`（阿里图标库）
- **用途**：补充 Font Awesome 不包含的中文平台图标
- **接入方法**：
  1. 打开 [iconfont.cn](https://www.iconfont.cn)，创建/登录项目
  2. 搜索并添加所需图标（今日头条、小红书、知乎、CSDN 等）
  3. 选择 Font Class 方式，复制 CDN 链接
  4. 替换 [index.html](file:///e:/OPSProject/perpage/index.html) 和 [links.html](file:///e:/OPSProject/perpage/links.html) 中 iconfont 注释区域内的 `<link>` href
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

---

## 主题切换

- 主题偏好存储在 `localStorage.themeMode`，与 Cookie 同意独立解耦
- 切换按钮在 sidebar 顶部（`☽ 模式`）
- 三档：浅色 / 深色 / 自动（跟随系统）
- 即使用户选择「仅必要 Cookie」，主题偏好依然持久化

---

## SEO 配置

### 每个页面必备的 Meta 标签

```html
<title>页面名 - 北川哈气物</title>
<meta name="description" content="页面描述">
<link rel="canonical" href="https://chatongxue.top/页面名.html">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:url" content="https://chatongxue.top/...">
<meta property="og:image" content="https://img-cfr2.chatongxue.top/...">
<meta name="twitter:card" content="summary_large_image">
```

### 排除页

- `contents.html` — `noindex, nofollow`（模板页，不发布）
- `404.html` — `noindex, nofollow`（404 页，不让搜索引擎收录）
- `robots.txt` 中已声明排除

### 新增页面后

1. 更新 [sitemap.xml](file:///e:/OPSProject/perpage/sitemap.xml)，添加新 URL
2. 修改所有页面的 footer/sidebar 中相应链接

---

## 部署（Cloudflare Pages）

1. 将仓库推送到 GitHub
2. 在 Cloudflare Pages 中连接仓库
3. 构建配置：
   - 框架预设：**无**（纯静态站点）
   - 构建命令：**留空**
   - 输出目录：**/**（根目录）
4. 在 Pages 设置中绑定自定义域名 `chatongxue.top`
5. 设置 404 回退：`/404.html`

> **提示**：Cloudflare Pages 默认以目录形式处理子路径（如 `/张雪峰/` 视为目录而非文件）。本项目的 404.html 所有资源引用已使用绝对路径（以 `/` 开头），不会因子路径深度而丢失样式和脚本。
