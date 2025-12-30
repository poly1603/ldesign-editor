/**
 * 移动端编辑器适配器
 * 为编辑器添加移动端特定功能和优化
 */
import type { Editor } from '../core/Editor';
export interface MobileEditorOptions {
    /** 是否启用手势 */
    enableGestures?: boolean;
    /** 是否启用滑动菜单 */
    enableSwipeMenu?: boolean;
    /** 是否启用长按菜单 */
    enableContextMenu?: boolean;
    /** 是否启用移动端工具栏 */
    enableMobileToolbar?: boolean;
    /** 最小缩放比例 */
    minZoom?: number;
    /** 最大缩放比例 */
    maxZoom?: number;
    /** 初始缩放比例 */
    initialZoom?: number;
    /** 是否启用惯性滚动 */
    enableMomentum?: boolean;
    /** 是否启用橡皮筋效果 */
    enableBounce?: boolean;
}
export declare class MobileEditorAdapter {
    private editor;
    private options;
    private gestureRecognizer?;
    private swipeMenu?;
    private contextMenu?;
    private mobileToolbar?;
    private currentZoom;
    private currentPanX;
    private currentPanY;
    private isPinching;
    private isPanning;
    private editorContainer;
    private contentWrapper;
    private viewportMeta?;
    constructor(editor: Editor, options?: MobileEditorOptions);
    /**
     * 初始化移动端适配
     */
    private initialize;
    /**
     * 创建内容包装器
     */
    private createContentWrapper;
    /**
     * 设置viewport
     */
    private setupViewport;
    /**
     * 应用移动端样式
     */
    private applyMobileStyles;
    /**
     * 初始化手势识别
     */
    private initializeGestures;
    /**
     * 处理双指缩放
     */
    private handlePinch;
    /**
     * 处理双击缩放
     */
    private handleDoubleTap;
    /**
     * 处理拖动
     */
    private handlePan;
    /**
     * 处理长按
     */
    private handleLongPress;
    /**
     * 获取上下文菜单项
     */
    private getContextMenuItems;
    /**
     * 初始化滑动菜单
     */
    private initializeSwipeMenu;
    /**
     * 初始化长按上下文菜单
     */
    private initializeContextMenu;
    /**
     * 初始化移动端工具栏
     */
    private initializeMobileToolbar;
    /**
     * 设置屏幕方向监听
     */
    private setupOrientationListener;
    /**
     * 设置键盘监听
     */
    private setupKeyboardListener;
    /**
     * 设置键盘可见性监听
     */
    private setupKeyboardVisibilityListener;
    /**
     * 键盘显示时的处理
     */
    private onKeyboardShow;
    /**
     * 键盘隐藏时的处理
     */
    private onKeyboardHide;
    /**
     * 更新变换
     */
    private updateTransform;
    /**
     * 动画缩放
     */
    private animateZoom;
    /**
     * 缓动函数
     */
    private easeInOutCubic;
    /**
     * 限制拖动范围
     */
    private constrainPan;
    /**
     * 滚动到光标位置
     */
    private scrollToCursor;
    /**
     * 计算视口指标
     */
    private calculateMetrics;
    private metrics;
    /**
     * 获取屏幕方向
     */
    private getOrientation;
    /**
     * 检查键盘是否可见
     */
    private isKeyboardVisible;
    /**
     * 调整布局以适应方向
     */
    private adjustLayoutForOrientation;
    /**
     * 复制文本
     */
    private copyText;
    /**
     * 剪切文本
     */
    private cutText;
    /**
     * 粘贴文本
     */
    private pasteText;
    /**
     * 全选
     */
    private selectAll;
    /**
     * 显示提示
     */
    private showToast;
    /**
     * 显示文件菜单
     */
    private showFileMenu;
    /**
     * 显示编辑菜单
     */
    private showEditMenu;
    /**
     * 显示插入菜单
     */
    private showInsertMenu;
    /**
     * 显示格式菜单
     */
    private showFormatMenu;
    /**
     * 显示工具菜单
     */
    private showToolsMenu;
    /**
     * 显示设置
     */
    private showSettings;
    /**
     * 检测iOS
     */
    private isIOS;
    /**
     * 检测Android
     */
    private isAndroid;
    /**
     * 销毁适配器
     */
    destroy(): void;
}
//# sourceMappingURL=MobileEditorAdapter.d.ts.map