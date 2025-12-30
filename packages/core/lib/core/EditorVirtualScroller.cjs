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

var logger$1 = require('../utils/logger.cjs');
var PerformanceMonitor = require('../utils/PerformanceMonitor.cjs');
var VirtualScroller = require('./VirtualScroller.cjs');

const logger = logger$1.createLogger("EditorVirtualScroller");
class EditorVirtualScroller {
  constructor(options) {
    this.lines = [];
    this.lineCache = /* @__PURE__ */ new Map();
    this.performanceMonitor = PerformanceMonitor.getPerformanceMonitor();
    this.isDirty = false;
    this.editor = options.editor;
    this.options = {
      lineHeight: 21,
      maxLines: 1e6,
      enableSyntaxHighlight: true,
      enableLineNumbers: true,
      enableWordWrap: true,
      ...options
    };
    const container = this.createContainer();
    this.virtualScroller = new VirtualScroller.VirtualScroller({
      container,
      itemHeight: this.options.lineHeight,
      bufferSize: 10,
      dynamicHeight: this.options.enableWordWrap,
      scrollThrottle: 8,
      renderer: this.renderLine.bind(this)
    });
    this.setupEventListeners();
    this.initializeSyntaxWorker();
  }
  /**
   * 设置编辑器内容
   */
  setContent(content) {
    const timer = this.performanceMonitor.startTimer("virtualscroll.setContent");
    try {
      const lines = this.parseContent(content);
      this.lines = lines;
      this.lineCache.clear();
      const items = lines.map((line, index) => ({
        id: line.id,
        data: line,
        height: this.estimateLineHeight(line)
      }));
      this.virtualScroller.setItems(items);
      logger.info(`Loaded ${lines.length} lines`);
    } finally {
      this.performanceMonitor.endTimer(timer);
    }
  }
  /**
   * 更新指定行
   */
  updateLine(lineNumber, content) {
    if (lineNumber < 0 || lineNumber >= this.lines.length)
      return;
    const line = this.lines[lineNumber];
    line.content = content;
    line.isDirty = true;
    this.lineCache.delete(lineNumber);
    this.virtualScroller.refreshItem(line.id);
    if (this.options.enableSyntaxHighlight)
      this.requestSyntaxHighlight(lineNumber);
  }
  /**
   * 插入行
   */
  insertLines(lineNumber, contents) {
    const newLines = contents.map((content, index) => ({
      id: `line-${Date.now()}-${index}`,
      lineNumber: lineNumber + index,
      content,
      isDirty: true
    }));
    for (let i = lineNumber; i < this.lines.length; i++)
      this.lines[i].lineNumber += contents.length;
    this.lines.splice(lineNumber, 0, ...newLines);
    const items = newLines.map((line) => ({
      id: line.id,
      data: line,
      height: this.estimateLineHeight(line)
    }));
    this.virtualScroller.addItems(items, lineNumber);
  }
  /**
   * 删除行
   */
  deleteLines(startLine, count) {
    const deletedLines = this.lines.splice(startLine, count);
    const ids = deletedLines.map((line) => line.id);
    for (let i = startLine; i < this.lines.length; i++)
      this.lines[i].lineNumber -= count;
    deletedLines.forEach((line) => {
      this.lineCache.delete(line.lineNumber);
    });
    this.virtualScroller.removeItems(ids);
  }
  /**
   * 滚动到指定行
   */
  scrollToLine(lineNumber, position = "center") {
    if (lineNumber < 0 || lineNumber >= this.lines.length)
      return;
    const line = this.lines[lineNumber];
    this.virtualScroller.scrollToItem(line.id, position);
  }
  /**
   * 获取可见行范围
   */
  getVisibleLineRange() {
    const visibleItems = this.virtualScroller.getVisibleItems();
    if (visibleItems.length === 0)
      return {
        start: 0,
        end: 0
      };
    const start = visibleItems[0].data.lineNumber;
    const end = visibleItems[visibleItems.length - 1].data.lineNumber;
    return {
      start,
      end
    };
  }
  /**
   * 销毁
   */
  destroy() {
    this.virtualScroller.destroy();
    this.syntaxWorker?.terminate();
    clearTimeout(this.renderTimer);
  }
  createContainer() {
    const container = document.createElement("div");
    container.className = "editor-virtual-scroll-container";
    container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
      line-height: ${this.options.lineHeight}px;
    `;
    const editorElement = this.editor.getElement();
    editorElement.appendChild(container);
    return container;
  }
  parseContent(content) {
    const lines = content.split("\n");
    if (lines.length > this.options.maxLines) {
      logger.warn(`Content exceeds max lines limit (${this.options.maxLines})`);
      lines.length = this.options.maxLines;
    }
    return lines.map((content2, index) => ({
      id: `line-${index}`,
      lineNumber: index,
      content: content2
    }));
  }
  estimateLineHeight(line) {
    if (!this.options.enableWordWrap)
      return this.options.lineHeight;
    const charsPerLine = 80;
    const lines = Math.ceil(line.content.length / charsPerLine);
    return lines * this.options.lineHeight;
  }
  renderLine(line, index) {
    const cached = this.lineCache.get(line.lineNumber);
    if (cached && !cached.isDirty)
      return this.createLineElement(cached);
    const element = this.createLineElement(line);
    this.lineCache.set(line.lineNumber, {
      ...line,
      isDirty: false
    });
    return element;
  }
  createLineElement(line) {
    const element = document.createElement("div");
    element.className = "editor-line";
    element.style.cssText = `
      display: flex;
      white-space: ${this.options.enableWordWrap ? "pre-wrap" : "pre"};
      word-break: ${this.options.enableWordWrap ? "break-word" : "normal"};
      min-height: ${this.options.lineHeight}px;
    `;
    if (this.options.enableLineNumbers) {
      const lineNumber = document.createElement("span");
      lineNumber.className = "line-number";
      lineNumber.style.cssText = `
        display: inline-block;
        width: 50px;
        text-align: right;
        padding-right: 10px;
        color: #858585;
        user-select: none;
        flex-shrink: 0;
      `;
      lineNumber.textContent = String(line.lineNumber + 1);
      element.appendChild(lineNumber);
    }
    const content = document.createElement("span");
    content.className = "line-content";
    content.style.cssText = `
      flex: 1;
      padding-left: 10px;
    `;
    if (line.syntaxTokens && this.options.enableSyntaxHighlight) {
      content.innerHTML = this.applySyntaxHighlight(line.content, line.syntaxTokens);
    } else {
      content.textContent = line.content || "\u200B";
    }
    element.appendChild(content);
    return element;
  }
  applySyntaxHighlight(content, tokens) {
    let html = "";
    let lastIndex = 0;
    tokens.forEach((token) => {
      if (token.start > lastIndex)
        html += this.escapeHtml(content.slice(lastIndex, token.start));
      const tokenText = content.slice(token.start, token.end);
      html += `<span class="token-${token.type}">${this.escapeHtml(tokenText)}</span>`;
      lastIndex = token.end;
    });
    if (lastIndex < content.length)
      html += this.escapeHtml(content.slice(lastIndex));
    return html;
  }
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
  setupEventListeners() {
    this.virtualScroller.on("scroll", (metrics) => {
      this.editor.emit("virtualScroll", metrics);
    });
    this.editor.on("change", () => {
      this.isDirty = true;
      this.scheduleRender();
    });
  }
  scheduleRender() {
    if (this.renderTimer)
      return;
    this.renderTimer = requestAnimationFrame(() => {
      this.renderTimer = null;
      if (this.isDirty) {
        this.isDirty = false;
        this.updateDirtyLines();
      }
    });
  }
  updateDirtyLines() {
    const dirtyLines = this.lines.filter((line) => line.isDirty);
    dirtyLines.forEach((line) => {
      this.virtualScroller.refreshItem(line.id);
      line.isDirty = false;
    });
  }
  initializeSyntaxWorker() {
    if (!this.options.enableSyntaxHighlight)
      return;
    const workerCode = `
      self.onmessage = function(e) {
        const { lineNumber, content } = e.data
        
        // \u7B80\u5355\u7684\u8BED\u6CD5\u9AD8\u4EAE\u793A\u4F8B
        const tokens = []
        
        // \u5339\u914D\u5173\u952E\u5B57
        const keywords = /\\b(function|const|let|var|if|else|for|while|return|class|extends)\\b/g
        let match
        while ((match = keywords.exec(content)) !== null) {
          tokens.push({
            type: 'keyword',
            start: match.index,
            end: match.index + match[0].length
          })
        }
        
        // \u5339\u914D\u5B57\u7B26\u4E32
        const strings = /(['"])(?:(?=(\\\\?))\\2.)*?\\1/g
        while ((match = strings.exec(content)) !== null) {
          tokens.push({
            type: 'string',
            start: match.index,
            end: match.index + match[0].length
          })
        }
        
        // \u5339\u914D\u6CE8\u91CA
        const comments = /\\/\\/.*$/gm
        while ((match = comments.exec(content)) !== null) {
          tokens.push({
            type: 'comment',
            start: match.index,
            end: match.index + match[0].length
          })
        }
        
        self.postMessage({ lineNumber, tokens })
      }
    `;
    const blob = new Blob([workerCode], {
      type: "application/javascript"
    });
    this.syntaxWorker = new Worker(URL.createObjectURL(blob));
    this.syntaxWorker.onmessage = (e) => {
      const {
        lineNumber,
        tokens
      } = e.data;
      const line = this.lines[lineNumber];
      if (line) {
        line.syntaxTokens = tokens;
        this.virtualScroller.refreshItem(line.id);
      }
    };
  }
  requestSyntaxHighlight(lineNumber) {
    if (!this.syntaxWorker)
      return;
    const line = this.lines[lineNumber];
    if (line) {
      this.syntaxWorker.postMessage({
        lineNumber,
        content: line.content
      });
    }
  }
  /**
   * 获取性能指标
   */
  getPerformanceMetrics() {
    const virtualScrollerMetrics = this.virtualScroller.getPerformanceMetrics();
    return {
      ...virtualScrollerMetrics,
      totalLines: this.lines.length,
      cachedLines: this.lineCache.size,
      visibleRange: this.getVisibleLineRange()
    };
  }
}

exports.EditorVirtualScroller = EditorVirtualScroller;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=EditorVirtualScroller.cjs.map
