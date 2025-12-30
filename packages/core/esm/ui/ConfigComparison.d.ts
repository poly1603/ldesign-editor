/**
 * 配置对比工具
 * 对比不同配置的差异和性能影响
 */
/**
 * 配置对比类
 */
export declare class ConfigComparison {
    private componentFactory;
    private modal;
    /**
     * 显示对比面板
     */
    show(): void;
    /**
     * 创建内容
     */
    private createContent;
    /**
     * 创建选择器
     */
    private createSelectors;
    /**
     * 处理选择
     */
    private handleSelection;
    /**
     * 对比配置
     */
    private compare;
    /**
     * 估算加载时间
     */
    private estimateLoadTime;
    /**
     * 估算内存使用
     */
    private estimateMemory;
    /**
     * 渲染对比结果
     */
    private renderComparison;
    /**
     * 创建性能卡片
     */
    private createPerfCard;
}
/**
 * 显示配置对比
 */
export declare function showConfigComparison(): ConfigComparison;
//# sourceMappingURL=ConfigComparison.d.ts.map