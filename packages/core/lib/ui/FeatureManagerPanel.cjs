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

var FeatureFlags = require('../core/FeatureFlags.cjs');
var LazyLoader = require('../core/LazyLoader.cjs');
var PluginRegistry = require('../core/PluginRegistry.cjs');
var ComponentFactory = require('./base/ComponentFactory.cjs');
var Modal = require('./base/Modal.cjs');

class FeatureManagerPanel {
  constructor() {
    this.featureFlags = FeatureFlags.getFeatureFlags();
    this.pluginRegistry = PluginRegistry.getPluginRegistry();
    this.lazyLoader = LazyLoader.getLazyLoader();
    this.componentFactory = ComponentFactory.getComponentFactory();
    this.modal = null;
    this.container = null;
  }
  /**
   * 显示面板
   */
  show() {
    this.modal = new Modal.Modal({
      title: "\u529F\u80FD\u7BA1\u7406",
      width: 900,
      height: 600
    });
    const content = this.createContent();
    this.modal.setContent(content);
    this.modal.setFooter(this.createFooter());
    this.modal.show();
  }
  /**
   * 隐藏面板
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
    this.container.className = "feature-manager";
    this.container.style.cssText = `
      padding: 20px;
      max-height: 70vh;
      overflow-y: auto;
    `;
    const stats = this.createStats();
    this.container.appendChild(stats);
    this.container.appendChild(this.componentFactory.createDivider());
    const categories = Object.values(FeatureFlags.FeatureCategory);
    categories.forEach((category) => {
      const features = this.featureFlags.getByCategory(category);
      if (features.length === 0)
        return;
      const section = this.createCategorySection(category, features);
      this.container.appendChild(section);
    });
    return this.container;
  }
  /**
   * 创建统计信息
   */
  createStats() {
    const stats = this.featureFlags.getStats();
    const pluginStats = this.pluginRegistry.getStats();
    const loaderStats = this.lazyLoader.getStats();
    const card = this.componentFactory.createCard({
      title: "\u529F\u80FD\u7EDF\u8BA1",
      className: "stats-card"
    });
    const statsGrid = document.createElement("div");
    statsGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 16px;
    `;
    const statItems = [{
      label: "\u603B\u529F\u80FD\u6570",
      value: stats.total,
      color: "#3b82f6"
    }, {
      label: "\u5DF2\u542F\u7528",
      value: stats.enabled,
      color: "#10b981"
    }, {
      label: "\u5DF2\u7981\u7528",
      value: stats.disabled,
      color: "#6b7280"
    }, {
      label: "\u5DF2\u52A0\u8F7D",
      value: stats.loaded,
      color: "#8b5cf6"
    }, {
      label: "\u61D2\u52A0\u8F7D",
      value: stats.lazy,
      color: "#f59e0b"
    }, {
      label: "\u63D2\u4EF6\u603B\u6570",
      value: pluginStats.total,
      color: "#3b82f6"
    }, {
      label: "\u6D3B\u8DC3\u63D2\u4EF6",
      value: pluginStats.loaded,
      color: "#10b981"
    }, {
      label: "\u52A0\u8F7D\u961F\u5217",
      value: loaderStats.queued,
      color: "#f59e0b"
    }];
    statItems.forEach(({
      label,
      value,
      color
    }) => {
      const item = document.createElement("div");
      item.style.cssText = `
        text-align: center;
        padding: 12px;
        background: var(--editor-color-background-paper, #f9fafb);
        border-radius: 6px;
      `;
      item.innerHTML = `
        <div style="font-size: 24px; font-weight: 700; color: ${color}; margin-bottom: 4px;">${value}</div>
        <div style="font-size: 12px; color: #6b7280;">${label}</div>
      `;
      statsGrid.appendChild(item);
    });
    const cardContent = card.querySelector(".card-content");
    if (cardContent) {
      cardContent.appendChild(statsGrid);
    } else {
      card.appendChild(statsGrid);
    }
    return card;
  }
  /**
   * 创建分类区块
   */
  createCategorySection(category, features) {
    const section = document.createElement("div");
    section.className = "category-section";
    section.style.cssText = `
      margin-bottom: 24px;
    `;
    const header = document.createElement("div");
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--editor-color-border, #e5e7eb);
    `;
    const categoryNames = {
      [FeatureFlags.FeatureCategory.CORE]: "\u{1F3AF} \u6838\u5FC3\u529F\u80FD",
      [FeatureFlags.FeatureCategory.FORMAT]: "\u{1F3A8} \u683C\u5F0F\u5316",
      [FeatureFlags.FeatureCategory.INSERT]: "\u2795 \u63D2\u5165",
      [FeatureFlags.FeatureCategory.MEDIA]: "\u{1F5BC}\uFE0F \u5A92\u4F53",
      [FeatureFlags.FeatureCategory.TABLE]: "\u{1F4CA} \u8868\u683C",
      [FeatureFlags.FeatureCategory.AI]: "\u{1F916} AI",
      [FeatureFlags.FeatureCategory.TOOL]: "\u{1F527} \u5DE5\u5177",
      [FeatureFlags.FeatureCategory.ADVANCED]: "\u2699\uFE0F \u9AD8\u7EA7"
    };
    header.innerHTML = `
      <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${categoryNames[category]}</h3>
      <div style="display: flex; gap: 8px;"></div>
    `;
    const actions = header.querySelector("div");
    const enableAllBtn = this.componentFactory.createButton({
      label: "\u5168\u90E8\u542F\u7528",
      type: "text",
      size: "small",
      onClick: () => {
        this.featureFlags.enableCategory(category);
        this.refreshCategorySection(section, category);
      }
    });
    const disableAllBtn = this.componentFactory.createButton({
      label: "\u5168\u90E8\u7981\u7528",
      type: "text",
      size: "small",
      onClick: () => {
        this.featureFlags.disableCategory(category);
        this.refreshCategorySection(section, category);
      }
    });
    actions?.appendChild(enableAllBtn);
    actions?.appendChild(disableAllBtn);
    section.appendChild(header);
    const list = document.createElement("div");
    list.className = "feature-list";
    list.style.cssText = `
      display: grid;
      gap: 8px;
    `;
    features.forEach((feature) => {
      const item = this.createFeatureItem(feature);
      list.appendChild(item);
    });
    section.appendChild(list);
    return section;
  }
  /**
   * 创建功能项
   */
  createFeatureItem(feature) {
    const item = document.createElement("div");
    item.className = "feature-item";
    item.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: var(--editor-color-background-paper, #f9fafb);
      border-radius: 6px;
      transition: all 0.2s;
    `;
    item.addEventListener("mouseenter", () => {
      item.style.background = "var(--editor-color-toolbar-button-hover, #e5e7eb)";
    });
    item.addEventListener("mouseleave", () => {
      item.style.background = "var(--editor-color-background-paper, #f9fafb)";
    });
    const info = document.createElement("div");
    info.style.cssText = "flex: 1;";
    const isLoaded = this.featureFlags.isLoaded(feature.id);
    info.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <span style="font-weight: 600; font-size: 14px;">${feature.name}</span>
        ${feature.lazy ? '<span style="background: #f59e0b; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">\u61D2\u52A0\u8F7D</span>' : ""}
        ${isLoaded ? '<span style="background: #10b981; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">\u5DF2\u52A0\u8F7D</span>' : ""}
      </div>
      ${feature.description ? `<div style="font-size: 12px; color: #6b7280;">${feature.description}</div>` : ""}
      ${feature.dependencies ? `<div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">\u4F9D\u8D56: ${feature.dependencies.join(", ")}</div>` : ""}
    `;
    const toggle = this.createToggle(feature);
    item.appendChild(info);
    item.appendChild(toggle);
    return item;
  }
  /**
   * 创建开关
   */
  createToggle(feature) {
    const container = document.createElement("label");
    container.className = "feature-toggle";
    container.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    `;
    const switchEl = document.createElement("div");
    switchEl.className = "toggle-switch";
    switchEl.style.cssText = `
      width: 44px;
      height: 24px;
      background: ${feature.enabled ? "#10b981" : "#d1d5db"};
      border-radius: 12px;
      position: relative;
      transition: all 0.2s;
    `;
    const knob = document.createElement("div");
    knob.style.cssText = `
      position: absolute;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      top: 2px;
      left: ${feature.enabled ? "22px" : "2px"};
      transition: all 0.2s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    `;
    switchEl.appendChild(knob);
    container.addEventListener("click", () => {
      const newState = this.featureFlags.toggle(feature.id);
      switchEl.style.background = newState ? "#10b981" : "#d1d5db";
      knob.style.left = newState ? "22px" : "2px";
    });
    container.appendChild(switchEl);
    return container;
  }
  /**
   * 刷新分类区块
   */
  refreshCategorySection(section, category) {
    const list = section.querySelector(".feature-list");
    if (!list)
      return;
    list.innerHTML = "";
    const features = this.featureFlags.getByCategory(category);
    features.forEach((feature) => {
      const item = this.createFeatureItem(feature);
      list.appendChild(item);
    });
  }
  /**
   * 创建底部按钮
   */
  createFooter() {
    const footer = document.createElement("div");
    footer.style.cssText = `
      display: flex;
      justify-content: space-between;
      padding: 16px 20px;
      border-top: 1px solid var(--editor-color-border, #e5e7eb);
    `;
    const leftButtons = document.createElement("div");
    leftButtons.style.cssText = "display: flex; gap: 8px;";
    const exportBtn = this.componentFactory.createButton({
      label: "\u5BFC\u51FA\u914D\u7F6E",
      icon: "download",
      type: "secondary",
      onClick: () => this.exportConfig()
    });
    const importBtn = this.componentFactory.createButton({
      label: "\u5BFC\u5165\u914D\u7F6E",
      icon: "upload",
      type: "secondary",
      onClick: () => this.importConfig()
    });
    const resetBtn = this.componentFactory.createButton({
      label: "\u91CD\u7F6E",
      icon: "refresh-cw",
      type: "secondary",
      onClick: () => this.resetConfig()
    });
    leftButtons.appendChild(exportBtn);
    leftButtons.appendChild(importBtn);
    leftButtons.appendChild(resetBtn);
    const rightButtons = document.createElement("div");
    rightButtons.style.cssText = "display: flex; gap: 8px;";
    const applyBtn = this.componentFactory.createButton({
      label: "\u5E94\u7528",
      type: "primary",
      onClick: () => this.applyChanges()
    });
    const closeBtn = this.componentFactory.createButton({
      label: "\u5173\u95ED",
      type: "secondary",
      onClick: () => this.hide()
    });
    rightButtons.appendChild(applyBtn);
    rightButtons.appendChild(closeBtn);
    footer.appendChild(leftButtons);
    footer.appendChild(rightButtons);
    return footer;
  }
  /**
   * 导出配置
   */
  exportConfig() {
    const config = {
      features: this.featureFlags.exportConfig(),
      plugins: this.pluginRegistry.exportConfig()
    };
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feature-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  /**
   * 导入配置
   */
  importConfig() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file)
        return;
      try {
        const text = await file.text();
        const config = JSON.parse(text);
        if (config.features)
          this.featureFlags.importConfig(config.features);
        if (config.plugins)
          this.pluginRegistry.importConfig(config.plugins);
        alert("\u914D\u7F6E\u5BFC\u5165\u6210\u529F\uFF01");
        this.hide();
        this.show();
      } catch (error) {
        alert(`\u914D\u7F6E\u5BFC\u5165\u5931\u8D25\uFF1A${error.message}`);
      }
    });
    input.click();
  }
  /**
   * 重置配置
   */
  resetConfig() {
    if (!confirm("\u786E\u5B9A\u8981\u91CD\u7F6E\u6240\u6709\u529F\u80FD\u914D\u7F6E\u5417\uFF1F"))
      return;
    this.featureFlags.reset();
    this.pluginRegistry.reset();
    this.hide();
    this.show();
  }
  /**
   * 应用更改
   */
  async applyChanges() {
    const config = {
      features: this.featureFlags.exportConfig(),
      plugins: this.pluginRegistry.exportConfig()
    };
    localStorage.setItem("editor-feature-config", JSON.stringify(config));
    alert("\u914D\u7F6E\u5DF2\u4FDD\u5B58\uFF01\u5237\u65B0\u9875\u9762\u540E\u751F\u6548\u3002");
    this.hide();
  }
}
function showFeatureManager() {
  const panel = new FeatureManagerPanel();
  panel.show();
  return panel;
}

exports.FeatureManagerPanel = FeatureManagerPanel;
exports.showFeatureManager = showFeatureManager;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=FeatureManagerPanel.cjs.map
