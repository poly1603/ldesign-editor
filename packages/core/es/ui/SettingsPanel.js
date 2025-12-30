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
import { getComponentFactory } from './base/ComponentFactory.js';
import { Modal } from './base/Modal.js';

class SettingsPanel {
  constructor(options = {}) {
    this.modal = null;
    this.container = null;
    // 临时配置（用于预览）
    this.tempConfig = {
      iconSet: "",
      theme: "",
      locale: ""
    };
    this.options = options;
    this.configManager = getConfigManager();
    this.componentFactory = getComponentFactory();
    this.tempConfig = {
      iconSet: this.configManager.getIconSet(),
      theme: this.configManager.getThemeManager().getCurrentThemeName(),
      locale: this.configManager.getLocale()
    };
  }
  /**
   * 显示设置面板
   */
  show() {
    this.modal = new Modal({
      title: this.configManager.t("editor.settings.title") || "\u7F16\u8F91\u5668\u8BBE\u7F6E",
      width: typeof this.options.width === "string" ? Number.parseInt(this.options.width) : 600,
      height: typeof this.options.height === "string" ? Number.parseInt(this.options.height) : 600
    });
    const content = this.createContent();
    this.modal.setContent(content);
    this.modal.setFooter(this.createFooter());
    this.modal.show();
  }
  /**
   * 隐藏设置面板
   */
  hide() {
    if (this.modal) {
      this.modal.hide();
      this.modal = null;
    }
  }
  /**
   * 创建内容
   */
  createContent() {
    this.container = document.createElement("div");
    this.container.className = "settings-panel";
    this.container.style.cssText = `
      padding: 20px;
      max-height: 70vh;
      overflow-y: auto;
    `;
    const tabs = this.createTabs();
    this.container.appendChild(tabs);
    return this.container;
  }
  /**
   * 创建选项卡
   */
  createTabs() {
    const tabsContainer = document.createElement("div");
    tabsContainer.className = "settings-tabs";
    const tabButtons = document.createElement("div");
    tabButtons.className = "tab-buttons";
    tabButtons.style.cssText = `
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--editor-color-border, #e5e7eb);
    `;
    const tabContents = document.createElement("div");
    tabContents.className = "tab-contents";
    const tabs = [{
      id: "appearance",
      label: this.configManager.t("editor.settings.appearance") || "\u5916\u89C2",
      content: this.createAppearanceTab()
    }, {
      id: "icons",
      label: this.configManager.t("editor.settings.icons") || "\u56FE\u6807",
      content: this.createIconsTab()
    }, {
      id: "language",
      label: this.configManager.t("editor.settings.language") || "\u8BED\u8A00",
      content: this.createLanguageTab()
    }, {
      id: "advanced",
      label: this.configManager.t("editor.settings.advanced") || "\u9AD8\u7EA7",
      content: this.createAdvancedTab()
    }];
    tabs.forEach((tab, index) => {
      const button = this.componentFactory.createButton({
        label: tab.label,
        type: "text",
        className: index === 0 ? "active" : ""
      });
      button.style.cssText += `
        border-bottom: 2px solid transparent;
        border-radius: 0;
        padding: 12px 16px;
      `;
      button.addEventListener("click", () => {
        tabButtons.querySelectorAll("button").forEach((btn) => {
          btn.classList.remove("active");
          btn.style.borderBottomColor = "transparent";
          btn.style.color = "var(--editor-color-text-secondary, #6b7280)";
        });
        button.classList.add("active");
        button.style.borderBottomColor = "var(--editor-color-primary, #3b82f6)";
        button.style.color = "var(--editor-color-primary, #3b82f6)";
        tabContents.querySelectorAll(".tab-pane").forEach((pane) => {
          pane.classList.remove("active");
          pane.style.display = "none";
        });
        tab.content.classList.add("active");
        tab.content.style.display = "block";
      });
      tabButtons.appendChild(button);
      tab.content.style.display = index === 0 ? "block" : "none";
      tabContents.appendChild(tab.content);
    });
    const firstButton = tabButtons.querySelector("button");
    if (firstButton) {
      firstButton.style.borderBottomColor = "var(--editor-color-primary, #3b82f6)";
      firstButton.style.color = "var(--editor-color-primary, #3b82f6)";
    }
    tabsContainer.appendChild(tabButtons);
    tabsContainer.appendChild(tabContents);
    return tabsContainer;
  }
  /**
   * 创建外观选项卡
   */
  createAppearanceTab() {
    const pane = document.createElement("div");
    pane.className = "tab-pane";
    const themeGroup = this.componentFactory.createFormGroup(this.configManager.t("editor.settings.theme") || "\u4E3B\u9898", this.componentFactory.createSelect({
      options: this.configManager.getAvailableThemes().map((theme) => ({
        label: theme,
        value: theme
      })),
      value: this.tempConfig.theme,
      onChange: (value) => {
        this.tempConfig.theme = String(value);
        this.previewTheme(String(value));
      }
    }));
    pane.appendChild(themeGroup);
    const previewCard = this.createThemePreview();
    pane.appendChild(previewCard);
    const followSystemCheck = this.componentFactory.createCheckbox(this.configManager.t("editor.settings.followSystem") || "\u8DDF\u968F\u7CFB\u7EDF\u4E3B\u9898", false, (checked) => {
      if (checked)
        this.configManager.getThemeManager().followSystemTheme();
    });
    pane.appendChild(followSystemCheck);
    return pane;
  }
  /**
   * 创建图标选项卡
   */
  createIconsTab() {
    const pane = document.createElement("div");
    pane.className = "tab-pane";
    const iconSetGroup = this.componentFactory.createFormGroup(this.configManager.t("editor.settings.iconSet") || "\u56FE\u6807\u96C6", this.componentFactory.createSelect({
      options: this.configManager.getAvailableIconSets().map((set) => ({
        label: set,
        value: set
      })),
      value: this.tempConfig.iconSet,
      onChange: (value) => {
        this.tempConfig.iconSet = String(value);
        this.previewIcons(String(value));
      }
    }));
    pane.appendChild(iconSetGroup);
    const previewCard = this.createIconPreview();
    pane.appendChild(previewCard);
    return pane;
  }
  /**
   * 创建语言选项卡
   */
  createLanguageTab() {
    const pane = document.createElement("div");
    pane.className = "tab-pane";
    const localeMap = {
      "zh-CN": "\u7B80\u4F53\u4E2D\u6587",
      "en-US": "English",
      "ja-JP": "\u65E5\u672C\u8A9E"
    };
    const localeGroup = this.componentFactory.createFormGroup(this.configManager.t("editor.settings.locale") || "\u8BED\u8A00", this.componentFactory.createSelect({
      options: this.configManager.getAvailableLocales().map((locale) => ({
        label: localeMap[locale] || locale,
        value: locale
      })),
      value: this.tempConfig.locale,
      onChange: (value) => {
        this.tempConfig.locale = String(value);
      }
    }));
    pane.appendChild(localeGroup);
    const note = document.createElement("p");
    note.style.cssText = `
      margin-top: 16px;
      padding: 12px;
      background: var(--editor-color-background-paper, #f9fafb);
      border-radius: 6px;
      font-size: 14px;
      color: var(--editor-color-text-secondary, #6b7280);
    `;
    note.textContent = this.configManager.t("editor.settings.localeNote") || "\u66F4\u6539\u8BED\u8A00\u540E\u9700\u8981\u4FDD\u5B58\u8BBE\u7F6E\u624D\u80FD\u751F\u6548";
    pane.appendChild(note);
    return pane;
  }
  /**
   * 创建高级选项卡
   */
  createAdvancedTab() {
    const pane = document.createElement("div");
    pane.className = "tab-pane";
    const exportCard = this.componentFactory.createCard({
      title: this.configManager.t("editor.settings.exportConfig") || "\u5BFC\u51FA\u914D\u7F6E",
      content: (() => {
        const container = document.createElement("div");
        const desc = document.createElement("p");
        desc.style.cssText = `
          margin-bottom: 12px;
          font-size: 14px;
          color: var(--editor-color-text-secondary, #6b7280);
        `;
        desc.textContent = "\u5C06\u5F53\u524D\u914D\u7F6E\u5BFC\u51FA\u4E3AJSON\u6587\u4EF6";
        container.appendChild(desc);
        const exportBtn = this.componentFactory.createButton({
          label: "\u5BFC\u51FA\u914D\u7F6E",
          icon: "download",
          type: "secondary",
          onClick: () => this.exportConfig()
        });
        container.appendChild(exportBtn);
        return container;
      })()
    });
    pane.appendChild(exportCard);
    pane.appendChild(this.componentFactory.createDivider());
    const importCard = this.componentFactory.createCard({
      title: this.configManager.t("editor.settings.importConfig") || "\u5BFC\u5165\u914D\u7F6E",
      content: (() => {
        const container = document.createElement("div");
        const desc = document.createElement("p");
        desc.style.cssText = `
          margin-bottom: 12px;
          font-size: 14px;
          color: var(--editor-color-text-secondary, #6b7280);
        `;
        desc.textContent = "\u4ECEJSON\u6587\u4EF6\u5BFC\u5165\u914D\u7F6E";
        container.appendChild(desc);
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json";
        fileInput.style.display = "none";
        fileInput.addEventListener("change", (e) => this.importConfig(e));
        const importBtn = this.componentFactory.createButton({
          label: "\u9009\u62E9\u6587\u4EF6",
          icon: "upload",
          type: "secondary",
          onClick: () => fileInput.click()
        });
        container.appendChild(fileInput);
        container.appendChild(importBtn);
        return container;
      })()
    });
    pane.appendChild(importCard);
    pane.appendChild(this.componentFactory.createDivider());
    const resetCard = this.componentFactory.createCard({
      title: this.configManager.t("editor.settings.resetConfig") || "\u91CD\u7F6E\u914D\u7F6E",
      content: (() => {
        const container = document.createElement("div");
        const desc = document.createElement("p");
        desc.style.cssText = `
          margin-bottom: 12px;
          font-size: 14px;
          color: var(--editor-color-error, #ef4444);
        `;
        desc.textContent = "\u5C06\u6240\u6709\u8BBE\u7F6E\u6062\u590D\u4E3A\u9ED8\u8BA4\u503C";
        container.appendChild(desc);
        const resetBtn = this.componentFactory.createButton({
          label: "\u91CD\u7F6E\u4E3A\u9ED8\u8BA4",
          icon: "refresh-cw",
          type: "danger",
          onClick: () => this.resetConfig()
        });
        container.appendChild(resetBtn);
        return container;
      })()
    });
    pane.appendChild(resetCard);
    return pane;
  }
  /**
   * 创建主题预览
   */
  createThemePreview() {
    const card = this.componentFactory.createCard({
      title: "\u9884\u89C8",
      className: "theme-preview"
    });
    const preview = document.createElement("div");
    preview.style.cssText = `
      padding: 16px;
      border-radius: 6px;
      background: var(--editor-color-editor-background, #ffffff);
      color: var(--editor-color-editor-text, #1f2937);
    `;
    preview.innerHTML = `
      <div style="margin-bottom: 8px; font-weight: 600;">\u793A\u4F8B\u6587\u672C</div>
      <div style="margin-bottom: 8px; color: var(--editor-color-text-secondary, #6b7280);">\u6B21\u8981\u6587\u672C</div>
      <div style="padding: 8px; background: var(--editor-color-code-background, #f3f4f6); border-radius: 4px;">
        <code>\u4EE3\u7801\u793A\u4F8B</code>
      </div>
    `;
    card.querySelector(".card-content")?.appendChild(preview);
    return card;
  }
  /**
   * 创建图标预览
   */
  createIconPreview() {
    const card = this.componentFactory.createCard({
      title: "\u56FE\u6807\u9884\u89C8",
      className: "icon-preview"
    });
    const preview = document.createElement("div");
    preview.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
      gap: 12px;
      padding: 16px;
    `;
    const iconManager = this.configManager.getIconManager();
    const sampleIcons = ["bold", "italic", "underline", "link", "image", "code", "list", "quote"];
    sampleIcons.forEach((iconName) => {
      const iconEl = iconManager.createIconElement(iconName, {
        size: 24
      });
      iconEl.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
        border-radius: 6px;
        background: var(--editor-color-background-paper, #f9fafb);
        cursor: pointer;
        transition: all 0.2s;
      `;
      iconEl.addEventListener("mouseenter", () => {
        iconEl.style.background = "var(--editor-color-toolbar-button-hover, #e5e7eb)";
      });
      iconEl.addEventListener("mouseleave", () => {
        iconEl.style.background = "var(--editor-color-background-paper, #f9fafb)";
      });
      preview.appendChild(iconEl);
    });
    card.querySelector(".card-content")?.appendChild(preview);
    return card;
  }
  /**
   * 创建底部按钮
   */
  createFooter() {
    const footer = document.createElement("div");
    footer.style.cssText = `
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 20px;
      border-top: 1px solid var(--editor-color-border, #e5e7eb);
    `;
    const cancelBtn = this.componentFactory.createButton({
      label: this.configManager.t("editor.dialog.cancel") || "\u53D6\u6D88",
      type: "secondary",
      onClick: () => this.handleClose()
    });
    const saveBtn = this.componentFactory.createButton({
      label: this.configManager.t("editor.dialog.save") || "\u4FDD\u5B58",
      type: "primary",
      onClick: () => this.handleSave()
    });
    footer.appendChild(cancelBtn);
    footer.appendChild(saveBtn);
    return footer;
  }
  /**
   * 预览主题
   */
  previewTheme(themeName) {
    this.configManager.setTheme(themeName);
  }
  /**
   * 预览图标
   */
  previewIcons(iconSet) {
    const preview = this.container?.querySelector(".icon-preview .card-content > div");
    if (preview) {
      preview.innerHTML = "";
      const iconManager = this.configManager.getIconManager();
      const sampleIcons = ["bold", "italic", "underline", "link", "image", "code", "list", "quote"];
      sampleIcons.forEach((iconName) => {
        const iconEl = iconManager.createIconElement(iconName, {
          size: 24
        });
        iconEl.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          border-radius: 6px;
          background: var(--editor-color-background-paper, #f9fafb);
        `;
        preview.appendChild(iconEl);
      });
    }
  }
  /**
   * 导出配置
   */
  exportConfig() {
    const config = this.configManager.exportConfig();
    const blob = new Blob([config], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `editor-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  /**
   * 导入配置
   */
  importConfig(e) {
    const file = e.target.files?.[0];
    if (!file)
      return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const config = event.target?.result;
        this.configManager.importConfig(config);
        this.tempConfig = {
          iconSet: this.configManager.getIconSet(),
          theme: this.configManager.getThemeManager().getCurrentThemeName(),
          locale: this.configManager.getLocale()
        };
        this.hide();
        this.show();
        alert("\u914D\u7F6E\u5BFC\u5165\u6210\u529F\uFF01");
      } catch (error) {
        alert(`\u914D\u7F6E\u5BFC\u5165\u5931\u8D25\uFF1A${error.message}`);
      }
    };
    reader.readAsText(file);
  }
  /**
   * 重置配置
   */
  resetConfig() {
    if (!confirm("\u786E\u5B9A\u8981\u91CD\u7F6E\u6240\u6709\u914D\u7F6E\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002"))
      return;
    this.configManager.reset();
    this.tempConfig = {
      iconSet: this.configManager.getIconSet(),
      theme: this.configManager.getThemeManager().getCurrentThemeName(),
      locale: this.configManager.getLocale()
    };
    this.hide();
    this.show();
  }
  /**
   * 处理关闭
   */
  handleClose() {
    this.configManager.setTheme(this.configManager.getThemeManager().getCurrentThemeName());
    this.hide();
    if (this.options.onClose)
      this.options.onClose();
  }
  /**
   * 处理保存
   */
  async handleSave() {
    this.configManager.setIconSet(this.tempConfig.iconSet);
    this.configManager.setTheme(this.tempConfig.theme);
    await this.configManager.setLocale(this.tempConfig.locale);
    this.hide();
    if (this.options.onSave)
      this.options.onSave(this.tempConfig);
  }
}
function showSettingsPanel(options) {
  const panel = new SettingsPanel(options);
  panel.show();
  return panel;
}

export { SettingsPanel, showSettingsPanel };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=SettingsPanel.js.map
