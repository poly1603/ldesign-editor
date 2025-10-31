/**
 * 事件处理工具函数
 */
/**
 * 绑定事件（返回解绑函数）
 */
export function on(element, event, handler, options) {
    const wrappedHandler = (e) => {
        if (options?.preventDefault)
            e.preventDefault();
        if (options?.stopPropagation)
            e.stopPropagation();
        if (options?.stopImmediatePropagation)
            e.stopImmediatePropagation();
        handler(e);
    };
    element.addEventListener(event, wrappedHandler, options);
    return () => {
        element.removeEventListener(event, wrappedHandler, options);
    };
}
/**
 * 绑定一次性事件
 */
export function once(element, event, handler, options) {
    return on(element, event, handler, { ...options, once: true });
}
/**
 * 解绑事件
 */
export function off(element, event, handler, options) {
    element.removeEventListener(event, handler, options);
}
/**
 * 触发事件
 */
export function trigger(element, event, detail) {
    let evt;
    if (typeof event === 'string') {
        evt = new CustomEvent(event, {
            detail,
            bubbles: true,
            cancelable: true,
        });
    }
    else {
        evt = event;
    }
    return element.dispatchEvent(evt);
}
/**
 * 防抖函数
 */
export function debounce(func, wait, immediate = false) {
    let timeout = null;
    let result;
    const debounced = function (...args) {
        const context = this;
        const later = () => {
            timeout = null;
            if (!immediate)
                result = func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        if (timeout)
            clearTimeout(timeout);
        timeout = window.setTimeout(later, wait);
        if (callNow)
            result = func.apply(context, args);
        return result;
    };
    debounced.cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };
    debounced.flush = () => {
        if (timeout) {
            clearTimeout(timeout);
            func.apply(undefined, []);
            timeout = null;
        }
    };
    return debounced;
}
/**
 * 节流函数
 */
export function throttle(func, wait, options = {}) {
    const { leading = true, trailing = true } = options;
    let timeout = null;
    let context;
    let args;
    let result;
    let previous = 0;
    const later = () => {
        previous = leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout)
            context = args = null;
    };
    const throttled = function (...passedArgs) {
        const now = Date.now();
        if (!previous && leading === false)
            previous = now;
        const remaining = wait - (now - previous);
        context = this;
        args = passedArgs;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout)
                context = args = null;
        }
        else if (!timeout && trailing !== false) {
            timeout = window.setTimeout(later, remaining);
        }
        return result;
    };
    throttled.cancel = () => {
        if (timeout)
            clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };
    return throttled;
}
/**
 * 事件委托
 */
export function delegate(element, selector, event, handler, options) {
    return on(element, event, (e) => {
        const target = e.target;
        const delegateTarget = target.closest(selector);
        if (delegateTarget && element.contains(delegateTarget))
            handler(e, delegateTarget);
    }, options);
}
/**
 * 停止事件传播
 */
export function stop(e) {
    e.preventDefault();
    e.stopPropagation();
}
/**
 * 阻止默认行为
 */
export function prevent(e) {
    e.preventDefault();
}
/**
 * 获取键盘事件的按键
 */
export function getKey(e) {
    return e.key || e.keyCode.toString();
}
/**
 * 检查是否按下修饰键
 */
export function hasModifier(e) {
    return e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
}
/**
 * 检查是否按下特定修饰键组合
 */
export function checkModifiers(e, modifiers) {
    const { ctrl = false, meta = false, alt = false, shift = false } = modifiers;
    return (e.ctrlKey === ctrl
        && e.metaKey === meta
        && e.altKey === alt
        && e.shiftKey === shift);
}
/**
 * 创建长按事件
 */
export function onLongPress(element, handler, duration = 500) {
    let timeout = null;
    let startEvent = null;
    const start = (e) => {
        startEvent = e;
        timeout = window.setTimeout(() => {
            handler(startEvent);
            timeout = null;
        }, duration);
    };
    const cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        startEvent = null;
    };
    const offs = [];
    // 鼠标事件
    offs.push(on(element, 'mousedown', start));
    offs.push(on(element, 'mouseup', cancel));
    offs.push(on(element, 'mouseleave', cancel));
    // 触摸事件
    offs.push(on(element, 'touchstart', start));
    offs.push(on(element, 'touchend', cancel));
    offs.push(on(element, 'touchcancel', cancel));
    return () => {
        cancel();
        offs.forEach(off => off());
    };
}
/**
 * 创建拖拽事件
 */
export function onDrag(element, handlers) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    const getPosition = (e) => {
        if ('touches' in e) {
            return {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };
        }
        return {
            x: e.clientX,
            y: e.clientY,
        };
    };
    const handleStart = (e) => {
        isDragging = true;
        const pos = getPosition(e);
        startX = currentX = pos.x;
        startY = currentY = pos.y;
        handlers.onStart?.(e, pos);
    };
    const handleMove = (e) => {
        if (!isDragging)
            return;
        const pos = getPosition(e);
        const delta = {
            x: pos.x - currentX,
            y: pos.y - currentY,
        };
        currentX = pos.x;
        currentY = pos.y;
        handlers.onMove?.(e, pos, delta);
    };
    const handleEnd = (e) => {
        if (!isDragging)
            return;
        isDragging = false;
        const pos = getPosition(e);
        handlers.onEnd?.(e, pos);
    };
    const offs = [];
    // 鼠标事件
    offs.push(on(element, 'mousedown', handleStart));
    offs.push(on(document, 'mousemove', handleMove));
    offs.push(on(document, 'mouseup', handleEnd));
    // 触摸事件
    offs.push(on(element, 'touchstart', handleStart, { passive: false }));
    offs.push(on(document, 'touchmove', handleMove, { passive: false }));
    offs.push(on(document, 'touchend', handleEnd));
    offs.push(on(document, 'touchcancel', handleEnd));
    return () => {
        offs.forEach(off => off());
    };
}
/**
 * 监听元素尺寸变化
 */
export function onResize(element, handler) {
    if (!window.ResizeObserver) {
        console.warn('ResizeObserver is not supported');
        return () => { };
    }
    const observer = new ResizeObserver(handler);
    observer.observe(element);
    return () => {
        observer.disconnect();
    };
}
/**
 * 监听元素可见性变化
 */
export function onVisibilityChange(element, handler, options) {
    if (!window.IntersectionObserver) {
        console.warn('IntersectionObserver is not supported');
        return () => { };
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            handler(entry.isIntersecting, entry);
        });
    }, options);
    observer.observe(element);
    return () => {
        observer.disconnect();
    };
}
/**
 * 等待事件触发
 */
export function waitForEvent(element, event, timeout) {
    return new Promise((resolve, reject) => {
        let timeoutId = null;
        const cleanup = () => {
            if (timeoutId)
                clearTimeout(timeoutId);
            off(element, event, handler);
        };
        const handler = (e) => {
            cleanup();
            resolve(e);
        };
        on(element, event, handler, { once: true });
        if (timeout) {
            timeoutId = window.setTimeout(() => {
                cleanup();
                reject(new Error(`Event "${event}" timeout after ${timeout}ms`));
            }, timeout);
        }
    });
}
/**
 * 增强的事件发射器（支持泛型）
 */
export class EventEmitter {
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
//# sourceMappingURL=event.js.map