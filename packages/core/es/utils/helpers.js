/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
/**
 * 通用工具函数
 * 提供防抖、节流、缓存等常用功能
 */
/**
 * 防抖函数
 * 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
 */
function debounce(func, wait) {
    let timeout = null;
    return function (...args) {
        const context = this;
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
            timeout = null;
        }, wait);
    };
}
/**
 * 节流函数
 * 规定在一个单位时间内，只能触发一次函数
 */
function throttle(func, limit) {
    let inThrottle = false;
    let lastResult;
    return function (...args) {
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
/**
 * 简单的LRU缓存实现
 */
class LRUCache {
    constructor(maxSize = 100) {
        this.maxSize = maxSize;
        this.cache = new Map();
    }
    get(key) {
        if (!this.cache.has(key))
            return undefined;
        // 更新访问顺序
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }
    set(key, value) {
        // 如果已存在，先删除
        if (this.cache.has(key))
            this.cache.delete(key);
        // 如果超过容量，删除最旧的项
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
/**
 * 延迟执行
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * 重试函数
 */
async function retry(fn, options = {}) {
    const { maxAttempts = 3, delay: retryDelay = 1000, backoff = 2, onRetry, } = options;
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
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
/**
 * 批处理函数
 */
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
                }
                catch (error) {
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
            }
            else {
                resolve();
            }
        });
    }
}
/**
 * 深度克隆
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object')
        return obj;
    if (obj instanceof Date)
        return new Date(obj.getTime());
    if (Array.isArray(obj))
        return obj.map(item => deepClone(item));
    if (obj instanceof Map) {
        const map = new Map();
        obj.forEach((value, key) => {
            map.set(key, deepClone(value));
        });
        return map;
    }
    if (obj instanceof Set) {
        const set = new Set();
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
/**
 * 对象合并
 */
function deepMerge(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (source) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                const sourceValue = source[key];
                const targetValue = target[key];
                if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
                    if (!targetValue || typeof targetValue !== 'object')
                        target[key] = {};
                    deepMerge(target[key], sourceValue);
                }
                else {
                    target[key] = sourceValue;
                }
            }
        }
    }
    return deepMerge(target, ...sources);
}
/**
 * 唯一ID生成器
 */
let idCounter = 0;
function generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${++idCounter}`;
}
/**
 * 范围限制
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
/**
 * 检查是否为空
 */
function isEmpty(value) {
    if (value === null || value === undefined)
        return true;
    if (typeof value === 'string')
        return value.trim() === '';
    if (Array.isArray(value))
        return value.length === 0;
    if (typeof value === 'object')
        return Object.keys(value).length === 0;
    return false;
}
/**
 * 格式化文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / k ** i).toFixed(2)} ${units[i]}`;
}
/**
 * 格式化时间
 */
function formatDuration(ms) {
    if (ms < 1000)
        return `${ms.toFixed(0)}ms`;
    if (ms < 60000)
        return `${(ms / 1000).toFixed(2)}s`;
    if (ms < 3600000)
        return `${(ms / 60000).toFixed(2)}m`;
    return `${(ms / 3600000).toFixed(2)}h`;
}

export { Batcher, LRUCache, clamp, debounce, deepClone, deepMerge, delay, formatDuration, formatFileSize, generateId, isEmpty, retry, throttle };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=helpers.js.map
