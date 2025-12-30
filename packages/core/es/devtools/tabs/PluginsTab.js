/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createLogger } from '../../utils/logger.js';

const logger = createLogger("PluginsTab");
class PluginsTab {
  constructor(options) {
    this.plugins = /* @__PURE__ */ new Map();
    this.editor = options.editor;
    this.loadPluginInfo();
  }
  /**
   * 加载插件信息
   */
  loadPluginInfo() {
    const loadedPlugins = this.editor.plugins?.getLoadedPlugins() || [];
    loadedPlugins.forEach((name) => {
      const plugin = this.editor.plugins?.get(name);
      if (plugin) {
        this.plugins.set(name, {
          name,
          version: plugin.version || "1.0.0",
          description: plugin.description,
          author: plugin.author,
          enabled: true,
          loadTime: plugin.loadTime,
          errorCount: 0,
          warningCount: 0,
          config: plugin.config
        });
      }
    });
  }
  /**
   * 渲染标签页
   */
  render() {
    this.container = document.createElement("div");
    this.container.className = "plugins-tab";
    this.container.style.cssText = `
      display: flex;
      height: 100%;
    `;
    const listContainer = this.createPluginList();
    this.detailsPanel = this.createDetailsPanel();
    this.container.appendChild(listContainer);
    this.container.appendChild(this.detailsPanel);
    return this.container;
  }
  /**
   * 创建插件列表
   */
  createPluginList() {
    const container = document.createElement("div");
    container.className = "plugins-list";
    container.style.cssText = `
      flex: 1;
      overflow-y: auto;
      border-right: 1px solid #e0e0e0;
      padding: 20px;
    `;
    const header = document.createElement("div");
    header.style.cssText = `
      margin-bottom: 20px;
    `;
    header.innerHTML = `
      <h3 style="margin: 0 0 10px 0; font-size: 16px;">\u5DF2\u52A0\u8F7D\u63D2\u4EF6</h3>
      <p style="margin: 0; font-size: 12px; color: #666;">
        \u5171 ${this.plugins.size} \u4E2A\u63D2\u4EF6
      </p>
    `;
    const pluginCards = document.createElement("div");
    pluginCards.className = "plugin-cards";
    pluginCards.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;
    this.plugins.forEach((plugin, name) => {
      const card = this.createPluginCard(plugin);
      pluginCards.appendChild(card);
    });
    if (this.plugins.size === 0) {
      pluginCards.innerHTML = `
        <div style="
          padding: 40px;
          text-align: center;
          color: #999;
          background: #f5f5f5;
          border-radius: 8px;
        ">
          <div style="font-size: 32px; margin-bottom: 10px;">\u{1F50C}</div>
          <div>\u6682\u65E0\u5DF2\u52A0\u8F7D\u7684\u63D2\u4EF6</div>
        </div>
      `;
    }
    container.appendChild(header);
    container.appendChild(pluginCards);
    return container;
  }
  /**
   * 创建插件卡片
   */
  createPluginCard(plugin) {
    const card = document.createElement("div");
    card.className = `plugin-card plugin-${plugin.name}`;
    card.style.cssText = `
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    `;
    const statusColor = plugin.errorCount > 0 ? "#f44336" : plugin.warningCount > 0 ? "#ff9800" : plugin.enabled ? "#4caf50" : "#999";
    card.innerHTML = `
      <div style="display: flex; align-items: start; justify-content: space-between;">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <h4 style="margin: 0; font-size: 14px; color: #333;">${plugin.name}</h4>
            <span style="
              background: ${statusColor};
              color: white;
              padding: 2px 6px;
              border-radius: 3px;
              font-size: 10px;
            ">${plugin.enabled ? "\u542F\u7528" : "\u7981\u7528"}</span>
            ${plugin.version ? `
              <span style="
                background: #e0e0e0;
                color: #666;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 10px;
              ">v${plugin.version}</span>
            ` : ""}
          </div>
          ${plugin.description ? `
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">
              ${plugin.description}
            </p>
          ` : ""}
          <div style="display: flex; gap: 15px; font-size: 11px; color: #999;">
            ${plugin.author ? `<span>\u4F5C\u8005: ${plugin.author}</span>` : ""}
            ${plugin.loadTime ? `<span>\u52A0\u8F7D: ${plugin.loadTime}ms</span>` : ""}
            ${plugin.errorCount > 0 ? `
              <span style="color: #f44336;">
                ${plugin.errorCount} \u4E2A\u9519\u8BEF
              </span>
            ` : ""}
            ${plugin.warningCount > 0 ? `
              <span style="color: #ff9800;">
                ${plugin.warningCount} \u4E2A\u8B66\u544A
              </span>
            ` : ""}
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button onclick="event.stopPropagation()" style="
            padding: 4px 8px;
            background: transparent;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
          " data-action="toggle" data-plugin="${plugin.name}">
            ${plugin.enabled ? "\u7981\u7528" : "\u542F\u7528"}
          </button>
          <button onclick="event.stopPropagation()" style="
            padding: 4px 8px;
            background: transparent;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
          " data-action="reload" data-plugin="${plugin.name}">
            \u91CD\u8F7D
          </button>
        </div>
      </div>
    `;
    card.onclick = () => this.showPluginDetails(plugin.name);
    card.onmouseenter = () => {
      card.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      card.style.transform = "translateY(-1px)";
    };
    card.onmouseleave = () => {
      card.style.boxShadow = "none";
      card.style.transform = "translateY(0)";
    };
    const toggleBtn = card.querySelector('[data-action="toggle"]');
    if (toggleBtn) {
      toggleBtn.onclick = (e) => {
        e.stopPropagation();
        this.togglePlugin(plugin.name);
      };
    }
    const reloadBtn = card.querySelector('[data-action="reload"]');
    if (reloadBtn) {
      reloadBtn.onclick = (e) => {
        e.stopPropagation();
        this.reloadPlugin(plugin.name);
      };
    }
    return card;
  }
  /**
   * 创建详情面板
   */
  createDetailsPanel() {
    const panel = document.createElement("div");
    panel.className = "plugin-details";
    panel.style.cssText = `
      width: 400px;
      background: #fafafa;
      overflow-y: auto;
      padding: 20px;
      display: none;
    `;
    return panel;
  }
  /**
   * 显示插件详情
   */
  showPluginDetails(name) {
    const plugin = this.plugins.get(name);
    if (!plugin || !this.detailsPanel)
      return;
    this.selectedPlugin = name;
    this.detailsPanel.style.display = "block";
    this.detailsPanel.innerHTML = `
      <div style="margin-bottom: 20px;">
        <button onclick="this.parentElement.parentElement.style.display='none'" style="
          float: right;
          background: transparent;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #999;
        ">\u2715</button>
        <h3 style="margin: 0 0 10px 0; font-size: 18px;">${plugin.name}</h3>
        ${plugin.description ? `
          <p style="margin: 0; font-size: 13px; color: #666;">
            ${plugin.description}
          </p>
        ` : ""}
      </div>

      <div style="
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-bottom: 20px;
      ">
        <div style="
          background: white;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
        ">
          <div style="font-size: 11px; color: #999; margin-bottom: 4px;">\u7248\u672C</div>
          <div style="font-size: 14px; font-weight: bold;">${plugin.version || "N/A"}</div>
        </div>
        <div style="
          background: white;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
        ">
          <div style="font-size: 11px; color: #999; margin-bottom: 4px;">\u72B6\u6001</div>
          <div style="font-size: 14px; font-weight: bold; color: ${plugin.enabled ? "#4caf50" : "#999"};">
            ${plugin.enabled ? "\u5DF2\u542F\u7528" : "\u5DF2\u7981\u7528"}
          </div>
        </div>
        ${plugin.loadTime ? `
          <div style="
            background: white;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
          ">
            <div style="font-size: 11px; color: #999; margin-bottom: 4px;">\u52A0\u8F7D\u65F6\u95F4</div>
            <div style="font-size: 14px; font-weight: bold;">${plugin.loadTime}ms</div>
          </div>
        ` : ""}
        ${plugin.size ? `
          <div style="
            background: white;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
          ">
            <div style="font-size: 11px; color: #999; margin-bottom: 4px;">\u5927\u5C0F</div>
            <div style="font-size: 14px; font-weight: bold;">${this.formatSize(plugin.size)}</div>
          </div>
        ` : ""}
      </div>

      ${plugin.dependencies && plugin.dependencies.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; font-size: 14px;">\u4F9D\u8D56</h4>
          <div style="
            background: white;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
          ">
            ${plugin.dependencies.map((dep) => `
              <div style="
                padding: 4px 8px;
                margin-bottom: 4px;
                background: #f5f5f5;
                border-radius: 4px;
                font-size: 12px;
                display: inline-block;
                margin-right: 8px;
              ">${dep}</div>
            `).join("")}
          </div>
        </div>
      ` : ""}

