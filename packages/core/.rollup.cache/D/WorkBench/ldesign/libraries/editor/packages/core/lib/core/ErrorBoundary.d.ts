/**
 * 错误边界
 * 捕获和处理插件错误，防止影响整个编辑器
 */
import { EventEmitter } from './EventEmitter';
export interface ErrorInfo {
    error: Error;
    source: string;
    timestamp: number;
    recovered: boolean;
    context?: Record<string, any>;
}
export interface ErrorBoundaryConfig {
    maxErrors?: number;
    recoveryAttempts?: number;
    reportErrors?: boolean;
    onError?: (info: ErrorInfo) => void;
}
/**
 * 错误边界类
 */
export declare class ErrorBoundary extends EventEmitter {
    private config;
    private errors;
    private errorCounts;
    private maxHistorySize;
    constructor(config?: ErrorBoundaryConfig);
    /**
     * 捕获错误
     */
    captureError(error: Error, source: string, context?: Record<string, any>): ErrorInfo;
    /**
     * 包装函数，自动捕获错误
     */
    wrap<T extends (...args: any[]) => any>(fn: T, source: string, fallback?: (...args: Parameters<T>) => ReturnType<T>): T;
    /**
     * 尝试恢复
     */
    tryRecover<T>(fn: () => T | Promise<T>, source: string, options?: {
        attempts?: number;
        delay?: number;
        onRetry?: (attempt: number, error: Error) => void;
    }): Promise<T>;
    /**
     * 获取错误历史
     */
    getErrors(source?: string): ErrorInfo[];
    /**
     * 获取错误计数
     */
    getErrorCount(source?: string): number;
    /**
     * 获取错误率
     */
    getErrorRate(source: string, timeWindow?: number): number;
    /**
     * 检查源是否健康
     */
    isHealthy(source: string): boolean;
    /**
     * 重置错误计数
     */
    resetErrors(source?: string): void;
    /**
     * 生成错误报告
     */
    generateReport(): string;
    /**
     * 清理
     */
    destroy(): void;
}
/**
 * 获取全局错误边界
 */
export declare function getErrorBoundary(config?: ErrorBoundaryConfig): ErrorBoundary;
/**
 * 便捷函数：捕获错误
 */
export declare function captureError(error: Error, source: string, context?: Record<string, any>): void;
/**
 * 便捷函数：包装函数
 */
export declare function withErrorBoundary<T extends (...args: any[]) => any>(fn: T, source: string, fallback?: (...args: Parameters<T>) => ReturnType<T>): T;
