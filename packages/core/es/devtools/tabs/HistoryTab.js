/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createLogger } from '../../utils/logger.js';

const logger = createLogger("HistoryTab");
class HistoryTab {
  constructor(options) {
    this.history = [];
    this.currentIndex = -1;
    this.maxHistory = 100;
    this.editor = options.editor;
    this.setupHistoryTracking();
  }
  /**
   * 设置历史记录追踪
   */
  setupHistoryTracking() {
    this.editor.on("change", (change) => {
      this.addHistoryEntry({
        type: "edit",
        description: this.getChangeDescription(change),
        data: change,
        snapshot: this.editor.getContent?.()
      });
    });
    this.editor.on("undo", () => {
      this.currentIndex = Math.max(0, this.currentIndex - 1);
      this.render();
    });
    this.editor.on("redo", () => {
      this.currentIndex = Math.min(this.history.length - 1, this.currentIndex + 1);
      this.render();
    });
  }
  /**
   * 渲染标签页
   */
  render() {
    this.container = document.createElement("div");
    this.container.className = "history-tab";
    this.container.style.cssText = `
      display: flex;
      height: 100%;
    `;
    const toolbar = this.createToolbar();
    const content = document.createElement("div");
    content.style.cssText = `
      display: flex;
      flex: 1;
      overflow: hidden;
    `;
    this.listContainer = document.createElement("div");
    this.listContainer.className = "history-list";
    this.listContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      border-right: 1px solid #e0e0e0;
    `;
    this.detailsContainer = document.createElement("div");
    this.detailsContainer.className = "history-details";
    this.detailsContainer.style.cssText = `
      width: 350px;
      overflow-y: auto;
      background: #fafafa;
      display: none;
    `;
    content.appendChild(this.listContainer);
    content.appendChild(this.detailsContainer);
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      display: flex;
      flex-direction: column;
      height: 100%;
    `;
    wrapper.appendChild(toolbar);
    wrapper.appendChild(content);
    this.container.appendChild(wrapper);
    this.renderHistory();
    return this.container;
  }
  /**
   * 创建工具栏
   */
  createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.style.cssText = `
      display: flex;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
      gap: 10px;
      flex-shrink: 0;
    `;
    const undoBtn = document.createElement("button");
    undoBtn.style.cssText = `
      padding: 4px 8px;
      background: transparent;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    `;
    undoBtn.innerHTML = "\u21B6 \u64A4\u9500";
    undoBtn.onclick = () => this.undo();
    undoBtn.disabled = !this.canUndo();
    const redoBtn = document.createElement("button");
    redoBtn.style.cssText = undoBtn.style.cssText;
    redoBtn.innerHTML = "\u21B7 \u91CD\u505A";
    redoBtn.onclick = () => this.redo();
    redoBtn.disabled = !this.canRedo();
    const clearBtn = document.createElement("button");
    clearBtn.style.cssText = undoBtn.style.cssText;
    clearBtn.innerHTML = "\u{1F5D1}\uFE0F \u6E05\u7A7A\u5386\u53F2";
    clearBtn.onclick = () => this.clearHistory();
    const stats = document.createElement("div");
    stats.className = "history-stats";
    stats.style.cssText = `
      margin-left: auto;
      font-size: 12px;
      color: #666;
      display: flex;
      gap: 15px;
    `;
    stats.innerHTML = `
      <span>\u5171 ${this.history.length} \u6761\u8BB0\u5F55</span>
      <span>\u5F53\u524D\u4F4D\u7F6E: ${this.currentIndex + 1}</span>
      <span>\u5185\u5B58\u5360\u7528: ${this.calculateMemoryUsage()}</span>
    `;
    toolbar.appendChild(undoBtn);
    toolbar.appendChild(redoBtn);
    toolbar.appendChild(clearBtn);
    toolbar.appendChild(stats);
    return toolbar;
  }
  /**
   * 渲染历史列表
   */
  renderHistory() {
    if (!this.listContainer)
      return;
    this.listContainer.innerHTML = "";
    if (this.history.length === 0) {
      this.listContainer.innerHTML = `
        <div style="
          padding: 40px;
          text-align: center;
          color: #999;
        ">
          <div style="font-size: 32px; margin-bottom: 10px;">\u{1F4DC}</div>
          <div>\u6682\u65E0\u64CD\u4F5C\u5386\u53F2</div>
        </div>
      `;
      return;
    }
    const timeline = document.createElement("div");
    timeline.className = "history-timeline";
    timeline.style.cssText = `
      padding: 20px;
    `;
    this.history.forEach((entry, index) => {
      const item = this.createHistoryItem(entry, index);
      timeline.appendChild(item);
    });
    this.listContainer.appendChild(timeline);
    if (this.currentIndex >= 0) {
      const currentItem = this.listContainer.querySelector(`[data-index="${this.currentIndex}"]`);
      currentItem?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }
  /**
   * 创建历史条目
   */
  createHistoryItem(entry, index) {
    const item = document.createElement("div");
    item.className = "history-item";
    item.dataset.index = String(index);
    item.style.cssText = `
      display: flex;
      align-items: start;
      gap: 15px;
      margin-bottom: 20px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      padding-left: 30px;
    `;
    const timeline = document.createElement("div");
    timeline.style.cssText = `
      position: absolute;
      left: 10px;
      top: 0;
      bottom: ${index === this.history.length - 1 ? "50%" : "-20px"};
      width: 2px;
      background: ${index <= this.currentIndex ? "#667eea" : "#e0e0e0"};
    `;
    const dot = document.createElement("div");
    dot.style.cssText = `
      position: absolute;
      left: 6px;
      top: 8px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${index === this.currentIndex ? "#667eea" : index < this.currentIndex ? "#667eea" : "#e0e0e0"};
      border: 2px solid white;
      box-shadow: 0 0 0 1px #e0e0e0;
      z-index: 1;
    `;
    const card = document.createElement("div");
    card.style.cssText = `
      flex: 1;
      background: ${index === this.currentIndex ? "#f0f4ff" : "white"};
      border: 1px solid ${index === this.currentIndex ? "#667eea" : "#e0e0e0"};
      border-radius: 6px;
      padding: 12px 15px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      transition: all 0.2s;
    `;
    const header = document.createElement("div");
    header.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    `;
    const title = document.createElement("div");
    title.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    const icon = this.getTypeIcon(entry.type);
    const typeSpan = document.createElement("span");
    typeSpan.style.cssText = `
      font-size: 16px;
    `;
    typeSpan.textContent = icon;
    const descSpan = document.createElement("span");
    descSpan.style.cssText = `
      font-size: 13px;
      font-weight: 500;
      color: #333;
    `;
    descSpan.textContent = entry.description;
    title.appendChild(typeSpan);
    title.appendChild(descSpan);
    const time = document.createElement("span");
    time.style.cssText = `
      font-size: 11px;
      color: #999;
    `;
    time.textContent = this.formatTime(entry.timestamp);
    header.appendChild(title);
    header.appendChild(time);
    if (index === this.currentIndex) {
      const current = document.createElement("div");
      current.style.cssText = `
        font-size: 11px;
        color: #667eea;
        margin-top: 4px;
      `;
      current.textContent = "\u5F53\u524D\u4F4D\u7F6E";
      card.appendChild(current);
    } else if (index > this.currentIndex) {
      card.style.opacity = "0.5";
    }
    card.appendChild(header);
    card.onmouseenter = () => {
      if (index !== this.currentIndex) {
        card.style.transform = "translateX(5px)";
        card.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      }
    };
    card.onmouseleave = () => {
      card.style.transform = "translateX(0)";
      card.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
    };
    card.onclick = () => {
      this.selectEntry(entry, index);
    };
    item.appendChild(timeline);
    item.appendChild(dot);
    item.appendChild(card);
    return item;
  }
  /**
   * 获取类型图标
   */
  getTypeIcon(type) {
    const icons = {
      edit: "\u270F\uFE0F",
      insert: "\u2795",
      delete: "\u2796",
      format: "\u{1F3A8}",
      paste: "\u{1F4CB}",
      cut: "\u2702\uFE0F",
      undo: "\u21B6",
      redo: "\u21B7",
      plugin: "\u{1F50C}",
      default: "\u{1F4DD}"
    };
    return icons[type] || icons.default;
  }
  /**
   * 格式化时间
   */
  formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    if (diff < 6e4) {
      return "\u521A\u521A";
    } else if (diff < 36e5) {
      const minutes = Math.floor(diff / 6e4);
      return `${minutes} \u5206\u949F\u524D`;
    } else if (diff < 864e5) {
      const hours = Math.floor(diff / 36e5);
      return `${hours} \u5C0F\u65F6\u524D`;
    } else {
      const date = new Date(timestamp);
      return date.toLocaleString();
    }
  }
  /**
   * 选择历史条目
   */
  selectEntry(entry, index) {
    this.selectedEntry = entry;
    if (!this.detailsContainer)
      return;
    this.detailsContainer.style.display = "block";
    this.detailsContainer.innerHTML = `
      <div style="padding: 20px;">
        <h3 style="margin: 0 0 15px 0; font-size: 14px;">\u64CD\u4F5C\u8BE6\u60C5</h3>
        
        <div style="margin-bottom: 20px;">
          <div style="font-size: 12px; color: #999; margin-bottom: 5px;">\u7C7B\u578B</div>
          <div style="font-size: 13px;">
            ${this.getTypeIcon(entry.type)} ${entry.type}
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="font-size: 12px; color: #999; margin-bottom: 5px;">\u63CF\u8FF0</div>
          <div style="font-size: 13px;">${entry.description}</div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="font-size: 12px; color: #999; margin-bottom: 5px;">\u65F6\u95F4</div>
          <div style="font-size: 13px;">${new Date(entry.timestamp).toLocaleString()}</div>
        </div>
        
        ${entry.size ? `
          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: #999; margin-bottom: 5px;">\u5927\u5C0F</div>
            <div style="font-size: 13px;">${this.formatSize(entry.size)}</div>
          </div>
        ` : ""}
        
        ${entry.data ? `
          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: #999; margin-bottom: 5px;">\u6570\u636E</div>
            <div style="
              background: #f5f5f5;
              padding: 10px;
              border-radius: 4px;
              font-family: monospace;
              font-size: 11px;
              max-height: 200px;
              overflow-y: auto;
            ">
              <pre style="margin: 0;">${JSON.stringify(entry.data, null, 2)}</pre>
            </div>
          </div>
        ` : ""}
        
        <div style="display: flex; gap: 10px;">
          <button onclick="console.log('Goto:', ${index})" style="
            flex: 1;
            padding: 8px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
          ">\u8DF3\u8F6C\u5230\u6B64\u72B6\u6001</button>
          <button onclick="this.parentElement.parentElement.parentElement.style.display='none'" style="
            flex: 1;
            padding: 8px;
            background: #666;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
          ">\u5173\u95ED</button>
        </div>
      </div>
    `;
  }
  /**
   * 添加历史记录
   */
  addHistoryEntry(entry) {
    if (this.currentIndex < this.history.length - 1)
      this.history = this.history.slice(0, this.currentIndex + 1);
    const newEntry = {
      ...entry,
      id: `history-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      canUndo: true,
      canRedo: false,
      size: entry.snapshot ? new Blob([entry.snapshot]).size : void 0
    };
    this.history.push(newEntry);
    if (this.history.length > this.maxHistory)
      this.history.shift();
    else {
      this.currentIndex++;
    }
    if (this.container) {
      this.renderHistory();
      this.updateToolbar();
    }
  }
  /**
   * 获取变更描述
   */
  getChangeDescription(change) {
    if (change.type === "insert")
      return `\u63D2\u5165 ${change.text?.length || 0} \u4E2A\u5B57\u7B26`;
    else if (change.type === "delete")
      return `\u5220\u9664 ${change.removedLength || 0} \u4E2A\u5B57\u7B26`;
    else if (change.type === "format")
      return "\u683C\u5F0F\u5316\u6587\u672C";
    else
      return "\u7F16\u8F91\u6587\u6863";
  }
  /**
   * 撤销
   */
  undo() {
    if (!this.canUndo())
      return;
    this.editor.undo?.();
    logger.info("Undo performed");
  }
  /**
   * 重做
   */
  redo() {
    if (!this.canRedo())
      return;
    this.editor.redo?.();
    logger.info("Redo performed");
  }
  /**
   * 判断是否可以撤销
   */
  canUndo() {
    return this.currentIndex > 0;
  }
  /**
   * 判断是否可以重做
   */
  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }
  /**
   * 清空历史
   */
  clearHistory() {
    if (confirm("\u786E\u5B9A\u8981\u6E05\u7A7A\u6240\u6709\u5386\u53F2\u8BB0\u5F55\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002")) {
      this.history = [];
      this.currentIndex = -1;
      this.renderHistory();
      this.updateToolbar();
      logger.info("History cleared");
    }
  }
  /**
   * 更新工具栏
   */
  updateToolbar() {
    const toolbar = this.container?.querySelector(".history-stats");
    if (toolbar) {
      toolbar.innerHTML = `
        <span>\u5171 ${this.history.length} \u6761\u8BB0\u5F55</span>
        <span>\u5F53\u524D\u4F4D\u7F6E: ${this.currentIndex + 1}</span>
        <span>\u5185\u5B58\u5360\u7528: ${this.calculateMemoryUsage()}</span>
      `;
    }
    const undoBtn = this.container?.querySelector("button:nth-child(1)");
    const redoBtn = this.container?.querySelector("button:nth-child(2)");
    if (undoBtn)
      undoBtn.disabled = !this.canUndo();
    if (redoBtn)
      redoBtn.disabled = !this.canRedo();
  }
  /**
   * 计算内存占用
   */
  calculateMemoryUsage() {
    const totalSize = this.history.reduce((sum, entry) => sum + (entry.size || 0), 0);
    return this.formatSize(totalSize);
  }
  /**
   * 格式化大小
   */
  formatSize(bytes) {
    if (bytes < 1024)
      return `${bytes}B`;
    if (bytes < 1024 * 1024)
      return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  }
  /**
   * 激活标签页
   */
  activate() {
    this.renderHistory();
  }
  /**
   * 停用标签页
   */
  deactivate() {
  }
  /**
   * 销毁
   */
  destroy() {
    this.container = void 0;
  }
}

export { HistoryTab };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=HistoryTab.js.map
