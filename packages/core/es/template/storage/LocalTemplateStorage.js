/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
/**
 * 本地存储模板适配器
 * 使用 localStorage 存储自定义模板
 */
class LocalTemplateStorage {
    constructor() {
        this.STORAGE_KEY = 'editor_templates';
        this.MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit
    }
    /**
     * 获取所有模板
     */
    async getAll() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data)
                return [];
            const templates = JSON.parse(data);
            // 转换日期字符串为Date对象
            return templates.map((t) => ({
                ...t,
                metadata: {
                    ...t.metadata,
                    createdAt: t.metadata.createdAt ? new Date(t.metadata.createdAt) : undefined,
                    updatedAt: t.metadata.updatedAt ? new Date(t.metadata.updatedAt) : undefined,
                },
            }));
        }
        catch (error) {
            console.error('Failed to load templates from localStorage:', error);
            return [];
        }
    }
    /**
     * 根据ID获取模板
     */
    async getById(id) {
        const templates = await this.getAll();
        return templates.find(t => t.metadata.id === id) || null;
    }
    /**
     * 根据分类获取模板
     */
    async getByCategory(category) {
        const templates = await this.getAll();
        return templates.filter(t => t.metadata.category === category);
    }
    /**
     * 保存模板
     */
    async save(template) {
        const templates = await this.getAll();
        // 检查是否已存在
        const existingIndex = templates.findIndex(t => t.metadata.id === template.metadata.id);
        if (existingIndex >= 0)
            templates[existingIndex] = template;
        else
            templates.push(template);
        await this.saveAll(templates);
    }
    /**
     * 更新模板
     */
    async update(id, template) {
        const templates = await this.getAll();
        const index = templates.findIndex(t => t.metadata.id === id);
        if (index === -1)
            throw new Error(`Template with id ${id} not found`);
        templates[index] = {
            ...templates[index],
            ...template,
            metadata: {
                ...templates[index].metadata,
                ...template.metadata,
            },
        };
        await this.saveAll(templates);
    }
    /**
     * 删除模板
     */
    async delete(id) {
        const templates = await this.getAll();
        const filtered = templates.filter(t => t.metadata.id !== id);
        if (filtered.length === templates.length)
            throw new Error(`Template with id ${id} not found`);
        await this.saveAll(filtered);
    }
    /**
     * 搜索模板
     */
    async search(query) {
        const templates = await this.getAll();
        const lowerQuery = query.toLowerCase();
        return templates.filter((template) => {
            const metadata = template.metadata;
            return (metadata.name.toLowerCase().includes(lowerQuery)
                || metadata.description?.toLowerCase().includes(lowerQuery)
                || metadata.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)));
        });
    }
    /**
     * 保存所有模板到存储
     */
    async saveAll(templates) {
        try {
            const data = JSON.stringify(templates);
            // 检查存储大小
            if (data.length > this.MAX_STORAGE_SIZE)
                throw new Error('Templates data exceeds maximum storage size (5MB)');
            localStorage.setItem(this.STORAGE_KEY, data);
        }
        catch (error) {
            if (error instanceof DOMException && error.name === 'QuotaExceededError')
                throw new Error('Local storage quota exceeded. Please delete some templates.');
            throw error;
        }
    }
    /**
     * 清空所有模板
     */
    async clear() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
    /**
     * 获取存储使用情况
     */
    async getStorageInfo() {
        const data = localStorage.getItem(this.STORAGE_KEY) || '';
        const used = new Blob([data]).size;
        return {
            used,
            limit: this.MAX_STORAGE_SIZE,
            percentage: (used / this.MAX_STORAGE_SIZE) * 100,
        };
    }
}

export { LocalTemplateStorage };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=LocalTemplateStorage.js.map
