/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { getConfigManager } from '../config/ConfigManager.js';
import { ToolbarManager } from '../ui/ToolbarManager.js';
import { Editor } from './Editor.js';
import { getFeatureFlags, FeatureCategory } from './FeatureFlags.js';
import { getLazyLoader } from './LazyLoader.js';
import { getPluginRegistry } from './PluginRegistry.js';

/**
 * 编辑器构建器
 * 提供流式API，简化编辑器配置和初始化
 */
/**
 * 编辑器构建器类
 */
class EditorBuilder {
    constructor() {
        this.options = {};
        this.features = getFeatureFlags();
        this.registry = getPluginRegistry();
        this.loader = getLazyLoader();
        this.config = getConfigManager();
        this.toolbarConfig = {};
    }
    /**
     * 设置容器元素
     */
    element(selector) {
        this.options.element = selector;
        return this;
    }
    /**
     * 设置初始内容
     */
    content(html) {
        this.options.content = html;
        return this;
    }
    /**
     * 设置是否可编辑
     */
    editable(value = true) {
        this.options.editable = value;
        return this;
    }
    /**
     * 启用功能
     */
    enableFeature(featureId) {
        this.features.enable(featureId);
        return this;
    }
    /**
     * 禁用功能
     */
    disableFeature(featureId) {
        this.features.disable(featureId);
        return this;
    }
    /**
     * 启用分类下所有功能
     */
    enableCategory(category) {
        this.features.enableCategory(category);
        return this;
    }
    /**
     * 禁用分类下所有功能
     */
    disableCategory(category) {
        this.features.disableCategory(category);
        return this;
    }
    /**
     * 只启用指定功能
     */
    onlyEnable(featureIds) {
        // 先禁用所有
        this.features.getAllFeatures().forEach((f) => {
            f.enabled = false;
        });
        // 再启用指定的
        featureIds.forEach((id) => {
            this.features.enable(id);
        });
        return this;
    }
    /**
     * 设置图标集
     */
    icons(iconSet) {
        this.config.setIconSet(iconSet);
        return this;
    }
    /**
     * 设置主题
     */
    theme(themeName) {
        this.config.setTheme(themeName);
        return this;
    }
    /**
     * 设置语言
     */
    async locale(locale) {
        await this.config.setLocale(locale);
        return this;
    }
    /**
     * 使用轻量级预设
     */
    lightweight() {
        // 只启用核心功能
        this.onlyEnable([
            'basic-editing',
            'selection',
            'history',
            'bold',
            'italic',
            'underline',
            'heading',
            'paragraph',
            'bullet-list',
            'ordered-list',
            'link',
        ]);
        this.toolbarConfig = {
            compact: true,
            showLabels: false,
            lazyLoad: true,
        };
        return this;
    }
    /**
     * 使用功能完整预设
     */
    fullFeatured() {
        // 启用所有功能
        this.features.getAllFeatures().forEach((f) => {
            f.enabled = true;
        });
        this.toolbarConfig = {
            compact: false,
            showLabels: false,
            lazyLoad: true,
        };
        return this;
    }
    /**
     * 只启用格式化功能
     */
    formatOnly() {
        this.onlyEnable([
            'basic-editing',
            'selection',
            'history',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'heading',
            'paragraph',
            'bullet-list',
            'ordered-list',
        ]);
        return this;
    }
    /**
     * 启用所有媒体功能
     */
    withMedia() {
        this.enableCategory(FeatureCategory.MEDIA);
        return this;
    }
    /**
     * 启用AI功能
     */
    withAI(apiKey, provider = 'deepseek') {
        this.enableCategory(FeatureCategory.AI);
        if (apiKey) {
            const ai = require('../ai/AIService').getAIService();
            ai.updateApiKey(provider, apiKey);
            ai.setProvider(provider);
        }
        return this;
    }
    /**
     * 启用表格功能
     */
    withTable() {
        this.enableCategory(FeatureCategory.TABLE);
        return this;
    }
    /**
     * 配置工具栏
     */
    toolbar(config) {
        this.toolbarConfig = { ...this.toolbarConfig, ...config };
        return this;
    }
    /**
     * 紧凑模式
     */
    compact(value = true) {
        this.toolbarConfig.compact = value;
        return this;
    }
    /**
     * 显示标签
     */
    showLabels(value = true) {
        this.toolbarConfig.showLabels = value;
        return this;
    }
    /**
     * 构建编辑器
     */
    async build() {
        // 创建编辑器实例
        const editor = new Editor(this.options);
        // 设置编辑器到注册中心
        this.registry.setEditor(editor);
        // 加载立即需要的功能
        const eagerFeatures = this.features.getEagerFeatures();
        const eagerIds = eagerFeatures.map(f => f.id);
        if (eagerIds.length > 0)
            await this.loader.loadBatch(eagerIds);
        // 预加载懒加载功能
        const lazyFeatures = this.features.getLazyFeatures();
        const lazyIds = lazyFeatures.map(f => f.id);
        if (lazyIds.length > 0) {
            // 后台预加载
            this.loader.preload(lazyIds);
        }
        // 创建工具栏
        if (this.toolbarConfig && Object.keys(this.toolbarConfig).length > 0) {
            const toolbar = new ToolbarManager(editor, this.toolbarConfig);
            const toolbarElement = toolbar.render();
            if (editor.element)
                editor.element.insertBefore(toolbarElement, editor.contentElement);
        }
        return editor;
    }
}
/**
 * 创建编辑器构建器
 */
function createEditor() {
    return new EditorBuilder();
}
/**
 * 便捷函数：快速创建轻量级编辑器
 */
async function createLightweightEditor(element) {
    return createEditor()
        .element(element)
        .lightweight()
        .build();
}
/**
 * 便捷函数：快速创建功能完整编辑器
 */
async function createFullFeaturedEditor(element) {
    return createEditor()
        .element(element)
        .fullFeatured()
        .build();
}
/**
 * 便捷函数：快速创建仅格式化编辑器
 */
async function createFormatOnlyEditor(element) {
    return createEditor()
        .element(element)
        .formatOnly()
        .build();
}

export { EditorBuilder, createEditor, createFormatOnlyEditor, createFullFeaturedEditor, createLightweightEditor };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=EditorBuilder.js.map
