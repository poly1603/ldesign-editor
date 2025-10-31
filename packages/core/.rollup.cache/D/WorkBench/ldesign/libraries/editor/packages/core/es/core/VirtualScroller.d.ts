/**
 * 虚拟滚动器 - 支持超大文档的高性能滚动
 *
 * 特性：
 * - 支持10万+行文档流畅滚动
 * - 只渲染可视区域内容
 * - 动态回收和复用DOM节点
 * - 平滑滚动和快速跳转
 */
import { EventEmitter } from './EventEmitter';
export interface VirtualScrollerOptions {
    /** 容器元素 */
    container: HTMLElement;
    /** 单个项目的高度（固定高度模式） */
    itemHeight?: number;
    /** 缓冲区大小（可视区域外额外渲染的项目数） */
    bufferSize?: number;
    /** 是否启用动态高度 */
    dynamicHeight?: boolean;
    /** 滚动事件节流延迟（ms） */
    scrollThrottle?: number;
    /** 是否启用平滑滚动 */
    smoothScroll?: boolean;
    /** 最大缓存节点数 */
    maxCachedNodes?: number;
    /** 自定义渲染器 */
    renderer?: (item: any, index: number) => HTMLElement;
}
export interface VirtualScrollerItem {
    id: string | number;
    data: any;
    height?: number;
    element?: HTMLElement;
}
export declare class VirtualScroller extends EventEmitter {
    private container;
    private viewport;
    private content;
    private items;
    private itemHeights;
    private nodePool;
    private renderedItems;
    private metrics;
    private options;
    private scrollHandler;
    private resizeObserver;
    private intersectionObserver;
    private isScrolling;
    private scrollTimeout;
    private measurementCache;
    constructor(options: VirtualScrollerOptions);
    /**
     * 设置要渲染的项目列表
     */
    setItems(items: VirtualScrollerItem[]): void;
    /**
     * 添加项目
     */
    addItems(items: VirtualScrollerItem[], index?: number): void;
    /**
     * 移除项目
     */
    removeItems(ids: (string | number)[]): void;
    /**
     * 滚动到指定位置
     */
    scrollTo(position: number, smooth?: boolean): void;
    /**
     * 滚动到指定项目
     */
    scrollToItem(id: string | number, position?: 'start' | 'center' | 'end'): void;
    /**
     * 获取当前可见的项目
     */
    getVisibleItems(): VirtualScrollerItem[];
    /**
     * 刷新指定项目
     */
    refreshItem(id: string | number): void;
    /**
     * 销毁虚拟滚动器
     */
    destroy(): void;
    private setupDOM;
    private setupEventListeners;
    private setupObservers;
    private handleScroll;
    private calculateMetrics;
    private findStartIndex;
    private findEndIndex;
    private getItemHeight;
    private calculateItemOffset;
    private updateContentHeight;
    private render;
    private getOrCreateNode;
    private recycleNode;
    private measureItem;
    private defaultRenderer;
    /**
     * 获取性能指标
     */
    getPerformanceMetrics(): {
        totalItems: number;
        renderedItems: number;
        cachedNodes: number;
        memoryUsage: number;
    };
    private estimateMemoryUsage;
}
