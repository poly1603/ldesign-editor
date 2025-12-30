/**
 * 控制台标签页
 * 显示日志、错误、警告等信息
 */
import type { Editor } from '../../core/Editor';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LogEntry {
    id: string;
    level: LogLevel;
    message: string;
    details?: any;
    stack?: string;
    timestamp: number;
    source?: string;
    count: number;
}
export declare class ConsoleTab {
    private editor;
    private container?;
    private logs;
    private filters;
    private searchQuery;
    private maxLogs;
    private logContainer?;
    private isActive;
    constructor(options: {
        editor: Editor;
    });
    /**
     * 渲染标签页
     */
    render(): HTMLElement;
    /**
     * 创建工具栏
     */
    private createToolbar;
    /**
     * 创建过滤器
     */
    private createFilters;
    /**
     * 创建搜索框
     */
    private createSearchBox;
    /**
     * 创建日志容器
     */
    private createLogContainer;
    /**
     * 拦截控制台
     */
    private interceptConsole;
    /**
     * 记录日志
     */
    log(level: LogLevel, ...args: any[]): void;
    /**
     * 获取日志来源
     */
    private getSource;
    /**
     * 渲染所有日志
     */
    private renderLogs;
    /**
     * 添加日志条目
     */
    private addLogEntry;
    /**
     * 更新日志条目
     */
    private updateLogEntry;
    /**
     * 格式化详细信息
     */
    private formatDetails;
    /**
     * 转义HTML
     */
    private escapeHtml;
    /**
     * 更新统计信息
     */
    private updateStats;
    /**
     * 清空日志
     */
    clear(): void;
    /**
     * 激活标签页
     */
    activate(): void;
    /**
     * 停用标签页
     */
    deactivate(): void;
    /**
     * 销毁
     */
    destroy(): void;
}
//# sourceMappingURL=ConsoleTab.d.ts.map