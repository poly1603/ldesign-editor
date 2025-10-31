/**
 * 图标管理器
 * 负责管理、渲染和切换图标集
 */
import type { EditorIconMap, IconCategory, IconDefinition, IconManagerConfig, IconRenderOptions, IconSet, IconSetType, IIconManager } from './types';
import { EventEmitter } from '../core/EventEmitter';
export declare class IconManager extends EventEmitter implements IIconManager {
    private iconSets;
    private currentSet;
    private defaultStyle;
    private iconCache;
    private config;
    private editorIconMap?;
    constructor(config?: IconManagerConfig);
    /**
     * 初始化内置图标集
     */
    private initializeBuiltinSets;
    /**
     * 获取图标定义
     */
    getIcon(name: string, set?: IconSetType): IconDefinition | null;
    /**
     * 渲染图标为HTML字符串
     */
    renderIcon(name: string, options?: IconRenderOptions): string;
    /**
     * 创建图标DOM元素
     */
    createIconElement(name: string, options?: IconRenderOptions): HTMLElement;
    /**
     * 设置默认图标集
     */
    setDefaultIconSet(set: IconSetType): void;
    /**
     * 获取当前图标集
     */
    getCurrentIconSet(): IconSetType;
    /**
     * 注册自定义图标
     */
    registerIcon(name: string, svg: string, set?: IconSetType): void;
    /**
     * 注册图标集
     */
    registerIconSet(set: IconSet): void;
    /**
     * 获取所有可用的图标集
     */
    getAvailableIconSets(): IconSetType[];
    /**
     * 搜索图标
     */
    searchIcons(query: string, set?: IconSetType): IconDefinition[];
    /**
     * 按分类获取图标
     */
    getIconsByCategory(category: IconCategory, set?: IconSetType): IconDefinition[];
    /**
     * 批量替换所有图标
     */
    replaceAllIcons(set: IconSetType): void;
    /**
     * 设置编辑器图标映射
     */
    setEditorIconMap(map: Partial<EditorIconMap>): void;
    /**
     * 构建SVG字符串
     */
    private buildSvg;
    /**
     * 渲染后备图标
     */
    private renderFallbackIcon;
    /**
     * 获取缓存键
     */
    private getCacheKey;
    /**
     * 清空特定图标的缓存
     */
    private clearIconCache;
    /**
     * 从元素提取选项
     */
    private extractOptionsFromElement;
    /**
     * 创建自定义图标集
     */
    private createCustomIconSet;
    /**
     * 添加旋转样式
     */
    private addSpinningStyles;
    /**
     * 获取映射的图标名称
     */
    private getMappedIconName;
    /**
     * 获取默认的编辑器图标映射
     */
    private getDefaultEditorIconMap;
    /**
     * 清理资源
     */
    destroy(): void;
}
/**
 * 获取全局图标管理器实例
 */
export declare function getIconManager(config?: IconManagerConfig): IconManager;
/**
 * 重置全局图标管理器
 */
export declare function resetIconManager(): void;
