/**
 * 性能监控工具
 * 监控编辑器性能指标，帮助优化性能问题
 */
export interface PerformanceMetrics {
    loadTime: number;
    renderTime: number;
    memoryUsage: number;
    fps: number;
    eventCount: number;
    pluginCount: number;
    activePlugins: number;
}
export interface PerformanceEntry {
    name: string;
    startTime: number;
    duration: number;
    metadata?: Record<string, any>;
}
/**
 * 性能监控器类
 */
export declare class PerformanceMonitor {
    private metrics;
    private entries;
    private timers;
    private fpsFrames;
    private lastFrameTime;
    private maxEntries;
    constructor();
    /**
     * 开始计时
     */
    start(name: string): void;
    /**
     * 结束计时
     */
    end(name: string, metadata?: Record<string, any>): number;
    /**
     * 测量函数执行时间
     */
    measure<T>(name: string, fn: () => T | Promise<T>, metadata?: Record<string, any>): Promise<T>;
    /**
     * 记录性能条目
     */
    private addEntry;
    /**
     * 开始FPS监控
     */
    private startFPSMonitoring;
    /**
     * 开始内存监控
     */
    private startMemoryMonitoring;
    /**
     * 更新指标
     */
    updateMetrics(updates: Partial<PerformanceMetrics>): void;
    /**
     * 获取当前指标
     */
    getMetrics(): PerformanceMetrics;
    /**
     * 获取性能条目
     */
    getEntries(name?: string): PerformanceEntry[];
    /**
     * 获取统计信息
     */
    getStats(name?: string): {
        count: number;
        total: number;
        average: number;
        min: number;
        max: number;
    };
    /**
     * 获取慢操作
     */
    getSlowOperations(threshold?: number): PerformanceEntry[];
    /**
     * 生成报告
     */
    generateReport(): string;
    /**
     * 生成优化建议
     */
    private generateRecommendations;
    /**
     * 清空数据
     */
    clear(): void;
    /**
     * 导出数据
     */
    export(): {
        metrics: PerformanceMetrics;
        entries: PerformanceEntry[];
        timestamp: number;
    };
}
/**
 * 获取全局性能监控器
 */
export declare function getPerformanceMonitor(): PerformanceMonitor;
/**
 * 便捷函数：测量函数执行时间
 */
export declare function measure<T>(name: string, fn: () => T | Promise<T>): Promise<T>;
/**
 * 便捷函数：开始计时
 */
export declare function startTimer(name: string): void;
/**
 * 便捷函数：结束计时
 */
export declare function endTimer(name: string): number;
//# sourceMappingURL=PerformanceMonitor.d.ts.map