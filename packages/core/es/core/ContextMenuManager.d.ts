/**
 * 右键菜单管理器
 * 统一管理编辑器中所有的右键菜单，提供注册、注销、更新等功能
 */
import type { MenuItem } from '../components/ContextMenuSystem';
import { ContextMenuSystem } from '../components/ContextMenuSystem';
import { EventEmitter } from './EventEmitter';
export interface MenuRegistration {
    id: string;
    selector: string;
    priority?: number;
    items: MenuItem[] | ((context: any) => MenuItem[]);
    condition?: (element: HTMLElement) => boolean;
    onBeforeShow?: (menu: ContextMenuSystem, context: any) => void;
    onAfterShow?: (menu: ContextMenuSystem, context: any) => void;
    onBeforeHide?: (menu: ContextMenuSystem, context: any) => void;
    onAfterHide?: (menu: ContextMenuSystem, context: any) => void;
}
export interface ContextMenuManagerOptions {
    theme?: 'light' | 'dark';
    animation?: boolean;
    maxHeight?: number;
    minWidth?: number;
    zIndex?: number;
    enableDefault?: boolean;
}
export declare class ContextMenuManager extends EventEmitter {
    private registrations;
    private activeMenu;
    private options;
    private container;
    private clickHandlers;
    constructor(options?: ContextMenuManagerOptions);
    private initialize;
    /**
     * 设置容器元素
     */
    setContainer(element: HTMLElement): void;
    /**
     * 注册右键菜单
     */
    register(registration: MenuRegistration): void;
    /**
     * 注销右键菜单
     */
    unregister(id: string): void;
    /**
     * 更新菜单项
     */
    updateMenu(id: string, items: MenuItem[] | ((context: any) => MenuItem[])): void;
    /**
     * 获取注册的菜单
     */
    getRegistration(id: string): MenuRegistration | undefined;
    /**
     * 获取所有注册的菜单
     */
    getAllRegistrations(): MenuRegistration[];
    /**
     * 处理全局右键事件
     */
    private handleGlobalContextMenu;
    /**
     * 查找匹配的菜单
     */
    private findMatchingMenus;
    /**
     * 显示菜单
     */
    private showMenu;
    /**
     * 手动触发右键菜单
     */
    trigger(e: MouseEvent, menuId: string, context?: any): void;
    /**
     * 关闭当前活动的菜单
     */
    closeActiveMenu(): void;
    /**
     * 为特定元素添加右键菜单
     */
    addContextMenu(element: HTMLElement, items: MenuItem[], options?: Partial<MenuRegistration>): string;
    /**
     * 批量注册菜单
     */
    registerBatch(registrations: MenuRegistration[]): void;
    /**
     * 批量注销菜单
     */
    unregisterBatch(ids: string[]): void;
    /**
     * 清除所有注册的菜单
     */
    clear(): void;
    /**
     * 更新全局选项
     */
    updateOptions(options: Partial<ContextMenuManagerOptions>): void;
    /**
     * 获取当前选项
     */
    getOptions(): ContextMenuManagerOptions;
    /**
     * 销毁管理器
     */
    destroy(): void;
}
/**
 * 获取全局右键菜单管理器
 */
export declare function getContextMenuManager(): ContextMenuManager;
/**
 * 快捷函数：注册右键菜单
 */
export declare function registerContextMenu(registration: MenuRegistration): void;
/**
 * 快捷函数：为元素添加右键菜单
 */
export declare function addContextMenuToElement(element: HTMLElement, items: MenuItem[], options?: Partial<MenuRegistration>): string;
