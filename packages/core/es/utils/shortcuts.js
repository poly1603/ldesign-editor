/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { getConfigManager } from '../config/ConfigManager.js';
import { getFeatureFlags } from '../core/FeatureFlags.js';
import { getI18n } from '../i18n/index.js';
import { getIconManager } from '../icons/IconManager.js';
import { getThemeManager } from '../theme/index.js';
import { ui } from './simplify.js';

const quick = {
  /**
   * 切换到深色模式
   */
  darkMode() {
    getThemeManager().setTheme("dark");
  },
  /**
   * 切换到浅色模式
   */
  lightMode() {
    getThemeManager().setTheme("light");
  },
  /**
   * 切换主题
   */
  toggleTheme() {
    const theme = getThemeManager();
    const current = theme.getCurrentThemeName();
    theme.setTheme(current === "light" ? "dark" : "light");
  },
  /**
   * 中文模式
   */
  chinese() {
    return getI18n().setLocale("zh-CN");
  },
  /**
   * 英文模式
   */
  english() {
    return getI18n().setLocale("en-US");
  },
  /**
   * 日文模式
   */
  japanese() {
    return getI18n().setLocale("ja-JP");
  },
  /**
   * 启用AI
   */
  enableAI(apiKey) {
    const features = getFeatureFlags();
    features.enable("ai-service");
    features.enable("ai-correct");
    features.enable("ai-complete");
    if (apiKey) {
      const ai = require("../ai/AIService").getAIService();
      ai.updateApiKey("deepseek", apiKey);
    }
  },
  /**
   * 禁用AI
   */
  disableAI() {
    const features = getFeatureFlags();
    features.disable("ai-service");
    features.disable("ai-correct");
    features.disable("ai-complete");
    features.disable("ai-rewrite");
    features.disable("ai-translate");
  },
  /**
   * 全屏模式
   */
  fullscreen(editor2) {
    editor2.commands.execute("toggleFullscreen");
  },
  /**
   * 导出Markdown
   */
  exportMarkdown(editor2) {
    return editor2.getContent();
  },
  /**
   * 保存到本地
   */
  save(key = "editor-content", content) {
    localStorage.setItem(key, content || "");
  },
  /**
   * 从本地加载
   */
  load(key = "editor-content") {
    return localStorage.getItem(key);
  },
  /**
   * 清空编辑器
   */
  clear(editor2) {
    editor2.setContent("");
  }
};
function editor(instance) {
  return {
    /**
     * 获取纯文本
     */
    getText() {
      return instance.contentElement?.textContent || "";
    },
    /**
     * 获取HTML
     */
    getHTML() {
      return instance.getContent();
    },
    /**
     * 设置内容
     */
    setContent(html) {
      instance.setContent(html);
    },
    /**
     * 追加内容
     */
    append(html) {
      const current = instance.getContent();
      instance.setContent(current + html);
    },
    /**
     * 插入内容
     */
    insert(html) {
      instance.insertHTML(html);
    },
    /**
     * 字数统计
     */
    wordCount() {
      const text = this.getText();
      return text.trim().split(/\s+/).length;
    },
    /**
     * 字符统计
     */
    charCount() {
      return this.getText().length;
    },
    /**
     * 是否为空
     */
    isEmpty() {
      return this.getText().trim() === "";
    },
    /**
     * 聚焦编辑器
     */
    focus() {
      instance.contentElement?.focus();
    },
    /**
     * 失焦
     */
    blur() {
      instance.contentElement?.blur();
    },
    /**
     * 滚动到顶部
     */
    scrollTop() {
      instance.contentElement?.scrollTo(0, 0);
    },
    /**
     * 滚动到底部
     */
    scrollBottom() {
      const el = instance.contentElement;
      if (el)
        el.scrollTo(0, el.scrollHeight);
    }
  };
}
const batch = {
  /**
   * 启用博客功能
   */
  enableBlogFeatures() {
    const features = getFeatureFlags();
    features.enableBatch(["bold", "italic", "underline", "heading", "bullet-list", "ordered-list", "blockquote", "link", "image", "codeblock"]);
  },
  /**
   * 启用所有格式化
   */
  enableAllFormatting() {
    const features = getFeatureFlags();
    features.enableBatch(["bold", "italic", "underline", "strikethrough", "code", "subscript", "superscript", "text-color", "background-color", "font-size", "font-family", "line-height"]);
  },
  /**
   * 启用所有媒体
   */
  enableAllMedia() {
    const features = getFeatureFlags();
    features.enableBatch(["link", "image", "video", "audio", "file"]);
  },
  /**
   * 禁用所有AI
   */
  disableAllAI() {
    quick.disableAI();
  },
  /**
   * 禁用所有高级功能
   */
  disableAdvanced() {
    const features = getFeatureFlags();
    features.disableBatch(["collaboration", "version-control", "comments"]);
  }
};
const debug = {
  /**
   * 显示所有配置
   */
  showConfig() {
    const config = getConfigManager();
    console.log("\u914D\u7F6E\u7BA1\u7406\u5668:", config);
    console.log("\u5F53\u524D\u4E3B\u9898:", config.getTheme());
    console.log("\u5F53\u524D\u56FE\u6807\u96C6:", config.getIconSet());
    console.log("\u5F53\u524D\u8BED\u8A00:", config.getLocale());
  },
  /**
   * 显示功能状态
   */
  showFeatures() {
    const features = getFeatureFlags();
    console.log("\u529F\u80FD\u7EDF\u8BA1:", features.getStats());
    console.log("\u5DF2\u542F\u7528\u529F\u80FD:", features.getEnabled());
    console.log("\u61D2\u52A0\u8F7D\u529F\u80FD:", features.getLazyFeatures());
  },
  /**
   * 显示性能
   */
  showPerformance() {
    const monitor = require("./PerformanceMonitor").getPerformanceMonitor();
    console.log("\u6027\u80FD\u6307\u6807:", monitor.getMetrics());
    console.log(monitor.generateReport());
  },
  /**
   * 显示加载统计
   */
  showLoadStats() {
    const loader = require("../core/LazyLoader").getLazyLoader();
    console.log("\u52A0\u8F7D\u7EDF\u8BA1:", loader.getStats());
    console.log("\u52A0\u8F7D\u65F6\u95F4:", loader.getLoadTimes());
  },
  /**
   * 全部信息
   */
  showAll() {
    console.log("=== \u7F16\u8F91\u5668\u8C03\u8BD5\u4FE1\u606F ===\n");
    this.showConfig();
    console.log("\n");
    this.showFeatures();
    console.log("\n");
    this.showPerformance();
    console.log("\n");
    this.showLoadStats();
  }
};
const optimize = {
  /**
   * 启用性能模式
   */
  performanceMode() {
    const features = getFeatureFlags();
    features.onlyEnable(["basic-editing", "selection", "history", "bold", "italic", "underline", "heading", "paragraph", "bullet-list", "ordered-list", "link"]);
    ui.toast("\u6027\u80FD\u6A21\u5F0F\u5DF2\u542F\u7528", "success");
  },
  /**
   * 清理缓存
   */
  clearCache() {
    getIconManager();
    ui.toast("\u7F13\u5B58\u5DF2\u6E05\u7406", "success");
  },
  /**
   * 减少内存
   */
  reduceMemory() {
    const features = getFeatureFlags();
    features.disableBatch(["collaboration", "version-control", "video", "audio"]);
    ui.toast("\u5DF2\u7981\u7528\u9AD8\u5185\u5B58\u529F\u80FD", "info");
  },
  /**
   * 启用所有优化
   */
  enableAll() {
    this.performanceMode();
    this.clearCache();
    ui.toast("\u6240\u6709\u4F18\u5316\u5DF2\u542F\u7528", "success");
  }
};

export { batch, debug, editor, optimize, quick };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=shortcuts.js.map
