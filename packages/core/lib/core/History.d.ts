/**
 * 历史记录管理（撤销/重做）
 */
import type { Editor } from './Editor';
/**
 * 历史记录状态
 */
export interface HistoryState {
    /** HTML 内容 */
    html: string;
    /** 选区信息 */
    selection: {
        start: number;
        end: number;
    } | null;
    /** 时间戳 */
    timestamp: number;
}
/**
 * 历史记录管理类
 */
export declare class History {
    private editor;
    private undoStack;
    private redoStack;
    private maxStackSize;
    private isUndoing;
    private isRedoing;
    private isSaving;
    private lastSavedState;
    private saveTimeout;
    constructor(editor: Editor, maxStackSize?: number);
    /**
     * 初始化
     */
    private init;
    /**
     * 防抖保存（避免频繁保存）
     */
    private debouncedSave;
    /**
     * 保存当前状态
     */
    saveState(): void;
    /**
     * 撤销
     */
    undo(): boolean;
    /**
     * 重做
     */
    redo(): boolean;
    /**
     * 恢复状态
     */
    private restoreState;
    /**
     * 获取当前选区
     */
    private getCurrentSelection;
    /**
     * 恢复选区
     */
    private restoreSelection;
    /**
     * 获取节点在编辑器中的偏移量
     */
    private getOffset;
    /**
     * 从偏移量创建 Range
     */
    private createRangeFromOffsets;
    /**
     * 清空历史
     */
    clear(): void;
    /**
     * 检查是否可以撤销
     */
    canUndo(): boolean;
    /**
     * 检查是否可以重做
     */
    canRedo(): boolean;
    /**
     * 获取历史记录信息
     */
    getInfo(): {
        undoCount: number;
        redoCount: number;
        canUndo: boolean;
        canRedo: boolean;
    };
    /**
     * 销毁
     */
    destroy(): void;
}
