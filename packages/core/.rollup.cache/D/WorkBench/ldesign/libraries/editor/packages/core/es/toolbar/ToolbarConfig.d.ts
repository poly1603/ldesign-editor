/**
 * 优化的工具栏配置系统
 * 支持按需加载、动态配置和自定义功能
 */
import type { Editor } from '../core/Editor';
/**
 * 工具栏项基础配置
 */
export interface ToolbarItemBase {
    id: string;
    type?: 'button' | 'dropdown' | 'separator' | 'custom';
    icon?: string | (() => string | Promise<string>);
    label?: string;
    tooltip?: string;
    shortcut?: string;
    visible?: boolean | ((editor: Editor) => boolean);
    enabled?: boolean | ((editor: Editor) => boolean);
    active?: boolean | ((editor: Editor) => boolean);
}
/**
 * 按钮类型工具栏项
 */
export interface ToolbarButton extends ToolbarItemBase {
    type?: 'button';
    action: (editor: Editor) => void | Promise<void>;
}
/**
 * 下拉菜单工具栏项
 */
export interface ToolbarDropdown extends ToolbarItemBase {
    type: 'dropdown';
    items: ToolbarMenuItem[];
    defaultValue?: string;
    onChange?: (value: string, editor: Editor) => void;
}
/**
 * 菜单项配置
 */
export interface ToolbarMenuItem {
    value: string;
    label: string;
    icon?: string;
    action?: (editor: Editor) => void;
}
/**
 * 分隔符
 */
export interface ToolbarSeparator {
    id: string;
    type: 'separator';
}
/**
 * 自定义工具栏项
 */
export interface ToolbarCustomItem extends ToolbarItemBase {
    type: 'custom';
    render: (container: HTMLElement, editor: Editor) => void | HTMLElement;
    onMount?: (element: HTMLElement, editor: Editor) => void;
    onUnmount?: (element: HTMLElement, editor: Editor) => void;
}
export type ToolbarItem = ToolbarButton | ToolbarDropdown | ToolbarSeparator | ToolbarCustomItem;
/**
 * 懒加载配置
 */
export interface LazyConfig {
    enabled: boolean;
    loader: () => Promise<ToolbarItem | ToolbarItem[]>;
    placeholder?: string | HTMLElement;
    preload?: boolean;
    priority?: 'high' | 'normal' | 'low';
}
/**
 * 工具栏组配置
 */
export interface ToolbarGroup {
    id: string;
    label?: string;
    items: (string | ToolbarItem)[];
    collapsible?: boolean;
    collapsed?: boolean;
    visible?: boolean | ((editor: Editor) => boolean);
}
/**
 * 工具栏配置
 */
export interface OptimizedToolbarConfig {
    items?: (string | ToolbarItem | ToolbarGroup)[];
    theme?: 'light' | 'dark' | 'auto';
    size?: 'small' | 'medium' | 'large';
    position?: 'top' | 'bottom' | 'float';
    sticky?: boolean;
    compact?: boolean;
    showLabels?: boolean;
    showTooltips?: boolean;
    lazyLoad?: boolean;
    virtualScroll?: boolean;
    maxVisibleItems?: number;
    overflow?: 'scroll' | 'menu' | 'wrap';
    customClass?: string;
    onItemClick?: (id: string, editor: Editor) => void;
    onReady?: (toolbar: any) => void;
}
/**
 * 预设配置
 */
export declare const TOOLBAR_PRESETS: {
    readonly minimal: {
        readonly items: readonly ["bold", "italic", "separator", "undo", "redo"];
        readonly compact: true;
        readonly showLabels: false;
    };
    readonly standard: {
        readonly items: readonly [{
            readonly id: "format";
            readonly items: readonly ["bold", "italic", "underline", "strike"];
        }, "separator", {
            readonly id: "paragraph";
            readonly items: readonly ["heading", "bulletList", "orderedList"];
        }, "separator", {
            readonly id: "insert";
            readonly items: readonly ["link", "image", "table"];
        }, "separator", "undo", "redo"];
        readonly showTooltips: true;
    };
    readonly full: {
        readonly items: readonly [{
            readonly id: "file";
            readonly items: readonly ["new", "open", "save"];
        }, "separator", {
            readonly id: "format";
            readonly items: readonly ["bold", "italic", "underline", "strike", "code", "clear"];
        }, "separator", {
            readonly id: "paragraph";
            readonly items: readonly ["heading", "paragraph", "bulletList", "orderedList", "taskList"];
        }, "separator", {
            readonly id: "align";
            readonly items: readonly ["alignLeft", "alignCenter", "alignRight", "alignJustify"];
        }, "separator", {
            readonly id: "insert";
            readonly items: readonly ["link", "image", "video", "table", "horizontalRule"];
        }, "separator", {
            readonly id: "tools";
            readonly items: readonly ["findReplace", "spellCheck", "wordCount"];
        }, "separator", "undo", "redo", "separator", "fullscreen"];
        readonly showLabels: true;
        readonly showTooltips: true;
        readonly virtualScroll: true;
    };
};
/**
 * 默认工具栏项配置
 */
export declare const DEFAULT_ITEMS: Record<string, ToolbarItem>;
