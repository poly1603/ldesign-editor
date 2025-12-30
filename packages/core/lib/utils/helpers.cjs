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

function debounce(func, wait) {
  let timeout = null;
  return function(...args) {
    const context = this;
    if (timeout)
      clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
      timeout = null;
    }, wait);
  };
}
function throttle(func, limit) {
  let inThrottle = false;
  let lastResult;
  return function(...args) {
    const context = this;
    if (!inThrottle) {
      lastResult = func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    return lastResult;
  };
}
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = /* @__PURE__ */ new Map();
  }
  get(key) {
    if (!this.cache.has(key))
      return void 0;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  set(key, value) {
    if (this.cache.has(key))
      this.cache.delete(key);
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  has(key) {
    return this.cache.has(key);
  }
  delete(key) {
    return this.cache.delete(key);
  }
  clear() {
    this.cache.clear();
  }
  size() {
    return this.cache.size;
  }
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function retry(fn, options = {}) {
  const {
    maxAttempts = 3,
    delay: retryDelay = 1e3,
    backoff = 2,
    onRetry
  } = options;
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        if (onRetry)
          onRetry(attempt, lastError);
        const waitTime = retryDelay * backoff ** (attempt - 1);
        await delay(waitTime);
      }
    }
  }
  throw lastError;
}
class Batcher {
  constructor(processFn, options = {}) {
    this.batch = [];
    this.timer = null;
    this.processFn = processFn;
    this.maxSize = options.maxSize || 10;
    this.maxWait = options.maxWait || 100;
  }
  add(item) {
    return new Promise((resolve, reject) => {
      this.batch.push(item);
      const process = async () => {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        const items = [...this.batch];
        this.batch = [];
        try {
          const results = await this.processFn(items);
          const index = items.indexOf(item);
          resolve(results[index]);
        } catch (error) {
          reject(error);
        }
      };
      if (this.batch.length >= this.maxSize)
        process();
      else if (!this.timer)
        this.timer = setTimeout(process, this.maxWait);
    });
  }
  flush() {
    return new Promise((resolve) => {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.batch.length > 0) {
        const items = [...this.batch];
        this.batch = [];
        this.processFn(items).finally(() => resolve());
      } else {
        resolve();
      }
    });
  }
}
function deepClone(obj) {
  if (obj === null || typeof obj !== "object")
    return obj;
  if (obj instanceof Date)
    return new Date(obj.getTime());
  if (Array.isArray(obj))
    return obj.map((item) => deepClone(item));
  if (obj instanceof Map) {
    const map = /* @__PURE__ */ new Map();
    obj.forEach((value, key) => {
      map.set(key, deepClone(value));
    });
    return map;
  }
  if (obj instanceof Set) {
    const set = /* @__PURE__ */ new Set();
    obj.forEach((value) => {
      set.add(deepClone(value));
    });
    return set;
  }
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key))
      cloned[key] = deepClone(obj[key]);
  }
  return cloned;
}
function deepMerge(target, ...sources) {
  if (!sources.length)
    return target;
  const source = sources.shift();
  if (source) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const sourceValue = source[key];
        const targetValue = target[key];
        if (sourceValue && typeof sourceValue === "object" && !Array.isArray(sourceValue)) {
          if (!targetValue || typeof targetValue !== "object")
            target[key] = {};
          deepMerge(target[key], sourceValue);
        } else {
          target[key] = sourceValue;
        }
      }
    }
  }
  return deepMerge(target, ...sources);
}
let idCounter = 0;
function generateId(prefix = "id") {
  return `${prefix}-${Date.now()}-${++idCounter}`;
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function isEmpty(value) {
  if (value === null || value === void 0)
    return true;
  if (typeof value === "string")
    return value.trim() === "";
  if (Array.isArray(value))
    return value.length === 0;
  if (typeof value === "object")
    return Object.keys(value).length === 0;
  return false;
}
function formatFileSize(bytes) {
  if (bytes === 0)
    return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / k ** i).toFixed(2)} ${units[i]}`;
}
function formatDuration(ms) {
  if (ms < 1e3)
    return `${ms.toFixed(0)}ms`;
  if (ms < 6e4)
    return `${(ms / 1e3).toFixed(2)}s`;
  if (ms < 36e5)
    return `${(ms / 6e4).toFixed(2)}m`;
  return `${(ms / 36e5).toFixed(2)}h`;
}

exports.Batcher = Batcher;
exports.LRUCache = LRUCache;
exports.clamp = clamp;
exports.debounce = debounce;
exports.deepClone = deepClone;
exports.deepMerge = deepMerge;
exports.delay = delay;
exports.formatDuration = formatDuration;
exports.formatFileSize = formatFileSize;
exports.generateId = generateId;
exports.isEmpty = isEmpty;
exports.retry = retry;
exports.throttle = throttle;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=helpers.cjs.map
