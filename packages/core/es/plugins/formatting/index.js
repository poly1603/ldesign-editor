/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
export { AlignPlugin } from './align.js';
export { BackgroundColorPlugin, PRESET_COLORS, TextColorPlugin } from './color.js';
export { FONT_FAMILIES, FONT_SIZES, FontFamilyPlugin, FontSizePlugin } from './font.js';
export { BoldPlugin, ClearFormatPlugin, CodePlugin, InlineCodePlugin, ItalicPlugin, StrikePlugin, UnderlinePlugin } from './formatting.js';
export { default as FormattingCommandsPlugin } from './formatting-commands.js';
export { IndentPlugin } from './indent.js';
export { LINE_HEIGHTS, LineHeightPlugin } from './line-height.js';
export { SubscriptPlugin, SuperscriptPlugin } from './script.js';
export { CapitalizePlugin, LowerCasePlugin, TextTransformPlugin, UpperCasePlugin } from './text-transform.js';

/**
 * 格式化相关插件导出
 */
// Export all formatting plugins as array
const formattingPlugins = [];

export { formattingPlugins };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
