/**
 * UML类图编辑器
 */
import type { DiagramEditor, UMLData } from '../types';
export declare class UMLEditor implements DiagramEditor {
    private container?;
    private data?;
    private onSave?;
    private onCancel?;
    render(container: HTMLElement, options: {
        data: UMLData;
        onSave: (data: UMLData) => void;
        onCancel: () => void;
    }): Promise<void>;
    private createUI;
    private bindEvents;
    destroy(): void;
}
//# sourceMappingURL=UMLEditor.d.ts.map