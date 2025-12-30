/**
 * 插件市场系统
 * 浏览、搜索和安装社区插件（概念实现）
 */
import { EventEmitter } from '../core/EventEmitter';
/**
 * 插件信息
 */
export interface MarketplacePlugin {
    id: string;
    name: string;
    version: string;
    author: string;
    description: string;
    category: string;
    tags: string[];
    downloads: number;
    rating: number;
    size: number;
    icon?: string;
    homepage?: string;
    repository?: string;
    license: string;
    dependencies?: string[];
    config?: Record<string, any>;
}
/**
 * 插件市场类
 */
export declare class PluginMarket extends EventEmitter {
    private registry;
    private plugins;
    private installed;
    constructor();
    /**
     * 加载精选插件
     */
    private loadFeaturedPlugins;
    /**
     * 搜索插件
     */
    search(query: string): MarketplacePlugin[];
    /**
     * 按分类获取插件
     */
    getByCategory(category: string): MarketplacePlugin[];
    /**
     * 获取推荐插件
     */
    getRecommended(limit?: number): MarketplacePlugin[];
    /**
     * 获取热门插件
     */
    getPopular(limit?: number): MarketplacePlugin[];
    /**
     * 获取最新插件
     */
    getLatest(limit?: number): MarketplacePlugin[];
    /**
     * 安装插件（模拟）
     */
    install(pluginId: string): Promise<boolean>;
    /**
     * 卸载插件
     */
    uninstall(pluginId: string): Promise<boolean>;
    /**
     * 检查是否已安装
     */
    isInstalled(pluginId: string): boolean;
    /**
     * 获取已安装插件
     */
    getInstalled(): MarketplacePlugin[];
    /**
     * 获取统计信息
     */
    getStats(): {
        total: number;
        installed: number;
        available: number;
        categories: string[];
    };
}
/**
 * 获取插件市场实例
 */
export declare function getPluginMarket(): PluginMarket;
//# sourceMappingURL=PluginMarket.d.ts.map