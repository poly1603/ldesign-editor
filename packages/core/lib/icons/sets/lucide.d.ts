/**
 * Lucide 图标集
 * 现代、清晰的图标库
 */
import type { IconCategory, IconDefinition, IconSet } from '../types';
/**
 * Lucide 图标集实现
 */
export declare class LucideIconSet implements IconSet {
    name: "lucide";
    displayName: string;
    version: string;
    author: string;
    license: string;
    icons: Map<string, IconDefinition>;
    constructor();
    /**
     * 加载图标
     */
    private loadIcons;
    /**
     * 获取图标
     */
    getIcon(name: string): IconDefinition | null;
    /**
     * 获取所有图标
     */
    getAllIcons(): IconDefinition[];
    /**
     * 按分类获取图标
     */
    getIconsByCategory(category: IconCategory): IconDefinition[];
    /**
     * 搜索图标
     */
    searchIcons(query: string): IconDefinition[];
}
//# sourceMappingURL=lucide.d.ts.map