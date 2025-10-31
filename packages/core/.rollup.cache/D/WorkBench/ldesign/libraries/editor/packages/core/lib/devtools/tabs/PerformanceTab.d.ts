/**
 * 性能监控标签页
 * 实时显示FPS、内存、渲染性能等指标
 */
import type { Editor } from '../../core/Editor';
export interface PerformanceMetrics {
    fps: number;
    memory: {
        used: number;
        total: number;
        limit: number;
    };
    renderTime: number;
    scriptTime: number;
    paintTime: number;
    operations: {
        name: string;
        duration: number;
        timestamp: number;
    }[];
}
export declare class PerformanceTab {
    private editor;
    private container?;
    private performanceMonitor;
    private metrics;
    private charts;
    private isActive;
    private updateInterval?;
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
     * 创建性能概览
     */
    private createOverview;
    /**
     * 创建图表区域
     */
    private createCharts;
    /**
     * 创建单个图表容器
     */
    private createChart;
    /**
     * 初始化图表
     */
    private initializeCharts;
    /**
     * 创建操作历史表格
     */
    private createOperationsTable;
    /**
     * 激活标签页
     */
    activate(): void;
    /**
     * 停用标签页
     */
    deactivate(): void;
    /**
     * 开始更新数据
     */
    private startUpdating;
    /**
     * 停止更新数据
     */
    private stopUpdating;
    /**
     * 更新性能数据
     */
    update(): void;
    /**
     * 更新FPS
     */
    updateFPS(fps: number): void;
    /**
     * 添加性能测量
     */
    addMeasure(measure: PerformanceMeasure): void;
    /**
     * 更新操作历史表格
     */
    private updateOperationsTable;
    /**
     * 更新指标卡片
     */
    private updateMetricCard;
    /**
     * 统计事件监听器数量
     */
    private countEventListeners;
    /**
     * 开始录制
     */
    private startRecording;
    /**
     * 停止录制
     */
    private stopRecording;
    /**
     * 分析录制数据
     */
    private analyzeRecording;
    /**
     * 清空数据
     */
    private clearData;
    /**
     * 导出报告
     */
    private exportReport;
    /**
     * 强制垃圾回收
     */
    private forceGC;
    /**
     * 销毁
     */
    destroy(): void;
}
