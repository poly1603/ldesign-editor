/**
 * 可视化调试面板
 * 提供实时性能监控、内存分析、插件调试等功能
 */
import type { Editor } from '../core/Editor';
import { EventEmitter } from '../core/EventEmitter';
export interface DebugPanelOptions {
    /** 编辑器实例 */
    editor: Editor;
    /** 是否默认展开 */
    expanded?: boolean;
    /** 初始标签页 */
    initialTab?: TabName;
    /** 主题 */
    theme?: 'light' | 'dark' | 'auto';
    /** 位置 */
    position?: 'bottom' | 'right' | 'floating';
    /** 高度/宽度（像素或百分比） */
    size?: string;
    /** 是否可调整大小 */
    resizable?: boolean;
    /** 是否显示在生产环境 */
    showInProduction?: boolean;
}
export type TabName = 'performance' | 'memory' | 'network' | 'plugins' | 'console' | 'dom' | 'history' | 'config';
export interface TabDefinition {
    name: TabName;
    label: string;
    icon: string;
    component: any;
    badge?: string | number;
}
export declare class DebugPanel extends EventEmitter {
    private editor;
    private options;
    private container?;
    private panel?;
    private tabsContainer?;
    private contentContainer?;
    private tabs;
    private activeTab?;
    private isExpanded;
    private isDragging;
    private performanceMonitor;
    /** 标签页定义 */
    private tabDefinitions;
    constructor(options: DebugPanelOptions);
    /**
     * 初始化调试面板
     */
    private initialize;
    /**
     * 创建容器DOM
     */
    private createContainer;
    /**
     * 创建头部
     */
    private createHeader;
    /**
     * 渲染标签页按钮
     */
    private renderTabs;
    /**
     * 初始化标签页
     */
    private initializeTabs;
    /**
     * 切换标签页
     */
    switchTab(name: TabName): void;
    /**
     * 设置事件监听
     */
    private setupEventListeners;
    /**
     * 设置快捷键
     */
    private setupHotkeys;
    /**
     * 开始监控
     */
    private startMonitoring;
    /**
     * 拦截网络请求
     */
    private interceptNetworkRequests;
    /**
     * 日志方法
     */
    logError(error: Error | string): void;
    logWarning(message: string): void;
    logInfo(message: string): void;
    logDebug(message: string): void;
    /**
     * 更新标签页徽章
     */
    updateBadge(tab: TabName, increment?: number): void;
    /**
     * 使头部可拖动（浮动模式）
     */
    private makeHeaderDraggable;
    /**
     * 切换展开/折叠
     */
    toggle(): void;
    /**
     * 展开面板
     */
    expand(): void;
    /**
     * 折叠面板
     */
    collapse(): void;
    /**
     * 关闭面板
     */
    close(): void;
    /**
     * 应用主题
     */
    private applyTheme;
    /**
     * 获取容器样式
     */
    private getContainerStyles;
    /**
     * 获取面板样式
     */
    private getPanelStyles;
    /**
     * 获取标签栏样式
     */
    private getTabsStyles;
    /**
     * 获取内容区样式
     */
    private getContentStyles;
    /**
     * 销毁面板
     */
    destroy(): void;
}
