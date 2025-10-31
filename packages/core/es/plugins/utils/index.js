/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
export { EmojiPlugin } from '../emoji.js';
export { ExportMarkdownPlugin } from './export-markdown.js';
export { FindReplacePlugin } from './find-replace.js';
export { default as HistoryPlugin } from './history.js';

/**
 * 工具类插件导出
 */
// 批量导出所有工具插件
const utilPlugins = [
    'EmojiPlugin',
    'FindReplacePlugin',
    'ExportMarkdownPlugin',
    'FullscreenPlugin',
    'HistoryPlugin',
    'WordCountPlugin',
    'ContextMenuPlugin',
];

export { utilPlugins };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
