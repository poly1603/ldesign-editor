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

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      fps: 0,
      eventCount: 0,
      pluginCount: 0,
      activePlugins: 0
    };
    this.entries = [];
    this.timers = /* @__PURE__ */ new Map();
    this.fpsFrames = [];
    this.lastFrameTime = 0;
    this.maxEntries = 1e3;
    this.startFPSMonitoring();
    this.startMemoryMonitoring();
  }
  /**
   * 开始计时
   */
  start(name) {
    this.timers.set(name, performance.now());
  }
  /**
   * 结束计时
   */
  end(name, metadata) {
    const startTime = this.timers.get(name);
    if (!startTime) {
      console.warn(`Timer "${name}" was not started`);
      return 0;
    }
    const duration = performance.now() - startTime;
    this.timers.delete(name);
    this.addEntry({
      name,
      startTime,
      duration,
      metadata
    });
    return duration;
  }
  /**
   * 测量函数执行时间
   */
  async measure(name, fn, metadata) {
    this.start(name);
    try {
      const result = await fn();
      this.end(name, metadata);
      return result;
    } catch (error) {
      this.end(name, {
        ...metadata,
        error: true
      });
      throw error;
    }
  }
  /**
   * 记录性能条目
   */
  addEntry(entry) {
    this.entries.push(entry);
    if (this.entries.length > this.maxEntries)
      this.entries.shift();
  }
  /**
   * 开始FPS监控
   */
  startFPSMonitoring() {
    const measureFPS = (timestamp) => {
      if (this.lastFrameTime) {
        const delta = timestamp - this.lastFrameTime;
        const fps = 1e3 / delta;
        this.fpsFrames.push(fps);
        if (this.fpsFrames.length > 60)
          this.fpsFrames.shift();
        this.metrics.fps = Math.round(this.fpsFrames.reduce((a, b) => a + b, 0) / this.fpsFrames.length);
      }
      this.lastFrameTime = timestamp;
      requestAnimationFrame(measureFPS);
    };
    requestAnimationFrame(measureFPS);
  }
  /**
   * 开始内存监控
   */
  startMemoryMonitoring() {
    if ("memory" in performance) {
      setInterval(() => {
        const memory = performance.memory;
        if (memory) {
          this.metrics.memoryUsage = Math.round(
            memory.usedJSHeapSize / 1048576
            // 转换为MB
          );
        }
      }, 5e3);
    }
  }
  /**
   * 更新指标
   */
  updateMetrics(updates) {
    Object.assign(this.metrics, updates);
  }
  /**
   * 获取当前指标
   */
  getMetrics() {
    return {
      ...this.metrics
    };
  }
  /**
   * 获取性能条目
   */
  getEntries(name) {
    if (name)
      return this.entries.filter((e) => e.name === name);
    return [...this.entries];
  }
  /**
   * 获取统计信息
   */
  getStats(name) {
    const entries = name ? this.getEntries(name) : this.entries;
    if (entries.length === 0)
      return {
        count: 0,
        total: 0,
        average: 0,
        min: 0,
        max: 0
      };
    const durations = entries.map((e) => e.duration);
    const total = durations.reduce((a, b) => a + b, 0);
    return {
      count: entries.length,
      total,
      average: total / entries.length,
      min: Math.min(...durations),
      max: Math.max(...durations)
    };
  }
  /**
   * 获取慢操作
   */
  getSlowOperations(threshold = 100) {
    return this.entries.filter((e) => e.duration > threshold);
  }
  /**
   * 生成报告
   */
  generateReport() {
    const metrics = this.getMetrics();
    const stats = this.getStats();
    const slowOps = this.getSlowOperations();
    return `
\u6027\u80FD\u62A5\u544A
========

\u57FA\u7840\u6307\u6807:
- \u52A0\u8F7D\u65F6\u95F4: ${metrics.loadTime.toFixed(2)}ms
- \u6E32\u67D3\u65F6\u95F4: ${metrics.renderTime.toFixed(2)}ms
- \u5185\u5B58\u4F7F\u7528: ${metrics.memoryUsage}MB
- FPS: ${metrics.fps}
- \u4E8B\u4EF6\u6570: ${metrics.eventCount}
- \u63D2\u4EF6\u603B\u6570: ${metrics.pluginCount}
- \u6D3B\u8DC3\u63D2\u4EF6: ${metrics.activePlugins}

\u6027\u80FD\u7EDF\u8BA1:
- \u64CD\u4F5C\u603B\u6570: ${stats.count}
- \u603B\u8017\u65F6: ${stats.total.toFixed(2)}ms
- \u5E73\u5747\u8017\u65F6: ${stats.average.toFixed(2)}ms
- \u6700\u5C0F\u8017\u65F6: ${stats.min.toFixed(2)}ms
- \u6700\u5927\u8017\u65F6: ${stats.max.toFixed(2)}ms

\u6162\u64CD\u4F5C (>100ms):
${slowOps.map((op) => `- ${op.name}: ${op.duration.toFixed(2)}ms`).join("\n") || "\u65E0"}

\u5EFA\u8BAE:
${this.generateRecommendations()}
    `.trim();
  }
  /**
   * 生成优化建议
   */
  generateRecommendations() {
    const recommendations = [];
    const metrics = this.getMetrics();
    const slowOps = this.getSlowOperations();
    if (metrics.fps < 30)
      recommendations.push("- FPS\u8FC7\u4F4E\uFF0C\u8003\u8651\u51CF\u5C11DOM\u64CD\u4F5C\u6216\u542F\u7528\u865A\u62DF\u6EDA\u52A8");
    if (metrics.memoryUsage > 100)
      recommendations.push("- \u5185\u5B58\u4F7F\u7528\u8F83\u9AD8\uFF0C\u68C0\u67E5\u662F\u5426\u5B58\u5728\u5185\u5B58\u6CC4\u6F0F");
    if (slowOps.length > 10)
      recommendations.push("- \u5B58\u5728\u5927\u91CF\u6162\u64CD\u4F5C\uFF0C\u8003\u8651\u4F18\u5316\u6216\u4F7F\u7528Web Worker");
    if (metrics.loadTime > 3e3)
      recommendations.push("- \u52A0\u8F7D\u65F6\u95F4\u8F83\u957F\uFF0C\u8003\u8651\u4EE3\u7801\u5206\u5272\u548C\u61D2\u52A0\u8F7D");
    if (recommendations.length === 0)
      recommendations.push("- \u6027\u80FD\u8868\u73B0\u826F\u597D\uFF01");
    return recommendations.join("\n");
  }
  /**
   * 清空数据
   */
  clear() {
    this.entries = [];
    this.timers.clear();
    this.fpsFrames = [];
  }
  /**
   * 导出数据
   */
  export() {
    return {
      metrics: this.getMetrics(),
      entries: this.getEntries(),
      timestamp: Date.now()
    };
  }
}
let globalMonitor = null;
function getPerformanceMonitor() {
  if (!globalMonitor)
    globalMonitor = new PerformanceMonitor();
  return globalMonitor;
}
async function measure(name, fn) {
  return getPerformanceMonitor().measure(name, fn);
}
function startTimer(name) {
  getPerformanceMonitor().start(name);
}
function endTimer(name) {
  return getPerformanceMonitor().end(name);
}

exports.PerformanceMonitor = PerformanceMonitor;
exports.endTimer = endTimer;
exports.getPerformanceMonitor = getPerformanceMonitor;
exports.measure = measure;
exports.startTimer = startTimer;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=PerformanceMonitor.cjs.map
