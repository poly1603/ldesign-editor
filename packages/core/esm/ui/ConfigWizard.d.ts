/**
 * 配置向导
 * 帮助用户选择最适合的配置
 */
import type { PresetName } from '../config/presets';
/**
 * 配置向导类
 */
export declare class ConfigWizard {
    private componentFactory;
    private modal;
    private answers;
    private currentStep;
    private questions;
    /**
     * 显示向导
     */
    show(onComplete: (preset: PresetName) => void): void;
    private onComplete?;
    /**
     * 渲染当前步骤
     */
    private renderStep;
    /**
     * 创建步骤内容
     */
    private createStepContent;
    /**
     * 创建底部按钮
     */
    private createFooter;
    /**
     * 下一步
     */
    private nextStep;
    /**
     * 上一步
     */
    private prevStep;
    /**
     * 跳过向导
     */
    private skip;
    /**
     * 完成向导
     */
    private complete;
    /**
     * 推荐配置
     */
    private recommendPreset;
    /**
     * 显示推荐结果
     */
    private showRecommendation;
}
/**
 * 显示配置向导
 */
export declare function showConfigWizard(onComplete: (preset: PresetName) => void): ConfigWizard;
//# sourceMappingURL=ConfigWizard.d.ts.map