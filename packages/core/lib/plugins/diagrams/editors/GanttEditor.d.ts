/**
 * 甘特图编辑器
 */
import type { DiagramEditor, GanttData } from '../types';
export declare class GanttEditor implements DiagramEditor {
    private container?;
    private data?;
    private onSave?;
    private onCancel?;
    render(container: HTMLElement, options: {
        data: GanttData;
        onSave: (data: GanttData) => void;
        onCancel: () => void;
    }): Promise<void>;
    private createUI;
    private bindEvents;
    destroy(): void;
}
