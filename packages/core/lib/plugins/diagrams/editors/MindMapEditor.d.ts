/**
 * 思维导图编辑器
 * 使用简化的实现，支持基本的节点创建、编辑和布局
 */
import type { DiagramEditor, DiagramOptions, MindMapData } from '../types';
export declare class MindMapEditor implements DiagramEditor {
    private container?;
    private data?;
    private selectedNode?;
    private onSave?;
    private onCancel?;
    private canvas?;
    private ctx?;
    private scale;
    private offsetX;
    private offsetY;
    private isDragging;
    private dragStartX;
    private dragStartY;
    /**
     * 渲染编辑器
     */
    render(container: HTMLElement, options: {
        data: MindMapData;
        onSave: (data: MindMapData, options?: DiagramOptions) => void;
        onCancel: () => void;
    }): Promise<void>;
    /**
     * 创建UI
     */
    private createUI;
    /**
     * 设置画布
     */
    private setupCanvas;
    /**
     * 绑定事件
     */
    private bindEvents;
    /**
     * 渲染思维导图
     */
    private renderMindMap;
    /**
     * 渲染节点
     */
    private renderNode;
    /**
     * 绘制圆角矩形
     */
    private roundRect;
    /**
     * 添加子节点
     */
    private addChildNode;
    /**
     * 添加同级节点
     */
    private addSiblingNode;
    /**
     * 删除节点
     */
    private deleteNode;
    /**
     * 查找父节点
     */
    private findParentNode;
    /**
     * 缩放
     */
    private zoom;
    /**
     * 重置缩放
     */
    private resetZoom;
    /**
     * 处理鼠标按下
     */
    private handleMouseDown;
    /**
     * 处理鼠标移动
     */
    private handleMouseMove;
    /**
     * 处理鼠标释放
     */
    private handleMouseUp;
    /**
     * 处理滚轮
     */
    private handleWheel;
    /**
     * 处理点击
     */
    private handleClick;
    /**
     * 处理双击
     */
    private handleDoubleClick;
    /**
     * 查找指定位置的节点
     */
    private findNodeAtPosition;
    /**
     * 销毁编辑器
     */
    destroy(): void;
}
//# sourceMappingURL=MindMapEditor.d.ts.map