/**
 * 模板管理器
 * 负责模板的存储、检索和应用
 */
import type { ApplyTemplateOptions, Template, TemplateCategory, TemplateManagerConfig, TemplateMetadata } from './types';
import { EventEmitter } from '../core/EventEmitter';
export declare class TemplateManager extends EventEmitter {
    private storage;
    private templates;
    private config;
    private initialized;
    constructor(config?: TemplateManagerConfig);
    /**
     * 初始化模板管理器
     */
    init(): Promise<void>;
    /**
     * 获取所有模板
     */
    getAllTemplates(): Promise<Template[]>;
    /**
     * 根据ID获取模板
     */
    getTemplate(id: string): Promise<Template | null>;
    /**
     * 根据分类获取模板
     */
    getTemplatesByCategory(category: TemplateCategory): Promise<Template[]>;
    /**
     * 搜索模板
     */
    searchTemplates(query: string): Promise<Template[]>;
    /**
     * 保存自定义模板
     */
    saveCustomTemplate(template: Template): Promise<void>;
    /**
     * 更新模板
     */
    updateTemplate(id: string, updates: Partial<Template>): Promise<void>;
    /**
     * 删除自定义模板
     */
    deleteTemplate(id: string): Promise<void>;
    /**
     * 应用模板到编辑器
     */
    applyTemplate(editor: any, templateId: string, options?: ApplyTemplateOptions): Promise<void>;
    /**
     * 替换模板变量
     */
    private replaceVariables;
    /**
     * 应用样式到编辑器
     */
    private applyStyles;
    /**
     * 从当前编辑器内容创建模板
     */
    createTemplateFromContent(editor: any, metadata: TemplateMetadata): Promise<Template>;
    /**
     * 提取内容中的变量
     */
    private extractVariables;
    /**
     * 生成模板ID
     */
    private generateTemplateId;
    /**
     * 导出模板
     */
    exportTemplate(id: string): Promise<string>;
    /**
     * 导入模板
     */
    importTemplate(jsonStr: string): Promise<void>;
    /**
     * 清理资源
     */
    destroy(): void;
}
