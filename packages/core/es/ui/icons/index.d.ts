/**
 * 统一图标系统
 * 整合原 ui/icons.ts 和 utils/icons.ts
 */
export declare const icons: Record<string, string>;
export type IconName = keyof typeof icons;
export interface IconMap {
    [key: string]: string;
}
/**
 * 创建图标元素
 */
export declare function createIcon(name: IconName | string): SVGElement | null;
/**
 * 获取图标 HTML
 */
export declare function getIconHTML(name: IconName | string): string;
/**
 * 检查图标是否存在
 */
export declare function hasIcon(name: string): boolean;
/**
 * 获取所有图标名称
 */
export declare function getAllIconNames(): string[];
/**
 * 按分类获取图标
 */
export declare function getIconsByCategory(): {
    basic: string[];
    formatting: string[];
    media: string[];
    lucide: string[];
};
export { createIcon as createIconElement };
export { getIconHTML as getIcon };
export { icons as Icons };
export { basicIcons } from './basic';
export { formattingIcons } from './formatting';
export { lucideIcons } from './lucide';
export { mediaIcons } from './media';
