/**
 * Selection - 选区管理
 * 处理光标和选中内容
 */
import type { Range, Selection as SelectionType } from '../types';
export declare class Selection {
    anchor: number;
    head: number;
    constructor(anchor: number, head?: number);
    /**
     * 是否为空选区（光标）
     */
    get empty(): boolean;
    /**
     * 选区起始位置
     */
    get from(): number;
    /**
     * 选区结束位置
     */
    get to(): number;
    /**
     * 获取范围
     */
    get range(): Range;
    /**
     * 转换为类型
     */
    toJSON(): SelectionType;
    /**
     * 从类型创建
     */
    static fromJSON(json: SelectionType): Selection;
    /**
     * 创建空选区（光标）
     */
    static cursor(pos: number): Selection;
    /**
     * 创建范围选区
     */
    static range(from: number, to: number): Selection;
    /**
     * 比较两个选区是否相等
     */
    equals(other: Selection): boolean;
    /**
     * 克隆选区
     */
    clone(): Selection;
}
/**
 * 选区管理器
 * 管理 DOM 选区和编辑器选区的同步
 */
export declare class SelectionManager {
    private editor;
    private selection;
    constructor(editor: any);
    /**
     * 获取当前选区
     */
    getSelection(): Selection;
    /**
     * 设置选区
     */
    setSelection(selection: Selection): void;
    /**
     * 从 DOM 同步选区
     */
    syncFromDOM(): void;
    /**
     * 同步到 DOM
     */
    syncToDOM(): void;
    /**
     * DOM 位置转编辑器位置
     */
    private domPositionToEditorPosition;
    /**
     * 编辑器范围转 DOM 范围
     */
    private editorRangeToDOMRange;
    /**
     * 清除选区
     */
    clear(): void;
}
//# sourceMappingURL=Selection.d.ts.map