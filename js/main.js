// js/main.js

// ---------- 全局变量 ----------
let ORIGINAL_HERO = '北川哈气物'; // 初始占位
let heroTimer = null;

// 主题模式：'auto' | 'dark' | 'light'
let currentThemeMode = 'auto';

// Cookie 同意状态：'necessary' | 'all' | null
let cookieConsent = null;

const GA_MEASUREMENT_ID = 'G-QXMV93M6HE';

function loadGoogleAnalytics() {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        anonymize_ip: true,
        send_page_view: true
    });
    window.gtag = gtag;
}

function unloadGoogleAnalytics() {
    document.cookie.split(';').forEach(function(c) {
        var name = c.trim().split('=')[0];
        if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')) {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
        }
    });

    delete window.gtag;
    delete window.dataLayer;
}

// ---------- Cookie 同意相关 ----------
// 获取 Cookie 同意状态
function getCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'necessary' || consent === 'all') {
        return consent;
    }
    return null;
}

// 设置 Cookie 同意状态
function setCookieConsent(type) {
    cookieConsent = type;
    
    if (type === 'all') {
        localStorage.setItem('cookieConsent', type);
        localStorage.setItem('themeMode', currentThemeMode);
        loadGoogleAnalytics();
    } else {
        localStorage.removeItem('themeMode');
        localStorage.setItem('cookieConsent', type);
        unloadGoogleAnalytics();
    }
    
    hideCookieBanner();
}

// 隐藏 Cookie 横幅
function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.add('hidden');
    }
}

// 显示 Cookie 横幅
function showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner && !cookieConsent) {
        banner.classList.remove('hidden');
    }
}

// ---------- 主题相关 ----------
// 检查系统是否偏好深色模式
const isSystemDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

// 保存主题设置（仅在用户同意全部 Cookie 时）
function saveThemeMode() {
    if (cookieConsent === 'all') {
        localStorage.setItem('themeMode', currentThemeMode);
    }
}

// 应用主题
function applyTheme() {
    const body = document.body;
    const btn = document.querySelector('.mode-toggle');
    
    if (currentThemeMode === 'auto') {
        body.classList.toggle('dark-mode', isSystemDark());
        btn.textContent = '◐ 自动';
    } else if (currentThemeMode === 'dark') {
        body.classList.add('dark-mode');
        btn.textContent = '☀ 日间';
    } else {
        body.classList.remove('dark-mode');
        btn.textContent = '☽ 深色';
    }
    
    // 保存主题（如果用户同意）
    saveThemeMode();
}

// 切换主题模式（自动 → 深色 → 浅色 → 自动）
function toggleDarkMode() {
    const modes = ['auto', 'dark', 'light'];
    const currentIndex = modes.indexOf(currentThemeMode);
    currentThemeMode = modes[(currentIndex + 1) % modes.length];
    applyTheme();
}

// 监听系统主题变化
function setupThemeListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', () => {
        if (currentThemeMode === 'auto') {
            applyTheme();
        }
    });
}

// 初始化主题
function initTheme() {
    // 只有在用户同意全部 Cookie 时才读取 localStorage
    if (cookieConsent === 'all') {
        const savedMode = localStorage.getItem('themeMode');
        if (savedMode && ['auto', 'dark', 'light'].includes(savedMode)) {
            currentThemeMode = savedMode;
        }
    }
    
    applyTheme();
    setupThemeListener();
}

// ---------- 一言相关 ----------
// ---------- 一言获取与解析 ----------
async function fetchHitokoto() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const response = await fetch('https://v1.hitokoto.cn/?c=b&c=d&c=e&c=f&c=h&c=i', { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await response.json();
        
        let content = data.hitokoto;
        let author = data.from_who || data.from;

        if (author) {
            return `${content}<br><span class="author">—— ${author}</span>`;
        } else {
            return content;
        }
    } catch (error) {
        console.warn('一言获取失败，使用备用文案', error);
        return '即使乌云密布，也要相信光。<br><span class="author">—— 佚名</span>';
    }
}

