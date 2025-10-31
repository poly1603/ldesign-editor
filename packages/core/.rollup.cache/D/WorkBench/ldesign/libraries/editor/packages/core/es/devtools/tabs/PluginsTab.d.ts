/**
 * 插件调试标签页
 * 管理和调试编辑器插件
 */
import type { Editor } from '../../core/Editor';
export interface PluginInfo {
    name: string;
    version: string;
    description?: string;
    author?: string;
    enabled: boolean;
    loadTime?: number;
    size?: number;
    dependencies?: string[];
    exports?: string[];
    config?: any;
    errorCount: number;
    warningCount: number;
}
export declare class PluginsTab {
    private editor;
    private container?;
    private plugins;
    private selectedPlugin?;
    private detailsPanel?;
    constructor(options: {
        editor: Editor;
    });
    /**
     * 加载插件信息
     */
    private loadPluginInfo;
    /**
     * 渲染标签页
     */
    render(): HTMLElement;
    /**
     * 创建插件列表
     */
    private createPluginList;
    /**
     * 创建插件卡片
     */
    private createPluginCard;
    /**
     * 创建详情面板
     */
    private createDetailsPanel;
    /**
     * 显示插件详情
     */
    private showPluginDetails;
    /**
     * 切换插件状态
     */
    private togglePlugin;
    /**
     * 重载插件
     */
    private reloadPlugin;
    /**
     * 格式化大小
     */
    private formatSize;
    /**
     * 激活标签页
     */
    activate(): void;
    /**
     * 停用标签页
     */
    deactivate(): void;
    /**
     * 销毁
     */
    destroy(): void;
}
