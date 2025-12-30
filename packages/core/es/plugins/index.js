/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { formattingPlugins } from './formatting/index.js';
import { mediaPlugins } from './media/index.js';
import { tablePlugins } from './table/index.js';
import { textPlugins } from './text/index.js';
import { utilPlugins } from './utils/index.js';
export { default as AIPlugin } from './ai/AIPluginV2.js';
export { CodeBlockPlugin } from './codeblock/index.js';
export { EmojiPlugin } from './emoji/index.js';
export { HorizontalRulePlugin } from './horizontal-rule/index.js';
export { default as TemplatePlugin, getTemplateManager } from './template/index.js';

const allPlugins = [
  ...formattingPlugins,
  ...mediaPlugins,
  ...textPlugins,
  ...tablePlugins,
  ...utilPlugins,
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

export { allPlugins, defaultPlugins, extendedPlugins, formattingPlugins, mediaPlugins, tablePlugins, textPlugins, utilPlugins };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
