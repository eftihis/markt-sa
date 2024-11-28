const THEME_CONFIG = {
  STORAGE_KEY: 'theme',
  ATTRIBUTE: 'data-theme',
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark'
  }
};

class ThemeManager {
  constructor() {
    this.pageWrapper = document.querySelector('.page_wrap');
    this.themeToggle = document.getElementById('light-dark-toggle');
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (!this.pageWrapper) {
      return;
    }
    
    this.init();
  }

  init() {
    this.initializeTheme();
    this.setupEventListeners();
  }

  updateStatusBarColor(isDark) {
    // Wait for CSS transition to complete before updating status bar
    this.pageWrapper.addEventListener('transitionend', () => {
      const themeColor = getComputedStyle(this.pageWrapper)
        .getPropertyValue('--theme--background').trim();
      
      document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
        meta.setAttribute('content', themeColor);
      });
      
      document.querySelectorAll('meta[name="apple-mobile-web-app-status-bar"]').forEach(meta => {
        meta.setAttribute('content', themeColor);
      });
    }, { once: true }); // Only listen once per transition
  }

  setTheme(isDark, saveToStorage = false) {
    const theme = isDark ? THEME_CONFIG.THEMES.DARK : THEME_CONFIG.THEMES.LIGHT;
    
    this.pageWrapper.setAttribute(THEME_CONFIG.ATTRIBUTE, theme);
    this.updateStatusBarColor(isDark);
    
    if (saveToStorage) {
      this.saveThemePreference(theme);
    }
    
    if (this.themeToggle) {
      this.updateToggleButton(isDark);
    }
    
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme, isDark } 
    }));
  }

  getCurrentTheme() {
    return this.pageWrapper.getAttribute(THEME_CONFIG.ATTRIBUTE) === THEME_CONFIG.THEMES.DARK;
  }

  saveThemePreference(theme) {
    try {
      localStorage.setItem(THEME_CONFIG.STORAGE_KEY, theme);
    } catch (error) {
      // Silently handle localStorage errors
    }
  }

  clearThemePreference() {
    try {
      localStorage.removeItem(THEME_CONFIG.STORAGE_KEY);
    } catch (error) {
      // Silently handle localStorage errors
    }
  }

  updateToggleButton(isDark) {
    this.themeToggle.setAttribute('aria-pressed', isDark.toString());
    this.themeToggle.setAttribute('aria-label', `Switch to ${isDark ? THEME_CONFIG.THEMES.LIGHT : THEME_CONFIG.THEMES.DARK} theme`);
  }

  handleSystemPreference = (event) => {
    const prefersDark = event.matches;
    
    this.clearThemePreference();
    this.setTheme(prefersDark, false);
  }

  initializeTheme() {
    const storedTheme = localStorage.getItem(THEME_CONFIG.STORAGE_KEY);
    const systemPrefersDark = this.mediaQuery.matches;
    
    if (storedTheme) {
      this.setTheme(storedTheme === THEME_CONFIG.THEMES.DARK, false);
    } else {
      this.setTheme(systemPrefersDark, false);
    }
  }

  setupEventListeners() {
    this.mediaQuery.addEventListener('change', this.handleSystemPreference);
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => {
        const isDark = this.getCurrentTheme();
        this.setTheme(!isDark, true);
      });
    }
    window.addEventListener('unload', () => {
      this.mediaQuery.removeEventListener('change', this.handleSystemPreference);
    });
  }
}

function initThemeToggle() {
  new ThemeManager();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
  initThemeToggle();
}
