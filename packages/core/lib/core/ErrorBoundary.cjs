/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var logger$1 = require('../utils/logger.cjs');
var event = require('../utils/event.cjs');

/**
 * 错误边界
 * 捕获和处理插件错误，防止影响整个编辑器
 */
const logger = logger$1.createLogger('ErrorBoundary');
/**
 * 错误边界类
 */
class ErrorBoundary extends event.EventEmitter {
    constructor(config = {}) {
        super();
        this.errors = [];
        this.errorCounts = new Map();
        this.maxHistorySize = 100;
        this.config = {
            maxErrors: 10,
            recoveryAttempts: 3,
            reportErrors: true,
            ...config,
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
            context,
        };
        // 记录错误
        this.errors.push(info);
        // 限制历史记录大小
        if (this.errors.length > this.maxHistorySize)
            this.errors.shift();
        // 更新错误计数
        const count = (this.errorCounts.get(source) || 0) + 1;
        this.errorCounts.set(source, count);
        // 记录日志
        logger.error(`Error in ${source}:`, error);
        if (context)
            logger.error('Context:', context);
        // 触发回调
        if (this.config.onError)
            this.config.onError(info);
        // 触发事件
        this.emit('error', info);
        // 检查是否超过最大错误数
        if (count >= this.config.maxErrors) {
            this.emit('max-errors-exceeded', { source, count });
            logger.warn(`Source "${source}" has exceeded max errors (${count})`);
        }
        return info;
    }
    /**
     * 包装函数，自动捕获错误
     */
    wrap(fn, source, fallback) {
        return ((...args) => {
            try {
                const result = fn(...args);
                // 处理Promise
                if (result instanceof Promise) {
                    return result.catch((error) => {
                        this.captureError(error, source);
                        if (fallback)
                            return fallback(...args);
                        throw error;
                    });
                }
                return result;
            }
            catch (error) {
                this.captureError(error, source);
                if (fallback)
                    return fallback(...args);
                throw error;
            }
        });
    }
    /**
     * 尝试恢复
     */
    async tryRecover(fn, source, options = {}) {
        const attempts = options.attempts || this.config.recoveryAttempts;
        const delay = options.delay || 1000;
        let lastError;
        for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
                const result = await fn();
                // 恢复成功
                if (attempt > 1) {
                    logger.info(`Recovered from error in ${source} after ${attempt} attempts`);
                    this.emit('recovered', { source, attempts: attempt });
                }
                return result;
            }
            catch (error) {
                lastError = error;
                // 记录错误
                this.captureError(lastError, source, {
                    attempt,
                    totalAttempts: attempts,
                });
                if (attempt < attempts) {
                    if (options.onRetry)
                        options.onRetry(attempt, lastError);
                    // 等待后重试
                    await new Promise(resolve => setTimeout(resolve, delay * attempt));
                }
            }
        }
        // 所有尝试都失败
        logger.error(`Failed to recover from error in ${source} after ${attempts} attempts`);
        this.emit('recovery-failed', { source, attempts });
        throw lastError;
    }
    /**
     * 获取错误历史
     */
    getErrors(source) {
        if (source)
            return this.errors.filter(e => e.source === source);
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
    getErrorRate(source, timeWindow = 60000) {
        const now = Date.now();
        const recentErrors = this.errors.filter(e => e.source === source && (now - e.timestamp) <= timeWindow);
        return recentErrors.length / (timeWindow / 1000); // 每秒错误数
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
            this.errors = this.errors.filter(e => e.source !== source);
        }
        else {
            this.errorCounts.clear();
            this.errors = [];
        }
    }
    /**
     * 生成错误报告
     */
    generateReport() {
        const totalErrors = this.getErrorCount();
        const sources = Array.from(this.errorCounts.entries())
            .sort((a, b) => b[1] - a[1]);
        let report = '错误边界报告\n';
        report += '=============\n\n';
        report += `总错误数: ${totalErrors}\n`;
        report += `错误源数: ${sources.length}\n\n`;
        report += '错误统计:\n';
        sources.forEach(([source, count]) => {
            const rate = this.getErrorRate(source).toFixed(2);
            const healthy = this.isHealthy(source) ? '✓' : '✗';
            report += `  ${healthy} ${source}: ${count} (${rate}/s)\n`;
        });
        report += '\n最近错误:\n';
        this.errors.slice(-10).forEach((error) => {
            const time = new Date(error.timestamp).toLocaleTimeString();
            report += `  [${time}] ${error.source}: ${error.error.message}\n`;
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
// 全局实例
let globalBoundary = null;
/**
 * 获取全局错误边界
 */
function getErrorBoundary(config) {
    if (!globalBoundary)
        globalBoundary = new ErrorBoundary(config);
    return globalBoundary;
}
/**
 * 便捷函数：捕获错误
 */
function captureError(error, source, context) {
    getErrorBoundary().captureError(error, source, context);
}
/**
 * 便捷函数：包装函数
 */
function withErrorBoundary(fn, source, fallback) {
    return getErrorBoundary().wrap(fn, source, fallback);
}

exports.ErrorBoundary = ErrorBoundary;
exports.captureError = captureError;
exports.getErrorBoundary = getErrorBoundary;
exports.withErrorBoundary = withErrorBoundary;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ErrorBoundary.cjs.map
