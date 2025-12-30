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
var feather = require('./sets/feather.cjs');
var lucide = require('./sets/lucide.cjs');
var material = require('./sets/material.cjs');

class IconManager extends event.EventEmitter {
  constructor(config = {}) {
    super();
    this.iconSets = /* @__PURE__ */ new Map();
    this.currentSet = "lucide";
    this.defaultStyle = {
      size: 20,
      strokeWidth: 2,
      color: "currentColor"
    };
    this.iconCache = /* @__PURE__ */ new Map();
    this.config = {
      defaultSet: "lucide",
      enableCache: true,
      ...config
    };
    if (config.defaultStyle)
      this.defaultStyle = {
        ...this.defaultStyle,
        ...config.defaultStyle
      };
    this.initializeBuiltinSets();
    if (config.customSets) {
      config.customSets.forEach((set, name) => {
        this.registerIconSet(set);
      });
    }
    this.currentSet = config.defaultSet || "lucide";
  }
  /**
   * 初始化内置图标集
   */
  initializeBuiltinSets() {
    this.registerIconSet(new lucide.LucideIconSet());
    this.registerIconSet(new feather.FeatherIconSet());
    this.registerIconSet(new material.MaterialIconSet());
  }
  /**
   * 获取图标定义
   */
  getIcon(name, set) {
    const targetSet = set || this.currentSet;
    const iconSet = this.iconSets.get(targetSet);
    if (!iconSet) {
      console.warn(`Icon set "${targetSet}" not found`);
      return null;
    }
    const mappedName = this.getMappedIconName(name, targetSet);
    let icon = iconSet.getIcon(mappedName);
    if (!icon && mappedName !== name)
      icon = iconSet.getIcon(name);
    if (!icon && this.config.fallbackIcon)
      icon = iconSet.getIcon(this.config.fallbackIcon);
    return icon;
  }
  /**
   * 渲染图标为HTML字符串
   */
  renderIcon(name, options = {}) {
    const cacheKey = this.getCacheKey(name, options);
    if (this.config.enableCache && this.iconCache.has(cacheKey))
      return this.iconCache.get(cacheKey);
    const icon = this.getIcon(name);
    if (!icon) {
      console.warn(`Icon "${name}" not found in set "${this.currentSet}"`);
      return this.renderFallbackIcon(name, options);
    }
    const style = {
      ...this.defaultStyle,
      ...options
    };
    const svg = this.buildSvg(icon, style);
    if (this.config.enableCache)
      this.iconCache.set(cacheKey, svg);
    return svg;
  }
  /**
   * 创建图标DOM元素
   */
  createIconElement(name, options = {}) {
    const wrapper = document.createElement("span");
    wrapper.className = `icon icon-${name}`;
    if (options.className)
      wrapper.className += ` ${options.className}`;
    if (options.inline) {
      wrapper.style.display = "inline-block";
      wrapper.style.verticalAlign = "middle";
    }
    wrapper.innerHTML = this.renderIcon(name, options);
    if (options.spinning) {
      wrapper.classList.add("icon-spinning");
      this.addSpinningStyles();
    }
    return wrapper;
  }
  /**
   * 设置默认图标集
   */
  setDefaultIconSet(set) {
    if (!this.iconSets.has(set))
      throw new Error(`Icon set "${set}" is not registered`);
    const oldSet = this.currentSet;
    this.currentSet = set;
    this.iconCache.clear();
    this.emit("iconset:changed", {
      oldSet,
      newSet: set
    });
    if (typeof window !== "undefined")
      this.replaceAllIcons(set);
  }
  /**
   * 获取当前图标集
   */
  getCurrentIconSet() {
    return this.currentSet;
  }
  /**
   * 注册自定义图标
   */
  registerIcon(name, svg, set = "custom") {
    let iconSet = this.iconSets.get(set);
    if (!iconSet && set === "custom") {
      iconSet = this.createCustomIconSet();
      this.registerIconSet(iconSet);
    }
    if (!iconSet)
      throw new Error(`Icon set "${set}" not found`);
    const icon = {
      name,
      svg,
      viewBox: "0 0 24 24"
    };
    iconSet.icons.set(name, icon);
    this.clearIconCache(name);
    this.emit("icon:registered", {
      name,
      set
    });
  }
  /**
   * 注册图标集
   */
  registerIconSet(set) {
    this.iconSets.set(set.name, set);
    this.emit("iconset:registered", set.name);
  }
  /**
   * 获取所有可用的图标集
   */
  getAvailableIconSets() {
    return Array.from(this.iconSets.keys());
  }
  /**
   * 搜索图标
   */
  searchIcons(query, set) {
    const targetSet = set || this.currentSet;
    const iconSet = this.iconSets.get(targetSet);
    if (!iconSet)
      return [];
    return iconSet.searchIcons(query);
  }
  /**
   * 按分类获取图标
   */
  getIconsByCategory(category, set) {
    const targetSet = set || this.currentSet;
    const iconSet = this.iconSets.get(targetSet);
    if (!iconSet)
      return [];
    return iconSet.getIconsByCategory(category);
  }
  /**
   * 批量替换所有图标
   */
  replaceAllIcons(set) {
    if (!this.iconSets.has(set)) {
      console.warn(`Icon set "${set}" not found`);
      return;
    }
    const iconElements = document.querySelectorAll(".icon[data-icon-name]");
    iconElements.forEach((element) => {
      const iconName = element.getAttribute("data-icon-name");
      if (!iconName)
        return;
      const options = this.extractOptionsFromElement(element);
      const newIcon = this.renderIcon(iconName, options);
      element.innerHTML = newIcon;
    });
    this.emit("icons:replaced", {
      set,
      count: iconElements.length
    });
  }
  /**
   * 设置编辑器图标映射
   */
  setEditorIconMap(map) {
    this.editorIconMap = {
      ...this.getDefaultEditorIconMap(),
      ...map
    };
    this.emit("iconmap:updated", this.editorIconMap);
  }
  /**
   * 构建SVG字符串
   */
  buildSvg(icon, style) {
    const size = typeof style.size === "number" ? `${style.size}px` : style.size || "20px";
    const viewBox = icon.viewBox || "0 0 24 24";
    let pathContent = icon.svg;
    if (icon.svg.includes("<svg")) {
      const match = icon.svg.match(/<svg[^>]*>(.*)<\/svg>/s);
      if (match)
        pathContent = match[1];
    }
    return `
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="${size}" 
        height="${size}" 
        viewBox="${viewBox}"
        fill="${style.fill || "none"}"
        stroke="${style.color || "currentColor"}"
        stroke-width="${style.strokeWidth || 2}"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon-svg"
        data-icon-name="${icon.name}"
      >
        ${pathContent}
      </svg>
    `.trim();
  }
  /**
   * 渲染后备图标
   */
  renderFallbackIcon(name, options) {
    const size = typeof options.size === "number" ? `${options.size}px` : options.size || "20px";
    return `
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="${size}" 
        height="${size}" 
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="icon-svg icon-fallback"
      >
        <circle cx="12" cy="12" r="10" />
        <text x="12" y="16" text-anchor="middle" font-size="12" fill="currentColor" stroke="none">?</text>
      </svg>
    `.trim();
  }
  /**
   * 获取缓存键
   */
  getCacheKey(name, options) {
    return `${this.currentSet}:${name}:${JSON.stringify(options)}`;
  }
  /**
   * 清空特定图标的缓存
   */
  clearIconCache(name) {
    const keysToDelete = [];
    this.iconCache.forEach((_, key) => {
      if (key.includes(`:${name}:`))
        keysToDelete.push(key);
    });
    keysToDelete.forEach((key) => this.iconCache.delete(key));
  }
  /**
   * 从元素提取选项
   */
  extractOptionsFromElement(element) {
    const svg = element.querySelector("svg");
    if (!svg)
      return {};
    return {
      size: svg.getAttribute("width") || void 0,
      color: svg.getAttribute("stroke") || void 0,
      strokeWidth: svg.getAttribute("stroke-width") ? Number.parseFloat(svg.getAttribute("stroke-width")) : void 0,
      fill: svg.getAttribute("fill") || void 0
    };
  }
  /**
   * 创建自定义图标集
   */
  createCustomIconSet() {
    return {
      name: "custom",
      displayName: "Custom Icons",
      icons: /* @__PURE__ */ new Map(),
      getIcon(name) {
        return this.icons.get(name) || null;
      },
      getAllIcons() {
        return Array.from(this.icons.values());
      },
      getIconsByCategory(category) {
        return Array.from(this.icons.values()).filter((icon) => icon.category === category);
      },
      searchIcons(query) {
        const lowerQuery = query.toLowerCase();
        return Array.from(this.icons.values()).filter((icon) => icon.name.toLowerCase().includes(lowerQuery) || icon.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)));
      }
    };
  }
  /**
   * 添加旋转样式
   */
  addSpinningStyles() {
    if (document.getElementById("icon-spinning-styles"))
      return;
    const style = document.createElement("style");
    style.id = "icon-spinning-styles";
    style.textContent = `
      @keyframes icon-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .icon-spinning svg {
        animation: icon-spin 1s linear infinite;
      }
    `;
    document.head.appendChild(style);
  }
  /**
   * 获取映射的图标名称
   */
  getMappedIconName(name, set) {
    if (!this.editorIconMap)
      this.editorIconMap = this.getDefaultEditorIconMap();
    const mappedName = this.editorIconMap[name];
    if (mappedName)
      return mappedName;
    return name;
  }
  /**
   * 获取默认的编辑器图标映射
   */
  getDefaultEditorIconMap() {
    return {
      bold: "bold",
      italic: "italic",
      underline: "underline",
      strikethrough: "strikethrough",
      code: "code",
      subscript: "subscript",
      superscript: "superscript",
      clearFormat: "remove-formatting",
      heading: "heading",
      heading1: "heading-1",
      heading2: "heading-2",
      heading3: "heading-3",
      paragraph: "pilcrow",
      blockquote: "quote",
      bulletList: "list",
      orderedList: "list-ordered",
      taskList: "list-checks",
      indent: "indent",
      outdent: "outdent",
      alignLeft: "align-left",
      alignCenter: "align-center",
      alignRight: "align-right",
      alignJustify: "align-justify",
      link: "link",
      unlink: "unlink",
      image: "image",
      video: "video",
      table: "table",
      horizontalRule: "separator-horizontal",
      emoji: "smile",
      template: "file-text",
      undo: "undo",
      redo: "redo",
      copy: "copy",
      cut: "scissors",
      paste: "clipboard",
      delete: "trash",
      selectAll: "select-all",
      search: "search",
      replace: "replace",
      fullscreen: "maximize",
      exitFullscreen: "minimize",
      preview: "eye",
      sourceCode: "code-2",
      save: "save",
      open: "folder-open",
      export: "download",
      import: "upload",
      print: "printer",
      settings: "settings",
      help: "help-circle",
      info: "info",
      more: "more-horizontal",
      ai: "sparkles",
      aiSuggest: "lightbulb",
      aiTranslate: "languages",
      aiImprove: "wand",
      textColor: "palette",
      backgroundColor: "paint-bucket",
      colorPicker: "pipette",
      insertRowAbove: "row-insert-top",
      insertRowBelow: "row-insert-bottom",
      insertColumnLeft: "column-insert-left",
      insertColumnRight: "column-insert-right",
      deleteRow: "row-delete",
      deleteColumn: "column-delete",
      deleteTable: "table-delete",
      mergeCells: "cells-merge",
      splitCell: "cells-split",
      arrowUp: "arrow-up",
      arrowDown: "arrow-down",
      arrowLeft: "arrow-left",
      arrowRight: "arrow-right",
      chevronUp: "chevron-up",
      chevronDown: "chevron-down",
      chevronLeft: "chevron-left",
      chevronRight: "chevron-right",
      close: "x",
      check: "check",
      plus: "plus",
      minus: "minus",
      refresh: "refresh-cw",
      download: "download",
      upload: "upload",
      share: "share",
      lock: "lock",
      unlock: "unlock",
      user: "user",
      calendar: "calendar",
      clock: "clock",
      folder: "folder",
      file: "file",
      tag: "tag",
      bookmark: "bookmark",
      star: "star",
      heart: "heart",
      comment: "message-circle",
      bell: "bell",
      warning: "alert-triangle",
      error: "alert-circle",
      success: "check-circle"
    };
  }
  /**
   * 清理资源
   */
  destroy() {
    this.iconCache.clear();
    this.iconSets.clear();
    this.removeAllListeners();
  }
}
let globalIconManager = null;
function getIconManager(config) {
  if (!globalIconManager)
    globalIconManager = new IconManager(config);
  return globalIconManager;
}
function resetIconManager() {
  if (globalIconManager) {
    globalIconManager.destroy();
    globalIconManager = null;
  }
}

exports.IconManager = IconManager;
exports.getIconManager = getIconManager;
exports.resetIconManager = resetIconManager;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=IconManager.cjs.map
