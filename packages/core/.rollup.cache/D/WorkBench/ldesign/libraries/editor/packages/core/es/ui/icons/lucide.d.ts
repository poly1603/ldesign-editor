/**
 * Lucide 特殊图标集
 * 包含调整大小、边框、阴影、滤镜等特殊效果图标
 */
export declare const lucideIcons: Record<string, string>;
/**
 * 获取 Lucide 图标 HTML（向后兼容函数）
 * @deprecated 请使用统一的 getIconHTML 函数
 */
export declare function getLucideIcon(name: keyof typeof lucideIcons | string): string;
