/**
 * 国际化（i18n）系统
 * 支持多语言切换和动态加载
 */
import { EventEmitter } from '../core/EventEmitter';
export interface I18nConfig {
    defaultLocale: string;
    fallbackLocale: string;
    messages: Record<string, LocaleMessages>;
}
export interface LocaleMessages {
    [key: string]: string | LocaleMessages;
}
export declare class I18nManager extends EventEmitter {
    private currentLocale;
    private fallbackLocale;
    private messages;
    private loadedLocales;
    constructor(config?: Partial<I18nConfig>);
    /**
     * 加载内置语言包
     */
    private loadBuiltinLocales;
    /**
     * 添加语言包
     */
    addMessages(locale: string, messages: LocaleMessages): void;
    /**
     * 动态加载语言包
     */
    loadLocale(locale: string): Promise<void>;
    /**
     * 切换语言
     */
    setLocale(locale: string): Promise<void>;
    /**
     * 获取当前语言
     */
    getLocale(): string;
    /**
     * 获取支持的语言列表
     */
    getAvailableLocales(): string[];
    /**
     * 翻译文本
     */
    t(key: string, params?: Record<string, any>): string;
    /**
     * 获取消息
     */
    private getMessage;
    /**
     * 检查是否有某个翻译键
     */
    has(key: string): boolean;
}
/**
 * 获取或创建 i18n 实例
 */
export declare function getI18n(config?: Partial<I18nConfig>): I18nManager;
/**
 * 便捷翻译函数
 */
export declare function t(key: string, params?: Record<string, any>): string;
/**
 * 导出类型
 */
export type { I18nConfig, LocaleMessages };
