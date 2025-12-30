/**
 * 配置标签页
 * 管理编辑器配置和调试选项
 */
import type { Editor } from '../../core/Editor';
export interface ConfigSection {
    name: string;
    label: string;
    icon: string;
    items: ConfigItem[];
}
export interface ConfigItem {
    key: string;
    label: string;
    type: 'boolean' | 'number' | 'string' | 'select' | 'color' | 'json';
    value: any;
    defaultValue?: any;
    options?: Array<{
        label: string;
        value: any;
    }>;
    min?: number;
    max?: number;
    step?: number;
    description?: string;
    onChange?: (value: any) => void;
}
export declare class ConfigTab {
    private editor;
    private container?;
    private sections;
    private searchQuery;
    private settingsContainer?;
    constructor(options: {
        editor: Editor;
    });
    /**
     * 初始化配置
     */
    private initializeConfig;
    /**
     * 渲染标签页
     */
    render(): HTMLElement;
    /**
     * 创建工具栏
     */
    private createToolbar;
    /**
     * 渲染设置
     */
    private renderSettings;
    /**
     * 创建设置部分
     */
    private createSection;
    /**
     * 创建配置项
     */
    private createConfigItem;
    /**
     * 创建控件
     */
    private createControl;
    /**
     * 创建开关
     */
    private createToggle;
    /**
     * 创建数字输入
     */
    private createNumberInput;
    /**
     * 创建文本输入
     */
    private createTextInput;
    /**
     * 创建下拉选择
     */
    private createSelect;
    /**
     * 创建颜色选择器
     */
    private createColorPicker;
    /**
     * 创建JSON编辑器
     */
    private createJsonEditor;
    /**
     * 应用配置
     */
    private applyConfig;
    /**
     * 重置所有配置
     */
    private resetAll;
    /**
     * 导出配置
     */
    private exportConfig;
    /**
     * 导入配置
     */
    private importConfig;
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
//# sourceMappingURL=ConfigTab.d.ts.map