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

const logger = createLogger("WasmDiff");
const performanceMonitor = getPerformanceMonitor();
class WasmDiff {
  constructor(options = {}) {
    this.initialized = false;
    this.cache = /* @__PURE__ */ new Map();
    this.options = {
      maxLength: 1e6,
      // 100万字符
      enableCache: true,
      cacheSize: 100,
      useWorker: false,
      ...options
    };
  }
  /**
   * 初始化WASM模块
   */
  async initialize() {
    if (this.initialized)
      return;
    if (this.initPromise)
      return this.initPromise;
    this.initPromise = this.doInitialize();
    await this.initPromise;
  }
  async doInitialize() {
    try {
      logger.info("Initializing WebAssembly diff module");
      const startTime = performance.now();
      const wasmBytes = await this.loadWasmBytes();
      this.wasmMemory = new WebAssembly.Memory({
        initial: 256,
        // 16MB
        maximum: 16384
        // 1GB
      });
      const importObject = {
        env: {
          memory: this.wasmMemory
        },
        console: {
          log: (ptr) => {
            const msg = this.readString(ptr);
            logger.debug("WASM:", msg);
          },
          time: (ptr) => {
            const label = this.readString(ptr);
            console.time(label);
          },
          timeEnd: (ptr) => {
            const label = this.readString(ptr);
            console.timeEnd(label);
          }
        }
      };
      const {
        instance
      } = await WebAssembly.instantiate(wasmBytes, importObject);
      this.wasmInstance = instance;
      this.exports = instance.exports;
      if (this.options.useWorker && typeof Worker !== "undefined")
        this.initializeWorker();
      this.initialized = true;
      const initTime = performance.now() - startTime;
      logger.info(`WebAssembly diff module initialized in ${initTime.toFixed(2)}ms`);
    } catch (error) {
      logger.error("Failed to initialize WebAssembly:", error);
      throw error;
    }
  }
  /**
   * 加载WASM字节码
   */
  async loadWasmBytes() {
    if (process.env.NODE_ENV === "development") {
      const response = await fetch("/src/wasm/diff.wasm");
      return response.arrayBuffer();
    }
    const base64 = await import('./diff.wasm.base64.js');
    return Uint8Array.from(atob(base64.default), (c) => c.charCodeAt(0)).buffer;
  }
  /**
   * 初始化Web Worker
   */
  initializeWorker() {
    const workerCode = `
      let wasmInstance;
      let wasmMemory;
      let exports;
      
      self.onmessage = async (e) => {
        const { type, data } = e.data;
        
        switch (type) {
          case 'init':
            const { wasmBytes } = data;
            wasmMemory = new WebAssembly.Memory({
              initial: 256,
              maximum: 16384
            });
            
            const { instance } = await WebAssembly.instantiate(wasmBytes, {
              env: { memory: wasmMemory },
              console: {
                log: () => {},
                time: () => {},
                timeEnd: () => {}
              }
            });
            
            wasmInstance = instance;
            exports = instance.exports;
            self.postMessage({ type: 'initialized' });
            break;
            
          case 'diff':
            const { text1, text2 } = data;
            // \u6267\u884Cdiff\u8BA1\u7B97
            const result = computeDiff(text1, text2);
            self.postMessage({ type: 'result', data: result });
            break;
        }
      };
      
      function computeDiff(text1, text2) {
        // Worker\u4E2D\u7684diff\u8BA1\u7B97\u903B\u8F91
        // ... \u7701\u7565\u5B9E\u73B0\u7EC6\u8282
        return { distance: 0, operations: [] };
      }
    `;
    const blob = new Blob([workerCode], {
      type: "application/javascript"
    });
    this.worker = new Worker(URL.createObjectURL(blob));
    this.worker.onmessage = (e) => {
      logger.debug("Worker message:", e.data);
    };
  }
  /**
   * 计算两个文本的差异
   */
  async diff(text1, text2) {
    await this.initialize();
    const mark = performanceMonitor.mark("wasm-diff-start");
    const startTime = performance.now();
    const cacheKey = this.getCacheKey(text1, text2);
    if (this.options.enableCache && this.cache.has(cacheKey)) {
      logger.debug("Diff result from cache");
      return this.cache.get(cacheKey);
    }
    try {
      if (text1.length > this.options.maxLength || text2.length > this.options.maxLength)
        throw new Error(`Text length exceeds limit of ${this.options.maxLength}`);
      if (text1 === text2) {
        return {
          distance: 0,
          operations: [{
            type: "equal",
            oldStart: 0,
            oldEnd: text1.length,
            newStart: 0,
            newEnd: text2.length
          }],
          similarity: 1,
          executionTime: performance.now() - startTime
        };
      }
      const ptr1 = this.writeString(text1, 0);
      const ptr2 = this.writeString(text2, ptr1 + text1.length + 4);
      const distance = this.exports.editDistance(ptr1, text1.length, ptr2, text2.length);
      const lcsLen = this.exports.lcsLength(ptr1, text1.length, ptr2, text2.length);
      const maxLen = Math.max(text1.length, text2.length);
      const similarity = maxLen > 0 ? 1 - distance / maxLen : 1;
      const outputPtr = ptr2 + text2.length + 4;
      const opsCount = this.exports.myersDiff(ptr1, text1.length, ptr2, text2.length, outputPtr);
      const operations = this.parseOperations(outputPtr, opsCount, text1, text2);
      const result = {
        distance,
        operations,
        similarity,
        executionTime: performance.now() - startTime
      };
      if (this.options.enableCache)
        this.addToCache(cacheKey, result);
      performanceMonitor.measure("wasm-diff", mark);
      logger.info(`Diff completed: distance=${distance}, similarity=${similarity.toFixed(2)}, time=${result.executionTime.toFixed(2)}ms`);
      return result;
    } catch (error) {
      logger.error("Diff calculation failed:", error);
      throw error;
    }
  }
  /**
   * 批量比较多个文本对
   */
  async batchDiff(pairs) {
    await this.initialize();
    logger.info(`Batch diff for ${pairs.length} pairs`);
    const startTime = performance.now();
    const results = await Promise.all(pairs.map(([text1, text2]) => this.diff(text1, text2)));
    const totalTime = performance.now() - startTime;
    logger.info(`Batch diff completed in ${totalTime.toFixed(2)}ms`);
    return results;
  }
  /**
   * 快速字符串比较
   */
  async compare(str1, str2) {
    await this.initialize();
    if (str1.length !== str2.length)
      return false;
    if (str1 === str2)
      return true;
    const ptr1 = this.writeString(str1, 0);
    const ptr2 = this.writeString(str2, ptr1 + str1.length + 4);
    const result = this.exports.fastStringCompare(ptr1, str1.length, ptr2, str2.length);
    return result === 1;
  }
  /**
   * 写入字符串到WASM内存
   */
  writeString(str, offset) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    const mem = new Uint8Array(this.wasmMemory.buffer, offset);
    for (let i = 0; i < bytes.length; i++)
      mem[i] = bytes[i];
    return offset;
  }
  /**
   * 从WASM内存读取字符串
   */
  readString(ptr, length) {
    const mem = new Uint8Array(this.wasmMemory.buffer, ptr);
    if (length === void 0) {
      length = 0;
      while (mem[length] !== 0)
        length++;
    }
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++)
      bytes[i] = mem[i];
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }
  /**
   * 解析操作序列
   */
  parseOperations(ptr, count, text1, text2) {
    const operations = [];
    new DataView(this.wasmMemory.buffer, ptr);
    if (count > 0) {
      operations.push({
        type: "replace",
        oldStart: 0,
        oldEnd: text1.length,
        newStart: 0,
        newEnd: text2.length,
        content: text2
      });
    }
    return operations;
  }
  /**
   * 获取缓存键
   */
  getCacheKey(text1, text2) {
    const hash1 = this.simpleHash(text1);
    const hash2 = this.simpleHash(text2);
    return `${hash1}:${hash2}`;
  }
  /**
   * 简单哈希函数
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }
  /**
   * 添加到缓存
   */
  addToCache(key, result) {
    if (this.cache.size >= this.options.cacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, result);
  }
  /**
   * 清理资源
   */
  dispose() {
    if (this.worker)
      this.worker.terminate();
    this.cache.clear();
    this.wasmInstance = void 0;
    this.wasmMemory = void 0;
    this.initialized = false;
    logger.info("WasmDiff disposed");
  }
  /**
   * 获取内存使用情况
   */
  getMemoryUsage() {
    if (!this.wasmMemory)
      return {
        used: 0,
        total: 0
      };
    const pages = this.wasmMemory.buffer.byteLength / 65536;
    return {
      used: pages * 65536,
      total: 16384 * 65536
      // 最大值
    };
  }
  /**
   * 获取缓存统计
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      hits: 0,
      // 需要实际追踪
      misses: 0
      // 需要实际追踪
    };
  }
}

export { WasmDiff };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=WasmDiff.js.map
