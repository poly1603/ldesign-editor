/**
 * 事件处理工具函数
 */
export interface EventOptions extends AddEventListenerOptions {
    preventDefault?: boolean;
    stopPropagation?: boolean;
    stopImmediatePropagation?: boolean;
}
export interface DebouncedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): void;
    cancel: () => void;
    flush: () => void;
}
export interface ThrottledFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): void;
    cancel: () => void;
}
/**
 * 绑定事件（返回解绑函数）
 */
export declare function on(element: Element | Document | Window, event: string, handler: EventListener, options?: EventOptions): () => void;
/**
 * 绑定一次性事件
 */
export declare function once(element: Element | Document | Window, event: string, handler: EventListener, options?: EventOptions): () => void;
/**
 * 解绑事件
 */
export declare function off(element: Element | Document | Window, event: string, handler: EventListener, options?: boolean | EventListenerOptions): void;
/**
 * 触发事件
 */
export declare function trigger(element: Element, event: string | Event, detail?: any): boolean;
/**
 * 防抖函数
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number, immediate?: boolean): DebouncedFunction<T>;
/**
 * 节流函数
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, wait: number, options?: {
    leading?: boolean;
    trailing?: boolean;
}): ThrottledFunction<T>;
/**
 * 事件委托
 */
export declare function delegate(element: Element | Document, selector: string, event: string, handler: (e: Event, target: Element) => void, options?: EventOptions): () => void;
/**
 * 停止事件传播
 */
export declare function stop(e: Event): void;
/**
 * 阻止默认行为
 */
export declare function prevent(e: Event): void;
/**
 * 获取键盘事件的按键
 */
export declare function getKey(e: KeyboardEvent): string;
/**
 * 检查是否按下修饰键
 */
export declare function hasModifier(e: KeyboardEvent | MouseEvent): boolean;
/**
 * 检查是否按下特定修饰键组合
 */
export declare function checkModifiers(e: KeyboardEvent | MouseEvent, modifiers: {
    ctrl?: boolean;
    meta?: boolean;
    alt?: boolean;
    shift?: boolean;
}): boolean;
/**
 * 创建长按事件
 */
export declare function onLongPress(element: Element, handler: (e: MouseEvent | TouchEvent) => void, duration?: number): () => void;
/**
 * 创建拖拽事件
 */
export declare function onDrag(element: Element, handlers: {
    onStart?: (e: MouseEvent | TouchEvent, pos: {
        x: number;
        y: number;
    }) => void;
    onMove?: (e: MouseEvent | TouchEvent, pos: {
        x: number;
        y: number;
    }, delta: {
        x: number;
        y: number;
    }) => void;
    onEnd?: (e: MouseEvent | TouchEvent, pos: {
        x: number;
        y: number;
    }) => void;
}): () => void;
/**
 * 监听元素尺寸变化
 */
export declare function onResize(element: Element, handler: (entries: ResizeObserverEntry[]) => void): () => void;
/**
 * 监听元素可见性变化
 */
export declare function onVisibilityChange(element: Element, handler: (isVisible: boolean, entry: IntersectionObserverEntry) => void, options?: IntersectionObserverInit): () => void;
/**
 * 等待事件触发
 */
export declare function waitForEvent(element: Element | Document | Window, event: string, timeout?: number): Promise<Event>;
/**
 * 事件处理器类型
 */
export type EventHandler = (...args: any[]) => void;
/**
 * 事件映射类型
 */
export type EventMap = Record<string, any[]>;
/**
 * 增强的事件发射器（支持泛型）
 */
export declare class EventEmitter<T extends Record<string, any[]> = Record<string, any[]>> {
    private events;
    on<K extends keyof T>(event: K, handler: (...args: T[K]) => void): () => void;
    once<K extends keyof T>(event: K, handler: (...args: T[K]) => void): () => void;
    off<K extends keyof T>(event: K, handler: (...args: T[K]) => void): void;
    emit<K extends keyof T>(event: K, ...args: T[K]): void;
    clear(event?: keyof T): void;
    listenerCount(event: keyof T): number;
}
//# sourceMappingURL=event.d.ts.map