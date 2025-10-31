/**
 * 代码块插入对话框
 * 类似 LinkDialog 的实现方式
 */
export interface CodeBlockDialogOptions {
    selectedText?: string;
    onConfirm?: (code: string, language: string, theme: string) => void;
    onCancel?: () => void;
}
/**
 * 显示代码块插入对话框
 */
export declare function showCodeBlockDialog(options?: CodeBlockDialogOptions): void;
