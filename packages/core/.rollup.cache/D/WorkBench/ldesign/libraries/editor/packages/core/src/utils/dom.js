/**
 * DOM 操作工具函数
 */
/**
 * 创建元素
 */
export function createElement(config) {
    const { tag = 'div', className, id, style, attrs, children, html, text, parent, } = config;
    const element = document.createElement(tag);
    if (className)
        element.className = className;
    if (id)
        element.id = id;
    if (style)
        applyStyles(element, style);
    if (attrs) {
        Object.entries(attrs).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
    if (html) {
        element.innerHTML = html;
    }
    else if (text) {
        element.textContent = text;
    }
    else if (children) {
        children.forEach((child) => {
            if (typeof child === 'string')
                element.appendChild(document.createTextNode(child));
            else
                element.appendChild(child);
        });
    }
    if (parent)
        parent.appendChild(element);
    return element;
}
/**
 * 应用样式
 */
export function applyStyles(element, styles) {
    Object.assign(element.style, styles);
}
/**
 * 添加类名
 */
export function addClass(element, ...classNames) {
    element.classList.add(...classNames);
}
/**
 * 移除类名
 */
export function removeClass(element, ...classNames) {
    element.classList.remove(...classNames);
}
/**
 * 切换类名
 */
export function toggleClass(element, className, force) {
    return element.classList.toggle(className, force);
}
/**
 * 检查是否有类名
 */
export function hasClass(element, className) {
    return element.classList.contains(className);
}
/**
 * 移除元素
 */
export function removeElement(element) {
    element.parentNode?.removeChild(element);
}
/**
 * 清空元素内容
 */
export function clearElement(element) {
    element.innerHTML = '';
}
/**
 * 替换元素
 */
export function replaceElement(oldElement, newElement) {
    oldElement.parentNode?.replaceChild(newElement, oldElement);
}
/**
 * 插入元素到指定位置
 */
export function insertElement(element, target, position = 'append') {
    switch (position) {
        case 'before':
            target.parentNode?.insertBefore(element, target);
            break;
        case 'after':
            target.parentNode?.insertBefore(element, target.nextSibling);
            break;
        case 'prepend':
            target.insertBefore(element, target.firstChild);
            break;
        case 'append':
            target.appendChild(element);
            break;
    }
}
/**
 * 查询元素
 */
export function query(selector, parent = document) {
    return parent.querySelector(selector);
}
/**
 * 查询所有元素
 */
export function queryAll(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}
/**
 * 获取元素的最近父元素
 */
export function closest(element, selector) {
    return element.closest(selector);
}
/**
 * 检查元素是否匹配选择器
 */
export function matches(element, selector) {
    return element.matches(selector);
}
/**
 * 获取元素的兄弟元素
 */
export function getSiblings(element) {
    const parent = element.parentNode;
    if (!parent)
        return [];
    return Array.from(parent.children).filter(child => child !== element);
}
/**
 * 获取元素的索引
 */
export function getIndex(element) {
    const parent = element.parentNode;
    if (!parent)
        return -1;
    return Array.from(parent.children).indexOf(element);
}
/**
 * 显示元素
 */
export function show(element) {
    element.style.display = '';
}
/**
 * 隐藏元素
 */
export function hide(element) {
    element.style.display = 'none';
}
/**
 * 切换显示状态
 */
export function toggle(element, force) {
    if (force === undefined)
        element.style.display = element.style.display === 'none' ? '' : 'none';
    else
        element.style.display = force ? '' : 'none';
}
/**
 * 检查元素是否可见
 */
export function isVisible(element) {
    return element.offsetParent !== null && element.style.display !== 'none';
}
/**
 * 获取元素的文本内容
 */
export function getText(element) {
    return element.textContent || '';
}
/**
 * 设置元素的文本内容
 */
export function setText(element, text) {
    element.textContent = text;
}
/**
 * 获取元素的HTML内容
 */
export function getHTML(element) {
    return element.innerHTML;
}
/**
 * 设置元素的HTML内容
 */
export function setHTML(element, html) {
    element.innerHTML = html;
}
/**
 * 获取元素属性
 */
export function getAttr(element, name) {
    return element.getAttribute(name);
}
/**
 * 设置元素属性
 */
export function setAttr(element, name, value) {
    element.setAttribute(name, value);
}
/**
 * 移除元素属性
 */
export function removeAttr(element, name) {
    element.removeAttribute(name);
}
/**
 * 检查元素是否有属性
 */
export function hasAttr(element, name) {
    return element.hasAttribute(name);
}
/**
 * 获取或设置元素数据
 */
export function data(element, key, value) {
    if (value === undefined) {
        const data = element.dataset[key];
        try {
            return JSON.parse(data || '');
        }
        catch {
            return data;
        }
    }
    else {
        element.dataset[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }
}
/**
 * 包装元素
 */
export function wrap(element, wrapper) {
    element.parentNode?.insertBefore(wrapper, element);
    wrapper.appendChild(element);
}
/**
 * 解包元素
 */
export function unwrap(element) {
    const parent = element.parentNode;
    if (!parent || parent === document.body)
        return;
    const grandParent = parent.parentNode;
    if (!grandParent)
        return;
    while (parent.firstChild)
        grandParent.insertBefore(parent.firstChild, parent);
    grandParent.removeChild(parent);
}
/**
 * 克隆元素
 */
export function clone(element, deep = true) {
    return element.cloneNode(deep);
}
/**
 * 检查元素是否包含另一个元素
 */
export function contains(parent, child) {
    return parent.contains(child);
}
/**
 * 聚焦元素
 */
export function focus(element) {
    element.focus();
}
/**
 * 失焦元素
 */
export function blur(element) {
    element.blur();
}
/**
 * 滚动到元素
 */
export function scrollIntoView(element, options) {
    element.scrollIntoView(options);
}
/**
 * 获取元素的偏移量
 */
export function getOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
    };
}
/**
 * 获取元素的尺寸
 */
export function getSize(element) {
    return {
        width: element.offsetWidth,
        height: element.offsetHeight,
    };
}
/**
 * 获取元素的内部尺寸
 */
export function getInnerSize(element) {
    return {
        width: element.clientWidth,
        height: element.clientHeight,
    };
}
/**
 * 获取元素的外部尺寸
 */
export function getOuterSize(element, includeMargin = false) {
    const styles = getComputedStyle(element);
    let width = element.offsetWidth;
    let height = element.offsetHeight;
    if (includeMargin) {
        width += Number.parseFloat(styles.marginLeft) + Number.parseFloat(styles.marginRight);
        height += Number.parseFloat(styles.marginTop) + Number.parseFloat(styles.marginBottom);
    }
    return { width, height };
}
// Create button helper
export function createButton(text, className) {
    const button = document.createElement('button');
    button.textContent = text;
    if (className)
        button.className = className;
    return button;
}
// Create icon helper
export function createIcon(iconName, className) {
    const icon = document.createElement('i');
    if (className)
        icon.className = className;
    icon.setAttribute('data-icon', iconName);
    return icon;
}
//# sourceMappingURL=dom.js.map