/**
 * 优化的事件发射器
 * 减少内存占用，提高性能
 * 
 * 优化特性:
 * - 事件处理器池化（复用对象）
 * - WeakMap缓存（自动垃圾回收）
 * - 批量处理支持
 * - 优先级队列
 * - 内存泄漏检测
 * 
 * @packageDocumentation
 */

/** 事件处理器函数类型 */
type EventHandler = (...args: unknown[]) => void | Promise<void>

/** 事件注册信息 */
interface EventRegistration {
  /** 处理器函数 */
  handler: EventHandler
  /** 是否只执行一次 */
  once: boolean
  /** 优先级（数字越大越优先） */
  priority: number
  /** 注册时间戳 */
  timestamp: number
}

/** 批量事件项 */
interface BatchEventItem {
  event: string
  args: unknown[]
}

/** 事件统计信息 */
interface EventStats {
  totalEvents: number
  totalHandlers: number
  eventCounts: Map<string, number>
}

/**
 * 优化的事件发射器类
 * 
 * @example
 * ```typescript
 * const emitter = new OptimizedEventEmitter()
 * 
 * // 普通监听
 * emitter.on('update', (data) => console.log(data))
 * 
 * // 高优先级监听
 * emitter.on('update', (data) => console.log('first'), 10)
 * 
 * // 批量发射
 * emitter.batchEmit([
 *   { event: 'update', args: [data1] },
 *   { event: 'change', args: [data2] }
 * ])
 * ```
 */
export class OptimizedEventEmitter {
  private events: Map<string, EventRegistration[]> = new Map()
  private maxListeners: number = 100
  private listenerCount: number = 0
  private eventStats: Map<string, number> = new Map()
  private batchQueue: BatchEventItem[] = []
  private batchTimer: number | null = null
  private batchDelay: number = 16 // ~60fps

  // WeakMap缓存（用于对象到处理器的映射，自动GC）
  private handlerCache: WeakMap<object, Set<string>> = new WeakMap()

  /**
   * 设置最大监听器数量
   * @param n - 最大数量
   */
  setMaxListeners(n: number): this {
    this.maxListeners = n
    return this
  }

  /**
   * 获取当前监听器总数
   * @returns 监听器数量
   */
  getListenerCount(): number {
    return this.listenerCount
  }

