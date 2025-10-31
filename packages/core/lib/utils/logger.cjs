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

/**
 * 日志工具
 * 提供统一的日志管理和输出
 */
class Logger {
    constructor(prefix, options = {}) {
        this.prefix = prefix;
        this.level = options.level || 'info';
        this.timestamp = options.timestamp !== false;
        this.color = options.color !== false;
    }
    debug(...args) {
        this.log('debug', ...args);
    }
    info(...args) {
        this.log('info', ...args);
    }
    warn(...args) {
        this.log('warn', ...args);
    }
    error(...args) {
        this.log('error', ...args);
    }
    log(level, ...args) {
        if (Logger.levels[level] < Logger.levels[this.level])
            return;
        const timestamp = this.timestamp ? new Date().toISOString() : '';
        const prefix = `[${this.prefix}]`;
        const parts = [];
        if (timestamp)
            parts.push(timestamp);
        parts.push(prefix);
        const message = parts.join(' ');
        if (this.color && typeof console !== 'undefined') {
            const color = Logger.colors[level];
            const css = `color: ${color}; font-weight: bold;`;
            switch (level) {
                case 'debug':
                    console.debug(`%c${message}`, css, ...args);
                    break;
                case 'info':
                    console.info(`%c${message}`, css, ...args);
                    break;
                case 'warn':
                    console.warn(`%c${message}`, css, ...args);
                    break;
                case 'error':
                    console.error(`%c${message}`, css, ...args);
                    break;
            }
        }
        else {
            console[level](message, ...args);
        }
    }
    setLevel(level) {
        this.level = level;
    }
}
Logger.levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};
Logger.colors = {
    debug: '#888',
    info: '#2196F3',
    warn: '#FF9800',
    error: '#F44336',
};
// 全局日志管理器
class LoggerManager {
    constructor() {
        this.loggers = new Map();
        this.defaultOptions = {
            level: 'info',
            timestamp: true,
            color: true,
        };
    }
    createLogger(prefix, options) {
        const logger = new Logger(prefix, { ...this.defaultOptions, ...options });
        this.loggers.set(prefix, logger);
        return logger;
    }
    getLogger(prefix) {
        return this.loggers.get(prefix);
    }
    setGlobalLevel(level) {
        this.defaultOptions.level = level;
        this.loggers.forEach(logger => logger.setLevel(level));
    }
    setGlobalOptions(options) {
        this.defaultOptions = { ...this.defaultOptions, ...options };
    }
}
// 单例
const loggerManager = new LoggerManager();
/**
 * 创建日志记录器
 */
function createLogger(prefix, options) {
    return loggerManager.createLogger(prefix, options);
}
/**
 * 设置全局日志级别
 */
function setGlobalLogLevel(level) {
    loggerManager.setGlobalLevel(level);
}
// 开发环境默认显示debug日志
if (process.env.NODE_ENV === 'development')
    setGlobalLogLevel('debug');

exports.Logger = Logger;
exports.createLogger = createLogger;
exports.setGlobalLogLevel = setGlobalLogLevel;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=logger.cjs.map
