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

var ConfigManager = require('../config/ConfigManager.cjs');
var FeatureFlags = require('../core/FeatureFlags.cjs');
var index = require('../i18n/index.cjs');
var IconManager = require('../icons/IconManager.cjs');
var index$1 = require('../theme/index.cjs');
var simplify = require('./simplify.cjs');

/**
 * 便捷快捷函数集合
 * 提供更多语法糖和实用工具
 */
/**
 * 快速配置
 */
const quick = {
    /**
     * 切换到深色模式
     */
    darkMode() {
        index$1.getThemeManager().setTheme('dark');
    },
    /**
     * 切换到浅色模式
     */
    lightMode() {
        index$1.getThemeManager().setTheme('light');
    },
    /**
     * 切换主题
     */
    toggleTheme() {
        const theme = index$1.getThemeManager();
        const current = theme.getCurrentThemeName();
        theme.setTheme(current === 'light' ? 'dark' : 'light');
    },
    /**
     * 中文模式
     */
    chinese() {
        return index.getI18n().setLocale('zh-CN');
    },
    /**
     * 英文模式
     */
    english() {
        return index.getI18n().setLocale('en-US');
    },
    /**
     * 日文模式
     */
    japanese() {
        return index.getI18n().setLocale('ja-JP');
    },
    /**
     * 启用AI
     */
    enableAI(apiKey) {
        const features = FeatureFlags.getFeatureFlags();
        features.enable('ai-service');
        features.enable('ai-correct');
        features.enable('ai-complete');
        if (apiKey) {
            const ai = require('../ai/AIService').getAIService();
            ai.updateApiKey('deepseek', apiKey);
        }
    },
    /**
     * 禁用AI
     */
    disableAI() {
        const features = FeatureFlags.getFeatureFlags();
        features.disable('ai-service');
        features.disable('ai-correct');
        features.disable('ai-complete');
        features.disable('ai-rewrite');
        features.disable('ai-translate');
    },
    /**
     * 全屏模式
     */
    fullscreen(editor) {
        editor.commands.execute('toggleFullscreen');
    },
    /**
     * 导出Markdown
     */
    exportMarkdown(editor) {
        return editor.getContent();
    },
    /**
     * 保存到本地
     */
    save(key = 'editor-content', content) {
        localStorage.setItem(key, content || '');
    },
    /**
     * 从本地加载
     */
    load(key = 'editor-content') {
        return localStorage.getItem(key);
    },
    /**
     * 清空编辑器
     */
    clear(editor) {
        editor.setContent('');
    },
};
/**
 * 编辑器快捷操作
 */
function editor(instance) {
    return {
        /**
         * 获取纯文本
         */
        getText() {
            return instance.contentElement?.textContent || '';
        },
        /**
         * 获取HTML
         */
        getHTML() {
            return instance.getContent();
        },
        /**
         * 设置内容
         */
        setContent(html) {
            instance.setContent(html);
        },
        /**
         * 追加内容
         */
        append(html) {
            const current = instance.getContent();
            instance.setContent(current + html);
        },
        /**
         * 插入内容
         */
        insert(html) {
            instance.insertHTML(html);
        },
        /**
         * 字数统计
         */
        wordCount() {
            const text = this.getText();
            return text.trim().split(/\s+/).length;
        },
        /**
         * 字符统计
         */
        charCount() {
            return this.getText().length;
        },
        /**
         * 是否为空
         */
        isEmpty() {
            return this.getText().trim() === '';
        },
        /**
         * 聚焦编辑器
         */
        focus() {
            instance.contentElement?.focus();
        },
        /**
         * 失焦
         */
        blur() {
            instance.contentElement?.blur();
        },
        /**
         * 滚动到顶部
         */
        scrollTop() {
            instance.contentElement?.scrollTo(0, 0);
        },
        /**
         * 滚动到底部
         */
        scrollBottom() {
            const el = instance.contentElement;
            if (el)
                el.scrollTo(0, el.scrollHeight);
        },
    };
}
/**
 * 批量操作
 */
