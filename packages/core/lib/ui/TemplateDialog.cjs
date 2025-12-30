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

var types = require('../template/types.cjs');

class TemplateDialog {
  constructor(templateManager) {
    this.selectedCategory = "all";
    this.searchQuery = "";
    this.templateManager = templateManager;
    this.container = this.createDialog();
  }
  /**
   * 显示对话框
   */
  show(onSelect) {
    this.onSelect = onSelect;
    document.body.appendChild(this.container);
    this.loadTemplates();
  }
  /**
   * 隐藏对话框
   */
  hide() {
    if (this.container.parentNode)
      this.container.parentNode.removeChild(this.container);
  }
  /**
   * 创建对话框结构
   */
  createDialog() {
    const dialog = document.createElement("div");
    dialog.className = "template-dialog-overlay";
    dialog.innerHTML = `
      <div class="template-dialog">
        <div class="template-dialog-header">
          <h2>\u9009\u62E9\u6A21\u677F</h2>
          <button class="template-dialog-close" aria-label="\u5173\u95ED">\xD7</button>
        </div>
        
        <div class="template-dialog-toolbar">
          <div class="template-search">
            <input type="text" placeholder="\u641C\u7D22\u6A21\u677F..." class="template-search-input">
          </div>
          <div class="template-categories">
            <button class="category-btn active" data-category="all">\u5168\u90E8</button>
            <button class="category-btn" data-category="business">\u5546\u52A1</button>
            <button class="category-btn" data-category="personal">\u4E2A\u4EBA</button>
            <button class="category-btn" data-category="creative">\u521B\u610F</button>
            <button class="category-btn" data-category="education">\u6559\u80B2</button>
            <button class="category-btn" data-category="technical">\u6280\u672F</button>
            <button class="category-btn" data-category="custom">\u81EA\u5B9A\u4E49</button>
          </div>
        </div>
        
        <div class="template-dialog-content">
          <div class="template-grid"></div>
        </div>
        
        <div class="template-dialog-footer">
          <button class="btn-secondary" id="import-template">\u5BFC\u5165\u6A21\u677F</button>
          <button class="btn-secondary" id="create-from-current">\u4ECE\u5F53\u524D\u5185\u5BB9\u521B\u5EFA</button>
          <button class="btn-primary" id="manage-templates">\u7BA1\u7406\u6A21\u677F</button>
        </div>
      </div>
    `;
    this.addStyles();
    this.bindEvents(dialog);
    return dialog;
  }
  /**
   * 绑定事件
   */
  bindEvents(dialog) {
    const closeBtn = dialog.querySelector(".template-dialog-close");
    closeBtn?.addEventListener("click", () => this.hide());
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog)
        this.hide();
    });
    const searchInput = dialog.querySelector(".template-search-input");
    searchInput?.addEventListener("input", (e) => {
      this.searchQuery = e.target.value;
      this.loadTemplates();
    });
    const categoryBtns = dialog.querySelectorAll(".category-btn");
    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        categoryBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.selectedCategory = btn.dataset.category;
        this.loadTemplates();
      });
    });
    const importBtn = dialog.querySelector("#import-template");
    importBtn?.addEventListener("click", () => this.handleImport());
    const createBtn = dialog.querySelector("#create-from-current");
    createBtn?.addEventListener("click", () => this.handleCreateFromCurrent());
    const manageBtn = dialog.querySelector("#manage-templates");
    manageBtn?.addEventListener("click", () => this.showManageDialog());
  }
  /**
   * 加载模板列表
   */
  async loadTemplates() {
    const grid = this.container.querySelector(".template-grid");
    if (!grid)
      return;
    grid.innerHTML = '<div class="loading">\u52A0\u8F7D\u4E2D...</div>';
    try {
      let templates = [];
      if (this.searchQuery)
        templates = await this.templateManager.searchTemplates(this.searchQuery);
      else if (this.selectedCategory === "all")
        templates = await this.templateManager.getAllTemplates();
      else
        templates = await this.templateManager.getTemplatesByCategory(this.selectedCategory);
      if (templates.length === 0) {
        grid.innerHTML = '<div class="empty-state">\u6CA1\u6709\u627E\u5230\u6A21\u677F</div>';
        return;
      }
      grid.innerHTML = templates.map((template) => this.renderTemplateCard(template)).join("");
      grid.querySelectorAll(".template-card").forEach((card) => {
        card.addEventListener("click", () => {
          const templateId = card.dataset.templateId;
          if (templateId)
            this.selectTemplate(templateId);
        });
      });
    } catch (error) {
      console.error("Failed to load templates:", error);
      grid.innerHTML = '<div class="error">\u52A0\u8F7D\u6A21\u677F\u5931\u8D25</div>';
    }
  }
  /**
   * 渲染模板卡片
   */
  renderTemplateCard(template) {
    const {
      metadata
    } = template;
    const icon = this.getTemplateIcon(metadata.category);
    const badges = [metadata.isBuiltin ? '<span class="badge badge-builtin">\u5185\u7F6E</span>' : "", metadata.isCustom ? '<span class="badge badge-custom">\u81EA\u5B9A\u4E49</span>' : ""].filter(Boolean).join("");
    return `
      <div class="template-card" data-template-id="${metadata.id}">
        <div class="template-icon">${icon}</div>
        <h3 class="template-name">${metadata.name}</h3>
        <p class="template-desc">${metadata.description || "\u65E0\u63CF\u8FF0"}</p>
        <div class="template-meta">
          ${badges}
          ${metadata.tags ? metadata.tags.map((tag) => `<span class="tag">${tag}</span>`).join("") : ""}
        </div>
      </div>
    `;
  }
  /**
   * 获取模板图标
   */
  getTemplateIcon(category) {
    const icons = {
      [types.TemplateCategory.BUSINESS]: "\u{1F4CA}",
      [types.TemplateCategory.PERSONAL]: "\u{1F464}",
      [types.TemplateCategory.CREATIVE]: "\u{1F3A8}",
      [types.TemplateCategory.EDUCATION]: "\u{1F4DA}",
      [types.TemplateCategory.TECHNICAL]: "\u{1F4BB}",
      [types.TemplateCategory.CUSTOM]: "\u2699\uFE0F"
    };
    return icons[category] || "\u{1F4C4}";
  }
  /**
   * 选择模板
   */
  async selectTemplate(templateId) {
    const template = await this.templateManager.getTemplate(templateId);
    if (template) {
      if (template.variables && template.variables.length > 0) {
        this.showVariableDialog(template);
      } else {
        this.applyTemplate(template);
      }
    }
  }
  /**
   * 显示变量填充对话框
   */
  showVariableDialog(template) {
    const dialog = document.createElement("div");
    dialog.className = "variable-dialog-overlay";
    const variableInputs = template.variables?.map((v) => `
      <div class="variable-input-group">
        <label for="${v.key}">
          ${v.label}
          ${v.required ? '<span class="required">*</span>' : ""}
        </label>
        ${this.renderVariableInput(v)}
      </div>
    `).join("") || "";
    dialog.innerHTML = `
      <div class="variable-dialog">
        <div class="variable-dialog-header">
          <h3>\u586B\u5145\u6A21\u677F\u53D8\u91CF - ${template.metadata.name}</h3>
          <button class="close-btn">\xD7</button>
        </div>
        <div class="variable-dialog-content">
          ${variableInputs}
        </div>
        <div class="variable-dialog-footer">
          <button class="btn-secondary cancel-btn">\u53D6\u6D88</button>
          <button class="btn-primary apply-btn">\u5E94\u7528\u6A21\u677F</button>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);
    dialog.querySelector(".close-btn")?.addEventListener("click", () => {
      document.body.removeChild(dialog);
    });
    dialog.querySelector(".cancel-btn")?.addEventListener("click", () => {
      document.body.removeChild(dialog);
    });
    dialog.querySelector(".apply-btn")?.addEventListener("click", () => {
      const variables = {};
      template.variables?.forEach((v) => {
        const input = dialog.querySelector(`[name="${v.key}"]`);
        if (input)
          variables[v.key] = input.value || v.defaultValue || "";
      });
      document.body.removeChild(dialog);
      this.applyTemplate(template, variables);
    });
  }
  /**
   * 渲染变量输入控件
   */
  renderVariableInput(variable) {
    switch (variable.type) {
      case "text":
        return `<input type="text" name="${variable.key}" value="${variable.defaultValue || ""}" />`;
      case "date":
        return `<input type="date" name="${variable.key}" value="${variable.defaultValue || ""}" />`;
      case "select":
        const options = variable.options?.map((opt) => `<option value="${opt.value}">${opt.label}</option>`).join("") || "";
        return `<select name="${variable.key}">${options}</select>`;
      case "boolean":
        return `<input type="checkbox" name="${variable.key}" ${variable.defaultValue ? "checked" : ""} />`;
      default:
        return `<input type="text" name="${variable.key}" value="${variable.defaultValue || ""}" />`;
    }
  }
  /**
   * 应用模板
   */
  applyTemplate(template, variables) {
    if (this.onSelect)
      this.onSelect(template);
    this.hide();
  }
  /**
   * 处理导入
   */
  handleImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const jsonStr = event.target?.result;
            await this.templateManager.importTemplate(jsonStr);
            alert("\u6A21\u677F\u5BFC\u5165\u6210\u529F\uFF01");
            this.loadTemplates();
          } catch (error) {
            alert(`\u6A21\u677F\u5BFC\u5165\u5931\u8D25\uFF1A${error}`);
          }
        };
        reader.readAsText(file);
      }
    });
    input.click();
  }
  /**
   * 从当前内容创建模板
   */
  handleCreateFromCurrent() {
    this.hide();
    if (window.editor) {
      window.editor.emit("template:create-from-content");
    }
  }
  /**
   * 显示模板管理对话框
   */
  async showManageDialog() {
    const overlay = document.createElement("div");
    overlay.className = "template-manage-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
    `;
    const dialog = document.createElement("div");
    dialog.className = "template-manage-dialog";
    dialog.style.cssText = `
      background: white;
      border-radius: 8px;
      width: 700px;
      max-height: 600px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    `;
    const header = document.createElement("div");
    header.className = "dialog-header";
    header.style.cssText = `
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    header.innerHTML = `
      <h2 style="margin: 0; font-size: 18px;">\u6A21\u677F\u7BA1\u7406</h2>
      <button class="close-btn" style="border: none; background: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
    `;
    const content = document.createElement("div");
    content.className = "dialog-content";
    content.style.cssText = `
      padding: 20px;
      flex: 1;
      overflow-y: auto;
    `;
    const templates = await this.templateManager.getAllTemplates();
    templates.forEach((template) => {
      const item = document.createElement("div");
      item.className = "template-item";
      item.style.cssText = `
        padding: 16px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
      const info = document.createElement("div");
      info.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 4px;">${template.metadata.name}</div>
        <div style="font-size: 12px; color: #666;">${template.metadata.category}</div>
      `;
      const actions = document.createElement("div");
      actions.style.cssText = "display: flex; gap: 8px;";
      const editBtn = document.createElement("button");
      editBtn.textContent = "\u7F16\u8F91";
      editBtn.style.cssText = `
        padding: 6px 12px;
        border: 1px solid #3b82f6;
        background: white;
        color: #3b82f6;
        border-radius: 4px;
        cursor: pointer;
      `;
      editBtn.addEventListener("click", () => {
        this.showEditTemplateDialog(template.metadata.id, template);
      });
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "\u5220\u9664";
      deleteBtn.style.cssText = `
        padding: 6px 12px;
        border: 1px solid #ef4444;
        background: white;
        color: #ef4444;
        border-radius: 4px;
        cursor: pointer;
      `;
      deleteBtn.addEventListener("click", () => {
        if (confirm(`\u786E\u5B9A\u8981\u5220\u9664\u6A21\u677F "${template.metadata.name}" \u5417\uFF1F`)) {
          this.templateManager.deleteTemplate(template.metadata.id);
          item.remove();
        }
      });
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      item.appendChild(info);
      item.appendChild(actions);
      content.appendChild(item);
    });
    const footer = document.createElement("div");
    footer.style.cssText = `
      padding: 16px 20px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
    `;
    const addBtn = document.createElement("button");
    addBtn.textContent = "+ \u65B0\u5EFA\u6A21\u677F";
    addBtn.style.cssText = `
      padding: 8px 16px;
      border: none;
      background: #3b82f6;
      color: white;
      border-radius: 6px;
      cursor: pointer;
    `;
    addBtn.addEventListener("click", () => {
      this.showCreateTemplateDialog();
    });
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "\u5173\u95ED";
    closeBtn.style.cssText = `
      padding: 8px 16px;
      border: 1px solid #d1d5db;
      background: white;
      color: #374151;
      border-radius: 6px;
      cursor: pointer;
    `;
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });
    footer.appendChild(addBtn);
    footer.appendChild(closeBtn);
    dialog.appendChild(header);
    dialog.appendChild(content);
    dialog.appendChild(footer);
    overlay.appendChild(dialog);
    header.querySelector(".close-btn")?.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay)
        document.body.removeChild(overlay);
    });
    document.body.appendChild(overlay);
  }
  /**
   * 显示创建模板对话框
   */
  showCreateTemplateDialog() {
    const name = prompt("\u8BF7\u8F93\u5165\u6A21\u677F\u540D\u79F0:");
    if (!name)
      return;
    const content = prompt("\u8BF7\u8F93\u5165\u6A21\u677F\u5185\u5BB9:");
    if (!content)
      return;
    this.templateManager.saveCustomTemplate({
      metadata: {
        id: `custom-${Date.now()}`,
        name,
        category: types.TemplateCategory.CUSTOM
      },
      content
    });
    alert("\u6A21\u677F\u5DF2\u521B\u5EFA\uFF01");
  }
  /**
   * 显示编辑模板对话框
   */
  showEditTemplateDialog(id, template) {
    const name = prompt("\u8BF7\u8F93\u5165\u6A21\u677F\u540D\u79F0:", template.metadata.name);
    if (!name)
      return;
    const content = prompt("\u8BF7\u8F93\u5165\u6A21\u677F\u5185\u5BB9:", template.content);
    if (!content)
      return;
    this.templateManager.updateTemplate(id, {
      metadata: {
        ...template.metadata,
        name
      },
      content
    });
    alert("\u6A21\u677F\u5DF2\u66F4\u65B0\uFF01");
  }
  /**
   * 添加样式
   */
  addStyles() {
    if (document.getElementById("template-dialog-styles"))
      return;
    const style = document.createElement("style");
    style.id = "template-dialog-styles";
    style.textContent = `
      .template-dialog-overlay,
      .variable-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }

      .template-dialog,
      .variable-dialog {
        background: white;
        border-radius: 8px;
        width: 90%;
        max-width: 900px;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      }

      .template-dialog-header,
      .variable-dialog-header {
        padding: 20px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .template-dialog-header h2,
      .variable-dialog-header h3 {
        margin: 0;
        font-size: 20px;
        color: #333;
      }

      .template-dialog-close,
      .close-btn {
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #999;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .template-dialog-close:hover,
      .close-btn:hover {
        color: #333;
      }

      .template-dialog-toolbar {
        padding: 15px 20px;
        border-bottom: 1px solid #e0e0e0;
      }

      .template-search {
        margin-bottom: 15px;
      }

      .template-search-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }

      .template-categories {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .category-btn {
        padding: 6px 12px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
      }

      .category-btn:hover {
        background: #f5f5f5;
      }

      .category-btn.active {
        background: #3498db;
        color: white;
        border-color: #3498db;
      }

      .template-dialog-content,
      .variable-dialog-content {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
      }

      .template-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
      }

      .template-card {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.2s;
        background: white;
      }

      .template-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .template-icon {
        font-size: 36px;
        margin-bottom: 12px;
      }

      .template-name {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: #333;
      }

      .template-desc {
        font-size: 14px;
        color: #666;
        margin: 0 0 12px 0;
        line-height: 1.4;
      }

      .template-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .badge {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 12px;
        font-weight: 500;
      }

      .badge-builtin {
        background: #e3f2fd;
        color: #1976d2;
      }

      .badge-custom {
        background: #f3e5f5;
        color: #7b1fa2;
      }

      .tag {
        font-size: 12px;
        padding: 2px 8px;
        background: #f5f5f5;
        color: #666;
        border-radius: 4px;
      }

      .template-dialog-footer,
      .variable-dialog-footer {
        padding: 15px 20px;
        border-top: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .variable-dialog-footer {
        justify-content: flex-end;
        gap: 10px;
      }

      .btn-primary,
      .btn-secondary {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-primary {
        background: #3498db;
        color: white;
      }

      .btn-primary:hover {
        background: #2980b9;
      }

      .btn-secondary {
        background: white;
        color: #333;
        border: 1px solid #ddd;
      }

      .btn-secondary:hover {
        background: #f5f5f5;
      }

      .variable-input-group {
        margin-bottom: 15px;
      }

      .variable-input-group label {
        display: block;
        margin-bottom: 5px;
        font-size: 14px;
        color: #333;
      }

      .variable-input-group input,
      .variable-input-group select {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }

      .required {
        color: #e74c3c;
      }

      .loading,
      .empty-state,
      .error {
        text-align: center;
        padding: 40px;
        color: #666;
      }

      .error {
        color: #e74c3c;
      }
    `;
    document.head.appendChild(style);
  }
}
function showTemplateDialog(templateManager, onSelect) {
  const dialog = new TemplateDialog(templateManager);
  dialog.show(onSelect);
  return dialog;
}

exports.TemplateDialog = TemplateDialog;
exports.showTemplateDialog = showTemplateDialog;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=TemplateDialog.cjs.map
