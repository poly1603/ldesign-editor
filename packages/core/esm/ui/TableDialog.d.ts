/**
 * 表格插入对话框
 * 使用统一对话框组件实现
 */
export interface TableDialogOptions {
    onConfirm: (rows: number, cols: number) => void;
    onCancel?: () => void;
}
/**
 * 显示表格插入对话框
 */
export declare function showTableDialog(options: TableDialogOptions): void;
//# sourceMappingURL=TableDialog.d.ts.map