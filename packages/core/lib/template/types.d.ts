/**
 * 模板系统类型定义
 */
/**
 * 模板分类
 */
export declare enum TemplateCategory {
    BUSINESS = "business",
    EDUCATION = "education",
    PERSONAL = "personal",
    CREATIVE = "creative",
    TECHNICAL = "technical",
    CUSTOM = "custom"
}
/**
 * 模板元数据
 */
export interface TemplateMetadata {
    id: string;
    name: string;
    description?: string;
    category: TemplateCategory;
    tags?: string[];
    author?: string;
    version?: string;
    createdAt?: Date;
    updatedAt?: Date;
    thumbnail?: string;
    isBuiltin?: boolean;
    isCustom?: boolean;
}
/**
 * 模板内容
 */
export interface Template {
    metadata: TemplateMetadata;
    content: string;
    styles?: string;
    variables?: TemplateVariable[];
}
/**
 * 模板变量
 */
export interface TemplateVariable {
    key: string;
    label: string;
    type: 'text' | 'date' | 'select' | 'boolean';
    defaultValue?: any;
    options?: Array<{
        label: string;
        value: any;
    }>;
    required?: boolean;
}
/**
 * 模板存储接口
 */
export interface TemplateStorage {
    getAll: () => Promise<Template[]>;
    getById: (id: string) => Promise<Template | null>;
    getByCategory: (category: TemplateCategory) => Promise<Template[]>;
    save: (template: Template) => Promise<void>;
    update: (id: string, template: Partial<Template>) => Promise<void>;
    delete: (id: string) => Promise<void>;
    search: (query: string) => Promise<Template[]>;
}
/**
 * 模板应用选项
 */
export interface ApplyTemplateOptions {
    replaceContent?: boolean;
    variables?: Record<string, any>;
    preserveStyles?: boolean;
}
/**
 * 模板管理器配置
 */
export interface TemplateManagerConfig {
    storage?: 'local' | 'session' | 'custom';
    customStorage?: TemplateStorage;
    builtinTemplates?: Template[];
    maxCustomTemplates?: number;
    enableVariables?: boolean;
}
//# sourceMappingURL=types.d.ts.map