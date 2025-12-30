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

var logger$1 = require('../../utils/logger.cjs');

const logger = logger$1.createLogger("ConfigTab");
class ConfigTab {
  constructor(options) {
    this.sections = [];
    this.searchQuery = "";
    this.editor = options.editor;
    this.initializeConfig();
  }
  /**
   * 初始化配置
   */
  initializeConfig() {
    this.sections = [{
      name: "general",
      label: "\u5E38\u89C4\u8BBE\u7F6E",
      icon: "\u2699\uFE0F",
      items: [{
        key: "editor.theme",
        label: "\u4E3B\u9898",
        type: "select",
        value: this.editor.options?.theme || "light",
        options: [{
          label: "\u6D45\u8272",
          value: "light"
        }, {
          label: "\u6DF1\u8272",
          value: "dark"
        }, {
          label: "\u8DDF\u968F\u7CFB\u7EDF",
          value: "auto"
        }],
        description: "\u7F16\u8F91\u5668\u4E3B\u9898\u5916\u89C2"
      }, {
        key: "editor.fontSize",
        label: "\u5B57\u4F53\u5927\u5C0F",
        type: "number",
        value: this.editor.options?.fontSize || 14,
        min: 10,
        max: 24,
        step: 1,
        description: "\u7F16\u8F91\u5668\u5B57\u4F53\u5927\u5C0F\uFF08\u50CF\u7D20\uFF09"
      }, {
        key: "editor.fontFamily",
        label: "\u5B57\u4F53",
        type: "string",
        value: this.editor.options?.fontFamily || "Consolas, monospace",
        description: "\u7F16\u8F91\u5668\u5B57\u4F53\u7CFB\u5217"
      }, {
        key: "editor.lineHeight",
        label: "\u884C\u9AD8",
        type: "number",
        value: this.editor.options?.lineHeight || 1.5,
        min: 1,
        max: 3,
        step: 0.1,
        description: "\u6587\u672C\u884C\u9AD8\u500D\u6570"
      }, {
        key: "editor.tabSize",
        label: "Tab \u5927\u5C0F",
        type: "number",
        value: this.editor.options?.tabSize || 2,
        min: 2,
        max: 8,
        step: 2,
        description: "\u4E00\u4E2A Tab \u7B49\u4E8E\u591A\u5C11\u4E2A\u7A7A\u683C"
      }, {
        key: "editor.wordWrap",
        label: "\u81EA\u52A8\u6362\u884C",
        type: "boolean",
        value: this.editor.options?.wordWrap !== false,
        description: "\u957F\u884C\u662F\u5426\u81EA\u52A8\u6362\u884C"
      }]
    }, {
      name: "performance",
      label: "\u6027\u80FD\u4F18\u5316",
      icon: "\u{1F680}",
      items: [{
        key: "virtualScroll.enabled",
        label: "\u865A\u62DF\u6EDA\u52A8",
        type: "boolean",
        value: this.editor.options?.virtualScroll?.enabled || false,
        description: "\u542F\u7528\u865A\u62DF\u6EDA\u52A8\u4EE5\u5904\u7406\u5927\u6587\u6863"
      }, {
        key: "incrementalRender.enabled",
        label: "\u589E\u91CF\u6E32\u67D3",
        type: "boolean",
        value: this.editor.options?.incrementalRender?.enabled !== false,
        description: "\u542F\u7528\u589E\u91CF\u6E32\u67D3\u4F18\u5316"
      }, {
        key: "wasm.enabled",
        label: "WebAssembly\u52A0\u901F",
        type: "boolean",
        value: this.editor.options?.wasm?.enabled !== false,
        description: "\u4F7F\u7528WebAssembly\u52A0\u901F\u6838\u5FC3\u7B97\u6CD5"
      }, {
        key: "cache.enabled",
        label: "\u7F13\u5B58",
        type: "boolean",
        value: true,
        description: "\u542F\u7528\u5185\u5BB9\u7F13\u5B58"
      }, {
        key: "lazyLoading.enabled",
        label: "\u61D2\u52A0\u8F7D",
        type: "boolean",
        value: true,
        description: "\u5EF6\u8FDF\u52A0\u8F7D\u975E\u5173\u952E\u8D44\u6E90"
      }, {
        key: "performance.maxFPS",
        label: "\u6700\u5927\u5E27\u7387",
        type: "number",
        value: 60,
        min: 30,
        max: 144,
        step: 30,
        description: "\u6E32\u67D3\u6700\u5927\u5E27\u7387\u9650\u5236"
      }]
    }, {
      name: "features",
      label: "\u529F\u80FD\u5F00\u5173",
      icon: "\u{1F39B}\uFE0F",
      items: [{
        key: "ai.enabled",
        label: "AI\u52A9\u624B",
        type: "boolean",
        value: this.editor.options?.ai?.enabled !== false,
        description: "\u542F\u7528AI\u667A\u80FD\u52A9\u624B\u529F\u80FD"
      }, {
        key: "collaboration.enabled",
        label: "\u534F\u4F5C\u7F16\u8F91",
        type: "boolean",
        value: this.editor.options?.collaboration?.enabled || false,
        description: "\u542F\u7528\u591A\u4EBA\u5B9E\u65F6\u534F\u4F5C"
      }, {
        key: "history.enabled",
        label: "\u5386\u53F2\u8BB0\u5F55",
        type: "boolean",
        value: true,
        description: "\u542F\u7528\u7F16\u8F91\u5386\u53F2\u8BB0\u5F55"
      }, {
        key: "minimap.enabled",
        label: "\u8FF7\u4F60\u5730\u56FE",
        type: "boolean",
        value: false,
        description: "\u663E\u793A\u4EE3\u7801\u8FF7\u4F60\u5730\u56FE"
      }, {
        key: "breadcrumb.enabled",
        label: "\u9762\u5305\u5C51\u5BFC\u822A",
        type: "boolean",
        value: true,
        description: "\u663E\u793A\u6587\u6863\u7ED3\u6784\u5BFC\u822A"
      }, {
        key: "autocomplete.enabled",
        label: "\u81EA\u52A8\u8865\u5168",
        type: "boolean",
        value: true,
        description: "\u542F\u7528\u667A\u80FD\u4EE3\u7801\u8865\u5168"
      }]
    }, {
      name: "debug",
      label: "\u8C03\u8BD5\u9009\u9879",
      icon: "\u{1F41B}",
      items: [{
        key: "debug.logLevel",
        label: "\u65E5\u5FD7\u7EA7\u522B",
        type: "select",
        value: "info",
        options: [{
          label: "\u8C03\u8BD5",
          value: "debug"
        }, {
          label: "\u4FE1\u606F",
          value: "info"
        }, {
          label: "\u8B66\u544A",
          value: "warn"
        }, {
          label: "\u9519\u8BEF",
          value: "error"
        }],
        description: "\u63A7\u5236\u53F0\u65E5\u5FD7\u8F93\u51FA\u7EA7\u522B"
      }, {
        key: "debug.showPerformanceMetrics",
        label: "\u6027\u80FD\u6307\u6807",
        type: "boolean",
        value: true,
        description: "\u663E\u793A\u5B9E\u65F6\u6027\u80FD\u6307\u6807"
      }, {
        key: "debug.showMemoryUsage",
        label: "\u5185\u5B58\u4F7F\u7528",
        type: "boolean",
        value: true,
        description: "\u663E\u793A\u5185\u5B58\u4F7F\u7528\u60C5\u51B5"
      }, {
        key: "debug.recordHistory",
        label: "\u8BB0\u5F55\u5386\u53F2",
        type: "boolean",
        value: true,
        description: "\u8BB0\u5F55\u6240\u6709\u64CD\u4F5C\u5386\u53F2"
      }, {
        key: "debug.profileStartup",
        label: "\u542F\u52A8\u5206\u6790",
        type: "boolean",
        value: false,
        description: "\u5206\u6790\u542F\u52A8\u6027\u80FD"
      }, {
        key: "debug.enableSourceMap",
        label: "Source Map",
        type: "boolean",
        value: true,
        description: "\u542F\u7528\u6E90\u7801\u6620\u5C04"
      }]
    }, {
      name: "experimental",
      label: "\u5B9E\u9A8C\u529F\u80FD",
      icon: "\u{1F9EA}",
      items: [{
        key: "experimental.newRenderer",
        label: "\u65B0\u6E32\u67D3\u5F15\u64CE",
        type: "boolean",
        value: false,
        description: "\u5C1D\u8BD5\u5B9E\u9A8C\u6027\u7684\u65B0\u6E32\u67D3\u5F15\u64CE"
      }, {
        key: "experimental.offlineMode",
        label: "\u79BB\u7EBF\u6A21\u5F0F",
        type: "boolean",
        value: false,
        description: "\u542F\u7528\u79BB\u7EBF\u7F16\u8F91\u652F\u6301"
      }, {
        key: "experimental.voiceInput",
        label: "\u8BED\u97F3\u8F93\u5165",
        type: "boolean",
        value: false,
        description: "\u542F\u7528\u8BED\u97F3\u8BC6\u522B\u8F93\u5165"
      }, {
        key: "experimental.gestureControl",
        label: "\u624B\u52BF\u63A7\u5236",
        type: "boolean",
        value: false,
        description: "\u542F\u7528\u624B\u52BF\u63A7\u5236\u529F\u80FD"
      }, {
        key: "experimental.aiCodeGen",
        label: "AI\u4EE3\u7801\u751F\u6210",
        type: "boolean",
        value: false,
        description: "\u542F\u7528AI\u4EE3\u7801\u751F\u6210\u529F\u80FD"
      }]
    }];
  }
  /**
   * 渲染标签页
   */
  render() {
    this.container = document.createElement("div");
    this.container.className = "config-tab";
    this.container.style.cssText = `
      display: flex;
      flex-direction: column;
      height: 100%;
    `;
    const toolbar = this.createToolbar();
    this.settingsContainer = document.createElement("div");
    this.settingsContainer.className = "settings-container";
    this.settingsContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      width: 100%;
    `;
    this.container.appendChild(toolbar);
    this.container.appendChild(this.settingsContainer);
    this.renderSettings();
    return this.container;
  }
  /**
   * 创建工具栏
   */
  createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.style.cssText = `
      display: flex;
      align-items: center;
      padding: 12px 20px;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
      gap: 15px;
      flex-shrink: 0;
    `;
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "\u641C\u7D22\u8BBE\u7F6E...";
    searchInput.style.cssText = `
      padding: 6px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
      width: 300px;
    `;
    searchInput.oninput = (e) => {
      this.searchQuery = e.target.value;
      this.renderSettings();
    };
    const resetBtn = document.createElement("button");
    resetBtn.style.cssText = `
      padding: 6px 12px;
      background: transparent;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      margin-left: auto;
    `;
    resetBtn.innerHTML = "\u{1F504} \u91CD\u7F6E\u6240\u6709";
    resetBtn.onclick = () => this.resetAll();
    const exportBtn = document.createElement("button");
    exportBtn.style.cssText = `${resetBtn.style.cssText}margin-left: 10px;`;
    exportBtn.innerHTML = "\u{1F4E4} \u5BFC\u51FA\u914D\u7F6E";
    exportBtn.onclick = () => this.exportConfig();
    const importBtn = document.createElement("button");
    importBtn.style.cssText = `${resetBtn.style.cssText}margin-left: 10px;`;
    importBtn.innerHTML = "\u{1F4E5} \u5BFC\u5165\u914D\u7F6E";
    importBtn.onclick = () => this.importConfig();
    toolbar.appendChild(searchInput);
    toolbar.appendChild(resetBtn);
    toolbar.appendChild(exportBtn);
    toolbar.appendChild(importBtn);
    return toolbar;
  }
  /**
   * 渲染设置
   */
  renderSettings() {
    if (!this.settingsContainer)
      return;
    this.settingsContainer.innerHTML = "";
    this.sections.forEach((section) => {
      const filteredItems = this.searchQuery ? section.items.filter((item) => item.label.toLowerCase().includes(this.searchQuery.toLowerCase()) || item.description?.toLowerCase().includes(this.searchQuery.toLowerCase())) : section.items;
      if (filteredItems.length === 0)
        return;
      const sectionElement = this.createSection(section, filteredItems);
      this.settingsContainer.appendChild(sectionElement);
    });
  }
  /**
   * 创建设置部分
   */
  createSection(section, items) {
    const container = document.createElement("div");
    container.className = "config-section";
    container.style.cssText = `
      margin-bottom: 30px;
    `;
    const header = document.createElement("h3");
    header.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0 0 20px 0;
      font-size: 16px;
      color: #333;
    `;
    header.innerHTML = `
      <span style="font-size: 20px;">${section.icon}</span>
      <span>${section.label}</span>
      <span style="
        background: #e0e0e0;
        color: #666;
        font-size: 11px;
        padding: 2px 6px;
        border-radius: 10px;
        margin-left: 10px;
      ">${items.length}</span>
    `;
    const itemsContainer = document.createElement("div");
    itemsContainer.style.cssText = `
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 0;
      overflow: hidden;
    `;
    items.forEach((item, index) => {
      const itemElement = this.createConfigItem(item);
      if (index < items.length - 1)
        itemElement.style.borderBottom = "1px solid #f0f0f0";
      itemsContainer.appendChild(itemElement);
    });
    container.appendChild(header);
    container.appendChild(itemsContainer);
    return container;
  }
  /**
   * 创建配置项
   */
  createConfigItem(item) {
    const container = document.createElement("div");
    container.className = "config-item";
    container.style.cssText = `
      display: flex;
      align-items: center;
      padding: 15px 20px;
      transition: background 0.2s;
    `;
    const info = document.createElement("div");
    info.style.cssText = `
      flex: 1;
      margin-right: 20px;
    `;
    info.innerHTML = `
      <div style="font-size: 14px; font-weight: 500; color: #333; margin-bottom: 4px;">
        ${item.label}
      </div>
      ${item.description ? `
        <div style="font-size: 12px; color: #666;">
          ${item.description}
        </div>
      ` : ""}
    `;
    const control = this.createControl(item);
    container.appendChild(info);
    container.appendChild(control);
    container.onmouseenter = () => {
      container.style.background = "#f8f9fa";
    };
    container.onmouseleave = () => {
      container.style.background = "transparent";
    };
    return container;
  }
  /**
   * 创建控件
   */
  createControl(item) {
    switch (item.type) {
      case "boolean":
        return this.createToggle(item);
      case "number":
        return this.createNumberInput(item);
      case "string":
        return this.createTextInput(item);
      case "select":
        return this.createSelect(item);
      case "color":
        return this.createColorPicker(item);
      case "json":
        return this.createJsonEditor(item);
      default:
        return document.createElement("div");
    }
  }
  /**
   * 创建开关
   */
  createToggle(item) {
    const container = document.createElement("label");
    container.style.cssText = `
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
      cursor: pointer;
    `;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = item.value;
    input.style.cssText = `
      opacity: 0;
      width: 0;
      height: 0;
    `;
    const slider = document.createElement("span");
    slider.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${input.checked ? "#667eea" : "#ccc"};
      transition: 0.3s;
      border-radius: 24px;
    `;
    const handle = document.createElement("span");
    handle.style.cssText = `
      position: absolute;
      height: 18px;
      width: 18px;
      left: ${input.checked ? "23px" : "3px"};
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    slider.appendChild(handle);
    input.onchange = () => {
      item.value = input.checked;
      slider.style.backgroundColor = input.checked ? "#667eea" : "#ccc";
      handle.style.left = input.checked ? "23px" : "3px";
      item.onChange?.(item.value);
      this.applyConfig(item.key, item.value);
    };
    container.appendChild(input);
    container.appendChild(slider);
    return container;
  }
  /**
   * 创建数字输入
   */
  createNumberInput(item) {
    const container = document.createElement("div");
    container.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    const input = document.createElement("input");
    input.type = "number";
    input.value = String(item.value);
    input.min = String(item.min || 0);
    input.max = String(item.max || 100);
    input.step = String(item.step || 1);
    input.style.cssText = `
      width: 80px;
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
      text-align: center;
    `;
    const label = document.createElement("span");
    label.style.cssText = `
      font-size: 12px;
      color: #666;
    `;
    label.textContent = item.value;
    input.oninput = () => {
      const value = Number(input.value);
      item.value = value;
      label.textContent = String(value);
      item.onChange?.(value);
      this.applyConfig(item.key, value);
    };
    container.appendChild(input);
    container.appendChild(label);
    return container;
  }
  /**
   * 创建文本输入
   */
  createTextInput(item) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = item.value;
    input.style.cssText = `
      width: 200px;
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
    `;
    input.oninput = () => {
      item.value = input.value;
      item.onChange?.(input.value);
      this.applyConfig(item.key, input.value);
    };
    return input;
  }
  /**
   * 创建下拉选择
   */
  createSelect(item) {
    const select = document.createElement("select");
    select.style.cssText = `
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
      min-width: 120px;
    `;
    item.options?.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      optionElement.selected = option.value === item.value;
      select.appendChild(optionElement);
    });
    select.onchange = () => {
      item.value = select.value;
      item.onChange?.(select.value);
      this.applyConfig(item.key, select.value);
    };
    return select;
  }
  /**
   * 创建颜色选择器
   */
  createColorPicker(item) {
    const input = document.createElement("input");
    input.type = "color";
    input.value = item.value;
    input.style.cssText = `
      width: 50px;
      height: 30px;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    `;
    input.oninput = () => {
      item.value = input.value;
      item.onChange?.(input.value);
      this.applyConfig(item.key, input.value);
    };
    return input;
  }
  /**
   * 创建JSON编辑器
   */
  createJsonEditor(item) {
    const button = document.createElement("button");
    button.style.cssText = `
      padding: 4px 12px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `;
    button.textContent = "\u7F16\u8F91 JSON";
    button.onclick = () => {
      const value = prompt("\u7F16\u8F91 JSON:", JSON.stringify(item.value, null, 2));
      if (value) {
        try {
          item.value = JSON.parse(value);
          item.onChange?.(item.value);
          this.applyConfig(item.key, item.value);
          logger.info("JSON config updated");
        } catch (e) {
          alert("\u65E0\u6548\u7684 JSON \u683C\u5F0F");
        }
      }
    };
    return button;
  }
  /**
   * 应用配置
   */
  applyConfig(key, value) {
    logger.info(`Config updated: ${key} = ${value}`);
    const keys = key.split(".");
    let target = this.editor.options || {};
    for (let i = 0; i < keys.length - 1; i++) {
      if (!target[keys[i]])
        target[keys[i]] = {};
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = value;
    this.editor.emit("config-change", {
      key,
      value
    });
  }
  /**
   * 重置所有配置
   */
  resetAll() {
    if (confirm("\u786E\u5B9A\u8981\u91CD\u7F6E\u6240\u6709\u914D\u7F6E\u4E3A\u9ED8\u8BA4\u503C\u5417\uFF1F")) {
      this.sections.forEach((section) => {
        section.items.forEach((item) => {
          if (item.defaultValue !== void 0) {
            item.value = item.defaultValue;
            this.applyConfig(item.key, item.value);
          }
        });
      });
      this.renderSettings();
      logger.info("All settings reset to defaults");
    }
  }
  /**
   * 导出配置
   */
  exportConfig() {
    const config = {};
    this.sections.forEach((section) => {
      section.items.forEach((item) => {
        config[item.key] = item.value;
      });
    });
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "editor-config.json";
    a.click();
    URL.revokeObjectURL(url);
    logger.info("Config exported");
  }
  /**
   * 导入配置
   */
  importConfig() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file)
        return;
      const reader = new FileReader();
      reader.onload = (e2) => {
        try {
          const config = JSON.parse(e2.target?.result);
          Object.entries(config).forEach(([key, value]) => {
            this.sections.forEach((section) => {
              const item = section.items.find((i) => i.key === key);
              if (item) {
                item.value = value;
                this.applyConfig(key, value);
              }
            });
          });
          this.renderSettings();
          logger.info("Config imported successfully");
        } catch (err) {
          alert("\u65E0\u6548\u7684\u914D\u7F6E\u6587\u4EF6");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }
  /**
   * 激活标签页
   */
  activate() {
    this.initializeConfig();
    this.renderSettings();
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

exports.ConfigTab = ConfigTab;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ConfigTab.cjs.map
