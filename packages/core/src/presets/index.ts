/**
 * 编辑器预设配置
 *
 * 提供多种预设插件组合，方便快速创建不同功能级别的编辑器
 *
 * @example
 * ```typescript
 * import { Editor } from '@ldesign/editor-core'
 * import { basicPlugins, standardPlugins, fullPlugins } from '@ldesign/editor-core/presets'
 *
 * // 基础编辑器 - 只有基本格式化
 * const basicEditor = new Editor({
 *   element: '#editor',
 *   plugins: basicPlugins,
 * })
 *
 * // 标准编辑器 - 常用功能
 * const standardEditor = new Editor({
 *   element: '#editor',
 *   plugins: standardPlugins,
 * })
 *
 * // 完整功能编辑器
 * const fullEditor = new Editor({
 *   element: '#editor',
 *   plugins: fullPlugins,
 * })
 * ```
 */

import type { Plugin } from '../types'

// 格式化插件
import {
  AlignPlugin,
  BackgroundColorPlugin,
  BoldPlugin,
  ClearFormatPlugin,
  FontFamilyPlugin,
  FontSizePlugin,
  IndentPlugin,
  InlineCodePlugin,
  ItalicPlugin,
  LineHeightPlugin,
  StrikePlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  TextColorPlugin,
  TextTransformPlugin,
  UnderlinePlugin,
} from '../plugins/formatting'

// 文本结构插件
import {
  BlockquotePlugin,
  BulletListPlugin,
  HeadingPlugin,
  LinkPlugin,
  OrderedListPlugin,
  TaskListPlugin,
} from '../plugins/text'

// 媒体插件
import ImagePlugin from '../plugins/media/image'
import ImageResizePlugin from '../plugins/media/image-resize'
import ImageToolbarPlugin from '../plugins/media/image-toolbar'
import ImageStyleDialogPlugin from '../plugins/media/image-style-dialog'
import MediaCommandsPlugin from '../plugins/media/media-commands'
import MediaContextMenuPlugin from '../plugins/media/media-context-menu'
import MediaDialogPlugin from '../plugins/media/media-dialog'

// 表格插件
import { TablePlugin } from '../plugins/table'
import { HorizontalRulePlugin } from '../plugins/horizontal-rule'

// 工具插件
import ContextMenuPlugin from '../plugins/utils/context-menu'
import ExportMarkdownPlugin from '../plugins/utils/export-markdown'
import FindReplacePlugin from '../plugins/utils/find-replace'
import FullscreenPlugin from '../plugins/utils/fullscreen'
import HistoryPlugin from '../plugins/utils/history'
import WordCountPlugin from '../plugins/utils/word-count'

// 代码块插件
import { CodeBlockPlugin } from '../plugins/codeblock'

// Emoji 插件
import { EmojiPlugin } from '../plugins/emoji'

// AI 插件
import AIPlugin from '../plugins/ai'

/**
 * 空预设 - 不加载任何插件
 * 适用于需要完全自定义的场景
 */
export const minimalPlugins: Plugin[] = []

/**
 * 基础预设 - 只包含基本文本格式化
 * 适用于简单的文本输入场景，如评论框
 */
export const basicPlugins: Plugin[] = [
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikePlugin,
  HistoryPlugin,
]

/**
 * 标准预设 - 常用编辑功能
 * 适用于大多数富文本编辑场景
 */
export const standardPlugins: Plugin[] = [
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
  FindReplacePlugin,
]

/**
 * 完整预设 - 所有功能
 * 适用于专业文档编辑、CMS 等场景
 */
export const fullPlugins: Plugin[] = [
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
    showDimensions: true,
  }),
  new ImageToolbarPlugin({
    position: 'top',
    showAlign: true,
    showLink: true,
    showEdit: true,
    showDelete: true,
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
  AIPlugin,
]

/**
 * 文档编辑预设 - 专注于文档编辑
 * 适用于知识库、文档系统
 */
export const documentPlugins: Plugin[] = [
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
  ExportMarkdownPlugin,
]

/**
 * 博客预设 - 适用于博客写作
 */
export const blogPlugins: Plugin[] = [
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
  ExportMarkdownPlugin,
]

/**
 * 创建自定义预设
 * @param base - 基础预设
 * @param additions - 要添加的插件
 * @param removals - 要移除的插件名称
 */
export function createPreset(
  base: Plugin[],
  additions: Plugin[] = [],
  removals: string[] = [],
): Plugin[] {
  const filtered = base.filter(plugin => !removals.includes(plugin.name))
  return [...filtered, ...additions]
}

// 默认导出标准预设
export default standardPlugins
