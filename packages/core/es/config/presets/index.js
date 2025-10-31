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
 * 预设配置集合
 * 为不同使用场景提供开箱即用的配置
 */
/**
 * 博客编辑器预设
 * 适合：个人博客、文章写作
 */
const blogPreset = {
    icons: {
        defaultSet: 'lucide',
        enableCache: true,
    },
    theme: {
        defaultTheme: 'light',
        followSystem: true,
    },
    i18n: {
        defaultLocale: 'zh-CN',
        fallbackLocale: 'en-US',
    },
    // 启用功能
    features: {
        enabled: [
            'basic-editing',
            'selection',
            'history',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'heading',
            'paragraph',
            'blockquote',
            'bullet-list',
            'ordered-list',
            'link',
            'image',
            'codeblock',
            'horizontal-rule',
            'emoji',
            'word-count',
        ],
        disabled: [
            'video',
            'audio',
            'file',
            'table',
            'ai-service',
            'collaboration',
            'version-control',
        ],
    },
};
/**
 * CMS编辑器预设
 * 适合：内容管理系统、企业文档
 */
const cmsPreset = {
    icons: {
        defaultSet: 'material',
        enableCache: true,
    },
    theme: {
        defaultTheme: 'light',
        customThemes: [],
    },
    i18n: {
        defaultLocale: 'zh-CN',
    },
    features: {
        enabled: [
            // 所有格式化功能
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
            // 所有插入功能
            'heading',
            'paragraph',
            'blockquote',
            'codeblock',
            'bullet-list',
            'ordered-list',
            'task-list',
            // 媒体
            'link',
            'image',
            'video',
            'table',
            // 工具
            'find-replace',
            'word-count',
            'fullscreen',
            'export',
            'template',
        ],
        disabled: [
            'audio',
            'file',
            'ai-service',
            'collaboration',
        ],
    },
};
/**
 * 协作编辑器预设
 * 适合：团队协作、在线文档
 */
const collaborationPreset = {
    icons: {
        defaultSet: 'lucide',
        enableCache: true,
    },
    theme: {
        defaultTheme: 'light',
        followSystem: false,
    },
    i18n: {
        defaultLocale: 'zh-CN',
    },
    features: {
        enabled: [
            // 完整功能
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'heading',
            'paragraph',
            'blockquote',
            'bullet-list',
            'ordered-list',
            'task-list',
            'link',
            'image',
            'table',
            'find-replace',
            'word-count',
            'template',
            'emoji',
            // 高级功能
            'collaboration',
            'version-control',
            'comments',
        ],
    },
};
/**
 * Markdown编辑器预设
 * 适合：技术文档、README
 */
const markdownPreset = {
    icons: {
        defaultSet: 'feather',
        enableCache: true,
    },
    theme: {
        defaultTheme: 'light',
    },
    i18n: {
        defaultLocale: 'en-US',
    },
    features: {
        enabled: [
            'basic-editing',
            'selection',
            'history',
            'bold',
            'italic',
            'strikethrough',
            'code',
            'heading',
            'paragraph',
            'blockquote',
            'codeblock',
            'bullet-list',
            'ordered-list',
            'task-list',
            'link',
            'image',
            'horizontal-rule',
            'table',
            'emoji',
        ],
        disabled: [
            'text-color',
            'background-color',
            'font-size',
            'font-family',
            'video',
            'audio',
            'ai-service',
        ],
    },
};
/**
 * 笔记编辑器预设
 * 适合：个人笔记、知识管理
 */
const notePreset = {
    icons: {
        defaultSet: 'lucide',
        enableCache: true,
    },
    theme: {
        defaultTheme: 'light',
        followSystem: true,
    },
    i18n: {
        defaultLocale: 'zh-CN',
    },
    autoSave: true,
    autoSaveInterval: 10000, // 10秒自动保存
    features: {
        enabled: [
            'basic-editing',
            'selection',
            'history',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'code',
            'text-color',
            'background-color',
            'heading',
            'paragraph',
            'blockquote',
            'bullet-list',
            'ordered-list',
            'task-list',
            'link',
            'image',
            'codeblock',
            'horizontal-rule',
            'table',
            'template',
            'emoji',
            'find-replace',
            'word-count',
        ],
    },
};
/**
 * 邮件编辑器预设
 * 适合：邮件客户端、通知编辑
 */
const emailPreset = {
    icons: {
        defaultSet: 'material',
        enableCache: true,
    },
    theme: {
        defaultTheme: 'light',
    },
    features: {
        enabled: [
            'basic-editing',
            'selection',
            'history',
            'bold',
            'italic',
            'underline',
            'text-color',
            'background-color',
            'font-size',
            'font-family',
            'paragraph',
            'blockquote',
            'bullet-list',
            'ordered-list',
            'link',
            'image',
        ],
        disabled: [
            'heading',
            'codeblock',
            'video',
            'audio',
            'table',
            'ai-service',
        ],
    },
};
/**
 * 评论编辑器预设
 * 适合：评论框、反馈表单
 */
const commentPreset = {
    icons: {
        defaultSet: 'feather',
        enableCache: true,
    },
    theme: {
        defaultTheme: 'light',
    },
    features: {
        enabled: [
            'basic-editing',
            'selection',
            'bold',
            'italic',
            'code',
            'link',
            'emoji',
        ],
        disabled: [
            // 禁用大部分功能
            'heading',
            'blockquote',
            'codeblock',
            'bullet-list',
            'ordered-list',
            'image',
            'video',
            'table',
            'ai-service',
        ],
    },
};
/**
 * 移动端编辑器预设
 * 适合：手机、平板
 */
