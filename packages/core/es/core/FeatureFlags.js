/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { EventEmitter } from '../utils/event.js';

var FeatureCategory = /* @__PURE__ */ ((FeatureCategory2) => {
  FeatureCategory2["CORE"] = "core";
  FeatureCategory2["FORMAT"] = "format";
  FeatureCategory2["INSERT"] = "insert";
  FeatureCategory2["MEDIA"] = "media";
  FeatureCategory2["TABLE"] = "table";
  FeatureCategory2["AI"] = "ai";
  FeatureCategory2["TOOL"] = "tool";
  FeatureCategory2["ADVANCED"] = "advanced";
  return FeatureCategory2;
})(FeatureCategory || {});
class FeatureFlags extends EventEmitter {
  constructor() {
    super();
    this.features = /* @__PURE__ */ new Map();
    this.loadedFeatures = /* @__PURE__ */ new Set();
    this.initializeDefaultFeatures();
  }
  /**
   * 初始化默认功能列表
   */
  initializeDefaultFeatures() {
    const defaultFeatures = [
      // 核心功能（始终启用，立即加载）
      {
        id: "basic-editing",
        name: "\u57FA\u7840\u7F16\u8F91",
        category: "core" /* CORE */,
        enabled: true,
        lazy: false
      },
      {
        id: "selection",
        name: "\u9009\u533A\u7BA1\u7406",
        category: "core" /* CORE */,
        enabled: true,
        lazy: false
      },
      {
        id: "history",
        name: "\u64A4\u9500\u91CD\u505A",
        category: "core" /* CORE */,
        enabled: true,
        lazy: false
      },
      // 格式化功能（可配置）
      {
        id: "bold",
        name: "\u52A0\u7C97",
        category: "format" /* FORMAT */,
        enabled: true,
        lazy: false
      },
      {
        id: "italic",
        name: "\u659C\u4F53",
        category: "format" /* FORMAT */,
        enabled: true,
        lazy: false
      },
      {
        id: "underline",
        name: "\u4E0B\u5212\u7EBF",
        category: "format" /* FORMAT */,
        enabled: true,
        lazy: false
      },
      {
        id: "strikethrough",
        name: "\u5220\u9664\u7EBF",
        category: "format" /* FORMAT */,
        enabled: true,
        lazy: true
      },
      {
        id: "code",
        name: "\u884C\u5185\u4EE3\u7801",
        category: "format" /* FORMAT */,
        enabled: true,
        lazy: true
      },
      {
        id: "subscript",
        name: "\u4E0B\u6807",
        category: "format" /* FORMAT */,
        enabled: true,
        lazy: true
      },
      {
        id: "superscript",
        name: "\u4E0A\u6807",
        category: "format" /* FORMAT */,
        enabled: true,
        lazy: true
      },
      {
        id: "text-color",
        name: "\u6587\u5B57\u989C\u8272",
        category: "format" /* FORMAT */,
        enabled: true,
        lazy: true
      },
      {
        id: "background-color",
        name: "\u80CC\u666F\u989C\u8272",
        category: "format" /* FORMAT */,
        enabled: true,
        lazy: true
      },
      {
        id: "font-size",
        name: "\u5B57\u53F7",
        category: "format" /* FORMAT */,
        enabled: true,
        lazy: true
      },
      {
        id: "font-family",
        name: "\u5B57\u4F53",
        category: "format" /* FORMAT */,
        enabled: true,
        lazy: true
      },
      {
        id: "line-height",
        name: "\u884C\u9AD8",
        category: "format" /* FORMAT */,
        enabled: true,
        lazy: true
      },
      // 插入功能（可配置，懒加载）
      {
        id: "heading",
        name: "\u6807\u9898",
        category: "insert" /* INSERT */,
        enabled: true,
        lazy: false
      },
      {
        id: "paragraph",
        name: "\u6BB5\u843D",
        category: "insert" /* INSERT */,
        enabled: true,
        lazy: false
      },
      {
        id: "blockquote",
        name: "\u5F15\u7528\u5757",
        category: "insert" /* INSERT */,
        enabled: true,
        lazy: true
      },
      {
        id: "codeblock",
        name: "\u4EE3\u7801\u5757",
        category: "insert" /* INSERT */,
        enabled: true,
        lazy: true
      },
      {
        id: "bullet-list",
        name: "\u65E0\u5E8F\u5217\u8868",
        category: "insert" /* INSERT */,
        enabled: true,
        lazy: false
      },
      {
        id: "ordered-list",
        name: "\u6709\u5E8F\u5217\u8868",
        category: "insert" /* INSERT */,
        enabled: true,
        lazy: false
      },
      {
        id: "task-list",
        name: "\u4EFB\u52A1\u5217\u8868",
        category: "insert" /* INSERT */,
        enabled: true,
        lazy: true
      },
      {
        id: "horizontal-rule",
        name: "\u5206\u9694\u7EBF",
        category: "insert" /* INSERT */,
        enabled: true,
        lazy: true
      },
      // 媒体功能（懒加载）
      {
        id: "link",
        name: "\u94FE\u63A5",
        category: "media" /* MEDIA */,
        enabled: true,
        lazy: false
      },
      {
        id: "image",
        name: "\u56FE\u7247",
        category: "media" /* MEDIA */,
        enabled: true,
        lazy: true
      },
      {
        id: "video",
        name: "\u89C6\u9891",
        category: "media" /* MEDIA */,
        enabled: true,
        lazy: true
      },
      {
        id: "audio",
        name: "\u97F3\u9891",
        category: "media" /* MEDIA */,
        enabled: true,
        lazy: true
      },
      {
        id: "file",
        name: "\u6587\u4EF6",
        category: "media" /* MEDIA */,
        enabled: true,
        lazy: true
      },
      // 表格功能（懒加载）
      {
        id: "table",
        name: "\u8868\u683C",
        category: "table" /* TABLE */,
        enabled: true,
        lazy: true
      },
      {
        id: "table-row",
        name: "\u8868\u683C\u884C\u64CD\u4F5C",
        category: "table" /* TABLE */,
        enabled: true,
        lazy: true,
        dependencies: ["table"]
      },
      {
        id: "table-column",
        name: "\u8868\u683C\u5217\u64CD\u4F5C",
        category: "table" /* TABLE */,
        enabled: true,
        lazy: true,
        dependencies: ["table"]
      },
      {
        id: "table-cell",
        name: "\u5355\u5143\u683C\u64CD\u4F5C",
        category: "table" /* TABLE */,
        enabled: true,
        lazy: true,
        dependencies: ["table"]
      },
      // 工具功能（懒加载）
      {
        id: "find-replace",
        name: "\u67E5\u627E\u66FF\u6362",
        category: "tool" /* TOOL */,
        enabled: true,
        lazy: true
      },
      {
        id: "word-count",
        name: "\u5B57\u6570\u7EDF\u8BA1",
        category: "tool" /* TOOL */,
        enabled: true,
        lazy: true
      },
      {
        id: "fullscreen",
        name: "\u5168\u5C4F",
        category: "tool" /* TOOL */,
        enabled: true,
        lazy: false
      },
      {
        id: "export",
        name: "\u5BFC\u51FA",
        category: "tool" /* TOOL */,
        enabled: true,
        lazy: true
      },
      {
        id: "template",
        name: "\u6A21\u677F",
        category: "tool" /* TOOL */,
        enabled: true,
        lazy: true
      },
      {
        id: "emoji",
        name: "\u8868\u60C5",
        category: "tool" /* TOOL */,
        enabled: true,
        lazy: true
      },
      // AI功能（默认禁用，懒加载）
      {
        id: "ai-correct",
        name: "AI\u7EA0\u9519",
        category: "ai" /* AI */,
        enabled: false,
        lazy: true,
        dependencies: ["ai-service"]
      },
      {
        id: "ai-complete",
        name: "AI\u8865\u5168",
        category: "ai" /* AI */,
        enabled: false,
        lazy: true,
        dependencies: ["ai-service"]
      },
      {
        id: "ai-rewrite",
        name: "AI\u91CD\u5199",
        category: "ai" /* AI */,
        enabled: false,
        lazy: true,
        dependencies: ["ai-service"]
      },
      {
        id: "ai-translate",
        name: "AI\u7FFB\u8BD1",
        category: "ai" /* AI */,
        enabled: false,
        lazy: true,
        dependencies: ["ai-service"]
      },
      {
        id: "ai-service",
        name: "AI\u670D\u52A1",
        category: "ai" /* AI */,
        enabled: false,
        lazy: true
      },
      // 高级功能（懒加载）
      {
        id: "collaboration",
        name: "\u534F\u4F5C\u7F16\u8F91",
        category: "advanced" /* ADVANCED */,
        enabled: false,
        lazy: true
      },
      {
        id: "version-control",
        name: "\u7248\u672C\u63A7\u5236",
        category: "advanced" /* ADVANCED */,
        enabled: false,
        lazy: true
      },
      {
        id: "comments",
        name: "\u8BC4\u8BBA\u6279\u6CE8",
        category: "advanced" /* ADVANCED */,
        enabled: false,
        lazy: true
      }
    ];
    defaultFeatures.forEach((feature) => {
      this.features.set(feature.id, feature);
    });
  }
  /**
   * 注册功能
   */
  register(feature) {
    if (this.features.has(feature.id)) {
      console.warn(`Feature "${feature.id}" is already registered`);
      return;
    }
    this.features.set(feature.id, feature);
    this.emit("feature:registered", feature);
  }
  /**
   * 启用功能
   */
  enable(featureId) {
    const feature = this.features.get(featureId);
    if (!feature) {
      console.error(`Feature "${featureId}" not found`);
      return;
    }
    feature.enabled = true;
    this.emit("feature:enabled", feature);
  }
  /**
   * 禁用功能
   */
  disable(featureId) {
    const feature = this.features.get(featureId);
    if (!feature) {
      console.error(`Feature "${featureId}" not found`);
      return;
    }
    feature.enabled = false;
    this.emit("feature:disabled", feature);
  }
  /**
   * 切换功能
   */
  toggle(featureId) {
    const feature = this.features.get(featureId);
    if (!feature) {
      console.error(`Feature "${featureId}" not found`);
      return false;
    }
    feature.enabled = !feature.enabled;
    this.emit(feature.enabled ? "feature:enabled" : "feature:disabled", feature);
    return feature.enabled;
  }
  /**
   * 检查功能是否启用
   */
  isEnabled(featureId) {
    return this.features.get(featureId)?.enabled || false;
  }
  /**
   * 检查功能是否已加载
   */
  isLoaded(featureId) {
    return this.loadedFeatures.has(featureId);
  }
  /**
   * 标记功能为已加载
   */
  markAsLoaded(featureId) {
    this.loadedFeatures.add(featureId);
    this.emit("feature:loaded", {
      id: featureId
    });
  }
  /**
   * 获取功能配置
   */
  getFeature(featureId) {
    return this.features.get(featureId) || null;
  }
  /**
   * 获取所有功能
   */
  getAllFeatures() {
    return Array.from(this.features.values());
  }
  /**
   * 按分类获取功能
   */
  getByCategory(category) {
    return this.getAllFeatures().filter((f) => f.category === category);
  }
  /**
   * 获取已启用的功能
   */
  getEnabled() {
    return this.getAllFeatures().filter((f) => f.enabled);
  }
  /**
   * 获取需要懒加载的功能
   */
  getLazyFeatures() {
    return this.getAllFeatures().filter((f) => f.lazy && f.enabled);
  }
  /**
   * 获取立即加载的功能
   */
  getEagerFeatures() {
    return this.getAllFeatures().filter((f) => !f.lazy && f.enabled);
  }
  /**
   * 批量启用
   */
  enableBatch(featureIds) {
    featureIds.forEach((id) => this.enable(id));
  }
  /**
   * 批量禁用
   */
  disableBatch(featureIds) {
    featureIds.forEach((id) => this.disable(id));
  }
  /**
   * 启用分类下所有功能
   */
  enableCategory(category) {
    this.getByCategory(category).forEach((f) => {
      f.enabled = true;
    });
    this.emit("category:enabled", {
      category
    });
  }
  /**
   * 禁用分类下所有功能
   */
  disableCategory(category) {
    this.getByCategory(category).forEach((f) => {
      f.enabled = false;
    });
    this.emit("category:disabled", {
      category
    });
  }
  /**
   * 导出配置
   */
  exportConfig() {
    const config = {};
    this.features.forEach((feature, id) => {
      config[id] = {
        enabled: feature.enabled,
        config: feature.config
      };
    });
    return config;
  }
  /**
   * 导入配置
   */
  importConfig(config) {
    Object.entries(config).forEach(([id, value]) => {
      const feature = this.features.get(id);
      if (feature) {
        if (typeof value === "boolean") {
          feature.enabled = value;
        } else if (typeof value === "object") {
          feature.enabled = value.enabled !== false;
          if (value.config)
            feature.config = {
              ...feature.config,
              ...value.config
            };
        }
      }
    });
    this.emit("config:imported");
  }
  /**
   * 重置为默认配置
   */
  reset() {
    this.features.clear();
    this.loadedFeatures.clear();
    this.initializeDefaultFeatures();
    this.emit("config:reset");
  }
  /**
   * 获取统计信息
   */
  getStats() {
    const all = this.getAllFeatures();
    return {
      total: all.length,
      enabled: all.filter((f) => f.enabled).length,
      disabled: all.filter((f) => !f.enabled).length,
      loaded: this.loadedFeatures.size,
      lazy: all.filter((f) => f.lazy).length
    };
  }
}
let globalFeatureFlags = null;
function getFeatureFlags() {
  if (!globalFeatureFlags)
    globalFeatureFlags = new FeatureFlags();
  return globalFeatureFlags;
}
function resetFeatureFlags() {
  if (globalFeatureFlags) {
    globalFeatureFlags.reset();
    globalFeatureFlags = null;
  }
}

export { FeatureCategory, FeatureFlags, getFeatureFlags, resetFeatureFlags };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=FeatureFlags.js.map
