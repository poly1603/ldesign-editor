/**
 * 编辑器虚拟滚动适配器
 * 专门为富文本编辑器优化的虚拟滚动实现
 */
import type { Editor } from './Editor';
export interface EditorLine {
    id: string;
    lineNumber: number;
    content: string;
    height?: number;
    isDirty?: boolean;
    syntaxTokens?: any[];
}
export interface EditorVirtualScrollerOptions {
    editor: Editor;
    lineHeight?: number;
    maxLines?: number;
    enableSyntaxHighlight?: boolean;
    enableLineNumbers?: boolean;
    enableWordWrap?: boolean;
}
export declare class EditorVirtualScroller {
    private virtualScroller;
    private editor;
    private lines;
    private lineCache;
    private syntaxWorker?;
    private options;
    private performanceMonitor;
    private renderTimer;
    private isDirty;
    constructor(options: EditorVirtualScrollerOptions);
    /**
     * 设置编辑器内容
     */
    setContent(content: string): void;
    /**
     * 更新指定行
     */
    updateLine(lineNumber: number, content: string): void;
    /**
     * 插入行
     */
    insertLines(lineNumber: number, contents: string[]): void;
    /**
     * 删除行
     */
    deleteLines(startLine: number, count: number): void;
    /**
     * 滚动到指定行
     */
    scrollToLine(lineNumber: number, position?: 'start' | 'center' | 'end'): void;
    /**
     * 获取可见行范围
     */
    getVisibleLineRange(): {
        start: number;
        end: number;
    };
    /**
     * 销毁
     */
    destroy(): void;
    private createContainer;
    private parseContent;
    private estimateLineHeight;
    private renderLine;
    private createLineElement;
    private applySyntaxHighlight;
    private escapeHtml;
    private setupEventListeners;
    private scheduleRender;
    private updateDirtyLines;
    private initializeSyntaxWorker;
    private requestSyntaxHighlight;
    /**
     * 获取性能指标
     */
    getPerformanceMetrics(): {
        totalLines: number;
        cachedLines: number;
        visibleRange: {
            start: number;
            end: number;
        };
        totalItems: number;
        renderedItems: number;
        cachedNodes: number;
        memoryUsage: number;
    };
}
//# sourceMappingURL=EditorVirtualScroller.d.ts.map