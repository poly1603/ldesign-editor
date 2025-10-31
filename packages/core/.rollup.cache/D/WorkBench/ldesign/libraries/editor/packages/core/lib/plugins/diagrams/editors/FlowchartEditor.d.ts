/**
 * 流程图编辑器
 * 简化实现，支持基本的节点创建和连接
 */
import type { DiagramEditor, DiagramOptions, FlowchartData } from '../types';
export declare class FlowchartEditor implements DiagramEditor {
    private container?;
    private data?;
    private onSave?;
    private onCancel?;
    render(container: HTMLElement, options: {
        data: FlowchartData;
        onSave: (data: FlowchartData, options?: DiagramOptions) => void;
        onCancel: () => void;
    }): Promise<void>;
    private createUI;
    private bindEvents;
    private getNodeIcon;
    private addNode;
    private editNode;
    private deleteNode;
    private addEdge;
    private deleteEdge;
    destroy(): void;
}
