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

var logger$1 = require('../utils/logger.cjs');

const logger = logger$1.createLogger("OfflineStorage");
class OfflineStorage {
  constructor() {
    this.dbName = "ldesign-offline";
    this.version = 1;
    this.storeName = "documents";
  }
  /**
   * 初始化
   */
  async initialize() {
    logger.info("Initializing offline storage");
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onerror = () => {
        logger.error("Failed to open database:", request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        this.db = request.result;
        logger.info("Offline storage initialized");
        resolve();
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: "id"
          });
          store.createIndex("type", "type", {
            unique: false
          });
          store.createIndex("synced", "synced", {
            unique: false
          });
          store.createIndex("updatedAt", "updatedAt", {
            unique: false
          });
        }
      };
    });
  }
  /**
   * 保存数据
   */
  async save(data) {
    if (!this.db)
      throw new Error("Database not initialized");
    const record = {
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      synced: false
    };
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put(record);
      request.onsuccess = () => {
        logger.debug(`Saved: ${data.id}`);
        resolve();
      };
      request.onerror = () => {
        logger.error("Failed to save:", request.error);
        reject(request.error);
      };
    });
  }
  /**
   * 获取数据
   */
  async get(id) {
    if (!this.db)
      throw new Error("Database not initialized");
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  /**
   * 获取所有数据
   */
  async getAll() {
    if (!this.db)
      throw new Error("Database not initialized");
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }
  /**
   * 获取未同步的数据
   */
  async getUnsynced() {
    if (!this.db)
      throw new Error("Database not initialized");
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const index = store.index("synced");
      const request = index.getAll(false);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }
  /**
   * 更新数据
   */
  async update(id, updates) {
    const existing = await this.get(id);
    if (!existing)
      throw new Error(`Document not found: ${id}`);
    const updated = {
      ...existing,
      ...updates,
      updatedAt: Date.now()
    };
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put(updated);
      request.onsuccess = () => {
        logger.debug(`Updated: ${id}`);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }
  /**
   * 标记为已同步
   */
  async markAsSynced(id) {
    await this.update(id, {
      synced: true
    });
  }
  /**
   * 删除数据
   */
  async delete(id) {
    if (!this.db)
      throw new Error("Database not initialized");
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      request.onsuccess = () => {
        logger.debug(`Deleted: ${id}`);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }
  /**
   * 清空所有数据
   */
  async clear() {
    if (!this.db)
      throw new Error("Database not initialized");
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      request.onsuccess = () => {
        logger.info("All offline data cleared");
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }
  /**
   * 获取存储大小
   */
  async getSize() {
    if (!("estimate" in navigator.storage))
      return 0;
    try {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    } catch (error) {
      logger.error("Failed to get storage size:", error);
      return 0;
    }
  }
  /**
   * 销毁
   */
  destroy() {
    this.db?.close();
    this.db = void 0;
  }
}

exports.OfflineStorage = OfflineStorage;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=OfflineStorage.cjs.map
