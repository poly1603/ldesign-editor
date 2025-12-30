/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createLogger } from '../utils/logger.js';
import { EventEmitter } from '../utils/event.js';

const logger = createLogger("ErrorBoundary");
class ErrorBoundary extends EventEmitter {
  constructor(config = {}) {
    super();
    this.errors = [];
    this.errorCounts = /* @__PURE__ */ new Map();
    this.maxHistorySize = 100;
    this.config = {
      maxErrors: 10,
      recoveryAttempts: 3,
      reportErrors: true,
      ...config
    };
  }
  /**
   * 捕获错误
   */
  captureError(error, source, context) {
    const info = {
      error,
      source,
      timestamp: Date.now(),
      recovered: false,
      context
    };
    this.errors.push(info);
    if (this.errors.length > this.maxHistorySize)
      this.errors.shift();
    const count = (this.errorCounts.get(source) || 0) + 1;
    this.errorCounts.set(source, count);
    logger.error(`Error in ${source}:`, error);
    if (context)
      logger.error("Context:", context);
    if (this.config.onError)
      this.config.onError(info);
    this.emit("error", info);
    if (count >= this.config.maxErrors) {
      this.emit("max-errors-exceeded", {
        source,
        count
      });
      logger.warn(`Source "${source}" has exceeded max errors (${count})`);
    }
    return info;
  }
  /**
   * 包装函数，自动捕获错误
   */
  wrap(fn, source, fallback) {
    return (...args) => {
      try {
        const result = fn(...args);
        if (result instanceof Promise) {
          return result.catch((error) => {
            this.captureError(error, source);
            if (fallback)
              return fallback(...args);
            throw error;
          });
        }
        return result;
      } catch (error) {
        this.captureError(error, source);
        if (fallback)
          return fallback(...args);
        throw error;
      }
    };
  }
  /**
   * 尝试恢复
   */
  async tryRecover(fn, source, options = {}) {
    const attempts = options.attempts || this.config.recoveryAttempts;
    const delay = options.delay || 1e3;
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const result = await fn();
        if (attempt > 1) {
          logger.info(`Recovered from error in ${source} after ${attempt} attempts`);
          this.emit("recovered", {
            source,
            attempts: attempt
          });
        }
        return result;
      } catch (error) {
        lastError = error;
        this.captureError(lastError, source, {
          attempt,
          totalAttempts: attempts
        });
        if (attempt < attempts) {
          if (options.onRetry)
            options.onRetry(attempt, lastError);
          await new Promise((resolve) => setTimeout(resolve, delay * attempt));
        }
      }
    }
    logger.error(`Failed to recover from error in ${source} after ${attempts} attempts`);
    this.emit("recovery-failed", {
      source,
      attempts
    });
    throw lastError;
  }
  /**
   * 获取错误历史
   */
  getErrors(source) {
    if (source)
      return this.errors.filter((e) => e.source === source);
    return [...this.errors];
  }
  /**
   * 获取错误计数
   */
  getErrorCount(source) {
    if (source)
      return this.errorCounts.get(source) || 0;
    return Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0);
  }
  /**
   * 获取错误率
   */
  getErrorRate(source, timeWindow = 6e4) {
    const now = Date.now();
    const recentErrors = this.errors.filter((e) => e.source === source && now - e.timestamp <= timeWindow);
    return recentErrors.length / (timeWindow / 1e3);
  }
  /**
   * 检查源是否健康
   */
  isHealthy(source) {
    const count = this.errorCounts.get(source) || 0;
    const rate = this.getErrorRate(source);
    return count < this.config.maxErrors && rate < 1;
  }
  /**
   * 重置错误计数
   */
  resetErrors(source) {
    if (source) {
      this.errorCounts.delete(source);
      this.errors = this.errors.filter((e) => e.source !== source);
    } else {
      this.errorCounts.clear();
      this.errors = [];
    }
  }
  /**
   * 生成错误报告
   */
  generateReport() {
    const totalErrors = this.getErrorCount();
    const sources = Array.from(this.errorCounts.entries()).sort((a, b) => b[1] - a[1]);
    let report = "\u9519\u8BEF\u8FB9\u754C\u62A5\u544A\n";
    report += "=============\n\n";
    report += `\u603B\u9519\u8BEF\u6570: ${totalErrors}
`;
    report += `\u9519\u8BEF\u6E90\u6570: ${sources.length}

`;
    report += "\u9519\u8BEF\u7EDF\u8BA1:\n";
    sources.forEach(([source, count]) => {
      const rate = this.getErrorRate(source).toFixed(2);
      const healthy = this.isHealthy(source) ? "\u2713" : "\u2717";
      report += `  ${healthy} ${source}: ${count} (${rate}/s)
`;
    });
    report += "\n\u6700\u8FD1\u9519\u8BEF:\n";
    this.errors.slice(-10).forEach((error) => {
      const time = new Date(error.timestamp).toLocaleTimeString();
      report += `  [${time}] ${error.source}: ${error.error.message}
`;
    });
    return report;
  }
  /**
   * 清理
   */
  destroy() {
    this.errors = [];
    this.errorCounts.clear();
    this.removeAllListeners();
  }
}
let globalBoundary = null;
function getErrorBoundary(config) {
  if (!globalBoundary)
    globalBoundary = new ErrorBoundary(config);
  return globalBoundary;
}
function captureError(error, source, context) {
  getErrorBoundary().captureError(error, source, context);
}
function withErrorBoundary(fn, source, fallback) {
  return getErrorBoundary().wrap(fn, source, fallback);
}

export { ErrorBoundary, captureError, getErrorBoundary, withErrorBoundary };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ErrorBoundary.js.map
