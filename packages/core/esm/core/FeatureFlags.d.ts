/**
 * 功能开关系统
 * 细粒度控制每个功能的启用/禁用
 */
import { EventEmitter } from './EventEmitter';
/**
 * 功能定义
 */
export interface Feature {
    id: string;
    name: string;
    description?: string;
    category: FeatureCategory;
    enabled: boolean;
    lazy?: boolean;
    dependencies?: string[];
    config?: Record<string, any>;
}
/**
 * 功能分类
 */
export declare enum FeatureCategory {
    CORE = "core",// 核心功能
    FORMAT = "format",// 格式化
    INSERT = "insert",// 插入
    MEDIA = "media",// 媒体
    TABLE = "table",// 表格
    AI = "ai",// AI
    TOOL = "tool",// 工具
    ADVANCED = "advanced"
}
/**
 * 功能开关管理器
 */
export declare class FeatureFlags extends EventEmitter {
    private features;
    private loadedFeatures;
    constructor();
    /**
     * 初始化默认功能列表
     */
    private initializeDefaultFeatures;
    /**
     * 注册功能
     */
    register(feature: Feature): void;
    /**
     * 启用功能
     */
    enable(featureId: string): void;
    /**
     * 禁用功能
     */
    disable(featureId: string): void;
    /**
     * 切换功能
     */
    toggle(featureId: string): boolean;
    /**
     * 检查功能是否启用
     */
    isEnabled(featureId: string): boolean;
    /**
     * 检查功能是否已加载
     */
    isLoaded(featureId: string): boolean;
    /**
     * 标记功能为已加载
     */
    markAsLoaded(featureId: string): void;
    /**
     * 获取功能配置
     */
    getFeature(featureId: string): Feature | null;
    /**
     * 获取所有功能
     */
    getAllFeatures(): Feature[];
    /**
     * 按分类获取功能
     */
    getByCategory(category: FeatureCategory): Feature[];
    /**
     * 获取已启用的功能
     */
    getEnabled(): Feature[];
    /**
     * 获取需要懒加载的功能
     */
    getLazyFeatures(): Feature[];
    /**
     * 获取立即加载的功能
     */
    getEagerFeatures(): Feature[];
    /**
     * 批量启用
     */
    enableBatch(featureIds: string[]): void;
    /**
     * 批量禁用
     */
    disableBatch(featureIds: string[]): void;
    /**
     * 启用分类下所有功能
     */
    enableCategory(category: FeatureCategory): void;
    /**
     * 禁用分类下所有功能
     */
    disableCategory(category: FeatureCategory): void;
    /**
     * 导出配置
     */
    exportConfig(): Record<string, boolean | any>;
    /**
     * 导入配置
     */
    importConfig(config: Record<string, any>): void;
    /**
     * 重置为默认配置
     */
    reset(): void;
    /**
     * 获取统计信息
     */
    getStats(): {
        total: number;
        enabled: number;
        disabled: number;
        loaded: number;
        lazy: number;
    };
}
/**
 * 获取全局功能开关实例
 */
export declare function getFeatureFlags(): FeatureFlags;
/**
 * 重置全局功能开关
 */
export declare function resetFeatureFlags(): void;
//# sourceMappingURL=FeatureFlags.d.ts.map