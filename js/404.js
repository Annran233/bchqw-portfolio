// js/404.js

// ---------- 全局变量 ----------
let currentThemeMode = 'auto';
let cookieConsent = null;

// ---------- Cookie 同意相关 ----------
function getCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'necessary' || consent === 'all') {
        return consent;
    }
    return null;
}

function setCookieConsent(type) {
    cookieConsent = type;
    
    if (type === 'all') {
        localStorage.setItem('cookieConsent', type);
        localStorage.setItem('themeMode', currentThemeMode);
    } else {
        localStorage.removeItem('themeMode');
        localStorage.setItem('cookieConsent', type);
    }
    
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.add('hidden');
    }
}

function showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner && !cookieConsent) {
        banner.classList.remove('hidden');
    }
}

// ---------- 主题相关 ----------
const isSystemDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

function saveThemeMode() {
    if (cookieConsent === 'all') {
        localStorage.setItem('themeMode', currentThemeMode);
    }
}

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
    
    saveThemeMode();
}

function toggleDarkMode() {
    const modes = ['auto', 'dark', 'light'];
    const currentIndex = modes.indexOf(currentThemeMode);
    currentThemeMode = modes[(currentIndex + 1) % modes.length];
    applyTheme();
}

function setupThemeListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', () => {
        if (currentThemeMode === 'auto') {
            applyTheme();
        }
    });
}

function initTheme() {
    if (cookieConsent === 'all') {
        const savedMode = localStorage.getItem('themeMode');
        if (savedMode && ['auto', 'dark', 'light'].includes(savedMode)) {
            currentThemeMode = savedMode;
        }
    }
    
    applyTheme();
    setupThemeListener();
}

// ---------- 侧边栏逻辑 ----------
function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
}

// ---------- 启动 ----------
document.addEventListener('DOMContentLoaded', () => {
    cookieConsent = getCookieConsent();
    initTheme();
    
    if (!cookieConsent) {
        showCookieBanner();
    }
});