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
 * DOM 操作工具函数
 */
/**
 * 创建元素
 */
// Create button helper
function createButton(text, className) {
    const button = document.createElement('button');
    button.textContent = text;
    if (className)
        button.className = className;
    return button;
}

exports.createButton = createButton;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=dom.cjs.map
