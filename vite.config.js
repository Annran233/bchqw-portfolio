import { resolve } from 'path'
import { readFileSync } from 'fs'
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'

const pageData = {
  '/index.html': {
    title: '北川哈气物',
    description: '北川哈气物 - 别回头，向前走，前路有光',
    url: 'https://chatongxue.top/',
    bodyClass: 'home-page',
  },
  '/about.html': {
    title: '关于我 - 北川哈气物',
    description: '了解北川哈气物。',
    url: 'https://chatongxue.top/about.html',
    bodyClass: 'content-page-mode',
    breadcrumb: [{ text: 'Home', href: 'index.html' }],
    currentPage: 'About',
    contentTitle: 'About',
  },
  '/projects.html': {
    title: '项目 Projects - 北川哈气物',
    description: '一些项目，包括视频的，文字的和软件方面的。',
    url: 'https://chatongxue.top/projects.html',
    bodyClass: 'content-page-mode',
    breadcrumb: [{ text: 'Home', href: 'index.html' }],
    currentPage: 'Projects',
    contentTitle: 'Projects',
  },
  '/links.html': {
    title: '链接 Links - 北川哈气物',
    description: '展示一些链接，并显示了联系方式，期待与你的交流与合作。',
    url: 'https://chatongxue.top/links.html',
    bodyClass: 'content-page-mode',
    breadcrumb: [{ text: 'Home', href: 'index.html' }],
    currentPage: 'Links',
    contentTitle: 'Links',
  },
  '/statements.html': {
    title: '网站声明 Statements - 北川哈气物',
    description: '网站声明 Statements - 北川哈气物',
    url: 'https://chatongxue.top/statements.html',
    bodyClass: 'content-page-mode',
    breadcrumb: [{ text: 'Home', href: 'index.html' }],
    currentPage: 'Statements',
    contentTitle: '网站声明 Statements',
  },
  '/privacy.html': {
    title: '隐私政策 Privacy Policy - 北川哈气物',
    description: '隐私政策落地页，说明我们如何收集、使用和保护您的个人信息。',
    url: 'https://chatongxue.top/privacy.html',
    bodyClass: 'content-page-mode',
    breadcrumb: [{ text: 'Home', href: 'index.html' }],
    currentPage: 'Privacy Policy',
    contentTitle: '隐私政策 Privacy Policy',
  },
  '/AIGC-Statement.html': {
    title: '生成式人工智能使用声明 AIGC Statement - 北川哈气物',
    description: '生成式人工智能使用声明落地页，说明本站对AIGC的使用原则、范围和合规措施。',
    url: 'https://chatongxue.top/AIGC-Statement.html',
    bodyClass: 'content-page-mode',
    breadcrumb: [{ text: 'Home', href: 'index.html' }],
    currentPage: 'AIGC Statement',
    contentTitle: '生成式人工智能使用声明 AIGC Statement',
  },
  '/404.html': {
    title: '404 Not Found - 北川哈气物',
    description: '页面未找到',
    url: 'https://chatongxue.top/404.html',
    bodyClass: '',
    is404: true,
  },
}

function serve404() {
  return {
    name: 'serve-404',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url !== '/404.html' && !req.url.startsWith('/@') && !req.url.startsWith('/css') && !req.url.startsWith('/js') && !req.url.includes('.')) {
          req.url = '/404.html'
        }
        next()
      })
    },
    configurePreviewServer(server) {
      const notFoundPage = readFileSync(resolve(__dirname, 'dist/404.html'), 'utf-8')
      server.middlewares.use((req, res, next) => {
        if (req.url === '/404.html') return next()
        if (req.url && (req.url.startsWith('/css') || req.url.startsWith('/js') || req.url.includes('.'))) return next()
        const origEnd = res.end
        res.end = function (...args) {
          if (res.statusCode === 404) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
            return origEnd.call(res, notFoundPage)
          }
          return origEnd.apply(res, args)
        }
        next()
      })
    },
  }
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  appType: 'mpa',
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'partials'),
      context(pagePath) {
        return pageData[pagePath]
      },
    }),
    serve404(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        projects: resolve(__dirname, 'projects.html'),
        links: resolve(__dirname, 'links.html'),
        statements: resolve(__dirname, 'statements.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        aigc: resolve(__dirname, 'AIGC-Statement.html'),
        notfound: resolve(__dirname, '404.html'),
      },
    },
  },
})
