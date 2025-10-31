/**
 * 代码简化工具
 * 提供更简洁的API，减少样板代码
 */
import type { Editor } from '../core/Editor';
/**
 * DOM快捷操作
 */
export declare const $: {
    /**
     * 创建元素
     */
    create<K extends keyof HTMLElementTagNameMap>(tag: K, props?: Partial<HTMLElementTagNameMap[K]> & {
        className?: string;
        style?: string;
        html?: string;
        text?: string;
    }, children?: (HTMLElement | string)[]): HTMLElementTagNameMap[K];
    /**
     * 选择元素
     */
    select<T extends HTMLElement = HTMLElement>(selector: string): T | null;
    /**
     * 选择所有元素
     */
    selectAll<T extends HTMLElement = HTMLElement>(selector: string): T[];
    /**
     * 添加样式
     */
    style(el: HTMLElement, styles: Partial<CSSStyleDeclaration> | string): void;
    /**
     * 添加类
     */
    addClass(el: HTMLElement, ...classes: string[]): void;
    /**
     * 移除类
     */
    removeClass(el: HTMLElement, ...classes: string[]): void;
    /**
     * 切换类
     */
    toggleClass(el: HTMLElement, className: string, force?: boolean): void;
    /**
     * 移除元素
     */
    remove(el: HTMLElement): void;
    /**
     * 清空内容
     */
    empty(el: HTMLElement): void;
    /**
     * 显示/隐藏
     */
    show(el: HTMLElement): void;
    hide(el: HTMLElement): void;
    toggle(el: HTMLElement): void;
};
/**
 * 事件快捷操作
 */
export declare const on: {
    /**
     * 绑定事件
     */
    click(el: HTMLElement, handler: (e: MouseEvent) => void): void;
    change(el: HTMLElement, handler: (e: Event) => void): void;
    input(el: HTMLElement, handler: (e: Event) => void): void;
    keydown(el: HTMLElement, handler: (e: KeyboardEvent) => void): void;
    /**
     * 绑定一次性事件
     */
    once(el: HTMLElement, event: string, handler: EventListener): void;
    /**
     * 解绑事件
     */
    off(el: HTMLElement, event: string, handler: EventListener): void;
};
/**
 * 编辑器命令快捷操作
 */
export declare function cmd(editor: Editor): {
    /**
     * 切换格式
     */
    toggle(format: string): boolean;
    /**
     * 插入内容
     */
    insert(type: string, data?: any): boolean;
    /**
     * 设置格式
     */
    set(property: string, value: any): boolean;
    /**
     * 执行命令
     */
    exec(command: string, ...args: any[]): boolean;
};
/**
 * UI快捷操作
 */
export declare const ui: {
    /**
     * 创建按钮
     */
    button(text: string, onClick: () => void, icon?: string): HTMLButtonElement;
    /**
     * 创建输入框
     */
    input(placeholder: string, onChange?: (value: string) => void): HTMLInputElement;
    /**
     * 创建对话框
     */
    dialog(title: string, content: HTMLElement | string): HTMLElement;
    /**
     * 显示提示
     */
    toast(message: string, type?: "success" | "error" | "info"): void;
};
/**
 * 字符串工具
 */
export declare const str: {
    /**
     * 首字母大写
     */
    capitalize(s: string): string;
    /**
     * 驼峰转短横线
     */
    kebab(s: string): string;
    /**
     * 短横线转驼峰
     */
    camel(s: string): string;
    /**
     * 截断
     */
    truncate(s: string, maxLength: number, suffix?: string): string;
};
/**
 * 创建样式对象
 */
export declare function css(styles: Record<string, string | number>): string;
/**
 * 组合类名
 */
export declare function classNames(...args: (string | false | undefined | null)[]): string;
