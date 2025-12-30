/**
 * 实时配置预览
 * 在不保存的情况下预览配置效果
 */
import type { PresetName } from '../config/presets';
/**
 * 配置预览类
 */
export declare class ConfigPreview {
    private componentFactory;
    private configManager;
    private features;
    private modal;
    private originalConfig;
    /**
     * 显示预览
     */
    show(preset: PresetName): void;
    /**
     * 保存原始配置
     */
    private saveOriginalConfig;
    /**
     * 应用预设预览
     */
    private applyPresetPreview;
    /**
     * 显示预览面板
     */
    private showPreviewPanel;
    /**
     * 渲染统计信息
     */
    private renderStats;
    /**
     * 创建底部按钮
     */
    private createFooter;
    /**
     * 恢复原始配置
     */
    private restoreOriginalConfig;
}
/**
 * 显示配置预览
 */
export declare function showConfigPreview(preset: PresetName): ConfigPreview;
//# sourceMappingURL=ConfigPreview.d.ts.map