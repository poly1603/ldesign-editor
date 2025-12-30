/**
 * 图表渲染器
 * 负责将图表数据渲染为可视化内容
 */
import type { Editor } from '../../core/Editor';
import type { DiagramData, DiagramOptions, DiagramRendererInterface, DiagramType } from './types';
export declare class DiagramRenderer implements DiagramRendererInterface {
    private editor;
    constructor(options: {
        editor: Editor;
    });
    /**
     * 渲染图表
     */
    render(container: HTMLElement, type: DiagramType, data: DiagramData, options?: DiagramOptions): void;
    /**
     * 渲染思维导图预览
     */
    private renderMindMapPreview;
    /**
     * 渲染流程图预览
     */
    private renderFlowchartPreview;
    /**
     * 渲染UML预览
     */
    private renderUMLPreview;
    /**
     * 渲染时序图预览
     */
    private renderSequencePreview;
    /**
     * 渲染甘特图预览
     */
    private renderGanttPreview;
    /**
     * 导出图表
     */
    export(container: HTMLElement, type: DiagramType, data: DiagramData, format?: 'png' | 'svg' | 'pdf'): Promise<void>;
    /**
     * 销毁渲染器
     */
    destroy(): void;
}
//# sourceMappingURL=DiagramRenderer.d.ts.map