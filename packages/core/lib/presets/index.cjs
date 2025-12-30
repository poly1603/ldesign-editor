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

Object.defineProperty(exports, '__esModule', { value: true });

var align = require('../plugins/formatting/align.cjs');
var color = require('../plugins/formatting/color.cjs');
var font = require('../plugins/formatting/font.cjs');
var formatting = require('../plugins/formatting/formatting.cjs');
var indent = require('../plugins/formatting/indent.cjs');
var lineHeight = require('../plugins/formatting/line-height.cjs');
var script = require('../plugins/formatting/script.cjs');
var textTransform = require('../plugins/formatting/text-transform.cjs');
var blockquote = require('../plugins/text/blockquote.cjs');
var heading = require('../plugins/text/heading.cjs');
var link = require('../plugins/text/link.cjs');
require('../plugins/text/link-preview.cjs');
var list = require('../plugins/text/list.cjs');
var image = require('../plugins/media/image.cjs');
var index$1 = require('../plugins/media/image-resize/index.cjs');
var imageToolbar = require('../plugins/media/image-toolbar.cjs');
var imageStyleDialog = require('../plugins/media/image-style-dialog.cjs');
var mediaCommands = require('../plugins/media/media-commands.cjs');
var MediaContextMenuPlugin = require('../plugins/media/media-context-menu/MediaContextMenuPlugin.cjs');
var mediaDialog = require('../plugins/media/media-dialog.cjs');
var table = require('../plugins/table/table.cjs');
require('../plugins/table/table-enhanced.cjs');
require('../plugins/table/table-toolbar.cjs');
require('../plugins/table/table-patch.cjs');
var index$2 = require('../plugins/horizontal-rule/index.cjs');
var contextMenu = require('../plugins/utils/context-menu.cjs');
var exportMarkdown = require('../plugins/utils/export-markdown.cjs');
var findReplace = require('../plugins/utils/find-replace.cjs');
var fullscreen = require('../plugins/utils/fullscreen.cjs');
var history = require('../plugins/utils/history.cjs');
var wordCount = require('../plugins/utils/word-count.cjs');
var index = require('../plugins/codeblock/index.cjs');
var index$3 = require('../plugins/emoji/index.cjs');
var AIPluginV2 = require('../plugins/ai/AIPluginV2.cjs');

const minimalPlugins = [];
const basicPlugins = [formatting.BoldPlugin, formatting.ItalicPlugin, formatting.UnderlinePlugin, formatting.StrikePlugin, history.default];
const standardPlugins = [
  // 基础格式化
  formatting.BoldPlugin,
  formatting.ItalicPlugin,
  formatting.UnderlinePlugin,
  formatting.StrikePlugin,
  formatting.InlineCodePlugin,
  formatting.ClearFormatPlugin,
  // 标题和列表
  heading.HeadingPlugin,
  list.BulletListPlugin,
  list.OrderedListPlugin,
  blockquote.BlockquotePlugin,
  // 链接和媒体
  link.LinkPlugin,
  image.ImagePlugin,
  mediaCommands.default,
  // 文本样式
  align.AlignPlugin,
  color.TextColorPlugin,
  color.BackgroundColorPlugin,
  font.FontSizePlugin,
  // 工具
  history.default,
  findReplace.FindReplacePlugin
];
const fullPlugins = [
  // 基础格式化
  formatting.BoldPlugin,
  formatting.ItalicPlugin,
  formatting.UnderlinePlugin,
  formatting.StrikePlugin,
  formatting.InlineCodePlugin,
  script.SuperscriptPlugin,
  script.SubscriptPlugin,
  formatting.ClearFormatPlugin,
  // 标题和结构
  heading.HeadingPlugin,
  list.BulletListPlugin,
  list.OrderedListPlugin,
  list.TaskListPlugin,
  blockquote.BlockquotePlugin,
  index.CodeBlockPlugin,
  // 链接和媒体
  link.LinkPlugin,
  image.ImagePlugin,
  mediaCommands.default,
  mediaDialog.MediaDialogPlugin,
  new MediaContextMenuPlugin.MediaContextMenuPlugin(),
  new index$1.ImageResizePlugin({
    minWidth: 50,
    minHeight: 50,
    preserveAspectRatio: true,
    showDimensions: true
  }),
  new imageToolbar.ImageToolbarPlugin({
    position: "top",
    showAlign: true,
    showLink: true,
    showEdit: true,
    showDelete: true
  }),
  new imageStyleDialog.ImageStyleDialogPlugin(),
  // 表格
  table.TablePlugin,
  index$2.HorizontalRulePlugin,
  // 文本样式
  align.AlignPlugin,
  color.TextColorPlugin,
  color.BackgroundColorPlugin,
  font.FontSizePlugin,
  font.FontFamilyPlugin,
  indent.IndentPlugin,
  lineHeight.LineHeightPlugin,
  textTransform.TextTransformPlugin,
  // 工具
  history.default,
  findReplace.FindReplacePlugin,
  fullscreen.default,
  wordCount.default,
  exportMarkdown.ExportMarkdownPlugin,
  index$3.EmojiPlugin,
  contextMenu.ContextMenuPlugin,
  // AI
  AIPluginV2.default
];
const documentPlugins = [
  // 基础格式化
  formatting.BoldPlugin,
  formatting.ItalicPlugin,
  formatting.UnderlinePlugin,
  formatting.StrikePlugin,
  formatting.InlineCodePlugin,
  formatting.ClearFormatPlugin,
  // 文档结构
  heading.HeadingPlugin,
  list.BulletListPlugin,
  list.OrderedListPlugin,
  list.TaskListPlugin,
  blockquote.BlockquotePlugin,
  index.CodeBlockPlugin,
  // 链接和媒体
  link.LinkPlugin,
  image.ImagePlugin,
  mediaCommands.default,
  // 表格
  table.TablePlugin,
  index$2.HorizontalRulePlugin,
  // 文本样式
  align.AlignPlugin,
  indent.IndentPlugin,
  // 工具
  history.default,
  findReplace.FindReplacePlugin,
  wordCount.default,
  exportMarkdown.ExportMarkdownPlugin
];
const blogPlugins = [
  // 格式化
  formatting.BoldPlugin,
  formatting.ItalicPlugin,
  formatting.UnderlinePlugin,
  formatting.StrikePlugin,
  formatting.InlineCodePlugin,
  formatting.ClearFormatPlugin,
  // 结构
  heading.HeadingPlugin,
  list.BulletListPlugin,
  list.OrderedListPlugin,
  blockquote.BlockquotePlugin,
  index.CodeBlockPlugin,
  // 媒体
  link.LinkPlugin,
  image.ImagePlugin,
  mediaCommands.default,
  mediaDialog.MediaDialogPlugin,
  // 工具
  history.default,
  index$3.EmojiPlugin,
  exportMarkdown.ExportMarkdownPlugin
];
function createPreset(base, additions = [], removals = []) {
  const filtered = base.filter((plugin) => !removals.includes(plugin.name));
  return [...filtered, ...additions];
}

exports.basicPlugins = basicPlugins;
exports.blogPlugins = blogPlugins;
exports.createPreset = createPreset;
exports.default = standardPlugins;
exports.documentPlugins = documentPlugins;
exports.fullPlugins = fullPlugins;
exports.minimalPlugins = minimalPlugins;
exports.standardPlugins = standardPlugins;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
