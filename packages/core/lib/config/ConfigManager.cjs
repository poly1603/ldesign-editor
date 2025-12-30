/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var event = require('../utils/event.cjs');
var index$1 = require('../i18n/index.cjs');
var IconManager = require('../icons/IconManager.cjs');
var index = require('../theme/index.cjs');

class ConfigManager extends event.EventEmitter {
  constructor(config = {}) {
    super();
    this.config = {};
    this.config = config;
    this.iconManager = IconManager.getIconManager(config.icons);
    this.themeManager = index.getThemeManager();
    if (config.theme) {
      if (config.theme.customThemes) {
        config.theme.customThemes.forEach((theme) => {
          this.themeManager.addCustomTheme(theme);
        });
      }
      if (config.theme.defaultTheme)
        this.themeManager.setTheme(config.theme.defaultTheme);
      if (config.theme.followSystem)
        this.themeManager.followSystemTheme();
    }
    this.i18nManager = index$1.getI18n(config.i18n);
    this.setupListeners();
  }
  /**
   * 设置监听器
   */
  setupListeners() {
    this.iconManager.on("iconset:changed", (data) => {
      this.emit("config:changed", {
        type: "icons",
        oldValue: data.oldSet,
        newValue: data.newSet
      });
    });
    this.themeManager.on("themeChange", (data) => {
      this.emit("config:changed", {
        type: "theme",
        oldValue: data.oldTheme,
        newValue: data.newTheme
      });
    });
    this.i18nManager.on("localeChange", (data) => {
      this.emit("config:changed", {
        type: "locale",
        oldValue: data.oldLocale,
        newValue: data.newLocale
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
    this.config = {
      ...this.config,
      ...config
    };
    this.emit("config:updated", this.config);
  }
  /**
   * 获取完整配置
   */
  getConfig() {
    return {
      ...this.config
    };
  }
  /**
   * 导出配置（用于保存）
   */
  exportConfig() {
    const exportData = {
      iconSet: this.getIconSet(),
      theme: this.themeManager.getCurrentThemeName(),
      locale: this.getLocale(),
      ...this.config
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
    } catch (error) {
      console.error("\u5BFC\u5165\u914D\u7F6E\u5931\u8D25:", error);
      throw new Error("\u65E0\u6548\u7684\u914D\u7F6E\u6587\u4EF6");
    }
  }
  /**
   * 重置为默认配置
   */
  reset() {
    this.setIconSet("lucide");
    this.setTheme("light");
    this.setLocale("zh-CN");
    this.config = {};
    this.emit("config:reset");
  }
  /**
   * 销毁
   */
  destroy() {
    this.iconManager.destroy();
    if (typeof this.removeAllListeners === "function") {
      this.removeAllListeners();
    }
  }
}
let globalConfigManager = null;
function getConfigManager(config) {
  if (!globalConfigManager)
    globalConfigManager = new ConfigManager(config);
  return globalConfigManager;
}
function resetConfigManager() {
  if (globalConfigManager) {
    globalConfigManager.destroy();
    globalConfigManager = null;
  }
}

exports.ConfigManager = ConfigManager;
exports.getConfigManager = getConfigManager;
exports.resetConfigManager = resetConfigManager;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ConfigManager.cjs.map
