/**
 * 时序图编辑器
 */
import type { DiagramEditor, SequenceData } from '../types';
export declare class SequenceDiagramEditor implements DiagramEditor {
    private container?;
    private data?;
    private onSave?;
    private onCancel?;
    render(container: HTMLElement, options: {
        data: SequenceData;
        onSave: (data: SequenceData) => void;
        onCancel: () => void;
    }): Promise<void>;
    private createUI;
    private bindEvents;
    destroy(): void;
}
