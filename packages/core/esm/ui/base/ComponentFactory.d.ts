/**
 * UI组件工厂
 * 提供统一的组件创建方法，减少重复代码
 */
import type { IconRenderOptions } from '../../icons/types';
/**
 * 按钮类型
 */
export type ButtonType = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'link' | 'text';
/**
 * 按钮选项
 */
export interface ButtonOptions {
    type?: ButtonType;
    label?: string;
    icon?: string;
    iconOptions?: IconRenderOptions;
    title?: string;
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    size?: 'small' | 'medium' | 'large';
    onClick?: (e: MouseEvent) => void;
}
/**
 * 输入框选项
 */
export interface InputOptions {
    type?: string;
    placeholder?: string;
    value?: string;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    onChange?: (value: string) => void;
}
/**
 * 下拉选项项
 */
export interface SelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
    icon?: string;
}
/**
 * 下拉选项
 */
export interface SelectOptions {
    options: SelectOption[];
    value?: string | number;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    onChange?: (value: string | number) => void;
}
/**
 * 对话框按钮
 */
export interface DialogButton {
    id: string;
    label: string;
    type?: ButtonType;
    onClick?: () => void | Promise<void>;
}
/**
 * 对话框选项
 */
export interface DialogOptions {
    title: string;
    content?: string | HTMLElement;
    buttons?: DialogButton[];
    closeOnOverlay?: boolean;
    className?: string;
    width?: string;
    height?: string;
}
/**
 * UI组件工厂类
 */
export declare class ComponentFactory {
    private iconManager;
    private i18n;
    /**
     * 创建按钮
     */
    createButton(options: ButtonOptions): HTMLButtonElement;
    /**
     * 创建图标按钮
     */
    createIconButton(icon: string, options?: Partial<ButtonOptions>): HTMLButtonElement;
    /**
     * 创建输入框
     */
    createInput(options: InputOptions): HTMLInputElement;
    /**
     * 创建文本域
     */
    createTextarea(options: InputOptions & {
        rows?: number;
    }): HTMLTextAreaElement;
    /**
     * 创建下拉选择框
     */
    createSelect(options: SelectOptions): HTMLSelectElement;
    /**
     * 创建复选框
     */
    createCheckbox(label: string, checked?: boolean, onChange?: (checked: boolean) => void): HTMLLabelElement;
    /**
     * 创建分隔线
     */
    createDivider(className?: string): HTMLDivElement;
    /**
     * 创建标签
     */
    createLabel(text: string, htmlFor?: string): HTMLLabelElement;
    /**
     * 创建表单组
     */
    createFormGroup(label: string, input: HTMLElement): HTMLDivElement;
    /**
     * 创建卡片
     */
    createCard(options: {
        title?: string;
        content?: HTMLElement | string;
        className?: string;
    }): HTMLDivElement;
    /**
     * 获取按钮类名
     */
    private getButtonClassName;
    /**
     * 获取图标大小
     */
    private getIconSize;
    /**
     * 设置按钮加载状态
     */
    setButtonLoading(button: HTMLButtonElement, loading: boolean): void;
    /**
     * 应用按钮样式
     */
    private applyButtonStyles;
    /**
     * 应用输入框样式
     */
    private applyInputStyles;
    /**
     * 应用文本域样式
     */
    private applyTextareaStyles;
    /**
     * 应用下拉框样式
     */
    private applySelectStyles;
    /**
     * 应用复选框样式
     */
    private applyCheckboxStyles;
}
/**
 * 获取组件工厂实例
 */
export declare function getComponentFactory(): ComponentFactory;
/**
 * 便捷函数
 */
export declare function createButton(options: ButtonOptions): HTMLButtonElement;
export declare function createIconButton(icon: string, options?: Partial<ButtonOptions>): HTMLButtonElement;
export declare function createInput(options: InputOptions): HTMLInputElement;
export declare function createSelect(options: SelectOptions): HTMLSelectElement;
export declare function createCheckbox(label: string, checked?: boolean, onChange?: (checked: boolean) => void): HTMLLabelElement;
//# sourceMappingURL=ComponentFactory.d.ts.map