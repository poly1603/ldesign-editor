/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { EventEmitter } from '../utils/event.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger("CacheManager");
class CacheManager extends EventEmitter {
  constructor(config) {
    super();
    this.cacheName = "ldesign-editor-v1";
    this.cacheVersion = 1;
    this.config = config;
  }
  /**
   * 初始化缓存
   */
  async initialize() {
    if (!("caches" in window))
      throw new Error("Cache API not supported");
    logger.info("Initializing cache manager");
    await this.cleanOldCaches();
    logger.info("Cache manager initialized");
  }
  /**
   * 添加资源到缓存
   */
  async addResources(urls) {
    try {
      const cache = await caches.open(this.cacheName);
      await cache.addAll(urls);
      logger.info(`Cached ${urls.length} resources`);
      this.emit("cache-updated", this.cacheName);
    } catch (error) {
      logger.error("Failed to cache resources:", error);
      throw error;
    }
  }
  /**
   * 从缓存获取
   */
  async get(request) {
    try {
      const cache = await caches.open(this.cacheName);
      return await cache.match(request);
    } catch (error) {
      logger.error("Failed to get from cache:", error);
      return void 0;
    }
  }
  /**
   * 添加到缓存
   */
  async put(request, response) {
    try {
      const cache = await caches.open(this.cacheName);
      await cache.put(request, response);
      this.emit("cache-updated", this.cacheName);
    } catch (error) {
      logger.error("Failed to put to cache:", error);
    }
  }
  /**
   * 删除缓存项
   */
  async delete(request) {
    try {
      const cache = await caches.open(this.cacheName);
      return await cache.delete(request);
    } catch (error) {
      logger.error("Failed to delete from cache:", error);
      return false;
    }
  }
  /**
   * 清除所有缓存
   */
  async clear(cacheName) {
    try {
      if (cacheName) {
        await caches.delete(cacheName);
      } else {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
      logger.info("Cache cleared");
    } catch (error) {
      logger.error("Failed to clear cache:", error);
    }
  }
  /**
   * 清理旧版本缓存
   */
  async cleanOldCaches() {
    const keys = await caches.keys();
    const oldCaches = keys.filter((key) => key !== this.cacheName);
    await Promise.all(oldCaches.map((key) => caches.delete(key)));
    if (oldCaches.length > 0)
      logger.info(`Cleaned ${oldCaches.length} old caches`);
  }
  /**
   * 获取缓存大小
   */
  async getSize() {
    if (!("estimate" in navigator.storage))
      return 0;
    try {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    } catch (error) {
      logger.error("Failed to get cache size:", error);
      return 0;
    }
  }
  /**
   * 获取所有缓存的URL
   */
  async getCachedUrls() {
    try {
      const cache = await caches.open(this.cacheName);
      const requests = await cache.keys();
      return requests.map((req) => req.url);
    } catch (error) {
      logger.error("Failed to get cached URLs:", error);
      return [];
    }
  }
  /**
   * 销毁
   */
  destroy() {
    this.removeAllListeners();
  }
}

export { CacheManager };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=CacheManager.js.map
