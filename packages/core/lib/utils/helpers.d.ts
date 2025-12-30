/**
 * 通用工具函数
 * 提供防抖、节流、缓存等常用功能
 */
/**
 * 防抖函数
 * 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * 节流函数
 * 规定在一个单位时间内，只能触发一次函数
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
/**
 * 简单的LRU缓存实现
 */
export declare class LRUCache<K, V> {
    private maxSize;
    private cache;
    constructor(maxSize?: number);
    get(key: K): V | undefined;
    set(key: K, value: V): void;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): void;
    size(): number;
}
/**
 * 延迟执行
 */
export declare function delay(ms: number): Promise<void>;
/**
 * 重试函数
 */
export declare function retry<T>(fn: () => Promise<T>, options?: {
    maxAttempts?: number;
    delay?: number;
    backoff?: number;
    onRetry?: (attempt: number, error: Error) => void;
}): Promise<T>;
/**
 * 批处理函数
 */
export declare class Batcher<T, R> {
    private batch;
    private timer;
    private processFn;
    private maxSize;
    private maxWait;
    constructor(processFn: (items: T[]) => Promise<R[]>, options?: {
        maxSize?: number;
        maxWait?: number;
    });
    add(item: T): Promise<R>;
    flush(): Promise<void>;
}
/**
 * 深度克隆
 */
export declare function deepClone<T>(obj: T): T;
/**
 * 对象合并
 */
export declare function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T;
export declare function generateId(prefix?: string): string;
/**
 * 范围限制
 */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * 检查是否为空
 */
export declare function isEmpty(value: any): boolean;
/**
 * 格式化文件大小
 */
export declare function formatFileSize(bytes: number): string;
/**
 * 格式化时间
 */
export declare function formatDuration(ms: number): string;
//# sourceMappingURL=helpers.d.ts.map