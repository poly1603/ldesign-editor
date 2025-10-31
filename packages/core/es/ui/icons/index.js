/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { basicIcons } from './basic.js';
import { formattingIcons } from './formatting.js';
import { lucideIcons } from './lucide.js';
import { mediaIcons } from './media.js';

/**
 * 统一图标系统
 * 整合原 ui/icons.ts 和 utils/icons.ts
 */
// 合并所有图标集
const icons = {
    ...basicIcons,
    ...formattingIcons,
    ...mediaIcons,
    ...lucideIcons,
};
/**
 * 创建图标元素
 */
function createIcon(name) {
    const iconSVG = icons[name];
    if (!iconSVG) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }
    const template = document.createElement('template');
    template.innerHTML = iconSVG.trim();
    const element = template.content.firstChild;
    // 设置默认属性
    if (element) {
        element.classList.add('editor-icon');
        if (!element.getAttribute('width'))
            element.setAttribute('width', '18');
        if (!element.getAttribute('height'))
            element.setAttribute('height', '18');
    }
    return element;
}
/**
 * 获取图标 HTML
 */
function getIconHTML(name) {
    return icons[name] || '';
}

export { icons as Icons, basicIcons, createIcon, createIcon as createIconElement, formattingIcons, getIconHTML as getIcon, getIconHTML, icons, lucideIcons, mediaIcons };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
