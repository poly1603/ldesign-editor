/**
 * 插件注册中心
 * 支持插件的按需加载、配置管理和生命周期管理
 */
import type { Editor } from './Editor';
import type { Plugin } from './Plugin';
import { EventEmitter } from './EventEmitter';
/**
 * 插件配置接口
 */
export interface PluginConfig {
    enabled: boolean;
    priority?: number;
    lazy?: boolean;
    dependencies?: string[];
    config?: Record<string, any>;
}
/**
 * 插件元数据
 */
export interface PluginMetadata {
    name: string;
    version?: string;
    description?: string;
    author?: string;
    category?: PluginCategory;
    tags?: string[];
}
/**
 * 插件分类
 */
export declare enum PluginCategory {
    FORMAT = "format",
    BLOCK = "block",
    INLINE = "inline",
    MEDIA = "media",
    TOOL = "tool",
    AI = "ai",
    OTHER = "other"
}
/**
 * 插件加载器类型
 */
export type PluginLoader = () => Promise<Plugin> | Plugin;
/**
 * 插件注册中心类
 */
export declare class PluginRegistry extends EventEmitter {
    private registry;
    private editor?;
    private loadedPlugins;
    constructor();
    /**
     * 设置编辑器实例
     */
    setEditor(editor: Editor): void;
    /**
     * 注册插件
     */
    register(name: string, loader: PluginLoader, metadata?: Partial<PluginMetadata>, config?: Partial<PluginConfig>): void;
    /**
     * 批量注册插件
     */
    registerBatch(plugins: Array<{
        name: string;
        loader: PluginLoader;
        metadata?: Partial<PluginMetadata>;
        config?: Partial<PluginConfig>;
    }>): void;
    /**
     * 加载插件
     */
    load(name: string): Promise<Plugin | null>;
    /**
     * 批量加载插件
     */
    loadBatch(names: string[]): Promise<Array<Plugin | null>>;
    /**
     * 卸载插件
     */
    unload(name: string): Promise<void>;
    /**
     * 启用插件
     */
    enable(name: string): Promise<void>;
    /**
     * 禁用插件
     */
    disable(name: string): Promise<void>;
    /**
     * 更新插件配置
     */
    updateConfig(name: string, config: Partial<PluginConfig>): void;
    /**
     * 获取插件配置
     */
    getConfig(name: string): PluginConfig | null;
    /**
     * 获取插件元数据
     */
    getMetadata(name: string): PluginMetadata | null;
    /**
     * 获取插件实例
     */
    getInstance(name: string): Plugin | null;
    /**
     * 检查插件是否已注册
     */
    isRegistered(name: string): boolean;
    /**
     * 检查插件是否已加载
     */
    isLoaded(name: string): boolean;
    /**
     * 检查插件是否已启用
     */
    isEnabled(name: string): boolean;
    /**
     * 获取所有注册的插件名称
     */
    getRegistered(): string[];
    /**
     * 获取所有已加载的插件名称
     */
    getLoaded(): string[];
    /**
     * 获取所有启用的插件名称
     */
    getEnabled(): string[];
    /**
     * 按分类获取插件
     */
    getByCategory(category: PluginCategory): string[];
    /**
     * 获取插件统计信息
     */
    getStats(): {
        total: number;
        loaded: number;
        enabled: number;
        disabled: number;
        errors: number;
    };
    /**
     * 导出配置
     */
    exportConfig(): Record<string, Partial<PluginConfig>>;
    /**
     * 导入配置
     */
    importConfig(config: Record<string, Partial<PluginConfig>>): void;
    /**
     * 重置所有配置
     */
    reset(): void;
    /**
     * 清理所有插件
     */
    destroy(): Promise<void>;
}
/**
 * 获取全局插件注册中心
 */
export declare function getPluginRegistry(): PluginRegistry;
/**
 * 重置全局插件注册中心
 */
export declare function resetPluginRegistry(): void;
