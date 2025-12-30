/**
 * WebAssembly Diff算法包装器
 * 提供高性能的文本差异计算
 */
export interface DiffResult {
    distance: number;
    operations: DiffOperation[];
    similarity: number;
    executionTime: number;
}
export interface DiffOperation {
    type: 'insert' | 'delete' | 'replace' | 'equal';
    oldStart: number;
    oldEnd: number;
    newStart: number;
    newEnd: number;
    content?: string;
}
export interface WasmDiffOptions {
    /** 最大文本长度限制 */
    maxLength?: number;
    /** 是否启用缓存 */
    enableCache?: boolean;
    /** 缓存大小 */
    cacheSize?: number;
    /** 是否使用Web Worker */
    useWorker?: boolean;
}
export declare class WasmDiff {
    private wasmInstance?;
    private wasmMemory?;
    private initialized;
    private initPromise?;
    private options;
    private cache;
    private worker?;
    /** 导出的WASM函数 */
    private exports?;
    constructor(options?: WasmDiffOptions);
    /**
     * 初始化WASM模块
     */
    initialize(): Promise<void>;
    private doInitialize;
    /**
     * 加载WASM字节码
     */
    private loadWasmBytes;
    /**
     * 初始化Web Worker
     */
    private initializeWorker;
    /**
     * 计算两个文本的差异
     */
    diff(text1: string, text2: string): Promise<DiffResult>;
    /**
     * 批量比较多个文本对
     */
    batchDiff(pairs: Array<[string, string]>): Promise<DiffResult[]>;
    /**
     * 快速字符串比较
     */
    compare(str1: string, str2: string): Promise<boolean>;
    /**
     * 写入字符串到WASM内存
     */
    private writeString;
    /**
     * 从WASM内存读取字符串
     */
    private readString;
    /**
     * 解析操作序列
     */
    private parseOperations;
    /**
     * 获取缓存键
     */
    private getCacheKey;
    /**
     * 简单哈希函数
     */
    private simpleHash;
    /**
     * 添加到缓存
     */
    private addToCache;
    /**
     * 清理资源
     */
    dispose(): void;
    /**
     * 获取内存使用情况
     */
    getMemoryUsage(): {
        used: number;
        total: number;
    };
    /**
     * 获取缓存统计
     */
    getCacheStats(): {
        size: number;
        hits: number;
        misses: number;
    };
}
//# sourceMappingURL=WasmDiff.d.ts.map