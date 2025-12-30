/**
 * 性能优化工具
 * 提供防抖、节流、懒加载等性能优化功能
 */
/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param immediate 是否立即执行
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number, immediate?: boolean): (...args: Parameters<T>) => void;
/**
 * 节流函数
 * @param func 要节流的函数
 * @param wait 等待时间（毫秒）
 * @param options 选项
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, wait: number, options?: {
    leading?: boolean;
    trailing?: boolean;
}): (...args: Parameters<T>) => void;
/**
 * 使用 requestAnimationFrame 的节流
 */
export declare function rafThrottle<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => void;
/**
 * 使用 requestIdleCallback 延迟执行
 */
export declare function idleCallback(callback: () => void, options?: IdleRequestOptions): number;
/**
 * 取消 idle callback
 */
export declare function cancelIdleCallback(id: number): void;
/**
 * 批量处理任务（分批执行，避免阻塞）
 */
export declare class TaskQueue {
    private tasks;
    private isProcessing;
    private chunkSize;
    constructor(chunkSize?: number);
    /**
     * 添加任务
     */
    add(task: () => void): void;
    /**
     * 批量添加任务
     */
    addBatch(tasks: Array<() => void>): void;
    /**
     * 处理任务队列
     */
    private process;
    /**
     * 处理一批任务
     */
    private processChunk;
    /**
     * 清空队列
     */
    clear(): void;
    /**
     * 获取剩余任务数
     */
    getTaskCount(): number;
}
/**
 * 虚拟滚动助手
 */
export interface VirtualScrollOptions {
    itemHeight: number;
    bufferSize?: number;
    onRender: (startIndex: number, endIndex: number) => void;
}
export declare class VirtualScroll {
    private container;
    private options;
    private scrollTop;
    private totalItems;
    private rafId;
    constructor(container: HTMLElement, options: VirtualScrollOptions);
    /**
     * 设置总项目数
     */
    setTotalItems(count: number): void;
    /**
     * 设置滚动监听
     */
    private setupScrollListener;
    /**
     * 更新容器高度
     */
    private updateContainerHeight;
    /**
     * 渲染可见项
     */
    private render;
    /**
     * 滚动到指定索引
     */
    scrollToIndex(index: number): void;
    /**
     * 销毁
     */
    destroy(): void;
}
/**
 * 记忆化函数（缓存结果）
 */
export declare function memoize<T extends (...args: any[]) => any>(func: T, resolver?: (...args: Parameters<T>) => string): T;
/**
 * 懒加载图片
 */
export declare function lazyLoadImage(img: HTMLImageElement, src: string): void;
/**
 * 性能监控
 */
export declare class PerformanceMonitor {
    private marks;
    /**
     * 开始计时
     */
    start(label: string): void;
    /**
     * 结束计时并返回耗时
     */
    end(label: string): number;
    /**
     * 结束计时并记录日志
     */
    endWithLog(label: string): number;
    /**
     * 清除所有标记
     */
    clear(): void;
}
/**
 * 单例模式的性能监控器
 */
export declare const performanceMonitor: PerformanceMonitor;
//# sourceMappingURL=performance.d.ts.map