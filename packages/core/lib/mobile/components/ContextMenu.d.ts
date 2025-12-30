/**
 * 上下文菜单组件
 * 长按后显示的快捷操作菜单
 */
import { EventEmitter } from '../../core/EventEmitter';
export interface ContextMenuItem {
    label: string;
    icon?: string;
    action?: () => void;
    type?: 'normal' | 'separator';
    disabled?: boolean;
    destructive?: boolean;
}
export interface ContextMenuOptions {
    container: HTMLElement;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    maxWidth?: string;
    zIndex?: number;
}
export interface ShowOptions {
    x: number;
    y: number;
    items: ContextMenuItem[];
    selectedText?: string;
}
export declare class ContextMenu extends EventEmitter {
    private container;
    private menuElement;
    private options;
    private isVisible;
    private currentItems;
    constructor(options: ContextMenuOptions);
    /**
     * 创建菜单DOM
     */
    private createMenu;
    /**
     * 设置事件监听器
     */
    private setupEventListeners;
    /**
     * 显示菜单
     */
    show(options: ShowOptions): void;
    /**
     * 隐藏菜单
     */
    hide(): void;
    /**
     * 渲染菜单项
     */
    private renderItems;
    /**
     * 创建菜单项
     */
    private createMenuItem;
    /**
     * 创建分隔线
     */
    private createSeparator;
    /**
     * 调整位置以确保菜单在屏幕内
     */
    private adjustPosition;
    /**
     * 菜单项点击动画
     */
    private animateItemClick;
    /**
     * 更新菜单项
     */
    updateItems(items: ContextMenuItem[]): void;
    /**
     * 设置菜单项启用/禁用状态
     */
    setItemEnabled(index: number, enabled: boolean): void;
    /**
     * 获取当前显示状态
     */
    getVisible(): boolean;
    /**
     * 销毁菜单
     */
    destroy(): void;
}
//# sourceMappingURL=ContextMenu.d.ts.map