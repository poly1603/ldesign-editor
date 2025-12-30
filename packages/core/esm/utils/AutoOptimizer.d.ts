/**
 * 自动优化器
 * 根据性能监控自动调整配置以优化性能
 */
import { EventEmitter } from '../core/EventEmitter';
/**
 * 优化建议
 */
export interface OptimizationSuggestion {
    type: 'feature' | 'memory' | 'loading' | 'rendering';
    severity: 'critical' | 'warning' | 'info';
    message: string;
    action: string;
    autoFixable: boolean;
    fix?: () => void;
}
/**
 * 优化配置
 */
export interface AutoOptimizerConfig {
    enabled: boolean;
    checkInterval: number;
    autoFix: boolean;
    thresholds: {
        minFPS: number;
        maxMemory: number;
        maxLoadTime: number;
    };
}
/**
 * 自动优化器类
 */
export declare class AutoOptimizer extends EventEmitter {
    private config;
    private monitor;
    private features;
    private loader;
    private checkTimer;
    private suggestions;
    constructor(config?: Partial<AutoOptimizerConfig>);
    /**
     * 启动自动优化
     */
    start(): void;
    /**
     * 停止自动优化
     */
    stop(): void;
    /**
     * 检查并生成建议
     */
    check(): void;
    /**
     * 检查FPS
     */
    private checkFPS;
    /**
     * 检查内存
     */
    private checkMemory;
    /**
     * 检查加载时间
     */
    private checkLoadTime;
    /**
     * 检查功能使用
     */
    private checkFeatureUsage;
    /**
     * 自动修复
     */
    private autoFix;
    /**
     * 获取建议
     */
    getSuggestions(): OptimizationSuggestion[];
    /**
     * 应用建议
     */
    applySuggestion(index: number): void;
    /**
     * 生成优化报告
     */
    generateReport(): string;
    /**
     * 销毁
     */
    destroy(): void;
}
/**
 * 获取自动优化器
 */
export declare function getAutoOptimizer(config?: Partial<AutoOptimizerConfig>): AutoOptimizer;
/**
 * 启动自动优化
 */
export declare function startAutoOptimization(config?: Partial<AutoOptimizerConfig>): void;
/**
 * 停止自动优化
 */
export declare function stopAutoOptimization(): void;
//# sourceMappingURL=AutoOptimizer.d.ts.map