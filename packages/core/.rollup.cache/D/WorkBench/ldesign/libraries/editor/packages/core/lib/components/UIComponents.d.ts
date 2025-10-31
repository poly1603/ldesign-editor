/**
 * 统一的UI组件库
 * 提供模态框、下拉菜单、工具提示等通用组件
 */
export interface ModalOptions {
    title?: string;
    content: string | HTMLElement;
    width?: number;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
    className?: string;
}
export interface DropdownOptions {
    items: DropdownItem[];
    trigger?: HTMLElement;
    position?: 'bottom' | 'top' | 'left' | 'right' | 'auto';
    width?: number;
    className?: string;
}
export interface DropdownItem {
    label: string;
    value?: any;
    icon?: string;
    divider?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    submenu?: DropdownItem[];
}
export declare class Modal {
    private container;
    private overlay;
    private options;
    constructor(options: ModalOptions);
    private createOverlay;
    private createContainer;
    private show;
    close(): void;
    static confirm(message: string, title?: string): Promise<boolean>;
    static alert(message: string, title?: string): Promise<void>;
}
export declare class Dropdown {
    private container;
    private options;
    private isVisible;
    constructor(options: DropdownOptions);
    private createContainer;
    private createMenuItem;
    private attachTrigger;
    showAt(x: number, y: number): void;
    hide(): void;
    destroy(): void;
}
export declare class Toast {
    static show(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number): void;
}
