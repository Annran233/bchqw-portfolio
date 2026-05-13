// js/main.js

// ---------- 全局变量 ----------
let ORIGINAL_HERO = '北川哈气物'; // 初始占位
let heroTimer = null;

// 主题模式：'auto' | 'dark' | 'light'
let currentThemeMode = 'auto';

// Cookie 同意状态：'necessary' | 'all' | null
let cookieConsent = null;

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
    
    // 用户同意全部：保存所有数据到 localStorage（path=/ 确保全域名生效）
    if (type === 'all') {
        localStorage.setItem('cookieConsent', type);
        localStorage.setItem('themeMode', currentThemeMode);
    } else {
        // 仅必要：清除非必要数据，但保存同意状态以便下次不显示横幅
        localStorage.removeItem('themeMode');
        localStorage.setItem('cookieConsent', type);
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
        const response = await fetch('https://v1.hitokoto.cn/?c=b&c=d&c=e&c=f&c=h&c=i');
        const data = await response.json();
        
        // 原始数据：hitokoto 和 from_who/from
        let content = data.hitokoto;
        let author = data.from_who || data.from;

        // 如果作者存在，用 HTML 包裹作者，并添加适当的换行和分隔符
        if (author) {
            // 返回一段 HTML：正文 + 换行 + 作者（用 span 包裹）
            return `${content}<br><span class="author">—— ${author}</span>`;
        } else {
            // 没有作者，直接返回正文
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
// 鼠标移入 Grid 项：显示对应文字（关于/抵达/中转）
function changeHeroText(text) {
    if (window.innerWidth <= 600) return;

    const h1 = document.getElementById('mainHeroText');
    const newHTML = text;

    if (h1.innerHTML === newHTML) return;

    clearTimeout(heroTimer);
    
    h1.classList.remove('fade-in');
    h1.classList.add('fade-out');
    
    heroTimer = setTimeout(() => {
        h1.innerHTML = newHTML;
        h1.classList.remove('fade-out');
        h1.classList.add('fade-in');
    }, 280);
}

// 鼠标移出 Grid 项：恢复为 ORIGINAL_HERO（一言句子）
function resetHeroText() {
    if (window.innerWidth <= 600) return;

    const h1 = document.getElementById('mainHeroText');
    if (h1.innerHTML === ORIGINAL_HERO) return;

    clearTimeout(heroTimer);
    
    h1.classList.remove('fade-in');
    h1.classList.add('fade-out');
    
    heroTimer = setTimeout(() => {
        h1.innerHTML = ORIGINAL_HERO;
        h1.classList.remove('fade-out');
        h1.classList.add('fade-in');
    }, 280);
}

// ---------- 侧边栏逻辑 ----------
function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
}

// ---------- 启动 ----------
// 页面加载完毕后获取一言和初始化主题
document.addEventListener('DOMContentLoaded', () => {
    // 先检查 Cookie 同意状态
    cookieConsent = getCookieConsent();
    
    // 初始化主题（会根据 cookieConsent 决定是否读取 localStorage）
    initTheme();
    
    // 初始化一言
    initHero();
    
    if (!cookieConsent) {
        showCookieBanner();
    } else {
        hideCookieBanner();
    }
});

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

    function finishProgress() {
        if (progressInterval) clearInterval(progressInterval);
        if (!progressBar) return;
        progressBar.style.width = '100%';
        setTimeout(() => {
            progressBar.style.width = '0%';
        }, 400);
    }

    function handleNavigation(e) {
        const link = e.target.closest('a');
        if (!link) return;
        if (link.target === '_blank') return;
        if (link.href && link.href.startsWith('#')) return;

        const url = link.href;
        if (!url || url === window.location.href) return;

        e.preventDefault();

        sessionStorage.setItem('pageTransition', 'out');
        startProgress();
        document.body.classList.add('page-transition-out');

        setTimeout(() => {
            window.location.href = url;
        }, 250);
    }

    document.addEventListener('click', handleNavigation);

    if (sessionStorage.getItem('pageTransition') === 'out') {
        sessionStorage.setItem('pageTransition', 'in');
        document.body.classList.add('page-transition-in');

        setTimeout(() => {
            document.body.classList.remove('page-transition-in');
            sessionStorage.removeItem('pageTransition');
        }, 350);
    }
})();