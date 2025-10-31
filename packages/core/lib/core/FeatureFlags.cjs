/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var event = require('../utils/event.cjs');

/**
 * 功能开关系统
 * 细粒度控制每个功能的启用/禁用
 */
/**
 * 功能分类
 */
exports.FeatureCategory = void 0;
(function (FeatureCategory) {
    FeatureCategory["CORE"] = "core";
    FeatureCategory["FORMAT"] = "format";
    FeatureCategory["INSERT"] = "insert";
    FeatureCategory["MEDIA"] = "media";
    FeatureCategory["TABLE"] = "table";
    FeatureCategory["AI"] = "ai";
    FeatureCategory["TOOL"] = "tool";
    FeatureCategory["ADVANCED"] = "advanced";
})(exports.FeatureCategory || (exports.FeatureCategory = {}));
/**
 * 功能开关管理器
 */
class FeatureFlags extends event.EventEmitter {
    constructor() {
        super();
        this.features = new Map();
        this.loadedFeatures = new Set();
        this.initializeDefaultFeatures();
    }
    /**
     * 初始化默认功能列表
     */
    initializeDefaultFeatures() {
        const defaultFeatures = [
            // 核心功能（始终启用，立即加载）
            { id: 'basic-editing', name: '基础编辑', category: exports.FeatureCategory.CORE, enabled: true, lazy: false },
            { id: 'selection', name: '选区管理', category: exports.FeatureCategory.CORE, enabled: true, lazy: false },
            { id: 'history', name: '撤销重做', category: exports.FeatureCategory.CORE, enabled: true, lazy: false },
            // 格式化功能（可配置）
            { id: 'bold', name: '加粗', category: exports.FeatureCategory.FORMAT, enabled: true, lazy: false },
            { id: 'italic', name: '斜体', category: exports.FeatureCategory.FORMAT, enabled: true, lazy: false },
            { id: 'underline', name: '下划线', category: exports.FeatureCategory.FORMAT, enabled: true, lazy: false },
            { id: 'strikethrough', name: '删除线', category: exports.FeatureCategory.FORMAT, enabled: true, lazy: true },
            { id: 'code', name: '行内代码', category: exports.FeatureCategory.FORMAT, enabled: true, lazy: true },
            { id: 'subscript', name: '下标', category: exports.FeatureCategory.FORMAT, enabled: true, lazy: true },
            { id: 'superscript', name: '上标', category: exports.FeatureCategory.FORMAT, enabled: true, lazy: true },
            { id: 'text-color', name: '文字颜色', category: exports.FeatureCategory.FORMAT, enabled: true, lazy: true },
            { id: 'background-color', name: '背景颜色', category: exports.FeatureCategory.FORMAT, enabled: true, lazy: true },
            { id: 'font-size', name: '字号', category: exports.FeatureCategory.FORMAT, enabled: true, lazy: true },
            { id: 'font-family', name: '字体', category: exports.FeatureCategory.FORMAT, enabled: true, lazy: true },
            { id: 'line-height', name: '行高', category: exports.FeatureCategory.FORMAT, enabled: true, lazy: true },
            // 插入功能（可配置，懒加载）
            { id: 'heading', name: '标题', category: exports.FeatureCategory.INSERT, enabled: true, lazy: false },
            { id: 'paragraph', name: '段落', category: exports.FeatureCategory.INSERT, enabled: true, lazy: false },
            { id: 'blockquote', name: '引用块', category: exports.FeatureCategory.INSERT, enabled: true, lazy: true },
            { id: 'codeblock', name: '代码块', category: exports.FeatureCategory.INSERT, enabled: true, lazy: true },
            { id: 'bullet-list', name: '无序列表', category: exports.FeatureCategory.INSERT, enabled: true, lazy: false },
            { id: 'ordered-list', name: '有序列表', category: exports.FeatureCategory.INSERT, enabled: true, lazy: false },
            { id: 'task-list', name: '任务列表', category: exports.FeatureCategory.INSERT, enabled: true, lazy: true },
            { id: 'horizontal-rule', name: '分隔线', category: exports.FeatureCategory.INSERT, enabled: true, lazy: true },
            // 媒体功能（懒加载）
            { id: 'link', name: '链接', category: exports.FeatureCategory.MEDIA, enabled: true, lazy: false },
            { id: 'image', name: '图片', category: exports.FeatureCategory.MEDIA, enabled: true, lazy: true },
            { id: 'video', name: '视频', category: exports.FeatureCategory.MEDIA, enabled: true, lazy: true },
            { id: 'audio', name: '音频', category: exports.FeatureCategory.MEDIA, enabled: true, lazy: true },
            { id: 'file', name: '文件', category: exports.FeatureCategory.MEDIA, enabled: true, lazy: true },
            // 表格功能（懒加载）
            { id: 'table', name: '表格', category: exports.FeatureCategory.TABLE, enabled: true, lazy: true },
            { id: 'table-row', name: '表格行操作', category: exports.FeatureCategory.TABLE, enabled: true, lazy: true, dependencies: ['table'] },
            { id: 'table-column', name: '表格列操作', category: exports.FeatureCategory.TABLE, enabled: true, lazy: true, dependencies: ['table'] },
            { id: 'table-cell', name: '单元格操作', category: exports.FeatureCategory.TABLE, enabled: true, lazy: true, dependencies: ['table'] },
            // 工具功能（懒加载）
            { id: 'find-replace', name: '查找替换', category: exports.FeatureCategory.TOOL, enabled: true, lazy: true },
            { id: 'word-count', name: '字数统计', category: exports.FeatureCategory.TOOL, enabled: true, lazy: true },
            { id: 'fullscreen', name: '全屏', category: exports.FeatureCategory.TOOL, enabled: true, lazy: false },
            { id: 'export', name: '导出', category: exports.FeatureCategory.TOOL, enabled: true, lazy: true },
            { id: 'template', name: '模板', category: exports.FeatureCategory.TOOL, enabled: true, lazy: true },
            { id: 'emoji', name: '表情', category: exports.FeatureCategory.TOOL, enabled: true, lazy: true },
            // AI功能（默认禁用，懒加载）
            { id: 'ai-correct', name: 'AI纠错', category: exports.FeatureCategory.AI, enabled: false, lazy: true, dependencies: ['ai-service'] },
            { id: 'ai-complete', name: 'AI补全', category: exports.FeatureCategory.AI, enabled: false, lazy: true, dependencies: ['ai-service'] },
            { id: 'ai-rewrite', name: 'AI重写', category: exports.FeatureCategory.AI, enabled: false, lazy: true, dependencies: ['ai-service'] },
            { id: 'ai-translate', name: 'AI翻译', category: exports.FeatureCategory.AI, enabled: false, lazy: true, dependencies: ['ai-service'] },
            { id: 'ai-service', name: 'AI服务', category: exports.FeatureCategory.AI, enabled: false, lazy: true },
            // 高级功能（懒加载）
            { id: 'collaboration', name: '协作编辑', category: exports.FeatureCategory.ADVANCED, enabled: false, lazy: true },
            { id: 'version-control', name: '版本控制', category: exports.FeatureCategory.ADVANCED, enabled: false, lazy: true },
            { id: 'comments', name: '评论批注', category: exports.FeatureCategory.ADVANCED, enabled: false, lazy: true },
        ];
        defaultFeatures.forEach((feature) => {
            this.features.set(feature.id, feature);
        });
    }
    /**
     * 注册功能
     */
    register(feature) {
        if (this.features.has(feature.id)) {
            console.warn(`Feature "${feature.id}" is already registered`);
            return;
        }
        this.features.set(feature.id, feature);
        this.emit('feature:registered', feature);
    }
    /**
     * 启用功能
     */
    enable(featureId) {
        const feature = this.features.get(featureId);
        if (!feature) {
            console.error(`Feature "${featureId}" not found`);
            return;
        }
        feature.enabled = true;
        this.emit('feature:enabled', feature);
    }
    /**
     * 禁用功能
     */
    disable(featureId) {
        const feature = this.features.get(featureId);
        if (!feature) {
            console.error(`Feature "${featureId}" not found`);
            return;
        }
        feature.enabled = false;
        this.emit('feature:disabled', feature);
    }
    /**
     * 切换功能
     */
    toggle(featureId) {
        const feature = this.features.get(featureId);
        if (!feature) {
            console.error(`Feature "${featureId}" not found`);
            return false;
        }
        feature.enabled = !feature.enabled;
        this.emit(feature.enabled ? 'feature:enabled' : 'feature:disabled', feature);
        return feature.enabled;
    }
    /**
     * 检查功能是否启用
     */
    isEnabled(featureId) {
        return this.features.get(featureId)?.enabled || false;
    }
    /**
     * 检查功能是否已加载
     */
    isLoaded(featureId) {
        return this.loadedFeatures.has(featureId);
    }
    /**
     * 标记功能为已加载
     */
    markAsLoaded(featureId) {
        this.loadedFeatures.add(featureId);
        this.emit('feature:loaded', { id: featureId });
    }
    /**
     * 获取功能配置
     */
    getFeature(featureId) {
        return this.features.get(featureId) || null;
    }
    /**
     * 获取所有功能
     */
    getAllFeatures() {
        return Array.from(this.features.values());
    }
    /**
     * 按分类获取功能
     */
    getByCategory(category) {
        return this.getAllFeatures().filter(f => f.category === category);
    }
    /**
     * 获取已启用的功能
     */
    getEnabled() {
        return this.getAllFeatures().filter(f => f.enabled);
    }
    /**
     * 获取需要懒加载的功能
     */
    getLazyFeatures() {
        return this.getAllFeatures().filter(f => f.lazy && f.enabled);
    }
    /**
     * 获取立即加载的功能
     */
    getEagerFeatures() {
        return this.getAllFeatures().filter(f => !f.lazy && f.enabled);
    }
    /**
     * 批量启用
     */
    enableBatch(featureIds) {
        featureIds.forEach(id => this.enable(id));
    }
    /**
     * 批量禁用
     */
    disableBatch(featureIds) {
        featureIds.forEach(id => this.disable(id));
    }
    /**
     * 启用分类下所有功能
     */
    enableCategory(category) {
        this.getByCategory(category).forEach((f) => {
            f.enabled = true;
        });
        this.emit('category:enabled', { category });
    }
    /**
     * 禁用分类下所有功能
     */
    disableCategory(category) {
        this.getByCategory(category).forEach((f) => {
            f.enabled = false;
        });
        this.emit('category:disabled', { category });
    }
    /**
     * 导出配置
     */
    exportConfig() {
        const config = {};
        this.features.forEach((feature, id) => {
            config[id] = {
                enabled: feature.enabled,
                config: feature.config,
            };
        });
        return config;
    }
    /**
     * 导入配置
     */
    importConfig(config) {
        Object.entries(config).forEach(([id, value]) => {
            const feature = this.features.get(id);
            if (feature) {
                if (typeof value === 'boolean') {
                    feature.enabled = value;
                }
                else if (typeof value === 'object') {
                    feature.enabled = value.enabled !== false;
                    if (value.config)
                        feature.config = { ...feature.config, ...value.config };
                }
            }
        });
        this.emit('config:imported');
    }
    /**
     * 重置为默认配置
     */
    reset() {
        this.features.clear();
        this.loadedFeatures.clear();
        this.initializeDefaultFeatures();
        this.emit('config:reset');
    }
    /**
     * 获取统计信息
     */
    getStats() {
        const all = this.getAllFeatures();
        return {
            total: all.length,
            enabled: all.filter(f => f.enabled).length,
            disabled: all.filter(f => !f.enabled).length,
            loaded: this.loadedFeatures.size,
            lazy: all.filter(f => f.lazy).length,
        };
    }
}
// 全局单例
let globalFeatureFlags = null;
/**
 * 获取全局功能开关实例
 */
function getFeatureFlags() {
    if (!globalFeatureFlags)
        globalFeatureFlags = new FeatureFlags();
    return globalFeatureFlags;
}
/**
 * 重置全局功能开关
 */
function resetFeatureFlags() {
    if (globalFeatureFlags) {
        globalFeatureFlags.reset();
        globalFeatureFlags = null;
    }
}

exports.FeatureFlags = FeatureFlags;
exports.getFeatureFlags = getFeatureFlags;
exports.resetFeatureFlags = resetFeatureFlags;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=FeatureFlags.cjs.map
