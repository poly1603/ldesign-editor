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

class Plugin {
  /**
   * 安装插件
   * @param editor - 编辑器实例
   */
  install(editor) {
    this.editor = editor;
    if (this.config.commands) {
      Object.entries(this.config.commands).forEach(([name, command]) => {
        editor.commands.register(name, command);
      });
    }
    if (this.config.keys) {
      Object.entries(this.config.keys).forEach(([keys, command]) => {
        editor.keymap.register(keys, command);
      });
    }
    if (this.config.schema && "extendSchema" in editor)
      editor.extendSchema(this.config.schema);
    this.onInstall?.(editor);
  }
  /**
   * 销毁插件
   * 清理插件注册的所有资源
   */
  destroy() {
    if (!this.editor)
      return;
    if (this.config.commands) {
      Object.keys(this.config.commands).forEach((name) => {
        this.editor.commands.unregister(name);
      });
    }
    if (this.config.keys) {
      Object.keys(this.config.keys).forEach((keys) => {
        this.editor.keymap.unregister(keys);
      });
    }
    this.onDestroy?.(this.editor);
    this.editor = void 0;
  }
}
class PluginManager {
  constructor(editor) {
    this.plugins = /* @__PURE__ */ new Map();
    this.editor = editor;
  }
  /**
   * 注册插件
   * @param plugin - 要注册的插件实例
   */
  register(plugin) {
    if (this.plugins.has(plugin.name)) {
      if (process.env.NODE_ENV !== "production")
        console.warn(`[PluginManager] Plugin "${plugin.name}" is already registered`);
      return;
    }
    this.plugins.set(plugin.name, plugin);
    if (plugin.install) {
      try {
        plugin.install(this.editor);
        if (process.env.NODE_ENV !== "production")
          console.log(`[PluginManager] Plugin "${plugin.name}" installed successfully`);
      } catch (error) {
        console.error(`[PluginManager] Failed to install plugin "${plugin.name}":`, error);
        this.plugins.delete(plugin.name);
        throw error;
      }
    }
  }
  /**
   * 获取插件实例
   * @param name - 插件名称
   * @returns 插件实例，如果不存在则返回undefined
   */
  get(name) {
    return this.plugins.get(name);
  }
  /**
   * 注销插件
   * @param name - 插件名称
   */
  unregister(name) {
    const plugin = this.plugins.get(name);
    if (plugin) {
      try {
        plugin.destroy?.();
      } catch (error) {
        console.error(`[PluginManager] Error destroying plugin "${name}":`, error);
      }
      this.plugins.delete(name);
    }
  }
  /**
   * 获取所有插件
   * @returns 所有插件实例的数组
   */
  getAll() {
    return Array.from(this.plugins.values());
  }
  /**
   * 检查插件是否已注册
   * @param name - 插件名称
   * @returns 如果插件已注册返回true，否则返回false
   */
  has(name) {
    return this.plugins.has(name);
  }
  /**
   * 清除所有插件
   * 销毁并移除所有已注册的插件
   */
  clear() {
    this.plugins.forEach((plugin, name) => {
      try {
        plugin.destroy?.();
      } catch (error) {
        console.error(`[PluginManager] Error destroying plugin "${name}":`, error);
      }
    });
    this.plugins.clear();
  }
}
function createPlugin(config) {
  return {
    name: config.name,
    config,
    install(editor) {
      if (process.env.NODE_ENV !== "production")
        console.log(`[createPlugin] Installing plugin: ${config.name}`);
      if (config.commands) {
        Object.entries(config.commands).forEach(([name, command]) => {
          editor.commands.register(name, command);
          if (process.env.NODE_ENV !== "production")
            console.log(`[createPlugin] Command "${name}" registered for plugin: ${config.name}`);
        });
      }
      if (config.keys) {
        Object.entries(config.keys).forEach(([keys, command]) => {
          editor.keymap.register(keys, command);
        });
      }
      if (config.schema && "extendSchema" in editor)
        editor.extendSchema(config.schema);
      if (config.init) {
        const result = config.init(editor);
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(`[createPlugin] Error in init hook for plugin "${config.name}":`, error);
          });
        }
      }
    },
    destroy() {
      if (config.destroy) {
        const result = config.destroy();
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(`[createPlugin] Error in destroy hook for plugin "${config.name}":`, error);
          });
        }
      }
    }
  };
}

exports.Plugin = Plugin;
exports.PluginManager = PluginManager;
exports.createPlugin = createPlugin;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=Plugin.cjs.map
