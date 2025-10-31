/**
 * 配置验证和推荐系统
 * 验证配置合法性并提供优化建议
 */
import type { EditorConfig } from './ConfigManager';
/**
 * 验证结果
 */
export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    suggestions: ValidationSuggestion[];
}
/**
 * 验证错误
 */
export interface ValidationError {
    field: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
}
/**
 * 验证警告
 */
export interface ValidationWarning {
    message: string;
    impact: 'high' | 'medium' | 'low';
}
/**
 * 验证建议
 */
export interface ValidationSuggestion {
    type: 'performance' | 'usability' | 'compatibility';
    message: string;
    action?: string;
}
/**
 * 配置验证器类
 */
export declare class ConfigValidator {
    /**
     * 验证配置
     */
    validate(config: EditorConfig): ValidationResult;
    /**
     * 验证图标配置
     */
    private validateIcons;
    /**
     * 验证主题配置
     */
    private validateTheme;
    /**
     * 验证多语言配置
     */
    private validateI18n;
    /**
     * 验证功能配置
     */
    private validateFeatures;
    /**
     * 验证性能配置
     */
    private validatePerformance;
    /**
     * 生成优化建议
     */
    private generateSuggestions;
    /**
     * 生成验证报告
     */
    generateReport(result: ValidationResult): string;
    /**
     * 自动修复配置
     */
    autoFix(config: EditorConfig): EditorConfig;
}
/**
 * 获取配置验证器
 */
export declare function getConfigValidator(): ConfigValidator;
/**
 * 快捷函数：验证配置
 */
export declare function validateConfig(config: EditorConfig): ValidationResult;
/**
 * 快捷函数：自动修复配置
 */
export declare function autoFixConfig(config: EditorConfig): EditorConfig;
