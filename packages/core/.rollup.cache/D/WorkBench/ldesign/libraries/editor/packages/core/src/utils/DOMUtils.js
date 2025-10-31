/**
 * DOM 操作工具函数
 * 统一管理DOM相关操作，避免重复代码
 */
/**
 * 创建元素并设置属性
 */
export function createElement(tag, attrs, ...children) {
    const element = document.createElement(tag);
    if (attrs) {
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'style') {
                if (typeof value === 'string')
                    element.style.cssText = value;
                else if (typeof value === 'object')
                    Object.assign(element.style, value);
            }
            else if (key === 'className') {
                element.className = value;
            }
            else if (key.startsWith('data-')) {
                element.setAttribute(key, String(value));
            }
            else {
                element[key] = value;
            }
        });
    }
    children.forEach((child) => {
        if (typeof child === 'string')
            element.appendChild(document.createTextNode(child));
        else
            element.appendChild(child);
    });
    return element;
}
/**
 * 查询单个元素
 */
export function $(selector, parent = document) {
    return parent.querySelector(selector);
}
/**
 * 查询多个元素
 */
export function $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}
export function on(element, event, selectorOrHandler, handlerOrOptions) {
    if (typeof selectorOrHandler === 'function') {
        // 直接绑定
        element.addEventListener(event, selectorOrHandler, handlerOrOptions);
        return () => element.removeEventListener(event, selectorOrHandler);
    }
    else {
        // 事件委托
        const selector = selectorOrHandler;
        const handler = handlerOrOptions;
        const delegatedHandler = (e) => {
            const target = e.target;
            const matched = target.closest(selector);
            if (matched && element.contains(matched))
                handler.call(matched, e);
        };
        element.addEventListener(event, delegatedHandler);
        return () => element.removeEventListener(event, delegatedHandler);
    }
}
/**
 * 显示/隐藏元素
 */
export function show(element) {
    element.style.display = '';
}
export function hide(element) {
    element.style.display = 'none';
}
export function toggle(element, force) {
    if (force !== undefined)
        element.style.display = force ? '' : 'none';
    else
        element.style.display = element.style.display === 'none' ? '' : 'none';
}
/**
 * 添加/移除类名
 */
export function addClass(element, ...classNames) {
    element.classList.add(...classNames);
}
export function removeClass(element, ...classNames) {
    element.classList.remove(...classNames);
}
export function toggleClass(element, className, force) {
    element.classList.toggle(className, force);
}
export function hasClass(element, className) {
    return element.classList.contains(className);
}
/**
 * 获取元素位置
 */
export function getPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
    };
}
/**
 * 设置元素位置
 */
export function setPosition(element, position) {
    if (position.top !== undefined)
        element.style.top = `${position.top}px`;
    if (position.left !== undefined)
        element.style.left = `${position.left}px`;
    if (position.right !== undefined)
        element.style.right = `${position.right}px`;
    if (position.bottom !== undefined)
        element.style.bottom = `${position.bottom}px`;
}
/**
 * 移除元素
 */
export function remove(element) {
    element.remove();
}
/**
 * 清空元素内容
 */
export function empty(element) {
    element.innerHTML = '';
}
/**
 * 防抖函数
 */
export function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
/**
 * 节流函数
 */
export function throttle(func, wait) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, wait);
        }
    };
}
/**
 * 等待DOM元素出现
 */
export function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = $(selector);
        if (element)
            return resolve(element);
        const observer = new MutationObserver(() => {
            const element = $(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}
//# sourceMappingURL=DOMUtils.js.map