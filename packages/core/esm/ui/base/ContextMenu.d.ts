/**
 * ContextMenu 基础类
 * 所有右键菜单组件的基类
 */
import type { BaseComponentOptions } from './BaseComponent';
import { BaseComponent } from './BaseComponent';
export interface MenuItem {
    id?: string;
    label?: string;
    icon?: string;
    shortcut?: string;
    divider?: boolean;
    disabled?: boolean | ((context?: any) => boolean);
    visible?: boolean | ((context?: any) => boolean);
    checked?: boolean | ((context?: any) => boolean);
    action?: (context?: any) => void;
    submenu?: MenuItem[];
    className?: string;
    type?: 'normal' | 'checkbox' | 'radio';
    group?: string;
}
export interface ContextMenuOptions extends BaseComponentOptions {
    items?: MenuItem[];
    context?: any;
    minWidth?: number;
    maxHeight?: number;
    animation?: boolean;
    theme?: 'light' | 'dark';
    onSelect?: (item: MenuItem, context?: any) => void;
    onBeforeShow?: (menu: ContextMenu) => void;
    onAfterShow?: (menu: ContextMenu) => void;
    onBeforeHide?: (menu: ContextMenu) => void;
    onAfterHide?: (menu: ContextMenu) => void;
}
export declare class ContextMenu extends BaseComponent {
    protected menuOptions: ContextMenuOptions;
    protected items: MenuItem[];
    protected context: any;
    protected itemsContainer: HTMLElement;
    protected submenuMap: Map<HTMLElement, ContextMenu>;
    protected activeSubmenu: ContextMenu | null;
    protected hideTimeout: number | null;
    constructor(options?: ContextMenuOptions);
    protected createElement(): HTMLElement;
    protected setupGlobalListeners(): void;
    protected isInSubmenu(target: HTMLElement): boolean;
    setItems(items: MenuItem[]): void;
    setContext(context: any): void;
    protected renderItems(): void;
    protected createMenuItem(item: MenuItem): HTMLElement;
    protected createDivider(): HTMLElement;
    protected showSubmenu(parentItem: HTMLElement, items: MenuItem[]): void;
    protected hideActiveSubmenu(): void;
    showAt(x: number, y: number, context?: any): void;
    protected beforeShow(): void;
    protected beforeHide(): void;
    protected afterHide(): void;
    updateItem(id: string, updates: Partial<MenuItem>): void;
    getItem(id: string): MenuItem | undefined;
    addItem(item: MenuItem, index?: number): void;
    removeItem(id: string): void;
}
//# sourceMappingURL=ContextMenu.d.ts.map