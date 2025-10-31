/**
 * 本地存储模板适配器
 * 使用 localStorage 存储自定义模板
 */
import type { Template, TemplateCategory, TemplateStorage } from '../types';
export declare class LocalTemplateStorage implements TemplateStorage {
    private readonly STORAGE_KEY;
    private readonly MAX_STORAGE_SIZE;
    /**
     * 获取所有模板
     */
    getAll(): Promise<Template[]>;
    /**
     * 根据ID获取模板
     */
    getById(id: string): Promise<Template | null>;
    /**
     * 根据分类获取模板
     */
    getByCategory(category: TemplateCategory): Promise<Template[]>;
    /**
     * 保存模板
     */
    save(template: Template): Promise<void>;
    /**
     * 更新模板
     */
    update(id: string, template: Partial<Template>): Promise<void>;
    /**
     * 删除模板
     */
    delete(id: string): Promise<void>;
    /**
     * 搜索模板
     */
    search(query: string): Promise<Template[]>;
    /**
     * 保存所有模板到存储
     */
    private saveAll;
    /**
     * 清空所有模板
     */
    clear(): Promise<void>;
    /**
     * 获取存储使用情况
     */
    getStorageInfo(): Promise<{
        used: number;
        limit: number;
        percentage: number;
    }>;
}
