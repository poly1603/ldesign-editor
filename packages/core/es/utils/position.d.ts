/**
 * 位置和坐标工具函数
 */
export interface Point {
    x: number;
    y: number;
}
export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface Position {
    top: number;
    left: number;
    right: number;
    bottom: number;
}
/**
 * 调整元素位置以保持在视口内
 */
export declare function keepInViewport(element: HTMLElement, padding?: number): Point;
/**
 * 调整位置
 */
export declare function adjustPosition(el: HTMLElement, x: number, y: number): Point;
/**
 * 获取相对位置
 */
export declare function getRelativePosition(el: HTMLElement, parent: HTMLElement): Point;
/**
 * 获取鼠标相对于元素的位置
 */
export declare function getMousePosition(event: MouseEvent, element: HTMLElement): Point;
/**
 * 获取元素中心点
 */
export declare function getCenterPosition(element: HTMLElement): Point;
/**
 * 计算两点之间的距离
 */
export declare function getDistance(p1: Point, p2: Point): number;
/**
 * 计算两点之间的角度
 */
export declare function getAngle(p1: Point, p2: Point): number;
/**
 * 检查点是否在矩形内
 */
export declare function isPointInRect(point: Point, rect: Rect): boolean;
/**
 * 检查两个矩形是否相交
 */
export declare function isRectOverlap(rect1: Rect, rect2: Rect): boolean;
/**
 * 获取元素的边界框
 */
export declare function getBoundingBox(element: HTMLElement): Rect;
/**
 * 设置元素位置
 */
export declare function setPosition(element: HTMLElement, x: number, y: number): void;
/**
 * 获取元素位置
 */
export declare function getPosition(element: HTMLElement): Position;
/**
 * 计算最佳弹出位置
 */
export declare function calculatePopupPosition(trigger: HTMLElement, popup: HTMLElement, preferredPosition?: 'top' | 'bottom' | 'left' | 'right' | 'auto', offset?: number): Point;
/**
 * 对齐到网格
 */
export declare function snapToGrid(value: number, gridSize: number): number;
/**
 * 限制在范围内
 */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * 获取滚动位置
 */
export declare function getScrollPosition(): Point;
/**
 * 设置滚动位置
 */
export declare function setScrollPosition(x: number, y: number): void;
/**
 * 平滑滚动到元素
 */
export declare function smoothScrollTo(element: HTMLElement, options?: ScrollIntoViewOptions): void;
/**
 * 获取视口尺寸
 */
export declare function getViewportSize(): {
    width: number;
    height: number;
};
/**
 * 检查元素是否在视口内
 */
export declare function isInViewport(element: HTMLElement): boolean;
/**
 * 检查元素是否部分在视口内
 */
export declare function isPartiallyInViewport(element: HTMLElement): boolean;
