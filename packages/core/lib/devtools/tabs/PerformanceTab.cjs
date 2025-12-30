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
var PerformanceMonitor = require('../../utils/PerformanceMonitor.cjs');

const logger = logger$1.createLogger("PerformanceTab");
class PerformanceTab {
  constructor(options) {
    this.performanceMonitor = PerformanceMonitor.getPerformanceMonitor();
    this.metrics = {
      fps: 60,
      memory: {
        used: 0,
        total: 0,
        limit: 0
      },
      renderTime: 0,
      scriptTime: 0,
      paintTime: 0,
      operations: []
    };
    this.charts = {};
    this.isActive = false;
    this.editor = options.editor;
  }
  /**
   * 渲染标签页
   */
  render() {
    this.container = document.createElement("div");
    this.container.className = "performance-tab";
    this.container.style.cssText = `
      padding: 20px;
      height: 100%;
      overflow-y: auto;
    `;
    const overview = this.createOverview();
    const charts = this.createCharts();
    const operations = this.createOperationsTable();
    const toolbar = this.createToolbar();
    this.container.appendChild(toolbar);
    this.container.appendChild(overview);
    this.container.appendChild(charts);
    this.container.appendChild(operations);
    return this.container;
  }
  /**
   * 创建工具栏
   */
  createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "performance-toolbar";
    toolbar.style.cssText = `
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e0e0e0;
    `;
    const recordBtn = document.createElement("button");
    recordBtn.className = "record-btn";
    recordBtn.style.cssText = `
      padding: 6px 12px;
      background: #ff4444;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
    `;
    recordBtn.innerHTML = '<span style="font-size: 10px;">\u23FA</span> \u5F00\u59CB\u5F55\u5236';
    let isRecording = false;
    recordBtn.onclick = () => {
      isRecording = !isRecording;
      if (isRecording) {
        this.startRecording();
        recordBtn.style.background = "#44aa44";
        recordBtn.innerHTML = '<span style="font-size: 10px;">\u23F8</span> \u505C\u6B62\u5F55\u5236';
      } else {
        this.stopRecording();
        recordBtn.style.background = "#ff4444";
        recordBtn.innerHTML = '<span style="font-size: 10px;">\u23FA</span> \u5F00\u59CB\u5F55\u5236';
      }
    };
    const clearBtn = document.createElement("button");
    clearBtn.style.cssText = `
      padding: 6px 12px;
      background: #666;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    `;
    clearBtn.textContent = "\u6E05\u7A7A\u6570\u636E";
    clearBtn.onclick = () => this.clearData();
    const exportBtn = document.createElement("button");
    exportBtn.style.cssText = clearBtn.style.cssText;
    exportBtn.style.background = "#667eea";
    exportBtn.textContent = "\u5BFC\u51FA\u62A5\u544A";
    exportBtn.onclick = () => this.exportReport();
    const gcBtn = document.createElement("button");
    gcBtn.style.cssText = clearBtn.style.cssText;
    gcBtn.style.background = "#ff9800";
    gcBtn.textContent = "\u5F3A\u5236GC";
    gcBtn.onclick = () => this.forceGC();
    toolbar.appendChild(recordBtn);
    toolbar.appendChild(clearBtn);
    toolbar.appendChild(exportBtn);
    toolbar.appendChild(gcBtn);
    return toolbar;
  }
  /**
   * 创建性能概览
   */
  createOverview() {
    const overview = document.createElement("div");
    overview.className = "performance-overview";
    overview.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    `;
    const metrics = [{
      id: "fps",
      label: "FPS",
      value: "60",
      color: "#4caf50",
      icon: "\u{1F4CA}"
    }, {
      id: "memory",
      label: "\u5185\u5B58\u4F7F\u7528",
      value: "0 MB",
      color: "#2196f3",
      icon: "\u{1F4BE}"
    }, {
      id: "render",
      label: "\u6E32\u67D3\u65F6\u95F4",
      value: "0 ms",
      color: "#ff9800",
      icon: "\u{1F3A8}"
    }, {
      id: "script",
      label: "\u811A\u672C\u65F6\u95F4",
      value: "0 ms",
      color: "#9c27b0",
      icon: "\u2699\uFE0F"
    }, {
      id: "nodes",
      label: "DOM\u8282\u70B9",
      value: "0",
      color: "#00bcd4",
      icon: "\u{1F333}"
    }, {
      id: "listeners",
      label: "\u4E8B\u4EF6\u76D1\u542C",
      value: "0",
      color: "#e91e63",
      icon: "\u{1F442}"
    }];
    metrics.forEach((metric) => {
      const card = document.createElement("div");
      card.className = `metric-card metric-${metric.id}`;
      card.style.cssText = `
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 15px;
        text-align: center;
        transition: transform 0.2s, box-shadow 0.2s;
      `;
      card.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 8px;">${metric.icon}</div>
        <div style="font-size: 24px; font-weight: bold; color: ${metric.color};" class="metric-value">
          ${metric.value}
        </div>
        <div style="font-size: 12px; color: #666; margin-top: 4px;">${metric.label}</div>
      `;
      card.onmouseenter = () => {
        card.style.transform = "translateY(-2px)";
        card.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
      };
      card.onmouseleave = () => {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "none";
      };
      overview.appendChild(card);
    });
    return overview;
  }
  /**
   * 创建图表区域
   */
  createCharts() {
    const charts = document.createElement("div");
    charts.className = "performance-charts";
    charts.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    `;
    const fpsChart = this.createChart("FPS \u8D8B\u52BF", "fps-chart");
    const memoryChart = this.createChart("\u5185\u5B58\u4F7F\u7528", "memory-chart");
    charts.appendChild(fpsChart);
    charts.appendChild(memoryChart);
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
    return charts;
  }
  /**
   * 创建单个图表容器
   */
  createChart(title, id) {
    const container = document.createElement("div");
    container.style.cssText = `
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
    `;
    container.innerHTML = `
      <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #333;">${title}</h3>
      <canvas id="${id}" width="300" height="150" style="width: 100%; height: 150px;"></canvas>
    `;
    return container;
  }
  /**
   * 初始化图表
   */
  initializeCharts() {
    const fpsCanvas = this.container?.querySelector("#fps-chart");
    if (fpsCanvas) {
      this.charts.fps = new SimpleChart(fpsCanvas, {
        maxDataPoints: 60,
        lineColor: "#4caf50",
        fillColor: "rgba(76, 175, 80, 0.2)",
        yMax: 120
      });
    }
    const memoryCanvas = this.container?.querySelector("#memory-chart");
    if (memoryCanvas) {
      this.charts.memory = new SimpleChart(memoryCanvas, {
        maxDataPoints: 60,
        lineColor: "#2196f3",
        fillColor: "rgba(33, 150, 243, 0.2)",
        yMax: 100
      });
    }
  }
  /**
   * 创建操作历史表格
   */
  createOperationsTable() {
    const container = document.createElement("div");
    container.className = "operations-container";
    container.style.cssText = `
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
    `;
    container.innerHTML = `
      <h3 style="margin: 0 0 15px 0; font-size: 14px; color: #333;">\u64CD\u4F5C\u5386\u53F2</h3>
      <div style="max-height: 200px; overflow-y: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 8px; text-align: left; border-bottom: 2px solid #e0e0e0;">\u64CD\u4F5C</th>
              <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e0e0e0;">\u8017\u65F6</th>
              <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e0e0e0;">\u65F6\u95F4\u6233</th>
            </tr>
          </thead>
          <tbody id="operations-tbody">
            <tr>
              <td colspan="3" style="padding: 20px; text-align: center; color: #999;">
                \u6682\u65E0\u64CD\u4F5C\u8BB0\u5F55
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
    logger.debug("Performance tab activated");
    this.startUpdating();
  }
  /**
   * 停用标签页
   */
  deactivate() {
    this.isActive = false;
    logger.debug("Performance tab deactivated");
    this.stopUpdating();
  }
  /**
   * 开始更新数据
   */
  startUpdating() {
    this.updateInterval = window.setInterval(() => {
      this.update();
    }, 1e3);
  }
  /**
   * 停止更新数据
   */
  stopUpdating() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = void 0;
    }
  }
  /**
   * 更新性能数据
   */
  update() {
    if (!this.isActive)
      return;
    if (performance.memory) {
      this.metrics.memory = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
      const memoryMB = Math.round(this.metrics.memory.used / 1024 / 1024);
      this.updateMetricCard("memory", `${memoryMB} MB`);
      this.charts.memory?.addDataPoint(memoryMB);
    }
    const nodeCount = document.querySelectorAll("*").length;
    this.updateMetricCard("nodes", nodeCount.toString());
    const listenerCount = this.countEventListeners();
    this.updateMetricCard("listeners", listenerCount.toString());
    const renderTime = this.performanceMonitor.getLastMeasure("render")?.duration || 0;
    this.updateMetricCard("render", `${renderTime.toFixed(2)} ms`);
    const scriptTime = this.performanceMonitor.getLastMeasure("script")?.duration || 0;
    this.updateMetricCard("script", `${scriptTime.toFixed(2)} ms`);
  }
  /**
   * 更新FPS
   */
  updateFPS(fps) {
    this.metrics.fps = fps;
    this.updateMetricCard("fps", fps.toString());
    this.charts.fps?.addDataPoint(fps);
    if (fps < 30)
      this.updateMetricCard("fps", fps.toString(), "#ff4444");
    else if (fps < 50)
      this.updateMetricCard("fps", fps.toString(), "#ff9800");
    else
      this.updateMetricCard("fps", fps.toString(), "#4caf50");
  }
  /**
   * 添加性能测量
   */
  addMeasure(measure) {
    this.metrics.operations.unshift({
      name: measure.name,
      duration: measure.duration,
      timestamp: measure.startTime
    });
    if (this.metrics.operations.length > 100)
      this.metrics.operations.pop();
    this.updateOperationsTable();
  }
  /**
   * 更新操作历史表格
   */
  updateOperationsTable() {
    const tbody = this.container?.querySelector("#operations-tbody");
    if (!tbody)
      return;
    if (this.metrics.operations.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="3" style="padding: 20px; text-align: center; color: #999;">
            \u6682\u65E0\u64CD\u4F5C\u8BB0\u5F55
          </td>
        </tr>
      `;
      return;
    }
    tbody.innerHTML = this.metrics.operations.slice(0, 20).map((op) => {
      const time = new Date(op.timestamp).toLocaleTimeString();
      const duration = op.duration.toFixed(2);
      const durationColor = op.duration > 100 ? "#ff4444" : op.duration > 50 ? "#ff9800" : "#4caf50";
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${op.name}</td>
          <td style="padding: 8px; text-align: right; border-bottom: 1px solid #f0f0f0; color: ${durationColor};">
            ${duration} ms
          </td>
          <td style="padding: 8px; text-align: right; border-bottom: 1px solid #f0f0f0; color: #999;">
            ${time}
          </td>
        </tr>
      `;
    }).join("");
  }
  /**
   * 更新指标卡片
   */
  updateMetricCard(id, value, color) {
    const valueEl = this.container?.querySelector(`.metric-${id} .metric-value`);
    if (valueEl) {
      valueEl.textContent = value;
      if (color)
        valueEl.style.color = color;
    }
  }
  /**
   * 统计事件监听器数量
   */
  countEventListeners() {
    let count = 0;
    const allElements = document.querySelectorAll("*");
    allElements.forEach((element) => {
      const events = element._events || {};
      count += Object.keys(events).length;
    });
    return count;
  }
  /**
   * 开始录制
   */
  startRecording() {
    logger.info("Started performance recording");
    this.performanceMonitor.startRecording();
    this.clearData();
  }
  /**
   * 停止录制
   */
  stopRecording() {
    logger.info("Stopped performance recording");
    const recording = this.performanceMonitor.stopRecording();
    this.analyzeRecording(recording);
  }
  /**
   * 分析录制数据
   */
  analyzeRecording(recording) {
    logger.debug("Analyzing recording:", recording);
  }
  /**
   * 清空数据
   */
  clearData() {
    this.metrics.operations = [];
    this.updateOperationsTable();
    this.charts.fps?.clear();
    this.charts.memory?.clear();
    logger.info("Performance data cleared");
  }
  /**
   * 导出报告
   */
  exportReport() {
    const report = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      metrics: this.metrics,
      editor: {
        version: this.editor.version,
        plugins: this.editor.plugins?.getLoadedPlugins() || []
      }
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logger.info("Performance report exported");
  }
  /**
   * 强制垃圾回收
   */
  forceGC() {
    if (window.gc) {
      window.gc();
      logger.info("Garbage collection triggered");
    } else {
      logger.warn('Garbage collection not available. Run Chrome with --js-flags="--expose-gc"');
    }
  }
  /**
   * 销毁
   */
  destroy() {
    this.stopUpdating();
    this.container = void 0;
  }
}
class SimpleChart {
  constructor(canvas, options) {
    this.data = [];
    this.ctx = canvas.getContext("2d");
    this.options = options;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  addDataPoint(value) {
    this.data.push(value);
    if (this.data.length > this.options.maxDataPoints)
      this.data.shift();
    this.draw();
  }
  clear() {
    this.data = [];
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
    if (this.data.length < 2)
      return;
    this.ctx.strokeStyle = "#f0f0f0";
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = actualHeight / 4 * i;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(actualWidth, y);
      this.ctx.stroke();
    }
    const stepX = actualWidth / (this.options.maxDataPoints - 1);
    const scaleY = actualHeight / this.options.yMax;
    this.ctx.fillStyle = this.options.fillColor;
    this.ctx.beginPath();
    this.ctx.moveTo(0, actualHeight);
    this.data.forEach((value, index) => {
      const x = index * stepX;
      const y = actualHeight - value * scaleY;
      this.ctx.lineTo(x, y);
    });
    this.ctx.lineTo((this.data.length - 1) * stepX, actualHeight);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.strokeStyle = this.options.lineColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.data.forEach((value, index) => {
      const x = index * stepX;
      const y = actualHeight - value * scaleY;
      if (index === 0)
        this.ctx.moveTo(x, y);
      else
        this.ctx.lineTo(x, y);
    });
    this.ctx.stroke();
  }
}

exports.PerformanceTab = PerformanceTab;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=PerformanceTab.cjs.map
