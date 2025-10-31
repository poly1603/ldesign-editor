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

var align = require('./align.cjs');
var color = require('./color.cjs');
var font = require('./font.cjs');
var formatting = require('./formatting.cjs');
var formattingCommands = require('./formatting-commands.cjs');
var indent = require('./indent.cjs');
var lineHeight = require('./line-height.cjs');
var script = require('./script.cjs');
var textTransform = require('./text-transform.cjs');

/**
 * 格式化相关插件导出
 */
// Export all formatting plugins as array
const formattingPlugins = [];

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
exports.FormattingCommandsPlugin = formattingCommands.default;
exports.IndentPlugin = indent.IndentPlugin;
exports.LINE_HEIGHTS = lineHeight.LINE_HEIGHTS;
exports.LineHeightPlugin = lineHeight.LineHeightPlugin;
exports.SubscriptPlugin = script.SubscriptPlugin;
exports.SuperscriptPlugin = script.SuperscriptPlugin;
exports.CapitalizePlugin = textTransform.CapitalizePlugin;
exports.LowerCasePlugin = textTransform.LowerCasePlugin;
exports.TextTransformPlugin = textTransform.TextTransformPlugin;
exports.UpperCasePlugin = textTransform.UpperCasePlugin;
exports.formattingPlugins = formattingPlugins;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
