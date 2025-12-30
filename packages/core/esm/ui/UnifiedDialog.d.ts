/**
 * 统一的对话框组件
 * 提供一致的对话框接口，替代分散的对话框实现
 */
export interface UnifiedDialogField {
    id: string;
    type: 'text' | 'email' | 'url' | 'textarea' | 'select' | 'checkbox' | 'number' | 'password';
    label: string;
    placeholder?: string;
    value?: any;
    defaultValue?: any;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    rows?: number;
    options?: Array<{
        label: string;
        value: any;
    }>;
    validator?: (value: any) => string | null;
    onChange?: (value: any) => void;
    helpText?: string;
    pattern?: string;
    min?: number;
    max?: number;
    step?: number;
    accept?: string;
}
export interface UnifiedDialogButton {
    id: string;
    label: string;
    type?: 'primary' | 'secondary' | 'danger' | 'success' | 'link';
    disabled?: boolean;
    loading?: boolean;
    onClick?: (dialog: UnifiedDialog) => void | Promise<void>;
    closeOnClick?: boolean;
}
export interface UnifiedDialogConfig {
    title: string;
    subtitle?: string;
    icon?: string | HTMLElement;
    content?: string | HTMLElement;
    fields?: UnifiedDialogField[];
    buttons?: UnifiedDialogButton[];
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    preventScroll?: boolean;
    width?: number | string;
    maxWidth?: number | string;
    height?: number | string;
    maxHeight?: number | string;
    className?: string;
    centered?: boolean;
    animation?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onSubmit?: (data: Record<string, any>) => void | Promise<void>;
    beforeClose?: () => boolean | Promise<boolean>;
}
export declare class UnifiedDialog {
    private config;
    private overlay;
    private dialog;
    private header;
    private body;
    private footer;
    private toastContainer;
    private fieldValues;
    private fieldElements;
    private buttonElements;
    private isOpen;
    private isClosing;
    private toastQueue;
    private activeToasts;
    constructor(config: UnifiedDialogConfig);
    private mergeConfig;
    private init;
    private createElements;
    private createToastContainer;
    private createHeader;
    private createBody;
    private createFieldElement;
    private createFooter;
    private createButtonElement;
    private handleButtonClick;
    private handleSubmit;
    private validateFieldWithoutToast;
    private validateField;
    private updateFieldError;
    private clearFieldError;
    private initFieldValues;
    private setFieldValue;
    private bindEvents;
    open(): void;
    close(): Promise<void>;
    setButtonLoading(buttonId: string, loading: boolean): void;
    setButtonDisabled(buttonId: string, disabled: boolean): void;
    getFieldValue(fieldId: string): any;
    setFieldValueById(fieldId: string, value: any): void;
    getFormData(): Record<string, any>;
    showToast(message: string, type?: 'error' | 'success' | 'warning' | 'info', duration?: number): void;
    private removeToast;
    showError(message: string): void;
    showSuccess(message: string): void;
    showWarning(message: string): void;
    showInfo(message: string): void;
    hideError(): void;
    destroy(): void;
}
/**
 * 快捷方法：显示对话框
 */
export declare function showUnifiedDialog(config: UnifiedDialogConfig): UnifiedDialog;
/**
 * 快捷方法：确认对话框
 */
export declare function showConfirmDialog(title: string, message: string, onConfirm: () => void | Promise<void>, onCancel?: () => void): UnifiedDialog;
/**
 * 快捷方法：提示对话框
 */
export declare function showAlertDialog(title: string, message: string, onOk?: () => void): UnifiedDialog;
/**
 * 快捷方法：输入对话框
 */
export declare function showPromptDialog(title: string, label: string, onConfirm: (value: string) => void | Promise<void>, options?: {
    defaultValue?: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'url' | 'number';
    validator?: (value: any) => string | null;
}): UnifiedDialog;
//# sourceMappingURL=UnifiedDialog.d.ts.map