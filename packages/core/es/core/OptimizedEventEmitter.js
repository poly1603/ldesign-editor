/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class OptimizedEventEmitter {
  constructor() {
    this.events = /* @__PURE__ */ new Map();
    this.maxListeners = 100;
    this.listenerCount = 0;
    this.eventStats = /* @__PURE__ */ new Map();
    this.batchQueue = [];
    this.batchTimer = null;
    this.batchDelay = 16;
    // ~60fps
    // WeakMap缓存（用于对象到处理器的映射，自动GC）
    this.handlerCache = /* @__PURE__ */ new WeakMap();
  }
  /**
   * 设置最大监听器数量
   * @param n - 最大数量
   */
  setMaxListeners(n) {
    this.maxListeners = n;
    return this;
  }
  /**
   * 获取当前监听器总数
   * @returns 监听器数量
   */
  getListenerCount() {
    return this.listenerCount;
  }
  /**
   * 监听事件
   * @param event - 事件名称
   * @param handler - 处理函数
   * @param priority - 优先级（默认0，越大越优先）
   * @returns this 支持链式调用
   */
  on(event, handler, priority = 0) {
    this.checkMaxListeners();
    const registrations = this.events.get(event) || [];
    registrations.push({
      handler,
      once: false,
      priority,
      timestamp: Date.now()
    });
    registrations.sort((a, b) => {
      if (a.priority !== b.priority)
        return b.priority - a.priority;
      return a.timestamp - b.timestamp;
    });
    this.events.set(event, registrations);
    this.listenerCount++;
    return this;
  }
  /**
   * 监听一次性事件
   */
  once(event, handler, priority = 0) {
    this.checkMaxListeners();
    const registrations = this.events.get(event) || [];
    registrations.push({
      handler,
      once: true,
      priority
    });
    registrations.sort((a, b) => b.priority - a.priority);
    this.events.set(event, registrations);
    this.listenerCount++;
    return this;
  }
  /**
   * 取消监听事件
   */
  off(event, handler) {
    const registrations = this.events.get(event);
    if (!registrations)
      return this;
    const index = registrations.findIndex((r) => r.handler === handler);
    if (index !== -1) {
      registrations.splice(index, 1);
      this.listenerCount--;
      if (registrations.length === 0)
        this.events.delete(event);
    }
    return this;
  }
  /**
   * 发射事件
   * @param event - 事件名称
   * @param args - 参数
   * @returns 是否有处理器被调用
   */
  emit(event, ...args) {
    const registrations = this.events.get(event);
    if (!registrations || registrations.length === 0)
      return false;
    const count = this.eventStats.get(event) || 0;
    this.eventStats.set(event, count + 1);
    const handlers = [...registrations];
    const toRemove = [];
    for (const registration of handlers) {
      try {
        const result = registration.handler(...args);
        if (result instanceof Promise) {
          result.catch((error) => {
            if (process.env.NODE_ENV !== "production")
              console.error(`Async error in event handler for "${event}":`, error);
          });
        }
        if (registration.once)
          toRemove.push(registration.handler);
      } catch (error) {
        if (process.env.NODE_ENV !== "production")
          console.error(`Error in event handler for "${event}":`, error);
      }
    }
    for (const handler of toRemove)
      this.off(event, handler);
    return true;
  }
  /**
   * 批量发射事件（优化性能）
   * @param items - 事件项数组
   */
  batchEmit(items) {
    for (const item of items)
      this.emit(item.event, ...item.args);
  }
  /**
   * 延迟批量发射事件（防抖）
   * @param event - 事件名称
   * @param args - 参数
   */
  deferredEmit(event, ...args) {
    this.batchQueue.push({
      event,
      args
    });
    if (this.batchTimer !== null)
      clearTimeout(this.batchTimer);
    this.batchTimer = window.setTimeout(() => {
      const queue = [...this.batchQueue];
      this.batchQueue = [];
      this.batchTimer = null;
      this.batchEmit(queue);
    }, this.batchDelay);
  }
  /**
   * 立即执行所有延迟的事件
   */
  flushDeferred() {
    if (this.batchTimer !== null) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    if (this.batchQueue.length > 0) {
      const queue = [...this.batchQueue];
      this.batchQueue = [];
      this.batchEmit(queue);
    }
  }
  /**
   * 获取事件统计信息
   * @returns 统计信息
   */
  getStats() {
    return {
      totalEvents: this.events.size,
      totalHandlers: this.listenerCount,
      eventCounts: new Map(this.eventStats)
    };
  }
  /**
   * 检测潜在的内存泄漏
   * @param threshold - 阈值（默认50）
   * @returns 可能泄漏的事件列表
   */
  detectLeaks(threshold = 50) {
    const leaks = [];
    for (const [event, registrations] of this.events) {
      if (registrations.length > threshold)
        leaks.push(`${event} (${registrations.length} handlers)`);
    }
    return leaks;
  }
  /**
   * 清理旧的一次性监听器（超过指定时间未触发）
   * @param maxAge - 最大年龄（毫秒，默认5分钟）
   */
  cleanupOldOnceListeners(maxAge = 5 * 60 * 1e3) {
    let removed = 0;
    const now = Date.now();
    for (const [event, registrations] of this.events) {
      const filtered = registrations.filter((r) => {
        if (r.once && now - r.timestamp > maxAge) {
          removed++;
          this.listenerCount--;
          return false;
        }
        return true;
      });
      if (filtered.length === 0)
        this.events.delete(event);
      else if (filtered.length !== registrations.length)
        this.events.set(event, filtered);
    }
    return removed;
  }
  /**
   * 异步发射事件
   */
  async emitAsync(event, ...args) {
    const registrations = this.events.get(event);
    if (!registrations || registrations.length === 0)
      return;
    const handlers = [...registrations];
    for (const registration of handlers) {
      try {
        await registration.handler(...args);
        if (registration.once)
          this.off(event, registration.handler);
      } catch (error) {
        console.error(`Error in async event handler for "${event}":`, error);
      }
    }
  }
  /**
   * 移除所有监听器
   */
  removeAllListeners(event) {
    if (event) {
      const registrations = this.events.get(event);
      if (registrations) {
        this.listenerCount -= registrations.length;
        this.events.delete(event);
      }
    } else {
      this.listenerCount = 0;
      this.events.clear();
    }
    return this;
  }
  /**
   * 获取监听器列表
   */
  listeners(event) {
    const registrations = this.events.get(event);
    return registrations ? registrations.map((r) => r.handler) : [];
  }
  /**
   * 获取指定事件的监听器数量
   */
  getEventListenerCount(event) {
    return this.events.get(event)?.length || 0;
  }
  /**
   * 获取所有事件名称
   */
  eventNames() {
    return Array.from(this.events.keys());
  }
  /**
   * 获取最大监听器数量
   */
  getMaxListeners() {
    return this.maxListeners;
  }
  /**
   * 检查监听器数量
   */
  checkMaxListeners() {
    if (this.listenerCount >= this.maxListeners) {
      console.warn(`Max listeners (${this.maxListeners}) exceeded. This may indicate a memory leak.`);
    }
  }
  /**
   * 获取内存使用情况
   */
  getMemoryUsage() {
    const events = this.events.size;
    const listeners = this.listenerCount;
    return {
      events,
      listeners,
      averageListenersPerEvent: events > 0 ? listeners / events : 0
    };
  }
  /**
   * 优化内存
   */
  optimize() {
    const emptyEvents = [];
    this.events.forEach((registrations, event) => {
      if (registrations.length === 0)
        emptyEvents.push(event);
    });
    emptyEvents.forEach((event) => {
      this.events.delete(event);
    });
  }
}

export { OptimizedEventEmitter };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=OptimizedEventEmitter.js.map
