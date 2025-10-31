/**
 * Context Menu Class for Media Elements
 */
export declare class ContextMenu {
    private options;
    private menu;
    private target;
    private items;
    constructor(options?: ContextMenuOptions);
    /**
     * Show the context menu
     */
    show(event: MouseEvent, items: MenuItem[], target?: HTMLElement): void;
    /**
     * Hide the context menu
     */
    hide(): void;
    /**
     * Create menu DOM element
     */
    private createMenu;
    /**
     * Create individual menu item
     */
    private createMenuItem;
    /**
     * Show submenu
     */
    private showSubmenu;
    /**
     * Position the menu on screen
     */
    private positionMenu;
    /**
     * Attach event listeners
     */
    private attachEventListeners;
}
/**
 * Menu item interface
 */
export interface MenuItem {
    id?: string;
    label?: string;
    icon?: string;
    shortcut?: string;
    action?: (target: HTMLElement | null) => void;
    submenu?: MenuItem[];
    divider?: boolean;
    disabled?: boolean;
}
/**
 * Context menu options
 */
export interface ContextMenuOptions {
    className?: string;
}
