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

var emoji = require('../emoji.cjs');
var exportMarkdown = require('./export-markdown.cjs');
var findReplace = require('./find-replace.cjs');
var history = require('./history.cjs');

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

exports.EmojiPlugin = emoji.EmojiPlugin;
exports.ExportMarkdownPlugin = exportMarkdown.ExportMarkdownPlugin;
exports.FindReplacePlugin = findReplace.FindReplacePlugin;
exports.HistoryPlugin = history.default;
exports.utilPlugins = utilPlugins;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
