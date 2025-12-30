/**
 * DOM 操作工具函数
 * 统一管理DOM相关操作，避免重复代码
 */
/**
 * 创建元素并设置属性
 */
export declare function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, attrs?: Partial<HTMLElementTagNameMap[K]> & {
    style?: string | Partial<CSSStyleDeclaration>;
}, ...children: (Node | string)[]): HTMLElementTagNameMap[K];
/**
 * 查询单个元素
 */
export declare function $(selector: string, parent?: Element | Document): HTMLElement | null;
/**
 * 查询多个元素
 */
export declare function $$(selector: string, parent?: Element | Document): HTMLElement[];
/**
 * 添加事件监听器（支持事件委托）
 */
export declare function on<K extends keyof HTMLElementEventMap>(element: Element | Document | Window, event: K, handler: (e: HTMLElementEventMap[K]) => void, options?: boolean | AddEventListenerOptions): () => void;
export declare function on(element: Element | Document | Window, event: string, selector: string, handler: (e: Event) => void): () => void;
/**
 * 显示/隐藏元素
 */
export declare function show(element: HTMLElement): void;
export declare function hide(element: HTMLElement): void;
export declare function toggle(element: HTMLElement, force?: boolean): void;
/**
 * 添加/移除类名
 */
export declare function addClass(element: Element, ...classNames: string[]): void;
export declare function removeClass(element: Element, ...classNames: string[]): void;
export declare function toggleClass(element: Element, className: string, force?: boolean): void;
export declare function hasClass(element: Element, className: string): boolean;
/**
 * 获取元素位置
 */
export declare function getPosition(element: HTMLElement): {
    top: number;
    left: number;
    width: number;
    height: number;
};
/**
 * 设置元素位置
 */
export declare function setPosition(element: HTMLElement, position: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}): void;
/**
 * 移除元素
 */
export declare function remove(element: Element): void;
/**
 * 清空元素内容
 */
export declare function empty(element: Element): void;
/**
 * 防抖函数
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * 节流函数
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * 等待DOM元素出现
 */
export declare function waitForElement(selector: string, timeout?: number): Promise<HTMLElement>;
//# sourceMappingURL=DOMUtils.d.ts.map