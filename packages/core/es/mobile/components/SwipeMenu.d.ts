/**
 * 滑动菜单组件
 * 从左侧滑出的导航菜单
 */
import { EventEmitter } from '../../core/EventEmitter';
export interface SwipeMenuItem {
    label: string;
    icon?: string;
    action?: () => void;
    children?: SwipeMenuItem[];
    disabled?: boolean;
}
export interface SwipeMenuOptions {
    container: HTMLElement;
    items?: SwipeMenuItem[];
    width?: string;
    backgroundColor?: string;
    textColor?: string;
    activeColor?: string;
}
export declare class SwipeMenu extends EventEmitter {
    private container;
    private menuElement;
    private overlayElement;
    private options;
    private isOpen_;
    private startX;
    private currentX;
    private isDragging;
    constructor(options: SwipeMenuOptions);
    /**
     * 创建菜单DOM
     */
    private createMenu;
    /**
     * 创建菜单项
     */
    private createMenuItem;
    /**
     * 设置事件监听器
     */
    private setupEventListeners;
    /**
     * 打开菜单
     */
    open(): void;
    /**
     * 关闭菜单
     */
    close(): void;
    /**
     * 切换菜单
     */
    toggle(): void;
    /**
     * 检查菜单是否打开
     */
    isOpen(): boolean;
    /**
     * 更新菜单项
     */
    updateItems(items: SwipeMenuItem[]): void;
    /**
     * 设置菜单项启用/禁用状态
     */
    setItemEnabled(label: string, enabled: boolean): void;
    /**
     * 销毁菜单
     */
    destroy(): void;
}
