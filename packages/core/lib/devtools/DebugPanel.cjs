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
var logger$1 = require('../utils/logger.cjs');
var PerformanceMonitor = require('../utils/PerformanceMonitor.cjs');
var ConfigTab = require('./tabs/ConfigTab.cjs');
var ConsoleTab = require('./tabs/ConsoleTab.cjs');
var DOMInspector = require('./tabs/DOMInspector.cjs');
var HistoryTab = require('./tabs/HistoryTab.cjs');
var MemoryTab = require('./tabs/MemoryTab.cjs');
var NetworkTab = require('./tabs/NetworkTab.cjs');
var PerformanceTab = require('./tabs/PerformanceTab.cjs');
var PluginsTab = require('./tabs/PluginsTab.cjs');

const logger = logger$1.createLogger("DebugPanel");
class DebugPanel extends event.EventEmitter {
  constructor(options) {
    super();
    this.tabs = /* @__PURE__ */ new Map();
    this.isDragging = false;
    this.performanceMonitor = PerformanceMonitor.getPerformanceMonitor();
    /** 标签页定义 */
    this.tabDefinitions = [{
      name: "performance",
      label: "\u6027\u80FD",
      icon: "\u{1F4CA}",
      component: PerformanceTab.PerformanceTab
    }, {
      name: "memory",
      label: "\u5185\u5B58",
      icon: "\u{1F4BE}",
      component: MemoryTab.MemoryTab
    }, {
      name: "network",
      label: "\u7F51\u7EDC",
      icon: "\u{1F310}",
      component: NetworkTab.NetworkTab,
      badge: 0
    }, {
      name: "plugins",
      label: "\u63D2\u4EF6",
      icon: "\u{1F50C}",
      component: PluginsTab.PluginsTab
    }, {
      name: "console",
      label: "\u63A7\u5236\u53F0",
      icon: "\u{1F4BB}",
      component: ConsoleTab.ConsoleTab,
      badge: 0
    }, {
      name: "dom",
      label: "DOM",
      icon: "\u{1F333}",
      component: DOMInspector.DOMInspector
    }, {
      name: "history",
      label: "\u5386\u53F2",
      icon: "\u{1F4DC}",
      component: HistoryTab.HistoryTab
    }, {
      name: "config",
      label: "\u914D\u7F6E",
      icon: "\u2699\uFE0F",
      component: ConfigTab.ConfigTab
    }];
    this.editor = options.editor;
    this.options = {
      expanded: false,
      initialTab: "performance",
      theme: "auto",
      position: "bottom",
      size: "300px",
      resizable: true,
      showInProduction: false,
      ...options
    };
    this.isExpanded = this.options.expanded;
    if (process.env.NODE_ENV === "production" && !this.options.showInProduction) {
      logger.info("Debug panel disabled in production");
      return;
    }
    this.initialize();
  }
  /**
   * 初始化调试面板
   */
  initialize() {
    logger.info("Initializing debug panel");
    this.createContainer();
    this.initializeTabs();
    this.setupEventListeners();
    this.setupHotkeys();
    this.switchTab(this.options.initialTab);
    this.startMonitoring();
    logger.info("Debug panel initialized");
  }
  /**
   * 创建容器DOM
   */
  createContainer() {
    this.container = document.createElement("div");
    this.container.className = "ldesign-debug-container";
    this.container.style.cssText = this.getContainerStyles();
    this.panel = document.createElement("div");
    this.panel.className = "ldesign-debug-panel";
    this.panel.style.cssText = this.getPanelStyles();
    const header = this.createHeader();
    this.tabsContainer = document.createElement("div");
    this.tabsContainer.className = "ldesign-debug-tabs";
    this.tabsContainer.style.cssText = this.getTabsStyles();
    this.contentContainer = document.createElement("div");
    this.contentContainer.className = "ldesign-debug-content";
    this.contentContainer.style.cssText = this.getContentStyles();
    this.panel.appendChild(header);
    this.panel.appendChild(this.tabsContainer);
    this.panel.appendChild(this.contentContainer);
    this.container.appendChild(this.panel);
    this.renderTabs();
    document.body.appendChild(this.container);
    this.applyTheme();
    if (this.isExpanded)
      this.expand();
    else
      this.collapse();
  }
  /**
   * 创建头部
   */
  createHeader() {
    const header = document.createElement("div");
    header.className = "ldesign-debug-header";
    header.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 14px;
      font-weight: 600;
      user-select: none;
      cursor: move;
    `;
    const title = document.createElement("div");
    title.style.display = "flex";
    title.style.alignItems = "center";
    title.style.gap = "8px";
    title.innerHTML = `
      <span style="font-size: 18px;">\u{1F527}</span>
      <span>LDesign Editor DevTools</span>
      <span style="
        background: rgba(255, 255, 255, 0.2);
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 11px;
      ">v${this.editor.version || "1.0.0"}</span>
    `;
    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.gap = "8px";
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "debug-toggle-btn";
    toggleBtn.style.cssText = `
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 16px;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;
    `;
    toggleBtn.innerHTML = this.isExpanded ? "\u2796" : "\u2795";
    toggleBtn.onclick = () => this.toggle();
    toggleBtn.onmouseenter = () => {
      toggleBtn.style.background = "rgba(255, 255, 255, 0.2)";
    };
    toggleBtn.onmouseleave = () => {
      toggleBtn.style.background = "transparent";
    };
    const closeBtn = document.createElement("button");
    closeBtn.className = "debug-close-btn";
    closeBtn.style.cssText = toggleBtn.style.cssText;
    closeBtn.innerHTML = "\u2716";
    closeBtn.onclick = () => this.close();
    closeBtn.onmouseenter = () => {
      closeBtn.style.background = "rgba(255, 255, 255, 0.2)";
    };
    closeBtn.onmouseleave = () => {
      closeBtn.style.background = "transparent";
    };
    controls.appendChild(toggleBtn);
    controls.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(controls);
    this.makeHeaderDraggable(header);
    return header;
  }
  /**
   * 渲染标签页按钮
   */
  renderTabs() {
    if (!this.tabsContainer)
      return;
    this.tabsContainer.innerHTML = "";
    this.tabDefinitions.forEach((tab) => {
      const button = document.createElement("button");
      button.className = "debug-tab-btn";
      button.dataset.tab = tab.name;
      button.style.cssText = `
        padding: 8px 16px;
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        color: #666;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
        position: relative;
        display: flex;
        align-items: center;
        gap: 6px;
      `;
      button.innerHTML = `
        <span style="font-size: 16px;">${tab.icon}</span>
        <span>${tab.label}</span>
        ${tab.badge ? `
          <span style="
            position: absolute;
            top: 4px;
            right: 4px;
            background: #ff4444;
            color: white;
            font-size: 10px;
            padding: 2px 4px;
            border-radius: 8px;
            min-width: 16px;
            text-align: center;
          ">${tab.badge}</span>
        ` : ""}
      `;
      button.onclick = () => this.switchTab(tab.name);
      button.onmouseenter = () => {
        if (button.dataset.tab !== this.activeTab)
          button.style.background = "#f5f5f5";
      };
      button.onmouseleave = () => {
        if (button.dataset.tab !== this.activeTab)
          button.style.background = "transparent";
      };
      this.tabsContainer.appendChild(button);
    });
  }
  /**
   * 初始化标签页
   */
  initializeTabs() {
    this.tabDefinitions.forEach((tab) => {
      const TabClass = tab.component;
      const instance = new TabClass({
        editor: this.editor,
        debugPanel: this
      });
      this.tabs.set(tab.name, instance);
    });
  }
  /**
   * 切换标签页
   */
  switchTab(name) {
    if (this.activeTab === name)
      return;
    logger.debug(`Switching to tab: ${name}`);
    if (this.activeTab) {
      const currentTab = this.tabs.get(this.activeTab);
      currentTab?.deactivate();
      const currentBtn = this.tabsContainer?.querySelector(`[data-tab="${this.activeTab}"]`);
      if (currentBtn) {
        currentBtn.style.background = "transparent";
        currentBtn.style.color = "#666";
        currentBtn.style.borderBottomColor = "transparent";
      }
    }
    this.activeTab = name;
    const newTab = this.tabs.get(name);
    if (newTab && this.contentContainer) {
      this.contentContainer.innerHTML = "";
      const content = newTab.render();
      this.contentContainer.appendChild(content);
      newTab.activate();
      const newBtn = this.tabsContainer?.querySelector(`[data-tab="${name}"]`);
      if (newBtn) {
        newBtn.style.background = "#f8f9fa";
        newBtn.style.color = "#667eea";
        newBtn.style.borderBottomColor = "#667eea";
      }
    }
    this.emit("tabchange", name);
  }
  /**
   * 设置事件监听
   */
  setupEventListeners() {
    this.editor.on("error", (error) => {
      this.logError(error);
      this.updateBadge("console", 1);
    });
    this.editor.on("warning", (warning) => {
      this.logWarning(warning);
    });
    this.interceptNetworkRequests();
    this.editor.plugins?.on("plugin-loaded", (name) => {
      this.logInfo(`Plugin loaded: ${name}`);
    });
    this.performanceMonitor.on("measure", (measure) => {
      const perfTab = this.tabs.get("performance");
      perfTab?.addMeasure(measure);
    });
  }
  /**
   * 设置快捷键
   */
  setupHotkeys() {
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "D") {
        e.preventDefault();
        this.toggle();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "P") {
        e.preventDefault();
        this.switchTab("performance");
        this.expand();
      }
      if (e.key === "Escape" && this.isExpanded)
        this.collapse();
    });
  }
  /**
   * 开始监控
   */
  startMonitoring() {
    setInterval(() => {
      const perfTab = this.tabs.get("performance");
      perfTab?.update();
    }, 1e3);
    setInterval(() => {
      const memTab = this.tabs.get("memory");
      memTab?.update();
    }, 2e3);
    let lastTime = performance.now();
    let frames = 0;
    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      if (currentTime >= lastTime + 1e3) {
        const fps = Math.round(frames * 1e3 / (currentTime - lastTime));
        const perfTab = this.tabs.get("performance");
        perfTab?.updateFPS(fps);
        frames = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(measureFPS);
    };
    requestAnimationFrame(measureFPS);
  }
  /**
   * 拦截网络请求
   */
  interceptNetworkRequests() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const [url, options] = args;
      const networkTab = this.tabs.get("network");
      const requestId = networkTab?.startRequest({
        url: typeof url === "string" ? url : url.toString(),
        method: options?.method || "GET",
        headers: options?.headers
      });
      try {
        const response = await originalFetch.apply(window, args);
        const duration = performance.now() - startTime;
        networkTab?.completeRequest(requestId, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          duration
        });
        this.updateBadge("network", 1);
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        networkTab?.failRequest(requestId, {
          error: error.message,
          duration
        });
        throw error;
      }
    };
    const originalXHR = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(...args) {
      const [method, url] = args;
      const networkTab = this.tabs?.get("network");
      const requestId = networkTab?.startRequest({
        url: url.toString(),
        method: method.toString()
      });
      this.addEventListener("load", function() {
        networkTab?.completeRequest(requestId, {
          status: this.status,
          statusText: this.statusText
        });
      });
      this.addEventListener("error", () => {
        networkTab?.failRequest(requestId, {
          error: "Network error"
        });
      });
      return originalXHR.apply(this, args);
    };
  }
  /**
   * 日志方法
   */
  logError(error) {
    const consoleTab = this.tabs.get("console");
    consoleTab?.log("error", error);
  }
  logWarning(message) {
    const consoleTab = this.tabs.get("console");
    consoleTab?.log("warn", message);
  }
  logInfo(message) {
    const consoleTab = this.tabs.get("console");
    consoleTab?.log("info", message);
  }
  logDebug(message) {
    const consoleTab = this.tabs.get("console");
    consoleTab?.log("debug", message);
  }
  /**
   * 更新标签页徽章
   */
  updateBadge(tab, increment = 0) {
    const tabDef = this.tabDefinitions.find((t) => t.name === tab);
    if (tabDef) {
      if (typeof tabDef.badge === "number")
        tabDef.badge += increment;
      else
        tabDef.badge = increment;
      this.renderTabs();
      if (this.activeTab) {
        const activeBtn = this.tabsContainer?.querySelector(`[data-tab="${this.activeTab}"]`);
        if (activeBtn) {
          activeBtn.style.background = "#f8f9fa";
          activeBtn.style.color = "#667eea";
          activeBtn.style.borderBottomColor = "#667eea";
        }
      }
    }
  }
  /**
   * 使头部可拖动（浮动模式）
   */
  makeHeaderDraggable(header) {
    if (this.options.position !== "floating")
      return;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;
    header.addEventListener("mousedown", (e) => {
      if (e.target !== header && !header.contains(e.target))
        return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = this.container.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      header.style.cursor = "grabbing";
      e.preventDefault();
    });
    document.addEventListener("mousemove", (e) => {
      if (!isDragging)
        return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      this.container.style.left = `${initialX + deltaX}px`;
      this.container.style.top = `${initialY + deltaY}px`;
    });
    document.addEventListener("mouseup", () => {
      isDragging = false;
      header.style.cursor = "move";
    });
  }
  /**
   * 切换展开/折叠
   */
  toggle() {
    if (this.isExpanded)
      this.collapse();
    else
      this.expand();
  }
  /**
   * 展开面板
   */
  expand() {
    if (!this.panel)
      return;
    this.isExpanded = true;
    this.panel.style.height = this.options.size;
    const toggleBtn = this.panel.querySelector(".debug-toggle-btn");
    if (toggleBtn)
      toggleBtn.innerHTML = "\u2796";
    this.emit("expand");
    logger.debug("Debug panel expanded");
  }
  /**
   * 折叠面板
   */
  collapse() {
    if (!this.panel)
      return;
    this.isExpanded = false;
    this.panel.style.height = "40px";
    const toggleBtn = this.panel.querySelector(".debug-toggle-btn");
    if (toggleBtn)
      toggleBtn.innerHTML = "\u2795";
    this.emit("collapse");
    logger.debug("Debug panel collapsed");
  }
  /**
   * 关闭面板
   */
  close() {
    this.container?.remove();
    this.emit("close");
    logger.info("Debug panel closed");
  }
  /**
   * 应用主题
   */
  applyTheme() {
    const theme = this.options.theme === "auto" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : this.options.theme;
    this.container?.setAttribute("data-theme", theme);
  }
  /**
   * 获取容器样式
   */
  getContainerStyles() {
    const styles = {
      bottom: `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10000;
      `,
      right: `
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: ${this.options.size};
        z-index: 10000;
      `,
      floating: `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 800px;
        z-index: 10000;
      `
    };
    return styles[this.options.position];
  }
  /**
   * 获取面板样式
   */
  getPanelStyles() {
    return `
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px 8px 0 0;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      height: ${this.isExpanded ? this.options.size : "40px"};
      overflow: hidden;
      transition: height 0.3s ease-out;
    `;
  }
  /**
   * 获取标签栏样式
   */
  getTabsStyles() {
    return `
      display: flex;
      background: #fafafa;
      border-bottom: 1px solid #e0e0e0;
      overflow-x: auto;
      scrollbar-width: thin;
    `;
  }
  /**
   * 获取内容区样式
   */
  getContentStyles() {
    return `
      flex: 1;
      overflow: auto;
      padding: 0;
    `;
  }
  /**
   * 销毁面板
   */
  destroy() {
    this.close();
    this.tabs.forEach((tab) => tab.destroy?.());
    this.tabs.clear();
    this.removeAllListeners();
    logger.info("Debug panel destroyed");
  }
}

exports.DebugPanel = DebugPanel;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=DebugPanel.cjs.map
