/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class EventEmitter {
  constructor() {
    this.events = /* @__PURE__ */ new Map();
  }
  on(event, handler) {
    if (!this.events.has(event))
      this.events.set(event, /* @__PURE__ */ new Set());
    this.events.get(event).add(handler);
    return () => this.off(event, handler);
  }
  once(event, handler) {
    const wrappedHandler = (...args) => {
      handler(...args);
      this.off(event, wrappedHandler);
    };
    return this.on(event, wrappedHandler);
  }
  off(event, handler) {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0)
        this.events.delete(event);
    }
  }
  emit(event, ...args) {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(...args);
        } catch (error) {
          console.error(`Error in event handler for "${String(event)}":`, error);
        }
      });
    }
  }
  clear(event) {
    if (event)
      this.events.delete(event);
    else
      this.events.clear();
  }
  listenerCount(event) {
    return this.events.get(event)?.size || 0;
  }
}

export { EventEmitter };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=event.js.map
