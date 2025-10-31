/**
 * WebAssembly Diff算法包装器
 * 提供高性能的文本差异计算
 */
import { createLogger } from '../utils/logger';
import { getPerformanceMonitor } from '../utils/PerformanceMonitor';
const logger = createLogger('WasmDiff');
const performanceMonitor = getPerformanceMonitor();
export class WasmDiff {
    constructor(options = {}) {
        this.initialized = false;
        this.cache = new Map();
        this.options = {
            maxLength: 1000000, // 100万字符
            enableCache: true,
            cacheSize: 100,
            useWorker: false,
            ...options,
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
            logger.info('Initializing WebAssembly diff module');
            const startTime = performance.now();
            // 加载WASM字节码
            const wasmBytes = await this.loadWasmBytes();
            // 创建内存
            this.wasmMemory = new WebAssembly.Memory({
                initial: 256, // 16MB
                maximum: 16384, // 1GB
            });
            // 实例化WASM模块
            const importObject = {
                env: {
                    memory: this.wasmMemory,
                },
                console: {
                    log: (ptr) => {
                        const msg = this.readString(ptr);
                        logger.debug('WASM:', msg);
                    },
                    time: (ptr) => {
                        const label = this.readString(ptr);
                        console.time(label);
                    },
                    timeEnd: (ptr) => {
                        const label = this.readString(ptr);
                        console.timeEnd(label);
                    },
                },
            };
            const { instance } = await WebAssembly.instantiate(wasmBytes, importObject);
            this.wasmInstance = instance;
            this.exports = instance.exports;
            // 初始化Worker（如果启用）
            if (this.options.useWorker && typeof Worker !== 'undefined')
                this.initializeWorker();
            this.initialized = true;
            const initTime = performance.now() - startTime;
            logger.info(`WebAssembly diff module initialized in ${initTime.toFixed(2)}ms`);
        }
        catch (error) {
            logger.error('Failed to initialize WebAssembly:', error);
            throw error;
        }
    }
    /**
     * 加载WASM字节码
     */
    async loadWasmBytes() {
        // 开发环境：从文件加载
        if (process.env.NODE_ENV === 'development') {
            const response = await fetch('/src/wasm/diff.wasm');
            return response.arrayBuffer();
        }
        // 生产环境：使用内联的Base64
        // 注意：实际项目中应该构建时生成
        const base64 = await import('./diff.wasm.base64');
        return Uint8Array.from(atob(base64.default), c => c.charCodeAt(0)).buffer;
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
            // 执行diff计算
            const result = computeDiff(text1, text2);
            self.postMessage({ type: 'result', data: result });
            break;
        }
      };
      
      function computeDiff(text1, text2) {
        // Worker中的diff计算逻辑
        // ... 省略实现细节
        return { distance: 0, operations: [] };
      }
    `;
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        this.worker = new Worker(URL.createObjectURL(blob));
        this.worker.onmessage = (e) => {
            logger.debug('Worker message:', e.data);
        };
    }
    /**
     * 计算两个文本的差异
     */
    async diff(text1, text2) {
        await this.initialize();
        const mark = performanceMonitor.mark('wasm-diff-start');
        const startTime = performance.now();
        // 检查缓存
        const cacheKey = this.getCacheKey(text1, text2);
        if (this.options.enableCache && this.cache.has(cacheKey)) {
            logger.debug('Diff result from cache');
            return this.cache.get(cacheKey);
        }
        try {
            // 检查长度限制
            if (text1.length > this.options.maxLength || text2.length > this.options.maxLength)
                throw new Error(`Text length exceeds limit of ${this.options.maxLength}`);
            // 快速相等检查
            if (text1 === text2) {
                return {
                    distance: 0,
                    operations: [{
                            type: 'equal',
                            oldStart: 0,
                            oldEnd: text1.length,
                            newStart: 0,
                            newEnd: text2.length,
                        }],
                    similarity: 1,
                    executionTime: performance.now() - startTime,
                };
            }
            // 写入文本到WASM内存
            const ptr1 = this.writeString(text1, 0);
            const ptr2 = this.writeString(text2, ptr1 + text1.length + 4);
            // 调用WASM函数计算编辑距离
            const distance = this.exports.editDistance(ptr1, text1.length, ptr2, text2.length);
            // 计算LCS长度
            const lcsLen = this.exports.lcsLength(ptr1, text1.length, ptr2, text2.length);
            // 计算相似度
            const maxLen = Math.max(text1.length, text2.length);
            const similarity = maxLen > 0 ? 1 - distance / maxLen : 1;
            // Myers算法获取详细操作
            const outputPtr = ptr2 + text2.length + 4;
            const opsCount = this.exports.myersDiff(ptr1, text1.length, ptr2, text2.length, outputPtr);
            // 解析操作序列
            const operations = this.parseOperations(outputPtr, opsCount, text1, text2);
            const result = {
                distance,
                operations,
                similarity,
                executionTime: performance.now() - startTime,
            };
            // 缓存结果
            if (this.options.enableCache)
                this.addToCache(cacheKey, result);
            performanceMonitor.measure('wasm-diff', mark);
            logger.info(`Diff completed: distance=${distance}, similarity=${similarity.toFixed(2)}, time=${result.executionTime.toFixed(2)}ms`);
            return result;
        }
        catch (error) {
            logger.error('Diff calculation failed:', error);
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
        // 并行处理
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
        // 如果没有指定长度，查找null结束符
        if (length === undefined) {
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
        const view = new DataView(this.wasmMemory.buffer, ptr);
        // 简单实现：根据编辑距离生成基本操作
        // 实际应该从WASM读取详细的操作序列
        const oldPos = 0;
        const newPos = 0;
        // 这里简化处理，实际应该解析WASM返回的详细操作
        if (count > 0) {
            operations.push({
                type: 'replace',
                oldStart: 0,
                oldEnd: text1.length,
                newStart: 0,
                newEnd: text2.length,
                content: text2,
            });
        }
        return operations;
    }
    /**
     * 获取缓存键
     */
    getCacheKey(text1, text2) {
        // 使用简单哈希避免存储大量文本
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
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转为32位整数
        }
        return hash.toString(36);
    }
    /**
     * 添加到缓存
     */
    addToCache(key, result) {
        // LRU缓存策略
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
        this.wasmInstance = undefined;
        this.wasmMemory = undefined;
        this.initialized = false;
        logger.info('WasmDiff disposed');
    }
    /**
     * 获取内存使用情况
     */
    getMemoryUsage() {
        if (!this.wasmMemory)
            return { used: 0, total: 0 };
        const pages = this.wasmMemory.buffer.byteLength / 65536;
        return {
            used: pages * 65536,
            total: 16384 * 65536, // 最大值
        };
    }
    /**
     * 获取缓存统计
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            hits: 0, // 需要实际追踪
            misses: 0, // 需要实际追踪
        };
    }
}
//# sourceMappingURL=WasmDiff.js.map