/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { EventEmitter } from './event.js';
import { getFeatureFlags } from '../core/FeatureFlags.js';
import { getLazyLoader } from '../core/LazyLoader.js';
import { getPerformanceMonitor } from './PerformanceMonitor.js';

class AutoOptimizer extends EventEmitter {
  constructor(config = {}) {
    super();
    this.monitor = getPerformanceMonitor();
    this.features = getFeatureFlags();
    this.loader = getLazyLoader();
    this.checkTimer = null;
    this.suggestions = [];
    this.config = {
      enabled: true,
      checkInterval: 3e4,
      // 30秒
      autoFix: false,
      thresholds: {
        minFPS: 50,
        maxMemory: 100,
        maxLoadTime: 2e3
      },
      ...config
    };
  }
  /**
   * 启动自动优化
   */
  start() {
    if (!this.config.enabled)
      return;
    this.checkTimer = setInterval(() => {
      this.check();
    }, this.config.checkInterval);
    this.check();
  }
  /**
   * 停止自动优化
   */
  stop() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
  }
  /**
   * 检查并生成建议
   */
  check() {
    this.suggestions = [];
    const metrics = this.monitor.getMetrics();
    const featureStats = this.features.getStats();
    const loaderStats = this.loader.getStats();
    this.checkFPS(metrics);
    this.checkMemory(metrics);
    this.checkLoadTime(metrics);
    this.checkFeatureUsage(featureStats, loaderStats);
    if (this.suggestions.length > 0) {
      this.emit("suggestions", this.suggestions);
      if (this.config.autoFix)
        this.autoFix();
    }
  }
  /**
   * 检查FPS
   */
  checkFPS(metrics) {
    if (metrics.fps < this.config.thresholds.minFPS) {
      this.suggestions.push({
        type: "rendering",
        severity: metrics.fps < 40 ? "critical" : "warning",
        message: `FPS\u8FC7\u4F4E (${metrics.fps})\uFF0C\u5F71\u54CD\u7528\u6237\u4F53\u9A8C`,
        action: "\u7981\u7528\u4E0D\u5E38\u7528\u7684\u529F\u80FD\uFF0C\u542F\u7528\u865A\u62DF\u6EDA\u52A8",
        autoFixable: true,
        fix: () => {
          this.features.disable("video");
          this.features.disable("audio");
          this.features.disable("collaboration");
        }
      });
    }
  }
  /**
   * 检查内存
   */
  checkMemory(metrics) {
    if (metrics.memoryUsage > this.config.thresholds.maxMemory) {
      this.suggestions.push({
        type: "memory",
        severity: metrics.memoryUsage > 150 ? "critical" : "warning",
        message: `\u5185\u5B58\u4F7F\u7528\u8FC7\u9AD8 (${metrics.memoryUsage}MB)`,
        action: "\u6E05\u7406\u7F13\u5B58\uFF0C\u7981\u7528\u4E0D\u5FC5\u8981\u7684\u529F\u80FD",
        autoFixable: true,
        fix: () => {
          require("../icons/IconManager").getIconManager();
          this.features.disable("collaboration");
          this.features.disable("version-control");
        }
      });
    }
  }
  /**
   * 检查加载时间
   */
  checkLoadTime(metrics) {
    if (metrics.loadTime > this.config.thresholds.maxLoadTime) {
      this.suggestions.push({
        type: "loading",
        severity: metrics.loadTime > 3e3 ? "critical" : "warning",
        message: `\u52A0\u8F7D\u65F6\u95F4\u8FC7\u957F (${metrics.loadTime}ms)`,
        action: "\u542F\u7528\u61D2\u52A0\u8F7D\uFF0C\u51CF\u5C11\u521D\u59CB\u52A0\u8F7D\u7684\u529F\u80FD",
        autoFixable: true,
        fix: () => {
          const allFeatures = this.features.getAllFeatures();
          allFeatures.forEach((f) => {
            if (!["basic-editing", "selection", "history", "bold", "italic"].includes(f.id))
              f.lazy = true;
          });
        }
      });
    }
  }
  /**
   * 检查功能使用
   */
  checkFeatureUsage(featureStats, loaderStats) {
    const enabledButNotLoaded = featureStats.enabled - featureStats.loaded;
    if (enabledButNotLoaded > 5) {
      this.suggestions.push({
        type: "feature",
        severity: "info",
        message: `\u6709${enabledButNotLoaded}\u4E2A\u5DF2\u542F\u7528\u7684\u529F\u80FD\u672A\u88AB\u4F7F\u7528`,
        action: "\u8003\u8651\u7981\u7528\u8FD9\u4E9B\u529F\u80FD\u4EE5\u8282\u7701\u8D44\u6E90",
        autoFixable: false
      });
    }
    if (loaderStats.queued > 3) {
      this.suggestions.push({
        type: "loading",
        severity: "warning",
        message: `\u52A0\u8F7D\u961F\u5217\u8FC7\u957F (${loaderStats.queued}\u4E2A)`,
        action: "\u589E\u52A0\u5E76\u53D1\u52A0\u8F7D\u6570\u91CF\u6216\u51CF\u5C11\u542F\u7528\u7684\u529F\u80FD",
        autoFixable: false
      });
    }
  }
  /**
   * 自动修复
   */
  autoFix() {
    const fixable = this.suggestions.filter((s) => s.autoFixable);
    fixable.forEach((suggestion) => {
      if (suggestion.fix) {
        try {
          suggestion.fix();
          this.emit("auto-fixed", suggestion);
        } catch (error) {
          console.error("Auto-fix failed:", error);
        }
      }
    });
  }
  /**
   * 获取建议
   */
  getSuggestions() {
    return [...this.suggestions];
  }
  /**
   * 应用建议
   */
  applySuggestion(index) {
    const suggestion = this.suggestions[index];
    if (suggestion && suggestion.fix) {
      suggestion.fix();
      this.emit("suggestion-applied", suggestion);
    }
  }
  /**
   * 生成优化报告
   */
  generateReport() {
    let report = "\u81EA\u52A8\u4F18\u5316\u62A5\u544A\n";
    report += "============\n\n";
    const metrics = this.monitor.getMetrics();
    report += "\u5F53\u524D\u6027\u80FD:\n";
    report += `  FPS: ${metrics.fps}
`;
    report += `  \u5185\u5B58: ${metrics.memoryUsage}MB
`;
    report += `  \u52A0\u8F7D\u65F6\u95F4: ${metrics.loadTime}ms

`;
    if (this.suggestions.length === 0) {
      report += "\u2705 \u6027\u80FD\u826F\u597D\uFF0C\u65E0\u9700\u4F18\u5316\n";
    } else {
      report += `\u4F18\u5316\u5EFA\u8BAE (${this.suggestions.length}\u6761):
`;
      const critical = this.suggestions.filter((s) => s.severity === "critical");
      const warnings = this.suggestions.filter((s) => s.severity === "warning");
      const info = this.suggestions.filter((s) => s.severity === "info");
      if (critical.length > 0) {
        report += `
\u{1F534} \u4E25\u91CD (${critical.length}):
`;
        critical.forEach((s) => {
          report += `  \u2022 ${s.message}
`;
          report += `    \u2192 ${s.action}
`;
        });
      }
      if (warnings.length > 0) {
        report += `
\u{1F7E1} \u8B66\u544A (${warnings.length}):
`;
        warnings.forEach((s) => {
          report += `  \u2022 ${s.message}
`;
          report += `    \u2192 ${s.action}
`;
        });
      }
      if (info.length > 0) {
        report += `
\u{1F7E2} \u63D0\u793A (${info.length}):
`;
        info.forEach((s) => {
          report += `  \u2022 ${s.message}
`;
        });
      }
    }
    return report;
  }
  /**
   * 销毁
   */
  destroy() {
    this.stop();
    this.removeAllListeners();
  }
}
let optimizerInstance = null;
function getAutoOptimizer(config) {
  if (!optimizerInstance)
    optimizerInstance = new AutoOptimizer(config);
  return optimizerInstance;
}
function startAutoOptimization(config) {
  getAutoOptimizer(config).start();
}
function stopAutoOptimization() {
  if (optimizerInstance)
    optimizerInstance.stop();
}

export { AutoOptimizer, getAutoOptimizer, startAutoOptimization, stopAutoOptimization };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=AutoOptimizer.js.map
