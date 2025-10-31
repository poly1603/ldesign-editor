/**
 * 统一图标系统
 * 整合原 ui/icons.ts 和 utils/icons.ts
 */
import { basicIcons } from './basic';
import { formattingIcons } from './formatting';
import { lucideIcons } from './lucide';
import { mediaIcons } from './media';
// 合并所有图标集
export const icons = {
    ...basicIcons,
    ...formattingIcons,
    ...mediaIcons,
    ...lucideIcons,
};
/**
 * 创建图标元素
 */
export function createIcon(name) {
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
export function getIconHTML(name) {
    return icons[name] || '';
}
/**
 * 检查图标是否存在
 */
export function hasIcon(name) {
    return name in icons;
}
/**
 * 获取所有图标名称
 */
export function getAllIconNames() {
    return Object.keys(icons);
}
/**
 * 按分类获取图标
 */
export function getIconsByCategory() {
    return {
        basic: Object.keys(basicIcons),
        formatting: Object.keys(formattingIcons),
        media: Object.keys(mediaIcons),
        lucide: Object.keys(lucideIcons),
    };
}
// 向后兼容导出（为了平滑迁移）
export { createIcon as createIconElement }; // 兼容可能的其他命名
export { getIconHTML as getIcon }; // 兼容简短命名
export { icons as Icons }; // 兼容大写导出
// 导出子模块（如果需要单独引用）
export { basicIcons } from './basic';
export { formattingIcons } from './formatting';
export { lucideIcons } from './lucide';
export { mediaIcons } from './media';
//# sourceMappingURL=index.js.map