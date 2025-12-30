/**
 * 移动端优化
 * 提供移动设备的优化支持
 *
 * 功能:
 * - 触摸手势支持
 * - 虚拟键盘适配
 * - 移动端工具栏
 * - 响应式布局
 * - 性能优化
 *
 * @packageDocumentation
 */
import type { EditorInstance } from '../types';
/**
 * 移动端配置
 */
export interface MobileConfig {
    /** 是否启用触摸手势 */
    enableGestures?: boolean;
    /** 是否使用移动端工具栏 */
    useMobileToolbar?: boolean;
    /** 是否自动适配虚拟键盘 */
    adaptKeyboard?: boolean;
    /** 最小触摸目标大小（px） */
    minTouchTarget?: number;
}
/**
 * 手势类型
 */
export type GestureType = 'tap' | 'double-tap' | 'long-press' | 'swipe' | 'pinch';
/**
 * 手势事件
 */
export interface GestureEvent {
    type: GestureType;
    target: HTMLElement;
    x: number;
    y: number;
    deltaX?: number;
    deltaY?: number;
    scale?: number;
}
/**
 * 移动端管理器
 */
export declare class MobileManager {
    private editor;
    private config;
    private isMobile;
    private keyboardHeight;
    private originalViewportHeight;
    constructor(editor: EditorInstance, config?: MobileConfig);
    /**
     * 检测是否为移动设备
     */
    private detectMobile;
    /**
     * 初始化
     */
    init(): void;
    /**
     * 设置视口
     */
    private setupViewport;
    /**
     * 设置手势支持
     */
    private setupGestures;
    /**
     * 处理手势
     */
    private handleGesture;
    /**
     * 设置虚拟键盘适配
     */
    private setupKeyboardAdaptation;
    /**
     * 处理键盘显示
     */
    private handleKeyboardShow;
    /**
     * 处理键盘隐藏
     */
    private handleKeyboardHide;
    /**
     * 设置移动端工具栏
     */
    private setupMobileToolbar;
    /**
     * 优化触摸目标大小
     */
    private optimizeTouchTargets;
    /**
     * 启用轻量模式（禁用某些功能以提升性能）
     */
    enableLightweightMode(): void;
    /**
     * 检测设备类型
     * @returns 设备类型信息
     */
    getDeviceInfo(): {
        isMobile: boolean;
        isTablet: boolean;
        isPhone: boolean;
        os: string;
        screenSize: {
            width: number;
            height: number;
        };
    };
    /**
     * 清理资源
     */
    destroy(): void;
}
/**
 * 创建移动端插件
 */
export declare function createMobilePlugin(config?: MobileConfig): import("../types").Plugin;
/**
 * 默认导出
 */
export declare const MobilePlugin: import("../types").Plugin;
/**
 * 获取移动端管理器
 * @param editor - 编辑器实例
 * @returns 移动端管理器
 */
export declare function getMobileManager(editor: EditorInstance): MobileManager | null;
//# sourceMappingURL=index.d.ts.map