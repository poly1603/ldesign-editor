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
var PluginRegistry = require('../core/PluginRegistry.cjs');

class PluginMarket extends event.EventEmitter {
  constructor() {
    super();
    this.registry = PluginRegistry.getPluginRegistry();
    this.plugins = /* @__PURE__ */ new Map();
    this.installed = /* @__PURE__ */ new Set();
    this.loadFeaturedPlugins();
  }
  /**
   * 加载精选插件
   */
  loadFeaturedPlugins() {
    const featured = [{
      id: "markdown-import",
      name: "Markdown\u5BFC\u5165",
      version: "1.0.0",
      author: "LDesign",
      description: "\u5BFC\u5165Markdown\u6587\u4EF6\u5E76\u81EA\u52A8\u8F6C\u6362\u4E3A\u5BCC\u6587\u672C",
      category: "import-export",
      tags: ["markdown", "import", "converter"],
      downloads: 1250,
      rating: 4.8,
      size: 25,
      icon: "\u{1F4C4}",
      license: "MIT",
      config: {
        preserveFormatting: true,
        convertTables: true
      }
    }, {
      id: "word-export",
      name: "Word\u5BFC\u51FA",
      version: "1.2.0",
      author: "Community",
      description: "\u5C06\u5185\u5BB9\u5BFC\u51FA\u4E3AWord\u6587\u6863(.docx)",
      category: "import-export",
      tags: ["word", "export", "docx"],
      downloads: 2100,
      rating: 4.6,
      size: 180,
      icon: "\u{1F4DD}",
      license: "MIT"
    }, {
      id: "latex-math",
      name: "LaTeX\u6570\u5B66\u516C\u5F0F",
      version: "2.0.0",
      author: "MathTeam",
      description: "\u652F\u6301LaTeX\u6570\u5B66\u516C\u5F0F\u7F16\u8F91\u548C\u6E32\u67D3",
      category: "formatting",
      tags: ["latex", "math", "formula"],
      downloads: 890,
      rating: 4.9,
      size: 120,
      icon: "\u2211",
      license: "MIT",
      dependencies: ["katex"]
    }, {
      id: "syntax-highlight",
      name: "\u8BED\u6CD5\u9AD8\u4EAE\u589E\u5F3A",
      version: "1.5.0",
      author: "CodeTeam",
      description: "\u652F\u630150+\u7F16\u7A0B\u8BED\u8A00\u7684\u8BED\u6CD5\u9AD8\u4EAE",
      category: "code",
      tags: ["code", "highlight", "syntax"],
      downloads: 3200,
      rating: 4.7,
      size: 250,
      icon: "\u{1F4BB}",
      license: "MIT",
      dependencies: ["prism"]
    }, {
      id: "chart-diagram",
      name: "\u56FE\u8868\u7ED8\u5236",
      version: "1.0.0",
      author: "DataViz",
      description: "\u63D2\u5165\u548C\u7F16\u8F91\u5404\u79CD\u56FE\u8868\uFF08\u6298\u7EBF\u56FE\u3001\u67F1\u72B6\u56FE\u3001\u997C\u56FE\u7B49\uFF09",
      category: "media",
      tags: ["chart", "diagram", "visualization"],
      downloads: 750,
      rating: 4.5,
      size: 200,
      icon: "\u{1F4CA}",
      license: "Apache-2.0",
      dependencies: ["chart.js"]
    }, {
      id: "git-sync",
      name: "Git\u540C\u6B65",
      version: "0.9.0",
      author: "DevTools",
      description: "\u81EA\u52A8\u540C\u6B65\u5185\u5BB9\u5230Git\u4ED3\u5E93",
      category: "advanced",
      tags: ["git", "sync", "version-control"],
      downloads: 520,
      rating: 4.3,
      size: 85,
      icon: "\u{1F504}",
      license: "MIT"
    }, {
      id: "spell-check",
      name: "\u62FC\u5199\u68C0\u67E5",
      version: "2.1.0",
      author: "LanguageTools",
      description: "\u5B9E\u65F6\u62FC\u5199\u548C\u8BED\u6CD5\u68C0\u67E5",
      category: "tool",
      tags: ["spell", "grammar", "check"],
      downloads: 1800,
      rating: 4.4,
      size: 60,
      icon: "\u2713",
      license: "MIT"
    }, {
      id: "voice-input",
      name: "\u8BED\u97F3\u8F93\u5165",
      version: "1.0.0",
      author: "VoiceTech",
      description: "\u652F\u6301\u8BED\u97F3\u8F93\u5165\u548C\u8BED\u97F3\u8F6C\u6587\u5B57",
      category: "input",
      tags: ["voice", "speech", "input"],
      downloads: 650,
      rating: 4.2,
      size: 110,
      icon: "\u{1F3A4}",
      license: "MIT"
    }];
    featured.forEach((plugin) => {
      this.plugins.set(plugin.id, plugin);
    });
  }
  /**
   * 搜索插件
   */
  search(query) {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.plugins.values()).filter((plugin) => plugin.name.toLowerCase().includes(lowerQuery) || plugin.description.toLowerCase().includes(lowerQuery) || plugin.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)));
  }
  /**
   * 按分类获取插件
   */
  getByCategory(category) {
    return Array.from(this.plugins.values()).filter((p) => p.category === category);
  }
  /**
   * 获取推荐插件
   */
  getRecommended(limit = 6) {
    return Array.from(this.plugins.values()).sort((a, b) => b.rating * b.downloads - a.rating * a.downloads).slice(0, limit);
  }
  /**
   * 获取热门插件
   */
  getPopular(limit = 6) {
    return Array.from(this.plugins.values()).sort((a, b) => b.downloads - a.downloads).slice(0, limit);
  }
  /**
   * 获取最新插件
   */
  getLatest(limit = 6) {
    return Array.from(this.plugins.values()).slice(-limit).reverse();
  }
  /**
   * 安装插件（模拟）
   */
  async install(pluginId) {
    const plugin = this.plugins.get(pluginId);
    if (!plugin)
      throw new Error(`Plugin ${pluginId} not found`);
    if (this.installed.has(pluginId))
      throw new Error(`Plugin ${pluginId} is already installed`);
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        console.log(`Checking dependency: ${dep}`);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    this.installed.add(pluginId);
    this.emit("plugin:installed", plugin);
    return true;
  }
  /**
   * 卸载插件
   */
  async uninstall(pluginId) {
    if (!this.installed.has(pluginId))
      throw new Error(`Plugin ${pluginId} is not installed`);
    this.installed.delete(pluginId);
    this.emit("plugin:uninstalled", {
      id: pluginId
    });
    return true;
  }
  /**
   * 检查是否已安装
   */
  isInstalled(pluginId) {
    return this.installed.has(pluginId);
  }
  /**
   * 获取已安装插件
   */
  getInstalled() {
    return Array.from(this.installed).map((id) => this.plugins.get(id)).filter(Boolean);
  }
  /**
   * 获取统计信息
   */
  getStats() {
    const categories = new Set(Array.from(this.plugins.values()).map((p) => p.category));
    return {
      total: this.plugins.size,
      installed: this.installed.size,
      available: this.plugins.size - this.installed.size,
      categories: Array.from(categories)
    };
  }
}
let marketInstance = null;
function getPluginMarket() {
  if (!marketInstance)
    marketInstance = new PluginMarket();
  return marketInstance;
}

exports.PluginMarket = PluginMarket;
exports.getPluginMarket = getPluginMarket;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=PluginMarket.cjs.map
