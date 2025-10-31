/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

/**
 * 事件处理工具函数
 */
/**
 * 绑定事件（返回解绑函数）
 */
/**
 * 增强的事件发射器（支持泛型）
 */
class EventEmitter {
    constructor() {
        this.events = new Map();
    }
    on(event, handler) {
        if (!this.events.has(event))
            this.events.set(event, new Set());
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
                }
                catch (error) {
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

exports.EventEmitter = EventEmitter;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=event.cjs.map
