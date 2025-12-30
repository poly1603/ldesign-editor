/**
 * 手势识别器
 * 识别和处理各种触摸手势
 */
import { EventEmitter } from '../../core/EventEmitter';
export interface Touch {
    identifier: number;
    pageX: number;
    pageY: number;
    clientX: number;
    clientY: number;
    screenX: number;
    screenY: number;
    target: EventTarget;
    timestamp: number;
}
export interface GestureEvent {
    type: string;
    touches: Touch[];
    center: {
        x: number;
        y: number;
    };
    deltaX: number;
    deltaY: number;
    deltaTime: number;
    distance: number;
    angle: number;
    velocity: {
        x: number;
        y: number;
    };
    scale: number;
    rotation: number;
    target: EventTarget;
    preventDefault: () => void;
}
export interface GestureRecognizerOptions {
    /** 触摸开始延迟（ms） */
    touchStartDelay?: number;
    /** 长按阈值（ms） */
    longPressThreshold?: number;
    /** 双击间隔（ms） */
    doubleTapInterval?: number;
    /** 滑动阈值（px） */
    swipeThreshold?: number;
    /** 捏合阈值 */
    pinchThreshold?: number;
    /** 是否阻止默认行为 */
    preventDefault?: boolean;
    /** 是否停止事件传播 */
    stopPropagation?: boolean;
}
export declare class GestureRecognizer extends EventEmitter {
    private element;
    private options;
    private touches;
    private isGesturing;
    private lastTapTime;
    private lastTapX;
    private lastTapY;
    private longPressTimer?;
    private initialDistance;
    private initialAngle;
    private gestureStartTime;
    constructor(element: HTMLElement, options?: GestureRecognizerOptions);
    /**
     * 设置事件监听器
     */
    private setupEventListeners;
    /**
     * 处理触摸开始
     */
    private handleTouchStart;
    /**
     * 处理触摸移动
     */
    private handleTouchMove;
    /**
     * 处理触摸结束
     */
    private handleTouchEnd;
    /**
     * 处理触摸取消
     */
    private handleTouchCancel;
    /**
     * 创建手势事件
     */
    private createGestureEvent;
    /**
     * 获取两点间距离
     */
    private getDistance;
    /**
     * 获取两点间角度
     */
    private getAngle;
    /**
     * 获取触摸点中心
     */
    private getCenter;
    /**
     * 获取滑动方向
     */
    private getSwipeDirection;
    /**
     * 销毁手势识别器
     */
    destroy(): void;
}
//# sourceMappingURL=GestureRecognizer.d.ts.map