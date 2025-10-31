/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

/**
 * 配置验证和推荐系统
 * 验证配置合法性并提供优化建议
 */
/**
 * 配置验证器类
 */
class ConfigValidator {
    /**
     * 验证配置
     */
    validate(config) {
        const result = {
            valid: true,
            errors: [],
            warnings: [],
            suggestions: [],
        };
        // 验证图标配置
        this.validateIcons(config, result);
        // 验证主题配置
        this.validateTheme(config, result);
        // 验证多语言配置
        this.validateI18n(config, result);
        // 验证功能配置
        this.validateFeatures(config, result);
        // 验证性能配置
        this.validatePerformance(config, result);
        // 生成优化建议
        this.generateSuggestions(config, result);
        return result;
    }
    /**
     * 验证图标配置
     */
    validateIcons(config, result) {
        if (config.icons) {
            const validSets = ['lucide', 'feather', 'material', 'custom'];
            if (config.icons.defaultSet && !validSets.includes(config.icons.defaultSet)) {
                result.errors.push({
                    field: 'icons.defaultSet',
                    message: `无效的图标集: ${config.icons.defaultSet}`,
                    severity: 'error',
                });
                result.valid = false;
            }
        }
    }
    /**
     * 验证主题配置
     */
    validateTheme(config, result) {
        if (config.theme) {
            const validThemes = ['light', 'dark', 'high-contrast'];
            if (config.theme.defaultTheme && !validThemes.includes(config.theme.defaultTheme)) {
                result.warnings.push({
                    message: `未知的主题: ${config.theme.defaultTheme}，可能是自定义主题`,
                    impact: 'low',
                });
            }
            if (config.theme.customThemes && config.theme.customThemes.length > 10) {
                result.warnings.push({
                    message: '自定义主题过多可能影响性能',
                    impact: 'medium',
                });
            }
        }
    }
    /**
     * 验证多语言配置
     */
    validateI18n(config, result) {
        if (config.i18n) {
            const validLocales = ['zh-CN', 'en-US', 'ja-JP'];
            if (config.i18n.defaultLocale && !validLocales.includes(config.i18n.defaultLocale)) {
                result.warnings.push({
                    message: `未知的语言: ${config.i18n.defaultLocale}，可能需要加载额外的语言包`,
                    impact: 'low',
                });
            }
        }
    }
    /**
     * 验证功能配置
     */
    validateFeatures(config, result) {
        if (config.features) {
            const enabled = config.features.enabled || [];
            const disabled = config.features.disabled || [];
            // 检查冲突
            const conflicts = enabled.filter(f => disabled.includes(f));
            if (conflicts.length > 0) {
                result.errors.push({
                    field: 'features',
                    message: `功能冲突: ${conflicts.join(', ')} 同时在启用和禁用列表中`,
                    severity: 'error',
                });
                result.valid = false;
            }
            // 检查核心功能是否被禁用
            const coreFeatures = ['basic-editing', 'selection', 'history'];
            const disabledCore = coreFeatures.filter(f => disabled.includes(f));
            if (disabledCore.length > 0) {
                result.errors.push({
                    field: 'features',
                    message: `核心功能不应被禁用: ${disabledCore.join(', ')}`,
                    severity: 'error',
                });
                result.valid = false;
            }
            // 功能数量建议
            if (enabled.length > 30) {
                result.suggestions.push({
                    type: 'performance',
                    message: '启用的功能较多，建议只启用必需的功能以提升性能',
                    action: '考虑使用预设配置或禁用不常用的功能',
                });
            }
        }
    }
    /**
     * 验证性能配置
     */
    validatePerformance(config, result) {
        // 检查自动保存间隔
        if (config.autoSaveInterval && config.autoSaveInterval < 5000) {
            result.warnings.push({
                message: '自动保存间隔过短可能影响性能',
                impact: 'medium',
            });
            result.suggestions.push({
                type: 'performance',
                message: '建议将自动保存间隔设置为10秒以上',
                action: '设置 autoSaveInterval: 10000',
            });
        }
    }
    /**
     * 生成优化建议
     */
    generateSuggestions(config, result) {
        const enabled = config.features?.enabled || [];
        // AI功能建议
        if (enabled.includes('ai-service')) {
            result.suggestions.push({
                type: 'usability',
                message: 'AI功能已启用，确保已配置API密钥',
                action: '在AIService中配置API密钥',
            });
        }
        // 协作功能建议
        if (enabled.includes('collaboration')) {
            result.suggestions.push({
                type: 'compatibility',
                message: '协作功能需要WebSocket支持',
                action: '确保服务器支持WebSocket连接',
            });
        }
        // 媒体功能建议
        if (enabled.includes('image') || enabled.includes('video')) {
            result.suggestions.push({
                type: 'performance',
                message: '媒体功能建议配置上传处理器',
                action: '设置uploadHandler以优化媒体上传体验',
            });
        }
        // 懒加载建议
        if (enabled.length > 15 && !config.features?.lazy) {
            result.suggestions.push({
                type: 'performance',
                message: '功能较多时建议启用懒加载',
                action: '在功能配置中设置 lazy: true',
            });
        }
    }
    /**
     * 生成验证报告
     */
    generateReport(result) {
        let report = '配置验证报告\n';
        report += '============\n\n';
        report += `状态: ${result.valid ? '✅ 有效' : '❌ 无效'}\n\n`;
        if (result.errors.length > 0) {
            report += '错误:\n';
            result.errors.forEach((error) => {
                report += `  ❌ [${error.field}] ${error.message}\n`;
            });
            report += '\n';
        }
        if (result.warnings.length > 0) {
            report += '警告:\n';
            result.warnings.forEach((warning) => {
                const icon = warning.impact === 'high' ? '🔴' : warning.impact === 'medium' ? '🟡' : '🟢';
                report += `  ${icon} ${warning.message}\n`;
            });
            report += '\n';
        }
        if (result.suggestions.length > 0) {
            report += '建议:\n';
            result.suggestions.forEach((suggestion) => {
                const icon = suggestion.type === 'performance' ? '⚡' : suggestion.type === 'usability' ? '🎯' : '🔧';
                report += `  ${icon} ${suggestion.message}\n`;
                if (suggestion.action)
                    report += `     → ${suggestion.action}\n`;
            });
        }
        return report;
    }
    /**
     * 自动修复配置
     */
    autoFix(config) {
        const fixed = { ...config };
        // 修复功能冲突
        if (fixed.features) {
            const enabled = fixed.features.enabled || [];
            const disabled = fixed.features.disabled || [];
            // 移除冲突项（以enabled为准）
            fixed.features.disabled = disabled.filter(f => !enabled.includes(f));
            // 确保核心功能启用
            const coreFeatures = ['basic-editing', 'selection', 'history'];
            coreFeatures.forEach((f) => {
                if (!enabled.includes(f))
                    enabled.push(f);
            });
            fixed.features.enabled = enabled;
        }
        // 修复性能配置
        if (fixed.autoSaveInterval && fixed.autoSaveInterval < 5000)
            fixed.autoSaveInterval = 10000;
        return fixed;
    }
}
// 全局实例
let validatorInstance = null;
/**
 * 获取配置验证器
 */
function getConfigValidator() {
    if (!validatorInstance)
        validatorInstance = new ConfigValidator();
    return validatorInstance;
}
/**
 * 快捷函数：验证配置
 */
function validateConfig(config) {
    return getConfigValidator().validate(config);
}
/**
 * 快捷函数：自动修复配置
 */
function autoFixConfig(config) {
    return getConfigValidator().autoFix(config);
}

exports.ConfigValidator = ConfigValidator;
exports.autoFixConfig = autoFixConfig;
exports.getConfigValidator = getConfigValidator;
exports.validateConfig = validateConfig;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ConfigValidator.cjs.map
