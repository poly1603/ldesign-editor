/**
 * 主题系统
 * 支持多主题切换和自定义主题
 */
import { EventEmitter } from '../core/EventEmitter';
export interface ThemeColors {
    primary: string;
    primaryHover: string;
    primaryActive: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    textPrimary: string;
    textSecondary: string;
    textDisabled: string;
    textInverse: string;
    background: string;
    backgroundPaper: string;
    backgroundOverlay: string;
    border: string;
    borderLight: string;
    borderDark: string;
    toolbarBackground: string;
    toolbarText: string;
    toolbarButtonHover: string;
    toolbarButtonActive: string;
    editorBackground: string;
    editorText: string;
    editorCursor: string;
    editorSelection: string;
    editorPlaceholder: string;
    codeBackground: string;
    codeText: string;
    codeBorder: string;
    link: string;
    linkHover: string;
    linkVisited: string;
    shadow: string;
    shadowLight: string;
    shadowDark: string;
}
export interface ThemeFonts {
    fontFamily: string;
    fontFamilyMonospace: string;
    fontSizeXs: string;
    fontSizeSm: string;
    fontSizeMd: string;
    fontSizeLg: string;
    fontSizeXl: string;
    fontSize2xl: string;
    fontSize3xl: string;
    fontWeightLight: number;
    fontWeightNormal: number;
    fontWeightMedium: number;
    fontWeightBold: number;
    lineHeightTight: number;
    lineHeightNormal: number;
    lineHeightRelaxed: number;
}
export interface ThemeSpacing {
    'xs': string;
    'sm': string;
    'md': string;
    'lg': string;
    'xl': string;
    '2xl': string;
    '3xl': string;
}
export interface ThemeBorders {
    radiusNone: string;
    radiusSm: string;
    radiusMd: string;
    radiusLg: string;
    radiusFull: string;
    widthThin: string;
    widthNormal: string;
    widthThick: string;
}
export interface Theme {
    name: string;
    isDark: boolean;
    colors: ThemeColors;
    fonts: ThemeFonts;
    spacing: ThemeSpacing;
    borders: ThemeBorders;
}
export declare class ThemeManager extends EventEmitter {
    private currentTheme;
    private themes;
    private customThemes;
    constructor();
    /**
     * 加载内置主题
     */
    private loadBuiltinThemes;
    /**
     * 获取当前主题
     */
    getCurrentTheme(): Theme | undefined;
    /**
     * 获取主题名称
     */
    getCurrentThemeName(): string;
    /**
     * 获取所有可用主题
     */
    getAvailableThemes(): string[];
    /**
     * 设置主题
     */
    setTheme(themeName: string): void;
    /**
     * 添加自定义主题
     */
    addCustomTheme(theme: Theme): void;
    /**
     * 删除自定义主题
     */
    removeCustomTheme(themeName: string): void;
    /**
     * 应用主题到 DOM
     */
    private applyTheme;
    /**
     * 转换为 kebab-case
     */
    private kebabCase;
    /**
     * 从系统偏好检测主题
     */
    detectSystemTheme(): 'light' | 'dark';
    /**
     * 自动跟随系统主题
     */
    followSystemTheme(): void;
}
/**
 * 获取或创建主题管理器实例
 */
export declare function getThemeManager(): ThemeManager;
/**
 * 便捷函数
 */
export declare function setTheme(themeName: string): void;
export declare function getCurrentTheme(): Theme | undefined;
export declare function getAvailableThemes(): string[];
