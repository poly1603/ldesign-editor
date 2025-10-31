/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { formattingPlugins } from './formatting/index.js';
import { mediaPlugins } from './media/index.js';
import { tablePlugins } from './table.js';
export { TablePlugin } from './table.js';
import { textPlugins } from './text/index.js';
import { utilPlugins } from './utils/index.js';
export { default as AIPlugin } from './ai/AIPluginV2.js';
export { CodeBlockPlugin } from './codeblock.js';
export { EmojiPlugin } from './emoji.js';
export { EnhancedTablePlugin } from './table-enhanced.js';
export { default as TemplatePlugin, getTemplateManager } from './template.js';
export { default as FormattingCommandsPlugin } from './formatting/formatting-commands.js';
export { ImagePlugin } from './media/image.js';
export { ImageResizePlugin } from './media/image-resize/index.js';
export { default as MediaCommandsPlugin } from './media/media-commands.js';
export { MediaContextMenuPlugin } from './media/media-context-menu/MediaContextMenuPlugin.js';
export { MediaDialogPlugin } from './media/media-dialog.js';
export { ContextMenuPlugin } from './utils/context-menu.js';
export { ExportMarkdownPlugin } from './utils/export-markdown.js';
export { FindReplacePlugin } from './utils/find-replace.js';
export { default as FullscreenPlugin } from './utils/fullscreen.js';
export { default as HistoryPlugin } from './utils/history.js';
export { default as WordCountPlugin } from './utils/word-count.js';
export { AlignPlugin } from './formatting/align.js';
export { BackgroundColorPlugin, PRESET_COLORS, TextColorPlugin } from './formatting/color.js';
export { FONT_FAMILIES, FONT_SIZES, FontFamilyPlugin, FontSizePlugin } from './formatting/font.js';
export { BoldPlugin, ClearFormatPlugin, CodePlugin, InlineCodePlugin, ItalicPlugin, StrikePlugin, UnderlinePlugin } from './formatting/formatting.js';
export { IndentPlugin } from './formatting/indent.js';
export { LINE_HEIGHTS, LineHeightPlugin } from './formatting/line-height.js';
export { SubscriptPlugin, SuperscriptPlugin } from './formatting/script.js';
export { CapitalizePlugin, LowerCasePlugin, TextTransformPlugin, UpperCasePlugin } from './formatting/text-transform.js';
export { BlockquotePlugin } from './text/blockquote.js';
export { HeadingPlugin } from './text/heading.js';
export { LinkPlugin } from './text/link.js';
export { BulletListPlugin, OrderedListPlugin, TaskListPlugin } from './text/list.js';

/**
 * 插件导出 - 优化后的结构
 */
// 格式化插件
// 聚合导出所有插件集合
const allPlugins = [
    ...formattingPlugins,
    ...mediaPlugins,
    ...textPlugins,
    ...tablePlugins,
    ...utilPlugins,
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

export { allPlugins, defaultPlugins, extendedPlugins, formattingPlugins, mediaPlugins, tablePlugins, textPlugins, utilPlugins };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
