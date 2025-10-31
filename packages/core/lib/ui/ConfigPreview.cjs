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

var ConfigManager = require('../config/ConfigManager.cjs');
var index = require('../config/presets/index.cjs');
var FeatureFlags = require('../core/FeatureFlags.cjs');
var ComponentFactory = require('./base/ComponentFactory.cjs');
var Modal = require('./base/Modal.cjs');

/**
 * 实时配置预览
 * 在不保存的情况下预览配置效果
 */
/**
 * 配置预览类
 */
class ConfigPreview {
    constructor() {
        this.componentFactory = ComponentFactory.getComponentFactory();
        this.configManager = ConfigManager.getConfigManager();
        this.features = FeatureFlags.getFeatureFlags();
        this.modal = null;
        this.originalConfig = {};
    }
    /**
     * 显示预览
     */
    show(preset) {
        // 保存原始配置
        this.saveOriginalConfig();
        // 应用预览配置
        this.applyPresetPreview(preset);
        // 显示预览面板
        this.showPreviewPanel(preset);
    }
    /**
     * 保存原始配置
     */
    saveOriginalConfig() {
        this.originalConfig = {
            theme: this.configManager.getThemeManager().getCurrentThemeName(),
            iconSet: this.configManager.getIconSet(),
            locale: this.configManager.getLocale(),
            features: this.features.exportConfig(),
        };
    }
    /**
     * 应用预设预览
     */
    applyPresetPreview(preset) {
        const config = index.getPreset(preset);
        // 应用配置（预览）
        if (config.theme?.defaultTheme)
            this.configManager.setTheme(config.theme.defaultTheme);
        if (config.icons?.defaultSet)
            this.configManager.setIconSet(config.icons.defaultSet);
        if (config.features)
            this.features.importConfig(config.features);
    }
    /**
     * 显示预览面板
     */
    showPreviewPanel(preset) {
        const desc = index.presetDescriptions[preset];
        this.modal = new Modal.Modal({
            title: '配置预览',
            width: '700px',
            height: 'auto',
            onClose: () => this.restoreOriginalConfig(),
        });
        const content = document.createElement('div');
        content.style.cssText = 'padding: 20px;';
        content.innerHTML = `
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="font-size: 64px; margin-bottom: 12px;">${desc.icon}</div>
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 8px;">${desc.name}</h2>
        <p style="color: #6b7280;">${desc.description}</p>
      </div>
      
      <div style="background: #f0f9ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <p style="font-size: 14px; color: #1e40af;">
          <strong>💡 提示：</strong> 当前正在预览此配置的效果。你可以：<br>
          • 查看编辑器的变化<br>
          • 测试不同的功能<br>
          • 点击"应用"保存配置，或"取消"恢复原配置
        </p>
      </div>
      
      <div id="preview-stats"></div>
    `;
        this.modal.setContent(content);
        this.modal.setFooter(this.createFooter(preset));
        this.modal.show();
        // 渲染统计信息
        this.renderStats();
    }
    /**
     * 渲染统计信息
     */
    renderStats() {
        const statsContainer = document.getElementById('preview-stats');
        if (!statsContainer)
            return;
        const features = this.features.getStats();
        const theme = this.configManager.getThemeManager().getCurrentThemeName();
        const iconSet = this.configManager.getIconSet();
        const locale = this.configManager.getLocale();
        statsContainer.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
        <div style="padding: 12px; background: white; border-radius: 6px; border: 1px solid #e5e7eb;">
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">当前主题</div>
          <div style="font-weight: 600;">${theme}</div>
        </div>
        <div style="padding: 12px; background: white; border-radius: 6px; border: 1px solid #e5e7eb;">
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">图标集</div>
          <div style="font-weight: 600;">${iconSet}</div>
        </div>
        <div style="padding: 12px; background: white; border-radius: 6px; border: 1px solid #e5e7eb;">
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">语言</div>
          <div style="font-weight: 600;">${locale}</div>
        </div>
        <div style="padding: 12px; background: white; border-radius: 6px; border: 1px solid #e5e7eb;">
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">已启用功能</div>
          <div style="font-weight: 600; color: #10b981;">${features.enabled}</div>
        </div>
      </div>
    `;
    }
    /**
     * 创建底部按钮
     */
    createFooter(preset) {
        const footer = document.createElement('div');
        footer.style.cssText = `
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 20px;
      border-top: 1px solid var(--editor-color-border, #e5e7eb);
    `;
        const cancelBtn = this.componentFactory.createButton({
            label: '取消',
            type: 'secondary',
            onClick: () => {
                this.restoreOriginalConfig();
                this.modal?.hide();
            },
        });
        const applyBtn = this.componentFactory.createButton({
            label: '应用配置',
            type: 'primary',
            onClick: () => {
                // 保存配置
                index.getPreset(preset);
                localStorage.setItem('editor-preset', preset);
                this.modal?.hide();
                ui.toast('配置已应用！', 'success');
            },
        });
        footer.appendChild(cancelBtn);
        footer.appendChild(applyBtn);
        return footer;
    }
    /**
     * 恢复原始配置
     */
    restoreOriginalConfig() {
        if (this.originalConfig.theme)
            this.configManager.setTheme(this.originalConfig.theme);
        if (this.originalConfig.iconSet)
            this.configManager.setIconSet(this.originalConfig.iconSet);
        if (this.originalConfig.features)
            this.features.importConfig(this.originalConfig.features);
    }
}
/**
 * 显示配置预览
 */
function showConfigPreview(preset) {
    const preview = new ConfigPreview();
    preview.show(preset);
    return preview;
}

exports.ConfigPreview = ConfigPreview;
exports.showConfigPreview = showConfigPreview;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ConfigPreview.cjs.map
