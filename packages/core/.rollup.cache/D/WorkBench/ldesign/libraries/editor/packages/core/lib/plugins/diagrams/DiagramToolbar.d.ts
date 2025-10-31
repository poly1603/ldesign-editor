/**
 * 图表工具栏
 * 提供图表插入和编辑的快捷操作
 */
import type { Editor } from '../../core/Editor';
import type { DiagramType } from './types';
export interface DiagramToolbarOptions {
    editor: Editor;
    onInsertDiagram: (type: DiagramType) => void;
    onEditDiagram: (node: HTMLElement) => void;
}
export declare class DiagramToolbar {
    private editor;
    private onInsertDiagram;
    private onEditDiagram;
    private container?;
    constructor(options: DiagramToolbarOptions);
    /**
     * 创建工具栏
     */
    private createToolbar;
    /**
     * 创建按钮
     */
    private createButton;
    /**
     * 更新状态
     */
    updateState(hasDiagram: boolean): void;
    /**
     * 销毁工具栏
     */
    destroy(): void;
}
