/**
 * 增量渲染引擎
 * 实现细粒度的DOM更新，最小化重绘和重排
 */
export interface DOMPatch {
    type: 'insert' | 'update' | 'remove' | 'move' | 'attributes' | 'text';
    target?: Element | Text;
    parent?: Element;
    newNode?: Node;
    oldValue?: any;
    newValue?: any;
    index?: number;
    attributes?: Record<string, string | null>;
}
export interface RenderOptions {
    /** 批处理延迟（ms） */
    batchDelay?: number;
    /** 最大批处理大小 */
    maxBatchSize?: number;
    /** 是否启用RAF调度 */
    useRAF?: boolean;
    /** 是否启用Web Worker */
    useWorker?: boolean;
    /** 是否启用虚拟DOM */
    useVirtualDOM?: boolean;
}
interface VNode {
    type: string;
    props: Record<string, any>;
    children: (VNode | string)[];
    key?: string | number;
}
export declare class IncrementalRenderer {
    private options;
    private patchQueue;
    private renderTimer;
    private isRendering;
    private performanceMonitor;
    private mutationObserver?;
    private intersectionObserver?;
    private resizeObserver?;
    private worker?;
    private frameId?;
    private lastRenderTime;
    private renderStats;
    constructor(options?: RenderOptions);
    /**
     * 添加补丁到队列
     */
    queuePatch(patch: DOMPatch): void;
    /**
     * 批量添加补丁
     */
    queuePatches(patches: DOMPatch[]): void;
    /**
     * 立即执行所有补丁
     */
    flush(): void;
    /**
     * 清空补丁队列
     */
    clear(): void;
    /**
     * 销毁渲染器
     */
    destroy(): void;
    /**
     * 调度渲染
     */
    private scheduleRender;
    /**
     * 取消调度的渲染
     */
    private cancelScheduledRender;
    /**
     * 处理批次
     */
    private processBatch;
    /**
     * 优化补丁
     */
    private optimizePatches;
    /**
     * 合并补丁
     */
    private mergePatches;
    /**
     * 应用补丁
     */
    private applyPatches;
    /**
     * 更新属性
     */
    private updateAttributes;
    /**
     * 设置Worker
     */
    private setupWorker;
    /**
     * 在Worker中应用补丁
     */
    private applyPatchesInWorker;
    /**
     * 设置观察器
     */
    private setupObservers;
    /**
     * 开始观察元素
     */
    observeElement(element: Element): void;
    /**
     * 停止观察元素
     */
    unobserveElement(element: Element): void;
    /**
     * 更新统计信息
     */
    private updateStats;
    /**
     * 获取渲染统计
     */
    getStats(): {
        queueSize: number;
        isRendering: boolean;
        totalPatches: number;
        batchCount: number;
        averageBatchSize: number;
        totalRenderTime: number;
    };
    /**
     * 创建虚拟节点（用于虚拟DOM模式）
     */
    createVNode(type: string, props?: Record<string, any>, children?: (VNode | string)[]): VNode;
    /**
     * 比较虚拟节点并生成补丁
     */
    diff(oldVNode: VNode | null, newVNode: VNode | null): DOMPatch[];
    /**
     * 比较属性
     */
    private diffProps;
    /**
     * 比较子节点
     */
    private diffChildren;
    /**
     * 从虚拟节点创建DOM
     */
    private createDOMFromVNode;
}
export {};
