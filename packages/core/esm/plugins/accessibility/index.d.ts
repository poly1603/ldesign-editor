/**
 * 无障碍访问（Accessibility）插件
 * 提升编辑器的可访问性
 *
 * 功能:
 * - ARIA标签完善
 * - 键盘导航优化
 * - 屏幕阅读器支持
 * - 高对比度模式
 * - 焦点管理
 *
 * @packageDocumentation
 */
import type { EditorInstance } from '../../types';
/**
 * 无障碍配置
 */
export interface AccessibilityConfig {
    /** 是否启用键盘导航 */
    enableKeyboardNav?: boolean;
    /** 是否启用屏幕阅读器支持 */
    enableScreenReader?: boolean;
    /** 是否启用高对比度模式 */
    enableHighContrast?: boolean;
    /** 自定义ARIA标签 */
    ariaLabels?: Record<string, string>;
}
/**
 * 无障碍管理器
 */
export declare class AccessibilityManager {
    private editor;
    private config;
    private focusableElements;
    private currentFocusIndex;
    constructor(editor: EditorInstance, config?: AccessibilityConfig);
    /**
     * 初始化ARIA标签
     */
    setupARIA(): void;
    /**
     * 设置键盘导航
     */
    setupKeyboardNav(): void;
    /**
     * 收集可聚焦元素
     */
    private collectFocusableElements;
    /**
     * 处理键盘导航
     */
    private handleKeyboardNav;
    /**
     * 聚焦下一个元素
     */
    private focusNext;
    /**
     * 聚焦上一个元素
     */
    private focusPrevious;
    /**
     * 启用高对比度模式
     */
    enableHighContrast(): void;
    /**
     * 禁用高对比度模式
     */
    disableHighContrast(): void;
    /**
     * 切换高对比度模式
     */
    toggleHighContrast(): void;
    /**
     * 宣告内容变化（屏幕阅读器）
     * @param message - 消息内容
     * @param priority - 优先级（polite/assertive）
     */
    announce(message: string, priority?: 'polite' | 'assertive'): void;
    /**
     * 检查无障碍性问题
     * @returns 问题列表
     */
    checkAccessibility(): string[];
    /**
     * 自动修复无障碍性问题
     */
    autoFix(): void;
    /**
     * 清理资源
     */
    destroy(): void;
}
/**
 * 创建无障碍访问插件
 */
export declare function createAccessibilityPlugin(config?: AccessibilityConfig): import("../../types").Plugin;
/**
 * 默认导出
 */
export declare const AccessibilityPlugin: import("../../types").Plugin;
/**
 * 获取无障碍管理器
 * @param editor - 编辑器实例
 * @returns 无障碍管理器
 */
export declare function getAccessibilityManager(editor: EditorInstance): AccessibilityManager | null;
//# sourceMappingURL=index.d.ts.map