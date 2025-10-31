/**
 * 统一配置管理系统
 * 集中管理编辑器的所有配置：图标、主题、语言等
 */
import type { I18nConfig, I18nManager } from '../i18n';
import type { IconManager, IconManagerConfig } from '../icons/IconManager';
import type { IconSetType } from '../icons/types';
import type { Theme, ThemeManager } from '../theme';
import { EventEmitter } from '../core/EventEmitter';
/**
 * 编辑器配置接口
 */
export interface EditorConfig {
    icons?: IconManagerConfig;
    theme?: {
        defaultTheme?: string;
        customThemes?: Theme[];
        followSystem?: boolean;
    };
    i18n?: Partial<I18nConfig>;
    autoSave?: boolean;
    autoSaveInterval?: number;
    spellCheck?: boolean;
    readOnly?: boolean;
}
/**
 * 配置管理器
 * 提供统一的接口来管理编辑器的所有配置
 */
export declare class ConfigManager extends EventEmitter {
    private config;
    private iconManager;
    private themeManager;
    private i18nManager;
    constructor(config?: EditorConfig);
    /**
     * 设置监听器
     */
    private setupListeners;
    /**
     * 获取图标管理器
     */
    getIconManager(): IconManager;
    /**
     * 获取主题管理器
     */
    getThemeManager(): ThemeManager;
    /**
     * 获取多语言管理器
     */
    getI18nManager(): I18nManager;
    /**
     * 设置图标集
     */
    setIconSet(set: IconSetType): void;
    /**
     * 获取当前图标集
     */
    getIconSet(): IconSetType;
    /**
     * 获取可用图标集
     */
    getAvailableIconSets(): IconSetType[];
    /**
     * 设置主题
     */
    setTheme(themeName: string): void;
    /**
     * 获取当前主题
     */
    getTheme(): Theme | undefined;
    /**
     * 获取可用主题
     */
    getAvailableThemes(): string[];
    /**
     * 添加自定义主题
     */
    addTheme(theme: Theme): void;
    /**
     * 设置语言
     */
    setLocale(locale: string): Promise<void>;
    /**
     * 获取当前语言
     */
    getLocale(): string;
    /**
     * 获取可用语言
     */
    getAvailableLocales(): string[];
    /**
     * 翻译
     */
    t(key: string, params?: Record<string, any>): string;
    /**
     * 更新配置
     */
    updateConfig(config: Partial<EditorConfig>): void;
    /**
     * 获取完整配置
     */
    getConfig(): EditorConfig;
    /**
     * 导出配置（用于保存）
     */
    exportConfig(): string;
    /**
     * 导入配置（用于恢复）
     */
    importConfig(configJson: string): void;
    /**
     * 重置为默认配置
     */
    reset(): void;
    /**
     * 销毁
     */
    destroy(): void;
}
/**
 * 获取全局配置管理器
 */
export declare function getConfigManager(config?: EditorConfig): ConfigManager;
/**
 * 重置全局配置管理器
 */
export declare function resetConfigManager(): void;
