/**
 * 历史记录标签页
 * 显示编辑器操作历史和撤销/重做栈
 */
import type { Editor } from '../../core/Editor';
export interface HistoryEntry {
    id: string;
    timestamp: number;
    type: string;
    description: string;
    data?: any;
    snapshot?: string;
    canUndo: boolean;
    canRedo: boolean;
    size?: number;
}
export declare class HistoryTab {
    private editor;
    private container?;
    private history;
    private currentIndex;
    private maxHistory;
    private listContainer?;
    private detailsContainer?;
    private selectedEntry?;
    constructor(options: {
        editor: Editor;
    });
    /**
     * 设置历史记录追踪
     */
    private setupHistoryTracking;
    /**
     * 渲染标签页
     */
    render(): HTMLElement;
    /**
     * 创建工具栏
     */
    private createToolbar;
    /**
     * 渲染历史列表
     */
    private renderHistory;
    /**
     * 创建历史条目
     */
    private createHistoryItem;
    /**
     * 获取类型图标
     */
    private getTypeIcon;
    /**
     * 格式化时间
     */
    private formatTime;
    /**
     * 选择历史条目
     */
    private selectEntry;
    /**
     * 添加历史记录
     */
    private addHistoryEntry;
    /**
     * 获取变更描述
     */
    private getChangeDescription;
    /**
     * 撤销
     */
    private undo;
    /**
     * 重做
     */
    private redo;
    /**
     * 判断是否可以撤销
     */
    private canUndo;
    /**
     * 判断是否可以重做
     */
    private canRedo;
    /**
     * 清空历史
     */
    private clearHistory;
    /**
     * 更新工具栏
     */
    private updateToolbar;
    /**
     * 计算内存占用
     */
    private calculateMemoryUsage;
    /**
     * 格式化大小
     */
    private formatSize;
    /**
     * 激活标签页
     */
    activate(): void;
    /**
     * 停用标签页
     */
    deactivate(): void;
    /**
     * 销毁
     */
    destroy(): void;
}
//# sourceMappingURL=HistoryTab.d.ts.map