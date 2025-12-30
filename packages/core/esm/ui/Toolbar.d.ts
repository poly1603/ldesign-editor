/**
 * 工具栏组件
 * 使用 Lucide 图标
 */
import type { EditorInstance as EditorType, ToolbarItem } from '../types';
export interface ToolbarOptions {
    items?: ToolbarItem[];
    container?: HTMLElement;
    className?: string;
}
export declare class Toolbar {
    private editor;
    private options;
    private element;
    private buttons;
    constructor(editor: EditorType, options?: ToolbarOptions);
    /**
     * 渲染工具栏
     */
    private render;
    /**
     * 创建按钮
     */
    private createButton;
    /**
     * 是否添加分隔符
     */
    private shouldAddSeparator;
    /**
     * 更新按钮状态
     */
    private updateButtonStates;
    /**
     * 获取默认工具栏项
     */
    getDefaultItems(): ToolbarItem[];
    /**
     * 获取工具栏元素
     */
    getElement(): HTMLElement;
    /**
     * 销毁工具栏
     */
    destroy(): void;
}
//# sourceMappingURL=Toolbar.d.ts.map