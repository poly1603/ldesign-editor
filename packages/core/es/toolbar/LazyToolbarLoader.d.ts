/**
 * 工具栏懒加载管理器
 * 负责按需加载工具栏项，优化性能和内存使用
 */
import type { ToolbarItemConfig } from './types';
/**
 * 加载状态
 */
export declare enum LoadStatus {
    IDLE = "idle",
    LOADING = "loading",
    LOADED = "loaded",
    ERROR = "error"
}
/**
 * 懒加载管理器配置
 */
export interface LazyLoaderConfig {
    /** 预加载延迟（毫秒） */
    preloadDelay?: number;
    /** 最大并发加载数 */
    maxConcurrent?: number;
    /** 加载超时时间 */
    timeout?: number;
    /** 是否启用缓存 */
    cache?: boolean;
    /** 缓存过期时间 */
    cacheExpiry?: number;
}
/**
 * 懒加载管理器
 */
export declare class LazyToolbarLoader {
    private items;
    private loadQueue;
    private loading;
    private observer?;
    private preloadTimers;
    private cache;
    private config;
    constructor(config?: LazyLoaderConfig);
    /**
     * 设置交叉观察器
     */
    private setupObserver;
    /**
     * 注册懒加载项
     */
    register(config: ToolbarItemConfig): void;
    /**
     * 加载项目
     */
    load(id: string): Promise<HTMLElement | undefined>;
    /**
     * 执行加载
     */
    private doLoad;
    /**
     * 等待加载槽位
     */
    private waitForSlot;
    /**
     * 创建默认元素
     */
    private createDefaultElement;
    /**
     * 创建图标
     */
    private createIcon;
    /**
     * 预加载
     */
    preload(id: string): void;
    /**
     * 取消预加载
     */
    cancelPreload(id: string): void;
    /**
     * 创建占位符
     */
    createPlaceholder(config: ToolbarItemConfig): HTMLElement;
    /**
     * 替换占位符
     */
    replacePlaceholder(placeholder: HTMLElement, id: string): Promise<void>;
    /**
     * 获取加载状态
     */
    getStatus(id: string): LoadStatus | undefined;
    /**
     * 获取统计信息
     */
    getStats(): {
        total: number;
        loaded: number;
        loading: number;
        error: number;
        cached: number;
    };
    /**
     * 清理缓存
     */
    clearCache(): void;
    /**
     * 销毁
     */
    destroy(): void;
}
