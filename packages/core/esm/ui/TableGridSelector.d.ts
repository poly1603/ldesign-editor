/**
 * 表格网格选择器
 * 提供类似 Word/Office 的表格插入体验
 */
export interface TableGridSelectorOptions {
    onSelect: (rows: number, cols: number) => void;
    maxRows?: number;
    maxCols?: number;
    button?: HTMLElement;
}
/**
 * 显示表格网格选择器下拉框
 */
export declare function showTableGridSelector(options: TableGridSelectorOptions): void;
/**
 * 创建增强的表格网格选择器（支持动态扩展）
 */
export declare function showEnhancedTableGridSelector(options: TableGridSelectorOptions): void;
//# sourceMappingURL=TableGridSelector.d.ts.map