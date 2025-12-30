/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { AlignPlugin } from '../plugins/formatting/align.js';
import { TextColorPlugin, BackgroundColorPlugin } from '../plugins/formatting/color.js';
import { FontSizePlugin, FontFamilyPlugin } from '../plugins/formatting/font.js';
import { BoldPlugin, ItalicPlugin, UnderlinePlugin, StrikePlugin, InlineCodePlugin, ClearFormatPlugin } from '../plugins/formatting/formatting.js';
import { IndentPlugin } from '../plugins/formatting/indent.js';
import { LineHeightPlugin } from '../plugins/formatting/line-height.js';
import { SuperscriptPlugin, SubscriptPlugin } from '../plugins/formatting/script.js';
import { TextTransformPlugin } from '../plugins/formatting/text-transform.js';
import { BlockquotePlugin } from '../plugins/text/blockquote.js';
import { HeadingPlugin } from '../plugins/text/heading.js';
import { LinkPlugin } from '../plugins/text/link.js';
import '../plugins/text/link-preview.js';
import { BulletListPlugin, OrderedListPlugin, TaskListPlugin } from '../plugins/text/list.js';
import { ImagePlugin } from '../plugins/media/image.js';
import { ImageResizePlugin } from '../plugins/media/image-resize/index.js';
import { ImageToolbarPlugin } from '../plugins/media/image-toolbar.js';
import { ImageStyleDialogPlugin } from '../plugins/media/image-style-dialog.js';
import MediaCommandsPlugin from '../plugins/media/media-commands.js';
import { MediaContextMenuPlugin } from '../plugins/media/media-context-menu/MediaContextMenuPlugin.js';
import { MediaDialogPlugin } from '../plugins/media/media-dialog.js';
import { TablePlugin } from '../plugins/table/table.js';
import '../plugins/table/table-enhanced.js';
import '../plugins/table/table-toolbar.js';
import '../plugins/table/table-patch.js';
import { HorizontalRulePlugin } from '../plugins/horizontal-rule/index.js';
import { ContextMenuPlugin } from '../plugins/utils/context-menu.js';
import { ExportMarkdownPlugin } from '../plugins/utils/export-markdown.js';
import { FindReplacePlugin } from '../plugins/utils/find-replace.js';
import FullscreenPlugin from '../plugins/utils/fullscreen.js';
import HistoryPlugin from '../plugins/utils/history.js';
import WordCountPlugin from '../plugins/utils/word-count.js';
import { CodeBlockPlugin } from '../plugins/codeblock/index.js';
import { EmojiPlugin } from '../plugins/emoji/index.js';
import AIPlugin from '../plugins/ai/AIPluginV2.js';

const minimalPlugins = [];
const basicPlugins = [BoldPlugin, ItalicPlugin, UnderlinePlugin, StrikePlugin, HistoryPlugin];
const standardPlugins = [
  // 基础格式化
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikePlugin,
  InlineCodePlugin,
  ClearFormatPlugin,
  // 标题和列表
  HeadingPlugin,
  BulletListPlugin,
  OrderedListPlugin,
  BlockquotePlugin,
  // 链接和媒体
  LinkPlugin,
  ImagePlugin,
  MediaCommandsPlugin,
  // 文本样式
  AlignPlugin,
  TextColorPlugin,
  BackgroundColorPlugin,
  FontSizePlugin,
  // 工具
  HistoryPlugin,
  FindReplacePlugin
];
const fullPlugins = [
  // 基础格式化
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikePlugin,
  InlineCodePlugin,
  SuperscriptPlugin,
  SubscriptPlugin,
  ClearFormatPlugin,
  // 标题和结构
  HeadingPlugin,
  BulletListPlugin,
  OrderedListPlugin,
  TaskListPlugin,
  BlockquotePlugin,
  CodeBlockPlugin,
  // 链接和媒体
  LinkPlugin,
  ImagePlugin,
  MediaCommandsPlugin,
  MediaDialogPlugin,
  new MediaContextMenuPlugin(),
  new ImageResizePlugin({
    minWidth: 50,
    minHeight: 50,
    preserveAspectRatio: true,
    showDimensions: true
  }),
  new ImageToolbarPlugin({
    position: "top",
    showAlign: true,
    showLink: true,
    showEdit: true,
    showDelete: true
  }),
  new ImageStyleDialogPlugin(),
  // 表格
  TablePlugin,
  HorizontalRulePlugin,
  // 文本样式
  AlignPlugin,
  TextColorPlugin,
  BackgroundColorPlugin,
  FontSizePlugin,
  FontFamilyPlugin,
  IndentPlugin,
  LineHeightPlugin,
  TextTransformPlugin,
  // 工具
  HistoryPlugin,
  FindReplacePlugin,
  FullscreenPlugin,
  WordCountPlugin,
  ExportMarkdownPlugin,
  EmojiPlugin,
  ContextMenuPlugin,
  // AI
  AIPlugin
];
const documentPlugins = [
  // 基础格式化
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikePlugin,
  InlineCodePlugin,
  ClearFormatPlugin,
  // 文档结构
  HeadingPlugin,
  BulletListPlugin,
  OrderedListPlugin,
  TaskListPlugin,
  BlockquotePlugin,
  CodeBlockPlugin,
  // 链接和媒体
  LinkPlugin,
  ImagePlugin,
  MediaCommandsPlugin,
  // 表格
  TablePlugin,
  HorizontalRulePlugin,
  // 文本样式
  AlignPlugin,
  IndentPlugin,
  // 工具
  HistoryPlugin,
  FindReplacePlugin,
  WordCountPlugin,
  ExportMarkdownPlugin
];
const blogPlugins = [
  // 格式化
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikePlugin,
  InlineCodePlugin,
  ClearFormatPlugin,
  // 结构
  HeadingPlugin,
  BulletListPlugin,
  OrderedListPlugin,
  BlockquotePlugin,
  CodeBlockPlugin,
  // 媒体
  LinkPlugin,
  ImagePlugin,
  MediaCommandsPlugin,
  MediaDialogPlugin,
  // 工具
  HistoryPlugin,
  EmojiPlugin,
  ExportMarkdownPlugin
];
function createPreset(base, additions = [], removals = []) {
  const filtered = base.filter((plugin) => !removals.includes(plugin.name));
  return [...filtered, ...additions];
}

export { basicPlugins, blogPlugins, createPreset, standardPlugins as default, documentPlugins, fullPlugins, minimalPlugins, standardPlugins };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
