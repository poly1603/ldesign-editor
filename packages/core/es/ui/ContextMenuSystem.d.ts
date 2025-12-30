/**
 * 通用多层右键菜单系统
 * 支持无限层级、动态菜单项、快捷键、图标、分隔符等功能
 */
export interface MenuItem {
    id?: string;
    label?: string;
    icon?: string;
    shortcut?: string;
    action?: (context?: any) => void;
    submenu?: MenuItem[];
    divider?: boolean;
    disabled?: boolean | ((context?: any) => boolean);
    visible?: boolean | ((context?: any) => boolean);
    checked?: boolean | ((context?: any) => boolean);
    type?: 'normal' | 'checkbox' | 'radio';
    group?: string;
    className?: string;
    tooltip?: string;
}
export interface ContextMenuOptions {
    items: MenuItem[];
    context?: any;
    onBeforeShow?: (menu: ContextMenuSystem) => void;
    onAfterShow?: (menu: ContextMenuSystem) => void;
    onBeforeHide?: (menu: ContextMenuSystem) => void;
    onAfterHide?: (menu: ContextMenuSystem) => void;
    theme?: 'light' | 'dark';
    animation?: boolean;
    maxHeight?: number;
    minWidth?: number;
    zIndex?: number;
}
export declare class ContextMenuSystem {
    private container;
    private options;
    private visible;
    private submenuMap;
    private activeSubmenus;
    private hideTimeouts;
    constructor(options: ContextMenuOptions);
    private createContainer;
    private attachEventListeners;
    show(x: number, y: number, context?: any): void;
    hide(): void;
    private cleanupSubmenus;
    private render;
    private renderItems;
    private renderDivider;
    private renderMenuItem;
    private setupSubmenu;
    private createSubmenu;
    updateItems(items: MenuItem[]): void;
    updateContext(context: any): void;
    destroy(): void;
}
export declare function showContextMenu(e: MouseEvent, options: ContextMenuOptions): ContextMenuSystem;
//# sourceMappingURL=ContextMenuSystem.d.ts.map