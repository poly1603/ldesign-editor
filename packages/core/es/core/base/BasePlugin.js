/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { EventEmitter } from '../../utils/event.js';

class BasePlugin extends EventEmitter {
  constructor(name, config) {
    super();
    this.initialized = false;
    this.name = name;
    this.config = {
      ...this.getDefaultConfig(),
      ...config
    };
  }
  /**
   * 初始化插件
   */
  async init(editor) {
    if (this.initialized) {
      console.warn(`Plugin "${this.name}" is already initialized`);
      return;
    }
    this.editor = editor;
    try {
      await this.onInit();
      this.initialized = true;
      this.emit("plugin:initialized", {
        name: this.name
      });
    } catch (error) {
      console.error(`Failed to initialize plugin "${this.name}":`, error);
      throw error;
    }
  }
  /**
   * 销毁插件
   */
  async destroy() {
    if (!this.initialized)
      return;
    try {
      await this.onDestroy();
      this.initialized = false;
      this.removeAllListeners();
      this.emit("plugin:destroyed", {
        name: this.name
      });
    } catch (error) {
      console.error(`Failed to destroy plugin "${this.name}":`, error);
      throw error;
    }
  }
  /**
   * 更新配置
   */
  updateConfig(config) {
    this.config = {
      ...this.config,
      ...config
    };
    this.onConfigUpdate(config);
    this.emit("plugin:config-updated", {
      name: this.name,
      config
    });
  }
  /**
   * 配置更新回调（子类可选实现）
   */
  onConfigUpdate(config) {
  }
  /**
   * 启用插件
   */
  enable() {
    if (!this.config.enabled) {
      this.config.enabled = true;
      this.onEnable();
      this.emit("plugin:enabled", {
        name: this.name
      });
    }
  }
  /**
   * 禁用插件
   */
  disable() {
    if (this.config.enabled) {
      this.config.enabled = false;
      this.onDisable();
      this.emit("plugin:disabled", {
        name: this.name
      });
    }
  }
  /**
   * 启用回调（子类可选实现）
   */
  onEnable() {
  }
  /**
   * 禁用回调（子类可选实现）
   */
  onDisable() {
  }
  /**
   * 检查插件是否已初始化
   */
  isInitialized() {
    return this.initialized;
  }
  /**
   * 检查插件是否已启用
   */
  isEnabled() {
    return this.config.enabled !== false;
  }
  /**
   * 获取编辑器实例
   */
  getEditor() {
    if (!this.editor)
      throw new Error("Editor instance is not available");
    return this.editor;
  }
}

export { BasePlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=BasePlugin.js.map
