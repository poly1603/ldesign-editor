/**
 * 编辑器构建器
 * 提供流式API，简化编辑器配置和初始化
 */
import type { IconSetType } from '../icons/types';
import { Editor } from './Editor';
import { FeatureCategory } from './FeatureFlags';
/**
 * 编辑器构建器类
 */
export declare class EditorBuilder {
    private options;
    private features;
    private registry;
    private loader;
    private config;
    private toolbarConfig;
    /**
     * 设置容器元素
     */
    element(selector: string | HTMLElement): this;
    /**
     * 设置初始内容
     */
    content(html: string): this;
    /**
     * 设置是否可编辑
     */
    editable(value?: boolean): this;
    /**
     * 启用功能
     */
    enableFeature(featureId: string): this;
    /**
     * 禁用功能
     */
    disableFeature(featureId: string): this;
    /**
     * 启用分类下所有功能
     */
    enableCategory(category: FeatureCategory): this;
    /**
     * 禁用分类下所有功能
     */
    disableCategory(category: FeatureCategory): this;
    /**
     * 只启用指定功能
     */
    onlyEnable(featureIds: string[]): this;
    /**
     * 设置图标集
     */
    icons(iconSet: IconSetType): this;
    /**
     * 设置主题
     */
    theme(themeName: string): this;
    /**
     * 设置语言
     */
    locale(locale: string): Promise<this>;
    /**
     * 使用轻量级预设
     */
    lightweight(): this;
    /**
     * 使用功能完整预设
     */
    fullFeatured(): this;
    /**
     * 只启用格式化功能
     */
    formatOnly(): this;
    /**
     * 启用所有媒体功能
     */
    withMedia(): this;
    /**
     * 启用AI功能
     */
    withAI(apiKey?: string, provider?: 'openai' | 'claude' | 'deepseek'): this;
    /**
     * 启用表格功能
     */
    withTable(): this;
    /**
     * 配置工具栏
     */
    toolbar(config: any): this;
    /**
     * 紧凑模式
     */
    compact(value?: boolean): this;
    /**
     * 显示标签
     */
    showLabels(value?: boolean): this;
    /**
     * 构建编辑器
     */
    build(): Promise<Editor>;
}
/**
 * 创建编辑器构建器
 */
export declare function createEditor(): EditorBuilder;
/**
 * 便捷函数：快速创建轻量级编辑器
 */
export declare function createLightweightEditor(element: string | HTMLElement): Promise<Editor>;
/**
 * 便捷函数：快速创建功能完整编辑器
 */
export declare function createFullFeaturedEditor(element: string | HTMLElement): Promise<Editor>;
/**
 * 便捷函数：快速创建仅格式化编辑器
 */
export declare function createFormatOnlyEditor(element: string | HTMLElement): Promise<Editor>;
//# sourceMappingURL=EditorBuilder.d.ts.map