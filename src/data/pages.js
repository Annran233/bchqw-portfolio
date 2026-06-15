import { site } from './site.js';

const rawPages = {
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
    currentPage: 'About',
    contentTitle: 'About',
  },
  '/projects.html': {
    title: '项目 Projects - 北川哈气物',
    description: '一些项目，包括视频的，文字的和软件方面的。',
    url: 'https://chatongxue.top/projects.html',
    bodyClass: 'content-page-mode',
    currentPage: 'Projects',
    contentTitle: 'Projects',
  },
  '/links.html': {
    title: '链接 Links - 北川哈气物',
    description: '展示一些链接，并显示了联系方式，期待与你的交流与合作。',
    url: 'https://chatongxue.top/links.html',
    bodyClass: 'content-page-mode',
    currentPage: 'Links',
    contentTitle: 'Links',
    extraHead: '<link rel="preconnect" href="https://cdn.jsdmirror.com" crossorigin>\n<link rel="stylesheet" href="https://cdn.jsdmirror.com/npm/@fortawesome/fontawesome-free@6/css/all.min.css">\n<link rel="stylesheet" href="https://at.alicdn.com/t/c/font_5186046_05u33ygw7v7e.css">',
  },
  '/statements.html': {
    title: '网站声明 Statements - 北川哈气物',
    description: '网站声明 Statements - 北川哈气物',
    url: 'https://chatongxue.top/statements.html',
    bodyClass: 'content-page-mode',
    currentPage: 'Statements',
    contentTitle: '网站声明 Statements',
  },
  '/privacy.html': {
    title: '隐私政策 Privacy Policy - 北川哈气物',
    description: '隐私政策落地页，说明我们如何收集、使用和保护您的个人信息。',
    url: 'https://chatongxue.top/privacy.html',
    bodyClass: 'content-page-mode',
    currentPage: 'Privacy Policy',
    contentTitle: '隐私政策 Privacy Policy',
    toc: true,
    extraHead: '<link rel="stylesheet" href="https://cdn.jsdmirror.com/npm/@fortawesome/fontawesome-free@6/css/all.min.css">',
  },
  '/AIGC-Statement.html': {
    title: '生成式人工智能使用声明 AIGC Statement - 北川哈气物',
    description: '生成式人工智能使用声明落地页，说明本站对AIGC的使用原则、范围和合规措施。',
    url: 'https://chatongxue.top/AIGC-Statement.html',
    bodyClass: 'content-page-mode',
    currentPage: 'AIGC Statement',
    contentTitle: '生成式人工智能使用声明 AIGC Statement',
    toc: true,
  },
  '/404.html': {
    title: '404 Not Found - 北川哈气物',
    description: '页面未找到',
    url: 'https://chatongxue.top/404.html',
    bodyClass: '',
    is404: true,
  },
};

export const pageData = Object.fromEntries(
  Object.entries(rawPages).map(([path, data]) => [
    path,
    {
      siteName: site.name,
      domain: site.domain,
      ogImage: site.ogImage,
      copyright: site.copyright,
      icp: site.icp,
      extraHead: '',
      ...data,
    },
  ])
);
