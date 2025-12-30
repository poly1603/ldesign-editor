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
import { getPerformanceMonitor } from '../utils/PerformanceMonitor.js';
import { EventEmitter } from '../utils/event.js';

createLogger("LazyLoader");
class LazyLoader extends EventEmitter {
  constructor(maxConcurrent = 3) {
    super();
    this.loaders = /* @__PURE__ */ new Map();
    this.loadQueue = [];
    this.maxConcurrent = 3;
    this.activeLoads = 0;
    this.monitor = getPerformanceMonitor();
    this.maxConcurrent = maxConcurrent;
  }
  /**
   * 注册加载器
   */
  register(id, loader, options = {}) {
    if (this.loaders.has(id)) {
      console.warn(`Loader "${id}" is already registered`);
      return;
    }
    this.loaders.set(id, {
      id,
      loader,
      options: {
        timeout: 3e4,
        retry: 3,
        cache: true,
        priority: 0,
        ...options
      },
      loaded: false,
      loading: false
    });
    this.emit("loader:registered", {
      id
    });
  }
  /**
   * 加载资源
   */
  async load(id) {
    const registration = this.loaders.get(id);
    if (!registration) {
      console.error(`Loader "${id}" not found`);
      return null;
    }
    if (registration.loaded && registration.options.cache && registration.result)
      return registration.result;
    if (registration.loading)
      return this.waitForLoad(id);
    if (this.activeLoads >= this.maxConcurrent) {
      this.loadQueue.push(id);
      return this.waitForLoad(id);
    }
    return this.executeLoad(registration);
  }
  /**
   * 执行加载
   */
  async executeLoad(registration) {
    registration.loading = true;
    this.activeLoads++;
    const startTime = performance.now();
    this.monitor.start(`lazy-load:${registration.id}`);
    this.emit("load:start", {
      id: registration.id
    });
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Load timeout")), registration.options.timeout);
      });
      const loadPromise = Promise.resolve(registration.loader());
      const result = await Promise.race([loadPromise, timeoutPromise]);
      registration.result = result;
      registration.loaded = true;
      registration.loading = false;
      registration.loadTime = performance.now() - startTime;
      this.monitor.end(`lazy-load:${registration.id}`, {
        success: true,
        loadTime: registration.loadTime
      });
      this.emit("load:success", {
        id: registration.id,
        loadTime: registration.loadTime
      });
      this.activeLoads--;
      this.processQueue();
      return result;
    } catch (error) {
      registration.error = error;
      registration.loading = false;
      this.activeLoads--;
      this.monitor.end(`lazy-load:${registration.id}`, {
        success: false,
        error: error.message
      });
      this.emit("load:error", {
        id: registration.id,
        error
      });
      if (registration.options.retry && registration.options.retry > 0) {
        registration.options.retry--;
        console.log(`Retrying load for "${registration.id}"...`);
        return this.executeLoad(registration);
      }
      this.processQueue();
      return null;
    }
  }
  /**
   * 等待加载完成
   */
  waitForLoad(id) {
    return new Promise((resolve) => {
      const checkLoaded = (data) => {
        if (data.id === id) {
          this.off("load:success", checkLoaded);
          this.off("load:error", checkLoaded);
          const registration = this.loaders.get(id);
          resolve(registration?.result || null);
        }
      };
      this.on("load:success", checkLoaded);
      this.on("load:error", checkLoaded);
    });
  }
  /**
   * 处理队列
   */
  processQueue() {
    while (this.loadQueue.length > 0 && this.activeLoads < this.maxConcurrent) {
      const id = this.loadQueue.shift();
      const registration = this.loaders.get(id);
      if (registration && !registration.loaded && !registration.loading)
        this.executeLoad(registration);
    }
  }
  /**
   * 批量加载
   */
  async loadBatch(ids) {
    const sorted = ids.map((id) => ({
      id,
      priority: this.loaders.get(id)?.options.priority || 0
    })).sort((a, b) => b.priority - a.priority).map((item) => item.id);
    return Promise.all(sorted.map((id) => this.load(id)));
  }
  /**
   * 预加载
   */
  async preload(ids) {
    const lowPriorityIds = ids.map((id) => {
      const registration = this.loaders.get(id);
      if (registration)
        registration.options.priority = -1;
      return id;
    });
    this.loadBatch(lowPriorityIds).catch((error) => {
      console.warn("Preload failed:", error);
    });
  }
  /**
   * 卸载资源
   */
  unload(id) {
    const registration = this.loaders.get(id);
    if (registration) {
      registration.loaded = false;
      registration.result = void 0;
      this.loadedFeatures.delete(id);
      this.emit("load:unloaded", {
        id
      });
    }
  }
  /**
   * 获取加载统计
   */
  getStats() {
    const all = Array.from(this.loaders.values());
    return {
      total: all.length,
      loaded: all.filter((l) => l.loaded).length,
      loading: all.filter((l) => l.loading).length,
      queued: this.loadQueue.length,
      failed: all.filter((l) => l.error).length
    };
  }
  /**
   * 获取加载时间统计
   */
  getLoadTimes() {
    return Array.from(this.loaders.values()).filter((l) => l.loadTime !== void 0).map((l) => ({
      id: l.id,
      time: l.loadTime
    })).sort((a, b) => b.time - a.time);
  }
  /**
   * 清理
   */
  destroy() {
    this.loaders.clear();
    this.loadQueue = [];
    this.loadedFeatures.clear();
    this.removeAllListeners();
  }
}
let globalLoader = null;
function getLazyLoader() {
  if (!globalLoader)
    globalLoader = new LazyLoader();
  return globalLoader;
}
function resetLazyLoader() {
  if (globalLoader) {
    globalLoader.destroy();
    globalLoader = null;
  }
}

export { LazyLoader, getLazyLoader, resetLazyLoader };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=LazyLoader.js.map
