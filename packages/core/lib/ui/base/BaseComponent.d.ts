/**
 * 基础组件类
 * 所有UI组件的基类，提供通用功能
 */
export interface BaseComponentOptions {
    className?: string;
    container?: HTMLElement;
    zIndex?: number;
    visible?: boolean;
    destroyOnHide?: boolean;
}
export interface Position {
    x: number;
    y: number;
}
export interface Size {
    width: number;
    height: number;
}
export declare abstract class BaseComponent {
    protected element: HTMLElement;
    protected options: BaseComponentOptions;
    protected visible: boolean;
    protected eventListeners: Map<string, Set<Function>>;
    private boundEvents;
    constructor(options?: BaseComponentOptions);
    /**
     * 创建组件的DOM元素
     */
    protected abstract createElement(): HTMLElement;
    /**
     * 设置元素基本属性
     */
    protected setupElement(): void;
    /**
     * 将元素附加到DOM
     */
    protected attachToDOM(): void;
    /**
     * 显示组件
     */
    show(): void;
    /**
     * 隐藏组件
     */
    hide(): void;
    /**
     * 切换显示状态
     */
    toggle(): void;
    /**
     * 销毁组件
     */
    destroy(): void;
    /**
     * 设置位置
     */
    setPosition(x: number, y: number): void;
    /**
     * 获取位置
     */
    getPosition(): Position;
    /**
     * 设置大小
     */
    setSize(width: number, height: number): void;
    /**
     * 获取大小
     */
    getSize(): Size;
    /**
     * 调整位置以保持在视口内
     */
    keepInViewport(): void;
    /**
     * 绑定事件
     */
    protected bindEvent(element: Element | Document | Window, type: string, handler: EventListener, options?: AddEventListenerOptions): void;
    /**
     * 移除所有绑定的事件
     */
    protected removeAllEvents(): void;
    /**
     * 事件发射
     */
    protected emit(event: string, ...args: any[]): void;
    /**
     * 事件监听
     */
    on(event: string, handler: Function): void;
    /**
     * 移除事件监听
     */
    off(event: string, handler: Function): void;
    /**
     * 生命周期钩子 - 显示前
     */
    protected beforeShow(): void;
    /**
     * 生命周期钩子 - 显示后
     */
    protected afterShow(): void;
    /**
     * 生命周期钩子 - 隐藏前
     */
    protected beforeHide(): void;
    /**
     * 生命周期钩子 - 隐藏后
     */
    protected afterHide(): void;
    /**
     * 生命周期钩子 - 销毁前
     */
    protected beforeDestroy(): void;
    /**
     * 生命周期钩子 - 销毁后
     */
    protected afterDestroy(): void;
    /**
     * 获取DOM元素
     */
    getElement(): HTMLElement;
    /**
     * 是否可见
     */
    isVisible(): boolean;
    /**
     * 添加CSS类
     */
    addClass(className: string): void;
    /**
     * 移除CSS类
     */
    removeClass(className: string): void;
    /**
     * 切换CSS类
     */
    toggleClass(className: string): void;
    /**
     * 设置样式
     */
    setStyle(styles: Partial<CSSStyleDeclaration>): void;
    /**
     * 设置属性
     */
    setAttribute(name: string, value: string): void;
    /**
     * 获取属性
     */
    getAttribute(name: string): string | null;
    /**
     * 移除属性
     */
    removeAttribute(name: string): void;
    /**
     * 设置内容
     */
    setContent(content: string | HTMLElement): void;
    /**
     * 追加内容
     */
    appendContent(content: string | HTMLElement): void;
    /**
     * 前置内容
     */
    prependContent(content: string | HTMLElement): void;
    /**
     * 聚焦
     */
    focus(): void;
    /**
     * 失焦
     */
    blur(): void;
}
