/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

class ConfigValidator {
  /**
   * 验证配置
   */
  validate(config) {
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };
    this.validateIcons(config, result);
    this.validateTheme(config, result);
    this.validateI18n(config, result);
    this.validateFeatures(config, result);
    this.validatePerformance(config, result);
    this.generateSuggestions(config, result);
    return result;
  }
  /**
   * 验证图标配置
   */
  validateIcons(config, result) {
    if (config.icons) {
      const validSets = ["lucide", "feather", "material", "custom"];
      if (config.icons.defaultSet && !validSets.includes(config.icons.defaultSet)) {
        result.errors.push({
          field: "icons.defaultSet",
          message: `\u65E0\u6548\u7684\u56FE\u6807\u96C6: ${config.icons.defaultSet}`,
          severity: "error"
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
      const validThemes = ["light", "dark", "high-contrast"];
      if (config.theme.defaultTheme && !validThemes.includes(config.theme.defaultTheme)) {
        result.warnings.push({
          message: `\u672A\u77E5\u7684\u4E3B\u9898: ${config.theme.defaultTheme}\uFF0C\u53EF\u80FD\u662F\u81EA\u5B9A\u4E49\u4E3B\u9898`,
          impact: "low"
        });
      }
      if (config.theme.customThemes && config.theme.customThemes.length > 10) {
        result.warnings.push({
          message: "\u81EA\u5B9A\u4E49\u4E3B\u9898\u8FC7\u591A\u53EF\u80FD\u5F71\u54CD\u6027\u80FD",
          impact: "medium"
        });
      }
    }
  }
  /**
   * 验证多语言配置
   */
  validateI18n(config, result) {
    if (config.i18n) {
      const validLocales = ["zh-CN", "en-US", "ja-JP"];
      if (config.i18n.defaultLocale && !validLocales.includes(config.i18n.defaultLocale)) {
        result.warnings.push({
          message: `\u672A\u77E5\u7684\u8BED\u8A00: ${config.i18n.defaultLocale}\uFF0C\u53EF\u80FD\u9700\u8981\u52A0\u8F7D\u989D\u5916\u7684\u8BED\u8A00\u5305`,
          impact: "low"
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
      const conflicts = enabled.filter((f) => disabled.includes(f));
      if (conflicts.length > 0) {
        result.errors.push({
          field: "features",
          message: `\u529F\u80FD\u51B2\u7A81: ${conflicts.join(", ")} \u540C\u65F6\u5728\u542F\u7528\u548C\u7981\u7528\u5217\u8868\u4E2D`,
          severity: "error"
        });
        result.valid = false;
      }
      const coreFeatures = ["basic-editing", "selection", "history"];
      const disabledCore = coreFeatures.filter((f) => disabled.includes(f));
      if (disabledCore.length > 0) {
        result.errors.push({
          field: "features",
          message: `\u6838\u5FC3\u529F\u80FD\u4E0D\u5E94\u88AB\u7981\u7528: ${disabledCore.join(", ")}`,
          severity: "error"
        });
        result.valid = false;
      }
      if (enabled.length > 30) {
        result.suggestions.push({
          type: "performance",
          message: "\u542F\u7528\u7684\u529F\u80FD\u8F83\u591A\uFF0C\u5EFA\u8BAE\u53EA\u542F\u7528\u5FC5\u9700\u7684\u529F\u80FD\u4EE5\u63D0\u5347\u6027\u80FD",
          action: "\u8003\u8651\u4F7F\u7528\u9884\u8BBE\u914D\u7F6E\u6216\u7981\u7528\u4E0D\u5E38\u7528\u7684\u529F\u80FD"
        });
      }
    }
  }
  /**
   * 验证性能配置
   */
  validatePerformance(config, result) {
    if (config.autoSaveInterval && config.autoSaveInterval < 5e3) {
      result.warnings.push({
        message: "\u81EA\u52A8\u4FDD\u5B58\u95F4\u9694\u8FC7\u77ED\u53EF\u80FD\u5F71\u54CD\u6027\u80FD",
        impact: "medium"
      });
      result.suggestions.push({
        type: "performance",
        message: "\u5EFA\u8BAE\u5C06\u81EA\u52A8\u4FDD\u5B58\u95F4\u9694\u8BBE\u7F6E\u4E3A10\u79D2\u4EE5\u4E0A",
        action: "\u8BBE\u7F6E autoSaveInterval: 10000"
      });
    }
  }
  /**
   * 生成优化建议
   */
  generateSuggestions(config, result) {
    const enabled = config.features?.enabled || [];
    if (enabled.includes("ai-service")) {
      result.suggestions.push({
        type: "usability",
        message: "AI\u529F\u80FD\u5DF2\u542F\u7528\uFF0C\u786E\u4FDD\u5DF2\u914D\u7F6EAPI\u5BC6\u94A5",
        action: "\u5728AIService\u4E2D\u914D\u7F6EAPI\u5BC6\u94A5"
      });
    }
    if (enabled.includes("collaboration")) {
      result.suggestions.push({
        type: "compatibility",
        message: "\u534F\u4F5C\u529F\u80FD\u9700\u8981WebSocket\u652F\u6301",
        action: "\u786E\u4FDD\u670D\u52A1\u5668\u652F\u6301WebSocket\u8FDE\u63A5"
      });
    }
    if (enabled.includes("image") || enabled.includes("video")) {
      result.suggestions.push({
        type: "performance",
        message: "\u5A92\u4F53\u529F\u80FD\u5EFA\u8BAE\u914D\u7F6E\u4E0A\u4F20\u5904\u7406\u5668",
        action: "\u8BBE\u7F6EuploadHandler\u4EE5\u4F18\u5316\u5A92\u4F53\u4E0A\u4F20\u4F53\u9A8C"
      });
    }
    if (enabled.length > 15 && !config.features?.lazy) {
      result.suggestions.push({
        type: "performance",
        message: "\u529F\u80FD\u8F83\u591A\u65F6\u5EFA\u8BAE\u542F\u7528\u61D2\u52A0\u8F7D",
        action: "\u5728\u529F\u80FD\u914D\u7F6E\u4E2D\u8BBE\u7F6E lazy: true"
      });
    }
  }
  /**
   * 生成验证报告
   */
  generateReport(result) {
    let report = "\u914D\u7F6E\u9A8C\u8BC1\u62A5\u544A\n";
    report += "============\n\n";
    report += `\u72B6\u6001: ${result.valid ? "\u2705 \u6709\u6548" : "\u274C \u65E0\u6548"}

`;
    if (result.errors.length > 0) {
      report += "\u9519\u8BEF:\n";
      result.errors.forEach((error) => {
        report += `  \u274C [${error.field}] ${error.message}
`;
      });
      report += "\n";
    }
    if (result.warnings.length > 0) {
      report += "\u8B66\u544A:\n";
      result.warnings.forEach((warning) => {
        const icon = warning.impact === "high" ? "\u{1F534}" : warning.impact === "medium" ? "\u{1F7E1}" : "\u{1F7E2}";
        report += `  ${icon} ${warning.message}
`;
      });
      report += "\n";
    }
    if (result.suggestions.length > 0) {
      report += "\u5EFA\u8BAE:\n";
      result.suggestions.forEach((suggestion) => {
        const icon = suggestion.type === "performance" ? "\u26A1" : suggestion.type === "usability" ? "\u{1F3AF}" : "\u{1F527}";
        report += `  ${icon} ${suggestion.message}
`;
        if (suggestion.action)
          report += `     \u2192 ${suggestion.action}
`;
      });
    }
    return report;
  }
  /**
   * 自动修复配置
   */
  autoFix(config) {
    const fixed = {
      ...config
    };
    if (fixed.features) {
      const enabled = fixed.features.enabled || [];
      const disabled = fixed.features.disabled || [];
      fixed.features.disabled = disabled.filter((f) => !enabled.includes(f));
      const coreFeatures = ["basic-editing", "selection", "history"];
      coreFeatures.forEach((f) => {
        if (!enabled.includes(f))
          enabled.push(f);
      });
      fixed.features.enabled = enabled;
    }
    if (fixed.autoSaveInterval && fixed.autoSaveInterval < 5e3)
      fixed.autoSaveInterval = 1e4;
    return fixed;
  }
}
let validatorInstance = null;
function getConfigValidator() {
  if (!validatorInstance)
    validatorInstance = new ConfigValidator();
  return validatorInstance;
}
function validateConfig(config) {
  return getConfigValidator().validate(config);
}
function autoFixConfig(config) {
  return getConfigValidator().autoFix(config);
}

exports.ConfigValidator = ConfigValidator;
exports.autoFixConfig = autoFixConfig;
exports.getConfigValidator = getConfigValidator;
exports.validateConfig = validateConfig;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ConfigValidator.cjs.map