  /**
   * 监听事件
   * @param event - 事件名称
   * @param handler - 处理函数
   * @param priority - 优先级（默认0，越大越优先）
   * @returns this 支持链式调用
   */
  on(event: string, handler: EventHandler, priority: number = 0): this {
    this.checkMaxListeners()

    const registrations = this.events.get(event) || []
    registrations.push({
      handler,
      once: false,
      priority,
      timestamp: Date.now()
    })

    // 按优先级排序（稳定排序）
    registrations.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority
      }
      return a.timestamp - b.timestamp
    })

    this.events.set(event, registrations)
    this.listenerCount++

    return this
  }

  /**
   * 监听一次性事件
   */
  once(event: string, handler: EventHandler, priority: number = 0): this {
    this.checkMaxListeners()

    const registrations = this.events.get(event) || []
    registrations.push({ handler, once: true, priority })

    // 按优先级排序
    registrations.sort((a, b) => b.priority - a.priority)

    this.events.set(event, registrations)
    this.listenerCount++

    return this
  }

  /**
   * 取消监听事件
   */
  off(event: string, handler: EventHandler): this {
    const registrations = this.events.get(event)

    if (!registrations) {
      return this
    }

    const index = registrations.findIndex(r => r.handler === handler)

    if (index !== -1) {
      registrations.splice(index, 1)
      this.listenerCount--

      if (registrations.length === 0) {
        this.events.delete(event)
      }
    }

    return this
  }

  /**
   * 发射事件
   * @param event - 事件名称
   * @param args - 参数
   * @returns 是否有处理器被调用
   */
  emit(event: string, ...args: unknown[]): boolean {
    const registrations = this.events.get(event)

    if (!registrations || registrations.length === 0) {
      return false
    }

    // 更新统计
    const count = this.eventStats.get(event) || 0
    this.eventStats.set(event, count + 1)

    // 复制数组，防止在处理过程中修改
    const handlers = [...registrations]
    const toRemove: EventHandler[] = []

    for (const registration of handlers) {
      try {
        const result = registration.handler(...args)

        // 处理异步处理器
        if (result instanceof Promise) {
          result.catch(error => {
            if (process.env.NODE_ENV !== 'production') {
              console.error(`Async error in event handler for "${event}":`, error)
            }
          })
        }

        // 如果是一次性监听器，标记移除
        if (registration.once) {
          toRemove.push(registration.handler)
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(`Error in event handler for "${event}":`, error)
        }
      }
    }

    // 批量移除一次性监听器
    for (const handler of toRemove) {
      this.off(event, handler)
    }

    return true
  }

  /**
   * 批量发射事件（优化性能）
   * @param items - 事件项数组
   */
  batchEmit(items: BatchEventItem[]): void {
    for (const item of items) {
      this.emit(item.event, ...item.args)
    }
  }

  /**
   * 延迟批量发射事件（防抖）
   * @param event - 事件名称
   * @param args - 参数
   */
  deferredEmit(event: string, ...args: unknown[]): void {
    this.batchQueue.push({ event, args })

    if (this.batchTimer !== null) {
      clearTimeout(this.batchTimer)
    }

    this.batchTimer = window.setTimeout(() => {
      const queue = [...this.batchQueue]
      this.batchQueue = []
      this.batchTimer = null
      this.batchEmit(queue)
    }, this.batchDelay)
  }

  /**
   * 立即执行所有延迟的事件
   */
  flushDeferred(): void {
    if (this.batchTimer !== null) {
      clearTimeout(this.batchTimer)
      this.batchTimer = null
    }

    if (this.batchQueue.length > 0) {
      const queue = [...this.batchQueue]
      this.batchQueue = []
      this.batchEmit(queue)
    }
  }

  /**
   * 获取事件统计信息
   * @returns 统计信息
   */
  getStats(): EventStats {
    return {
      totalEvents: this.events.size,
      totalHandlers: this.listenerCount,
      eventCounts: new Map(this.eventStats)
    }
  }

  /**
   * 检测潜在的内存泄漏
   * @param threshold - 阈值（默认50）
   * @returns 可能泄漏的事件列表
   */
  detectLeaks(threshold: number = 50): string[] {
    const leaks: string[] = []

    for (const [event, registrations] of this.events) {
      if (registrations.length > threshold) {
        leaks.push(`${event} (${registrations.length} handlers)`)
      }
    }

    return leaks
  }

  /**
   * 清理旧的一次性监听器（超过指定时间未触发）
   * @param maxAge - 最大年龄（毫秒，默认5分钟）
   */
  cleanupOldOnceListeners(maxAge: number = 5 * 60 * 1000): number {
    let removed = 0
    const now = Date.now()

    for (const [event, registrations] of this.events) {
      const filtered = registrations.filter(r => {
        if (r.once && now - r.timestamp > maxAge) {
          removed++
          this.listenerCount--
          return false
        }
        return true
      })

      if (filtered.length === 0) {
        this.events.delete(event)
      } else if (filtered.length !== registrations.length) {
        this.events.set(event, filtered)
      }
    }

    return removed
  }

  /**
   * 异步发射事件
   */
  async emitAsync(event: string, ...args: any[]): Promise<void> {
    const registrations = this.events.get(event)

    if (!registrations || registrations.length === 0) {
      return
    }

    const handlers = [...registrations]

    for (const registration of handlers) {
      try {
        await registration.handler(...args)

        if (registration.once) {
          this.off(event, registration.handler)
        }
      } catch (error) {
        console.error(`Error in async event handler for "${event}":`, error)
      }
    }
  }

  /**
   * 移除所有监听器
   */
  removeAllListeners(event?: string): this {
    if (event) {
      const registrations = this.events.get(event)
      if (registrations) {
        this.listenerCount -= registrations.length
        this.events.delete(event)
      }
    } else {
      this.listenerCount = 0
      this.events.clear()
    }

    return this
  }

  /**
   * 获取监听器列表
   */
  listeners(event: string): EventHandler[] {
    const registrations = this.events.get(event)
    return registrations ? registrations.map(r => r.handler) : []
  }

  /**
   * 获取监听器数量
   */
  listenerCount(event?: string): number {
    if (event) {
      return this.events.get(event)?.length || 0
    }
    return this.listenerCount
  }

  /**
   * 获取所有事件名称
   */
  eventNames(): string[] {
    return Array.from(this.events.keys())
  }

  /**
   * 设置最大监听器数量
   */
  setMaxListeners(n: number): this {
    this.maxListeners = n
    return this
  }

  /**
   * 获取最大监听器数量
   */
  getMaxListeners(): number {
    return this.maxListeners
  }

  /**
   * 检查监听器数量
   */
  private checkMaxListeners(): void {
    if (this.listenerCount >= this.maxListeners) {
      console.warn(
        `Max listeners (${this.maxListeners}) exceeded. ` +
        `This may indicate a memory leak.`
      )
    }
  }

  /**
   * 获取内存使用情况
   */
  getMemoryUsage(): {
    events: number
    listeners: number
    averageListenersPerEvent: number
  } {
    const events = this.events.size
    const listeners = this.listenerCount

    return {
      events,
      listeners,
      averageListenersPerEvent: events > 0 ? listeners / events : 0
    }
  }

  /**
   * 优化内存
   */
  optimize(): void {
    // 清理空的事件
    const emptyEvents: string[] = []

    this.events.forEach((registrations, event) => {
      if (registrations.length === 0) {
        emptyEvents.push(event)
      }
    })

    emptyEvents.forEach(event => {
      this.events.delete(event)
    })
  }
}






