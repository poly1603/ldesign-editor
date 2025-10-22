/**
 * DOM批处理工具
 * 优化DOM操作性能，减少重排重绘
 * 
 * @packageDocumentation
 */

/** DOM操作类型 */
type DOMOperation = () => void

/** 批处理配置 */
interface BatcherConfig {
  /** 批处理延迟（毫秒） */
  delay?: number
  /** 最大批处理大小 */
  maxBatchSize?: number
  /** 是否使用requestAnimationFrame */
  useRAF?: boolean
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
export class DOMBatcher {
  private readQueue: DOMOperation[] = []
  private writeQueue: DOMOperation[] = []
  private timer: number | null = null
  private rafId: number | null = null
  private config: Required<BatcherConfig>

  constructor(config: BatcherConfig = {}) {
    this.config = {
      delay: 16, // ~60fps
      maxBatchSize: 100,
      useRAF: true,
      ...config
    }
  }

  /**
   * 添加读操作（如getBoundingClientRect）
   * @param operation - DOM读操作
   */
  read(operation: DOMOperation): void {
    this.readQueue.push(operation)
    this.schedule()
  }

  /**
   * 添加写操作（如修改样式）
   * @param operation - DOM写操作
   */
  write(operation: DOMOperation): void {
    this.writeQueue.push(operation)
    this.schedule()
  }

  /**
   * 添加操作（自动归类为写操作）
   * @param operation - DOM操作
   */
  add(operation: DOMOperation): void {
    this.write(operation)
  }

  /**
   * 调度执行
   */
  private schedule(): void {
    if (this.timer !== null || this.rafId !== null) {
      return
    }

    if (this.config.useRAF) {
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null
        this.flush()
      })
    } else {
      this.timer = window.setTimeout(() => {
        this.timer = null
        this.flush()
      }, this.config.delay)
    }
  }

  /**
   * 立即执行所有批处理操作
   * 读操作优先于写操作（避免强制同步布局）
   */
  flush(): void {
    // 取消调度
    if (this.timer !== null) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }

    // 先执行所有读操作
    const reads = this.readQueue.splice(0)
    for (const operation of reads) {
      try {
        operation()
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[DOMBatcher] Read operation error:', error)
        }
      }
    }

    // 再执行所有写操作
    const writes = this.writeQueue.splice(0)
    for (const operation of writes) {
      try {
        operation()
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[DOMBatcher] Write operation error:', error)
        }
      }
    }
  }

  /**
   * 清空所有队列
   */
  clear(): void {
    this.readQueue = []
    this.writeQueue = []

    if (this.timer !== null) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  /**
   * 获取队列大小
   * @returns 队列信息
   */
  getQueueSize(): { reads: number; writes: number; total: number } {
    return {
      reads: this.readQueue.length,
      writes: this.writeQueue.length,
      total: this.readQueue.length + this.writeQueue.length
    }
  }
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
export function batchDOMOperations(
  parent: HTMLElement,
  operations: ((fragment: DocumentFragment) => void)[]
): void {
  const fragment = document.createDocumentFragment()

  for (const operation of operations) {
    try {
      operation(fragment)
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[batchDOMOperations] Operation error:', error)
      }
    }
  }

  parent.appendChild(fragment)
}

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
export function measureDOM<T>(operation: () => T, label: string = 'DOM Operation'): T {
  if (process.env.NODE_ENV !== 'production') {
    const start = performance.now()
    const result = operation()
    const duration = performance.now() - start

    // 检测是否触发了重排
    const hasReflow = duration > 10

    console.log(`[DOM] ${label}: ${duration.toFixed(2)}ms${hasReflow ? ', reflow detected!' : ''}`)

    return result
  }

  return operation()
}

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
export function avoidLayoutThrashing(
  reads: (() => void)[],
  writes: (() => void)[]
): void {
  // 先执行所有读操作
  for (const read of reads) {
    try {
      read()
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[avoidLayoutThrashing] Read error:', error)
      }
    }
  }

  // 再执行所有写操作
  for (const write of writes) {
    try {
      write()
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[avoidLayoutThrashing] Write error:', error)
      }
    }
  }
}

// ============================================================================
// 全局实例
// ============================================================================

let globalBatcher: DOMBatcher | null = null

/**
 * 获取全局DOM批处理器
 * @returns 全局批处理器实例
 */
export function getDOMBatcher(): DOMBatcher {
  if (!globalBatcher) {
    globalBatcher = new DOMBatcher()
  }
  return globalBatcher
}

/**
 * 重置全局批处理器
 */
export function resetDOMBatcher(): void {
  if (globalBatcher) {
    globalBatcher.clear()
    globalBatcher = null
  }
}

// ============================================================================
// 便捷函数
// ============================================================================

/**
 * 批量读取DOM属性
 * @param operations - 读操作数组
 * @returns 结果数组
 */
export function batchRead<T>(operations: (() => T)[]): T[] {
  const batcher = getDOMBatcher()
  const results: T[] = []

  operations.forEach((op, index) => {
    batcher.read(() => {
      results[index] = op()
    })
  })

  batcher.flush()
  return results
}

/**
 * 批量写入DOM
 * @param operations - 写操作数组
 */
export function batchWrite(operations: (() => void)[]): void {
  const batcher = getDOMBatcher()

  operations.forEach(op => {
    batcher.write(op)
  })

  batcher.flush()
}


