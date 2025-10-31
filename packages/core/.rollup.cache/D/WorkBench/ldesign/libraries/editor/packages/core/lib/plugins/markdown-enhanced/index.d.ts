/**
 * Markdown增强插件
 * 提供实时预览、Mermaid图表、KaTeX数学公式支持
 *
 * 功能:
 * - Markdown实时预览（Split View）
 * - 语法高亮优化
 * - 快捷输入（##空格自动转标题）
 * - Mermaid图表支持
 * - KaTeX数学公式支持
 *
 * @packageDocumentation
 */
import type { EditorInstance } from '../../types';
/**
 * Markdown预览模式
 */
export type PreviewMode = 'side-by-side' | 'below' | 'tab' | 'none';
/**
 * Markdown增强配置
 */
export interface MarkdownEnhancedConfig {
    /** 预览模式 */
    previewMode?: PreviewMode;
    /** 是否启用Mermaid */
    enableMermaid?: boolean;
    /** 是否启用KaTeX */
    enableKaTeX?: boolean;
    /** 是否启用快捷输入 */
    enableShortcuts?: boolean;
    /** 是否启用语法高亮 */
    enableSyntaxHighlight?: boolean;
}
/**
 * Markdown预览管理器
 */
export declare class MarkdownPreviewManager {
    private editor;
    private previewElement;
    private mode;
    private syncScroll;
    constructor(editor: EditorInstance);
    /**
     * 设置预览模式
     * @param mode - 预览模式
     */
    setMode(mode: PreviewMode): void;
    /**
     * 更新布局
     */
    private updateLayout;
    /**
     * 创建预览元素
     */
    private createPreview;
    /**
     * 设置滚动同步
     */
    private setupScrollSync;
    /**
     * 更新预览内容
     */
    updatePreview(): void;
    /**
     * Markdown转HTML（简化版）
     * 生产环境建议使用marked或markdown-it库
     */
    private markdownToHTML;
    /**
     * 显示预览
     */
    private showPreview;
    /**
     * 隐藏预览
     */
    private hidePreview;
    /**
     * 清理资源
     */
    destroy(): void;
}
/**
 * Markdown快捷输入管理器
 */
export declare class MarkdownShortcutsManager {
    private editor;
    constructor(editor: EditorInstance);
    /**
     * 设置快捷输入
     */
    private setupShortcuts;
    /**
     * 处理输入
     */
    private handleInput;
    /**
     * 检查标题快捷输入（## + 空格）
     */
    private checkHeadingShortcut;
    /**
     * 检查列表快捷输入（- + 空格）
     */
    private checkListShortcut;
    /**
     * 检查代码块快捷输入（``` + 回车）
     */
    private checkCodeBlockShortcut;
    /**
     * 清理资源
     */
    destroy(): void;
}
/**
 * 创建Markdown增强插件
 */
export declare function createMarkdownEnhancedPlugin(config?: MarkdownEnhancedConfig): import("../../types").Plugin;
/**
 * 默认导出
 */
export declare const MarkdownEnhancedPlugin: import("../../types").Plugin;
/**
 * 获取Markdown预览管理器
 * @param editor - 编辑器实例
 * @returns 预览管理器
 */
export declare function getMarkdownPreviewManager(editor: EditorInstance): MarkdownPreviewManager | null;
