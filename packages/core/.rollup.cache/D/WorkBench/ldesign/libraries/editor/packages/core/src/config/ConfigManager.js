/**
 * 统一配置管理系统
 * 集中管理编辑器的所有配置：图标、主题、语言等
 */
import { EventEmitter } from '../core/EventEmitter';
import { getI18n } from '../i18n';
import { getIconManager } from '../icons/IconManager';
import { getThemeManager } from '../theme';
/**
 * 配置管理器
 * 提供统一的接口来管理编辑器的所有配置
 */
export class ConfigManager extends EventEmitter {
    constructor(config = {}) {
        super();
        this.config = {};
        this.config = config;
        // 初始化图标管理器
        this.iconManager = getIconManager(config.icons);
        // 初始化主题管理器
        this.themeManager = getThemeManager();
        if (config.theme) {
            // 添加自定义主题
            if (config.theme.customThemes) {
                config.theme.customThemes.forEach((theme) => {
                    this.themeManager.addCustomTheme(theme);
                });
            }
            // 设置默认主题
            if (config.theme.defaultTheme)
                this.themeManager.setTheme(config.theme.defaultTheme);
            // 跟随系统主题
            if (config.theme.followSystem)
                this.themeManager.followSystemTheme();
        }
        // 初始化多语言管理器
        this.i18nManager = getI18n(config.i18n);
        // 监听各管理器的变化
        this.setupListeners();
    }
    /**
     * 设置监听器
     */
    setupListeners() {
        // 监听图标集变化
        this.iconManager.on('iconset:changed', (data) => {
            this.emit('config:changed', {
                type: 'icons',
                oldValue: data.oldSet,
                newValue: data.newSet,
            });
        });
        // 监听主题变化
        this.themeManager.on('themeChange', (data) => {
            this.emit('config:changed', {
                type: 'theme',
                oldValue: data.oldTheme,
                newValue: data.newTheme,
            });
        });
        // 监听语言变化
        this.i18nManager.on('localeChange', (data) => {
            this.emit('config:changed', {
                type: 'locale',
                oldValue: data.oldLocale,
                newValue: data.newLocale,
            });
        });
    }
    /**
     * 获取图标管理器
     */
    getIconManager() {
        return this.iconManager;
    }
    /**
     * 获取主题管理器
     */
    getThemeManager() {
        return this.themeManager;
    }
    /**
     * 获取多语言管理器
     */
    getI18nManager() {
        return this.i18nManager;
    }
    /**
     * 设置图标集
     */
    setIconSet(set) {
        this.iconManager.setDefaultIconSet(set);
    }
    /**
     * 获取当前图标集
     */
    getIconSet() {
        return this.iconManager.getCurrentIconSet();
    }
    /**
     * 获取可用图标集
     */
    getAvailableIconSets() {
        return this.iconManager.getAvailableIconSets();
    }
    /**
     * 设置主题
     */
    setTheme(themeName) {
        this.themeManager.setTheme(themeName);
    }
    /**
     * 获取当前主题
     */
    getTheme() {
        return this.themeManager.getCurrentTheme();
    }
    /**
     * 获取可用主题
     */
    getAvailableThemes() {
        return this.themeManager.getAvailableThemes();
    }
    /**
     * 添加自定义主题
     */
    addTheme(theme) {
        this.themeManager.addCustomTheme(theme);
    }
    /**
     * 设置语言
     */
    async setLocale(locale) {
        await this.i18nManager.setLocale(locale);
    }
    /**
     * 获取当前语言
     */
    getLocale() {
        return this.i18nManager.getLocale();
    }
    /**
     * 获取可用语言
     */
    getAvailableLocales() {
        return this.i18nManager.getAvailableLocales();
    }
    /**
     * 翻译
     */
    t(key, params) {
        return this.i18nManager.t(key, params);
    }
    /**
     * 更新配置
     */
    updateConfig(config) {
        this.config = { ...this.config, ...config };
        this.emit('config:updated', this.config);
    }
    /**
     * 获取完整配置
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * 导出配置（用于保存）
     */
    exportConfig() {
        const exportData = {
            iconSet: this.getIconSet(),
            theme: this.themeManager.getCurrentThemeName(),
            locale: this.getLocale(),
            ...this.config,
        };
        return JSON.stringify(exportData, null, 2);
    }
    /**
     * 导入配置（用于恢复）
     */
    importConfig(configJson) {
        try {
            const importData = JSON.parse(configJson);
            if (importData.iconSet)
                this.setIconSet(importData.iconSet);
            if (importData.theme)
                this.setTheme(importData.theme);
            if (importData.locale)
                this.setLocale(importData.locale);
            this.updateConfig(importData);
        }
        catch (error) {
            console.error('导入配置失败:', error);
            throw new Error('无效的配置文件');
        }
    }
    /**
     * 重置为默认配置
     */
    reset() {
        this.setIconSet('lucide');
        this.setTheme('light');
        this.setLocale('zh-CN');
        this.config = {};
        this.emit('config:reset');
    }
    /**
     * 销毁
     */
    destroy() {
        this.iconManager.destroy();
        this.removeAllListeners();
    }
}
// 全局单例
let globalConfigManager = null;
/**
 * 获取全局配置管理器
 */
export function getConfigManager(config) {
    if (!globalConfigManager)
        globalConfigManager = new ConfigManager(config);
    return globalConfigManager;
}
/**
 * 重置全局配置管理器
 */
export function resetConfigManager() {
    if (globalConfigManager) {
        globalConfigManager.destroy();
        globalConfigManager = null;
    }
}
//# sourceMappingURL=ConfigManager.js.map