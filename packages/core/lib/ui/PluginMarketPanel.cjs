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

var PluginMarket = require('../marketplace/PluginMarket.cjs');
var simplify = require('../utils/simplify.cjs');
var ComponentFactory = require('./base/ComponentFactory.cjs');
var Modal = require('./base/Modal.cjs');

class PluginMarketPanel {
  constructor() {
    this.market = PluginMarket.getPluginMarket();
    this.componentFactory = ComponentFactory.getComponentFactory();
    this.modal = null;
    this.currentView = "featured";
    this.searchQuery = "";
  }
  /**
   * 显示市场面板
   */
  show() {
    this.modal = new Modal.Modal({
      title: "\u63D2\u4EF6\u5E02\u573A",
      width: 900,
      height: 600
    });
    const content = this.createContent();
    this.modal.setContent(content);
    this.modal.show();
  }
  /**
   * 创建内容
   */
  createContent() {
    const container = document.createElement("div");
    container.style.cssText = `
      display: grid;
      grid-template-columns: 200px 1fr;
      height: 100%;
    `;
    const sidebar = this.createSidebar();
    container.appendChild(sidebar);
    const main = this.createMain();
    container.appendChild(main);
    return container;
  }
  /**
   * 创建侧边栏
   */
  createSidebar() {
    const sidebar = document.createElement("div");
    sidebar.className = "market-sidebar";
    sidebar.style.cssText = `
      border-right: 1px solid var(--editor-color-border, #e5e7eb);
      padding: 16px;
    `;
    const menuItems = [{
      id: "featured",
      label: "\u{1F31F} \u7CBE\u9009",
      view: "featured"
    }, {
      id: "popular",
      label: "\u{1F525} \u70ED\u95E8",
      view: "popular"
    }, {
      id: "installed",
      label: "\u{1F4E6} \u5DF2\u5B89\u88C5",
      view: "installed"
    }];
    menuItems.forEach((item) => {
      const menuItem = document.createElement("div");
      menuItem.className = "menu-item";
      menuItem.textContent = item.label;
      menuItem.style.cssText = `
        padding: 12px;
        cursor: pointer;
        border-radius: 6px;
        margin-bottom: 4px;
        transition: all 0.2s;
        ${this.currentView === item.view ? "background: var(--editor-color-primary, #3b82f6); color: white;" : ""}
      `;
      menuItem.addEventListener("click", () => {
        this.currentView = item.view;
        this.refreshMain();
      });
      sidebar.appendChild(menuItem);
    });
    const stats = this.market.getStats();
    const statsEl = document.createElement("div");
    statsEl.style.cssText = `
      margin-top: 20px;
      padding: 12px;
      background: var(--editor-color-background-paper, #f9fafb);
      border-radius: 6px;
      font-size: 12px;
    `;
    statsEl.innerHTML = `
      <div style="margin-bottom: 4px;">\u603B\u63D2\u4EF6: ${stats.total}</div>
      <div style="margin-bottom: 4px;">\u5DF2\u5B89\u88C5: ${stats.installed}</div>
      <div>\u53EF\u7528: ${stats.available}</div>
    `;
    sidebar.appendChild(statsEl);
    return sidebar;
  }
  /**
   * 创建主内容区
   */
  createMain() {
    const main = document.createElement("div");
    main.id = "market-main";
    main.className = "market-main";
    main.style.cssText = `
      padding: 20px;
      overflow-y: auto;
    `;
    const searchBox = this.componentFactory.createInput({
      placeholder: "\u641C\u7D22\u63D2\u4EF6...",
      onChange: (value) => {
        this.searchQuery = value;
        if (value)
          this.currentView = "search";
        this.refreshMain();
      }
    });
    main.appendChild(searchBox);
    const listContainer = document.createElement("div");
    listContainer.id = "plugin-list";
    listContainer.style.cssText = "margin-top: 20px;";
    main.appendChild(listContainer);
    this.renderPluginList(listContainer);
    return main;
  }
  /**
   * 渲染插件列表
   */
  renderPluginList(container) {
    container.innerHTML = "";
    let plugins = [];
    switch (this.currentView) {
      case "featured":
        plugins = this.market.getRecommended();
        break;
      case "popular":
        plugins = this.market.getPopular();
        break;
      case "installed":
        plugins = this.market.getInstalled();
        break;
      case "search":
        plugins = this.market.search(this.searchQuery);
        break;
    }
    if (plugins.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 40px;">\u6682\u65E0\u63D2\u4EF6</p>';
      return;
    }
    plugins.forEach((plugin) => {
      const card = this.createPluginCard(plugin);
      container.appendChild(card);
    });
  }
  /**
   * 创建插件卡片
   */
  createPluginCard(plugin) {
    const card = document.createElement("div");
    card.className = "plugin-card";
    card.style.cssText = `
      border: 1px solid var(--editor-color-border, #e5e7eb);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      transition: all 0.2s;
    `;
    card.addEventListener("mouseenter", () => {
      card.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
      card.style.borderColor = "var(--editor-color-primary, #3b82f6)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.boxShadow = "none";
      card.style.borderColor = "var(--editor-color-border, #e5e7eb)";
    });
    const isInstalled = this.market.isInstalled(plugin.id);
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 24px;">${plugin.icon || "\u{1F50C}"}</span>
            <h3 style="font-size: 18px; font-weight: 600; margin: 0;">${plugin.name}</h3>
            <span style="font-size: 12px; color: #6b7280;">v${plugin.version}</span>
          </div>
          <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">${plugin.description}</div>
          <div style="display: flex; gap: 16px; font-size: 12px; color: #9ca3af;">
            <span>\u2B50 ${plugin.rating.toFixed(1)}</span>
            <span>\u{1F4E5} ${plugin.downloads}</span>
            <span>\u{1F4E6} ${plugin.size}KB</span>
            <span>\u{1F464} ${plugin.author}</span>
          </div>
        </div>
        <div id="btn-${plugin.id}"></div>
      </div>
      <div style="display: flex; gap: 4px; flex-wrap: wrap;">
        ${plugin.tags.map((tag) => `
          <span style="padding: 2px 8px; background: #f3f4f6; border-radius: 3px; font-size: 11px; color: #6b7280;">
            ${tag}
          </span>
        `).join("")}
      </div>
    `;
    const btnContainer = card.querySelector(`#btn-${plugin.id}`);
    if (btnContainer) {
      if (isInstalled) {
        const uninstallBtn = this.componentFactory.createButton({
          label: "\u5378\u8F7D",
          type: "secondary",
          size: "small",
          onClick: () => this.uninstallPlugin(plugin.id)
        });
        btnContainer.appendChild(uninstallBtn);
      } else {
        const installBtn = this.componentFactory.createButton({
          label: "\u5B89\u88C5",
          type: "primary",
          size: "small",
          onClick: () => this.installPlugin(plugin.id)
        });
        btnContainer.appendChild(installBtn);
      }
    }
    return card;
  }
  /**
   * 安装插件
   */
  async installPlugin(pluginId) {
    try {
      simplify.ui.toast("\u6B63\u5728\u5B89\u88C5...", "info");
      await this.market.install(pluginId);
      simplify.ui.toast("\u5B89\u88C5\u6210\u529F\uFF01", "success");
      this.refreshMain();
    } catch (error) {
      simplify.ui.toast(`\u5B89\u88C5\u5931\u8D25\uFF1A${error.message}`, "error");
    }
  }
  /**
   * 卸载插件
   */
  async uninstallPlugin(pluginId) {
    if (!confirm("\u786E\u5B9A\u8981\u5378\u8F7D\u8FD9\u4E2A\u63D2\u4EF6\u5417\uFF1F"))
      return;
    try {
      await this.market.uninstall(pluginId);
      simplify.ui.toast("\u5378\u8F7D\u6210\u529F\uFF01", "success");
      this.refreshMain();
    } catch (error) {
      simplify.ui.toast(`\u5378\u8F7D\u5931\u8D25\uFF1A${error.message}`, "error");
    }
  }
  /**
   * 刷新主内容区
   */
  refreshMain() {
    const listContainer = document.getElementById("plugin-list");
    if (listContainer)
      this.renderPluginList(listContainer);
  }
}
function showPluginMarket() {
  const panel = new PluginMarketPanel();
  panel.show();
  return panel;
}

exports.PluginMarketPanel = PluginMarketPanel;
exports.showPluginMarket = showPluginMarket;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=PluginMarketPanel.cjs.map
