/**
 * 增强的统一右键菜单管理器
 * 整合原有三套右键菜单系统的所有功能
 */
import type { MenuItem } from '../ui/base/ContextMenu';
import { ContextMenu } from '../ui/base/ContextMenu';
import { EventEmitter } from '../utils/event';
export interface MenuRegistration {
    id: string;
    selector: string | string[];
    priority?: number;
    items: MenuItem[] | ((context: MenuContext) => MenuItem[]);
    condition?: (element: HTMLElement, context: MenuContext) => boolean;
    onBeforeShow?: (menu: ContextMenu, context: MenuContext) => void;
    onAfterShow?: (menu: ContextMenu, context: MenuContext) => void;
    onBeforeHide?: (menu: ContextMenu, context: MenuContext) => void;
    onAfterHide?: (menu: ContextMenu, context: MenuContext) => void;
    merge?: boolean;
    group?: string;
}
export interface MenuContext {
    element: HTMLElement;
    event: MouseEvent;
    registration?: MenuRegistration;
    data?: any;
    [key: string]: any;
}
export interface ContextMenuManagerOptions {
    container?: HTMLElement;
    theme?: 'light' | 'dark';
    animation?: boolean;
    maxHeight?: number;
    minWidth?: number;
    zIndex?: number;
    enableDefault?: boolean;
    mergeMenus?: boolean;
}
/**
 * 单例模式的右键菜单管理器
 */
export declare class EnhancedContextMenuManager extends EventEmitter<{
    'menu-registered': [MenuRegistration];
    'menu-unregistered': [string];
    'menu-updated': [string];
    'menu-show': [MenuContext];
    'menu-hide': [MenuContext];
    'menu-select': [MenuItem, MenuContext];
}> {
    private static instance;
    private registrations;
    private activeMenu;
    private activeContext;
    private options;
    private cleanupFunctions;
    private constructor();
    /**
     * 获取单例实例
     */
    static getInstance(options?: ContextMenuManagerOptions): EnhancedContextMenuManager;
    /**
     * 销毁单例实例
     */
    static destroy(): void;
    private initialize;
    /**
     * 注册右键菜单
     */
    register(registration: MenuRegistration): void;
    /**
     * 批量注册菜单
     */
    registerBatch(registrations: MenuRegistration[]): void;
    /**
     * 注销右键菜单
     */
    unregister(id: string): void;
    /**
     * 更新菜单项
     */
    updateMenu(id: string, updates: Partial<MenuRegistration>): void;
    /**
     * 设置容器
     */
    setContainer(container: HTMLElement): void;
    /**
     * 更新选项
     */
    updateOptions(options: Partial<ContextMenuManagerOptions>): void;
    /**
     * 处理右键事件
     */
    private handleContextMenu;
    /**
     * 查找匹配的菜单
     */
    private findMatchingMenus;
    /**
     * 显示单个菜单
     */
    private showSingleMenu;
    /**
     * 显示合并的菜单
     */
    private showMergedMenu;
    /**
     * 隐藏当前菜单
     */
    hideMenu(): void;
    /**
     * 手动触发菜单
     */
    trigger(e: MouseEvent, menuId: string, context?: any): void;
    /**
     * 获取注册的菜单
     */
    getRegistration(id: string): MenuRegistration | undefined;
    /**
     * 获取所有注册的菜单
     */
    getAllRegistrations(): MenuRegistration[];
    /**
     * 获取当前活动的菜单
     */
    getActiveMenu(): ContextMenu | null;
    /**
     * 获取当前活动的上下文
     */
    getActiveContext(): MenuContext | null;
    /**
     * 清理资源
     */
    dispose(): void;
}
export declare function getContextMenuManager(options?: ContextMenuManagerOptions): EnhancedContextMenuManager;
export declare function registerContextMenu(registration: MenuRegistration): void;
export declare function unregisterContextMenu(id: string): void;
export declare function updateContextMenu(id: string, updates: Partial<MenuRegistration>): void;
export declare function triggerContextMenu(e: MouseEvent, menuId: string, context?: any): void;
export declare function hideContextMenu(): void;
