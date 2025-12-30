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

var index$4 = require('./formatting/index.cjs');
var index$5 = require('./media/index.cjs');
var index$7 = require('./table/index.cjs');
var index$8 = require('./text/index.cjs');
var index$9 = require('./utils/index.cjs');
var AIPluginV2 = require('./ai/AIPluginV2.cjs');
var index = require('./codeblock/index.cjs');
var index$3 = require('./emoji/index.cjs');
var index$1 = require('./horizontal-rule/index.cjs');
var index$2 = require('./template/index.cjs');

const allPlugins = [
  ...index$4.formattingPlugins,
  ...index$5.mediaPlugins,
  ...index$8.textPlugins,
  ...index$7.tablePlugins,
  ...index$9.utilPlugins,
  // 单独插件
  "EmojiPlugin",
  "AIPlugin",
  "TemplatePlugin"
];
const defaultPlugins = [
  "AIPlugin",
  // AI功能默认启用
  "FormattingPlugin",
  "HeadingPlugin",
  "ListPlugin",
  "BlockquotePlugin",
  "LinkPlugin",
  "ImagePlugin",
  "TablePlugin",
  "HistoryPlugin",
  "AlignPlugin",
  "ColorPlugin",
  "FontPlugin",
  "IndentPlugin",
  "FindReplacePlugin"
];
const extendedPlugins = [...defaultPlugins, "CodeBlockPlugin", "HorizontalRulePlugin", "ScriptPlugin", "LineHeightPlugin", "TextTransformPlugin", "FullscreenPlugin", "WordCountPlugin", "ExportMarkdownPlugin", "MediaDialogPlugin", "MediaContextMenuPlugin", "ImageResizePlugin", "EmojiPlugin", "ContextMenuPlugin", "EnhancedTablePlugin", "AIPlugin"];

exports.formattingPlugins = index$4.formattingPlugins;
exports.mediaPlugins = index$5.mediaPlugins;
exports.tablePlugins = index$7.tablePlugins;
exports.textPlugins = index$8.textPlugins;
exports.utilPlugins = index$9.utilPlugins;
exports.AIPlugin = AIPluginV2.default;
exports.CodeBlockPlugin = index.CodeBlockPlugin;
exports.EmojiPlugin = index$3.EmojiPlugin;
exports.HorizontalRulePlugin = index$1.HorizontalRulePlugin;
exports.TemplatePlugin = index$2.default;
exports.getTemplateManager = index$2.getTemplateManager;
exports.allPlugins = allPlugins;
exports.defaultPlugins = defaultPlugins;
exports.extendedPlugins = extendedPlugins;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
