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

var DebugPanel = require('../devtools/DebugPanel.cjs');
var defaultToolbar = require('../ui/defaultToolbar.cjs');
var Toolbar = require('../ui/Toolbar.cjs');
var logger$1 = require('../utils/logger.cjs');
var WasmAccelerator = require('../wasm/WasmAccelerator.cjs');
var Command = require('./Command.cjs');
var Document = require('./Document.cjs');
var EditorVirtualScroller = require('./EditorVirtualScroller.cjs');
var event = require('../utils/event.cjs');
var IncrementalRenderer = require('./IncrementalRenderer.cjs');
var Plugin = require('./Plugin.cjs');
var Schema = require('./Schema.cjs');
var Selection = require('./Selection.cjs');

const logger = logger$1.createLogger("Editor");
class Editor {
  constructor(options = {}) {
    this.version = "1.3.0";
    this.editable = true;
    // DOM
    this.element = null;
    this.contentElement = null;
    this.toolbarElement = null;
    // 状态
    this.destroyed = false;
    // DOM 选区快照（用于在弹窗交互后恢复插入位置）
    this.savedRange = null;
    this.options = options;
    this.editable = options.editable !== false;
    this.eventEmitter = new event.EventEmitter();
    this.schema = Schema.defaultSchema;
    this.document = new Document.Document(options.content, this.schema);
    this.selectionManager = new Selection.SelectionManager(this);
    this.commands = new Command.CommandManager(this);
    this.keymap = new Command.KeymapManager(this);
    this.plugins = new Plugin.PluginManager(this);
    if (options.element)
      this.mount(options.element);
    const pluginsToLoad = options.plugins || [];
    if (pluginsToLoad.length > 0) {
      logger.debug("Loading plugins, total:", pluginsToLoad.length);
      pluginsToLoad.forEach((plugin, index) => {
        if (typeof plugin === "string") {
          logger.debug(`Loading builtin plugin [${index}]: "${plugin}"`);
          this.loadBuiltinPlugin(plugin);
        } else {
          logger.debug(`Loading plugin [${index}]: "${plugin.name || "unnamed"}"`);
          this.plugins.register(plugin);
        }
      });
      logger.debug("All plugins loaded");
    }
    this.setupEventListeners();
  }
  /**
   * 链式注册插件
   * @param plugin - 插件实例或插件名称
   * @returns 编辑器实例（支持链式调用）
   *
   * @example
   * ```typescript
   * editor
   *   .use(BoldPlugin)
   *   .use(ItalicPlugin)
   *   .use(new CustomPlugin({ option: 'value' }))
   * ```
   */
  use(plugin) {
    if (typeof plugin === "string") {
      this.loadBuiltinPlugin(plugin);
    } else {
      this.plugins.register(plugin);
    }
    return this;
  }
  /**
   * 批量注册插件
   * @param plugins - 插件数组
   * @returns 编辑器实例（支持链式调用）
   *
   * @example
   * ```typescript
   * import { standardPlugins } from '@ldesign/editor-core/presets'
   * editor.usePlugins(standardPlugins)
   * ```
   */
  usePlugins(plugins) {
    plugins.forEach((plugin) => this.use(plugin));
    return this;
  }
  /**
   * 挂载编辑器
   */
  mount(element) {
    if (typeof element === "string") {
      const el = document.querySelector(element);
      if (!el)
        throw new Error(`Element "${element}" not found`);
      this.element = el;
    } else {
      this.element = element;
    }
    this.element.classList.add("ldesign-editor");
    this.element.classList.add("ldesign-editor-wrapper");
    if (this.options.toolbar !== false) {
      this.toolbarElement = document.createElement("div");
      this.toolbarElement.classList.add("ldesign-toolbar");
      this.element.appendChild(this.toolbarElement);
      this.toolbar = new Toolbar.Toolbar(this, {
        container: this.toolbarElement,
        items: this.options.toolbarItems || defaultToolbar.DEFAULT_TOOLBAR_ITEMS
      });
    }
    this.contentElement = document.createElement("div");
    this.contentElement.classList.add("ldesign-editor-content");
    this.contentElement.contentEditable = String(this.editable);
    if (this.options.placeholder)
      this.contentElement.dataset.placeholder = this.options.placeholder;
    this.element.appendChild(this.contentElement);
    if (this.options.incrementalRender?.enabled !== false) {
      this.incrementalRenderer = new IncrementalRenderer.IncrementalRenderer({
        batchDelay: this.options.incrementalRender?.batchDelay,
        maxBatchSize: this.options.incrementalRender?.maxBatchSize,
        useRAF: this.options.incrementalRender?.useRAF !== false,
        useWorker: this.options.incrementalRender?.useWorker,
        useVirtualDOM: this.options.incrementalRender?.useVirtualDOM
      });
      this.incrementalRenderer.observeElement(this.contentElement);
    }
    if (this.options.wasm?.enabled !== false && WasmAccelerator.WasmAccelerator.isSupported()) {
      this.wasmAccelerator = new WasmAccelerator.WasmAccelerator({
        enabled: this.options.wasm?.enabled !== false,
        enableDiff: this.options.wasm?.enableDiff !== false,
        enableParser: this.options.wasm?.enableParser !== false,
        useWorker: this.options.wasm?.useWorker,
        warmupStrategy: this.options.wasm?.warmupStrategy || "lazy"
      });
      if (this.options.wasm?.warmupStrategy === "eager") {
        this.wasmAccelerator.initialize().catch((error) => {
          logger.warn("WASM initialization failed:", error);
        });
      }
    }
    if (this.options.virtualScroll?.enabled) {
      this.virtualScroller = new EditorVirtualScroller.EditorVirtualScroller({
        editor: this,
        lineHeight: this.options.virtualScroll.lineHeight,
        maxLines: this.options.virtualScroll.maxLines,
        enableSyntaxHighlight: this.options.virtualScroll.enableSyntaxHighlight,
        enableLineNumbers: this.options.virtualScroll.enableLineNumbers,
        enableWordWrap: this.options.virtualScroll.enableWordWrap
      });
      this.virtualScroller.setContent(this.document.toText());
    } else {
      this.render();
    }
    if (this.options.autofocus)
      this.focus();
    if (this.options.debugPanel?.enabled) {
      this.debugPanel = new DebugPanel.DebugPanel({
        editor: this,
        expanded: this.options.debugPanel.expanded,
        initialTab: this.options.debugPanel.initialTab,
        theme: this.options.debugPanel.theme,
        position: this.options.debugPanel.position,
        size: this.options.debugPanel.size,
        resizable: this.options.debugPanel.resizable,
        showInProduction: this.options.debugPanel.showInProduction
      });
    }
  }
  /**
   * 设置事件监听
   */
  setupEventListeners() {
    if (!this.contentElement)
      return;
    this.contentElement.addEventListener("keydown", (e) => {
      if (this.keymap.handleKeyDown(e))
        e.preventDefault();
    });
    this.contentElement.addEventListener("input", (_e) => {
      this.handleInput();
    });
    document.addEventListener("selectionchange", () => {
      const sel = window.getSelection();
      if (this.contentElement && this.contentElement.contains(sel?.anchorNode || null)) {
        this.selectionManager.syncFromDOM();
        this.emit("selectionUpdate", this.getSelection());
        if (sel && sel.rangeCount > 0) {
          try {
            this.savedRange = sel.getRangeAt(0).cloneRange();
          } catch {
          }
        }
      }
    });
    this.contentElement.addEventListener("focus", () => {
      this.emit("focus");
      this.options.onFocus?.();
    });
    this.contentElement.addEventListener("blur", () => {
      this.emit("blur");
      this.options.onBlur?.();
    });
  }
  /**
   * 处理输入
   */
  handleInput() {
    if (!this.contentElement)
      return;
    const html = this.contentElement.innerHTML;
    this.document = new Document.Document(html, this.schema);
    this.emit("update", this.getState());
    this.options.onUpdate?.(this.getState());
    this.options.onChange?.(this.getHTML());
  }
  /**
   * 渲染内容
   */
  render() {
    if (!this.contentElement)
      return;
    const html = this.document.toHTML();
    if (this.incrementalRenderer) {
      this.renderIncremental(html);
    } else {
      const selection = this.getSelection();
      this.contentElement.innerHTML = html;
      if (selection)
        this.setSelection(selection);
    }
  }
  /**
   * 增量渲染内容
   */
  renderIncremental(newHTML) {
    if (!this.contentElement || !this.incrementalRenderer)
      return;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = newHTML;
    const patches = this.calculatePatches(this.contentElement, tempDiv);
    if (patches.length > 0)
      this.incrementalRenderer.queuePatches(patches);
  }
  /**
   * 计算DOM补丁
   */
  calculatePatches(oldRoot, newRoot) {
    const patches = [];
    const oldChildren = Array.from(oldRoot.children);
    const newChildren = Array.from(newRoot.children);
    oldChildren.forEach((oldChild, index) => {
      if (!newChildren[index]) {
        patches.push({
          type: "remove",
          target: oldChild
        });
      }
    });
    newChildren.forEach((newChild, index) => {
      const oldChild = oldChildren[index];
      if (!oldChild) {
        patches.push({
          type: "insert",
          parent: oldRoot,
          newNode: newChild.cloneNode(true),
          index
        });
      } else if (oldChild.outerHTML !== newChild.outerHTML) {
        patches.push({
          type: "update",
          target: oldChild,
          newNode: newChild.cloneNode(true)
        });
      }
    });
    return patches;
  }
  /**
   * 加载内置插件
   */
  loadBuiltinPlugin(name) {
    switch (name) {
      case "image":
        Promise.resolve().then(function () { return require('../plugins/media/image.cjs'); }).then((module) => {
          this.plugins.register(module.ImagePlugin);
        });
        break;
      case "formatting":
        Promise.resolve().then(function () { return require('../plugins/formatting/index.cjs'); }).then((module) => {
          if (module.BoldPlugin)
            this.plugins.register(module.BoldPlugin);
          if (module.ItalicPlugin)
            this.plugins.register(module.ItalicPlugin);
          if (module.UnderlinePlugin)
            this.plugins.register(module.UnderlinePlugin);
        });
        break;
      default:
        logger.warn(`\u672A\u77E5\u63D2\u4EF6: ${name}`);
    }
  }
  /**
   * 获取编辑器容器元素
   */
  getElement() {
    if (!this.element)
      throw new Error("Editor not mounted");
    return this.element;
  }
  /**
   * 获取编辑器状态
   */
  getState() {
    return {
      doc: this.document.toJSON(),
      selection: this.getSelection().toJSON()
    };
  }
  /**
   * 分发事务
   */
  dispatch(tr) {
    this.document = new Document.Document(tr.doc, this.schema);
    if (tr.selection)
      this.setSelection(Selection.Selection.fromJSON(tr.selection));
    this.render();
    this.emit("update", this.getState());
    this.options.onUpdate?.(this.getState());
    this.options.onChange?.(this.getHTML());
  }
  /**
   * 获取选区
   */
  getSelection() {
    return this.selectionManager.getSelection();
  }
  /**
   * 设置选区
   */
  setSelection(selection) {
    this.selectionManager.setSelection(selection);
  }
  /**
   * 保存当前 DOM 选区（仅当选区在编辑器内部时）
   */
  saveSelection() {
    if (!this.contentElement)
      return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0)
      return;
    const range = sel.getRangeAt(0);
    if (this.contentElement.contains(range.commonAncestorContainer)) {
      try {
        this.savedRange = range.cloneRange();
        logger.debug("DOM selection saved");
      } catch (e) {
        logger.warn("Failed to save selection:", e);
      }
    }
  }
  /**
   * 恢复先前保存的 DOM 选区
   * 返回是否恢复成功
   */
  restoreSelection() {
    if (!this.contentElement || !this.savedRange)
      return false;
    try {
      if (!this.contentElement.contains(this.savedRange.commonAncestorContainer))
        return false;
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(this.savedRange);
      logger.debug("DOM selection restored");
      return true;
    } catch (e) {
      logger.warn("Failed to restore selection:", e);
      return false;
    }
  }
  /**
   * 获取 HTML 内容
   */
  getHTML() {
    return this.document.toHTML();
  }
  /**
   * 获取选中的纯文本
   */
  getSelectedText() {
    if (!this.contentElement)
      return "";
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
      return "";
    const range = selection.getRangeAt(0);
    if (!this.contentElement.contains(range.commonAncestorContainer))
      return "";
    return selection.toString();
  }
  /**
   * 设置 HTML 内容
   */
  setHTML(html) {
    this.document = new Document.Document(html, this.schema);
    this.render();
  }
  /**
   * 获取 JSON 内容
   */
  getJSON() {
    return this.document.toJSON();
  }
  /**
   * 设置 JSON 内容
   */
  setJSON(json) {
    this.document = Document.Document.fromJSON(json, this.schema);
    this.render();
  }
  /**
   * 插入 HTML 内容到当前光标位置
   */
  insertHTML(html) {
    if (!this.contentElement)
      return;
    const beforeLen = this.contentElement.innerHTML.length;
    logger.debug("insertHTML called. Before length:", beforeLen);
    logger.debug("html length:", html?.length);
    let selection = window.getSelection();
    logger.debug("Initial selection:", selection);
    if (!selection || selection.rangeCount === 0) {
      const restored = this.restoreSelection();
      selection = window.getSelection();
      if (!restored || !selection || selection.rangeCount === 0) {
        logger.warn("No selection, creating range at end of editor");
        this.contentElement.focus();
        const range2 = document.createRange();
        range2.selectNodeContents(this.contentElement);
        range2.collapse(false);
        selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range2);
      }
    }
    let range = selection.getRangeAt(0);
    logger.debug("Range obtained. Collapsed:", range.collapsed);
    if (!this.contentElement.contains(range.commonAncestorContainer)) {
      logger.warn("Selection is not in editor; attempting to restore saved selection");
      const restored = this.restoreSelection();
      selection = window.getSelection();
      if (restored && selection && selection.rangeCount > 0 && this.contentElement.contains(selection.getRangeAt(0).commonAncestorContainer)) {
        range = selection.getRangeAt(0);
      } else {
        logger.warn("Saved selection unavailable; moving caret to end");
        this.contentElement.focus();
        const newRange = document.createRange();
        newRange.selectNodeContents(this.contentElement);
        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);
        range = newRange;
      }
    }
    this.contentElement.focus();
    let success = false;
    try {
      success = document.execCommand("insertHTML", false, html);
      logger.debug('execCommand("insertHTML") returned:', success);
    } catch (err) {
      logger.warn("execCommand threw error, will use manual insertion:", err);
      success = false;
    }
    const afterLenCandidate = this.contentElement.innerHTML.length;
    const noChange = afterLenCandidate === beforeLen;
    if (!success || noChange) {
      if (success && noChange)
        logger.warn("execCommand reported success but content did not change, falling back to manual insertion");
      else
        logger.debug("Falling back to manual insertion");
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      try {
        range.deleteContents();
      } catch (err) {
        logger.warn("deleteContents error:", err);
      }
      const fragment = document.createDocumentFragment();
      while (tempDiv.firstChild)
        fragment.appendChild(tempDiv.firstChild);
      try {
        range.insertNode(fragment);
      } catch (err) {
        logger.error("insertNode error:", err);
      }
      try {
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } catch (err) {
        logger.warn("Reselection error:", err);
      }
    }
    const afterLen = this.contentElement.innerHTML.length;
    logger.debug("After length:", afterLen, "Delta:", afterLen - beforeLen);
    try {
      const snapshot = this.contentElement.innerHTML;
      const imgCount = (snapshot.match(/<img\b/gi) || []).length;
      const videoCount = (snapshot.match(/<video\b/gi) || []).length;
      const audioCount = (snapshot.match(/<audio\b/gi) || []).length;
      logger.debug("Media counts -> img:", imgCount, "video:", videoCount, "audio:", audioCount);
    } catch {
    }
    try {
      const selNow = window.getSelection();
      const anchor = selNow?.anchorNode;
      let targetEl = null;
      if (anchor) {
        if (anchor.nodeType === 3)
          targetEl = anchor.parentElement || null;
        else if (anchor.nodeType === 1)
          targetEl = anchor;
        else
          targetEl = anchor.parentElement || null;
      }
      if (targetEl && this.contentElement?.contains(targetEl))
        targetEl.scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: "smooth"
        });
      else if (this.contentElement)
        this.contentElement.scrollTop = this.contentElement.scrollHeight;
    } catch (err) {
      logger.warn("scrollIntoView failed:", err);
    }
    this.handleInput();
  }
  /**
   * 清空内容
   */
  clear() {
    this.setHTML("<p></p>");
  }
  /**
   * 聚焦编辑器
   */
  focus() {
    this.contentElement?.focus();
  }
  /**
   * 失焦编辑器
   */
  blur() {
    this.contentElement?.blur();
  }
  /**
   * 设置是否可编辑
   */
  setEditable(editable) {
    this.editable = editable;
    if (this.contentElement)
      this.contentElement.contentEditable = String(editable);
  }
  /**
   * 检查是否可编辑
   */
  isEditable() {
    return this.editable;
  }
  /**
   * 扩展 Schema
   */
  extendSchema(spec) {
    if (spec.nodes) {
      Object.entries(spec.nodes).forEach(([name, nodeSpec]) => {
        this.schema.nodes.set(name, nodeSpec);
      });
    }
    if (spec.marks) {
      Object.entries(spec.marks).forEach(([name, markSpec]) => {
        this.schema.marks.set(name, markSpec);
      });
    }
  }
  /**
   * 事件系统
   */
  on(event, handler) {
    return this.eventEmitter.on(event, handler);
  }
  once(event, handler) {
    this.eventEmitter.once(event, handler);
  }
  off(event, handler) {
    this.eventEmitter.off(event, handler);
  }
  emit(event, ...args) {
    this.eventEmitter.emit(event, ...args);
  }
  /**
   * 销毁编辑器
   */
  destroy() {
    if (this.destroyed)
      return;
    this.plugins.clear();
    this.commands.clear();
    this.keymap.clear();
    this.eventEmitter.clear();
    if (this.element)
      this.element.innerHTML = "";
    this.destroyed = true;
  }
  /**
   * 检查是否已销毁
   */
  isDestroyed() {
    return this.destroyed;
  }
}
// 版本信息
Editor.version = "1.3.0";

exports.Editor = Editor;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=Editor.cjs.map
