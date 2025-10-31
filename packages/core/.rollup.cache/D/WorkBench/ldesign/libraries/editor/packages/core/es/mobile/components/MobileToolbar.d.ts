/**
 * 移动端工具栏组件
 * 自适应的底部工具栏
 */
import type { Editor } from '../../core/Editor';
import { EventEmitter } from '../../core/EventEmitter';
export interface ToolbarItem {
    id: string;
    icon: string;
    title: string;
    type?: 'button' | 'separator';
    active?: boolean;
    disabled?: boolean;
    action?: (editor: Editor) => void;
}
export interface MobileToolbarOptions {
    container: HTMLElement;
    editor: Editor;
    items?: ToolbarItem[];
    height?: string;
    backgroundColor?: string;
    activeColor?: string;
    autoHide?: boolean;
}
export declare class MobileToolbar extends EventEmitter {
    private container;
    private editor;
    private toolbarElement;
    private itemsContainer;
    private moreMenu;
    private options;
    private items;
    private isVisible;
    private isCompact;
    private lastScrollY;
    constructor(options: MobileToolbarOptions);
    /**
     * 创建工具栏DOM
     */
    private createToolbar;
    /**
     * 渲染工具栏项
     */
    private renderItems;
    /**
     * 创建工具栏项
     */
    private createToolbarItem;
    /**
     * 创建分隔线
     */
    private createSeparator;
    /**
     * 处理工具栏项点击
     */
    private handleItemClick;
    /**
     * 执行编辑器命令
     */
    private executeCommand;
    /**
     * 显示更多菜单
     */
    private showMoreMenu;
    /**
     * 隐藏更多菜单
     */
    private hideMoreMenu;
    /**
     * 显示图片选择器
     */
    private showImagePicker;
    /**
     * 显示链接对话框
     */
    private showLinkDialog;
    /**
     * 设置事件监听器
     */
    private setupEventListeners;
    /**
     * 更新活动状态
     */
    private updateActiveStates;
    /**
     * 设置项目激活状态
     */
    setItemActive(id: string, active: boolean): void;
    /**
     * 设置项目启用状态
     */
    setItemEnabled(id: string, enabled: boolean): void;
    /**
     * 设置紧凑模式
     */
    setCompactMode(compact: boolean): void;
    /**
     * 显示工具栏
     */
    show(): void;
    /**
     * 隐藏工具栏
     */
    hide(): void;
    /**
     * 切换显示状态
     */
    toggle(): void;
    /**
     * 获取显示状态
     */
    getVisible(): boolean;
    /**
     * 销毁工具栏
     */
    destroy(): void;
}
