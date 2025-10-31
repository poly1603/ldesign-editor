/**
 * Material Icons 图标集
 * Google Material Design 图标库
 */
import type { IconCategory, IconDefinition, IconSet } from '../types';
/**
 * Material 图标集实现
 */
export declare class MaterialIconSet implements IconSet {
    name: "material";
    displayName: string;
    version: string;
    author: string;
    license: string;
    icons: Map<string, IconDefinition>;
    constructor();
    /**
     * 加载图标
     * Material Design 图标通常使用filled样式
     */
    private loadIcons;
    getIcon(name: string): IconDefinition | null;
    getAllIcons(): IconDefinition[];
    getIconsByCategory(category: IconCategory): IconDefinition[];
    searchIcons(query: string): IconDefinition[];
}
