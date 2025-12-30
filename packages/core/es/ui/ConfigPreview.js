/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { getConfigManager } from '../config/ConfigManager.js';
import { getPreset, presetDescriptions } from '../config/presets/index.js';
import { getFeatureFlags } from '../core/FeatureFlags.js';
import { getComponentFactory } from './base/ComponentFactory.js';
import { Modal } from './base/Modal.js';

class ConfigPreview {
  constructor() {
    this.componentFactory = getComponentFactory();
    this.configManager = getConfigManager();
    this.features = getFeatureFlags();
    this.modal = null;
    this.originalConfig = {};
  }
  /**
   * 显示预览
   */
  show(preset) {
    this.saveOriginalConfig();
    this.applyPresetPreview(preset);
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
      features: this.features.exportConfig()
    };
  }
  /**
   * 应用预设预览
   */
  applyPresetPreview(preset) {
    const config = getPreset(preset);
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
    const desc = presetDescriptions[preset];
    this.modal = new Modal({
      title: "\u914D\u7F6E\u9884\u89C8",
      width: 800,
      onClose: () => this.restoreOriginalConfig()
    });
    const content = document.createElement("div");
    content.style.cssText = "padding: 20px;";
    content.innerHTML = `
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="font-size: 64px; margin-bottom: 12px;">${desc.icon}</div>
        <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 8px;">${desc.name}</h2>
        <p style="color: #6b7280;">${desc.description}</p>
      </div>
      
      <div style="background: #f0f9ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <p style="font-size: 14px; color: #1e40af;">
          <strong>\u{1F4A1} \u63D0\u793A\uFF1A</strong> \u5F53\u524D\u6B63\u5728\u9884\u89C8\u6B64\u914D\u7F6E\u7684\u6548\u679C\u3002\u4F60\u53EF\u4EE5\uFF1A<br>
          \u2022 \u67E5\u770B\u7F16\u8F91\u5668\u7684\u53D8\u5316<br>
          \u2022 \u6D4B\u8BD5\u4E0D\u540C\u7684\u529F\u80FD<br>
          \u2022 \u70B9\u51FB"\u5E94\u7528"\u4FDD\u5B58\u914D\u7F6E\uFF0C\u6216"\u53D6\u6D88"\u6062\u590D\u539F\u914D\u7F6E
        </p>
      </div>
      
      <div id="preview-stats"></div>
    `;
    this.modal.setContent(content);
    this.modal.setFooter(this.createFooter(preset));
    this.modal.show();
    this.renderStats();
  }
  /**
   * 渲染统计信息
   */
  renderStats() {
    const statsContainer = document.getElementById("preview-stats");
    if (!statsContainer)
      return;
    const features = this.features.getStats();
    const theme = this.configManager.getThemeManager().getCurrentThemeName();
    const iconSet = this.configManager.getIconSet();
    const locale = this.configManager.getLocale();
    statsContainer.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
        <div style="padding: 12px; background: white; border-radius: 6px; border: 1px solid #e5e7eb;">
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">\u5F53\u524D\u4E3B\u9898</div>
          <div style="font-weight: 600;">${theme}</div>
        </div>
        <div style="padding: 12px; background: white; border-radius: 6px; border: 1px solid #e5e7eb;">
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">\u56FE\u6807\u96C6</div>
          <div style="font-weight: 600;">${iconSet}</div>
        </div>
        <div style="padding: 12px; background: white; border-radius: 6px; border: 1px solid #e5e7eb;">
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">\u8BED\u8A00</div>
          <div style="font-weight: 600;">${locale}</div>
        </div>
        <div style="padding: 12px; background: white; border-radius: 6px; border: 1px solid #e5e7eb;">
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">\u5DF2\u542F\u7528\u529F\u80FD</div>
          <div style="font-weight: 600; color: #10b981;">${features.enabled}</div>
        </div>
      </div>
    `;
  }
  /**
   * 创建底部按钮
   */
  createFooter(preset) {
    const footer = document.createElement("div");
    footer.style.cssText = `
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 20px;
      border-top: 1px solid var(--editor-color-border, #e5e7eb);
    `;
    const cancelBtn = this.componentFactory.createButton({
      label: "\u53D6\u6D88",
      type: "secondary",
      onClick: () => {
        this.restoreOriginalConfig();
        this.modal?.hide();
      }
    });
    const applyBtn = this.componentFactory.createButton({
      label: "\u5E94\u7528\u914D\u7F6E",
      type: "primary",
      onClick: () => {
        getPreset(preset);
        localStorage.setItem("editor-preset", preset);
        this.modal?.hide();
        ui.toast("\u914D\u7F6E\u5DF2\u5E94\u7528\uFF01", "success");
      }
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
function showConfigPreview(preset) {
  const preview = new ConfigPreview();
  preview.show(preset);
  return preview;
}

export { ConfigPreview, showConfigPreview };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ConfigPreview.js.map