const mobilePreset = {
    icons: {
        defaultSet: 'lucide',
        enableCache: true,
    },
    theme: {
        defaultTheme: 'light',
        followSystem: true,
    },
    features: {
        enabled: [
            'basic-editing',
            'selection',
            'history',
            'bold',
            'italic',
            'heading',
            'paragraph',
            'bullet-list',
            'ordered-list',
            'link',
            'image',
            'emoji',
        ],
    },
};
/**
 * 富文本编辑器预设
 * 适合：WYSIWYG编辑、页面编辑器
 */
const richTextPreset = {
    icons: {
        defaultSet: 'lucide',
        enableCache: true,
    },
    theme: {
        defaultTheme: 'light',
    },
    features: {
        enabled: [
            // 完整格式化
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
            // 完整插入
            'heading',
            'paragraph',
            'blockquote',
            'codeblock',
            'bullet-list',
            'ordered-list',
            'task-list',
            'horizontal-rule',
            // 完整媒体
            'link',
            'image',
            'video',
            // 表格
            'table',
            'table-row',
            'table-column',
            'table-cell',
            // 工具
            'find-replace',
            'word-count',
            'fullscreen',
            'export',
            'template',
            'emoji',
        ],
    },
};
/**
 * AI增强编辑器预设
 * 适合：AI辅助写作、内容创作
 */
const aiEnhancedPreset = {
    icons: {
        defaultSet: 'lucide',
        enableCache: true,
    },
    theme: {
        defaultTheme: 'light',
    },
    features: {
        enabled: [
            // 基础功能
            'basic-editing',
            'selection',
            'history',
            'bold',
            'italic',
            'underline',
            'heading',
            'paragraph',
            'blockquote',
            'bullet-list',
            'ordered-list',
            'link',
            'image',
            // AI功能全开
            'ai-service',
            'ai-correct',
            'ai-complete',
            'ai-rewrite',
            'ai-translate',
            // 工具
            'word-count',
            'template',
        ],
    },
};
/**
 * 代码文档编辑器预设
 * 适合：技术文档、API文档
 */
const codeDocPreset = {
    icons: {
        defaultSet: 'feather',
        enableCache: true,
    },
    theme: {
        defaultTheme: 'light',
    },
    features: {
        enabled: [
            'basic-editing',
            'selection',
            'history',
            'bold',
            'italic',
            'code',
            'heading',
            'paragraph',
            'blockquote',
            'codeblock',
            'bullet-list',
            'ordered-list',
            'task-list',
            'link',
            'image',
            'table',
            'horizontal-rule',
            'find-replace',
            'word-count',
            'template',
        ],
    },
};
/**
 * 最小化编辑器预设
 * 适合：嵌入式编辑器、限制功能场景
 */
const minimalPreset = {
    icons: {
        defaultSet: 'feather',
        enableCache: true,
    },
    theme: {
        defaultTheme: 'light',
    },
    features: {
        enabled: [
            'basic-editing',
            'selection',
            'bold',
            'italic',
            'link',
        ],
    },
};
/**
 * 所有预设配置
 */
const presets = {
    blog: blogPreset,
    cms: cmsPreset,
    collaboration: collaborationPreset,
    markdown: markdownPreset,
    note: notePreset,
    email: emailPreset,
    comment: commentPreset,
    mobile: mobilePreset,
    richText: richTextPreset,
    aiEnhanced: aiEnhancedPreset,
    codeDoc: codeDocPreset,
    minimal: minimalPreset,
};
/**
 * 获取预设配置
 */
function getPreset(name) {
    return presets[name];
}
/**
 * 获取所有预设名称
 */
function getPresetNames() {
    return Object.keys(presets);
}
/**
 * 预设配置描述
 */
const presetDescriptions = {
    blog: {
        name: '博客编辑器',
        description: '适合个人博客和文章写作，包含基础格式化和媒体功能',
        icon: '📝',
    },
    cms: {
        name: 'CMS编辑器',
        description: '适合内容管理系统，功能完整，支持高级格式化和媒体',
        icon: '🏢',
    },
    collaboration: {
        name: '协作编辑器',
        description: '适合团队协作，支持实时协作、版本控制和评论',
        icon: '👥',
    },
    markdown: {
        name: 'Markdown编辑器',
        description: '适合技术文档，专注Markdown语法和代码块',
        icon: '📄',
    },
    note: {
        name: '笔记编辑器',
        description: '适合个人笔记和知识管理，支持自动保存',
        icon: '📒',
    },
    email: {
        name: '邮件编辑器',
        description: '适合邮件客户端，简化的格式化功能',
        icon: '✉️',
    },
    comment: {
        name: '评论编辑器',
        description: '适合评论框和反馈表单，最简功能集',
        icon: '💬',
    },
    mobile: {
        name: '移动端编辑器',
        description: '适合手机和平板，优化触摸操作',
        icon: '📱',
    },
    richText: {
        name: '富文本编辑器',
        description: '适合页面编辑器，完整的WYSIWYG功能',
        icon: '🎨',
    },
    aiEnhanced: {
        name: 'AI增强编辑器',
        description: '适合内容创作，集成AI辅助写作功能',
        icon: '🤖',
    },
    codeDoc: {
        name: '代码文档编辑器',
        description: '适合API文档和技术说明，优化代码展示',
        icon: '💻',
    },
    minimal: {
        name: '最小化编辑器',
        description: '适合嵌入式场景，只包含最基本功能',
        icon: '🔹',
    },
};

export { aiEnhancedPreset, blogPreset, cmsPreset, codeDocPreset, collaborationPreset, commentPreset, emailPreset, getPreset, getPresetNames, markdownPreset, minimalPreset, mobilePreset, notePreset, presetDescriptions, presets, richTextPreset };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
