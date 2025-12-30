/**
 * 功能管理面板
 * 可视化管理编辑器的所有功能
 */
/**
 * 功能管理面板类
 */
export declare class FeatureManagerPanel {
    private featureFlags;
    private pluginRegistry;
    private lazyLoader;
    private componentFactory;
    private modal;
    private container;
    /**
     * 显示面板
     */
    show(): void;
    /**
     * 隐藏面板
     */
    hide(): void;
    /**
     * 创建内容
     */
    private createContent;
    /**
     * 创建统计信息
     */
    private createStats;
    /**
     * 创建分类区块
     */
    private createCategorySection;
    /**
     * 创建功能项
     */
    private createFeatureItem;
    /**
     * 创建开关
     */
    private createToggle;
    /**
     * 刷新分类区块
     */
    private refreshCategorySection;
    /**
     * 创建底部按钮
     */
    private createFooter;
    /**
     * 导出配置
     */
    private exportConfig;
    /**
     * 导入配置
     */
    private importConfig;
    /**
     * 重置配置
     */
    private resetConfig;
    /**
     * 应用更改
     */
    private applyChanges;
}
/**
 * 显示功能管理面板
 */
export declare function showFeatureManager(): FeatureManagerPanel;
//# sourceMappingURL=FeatureManagerPanel.d.ts.map