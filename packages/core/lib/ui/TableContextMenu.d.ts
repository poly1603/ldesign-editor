/**
 * 表格右键菜单
 */
export interface TableContextMenuOptions {
    onAddRowAbove?: () => void;
    onAddRowBelow?: () => void;
    onAddColumnLeft?: () => void;
    onAddColumnRight?: () => void;
    onDeleteRow?: () => void;
    onDeleteColumn?: () => void;
    onDeleteTable?: () => void;
    onMergeCells?: () => void;
    onSplitCell?: () => void;
    x: number;
    y: number;
}
/**
 * 创建表格右键菜单
 */
export declare function createTableContextMenu(options: TableContextMenuOptions): HTMLElement;
/**
 * 显示表格右键菜单
 */
export declare function showTableContextMenu(options: TableContextMenuOptions): void;
//# sourceMappingURL=TableContextMenu.d.ts.map