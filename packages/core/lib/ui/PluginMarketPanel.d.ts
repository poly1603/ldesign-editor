/**
 * 插件市场面板
 * 可视化浏览和安装插件
 */
/**
 * 插件市场面板类
 */
export declare class PluginMarketPanel {
    private market;
    private componentFactory;
    private modal;
    private currentView;
    private searchQuery;
    /**
     * 显示市场面板
     */
    show(): void;
    /**
     * 创建内容
     */
    private createContent;
    /**
     * 创建侧边栏
     */
    private createSidebar;
    /**
     * 创建主内容区
     */
    private createMain;
    /**
     * 渲染插件列表
     */
    private renderPluginList;
    /**
     * 创建插件卡片
     */
    private createPluginCard;
    /**
     * 安装插件
     */
    private installPlugin;
    /**
     * 卸载插件
     */
    private uninstallPlugin;
    /**
     * 刷新主内容区
     */
    private refreshMain;
}
/**
 * 显示插件市场
 */
export declare function showPluginMarket(): PluginMarketPanel;