// 初始化：加载一言并更新 Hero
async function initHero() {
    const sentence = await fetchHitokoto();
    ORIGINAL_HERO = sentence;
    const h1 = document.getElementById('mainHeroText');
    h1.innerHTML = sentence;
}

// ---------- 悬停交互 ----------
// 鼠标移入 Grid 项：延迟 0.3s 后才显示对应文字
function changeHeroText(text) {
    if (window.innerWidth <= 600) return;

    const h1 = document.getElementById('mainHeroText');
    const newHTML = text;

    clearTimeout(heroTimer);

    if (h1.innerHTML === newHTML) {
        endAnimation(h1);
        return;
    }

    // 延迟触发：悬停 0.3s 后才真正改变
    heroTimer = setTimeout(() => {
        h1.classList.remove('fade-in');
        h1.classList.add('fade-out');

        heroTimer = setTimeout(() => {
            h1.innerHTML = newHTML;
            endAnimation(h1);
        }, 280);
    }, 300);
}

// 鼠标移出 Grid 项：恢复为 ORIGINAL_HERO（一言句子）
function resetHeroText() {
    if (window.innerWidth <= 600) return;

    const h1 = document.getElementById('mainHeroText');

    clearTimeout(heroTimer);

    if (h1.innerHTML === ORIGINAL_HERO) {
        endAnimation(h1);
        return;
    }

    h1.classList.remove('fade-in');
    h1.classList.add('fade-out');

    heroTimer = setTimeout(() => {
        h1.innerHTML = ORIGINAL_HERO;
        endAnimation(h1);
    }, 280);
}

// 结束动画：去掉 fade-out，加上 fade-in 恢复可见
function endAnimation(h1) {
    h1.classList.remove('fade-out');
    h1.classList.add('fade-in');
}

// ---------- 侧边栏逻辑 ----------
function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
}

// ---------- 启动 ----------
// 页面加载完毕后获取一言和初始化主题
document.addEventListener('DOMContentLoaded', () => {
    cookieConsent = getCookieConsent();
    
    if (cookieConsent === 'all') {
        loadGoogleAnalytics();
    }
    
    initTheme();
    initHero();
    initTOC();
    
    if (!cookieConsent) {
        showCookieBanner();
    } else {
        hideCookieBanner();
    }
});

function initTOC() {
    var toc = document.getElementById('toc');
    if (!toc) return;

    var headings = document.querySelectorAll('.content-body h2[id]');
    if (!headings.length) return;

    var links = toc.querySelectorAll('a');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                links.forEach(function(link) {
                    link.classList.toggle('toc-active', link.getAttribute('href') === '#' + entry.target.id);
                });
            }
        });
    }, { rootMargin: '-20% 0px -75% 0px' });

    headings.forEach(function(h) { observer.observe(h); });
}

/* ===== 页面转场动画 + 进度条 ===== */
(function() {
    const progressBar = document.getElementById('page-progress');
    let progressInterval = null;

    function startProgress() {
        if (!progressBar) return;
        progressBar.style.width = '0%';
        setTimeout(() => { progressBar.style.width = '30%'; }, 50);
        progressInterval = setInterval(() => {
            const currentWidth = parseFloat(progressBar.style.width);
            if (currentWidth < 70) {
                progressBar.style.width = (currentWidth + 5) + '%';
            } else {
                clearInterval(progressInterval);
            }
        }, 100);
    }

    function handleNavigation(e) {
        const link = e.target.closest('a');
        if (!link) return;
        if (link.target === '_blank') return;
        if (link.href && link.href.startsWith('#')) return;

        const url = link.href;
        if (!url || url === window.location.href) return;

        e.preventDefault();
        startProgress();

        // 给一帧时间渲染进度条，减少视觉卡顿
        requestAnimationFrame(() => {
            window.location.href = url;
        });
    }

    document.addEventListener('click', handleNavigation);

    if (progressBar) {
        window.addEventListener('load', () => {
            progressBar.style.width = '100%';
            setTimeout(() => { progressBar.style.opacity = '0'; }, 300);
        });
    }
})();