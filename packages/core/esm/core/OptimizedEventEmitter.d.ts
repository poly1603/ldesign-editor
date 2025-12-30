/**
 * 优化的事件发射器
 * 减少内存占用，提高性能
 *
 * 优化特性:
 * - 事件处理器池化（复用对象）
 * - WeakMap缓存（自动垃圾回收）
 * - 批量处理支持
 * - 优先级队列
 * - 内存泄漏检测
 *
 * @packageDocumentation
 */
/** 事件处理器函数类型 */
type EventHandler = (...args: unknown[]) => void | Promise<void>;
/** 批量事件项 */
interface BatchEventItem {
    event: string;
    args: unknown[];
}
/** 事件统计信息 */
interface EventStats {
    totalEvents: number;
    totalHandlers: number;
    eventCounts: Map<string, number>;
}
/**
 * 优化的事件发射器类
 *
 * @example
 * ```typescript
 * const emitter = new OptimizedEventEmitter()
 *
 * // 普通监听
 * emitter.on('update', (data) => console.log(data))
 *
 * // 高优先级监听
 * emitter.on('update', (data) => console.log('first'), 10)
 *
 * // 批量发射
 * emitter.batchEmit([
 *   { event: 'update', args: [data1] },
 *   { event: 'change', args: [data2] }
 * ])
 * ```
 */
export declare class OptimizedEventEmitter {
    private events;
    private maxListeners;
    private listenerCount;
    private eventStats;
    private batchQueue;
    private batchTimer;
    private batchDelay;
    private handlerCache;
    /**
     * 设置最大监听器数量
     * @param n - 最大数量
     */
    setMaxListeners(n: number): this;
    /**
     * 获取当前监听器总数
     * @returns 监听器数量
     */
    getListenerCount(): number;
    /**
     * 监听事件
     * @param event - 事件名称
     * @param handler - 处理函数
     * @param priority - 优先级（默认0，越大越优先）
     * @returns this 支持链式调用
     */
    on(event: string, handler: EventHandler, priority?: number): this;
    /**
     * 监听一次性事件
     */
    once(event: string, handler: EventHandler, priority?: number): this;
    /**
     * 取消监听事件
     */
    off(event: string, handler: EventHandler): this;
    /**
     * 发射事件
     * @param event - 事件名称
     * @param args - 参数
     * @returns 是否有处理器被调用
     */
    emit(event: string, ...args: unknown[]): boolean;
    /**
     * 批量发射事件（优化性能）
     * @param items - 事件项数组
     */
    batchEmit(items: BatchEventItem[]): void;
    /**
     * 延迟批量发射事件（防抖）
     * @param event - 事件名称
     * @param args - 参数
     */
    deferredEmit(event: string, ...args: unknown[]): void;
    /**
     * 立即执行所有延迟的事件
     */
    flushDeferred(): void;
    /**
     * 获取事件统计信息
     * @returns 统计信息
     */
    getStats(): EventStats;
    /**
     * 检测潜在的内存泄漏
     * @param threshold - 阈值（默认50）
     * @returns 可能泄漏的事件列表
     */
    detectLeaks(threshold?: number): string[];
    /**
     * 清理旧的一次性监听器（超过指定时间未触发）
     * @param maxAge - 最大年龄（毫秒，默认5分钟）
     */
    cleanupOldOnceListeners(maxAge?: number): number;
    /**
     * 异步发射事件
     */
    emitAsync(event: string, ...args: any[]): Promise<void>;
    /**
     * 移除所有监听器
     */
    removeAllListeners(event?: string): this;
    /**
     * 获取监听器列表
     */
    listeners(event: string): EventHandler[];
    /**
     * 获取指定事件的监听器数量
     */
    getEventListenerCount(event: string): number;
    /**
     * 获取所有事件名称
     */
    eventNames(): string[];
    /**
     * 获取最大监听器数量
     */
    getMaxListeners(): number;
    /**
     * 检查监听器数量
     */
    private checkMaxListeners;
    /**
     * 获取内存使用情况
     */
    getMemoryUsage(): {
        events: number;
        listeners: number;
        averageListenersPerEvent: number;
    };
    /**
     * 优化内存
     */
    optimize(): void;
}
export {};
//# sourceMappingURL=OptimizedEventEmitter.d.ts.map