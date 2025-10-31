/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
/**
 * DOM 操作工具函数
 * 统一管理DOM相关操作，避免重复代码
 */
/**
 * 创建元素并设置属性
 */
function createElement(tag, attrs, ...children) {
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
function $(selector, parent = document) {
    return parent.querySelector(selector);
}

export { $, createElement };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=DOMUtils.js.map
