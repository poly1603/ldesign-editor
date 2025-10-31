/**
 * DOM 操作工具函数
 */
export interface ElementConfig {
    tag?: string;
    className?: string;
    id?: string;
    style?: Partial<CSSStyleDeclaration>;
    attrs?: Record<string, string>;
    children?: (HTMLElement | string)[];
    html?: string;
    text?: string;
    parent?: HTMLElement;
}
/**
 * 创建元素
 */
export declare function createElement(config: ElementConfig): HTMLElement;
/**
 * 应用样式
 */
export declare function applyStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void;
/**
 * 添加类名
 */
export declare function addClass(element: HTMLElement, ...classNames: string[]): void;
/**
 * 移除类名
 */
export declare function removeClass(element: HTMLElement, ...classNames: string[]): void;
/**
 * 切换类名
 */
export declare function toggleClass(element: HTMLElement, className: string, force?: boolean): boolean;
/**
 * 检查是否有类名
 */
export declare function hasClass(element: HTMLElement, className: string): boolean;
/**
 * 移除元素
 */
export declare function removeElement(element: HTMLElement): void;
/**
 * 清空元素内容
 */
export declare function clearElement(element: HTMLElement): void;
/**
 * 替换元素
 */
export declare function replaceElement(oldElement: HTMLElement, newElement: HTMLElement): void;
/**
 * 插入元素到指定位置
 */
export declare function insertElement(element: HTMLElement, target: HTMLElement, position?: 'before' | 'after' | 'prepend' | 'append'): void;
/**
 * 查询元素
 */
export declare function query<T extends HTMLElement = HTMLElement>(selector: string, parent?: HTMLElement | Document): T | null;
/**
 * 查询所有元素
 */
export declare function queryAll<T extends HTMLElement = HTMLElement>(selector: string, parent?: HTMLElement | Document): T[];
/**
 * 获取元素的最近父元素
 */
export declare function closest<T extends HTMLElement = HTMLElement>(element: HTMLElement, selector: string): T | null;
/**
 * 检查元素是否匹配选择器
 */
export declare function matches(element: HTMLElement, selector: string): boolean;
/**
 * 获取元素的兄弟元素
 */
export declare function getSiblings(element: HTMLElement): HTMLElement[];
/**
 * 获取元素的索引
 */
export declare function getIndex(element: HTMLElement): number;
/**
 * 显示元素
 */
export declare function show(element: HTMLElement): void;
/**
 * 隐藏元素
 */
export declare function hide(element: HTMLElement): void;
/**
 * 切换显示状态
 */
export declare function toggle(element: HTMLElement, force?: boolean): void;
/**
 * 检查元素是否可见
 */
export declare function isVisible(element: HTMLElement): boolean;
/**
 * 获取元素的文本内容
 */
export declare function getText(element: HTMLElement): string;
/**
 * 设置元素的文本内容
 */
export declare function setText(element: HTMLElement, text: string): void;
/**
 * 获取元素的HTML内容
 */
export declare function getHTML(element: HTMLElement): string;
/**
 * 设置元素的HTML内容
 */
export declare function setHTML(element: HTMLElement, html: string): void;
/**
 * 获取元素属性
 */
export declare function getAttr(element: HTMLElement, name: string): string | null;
/**
 * 设置元素属性
 */
export declare function setAttr(element: HTMLElement, name: string, value: string): void;
/**
 * 移除元素属性
 */
export declare function removeAttr(element: HTMLElement, name: string): void;
/**
 * 检查元素是否有属性
 */
export declare function hasAttr(element: HTMLElement, name: string): boolean;
/**
 * 获取或设置元素数据
 */
export declare function data(element: HTMLElement, key: string, value?: any): any;
/**
 * 包装元素
 */
export declare function wrap(element: HTMLElement, wrapper: HTMLElement): void;
/**
 * 解包元素
 */
export declare function unwrap(element: HTMLElement): void;
/**
 * 克隆元素
 */
export declare function clone(element: HTMLElement, deep?: boolean): HTMLElement;
/**
 * 检查元素是否包含另一个元素
 */
export declare function contains(parent: HTMLElement, child: HTMLElement): boolean;
/**
 * 聚焦元素
 */
export declare function focus(element: HTMLElement): void;
/**
 * 失焦元素
 */
export declare function blur(element: HTMLElement): void;
/**
 * 滚动到元素
 */
export declare function scrollIntoView(element: HTMLElement, options?: ScrollIntoViewOptions): void;
/**
 * 获取元素的偏移量
 */
export declare function getOffset(element: HTMLElement): {
    top: number;
    left: number;
};
/**
 * 获取元素的尺寸
 */
export declare function getSize(element: HTMLElement): {
    width: number;
    height: number;
};
/**
 * 获取元素的内部尺寸
 */
export declare function getInnerSize(element: HTMLElement): {
    width: number;
    height: number;
};
/**
 * 获取元素的外部尺寸
 */
export declare function getOuterSize(element: HTMLElement, includeMargin?: boolean): {
    width: number;
    height: number;
};
export declare function createButton(text: string, className?: string): HTMLButtonElement;
export declare function createIcon(iconName: string, className?: string): HTMLElement;
