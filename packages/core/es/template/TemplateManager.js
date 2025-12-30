/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { EventEmitter } from '../utils/event.js';
import { LocalTemplateStorage } from './storage/LocalTemplateStorage.js';
import { builtinTemplates } from './templates/index.js';

class TemplateManager extends EventEmitter {
  constructor(config = {}) {
    super();
    this.templates = /* @__PURE__ */ new Map();
    this.initialized = false;
    this.config = {
      storage: "local",
      maxCustomTemplates: 50,
      enableVariables: true,
      ...config
    };
    if (config.customStorage)
      this.storage = config.customStorage;
    else
      this.storage = new LocalTemplateStorage();
  }
  /**
   * 初始化模板管理器
   */
  async init() {
    if (this.initialized)
      return;
    try {
      if (this.config.builtinTemplates) {
        this.config.builtinTemplates.forEach((template) => {
          this.templates.set(template.metadata.id, template);
        });
      } else {
        builtinTemplates.forEach((template) => {
          this.templates.set(template.metadata.id, template);
        });
      }
      const customTemplates = await this.storage.getAll();
      customTemplates.forEach((template) => {
        this.templates.set(template.metadata.id, template);
      });
      this.initialized = true;
      this.emit("initialized");
    } catch (error) {
      console.error("Failed to initialize template manager:", error);
      this.emit("error", error);
    }
  }
  /**
   * 获取所有模板
   */
  async getAllTemplates() {
    if (!this.initialized)
      await this.init();
    return Array.from(this.templates.values());
  }
  /**
   * 根据ID获取模板
   */
  async getTemplate(id) {
    if (!this.initialized)
      await this.init();
    return this.templates.get(id) || null;
  }
  /**
   * 根据分类获取模板
   */
  async getTemplatesByCategory(category) {
    if (!this.initialized)
      await this.init();
    return Array.from(this.templates.values()).filter((template) => template.metadata.category === category);
  }
  /**
   * 搜索模板
   */
  async searchTemplates(query) {
    if (!this.initialized)
      await this.init();
    const lowerQuery = query.toLowerCase();
    return Array.from(this.templates.values()).filter((template) => {
      const metadata = template.metadata;
      return metadata.name.toLowerCase().includes(lowerQuery) || metadata.description?.toLowerCase().includes(lowerQuery) || metadata.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery));
    });
  }
  /**
   * 保存自定义模板
   */
  async saveCustomTemplate(template) {
    if (!this.initialized)
      await this.init();
    const customTemplates = Array.from(this.templates.values()).filter((t) => t.metadata.isCustom);
    if (customTemplates.length >= (this.config.maxCustomTemplates || 50))
      throw new Error(`Maximum custom templates limit (${this.config.maxCustomTemplates}) reached`);
    template.metadata.isCustom = true;
    template.metadata.createdAt = /* @__PURE__ */ new Date();
    template.metadata.updatedAt = /* @__PURE__ */ new Date();
    await this.storage.save(template);
    this.templates.set(template.metadata.id, template);
    this.emit("template:saved", template);
  }
  /**
   * 更新模板
   */
  async updateTemplate(id, updates) {
    if (!this.initialized)
      await this.init();
    const template = this.templates.get(id);
    if (!template)
      throw new Error(`Template with id ${id} not found`);
    if (template.metadata.isBuiltin)
      throw new Error("Cannot update builtin templates");
    const updatedTemplate = {
      ...template,
      ...updates,
      metadata: {
        ...template.metadata,
        ...updates.metadata,
        updatedAt: /* @__PURE__ */ new Date()
      }
    };
    await this.storage.update(id, updatedTemplate);
    this.templates.set(id, updatedTemplate);
    this.emit("template:updated", updatedTemplate);
  }
  /**
   * 删除自定义模板
   */
  async deleteTemplate(id) {
    if (!this.initialized)
      await this.init();
    const template = this.templates.get(id);
    if (!template)
      throw new Error(`Template with id ${id} not found`);
    if (template.metadata.isBuiltin)
      throw new Error("Cannot delete builtin templates");
    await this.storage.delete(id);
    this.templates.delete(id);
    this.emit("template:deleted", id);
  }
  /**
   * 应用模板到编辑器
   */
  async applyTemplate(editor, templateId, options = {}) {
    if (!this.initialized)
      await this.init();
    const template = this.templates.get(templateId);
    if (!template)
      throw new Error(`Template with id ${templateId} not found`);
    let content = template.content;
    if (this.config.enableVariables && template.variables && options.variables)
      content = this.replaceVariables(content, options.variables);
    if (template.styles && !options.preserveStyles)
      this.applyStyles(editor, template.styles);
    if (options.replaceContent !== false) {
      editor.setContent(content);
    } else {
      editor.insertContent(content);
    }
    this.emit("template:applied", {
      template,
      options
    });
  }
  /**
   * 替换模板变量
   */
  replaceVariables(content, variables) {
    let result = content;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
      result = result.replace(regex, String(value));
    });
    return result;
  }
  /**
   * 应用样式到编辑器
   */
  applyStyles(editor, styles) {
    const styleId = "template-styles";
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = styles;
  }
  /**
   * 从当前编辑器内容创建模板
   */
  async createTemplateFromContent(editor, metadata) {
    const content = editor.getContent();
    const template = {
      metadata: {
        ...metadata,
        id: metadata.id || this.generateTemplateId(),
        isCustom: true,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      content,
      variables: this.extractVariables(content)
    };
    await this.saveCustomTemplate(template);
    return template;
  }
  /**
   * 提取内容中的变量
   */
  extractVariables(content) {
    const variables = [];
    const regex = /\{\{(\w+)\}\}/g;
    const matches = /* @__PURE__ */ new Set();
    let match;
    while ((match = regex.exec(content)) !== null)
      matches.add(match[1]);
    matches.forEach((key) => {
      variables.push({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        type: "text",
        defaultValue: ""
      });
    });
    return variables;
  }
  /**
   * 生成模板ID
   */
  generateTemplateId() {
    return `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  /**
   * 导出模板
   */
  async exportTemplate(id) {
    const template = await this.getTemplate(id);
    if (!template)
      throw new Error(`Template with id ${id} not found`);
    return JSON.stringify(template, null, 2);
  }
  /**
   * 导入模板
   */
  async importTemplate(jsonStr) {
    try {
      const template = JSON.parse(jsonStr);
      template.metadata.id = this.generateTemplateId();
      template.metadata.isCustom = true;
      template.metadata.isBuiltin = false;
      await this.saveCustomTemplate(template);
    } catch (error) {
      throw new Error(`Failed to import template: ${error}`);
    }
  }
  /**
   * 清理资源
   */
  destroy() {
    this.templates.clear();
    this.removeAllListeners();
    this.initialized = false;
  }
}

export { TemplateManager };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=TemplateManager.js.map
