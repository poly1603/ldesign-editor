/**
 * 设置面板
 * 提供可视化的编辑器配置界面
 */
/**
 * 设置面板选项
 */
export interface SettingsPanelOptions {
    width?: string;
    height?: string;
    onClose?: () => void;
    onSave?: (config: any) => void;
}
/**
 * 设置面板类
 */
export declare class SettingsPanel {
    private configManager;
    private componentFactory;
    private modal;
    private options;
    private container;
    private tempConfig;
    constructor(options?: SettingsPanelOptions);
    /**
     * 显示设置面板
     */
    show(): void;
    /**
     * 隐藏设置面板
     */
    hide(): void;
    /**
     * 创建内容
     */
    private createContent;
    /**
     * 创建选项卡
     */
    private createTabs;
    /**
     * 创建外观选项卡
     */
    private createAppearanceTab;
    /**
     * 创建图标选项卡
     */
    private createIconsTab;
    /**
     * 创建语言选项卡
     */
    private createLanguageTab;
    /**
     * 创建高级选项卡
     */
    private createAdvancedTab;
    /**
     * 创建主题预览
     */
    private createThemePreview;
    /**
     * 创建图标预览
     */
    private createIconPreview;
    /**
     * 创建底部按钮
     */
    private createFooter;
    /**
     * 预览主题
     */
    private previewTheme;
    /**
     * 预览图标
     */
    private previewIcons;
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
     * 处理关闭
     */
    private handleClose;
    /**
     * 处理保存
     */
    private handleSave;
}
/**
 * 显示设置面板
 */
export declare function showSettingsPanel(options?: SettingsPanelOptions): SettingsPanel;
//# sourceMappingURL=SettingsPanel.d.ts.map