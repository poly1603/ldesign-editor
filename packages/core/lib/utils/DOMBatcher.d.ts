/**
 * DOM批处理工具
 * 优化DOM操作性能，减少重排重绘
 *
 * @packageDocumentation
 */
/** DOM操作类型 */
type DOMOperation = () => void;
/** 批处理配置 */
interface BatcherConfig {
    /** 批处理延迟（毫秒） */
    delay?: number;
    /** 最大批处理大小 */
    maxBatchSize?: number;
    /** 是否使用requestAnimationFrame */
    useRAF?: boolean;
}
/**
 * DOM批处理器
 * 将多个DOM操作合并到一个批次中执行，减少重排重绘
 *
 * @example
 * ```typescript
 * const batcher = new DOMBatcher()
 *
 * // 添加多个操作
 * batcher.add(() => element1.style.width = '100px')
 * batcher.add(() => element2.style.height = '200px')
 * batcher.add(() => element3.textContent = 'Text')
 *
 * // 自动批量执行（下一帧）
 * // 或立即执行
 * batcher.flush()
 * ```
 */
export declare class DOMBatcher {
    private readQueue;
    private writeQueue;
    private timer;
    private rafId;
    private config;
    constructor(config?: BatcherConfig);
    /**
     * 添加读操作（如getBoundingClientRect）
     * @param operation - DOM读操作
     */
    read(operation: DOMOperation): void;
    /**
     * 添加写操作（如修改样式）
     * @param operation - DOM写操作
     */
    write(operation: DOMOperation): void;
    /**
     * 添加操作（自动归类为写操作）
     * @param operation - DOM操作
     */
    add(operation: DOMOperation): void;
    /**
     * 调度执行
     */
    private schedule;
    /**
     * 立即执行所有批处理操作
     * 读操作优先于写操作（避免强制同步布局）
     */
    flush(): void;
    /**
     * 清空所有队列
     */
    clear(): void;
    /**
     * 获取队列大小
     * @returns 队列信息
     */
    getQueueSize(): {
        reads: number;
        writes: number;
        total: number;
    };
}
/**
 * 批量执行DOM操作
 * 使用DocumentFragment来减少重排
 *
 * @param parent - 父元素
 * @param operations - 操作函数数组
 *
 * @example
 * ```typescript
 * batchDOMOperations(container, [
 *   (fragment) => {
 *     const div = document.createElement('div')
 *     div.textContent = 'Item 1'
 *     fragment.appendChild(div)
 *   },
 *   (fragment) => {
 *     const div = document.createElement('div')
 *     div.textContent = 'Item 2'
 *     fragment.appendChild(div)
 *   }
 * ])
 * ```
 */
export declare function batchDOMOperations(parent: HTMLElement, operations: ((fragment: DocumentFragment) => void)[]): void;
/**
 * 测量DOM操作的性能影响
 *
 * @param operation - DOM操作
 * @param label - 操作标签
 * @returns 操作结果
 *
 * @example
 * ```typescript
 * const result = measureDOM(() => {
 *   element.style.width = '100px'
 *   return element.offsetWidth
 * }, 'Resize')
 * // 输出: [DOM] Resize: 2.5ms, reflow: true
 * ```
 */
export declare function measureDOM<T>(operation: () => T, label?: string): T;
/**
 * 防止布局抖动的辅助函数
 * 确保先读后写
 *
 * @param reads - 读操作数组
 * @param writes - 写操作数组
 *
 * @example
 * ```typescript
 * avoidLayoutThrashing(
 *   // 先读
 *   [
 *     () => element1.offsetWidth,
 *     () => element2.offsetHeight
 *   ],
 *   // 后写
 *   [
 *     () => element1.style.width = '100px',
 *     () => element2.style.height = '200px'
 *   ]
 * )
 * ```
 */
export declare function avoidLayoutThrashing(reads: (() => void)[], writes: (() => void)[]): void;
/**
 * 获取全局DOM批处理器
 * @returns 全局批处理器实例
 */
export declare function getDOMBatcher(): DOMBatcher;
/**
 * 重置全局批处理器
 */
export declare function resetDOMBatcher(): void;
/**
 * 批量读取DOM属性
 * @param operations - 读操作数组
 * @returns 结果数组
 */
export declare function batchRead<T>(operations: (() => T)[]): T[];
/**
 * 批量写入DOM
 * @param operations - 写操作数组
 */
export declare function batchWrite(operations: (() => void)[]): void;
export {};
//# sourceMappingURL=DOMBatcher.d.ts.map