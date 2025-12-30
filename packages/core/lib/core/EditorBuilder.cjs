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

var ConfigManager = require('../config/ConfigManager.cjs');
var ToolbarManager = require('../ui/ToolbarManager.cjs');
var Editor = require('./Editor.cjs');
var FeatureFlags = require('./FeatureFlags.cjs');
var LazyLoader = require('./LazyLoader.cjs');
var PluginRegistry = require('./PluginRegistry.cjs');

class EditorBuilder {
  constructor() {
    this.options = {};
    this.features = FeatureFlags.getFeatureFlags();
    this.registry = PluginRegistry.getPluginRegistry();
    this.loader = LazyLoader.getLazyLoader();
    this.config = ConfigManager.getConfigManager();
    this.toolbarConfig = {};
  }
  /**
   * 设置容器元素
   */
  element(selector) {
    this.options.element = selector;
    return this;
  }
  /**
   * 设置初始内容
   */
  content(html) {
    this.options.content = html;
    return this;
  }
  /**
   * 设置是否可编辑
   */
  editable(value = true) {
    this.options.editable = value;
    return this;
  }
  /**
   * 启用功能
   */
  enableFeature(featureId) {
    this.features.enable(featureId);
    return this;
  }
  /**
   * 禁用功能
   */
  disableFeature(featureId) {
    this.features.disable(featureId);
    return this;
  }
  /**
   * 启用分类下所有功能
   */
  enableCategory(category) {
    this.features.enableCategory(category);
    return this;
  }
  /**
   * 禁用分类下所有功能
   */
  disableCategory(category) {
    this.features.disableCategory(category);
    return this;
  }
  /**
   * 只启用指定功能
   */
  onlyEnable(featureIds) {
    this.features.getAllFeatures().forEach((f) => {
      f.enabled = false;
    });
    featureIds.forEach((id) => {
      this.features.enable(id);
    });
    return this;
  }
  /**
   * 设置图标集
   */
  icons(iconSet) {
    this.config.setIconSet(iconSet);
    return this;
  }
  /**
   * 设置主题
   */
  theme(themeName) {
    this.config.setTheme(themeName);
    return this;
  }
  /**
   * 设置语言
   */
  async locale(locale) {
    await this.config.setLocale(locale);
    return this;
  }
  /**
   * 使用轻量级预设
   */
  lightweight() {
    this.onlyEnable(["basic-editing", "selection", "history", "bold", "italic", "underline", "heading", "paragraph", "bullet-list", "ordered-list", "link"]);
    this.toolbarConfig = {
      compact: true,
      showLabels: false,
      lazyLoad: true
    };
    return this;
  }
  /**
   * 使用功能完整预设
   */
  fullFeatured() {
    this.features.getAllFeatures().forEach((f) => {
      f.enabled = true;
    });
    this.toolbarConfig = {
      compact: false,
      showLabels: false,
      lazyLoad: true
    };
    return this;
  }
  /**
   * 只启用格式化功能
   */
  formatOnly() {
    this.onlyEnable(["basic-editing", "selection", "history", "bold", "italic", "underline", "strikethrough", "heading", "paragraph", "bullet-list", "ordered-list"]);
    return this;
  }
  /**
   * 启用所有媒体功能
   */
  withMedia() {
    this.enableCategory(FeatureFlags.FeatureCategory.MEDIA);
    return this;
  }
  /**
   * 启用AI功能
   */
  withAI(apiKey, provider = "deepseek") {
    this.enableCategory(FeatureFlags.FeatureCategory.AI);
    if (apiKey) {
      const ai = require("../ai/AIService").getAIService();
      ai.updateApiKey(provider, apiKey);
      ai.setProvider(provider);
    }
    return this;
  }
  /**
   * 启用表格功能
   */
  withTable() {
    this.enableCategory(FeatureFlags.FeatureCategory.TABLE);
    return this;
  }
  /**
   * 配置工具栏
   */
  toolbar(config) {
    this.toolbarConfig = {
      ...this.toolbarConfig,
      ...config
    };
    return this;
  }
  /**
   * 紧凑模式
   */
  compact(value = true) {
    this.toolbarConfig.compact = value;
    return this;
  }
  /**
   * 显示标签
   */
  showLabels(value = true) {
    this.toolbarConfig.showLabels = value;
    return this;
  }
  /**
   * 构建编辑器
   */
  async build() {
    const editor = new Editor.Editor(this.options);
    this.registry.setEditor(editor);
    const eagerFeatures = this.features.getEagerFeatures();
    const eagerIds = eagerFeatures.map((f) => f.id);
    if (eagerIds.length > 0)
      await this.loader.loadBatch(eagerIds);
    const lazyFeatures = this.features.getLazyFeatures();
    const lazyIds = lazyFeatures.map((f) => f.id);
    if (lazyIds.length > 0) {
      this.loader.preload(lazyIds);
    }
    if (this.toolbarConfig && Object.keys(this.toolbarConfig).length > 0) {
      const toolbar = new ToolbarManager.ToolbarManager(editor, this.toolbarConfig);
      const toolbarElement = toolbar.render();
      if (editor.element)
        editor.element.insertBefore(toolbarElement, editor.contentElement);
    }
    return editor;
  }
}
function createEditor() {
  return new EditorBuilder();
}
async function createLightweightEditor(element) {
  return createEditor().element(element).lightweight().build();
}
async function createFullFeaturedEditor(element) {
  return createEditor().element(element).fullFeatured().build();
}
async function createFormatOnlyEditor(element) {
  return createEditor().element(element).formatOnly().build();
}

exports.EditorBuilder = EditorBuilder;
exports.createEditor = createEditor;
exports.createFormatOnlyEditor = createFormatOnlyEditor;
exports.createFullFeaturedEditor = createFullFeaturedEditor;
exports.createLightweightEditor = createLightweightEditor;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=EditorBuilder.cjs.map
