/**
 * 统一的AI对话框
 * 整合所有AI相关的对话框功能
 */
export type AIDialogType = 'correct' | 'complete' | 'continue' | 'rewrite' | 'suggest';
interface AIDialogOptions {
    type: AIDialogType;
    originalText?: string;
    onConfirm: (text: string) => void;
    onCancel?: () => void;
}
interface AIDialogHandle {
    updateResult: (result: string, original?: string) => void;
    showError: (error: string) => void;
    close: () => void;
}
/**
 * 显示AI对话框（支持加载状态）
 */
export declare function showAIDialog(options: AIDialogOptions): AIDialogHandle;
/**
 * AI模拟响应工具
 */
export declare const AIMockUtils: {
    mockCorrect: (text: string) => string;
    mockComplete: (context: string) => string;
    mockContinue: (context: string) => string;
    mockRewrite: (text: string) => string;
};
export {};
