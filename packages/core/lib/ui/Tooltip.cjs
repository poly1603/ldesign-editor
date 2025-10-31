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
 * 自定义工具提示组件
 */
let currentTooltip = null;
/**
 * 显示工具提示
 */
function showTooltip(element, text) {
    // 移除已存在的提示
    hideTooltip();
    const tooltip = document.createElement('div');
    tooltip.className = 'editor-tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    currentTooltip = tooltip;
    // 定位提示框
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    // 计算位置（居中显示在元素下方）
    const left = rect.left + (rect.width - tooltipRect.width) / 2;
    const top = rect.bottom + 8;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    // 添加显示动画
    requestAnimationFrame(() => {
        tooltip.classList.add('show');
    });
}
/**
 * 隐藏工具提示
 */
function hideTooltip() {
    if (currentTooltip) {
        currentTooltip.remove();
        currentTooltip = null;
    }
}
/**
 * 绑定工具提示到元素
 */
function bindTooltip(element, text) {
    let timeoutId = null;
    element.addEventListener('mouseenter', () => {
        // 延迟显示，避免快速划过时闪烁
        timeoutId = window.setTimeout(() => {
            showTooltip(element, text);
        }, 500);
    });
    element.addEventListener('mouseleave', () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        hideTooltip();
    });
}

exports.bindTooltip = bindTooltip;
exports.hideTooltip = hideTooltip;
exports.showTooltip = showTooltip;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=Tooltip.cjs.map
