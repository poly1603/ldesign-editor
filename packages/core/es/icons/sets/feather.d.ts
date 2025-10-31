/**
 * Feather 图标集
 * 简洁优雅的图标库
 */
import type { IconCategory, IconDefinition, IconSet } from '../types';
/**
 * Feather 图标集实现
 */
export declare class FeatherIconSet implements IconSet {
    name: "feather";
    displayName: string;
    version: string;
    author: string;
    license: string;
    icons: Map<string, IconDefinition>;
    constructor();
    /**
     * 加载图标
     * Feather图标集与Lucide高度相似，这里复用Lucide的图标定义
     */
    private loadIcons;
    getIcon(name: string): IconDefinition | null;
    getAllIcons(): IconDefinition[];
    getIconsByCategory(category: IconCategory): IconDefinition[];
    searchIcons(query: string): IconDefinition[];
}
