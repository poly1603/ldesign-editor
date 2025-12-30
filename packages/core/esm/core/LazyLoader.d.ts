/**
 * 懒加载管理器
 * 实现真正的按需加载，减少初始加载时间
 *
 * 新增特性（v1.3.0）:
 * - 网络感知加载（根据网速调整策略）
 * - 预测性预加载（基于用户行为）
 * - 优先级队列（智能调度）
 * - 离线支持（Service Worker集成）
 *
 * @packageDocumentation
 */
import { EventEmitter } from './EventEmitter';
/**
 * 加载器函数类型
 */
export type LoaderFunction<T> = () => Promise<T> | T;
/**
 * 网络连接类型
 */
export type NetworkType = 'slow-2g' | '2g' | '3g' | '4g' | 'wifi' | 'unknown';
/**
 * 加载策略
 */
export type LoadStrategy = 'immediate' | 'idle' | 'visible' | 'interaction' | 'manual';
/**
 * 加载选项
 */
export interface LoadOptions {
    /** 超时时间（毫秒） */
    timeout?: number;
    /** 重试次数 */
    retry?: number;
    /** 是否缓存结果 */
    cache?: boolean;
    /** 优先级（0-10，越大越优先） */
    priority?: number;
    /** 加载策略 */
    strategy?: LoadStrategy;
    /** 依赖项ID列表 */
    dependencies?: string[];
}
/**
 * 懒加载管理器类
 */
export declare class LazyLoader extends EventEmitter {
    private loaders;
    private loadQueue;
    private maxConcurrent;
    private activeLoads;
    private monitor;
    constructor(maxConcurrent?: number);
    /**
     * 注册加载器
     */
    register<T>(id: string, loader: LoaderFunction<T>, options?: LoadOptions): void;
    /**
     * 加载资源
     */
    load<T>(id: string): Promise<T | null>;
    /**
     * 执行加载
     */
    private executeLoad;
    /**
     * 等待加载完成
     */
    private waitForLoad;
    /**
     * 处理队列
     */
    private processQueue;
    /**
     * 批量加载
     */
    loadBatch(ids: string[]): Promise<Array<any | null>>;
    /**
     * 预加载
     */
    preload(ids: string[]): Promise<void>;
    /**
     * 卸载资源
     */
    unload(id: string): void;
    /**
     * 获取加载统计
     */
    getStats(): {
        total: number;
        loaded: number;
        loading: number;
        queued: number;
        failed: number;
    };
    /**
     * 获取加载时间统计
     */
    getLoadTimes(): Array<{
        id: string;
        time: number;
    }>;
    /**
     * 清理
     */
    destroy(): void;
}
/**
 * 获取全局懒加载管理器
 */
export declare function getLazyLoader(): LazyLoader;
/**
 * 重置全局懒加载管理器
 */
export declare function resetLazyLoader(): void;
//# sourceMappingURL=LazyLoader.d.ts.map