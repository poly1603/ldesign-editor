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
var PerformanceMonitor = require('../utils/PerformanceMonitor.cjs');
var WasmDiff = require('./WasmDiff.cjs');
var WasmParser = require('./WasmParser.cjs');

/**
 * WebAssembly加速管理器
 * 统一管理和调度WASM模块，提供性能加速
 */
const logger = logger$1.createLogger('WasmAccelerator');
const performanceMonitor = PerformanceMonitor.getPerformanceMonitor();
class WasmAccelerator {
    constructor(options = {}) {
        this.initialized = false;
        this.stats = {
            diff: { calls: 0, totalTime: 0, cacheHits: 0, nativeTime: 0 },
            parser: { calls: 0, totalTime: 0, cacheHits: 0, nativeTime: 0 },
        };
        this.memoryPeak = 0;
        this.options = {
            enabled: true,
            enableDiff: true,
            enableParser: true,
            useWorker: typeof Worker !== 'undefined',
            enableCache: true,
            warmupStrategy: 'lazy',
            ...options,
        };
        if (this.options.enabled && this.options.warmupStrategy === 'eager')
            this.initialize();
    }
    /**
     * 初始化WASM模块
     */
    async initialize() {
        if (!this.options.enabled)
            return;
        if (this.initialized)
            return;
        if (this.initPromise)
            return this.initPromise;
        this.initPromise = this.doInitialize();
        await this.initPromise;
    }
    async doInitialize() {
        logger.info('Initializing WebAssembly accelerator');
        const startTime = performance.now();
        try {
            const promises = [];
            // 初始化Diff模块
            if (this.options.enableDiff) {
                this.diffModule = new WasmDiff.WasmDiff({
                    enableCache: this.options.enableCache,
                    useWorker: this.options.useWorker,
                });
                promises.push(this.diffModule.initialize());
            }
            // 初始化Parser模块
            if (this.options.enableParser) {
                this.parserModule = new WasmParser.WasmParser({
                    enableCache: this.options.enableCache,
                });
                promises.push(this.parserModule.initialize());
            }
            await Promise.all(promises);
            // 预热（如果是lazy策略）
            if (this.options.warmupStrategy === 'lazy')
                await this.warmup();
            this.initialized = true;
            const initTime = performance.now() - startTime;
            logger.info(`WebAssembly accelerator initialized in ${initTime.toFixed(2)}ms`);
        }
        catch (error) {
            logger.error('Failed to initialize WebAssembly accelerator:', error);
            // 降级到纯JavaScript实现
            this.options.enabled = false;
            throw error;
        }
    }
    /**
     * 预热WASM模块
     */
    async warmup() {
        logger.debug('Warming up WASM modules');
        // 预热Diff模块
        if (this.diffModule) {
            await this.diffModule.diff('hello', 'world');
            await this.diffModule.compare('test', 'test');
        }
        // 预热Parser模块
        if (this.parserModule)
            await this.parserModule.parse('# Test\nHello world');
    }
    /**
     * 计算文本差异（加速版）
     */
    async diff(text1, text2) {
        const mark = performanceMonitor.mark('wasm-diff');
        if (!this.options.enabled || !this.options.enableDiff) {
            // 降级到JavaScript实现
            return this.jsDiff(text1, text2);
        }
        await this.initialize();
        try {
            const startTime = performance.now();
            const result = await this.diffModule.diff(text1, text2);
            const wasmTime = performance.now() - startTime;
            this.stats.diff.calls++;
            this.stats.diff.totalTime += wasmTime;
            // 记录性能对比
            if (this.shouldBenchmark()) {
                const jsStartTime = performance.now();
                await this.jsDiff(text1, text2);
                const jsTime = performance.now() - jsStartTime;
                this.stats.diff.nativeTime += jsTime;
                const speedup = jsTime / wasmTime;
                logger.debug(`Diff speedup: ${speedup.toFixed(2)}x (WASM: ${wasmTime.toFixed(2)}ms, JS: ${jsTime.toFixed(2)}ms)`);
            }
            performanceMonitor.measure('wasm-diff', mark);
            this.updateMemoryStats();
            return result;
        }
        catch (error) {
            logger.error('WASM diff failed, falling back to JS:', error);
            return this.jsDiff(text1, text2);
        }
    }
    /**
     * JavaScript版本的diff实现（降级方案）
     */
    async jsDiff(text1, text2) {
        // 简单的Levenshtein距离实现
        const len1 = text1.length;
        const len2 = text2.length;
        const matrix = [];
        // 初始化矩阵
        for (let i = 0; i <= len1; i++)
            matrix[i] = [i];
        for (let j = 0; j <= len2; j++)
            matrix[0][j] = j;
        // 计算编辑距离
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = text1[i - 1] === text2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(matrix[i - 1][j] + 1, // 删除
                matrix[i][j - 1] + 1, // 插入
                matrix[i - 1][j - 1] + cost);
            }
        }
        const distance = matrix[len1][len2];
        const maxLen = Math.max(len1, len2);
        return {
            distance,
            operations: [],
            similarity: maxLen > 0 ? 1 - distance / maxLen : 1,
            executionTime: 0,
        };
    }
    /**
     * 解析文档（加速版）
     */
    async parse(text) {
        const mark = performanceMonitor.mark('wasm-parse');
        if (!this.options.enabled || !this.options.enableParser) {
            // 降级到JavaScript实现
            return this.jsParse(text);
        }
        await this.initialize();
        try {
            const startTime = performance.now();
            const result = await this.parserModule.parse(text);
            const wasmTime = performance.now() - startTime;
            this.stats.parser.calls++;
            this.stats.parser.totalTime += wasmTime;
            // 记录性能对比
            if (this.shouldBenchmark()) {
                const jsStartTime = performance.now();
                await this.jsParse(text);
                const jsTime = performance.now() - jsStartTime;
                this.stats.parser.nativeTime += jsTime;
                const speedup = jsTime / wasmTime;
                logger.debug(`Parse speedup: ${speedup.toFixed(2)}x (WASM: ${wasmTime.toFixed(2)}ms, JS: ${jsTime.toFixed(2)}ms)`);
            }
            performanceMonitor.measure('wasm-parse', mark);
            this.updateMemoryStats();
            return result;
        }
        catch (error) {
            logger.error('WASM parse failed, falling back to JS:', error);
            return this.jsParse(text);
        }
    }
    /**
     * JavaScript版本的解析实现（降级方案）
     */
    async jsParse(text) {
        // 简单的Markdown解析
        const lines = text.split('\n');
        const nodes = [];
        let nodeCount = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('#')) {
                const level = line.match(/^#+/)?.[0].length || 1;
                nodes.push({
                    type: 2, // HEADING
                    start: text.indexOf(line),
                    end: text.indexOf(line) + line.length,
                    content: line.replace(/^#+\s*/, ''),
                    attributes: { level },
                });
                nodeCount++;
            }
            else if (line.trim()) {
                nodes.push({
                    type: 1, // PARAGRAPH
                    start: text.indexOf(line),
                    end: text.indexOf(line) + line.length,
                    content: line,
                });
                nodeCount++;
            }
        }
        return {
            nodes,
            parseTime: 0,
            nodeCount,
            memoryUsed: 0,
        };
    }
    /**
     * 批量diff（利用WASM并行能力）
     */
    async batchDiff(pairs) {
        if (!this.options.enabled || !this.diffModule) {
            // 降级处理
            return Promise.all(pairs.map(([a, b]) => this.jsDiff(a, b)));
        }
        await this.initialize();
        return this.diffModule.batchDiff(pairs);
    }
    /**
     * 快速字符串比较
     */
    async compare(str1, str2) {
        if (!this.options.enabled || !this.diffModule)
            return str1 === str2;
        await this.initialize();
        return this.diffModule.compare(str1, str2);
    }
    /**
     * 是否应该进行基准测试
     */
    shouldBenchmark() {
        // 每100次调用进行一次基准测试
        const totalCalls = this.stats.diff.calls + this.stats.parser.calls;
        return totalCalls % 100 === 0;
    }
    /**
     * 更新内存统计
     */
    updateMemoryStats() {
        if (performance.memory) {
            const used = performance.memory.usedJSHeapSize;
            this.memoryPeak = Math.max(this.memoryPeak, used);
        }
    }
    /**
     * 获取加速器统计信息
     */
    getStats() {
        const diffStats = this.diffModule?.getCacheStats() || { hits: 0};
        const memoryUsage = this.diffModule?.getMemoryUsage() || { used: 0};
        // 计算平均加速比
        let totalSpeedup = 0;
        let count = 0;
        if (this.stats.diff.calls > 0 && this.stats.diff.nativeTime > 0) {
            totalSpeedup += this.stats.diff.nativeTime / this.stats.diff.totalTime;
            count++;
        }
        if (this.stats.parser.calls > 0 && this.stats.parser.nativeTime > 0) {
            totalSpeedup += this.stats.parser.nativeTime / this.stats.parser.totalTime;
            count++;
        }
        const averageSpeedup = count > 0 ? totalSpeedup / count : 1;
        const totalTimeSaved = (this.stats.diff.nativeTime - this.stats.diff.totalTime)
            + (this.stats.parser.nativeTime - this.stats.parser.totalTime);
        return {
            enabled: this.options.enabled,
            initialized: this.initialized,
            modules: {
                diff: {
                    initialized: !!this.diffModule,
                    calls: this.stats.diff.calls,
                    totalTime: this.stats.diff.totalTime,
                    cacheHits: diffStats.hits,
                },
                parser: {
                    initialized: !!this.parserModule,
                    calls: this.stats.parser.calls,
                    totalTime: this.stats.parser.totalTime,
                    cacheHits: 0,
                },
            },
            memory: {
                used: memoryUsage.used,
                peak: this.memoryPeak,
            },
            performance: {
                averageSpeedup,
                totalTimeSaved: Math.max(0, totalTimeSaved),
            },
        };
    }
    /**
     * 重置统计信息
     */
    resetStats() {
        this.stats = {
            diff: { calls: 0, totalTime: 0, cacheHits: 0, nativeTime: 0 },
            parser: { calls: 0, totalTime: 0, cacheHits: 0, nativeTime: 0 },
        };
        this.memoryPeak = 0;
    }
    /**
     * 清理资源
     */
    dispose() {
        this.diffModule?.dispose();
        this.parserModule?.dispose();
        this.initialized = false;
        logger.info('WasmAccelerator disposed');
    }
    /**
     * 获取是否支持WebAssembly
     */
    static isSupported() {
        try {
            return typeof WebAssembly === 'object'
                && typeof WebAssembly.instantiate === 'function';
        }
        catch {
            return false;
        }
    }
    /**
     * 获取WebAssembly特性
     */
    static getFeatures() {
        const supported = WasmAccelerator.isSupported();
        return {
            supported,
            streaming: supported && typeof WebAssembly.instantiateStreaming === 'function',
            simd: false, // 需要特性检测
            threads: typeof SharedArrayBuffer !== 'undefined',
            exceptions: false, // 需要特性检测
        };
    }
}

exports.WasmAccelerator = WasmAccelerator;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=WasmAccelerator.cjs.map
