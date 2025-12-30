/**
 * 工具栏管理器
 * 支持动态配置、按需加载和性能优化
 */
import type { Editor } from '../core/Editor';
import type { ToolbarItem } from '../types';
import { EventEmitter } from '../core/EventEmitter';
/**
 * 工具栏组配置
 */
export interface ToolbarGroupConfig {
    name: string;
    label?: string;
    items: string[];
    visible?: boolean;
    collapsed?: boolean;
    order?: number;
}
/**
 * 工具栏配置
 */
export interface ToolbarManagerConfig {
    groups?: ToolbarGroupConfig[];
    position?: 'top' | 'bottom' | 'float';
    sticky?: boolean;
    compact?: boolean;
    showLabels?: boolean;
    lazyLoad?: boolean;
}
/**
 * 工具栏管理器类
 */
export declare class ToolbarManager extends EventEmitter {
    private editor;
    private config;
    private container;
    private items;
    private groups;
    private visibleItems;
    private observer?;
    constructor(editor: Editor, config?: ToolbarManagerConfig);
    /**
     * 创建容器
     */
    private createContainer;
    /**
     * 设置交叉观察器（用于按需加载）
     */
    private setupIntersectionObserver;
    /**
     * 注册工具栏项
     */
    registerItem(item: ToolbarItem, group?: string): void;
    /**
     * 批量注册工具栏项
     */
    registerBatch(items: ToolbarItem[], group?: string): void;
    /**
     * 注册工具栏组
     */
    registerGroup(config: ToolbarGroupConfig): void;
    /**
     * 加载工具栏项
     */
    private loadItem;
    /**
     * 创建工具栏项元素
     */
    private createItemElement;
    /**
     * 创建占位符元素
     */
    private createPlaceholder;
    /**
     * 渲染工具栏
     */
    render(): HTMLElement;
    /**
     * 渲染分组工具栏
     */
    private renderGroups;
    /**
     * 渲染扁平工具栏
     */
    private renderFlat;
    /**
     * 显示工具栏项
     */
    showItem(name: string): void;
    /**
     * 隐藏工具栏项
     */
    hideItem(name: string): void;
    /**
     * 显示工具栏组
     */
    showGroup(name: string): void;
    /**
     * 隐藏工具栏组
     */
    hideGroup(name: string): void;
    /**
     * 更新工具栏配置
     */
    updateConfig(config: Partial<ToolbarManagerConfig>): void;
    /**
     * 获取容器
     */
    getContainer(): HTMLElement;
    /**
     * 获取统计信息
     */
    getStats(): {
        total: number;
        loaded: number;
        visible: number;
        groups: number;
    };
    /**
     * 销毁
     */
    destroy(): void;
}
//# sourceMappingURL=ToolbarManager.d.ts.map