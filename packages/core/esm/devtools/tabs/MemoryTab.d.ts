/**
 * 内存分析标签页
 * 监控内存使用、对象分配、垃圾回收等
 */
import type { Editor } from '../../core/Editor';
export interface MemorySnapshot {
    timestamp: number;
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
    objects: ObjectAllocation[];
}
export interface ObjectAllocation {
    type: string;
    count: number;
    size: number;
    retained: number;
}
export declare class MemoryTab {
    private editor;
    private container?;
    private snapshots;
    private currentSnapshot?;
    private isActive;
    private updateInterval?;
    private chart?;
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
     * 创建内存概览
     */
    private createOverview;
    /**
     * 创建内存时间线
     */
    private createTimeline;
    /**
     * 创建对象分配表
     */
    private createAllocationsTable;
    /**
     * 激活标签页
     */
    activate(): void;
    /**
     * 停用标签页
     */
    deactivate(): void;
    /**
     * 初始化图表
     */
    private initializeChart;
    /**
     * 开始更新
     */
    private startUpdating;
    /**
     * 停止更新
     */
    private stopUpdating;
    /**
     * 更新内存信息
     */
    update(): void;
    /**
     * 拍摄内存快照
     */
    private takeSnapshot;
    /**
     * 分析对象分配
     */
    private analyzeObjects;
    /**
     * 估算对象大小
     */
    private estimateObjectSize;
    /**
     * 更新对象分配表
     */
    private updateAllocationsTable;
    /**
     * 比较快照
     */
    private compareSnapshots;
    /**
     * 清空快照
     */
    private clearSnapshots;
    /**
     * 触发垃圾回收
     */
    private triggerGC;
    /**
     * 格式化字节数
     */
    private formatBytes;
    /**
     * 更新元素内容
     */
    private updateElement;
    /**
     * 显示通知
     */
    private showNotification;
    /**
     * 销毁
     */
    destroy(): void;
}
//# sourceMappingURL=MemoryTab.d.ts.map