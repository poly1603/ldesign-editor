/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { EventEmitter } from '../utils/event.js';

class ThemeManager extends EventEmitter {
  constructor() {
    super();
    this.currentTheme = "light";
    this.themes = /* @__PURE__ */ new Map();
    this.customThemes = /* @__PURE__ */ new Map();
    this.loadBuiltinThemes();
    this.applyTheme(this.currentTheme);
  }
  /**
   * 加载内置主题
   */
  loadBuiltinThemes() {
    this.themes.set("light", {
      name: "Light",
      isDark: false,
      colors: {
        primary: "#3b82f6",
        primaryHover: "#2563eb",
        primaryActive: "#1d4ed8",
        secondary: "#8b5cf6",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#06b6d4",
        textPrimary: "#1f2937",
        textSecondary: "#6b7280",
        textDisabled: "#9ca3af",
        textInverse: "#ffffff",
        background: "#ffffff",
        backgroundPaper: "#f9fafb",
        backgroundOverlay: "rgba(0, 0, 0, 0.5)",
        border: "#e5e7eb",
        borderLight: "#f3f4f6",
        borderDark: "#d1d5db",
        toolbarBackground: "#ffffff",
        toolbarText: "#374151",
        toolbarButtonHover: "#f3f4f6",
        toolbarButtonActive: "#e5e7eb",
        editorBackground: "#ffffff",
        editorText: "#1f2937",
        editorCursor: "#3b82f6",
        editorSelection: "rgba(59, 130, 246, 0.2)",
        editorPlaceholder: "#9ca3af",
        codeBackground: "#f3f4f6",
        codeText: "#1f2937",
        codeBorder: "#e5e7eb",
        link: "#3b82f6",
        linkHover: "#2563eb",
        linkVisited: "#7c3aed",
        shadow: "rgba(0, 0, 0, 0.1)",
        shadowLight: "rgba(0, 0, 0, 0.05)",
        shadowDark: "rgba(0, 0, 0, 0.2)"
      },
      fonts: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontFamilyMonospace: 'Consolas, Monaco, "Courier New", monospace',
        fontSizeXs: "12px",
        fontSizeSm: "14px",
        fontSizeMd: "16px",
        fontSizeLg: "18px",
        fontSizeXl: "20px",
        fontSize2xl: "24px",
        fontSize3xl: "30px",
        fontWeightLight: 300,
        fontWeightNormal: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        lineHeightTight: 1.25,
        lineHeightNormal: 1.5,
        lineHeightRelaxed: 1.75
      },
      spacing: {
        "xs": "4px",
        "sm": "8px",
        "md": "16px",
        "lg": "24px",
        "xl": "32px",
        "2xl": "48px",
        "3xl": "64px"
      },
      borders: {
        radiusNone: "0",
        radiusSm: "2px",
        radiusMd: "4px",
        radiusLg: "8px",
        radiusFull: "9999px",
        widthThin: "1px",
        widthNormal: "2px",
        widthThick: "4px"
      }
    });
    this.themes.set("dark", {
      name: "Dark",
      isDark: true,
      colors: {
        primary: "#60a5fa",
        primaryHover: "#93bbfc",
        primaryActive: "#3b82f6",
        secondary: "#a78bfa",
        success: "#34d399",
        warning: "#fbbf24",
        error: "#f87171",
        info: "#22d3ee",
        textPrimary: "#f9fafb",
        textSecondary: "#d1d5db",
        textDisabled: "#6b7280",
        textInverse: "#1f2937",
        background: "#111827",
        backgroundPaper: "#1f2937",
        backgroundOverlay: "rgba(0, 0, 0, 0.8)",
        border: "#374151",
        borderLight: "#4b5563",
        borderDark: "#1f2937",
        toolbarBackground: "#1f2937",
        toolbarText: "#f3f4f6",
        toolbarButtonHover: "#374151",
        toolbarButtonActive: "#4b5563",
        editorBackground: "#111827",
        editorText: "#f9fafb",
        editorCursor: "#60a5fa",
        editorSelection: "rgba(96, 165, 250, 0.3)",
        editorPlaceholder: "#6b7280",
        codeBackground: "#1f2937",
        codeText: "#f9fafb",
        codeBorder: "#374151",
        link: "#60a5fa",
        linkHover: "#93bbfc",
        linkVisited: "#c4b5fd",
        shadow: "rgba(0, 0, 0, 0.3)",
        shadowLight: "rgba(0, 0, 0, 0.2)",
        shadowDark: "rgba(0, 0, 0, 0.5)"
      },
      fonts: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontFamilyMonospace: 'Consolas, Monaco, "Courier New", monospace',
        fontSizeXs: "12px",
        fontSizeSm: "14px",
        fontSizeMd: "16px",
        fontSizeLg: "18px",
        fontSizeXl: "20px",
        fontSize2xl: "24px",
        fontSize3xl: "30px",
        fontWeightLight: 300,
        fontWeightNormal: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        lineHeightTight: 1.25,
        lineHeightNormal: 1.5,
        lineHeightRelaxed: 1.75
      },
      spacing: {
        "xs": "4px",
        "sm": "8px",
        "md": "16px",
        "lg": "24px",
        "xl": "32px",
        "2xl": "48px",
        "3xl": "64px"
      },
      borders: {
        radiusNone: "0",
        radiusSm: "2px",
        radiusMd: "4px",
        radiusLg: "8px",
        radiusFull: "9999px",
        widthThin: "1px",
        widthNormal: "2px",
        widthThick: "4px"
      }
    });
    this.themes.set("high-contrast", {
      name: "High Contrast",
      isDark: true,
      colors: {
        primary: "#ffffff",
        primaryHover: "#e5e7eb",
        primaryActive: "#d1d5db",
        secondary: "#fbbf24",
        success: "#4ade80",
        warning: "#fb923c",
        error: "#f87171",
        info: "#67e8f9",
        textPrimary: "#ffffff",
        textSecondary: "#e5e7eb",
        textDisabled: "#9ca3af",
        textInverse: "#000000",
        background: "#000000",
        backgroundPaper: "#0a0a0a",
        backgroundOverlay: "rgba(0, 0, 0, 0.9)",
        border: "#ffffff",
        borderLight: "#e5e7eb",
        borderDark: "#6b7280",
        toolbarBackground: "#0a0a0a",
        toolbarText: "#ffffff",
        toolbarButtonHover: "#1f2937",
        toolbarButtonActive: "#374151",
        editorBackground: "#000000",
        editorText: "#ffffff",
        editorCursor: "#ffffff",
        editorSelection: "rgba(255, 255, 255, 0.3)",
        editorPlaceholder: "#9ca3af",
        codeBackground: "#0a0a0a",
        codeText: "#ffffff",
        codeBorder: "#ffffff",
        link: "#fbbf24",
        linkHover: "#fcd34d",
        linkVisited: "#f59e0b",
        shadow: "rgba(255, 255, 255, 0.1)",
        shadowLight: "rgba(255, 255, 255, 0.05)",
        shadowDark: "rgba(255, 255, 255, 0.2)"
      },
      fonts: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontFamilyMonospace: 'Consolas, Monaco, "Courier New", monospace',
        fontSizeXs: "12px",
        fontSizeSm: "14px",
        fontSizeMd: "16px",
        fontSizeLg: "18px",
        fontSizeXl: "20px",
        fontSize2xl: "24px",
        fontSize3xl: "30px",
        fontWeightLight: 300,
        fontWeightNormal: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        lineHeightTight: 1.25,
        lineHeightNormal: 1.5,
        lineHeightRelaxed: 1.75
      },
      spacing: {
        "xs": "4px",
        "sm": "8px",
        "md": "16px",
        "lg": "24px",
        "xl": "32px",
        "2xl": "48px",
        "3xl": "64px"
      },
      borders: {
        radiusNone: "0",
        radiusSm: "2px",
        radiusMd: "4px",
        radiusLg: "8px",
        radiusFull: "9999px",
        widthThin: "2px",
        widthNormal: "3px",
        widthThick: "5px"
      }
    });
  }
  /**
   * 获取当前主题
   */
  getCurrentTheme() {
    return this.themes.get(this.currentTheme) || this.customThemes.get(this.currentTheme);
  }
  /**
   * 获取主题名称
   */
  getCurrentThemeName() {
    return this.currentTheme;
  }
  /**
   * 获取所有可用主题
   */
  getAvailableThemes() {
    return [...this.themes.keys(), ...this.customThemes.keys()];
  }
  /**
   * 设置主题
   */
  setTheme(themeName) {
    const theme = this.themes.get(themeName) || this.customThemes.get(themeName);
    if (!theme) {
      console.error(`Theme "${themeName}" not found`);
      return;
    }
    const oldTheme = this.currentTheme;
    this.currentTheme = themeName;
    this.applyTheme(themeName);
    this.emit("themeChange", {
      oldTheme,
      newTheme: themeName
    });
  }
  /**
   * 添加自定义主题
   */
  addCustomTheme(theme) {
    this.customThemes.set(theme.name.toLowerCase(), theme);
  }
  /**
   * 删除自定义主题
   */
  removeCustomTheme(themeName) {
    this.customThemes.delete(themeName);
  }
  /**
   * 应用主题到 DOM
   */
  applyTheme(themeName) {
    const theme = this.themes.get(themeName) || this.customThemes.get(themeName);
    if (!theme)
      return;
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--editor-color-${this.kebabCase(key)}`, value);
    });
    Object.entries(theme.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--editor-font-${this.kebabCase(key)}`, String(value));
    });
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--editor-spacing-${key}`, value);
    });
    Object.entries(theme.borders).forEach(([key, value]) => {
      root.style.setProperty(`--editor-border-${this.kebabCase(key)}`, value);
    });
    root.classList.remove("editor-theme-light", "editor-theme-dark", "editor-theme-high-contrast");
    root.classList.add(`editor-theme-${themeName}`);
    if (theme.isDark)
      root.classList.add("editor-dark");
    else
      root.classList.remove("editor-dark");
  }
  /**
   * 转换为 kebab-case
   */
  kebabCase(str) {
    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }
  /**
   * 从系统偏好检测主题
   */
  detectSystemTheme() {
    if (typeof window === "undefined")
      return "light";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }
  /**
   * 自动跟随系统主题
   */
  followSystemTheme() {
    const systemTheme = this.detectSystemTheme();
    this.setTheme(systemTheme);
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", (e) => {
        this.setTheme(e.matches ? "dark" : "light");
      });
    }
  }
}
let themeInstance = null;
function getThemeManager() {
  if (!themeInstance)
    themeInstance = new ThemeManager();
  return themeInstance;
}
function setTheme(themeName) {
  getThemeManager().setTheme(themeName);
}
function getCurrentTheme() {
  return getThemeManager().getCurrentTheme();
}
function getAvailableThemes() {
  return getThemeManager().getAvailableThemes();
}

export { ThemeManager, getAvailableThemes, getCurrentTheme, getThemeManager, setTheme };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
