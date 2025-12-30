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

var logger$1 = require('../../utils/logger.cjs');

const logger = logger$1.createLogger("ConsoleTab");
class ConsoleTab {
  constructor(options) {
    this.logs = [];
    this.filters = {
      debug: true,
      info: true,
      warn: true,
      error: true
    };
    this.searchQuery = "";
    this.maxLogs = 1e3;
    this.isActive = false;
    this.editor = options.editor;
    this.interceptConsole();
  }
  /**
   * 渲染标签页
   */
  render() {
    this.container = document.createElement("div");
    this.container.className = "console-tab";
    this.container.style.cssText = `
      display: flex;
      flex-direction: column;
      height: 100%;
    `;
    const toolbar = this.createToolbar();
    this.logContainer = this.createLogContainer();
    this.container.appendChild(toolbar);
    this.container.appendChild(this.logContainer);
    this.renderLogs();
    return this.container;
  }
  /**
   * 创建工具栏
   */
  createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "console-toolbar";
    toolbar.style.cssText = `
      display: flex;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
      gap: 10px;
      flex-shrink: 0;
    `;
    const clearBtn = document.createElement("button");
    clearBtn.style.cssText = `
      padding: 4px 8px;
      background: transparent;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `;
    clearBtn.innerHTML = "\u{1F5D1}\uFE0F \u6E05\u7A7A";
    clearBtn.onclick = () => this.clear();
    const filters = this.createFilters();
    const searchBox = this.createSearchBox();
    const stats = document.createElement("div");
    stats.className = "console-stats";
    stats.style.cssText = `
      margin-left: auto;
      display: flex;
      gap: 10px;
      font-size: 12px;
      color: #666;
    `;
    stats.innerHTML = `
      <span id="console-total">\u5171 0 \u6761</span>
    `;
    toolbar.appendChild(clearBtn);
    toolbar.appendChild(filters);
    toolbar.appendChild(searchBox);
    toolbar.appendChild(stats);
    return toolbar;
  }
  /**
   * 创建过滤器
   */
  createFilters() {
    const filters = document.createElement("div");
    filters.className = "console-filters";
    filters.style.cssText = `
      display: flex;
      gap: 8px;
    `;
    const levels = [{
      level: "debug",
      icon: "\u{1F50D}",
      color: "#9e9e9e"
    }, {
      level: "info",
      icon: "\u2139\uFE0F",
      color: "#2196f3"
    }, {
      level: "warn",
      icon: "\u26A0\uFE0F",
      color: "#ff9800"
    }, {
      level: "error",
      icon: "\u274C",
      color: "#f44336"
    }];
    levels.forEach(({
      level,
      icon,
      color
    }) => {
      const button = document.createElement("button");
      button.className = `filter-${level}`;
      button.style.cssText = `
        padding: 4px 8px;
        background: ${this.filters[level] ? color : "transparent"};
        color: ${this.filters[level] ? "white" : color};
        border: 1px solid ${color};
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
      `;
      const count = this.logs.filter((log) => log.level === level).length;
      button.innerHTML = `${icon} ${level} (${count})`;
      button.onclick = () => {
        this.filters[level] = !this.filters[level];
        button.style.background = this.filters[level] ? color : "transparent";
        button.style.color = this.filters[level] ? "white" : color;
        this.renderLogs();
      };
      filters.appendChild(button);
    });
    return filters;
  }
  /**
   * 创建搜索框
   */
  createSearchBox() {
    const container = document.createElement("div");
    container.style.cssText = `
      position: relative;
    `;
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "\u641C\u7D22\u65E5\u5FD7...";
    input.style.cssText = `
      padding: 4px 8px 4px 28px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 12px;
      width: 200px;
    `;
    const icon = document.createElement("span");
    icon.style.cssText = `
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
    `;
    icon.textContent = "\u{1F50D}";
    input.oninput = (e) => {
      this.searchQuery = e.target.value;
      this.renderLogs();
    };
    container.appendChild(icon);
    container.appendChild(input);
    return container;
  }
  /**
   * 创建日志容器
   */
  createLogContainer() {
    const container = document.createElement("div");
    container.className = "console-logs";
    container.style.cssText = `
      flex: 1;
      overflow-y: auto;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 12px;
      background: #1e1e1e;
      color: #d4d4d4;
    `;
    return container;
  }
  /**
   * 拦截控制台
   */
  interceptConsole() {
    const originalLog = console.log;
    const originalInfo = console.info;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalDebug = console.debug;
    console.log = (...args) => {
      this.log("info", ...args);
      originalLog.apply(console, args);
    };
    console.info = (...args) => {
      this.log("info", ...args);
      originalInfo.apply(console, args);
    };
    console.warn = (...args) => {
      this.log("warn", ...args);
      originalWarn.apply(console, args);
    };
    console.error = (...args) => {
      this.log("error", ...args);
      originalError.apply(console, args);
    };
    console.debug = (...args) => {
      this.log("debug", ...args);
      originalDebug.apply(console, args);
    };
    window.addEventListener("error", (event) => {
      this.log("error", event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });
    window.addEventListener("unhandledrejection", (event) => {
      this.log("error", "Unhandled Promise Rejection", event.reason);
    });
  }
  /**
   * 记录日志
   */
  log(level, ...args) {
    const message = args.map((arg) => {
      if (typeof arg === "object") {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(" ");
    const lastLog = this.logs[this.logs.length - 1];
    if (lastLog && lastLog.level === level && lastLog.message === message && Date.now() - lastLog.timestamp < 100) {
      lastLog.count++;
      lastLog.timestamp = Date.now();
      this.updateLogEntry(lastLog);
      return;
    }
    const entry = {
      id: `log-${Date.now()}-${Math.random()}`,
      level,
      message,
      details: args.length > 1 ? args.slice(1) : void 0,
      stack: level === "error" ? new Error().stack : void 0,
      timestamp: Date.now(),
      source: this.getSource(),
      count: 1
    };
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs)
      this.logs.shift();
    if (this.isActive) {
      this.addLogEntry(entry);
      this.updateStats();
    }
  }
  /**
   * 获取日志来源
   */
  getSource() {
    const stack = new Error().stack;
    if (!stack)
      return "unknown";
    const lines = stack.split("\n");
    const sourceLine = lines[3];
    if (!sourceLine)
      return "unknown";
    const match = sourceLine.match(/at(?:\s+\S.*(?:[\n\r\u2028\u2029]\s*|[\t\v\f \xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF])|\s{2,})\((.*):(\d+):(\d+)\)/) || sourceLine.match(/at\s+(.*):(\d+):(\d+)/);
    if (match) {
      const file = match[1].split("/").pop();
      return `${file}:${match[2]}`;
    }
    return "unknown";
  }
  /**
   * 渲染所有日志
   */
  renderLogs() {
    if (!this.logContainer)
      return;
    this.logContainer.innerHTML = "";
    const filteredLogs = this.logs.filter((log) => {
      if (!this.filters[log.level])
        return false;
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        return log.message.toLowerCase().includes(query) || log.source?.toLowerCase().includes(query);
      }
      return true;
    });
    if (filteredLogs.length === 0) {
      this.logContainer.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #666;">
          \u6682\u65E0\u65E5\u5FD7
        </div>
      `;
      return;
    }
    filteredLogs.forEach((log) => {
      this.addLogEntry(log);
    });
    this.logContainer.scrollTop = this.logContainer.scrollHeight;
    this.updateStats();
  }
  /**
   * 添加日志条目
   */
  addLogEntry(entry) {
    if (!this.logContainer)
      return;
    const logElement = document.createElement("div");
    logElement.className = `log-entry log-${entry.level}`;
    logElement.dataset.id = entry.id;
    logElement.style.cssText = `
      padding: 6px 12px;
      border-bottom: 1px solid #2a2a2a;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      position: relative;
      transition: background 0.2s;
    `;
    const levelColors = {
      debug: "#858585",
      info: "#d4d4d4",
      warn: "#ce9178",
      error: "#f48771"
    };
    const levelIcons = {
      debug: "\u{1F50D}",
      info: "\u2139\uFE0F",
      warn: "\u26A0\uFE0F",
      error: "\u274C"
    };
    logElement.innerHTML = `
      <span style="color: ${levelColors[entry.level]}; font-size: 14px; flex-shrink: 0;">
        ${levelIcons[entry.level]}
      </span>
      <span style="color: #858585; font-size: 11px; flex-shrink: 0;">
        ${new Date(entry.timestamp).toLocaleTimeString()}
      </span>
      <div style="flex: 1; word-break: break-all;">
        <span style="color: ${levelColors[entry.level]};">
          ${this.escapeHtml(entry.message)}
        </span>
        ${entry.count > 1 ? `
          <span style="
            background: #ff9800;
            color: white;
            padding: 1px 6px;
            border-radius: 10px;
            font-size: 10px;
            margin-left: 8px;
          ">${entry.count}</span>
        ` : ""}
        ${entry.details ? `
          <div style="margin-top: 4px; opacity: 0.8; font-size: 11px;">
            ${this.formatDetails(entry.details)}
          </div>
        ` : ""}
        ${entry.stack && entry.level === "error" ? `
          <div style="
            margin-top: 4px;
            padding: 8px;
            background: #2a2a2a;
            border-radius: 4px;
            font-size: 11px;
            color: #f48771;
            display: none;
          " class="stack-trace">
            <pre style="margin: 0; white-space: pre-wrap;">${this.escapeHtml(entry.stack)}</pre>
          </div>
        ` : ""}
      </div>
      <span style="color: #608b4e; font-size: 10px; flex-shrink: 0;">
        ${entry.source || ""}
      </span>
    `;
    if (entry.level === "error" && entry.stack) {
      logElement.style.cursor = "pointer";
      logElement.onclick = () => {
        const stackTrace = logElement.querySelector(".stack-trace");
        if (stackTrace)
          stackTrace.style.display = stackTrace.style.display === "none" ? "block" : "none";
      };
    }
    logElement.onmouseenter = () => {
      logElement.style.background = "#2a2a2a";
    };
    logElement.onmouseleave = () => {
      logElement.style.background = "transparent";
    };
    this.logContainer.appendChild(logElement);
  }
  /**
   * 更新日志条目
   */
  updateLogEntry(entry) {
    const element = this.logContainer?.querySelector(`[data-id="${entry.id}"]`);
    if (element) {
      const countBadge = element.querySelector(".count-badge");
      if (countBadge)
        countBadge.textContent = String(entry.count);
    }
  }
  /**
   * 格式化详细信息
   */
  formatDetails(details) {
    if (typeof details === "object") {
      try {
        return `<pre style="margin: 0;">${this.escapeHtml(JSON.stringify(details, null, 2))}</pre>`;
      } catch {
        return this.escapeHtml(String(details));
      }
    }
    return this.escapeHtml(String(details));
  }
  /**
   * 转义HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
  /**
   * 更新统计信息
   */
  updateStats() {
    const total = this.container?.querySelector("#console-total");
    if (total) {
      const filteredCount = this.logs.filter((log) => this.filters[log.level]).length;
      total.textContent = `\u5171 ${filteredCount} \u6761`;
    }
    const levels = ["debug", "info", "warn", "error"];
    levels.forEach((level) => {
      const button = this.container?.querySelector(`.filter-${level}`);
      if (button) {
        const count = this.logs.filter((log) => log.level === level).length;
        const icon = button.textContent?.split(" ")[0] || "";
        button.textContent = `${icon} ${level} (${count})`;
      }
    });
  }
  /**
   * 清空日志
   */
  clear() {
    this.logs = [];
    this.renderLogs();
    logger.info("Console cleared");
  }
  /**
   * 激活标签页
   */
  activate() {
    this.isActive = true;
    this.renderLogs();
  }
  /**
   * 停用标签页
   */
  deactivate() {
    this.isActive = false;
  }
  /**
   * 销毁
   */
  destroy() {
    this.container = void 0;
  }
}

exports.ConsoleTab = ConsoleTab;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ConsoleTab.cjs.map
