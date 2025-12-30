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

const logger = createLogger("MemoryTab");
class MemoryTab {
  constructor(options) {
    this.snapshots = [];
    this.isActive = false;
    this.editor = options.editor;
  }
  /**
   * 渲染标签页
   */
  render() {
    this.container = document.createElement("div");
    this.container.className = "memory-tab";
    this.container.style.cssText = `
      padding: 20px;
      height: 100%;
      overflow-y: auto;
    `;
    const toolbar = this.createToolbar();
    const overview = this.createOverview();
    const timeline = this.createTimeline();
    const allocations = this.createAllocationsTable();
    this.container.appendChild(toolbar);
    this.container.appendChild(overview);
    this.container.appendChild(timeline);
    this.container.appendChild(allocations);
    return this.container;
  }
  /**
   * 创建工具栏
   */
  createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "memory-toolbar";
    toolbar.style.cssText = `
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e0e0e0;
    `;
    const snapshotBtn = document.createElement("button");
    snapshotBtn.style.cssText = `
      padding: 6px 12px;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    `;
    snapshotBtn.innerHTML = "\u{1F4F8} \u62CD\u6444\u5FEB\u7167";
    snapshotBtn.onclick = () => this.takeSnapshot();
    const compareBtn = document.createElement("button");
    compareBtn.style.cssText = snapshotBtn.style.cssText;
    compareBtn.style.background = "#4caf50";
    compareBtn.innerHTML = "\u{1F50D} \u6BD4\u8F83\u5FEB\u7167";
    compareBtn.onclick = () => this.compareSnapshots();
    const clearBtn = document.createElement("button");
    clearBtn.style.cssText = snapshotBtn.style.cssText;
    clearBtn.style.background = "#666";
    clearBtn.innerHTML = "\u{1F5D1}\uFE0F \u6E05\u7A7A";
    clearBtn.onclick = () => this.clearSnapshots();
    const gcBtn = document.createElement("button");
    gcBtn.style.cssText = snapshotBtn.style.cssText;
    gcBtn.style.background = "#ff9800";
    gcBtn.innerHTML = "\u267B\uFE0F \u5783\u573E\u56DE\u6536";
    gcBtn.onclick = () => this.triggerGC();
    toolbar.appendChild(snapshotBtn);
    toolbar.appendChild(compareBtn);
    toolbar.appendChild(clearBtn);
    toolbar.appendChild(gcBtn);
    return toolbar;
  }
  /**
   * 创建内存概览
   */
  createOverview() {
    const overview = document.createElement("div");
    overview.className = "memory-overview";
    overview.style.cssText = `
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    `;
    overview.innerHTML = `
      <h3 style="margin: 0 0 15px 0; font-size: 16px;">\u5185\u5B58\u6982\u89C8</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
        <div class="memory-stat">
          <div style="font-size: 12px; color: #999; margin-bottom: 5px;">\u5DF2\u4F7F\u7528</div>
          <div style="font-size: 24px; font-weight: bold; color: #2196f3;" id="used-memory">0 MB</div>
          <div style="font-size: 11px; color: #666; margin-top: 5px;" id="used-percent">0%</div>
        </div>
        <div class="memory-stat">
          <div style="font-size: 12px; color: #999; margin-bottom: 5px;">\u603B\u5206\u914D</div>
          <div style="font-size: 24px; font-weight: bold; color: #4caf50;" id="total-memory">0 MB</div>
          <div style="font-size: 11px; color: #666; margin-top: 5px;" id="total-percent">0%</div>
        </div>
        <div class="memory-stat">
          <div style="font-size: 12px; color: #999; margin-bottom: 5px;">\u9650\u5236</div>
          <div style="font-size: 24px; font-weight: bold; color: #ff9800;" id="limit-memory">0 GB</div>
          <div style="font-size: 11px; color: #666; margin-top: 5px;">\u6700\u5927\u53EF\u7528</div>
        </div>
      </div>
      
      <div style="margin-top: 20px;">
        <div style="background: #f0f0f0; height: 20px; border-radius: 10px; overflow: hidden;">
          <div id="memory-bar" style="
            height: 100%;
            background: linear-gradient(90deg, #2196f3, #4caf50);
            width: 0%;
            transition: width 0.3s ease-out;
          "></div>
        </div>
      </div>
    `;
    return overview;
  }
  /**
   * 创建内存时间线
   */
  createTimeline() {
    const timeline = document.createElement("div");
    timeline.className = "memory-timeline";
    timeline.style.cssText = `
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    `;
    timeline.innerHTML = `
      <h3 style="margin: 0 0 15px 0; font-size: 16px;">\u5185\u5B58\u65F6\u95F4\u7EBF</h3>
      <canvas id="memory-timeline-chart" width="600" height="200" style="width: 100%; height: 200px;"></canvas>
    `;
    return timeline;
  }
  /**
   * 创建对象分配表
   */
  createAllocationsTable() {
    const container = document.createElement("div");
    container.className = "allocations-container";
    container.style.cssText = `
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
    `;
    container.innerHTML = `
      <h3 style="margin: 0 0 15px 0; font-size: 16px;">\u5BF9\u8C61\u5206\u914D</h3>
      <div style="max-height: 300px; overflow-y: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e0e0e0;">\u7C7B\u578B</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e0e0e0;">\u6570\u91CF</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e0e0e0;">\u5927\u5C0F</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e0e0e0;">\u4FDD\u7559</th>
            </tr>
          </thead>
          <tbody id="allocations-tbody">
            <tr>
              <td colspan="4" style="padding: 20px; text-align: center; color: #999;">
                \u70B9\u51FB"\u62CD\u6444\u5FEB\u7167"\u67E5\u770B\u5BF9\u8C61\u5206\u914D
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    return container;
  }
  /**
   * 激活标签页
   */
  activate() {
    this.isActive = true;
    logger.debug("Memory tab activated");
    this.initializeChart();
    this.startUpdating();
  }
  /**
   * 停用标签页
   */
  deactivate() {
    this.isActive = false;
    logger.debug("Memory tab deactivated");
    this.stopUpdating();
  }
  /**
   * 初始化图表
   */
  initializeChart() {
    const canvas = this.container?.querySelector("#memory-timeline-chart");
    if (canvas)
      this.chart = new MemoryChart(canvas);
  }
  /**
   * 开始更新
   */
  startUpdating() {
    this.update();
    this.updateInterval = window.setInterval(() => {
      this.update();
    }, 2e3);
  }
  /**
   * 停止更新
   */
  stopUpdating() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = void 0;
    }
  }
  /**
   * 更新内存信息
   */
  update() {
    if (!this.isActive)
      return;
    if (!performance.memory) {
      logger.warn("Performance.memory not available");
      return;
    }
    const memory = performance.memory;
    const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
    const limitGB = (memory.jsHeapSizeLimit / 1024 / 1024 / 1024).toFixed(2);
    this.updateElement("#used-memory", `${usedMB} MB`);
    this.updateElement("#used-percent", `${Math.round(memory.usedJSHeapSize / memory.totalJSHeapSize * 100)}%`);
    this.updateElement("#total-memory", `${totalMB} MB`);
    this.updateElement("#total-percent", `${Math.round(memory.totalJSHeapSize / memory.jsHeapSizeLimit * 100)}%`);
    this.updateElement("#limit-memory", `${limitGB} GB`);
    const memoryBar = this.container?.querySelector("#memory-bar");
    if (memoryBar) {
      const percent = memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100;
      memoryBar.style.width = `${percent}%`;
      if (percent > 80)
        memoryBar.style.background = "linear-gradient(90deg, #ff4444, #ff6666)";
      else if (percent > 60)
        memoryBar.style.background = "linear-gradient(90deg, #ff9800, #ffb74d)";
      else
        memoryBar.style.background = "linear-gradient(90deg, #2196f3, #4caf50)";
    }
    this.chart?.addDataPoint({
      used: usedMB,
      total: totalMB,
      timestamp: Date.now()
    });
  }
  /**
   * 拍摄内存快照
   */
  async takeSnapshot() {
    logger.info("Taking memory snapshot");
    const snapshot = {
      timestamp: Date.now(),
      usedJSHeapSize: performance.memory?.usedJSHeapSize || 0,
      totalJSHeapSize: performance.memory?.totalJSHeapSize || 0,
      jsHeapSizeLimit: performance.memory?.jsHeapSizeLimit || 0,
      objects: this.analyzeObjects()
    };
    this.snapshots.push(snapshot);
    this.currentSnapshot = snapshot;
    this.updateAllocationsTable(snapshot.objects);
    this.showNotification("\u5FEB\u7167\u5DF2\u521B\u5EFA", "success");
  }
  /**
   * 分析对象分配
   */
  analyzeObjects() {
    const allocations = [];
    const elements = document.querySelectorAll("*");
    const elementsByTag = /* @__PURE__ */ new Map();
    elements.forEach((el) => {
      const tag = el.tagName.toLowerCase();
      elementsByTag.set(tag, (elementsByTag.get(tag) || 0) + 1);
    });
    elementsByTag.forEach((count, tag) => {
      allocations.push({
        type: `DOM:${tag}`,
        count,
        size: count * 100,
        // 估算
        retained: count * 50
      });
    });
    const editorSize = this.estimateObjectSize(this.editor);
    allocations.push({
      type: "Editor",
      count: 1,
      size: editorSize,
      retained: editorSize
    });
    allocations.sort((a, b) => b.size - a.size);
    return allocations.slice(0, 20);
  }
  /**
   * 估算对象大小
   */
  estimateObjectSize(obj) {
    const str = JSON.stringify(obj, null, 2);
    return str ? str.length * 2 : 0;
  }
  /**
   * 更新对象分配表
   */
  updateAllocationsTable(allocations) {
    const tbody = this.container?.querySelector("#allocations-tbody");
    if (!tbody)
      return;
    tbody.innerHTML = allocations.map((alloc) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">
          <span style="font-family: monospace; font-size: 12px;">${alloc.type}</span>
        </td>
        <td style="padding: 8px; text-align: right; border-bottom: 1px solid #f0f0f0;">
          ${alloc.count.toLocaleString()}
        </td>
        <td style="padding: 8px; text-align: right; border-bottom: 1px solid #f0f0f0;">
          ${this.formatBytes(alloc.size)}
        </td>
        <td style="padding: 8px; text-align: right; border-bottom: 1px solid #f0f0f0;">
          ${this.formatBytes(alloc.retained)}
        </td>
      </tr>
    `).join("");
  }
  /**
   * 比较快照
   */
  compareSnapshots() {
    if (this.snapshots.length < 2) {
      this.showNotification("\u9700\u8981\u81F3\u5C112\u4E2A\u5FEB\u7167\u8FDB\u884C\u6BD4\u8F83", "warning");
      return;
    }
    logger.info("Comparing snapshots");
  }
  /**
   * 清空快照
   */
  clearSnapshots() {
    this.snapshots = [];
    this.currentSnapshot = void 0;
    const tbody = this.container?.querySelector("#allocations-tbody");
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="padding: 20px; text-align: center; color: #999;">
            \u70B9\u51FB"\u62CD\u6444\u5FEB\u7167"\u67E5\u770B\u5BF9\u8C61\u5206\u914D
          </td>
        </tr>
      `;
    }
    this.showNotification("\u5FEB\u7167\u5DF2\u6E05\u7A7A", "info");
  }
  /**
   * 触发垃圾回收
   */
  triggerGC() {
    if (window.gc) {
      window.gc();
      this.showNotification("\u5783\u573E\u56DE\u6536\u5DF2\u89E6\u53D1", "success");
      setTimeout(() => {
        this.update();
      }, 500);
    } else {
      this.showNotification("\u5783\u573E\u56DE\u6536\u4E0D\u53EF\u7528\uFF0C\u8BF7\u4F7F\u7528 --expose-gc \u6807\u5FD7\u542F\u52A8Chrome", "error");
    }
  }
  /**
   * 格式化字节数
   */
  formatBytes(bytes) {
    if (bytes < 1024)
      return `${bytes} B`;
    if (bytes < 1024 * 1024)
      return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }
  /**
   * 更新元素内容
   */
  updateElement(selector, content) {
    const element = this.container?.querySelector(selector);
    if (element)
      element.textContent = content;
  }
  /**
   * 显示通知
   */
  showNotification(message, type = "info") {
    logger.info(`[${type}] ${message}`);
  }
  /**
   * 销毁
   */
  destroy() {
    this.stopUpdating();
    this.container = void 0;
  }
}
class MemoryChart {
  constructor(canvas) {
    this.data = [];
    this.maxPoints = 60;
    this.ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.draw();
  }
  addDataPoint(point) {
    this.data.push(point);
    if (this.data.length > this.maxPoints)
      this.data.shift();
    this.draw();
  }
  draw() {
    const {
      width,
      height
    } = this.ctx.canvas;
    const actualWidth = width / window.devicePixelRatio;
    const actualHeight = height / window.devicePixelRatio;
    this.ctx.clearRect(0, 0, actualWidth, actualHeight);
    this.drawGrid(actualWidth, actualHeight);
    if (this.data.length < 2)
      return;
    const maxValue = Math.max(...this.data.map((d) => d.total));
    const scale = actualHeight / (maxValue * 1.2);
    this.drawLine(this.data.map((d) => d.total), scale, actualWidth, actualHeight, "#4caf50", "rgba(76, 175, 80, 0.2)");
    this.drawLine(this.data.map((d) => d.used), scale, actualWidth, actualHeight, "#2196f3", "rgba(33, 150, 243, 0.2)");
  }
  drawGrid(width, height) {
    this.ctx.strokeStyle = "#f0f0f0";
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = height / 5 * i;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }
  }
  drawLine(data, scale, width, height, lineColor, fillColor) {
    const stepX = width / (this.maxPoints - 1);
    this.ctx.fillStyle = fillColor;
    this.ctx.beginPath();
    this.ctx.moveTo(0, height);
    data.forEach((value, index) => {
      const x = index * stepX;
      const y = height - value * scale;
      this.ctx.lineTo(x, y);
    });
    this.ctx.lineTo((data.length - 1) * stepX, height);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.strokeStyle = lineColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    data.forEach((value, index) => {
      const x = index * stepX;
      const y = height - value * scale;
      if (index === 0)
        this.ctx.moveTo(x, y);
      else
        this.ctx.lineTo(x, y);
    });
    this.ctx.stroke();
  }
}

export { MemoryTab };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=MemoryTab.js.map
