/**
 * WebAssembly加速管理器
 * 统一管理和调度WASM模块，提供性能加速
 */
import type { DiffResult } from './WasmDiff';
import type { ParseResult } from './WasmParser';
export interface AcceleratorOptions {
    /** 是否启用WASM加速 */
    enabled?: boolean;
    /** 是否启用diff加速 */
    enableDiff?: boolean;
    /** 是否启用解析加速 */
    enableParser?: boolean;
    /** 是否使用Web Worker */
    useWorker?: boolean;
    /** 是否启用缓存 */
    enableCache?: boolean;
    /** 预热策略 */
    warmupStrategy?: 'eager' | 'lazy' | 'none';
}
export interface AcceleratorStats {
    enabled: boolean;
    initialized: boolean;
    modules: {
        diff: {
            initialized: boolean;
            calls: number;
            totalTime: number;
            cacheHits: number;
        };
        parser: {
            initialized: boolean;
            calls: number;
            totalTime: number;
            cacheHits: number;
        };
    };
    memory: {
        used: number;
        peak: number;
    };
    performance: {
        averageSpeedup: number;
        totalTimeSaved: number;
    };
}
export declare class WasmAccelerator {
    private options;
    private diffModule?;
    private parserModule?;
    private initialized;
    private initPromise?;
    private stats;
    private memoryPeak;
    constructor(options?: AcceleratorOptions);
    /**
     * 初始化WASM模块
     */
    initialize(): Promise<void>;
    private doInitialize;
    /**
     * 预热WASM模块
     */
    private warmup;
    /**
     * 计算文本差异（加速版）
     */
    diff(text1: string, text2: string): Promise<DiffResult>;
    /**
     * JavaScript版本的diff实现（降级方案）
     */
    private jsDiff;
    /**
     * 解析文档（加速版）
     */
    parse(text: string): Promise<ParseResult>;
    /**
     * JavaScript版本的解析实现（降级方案）
     */
    private jsParse;
    /**
     * 批量diff（利用WASM并行能力）
     */
    batchDiff(pairs: Array<[string, string]>): Promise<DiffResult[]>;
    /**
     * 快速字符串比较
     */
    compare(str1: string, str2: string): Promise<boolean>;
    /**
     * 是否应该进行基准测试
     */
    private shouldBenchmark;
    /**
     * 更新内存统计
     */
    private updateMemoryStats;
    /**
     * 获取加速器统计信息
     */
    getStats(): AcceleratorStats;
    /**
     * 重置统计信息
     */
    resetStats(): void;
    /**
     * 清理资源
     */
    dispose(): void;
    /**
     * 获取是否支持WebAssembly
     */
    static isSupported(): boolean;
    /**
     * 获取WebAssembly特性
     */
    static getFeatures(): {
        supported: boolean;
        streaming: boolean;
        simd: boolean;
        threads: boolean;
        exceptions: boolean;
    };
}
//# sourceMappingURL=WasmAccelerator.d.ts.map