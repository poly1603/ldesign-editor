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

var index = require('./formatting/index.cjs');
var index$1 = require('./media/index.cjs');
var table = require('./table.cjs');
var index$3 = require('./text/index.cjs');
var index$4 = require('./utils/index.cjs');
var AIPluginV2 = require('./ai/AIPluginV2.cjs');
var codeblock = require('./codeblock.cjs');
var emoji = require('./emoji.cjs');
var tableEnhanced = require('./table-enhanced.cjs');
var template = require('./template.cjs');
var formattingCommands = require('./formatting/formatting-commands.cjs');
var image = require('./media/image.cjs');
var index$2 = require('./media/image-resize/index.cjs');
var mediaCommands = require('./media/media-commands.cjs');
var MediaContextMenuPlugin = require('./media/media-context-menu/MediaContextMenuPlugin.cjs');
var mediaDialog = require('./media/media-dialog.cjs');
var contextMenu = require('./utils/context-menu.cjs');
var exportMarkdown = require('./utils/export-markdown.cjs');
var findReplace = require('./utils/find-replace.cjs');
var fullscreen = require('./utils/fullscreen.cjs');
var history = require('./utils/history.cjs');
var wordCount = require('./utils/word-count.cjs');
var align = require('./formatting/align.cjs');
var color = require('./formatting/color.cjs');
var font = require('./formatting/font.cjs');
var formatting = require('./formatting/formatting.cjs');
var indent = require('./formatting/indent.cjs');
var lineHeight = require('./formatting/line-height.cjs');
var script = require('./formatting/script.cjs');
var textTransform = require('./formatting/text-transform.cjs');
var blockquote = require('./text/blockquote.cjs');
var heading = require('./text/heading.cjs');
var link = require('./text/link.cjs');
var list = require('./text/list.cjs');

/**
 * 插件导出 - 优化后的结构
 */
// 格式化插件
// 聚合导出所有插件集合
const allPlugins = [
    ...index.formattingPlugins,
    ...index$1.mediaPlugins,
    ...index$3.textPlugins,
    ...table.tablePlugins,
    ...index$4.utilPlugins,
    // 单独插件
    'EmojiPlugin',
    'AIPlugin',
    'TemplatePlugin',
];
// 默认插件集合（保持向后兼容）
const defaultPlugins = [
    'AIPlugin', // AI功能默认启用
    'FormattingPlugin',
    'HeadingPlugin',
    'ListPlugin',
    'BlockquotePlugin',
    'LinkPlugin',
    'ImagePlugin',
    'TablePlugin',
    'HistoryPlugin',
    'AlignPlugin',
    'ColorPlugin',
    'FontPlugin',
    'IndentPlugin',
    'FindReplacePlugin',
];
// 扩展插件集合
const extendedPlugins = [
    ...defaultPlugins,
    'CodeBlockPlugin',
    'HorizontalRulePlugin',
    'ScriptPlugin',
    'LineHeightPlugin',
    'TextTransformPlugin',
    'FullscreenPlugin',
    'WordCountPlugin',
    'ExportMarkdownPlugin',
    'MediaDialogPlugin',
    'MediaContextMenuPlugin',
    'ImageResizePlugin',
    'EmojiPlugin',
    'ContextMenuPlugin',
    'EnhancedTablePlugin',
    'AIPlugin',
];

exports.formattingPlugins = index.formattingPlugins;
exports.mediaPlugins = index$1.mediaPlugins;
exports.TablePlugin = table.TablePlugin;
exports.tablePlugins = table.tablePlugins;
exports.textPlugins = index$3.textPlugins;
exports.utilPlugins = index$4.utilPlugins;
exports.AIPlugin = AIPluginV2.default;
exports.CodeBlockPlugin = codeblock.CodeBlockPlugin;
exports.EmojiPlugin = emoji.EmojiPlugin;
exports.EnhancedTablePlugin = tableEnhanced.EnhancedTablePlugin;
exports.TemplatePlugin = template.default;
exports.getTemplateManager = template.getTemplateManager;
exports.FormattingCommandsPlugin = formattingCommands.default;
exports.ImagePlugin = image.ImagePlugin;
exports.ImageResizePlugin = index$2.ImageResizePlugin;
exports.MediaCommandsPlugin = mediaCommands.default;
exports.MediaContextMenuPlugin = MediaContextMenuPlugin.MediaContextMenuPlugin;
exports.MediaDialogPlugin = mediaDialog.MediaDialogPlugin;
exports.ContextMenuPlugin = contextMenu.ContextMenuPlugin;
exports.ExportMarkdownPlugin = exportMarkdown.ExportMarkdownPlugin;
exports.FindReplacePlugin = findReplace.FindReplacePlugin;
exports.FullscreenPlugin = fullscreen.default;
exports.HistoryPlugin = history.default;
exports.WordCountPlugin = wordCount.default;
exports.AlignPlugin = align.AlignPlugin;
exports.BackgroundColorPlugin = color.BackgroundColorPlugin;
exports.PRESET_COLORS = color.PRESET_COLORS;
exports.TextColorPlugin = color.TextColorPlugin;
exports.FONT_FAMILIES = font.FONT_FAMILIES;
exports.FONT_SIZES = font.FONT_SIZES;
exports.FontFamilyPlugin = font.FontFamilyPlugin;
exports.FontSizePlugin = font.FontSizePlugin;
exports.BoldPlugin = formatting.BoldPlugin;
exports.ClearFormatPlugin = formatting.ClearFormatPlugin;
exports.CodePlugin = formatting.CodePlugin;
exports.InlineCodePlugin = formatting.InlineCodePlugin;
exports.ItalicPlugin = formatting.ItalicPlugin;
exports.StrikePlugin = formatting.StrikePlugin;
exports.UnderlinePlugin = formatting.UnderlinePlugin;
exports.IndentPlugin = indent.IndentPlugin;
exports.LINE_HEIGHTS = lineHeight.LINE_HEIGHTS;
exports.LineHeightPlugin = lineHeight.LineHeightPlugin;
exports.SubscriptPlugin = script.SubscriptPlugin;
exports.SuperscriptPlugin = script.SuperscriptPlugin;
exports.CapitalizePlugin = textTransform.CapitalizePlugin;
exports.LowerCasePlugin = textTransform.LowerCasePlugin;
exports.TextTransformPlugin = textTransform.TextTransformPlugin;
exports.UpperCasePlugin = textTransform.UpperCasePlugin;
exports.BlockquotePlugin = blockquote.BlockquotePlugin;
exports.HeadingPlugin = heading.HeadingPlugin;
exports.LinkPlugin = link.LinkPlugin;
exports.BulletListPlugin = list.BulletListPlugin;
exports.OrderedListPlugin = list.OrderedListPlugin;
exports.TaskListPlugin = list.TaskListPlugin;
exports.allPlugins = allPlugins;
exports.defaultPlugins = defaultPlugins;
exports.extendedPlugins = extendedPlugins;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
