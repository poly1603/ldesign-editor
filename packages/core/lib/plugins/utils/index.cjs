/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var index = require('../emoji/index.cjs');
var exportMarkdown = require('./export-markdown.cjs');
var findReplace = require('./find-replace.cjs');
var history = require('./history.cjs');

const utilPlugins = ["EmojiPlugin", "FindReplacePlugin", "ExportMarkdownPlugin", "FullscreenPlugin", "HistoryPlugin", "WordCountPlugin", "ContextMenuPlugin"];

exports.EmojiPlugin = index.EmojiPlugin;
exports.ExportMarkdownPlugin = exportMarkdown.ExportMarkdownPlugin;
exports.FindReplacePlugin = findReplace.FindReplacePlugin;
exports.HistoryPlugin = history.default;
exports.utilPlugins = utilPlugins;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