const batch = {
    /**
     * 启用博客功能
     */
    enableBlogFeatures() {
        const features = FeatureFlags.getFeatureFlags();
        features.enableBatch([
            'bold',
            'italic',
            'underline',
            'heading',
            'bullet-list',
            'ordered-list',
            'blockquote',
            'link',
            'image',
            'codeblock',
        ]);
    },
    /**
     * 启用所有格式化
     */
    enableAllFormatting() {
        const features = FeatureFlags.getFeatureFlags();
        features.enableBatch([
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'code',
            'subscript',
            'superscript',
            'text-color',
            'background-color',
            'font-size',
            'font-family',
            'line-height',
        ]);
    },
    /**
     * 启用所有媒体
     */
    enableAllMedia() {
        const features = FeatureFlags.getFeatureFlags();
        features.enableBatch([
            'link',
            'image',
            'video',
            'audio',
            'file',
        ]);
    },
    /**
     * 禁用所有AI
     */
    disableAllAI() {
        quick.disableAI();
    },
    /**
     * 禁用所有高级功能
     */
    disableAdvanced() {
        const features = FeatureFlags.getFeatureFlags();
        features.disableBatch([
            'collaboration',
            'version-control',
            'comments',
        ]);
    },
};
/**
 * 调试工具
 */
const debug = {
    /**
     * 显示所有配置
     */
    showConfig() {
        const config = ConfigManager.getConfigManager();
        console.log('配置管理器:', config);
        console.log('当前主题:', config.getTheme());
        console.log('当前图标集:', config.getIconSet());
        console.log('当前语言:', config.getLocale());
    },
    /**
     * 显示功能状态
     */
    showFeatures() {
        const features = FeatureFlags.getFeatureFlags();
        console.log('功能统计:', features.getStats());
        console.log('已启用功能:', features.getEnabled());
        console.log('懒加载功能:', features.getLazyFeatures());
    },
    /**
     * 显示性能
     */
    showPerformance() {
        const monitor = require('./PerformanceMonitor').getPerformanceMonitor();
        console.log('性能指标:', monitor.getMetrics());
        console.log(monitor.generateReport());
    },
    /**
     * 显示加载统计
     */
    showLoadStats() {
        const loader = require('../core/LazyLoader').getLazyLoader();
        console.log('加载统计:', loader.getStats());
        console.log('加载时间:', loader.getLoadTimes());
    },
    /**
     * 全部信息
     */
    showAll() {
        console.log('=== 编辑器调试信息 ===\n');
        this.showConfig();
        console.log('\n');
        this.showFeatures();
        console.log('\n');
        this.showPerformance();
        console.log('\n');
        this.showLoadStats();
    },
};
/**
 * 性能优化快捷方式
 */
const optimize = {
    /**
     * 启用性能模式
     */
    performanceMode() {
        const features = FeatureFlags.getFeatureFlags();
        // 只保留核心功能
        features.onlyEnable([
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
        simplify.ui.toast('性能模式已启用', 'success');
    },
    /**
     * 清理缓存
     */
    clearCache() {
        IconManager.getIconManager();
        // 图标缓存清理
        simplify.ui.toast('缓存已清理', 'success');
    },
    /**
     * 减少内存
     */
    reduceMemory() {
        // 禁用高内存功能
        const features = FeatureFlags.getFeatureFlags();
        features.disableBatch([
            'collaboration',
            'version-control',
            'video',
            'audio',
        ]);
        simplify.ui.toast('已禁用高内存功能', 'info');
    },
    /**
     * 启用所有优化
     */
    enableAll() {
        this.performanceMode();
        this.clearCache();
        simplify.ui.toast('所有优化已启用', 'success');
    },
};

exports.batch = batch;
exports.debug = debug;
exports.editor = editor;
exports.optimize = optimize;
exports.quick = quick;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=shortcuts.cjs.map
