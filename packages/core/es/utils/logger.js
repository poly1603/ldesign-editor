/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
const _Logger = class _Logger {
  constructor(prefix, options = {}) {
    this.prefix = prefix;
    this.level = options.level || "info";
    this.timestamp = options.timestamp !== false;
    this.color = options.color !== false;
  }
  debug(...args) {
    this.log("debug", ...args);
  }
  info(...args) {
    this.log("info", ...args);
  }
  warn(...args) {
    this.log("warn", ...args);
  }
  error(...args) {
    this.log("error", ...args);
  }
  log(level, ...args) {
    if (_Logger.levels[level] < _Logger.levels[this.level])
      return;
    const timestamp = this.timestamp ? (/* @__PURE__ */ new Date()).toISOString() : "";
    const prefix = `[${this.prefix}]`;
    const parts = [];
    if (timestamp)
      parts.push(timestamp);
    parts.push(prefix);
    const message = parts.join(" ");
    if (this.color && typeof console !== "undefined") {
      const color = _Logger.colors[level];
      const css = `color: ${color}; font-weight: bold;`;
      switch (level) {
        case "debug":
          console.debug(`%c${message}`, css, ...args);
          break;
        case "info":
          console.info(`%c${message}`, css, ...args);
          break;
        case "warn":
          console.warn(`%c${message}`, css, ...args);
          break;
        case "error":
          console.error(`%c${message}`, css, ...args);
          break;
      }
    } else {
      console[level](message, ...args);
    }
  }
  setLevel(level) {
    this.level = level;
  }
};
_Logger.levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};
_Logger.colors = {
  debug: "#888",
  info: "#2196F3",
  warn: "#FF9800",
  error: "#F44336"
};
let Logger = _Logger;
class LoggerManager {
  constructor() {
    this.loggers = /* @__PURE__ */ new Map();
    this.defaultOptions = {
      level: "info",
      timestamp: true,
      color: true
    };
  }
  createLogger(prefix, options) {
    const logger = new Logger(prefix, {
      ...this.defaultOptions,
      ...options
    });
    this.loggers.set(prefix, logger);
    return logger;
  }
  getLogger(prefix) {
    return this.loggers.get(prefix);
  }
  setGlobalLevel(level) {
    this.defaultOptions.level = level;
    this.loggers.forEach((logger) => logger.setLevel(level));
  }
  setGlobalOptions(options) {
    this.defaultOptions = {
      ...this.defaultOptions,
      ...options
    };
  }
}
const loggerManager = new LoggerManager();
function createLogger(prefix, options) {
  return loggerManager.createLogger(prefix, options);
}
function setGlobalLogLevel(level) {
  loggerManager.setGlobalLevel(level);
}
if (process.env.NODE_ENV === "development")
  setGlobalLogLevel("debug");

export { Logger, createLogger, setGlobalLogLevel };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=logger.js.map