      ${plugin.config ? `
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; font-size: 14px;">\u914D\u7F6E</h4>
          <div style="
            background: #2d2d2d;
            color: #d4d4d4;
            padding: 12px;
            border-radius: 6px;
            font-family: monospace;
            font-size: 12px;
            overflow-x: auto;
          ">
            <pre style="margin: 0;">${JSON.stringify(plugin.config, null, 2)}</pre>
          </div>
        </div>
      ` : ""}

      <div style="display: flex; gap: 10px;">
        <button style="
          flex: 1;
          padding: 8px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
        " onclick="console.log('Reload plugin: ${name}')">
          \u91CD\u65B0\u52A0\u8F7D
        </button>
        <button style="
          flex: 1;
          padding: 8px;
          background: ${plugin.enabled ? "#f44336" : "#4caf50"};
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
        " onclick="console.log('Toggle plugin: ${name}')">
          ${plugin.enabled ? "\u7981\u7528\u63D2\u4EF6" : "\u542F\u7528\u63D2\u4EF6"}
        </button>
      </div>
    `;
  }
  /**
   * 切换插件状态
   */
  togglePlugin(name) {
    const plugin = this.plugins.get(name);
    if (!plugin)
      return;
    plugin.enabled = !plugin.enabled;
    if (plugin.enabled) {
      this.editor.plugins?.enable(name);
      logger.info(`Plugin enabled: ${name}`);
    } else {
      this.editor.plugins?.disable(name);
      logger.info(`Plugin disabled: ${name}`);
    }
    this.render();
  }
  /**
   * 重载插件
   */
  reloadPlugin(name) {
    logger.info(`Reloading plugin: ${name}`);
    this.editor.plugins?.disable(name);
    setTimeout(() => {
      this.editor.plugins?.enable(name);
      const plugin = this.plugins.get(name);
      if (plugin)
        plugin.loadTime = performance.now();
      this.render();
    }, 100);
  }
  /**
   * 格式化大小
   */
  formatSize(bytes) {
    if (bytes < 1024)
      return `${bytes}B`;
    if (bytes < 1024 * 1024)
      return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  }
  /**
   * 激活标签页
   */
  activate() {
    this.loadPluginInfo();
  }
  /**
   * 停用标签页
   */
  deactivate() {
  }
  /**
   * 销毁
   */
  destroy() {
    this.container = void 0;
  }
}

export { PluginsTab };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=PluginsTab.js.map
