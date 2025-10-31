/**
 * 性能分析命令
 * 分析编辑器性能日志，生成可视化报告
 */
interface AnalyzeOptions {
    output?: string;
    format?: 'html' | 'json' | 'text';
    open?: boolean;
    threshold?: string;
}
export declare function analyzePerformance(file: string, options: AnalyzeOptions): Promise<void>;
export {};
