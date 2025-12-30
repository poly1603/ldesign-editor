/**
 * 内置插件注册
 * 将所有内置插件注册到 PluginRegistry，支持按需加载
 */

import { PluginCategory, getPluginRegistry } from '../core/PluginRegistry'

// CSS 样式字符串
const imageResizeStyles = `
.image-resize-overlay {
  position: absolute;
  border: 2px solid #3b82f6;
  pointer-events: none;
  z-index: 10000;
  box-sizing: border-box;
  animation: resize-overlay-show 0.15s ease-out;
}
@keyframes resize-overlay-show {
  from { opacity: 0; }
  to { opacity: 1; }
}
.image-resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #fff;
  border: 2px solid #3b82f6;
  border-radius: 50%;
  pointer-events: auto;
  cursor: pointer;
  box-sizing: border-box;
  transition: transform 0.1s, background 0.1s;
}
.image-resize-handle:hover {
  background: #3b82f6;
  transform: scale(1.2);
}
.handle-nw { top: -6px; left: -6px; cursor: nw-resize; }
.handle-n { top: -6px; left: 50%; margin-left: -5px; cursor: n-resize; }
.handle-ne { top: -6px; right: -6px; cursor: ne-resize; }
.handle-e { top: 50%; right: -6px; margin-top: -5px; cursor: e-resize; }
.handle-se { bottom: -6px; right: -6px; cursor: se-resize; }
.handle-s { bottom: -6px; left: 50%; margin-left: -5px; cursor: s-resize; }
.handle-sw { bottom: -6px; left: -6px; cursor: sw-resize; }
.handle-w { top: 50%; left: -6px; margin-top: -5px; cursor: w-resize; }
.image-resize-dimensions {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.85);
  color: #fff;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-family: ui-monospace, monospace;
  pointer-events: none;
  white-space: nowrap;
}
body.image-resizing {
  user-select: none !important;
  cursor: inherit;
}
body.image-resizing * {
  cursor: inherit !important;
}
`

/**
 * 注册所有内置插件
 */
export function registerBuiltinPlugins(): void {
  const registry = getPluginRegistry()

  // ========== 格式化插件 ==========
  registry.register(
    'bold',
    () => import('./formatting').then(m => m.BoldPlugin),
    { name: 'bold', category: PluginCategory.FORMAT, description: '粗体' },
    { enabled: true, priority: 100 }
  )

  registry.register(
    'italic',
    () => import('./formatting').then(m => m.ItalicPlugin),
    { name: 'italic', category: PluginCategory.FORMAT, description: '斜体' },
    { enabled: true, priority: 99 }
  )

  registry.register(
    'underline',
    () => import('./formatting').then(m => m.UnderlinePlugin),
    { name: 'underline', category: PluginCategory.FORMAT, description: '下划线' },
    { enabled: true, priority: 98 }
  )

  registry.register(
    'strike',
    () => import('./formatting').then(m => m.StrikePlugin),
    { name: 'strike', category: PluginCategory.FORMAT, description: '删除线' },
    { enabled: true, priority: 97 }
  )

  registry.register(
    'textColor',
    () => import('./formatting').then(m => m.TextColorPlugin),
    { name: 'textColor', category: PluginCategory.FORMAT, description: '文字颜色' },
    { enabled: true, priority: 90 }
  )

  registry.register(
    'backgroundColor',
    () => import('./formatting').then(m => m.BackgroundColorPlugin),
    { name: 'backgroundColor', category: PluginCategory.FORMAT, description: '背景颜色' },
    { enabled: true, priority: 89 }
  )

  registry.register(
    'fontSize',
    () => import('./formatting').then(m => m.FontSizePlugin),
    { name: 'fontSize', category: PluginCategory.FORMAT, description: '字体大小' },
    { enabled: true, priority: 88 }
  )

  registry.register(
    'fontFamily',
    () => import('./formatting').then(m => m.FontFamilyPlugin),
    { name: 'fontFamily', category: PluginCategory.FORMAT, description: '字体' },
    { enabled: true, priority: 87 }
  )

  registry.register(
    'align',
    () => import('./formatting').then(m => m.AlignPlugin),
    { name: 'align', category: PluginCategory.FORMAT, description: '对齐方式' },
    { enabled: true, priority: 85 }
  )

  // ========== 文本结构插件 ==========
  registry.register(
    'heading',
    () => import('./text').then(m => m.HeadingPlugin),
    { name: 'heading', category: PluginCategory.BLOCK, description: '标题' },
    { enabled: true, priority: 80 }
  )

  registry.register(
    'bulletList',
    () => import('./text').then(m => m.BulletListPlugin),
    { name: 'bulletList', category: PluginCategory.BLOCK, description: '无序列表' },
    { enabled: true, priority: 79 }
  )

  registry.register(
    'orderedList',
    () => import('./text').then(m => m.OrderedListPlugin),
    { name: 'orderedList', category: PluginCategory.BLOCK, description: '有序列表' },
    { enabled: true, priority: 78 }
  )

  registry.register(
    'taskList',
    () => import('./text').then(m => m.TaskListPlugin),
    { name: 'taskList', category: PluginCategory.BLOCK, description: '任务列表' },
    { enabled: true, priority: 77 }
  )

  registry.register(
    'blockquote',
    () => import('./text').then(m => m.BlockquotePlugin),
    { name: 'blockquote', category: PluginCategory.BLOCK, description: '引用' },
    { enabled: true, priority: 76 }
  )

  registry.register(
    'link',
    () => import('./text').then(m => m.LinkPlugin),
    { name: 'link', category: PluginCategory.INLINE, description: '链接' },
    { enabled: true, priority: 75 }
  )

  registry.register(
    'linkPreview',
    () => import('./text').then(m => m.LinkPreviewPlugin),
    { name: 'linkPreview', category: PluginCategory.TOOL, description: '链接预览' },
    { enabled: true, priority: 74, dependencies: ['link'] }
  )

  // ========== 媒体插件 ==========
  registry.register(
    'image',
    () => import('./media/image').then(m => m.default),
    { name: 'image', category: PluginCategory.MEDIA, description: '图片' },
    { enabled: true, priority: 70 }
  )

  registry.register(
    'imageResize',
    async () => {
      // 注入 CSS
      injectStyles('imageResize', imageResizeStyles)
      const module = await import('./media/image-resize')
      return new module.default({
        minWidth: 50,
        minHeight: 50,
        preserveAspectRatio: true,
        showDimensions: true,
      })
    },
    { name: 'imageResize', category: PluginCategory.MEDIA, description: '图片调整大小' },
    { enabled: true, priority: 69, dependencies: ['image'] }
  )

  registry.register(
    'imageToolbar',
    async () => {
      const module = await import('./media/image-toolbar')
      return new module.default({
        position: 'top',
        showAlign: true,
        showLink: true,
        showEdit: true,
        showDelete: true,
      })
    },
    { name: 'imageToolbar', category: PluginCategory.MEDIA, description: '图片工具栏' },
    { enabled: true, priority: 68, dependencies: ['image'] }
  )

  registry.register(
    'imageStyleDialog',
    async () => {
      const module = await import('./media/image-style-dialog')
      return new module.default()
    },
    { name: 'imageStyleDialog', category: PluginCategory.MEDIA, description: '图片样式对话框' },
    { enabled: true, priority: 67, dependencies: ['image'] }
  )

  registry.register(
    'mediaDialog',
    () => import('./media/media-dialog').then(m => m.default),
    { name: 'mediaDialog', category: PluginCategory.MEDIA, description: '媒体对话框' },
    { enabled: true, priority: 66 }
  )

  registry.register(
    'mediaCommands',
    () => import('./media/media-commands').then(m => m.default),
    { name: 'mediaCommands', category: PluginCategory.MEDIA, description: '媒体命令' },
    { enabled: true, priority: 65 }
  )

  // ========== 表格插件 ==========
  registry.register(
    'table',
    () => import('./table').then(m => m.TablePlugin),
    { name: 'table', category: PluginCategory.BLOCK, description: '表格' },
    { enabled: true, priority: 60 }
  )

  registry.register(
    'tableToolbar',
    () => import('./table').then(m => m.TableToolbarPlugin),
    { name: 'tableToolbar', category: PluginCategory.TOOL, description: '表格工具栏' },
    { enabled: true, priority: 59, dependencies: ['table'] }
  )

  registry.register(
    'horizontalRule',
    () => import('./horizontal-rule').then(m => m.HorizontalRulePlugin),
    { name: 'horizontalRule', category: PluginCategory.BLOCK, description: '分割线' },
    { enabled: true, priority: 58 }
  )

  // ========== 代码插件 ==========
  registry.register(
    'codeBlock',
    () => import('./codeblock').then(m => m.CodeBlockPlugin),
    { name: 'codeBlock', category: PluginCategory.BLOCK, description: '代码块' },
    { enabled: true, priority: 55 }
  )

  registry.register(
    'codeBlockToolbar',
    () => import('./codeblock').then(m => m.CodeBlockToolbarPlugin),
    { name: 'codeBlockToolbar', category: PluginCategory.TOOL, description: '代码块工具栏' },
    { enabled: true, priority: 54, dependencies: ['codeBlock'] }
  )

  registry.register(
    'inlineCode',
    () => import('./formatting').then(m => m.InlineCodePlugin),
    { name: 'inlineCode', category: PluginCategory.INLINE, description: '行内代码' },
    { enabled: true, priority: 54 }
  )

  // ========== 工具插件 ==========
  registry.register(
    'history',
    () => import('./utils/history').then(m => m.default),
    { name: 'history', category: PluginCategory.TOOL, description: '历史记录' },
    { enabled: true, priority: 100 }
  )

  registry.register(
    'findReplace',
    () => import('./utils/find-replace').then(m => m.default),
    { name: 'findReplace', category: PluginCategory.TOOL, description: '查找替换' },
    { enabled: true, priority: 50 }
  )

  registry.register(
    'wordCount',
    () => import('./utils/word-count').then(m => m.default),
    { name: 'wordCount', category: PluginCategory.TOOL, description: '字数统计' },
    { enabled: true, priority: 49 }
  )

  registry.register(
    'fullscreen',
    () => import('./utils/fullscreen').then(m => m.default),
    { name: 'fullscreen', category: PluginCategory.TOOL, description: '全屏' },
    { enabled: true, priority: 48 }
  )

  registry.register(
    'exportMarkdown',
    () => import('./utils/export-markdown').then(m => m.default),
    { name: 'exportMarkdown', category: PluginCategory.TOOL, description: '导出Markdown' },
    { enabled: true, priority: 47 }
  )

  registry.register(
    'contextMenu',
    () => import('./utils/context-menu').then(m => m.default),
    { name: 'contextMenu', category: PluginCategory.TOOL, description: '右键菜单' },
    { enabled: true, priority: 46 }
  )

  // ========== Emoji 插件 ==========
  registry.register(
    'emoji',
    () => import('./emoji').then(m => m.EmojiPlugin),
    { name: 'emoji', category: PluginCategory.INLINE, description: 'Emoji' },
    { enabled: true, priority: 45, lazy: true }
  )

  // ========== AI 插件 ==========
  registry.register(
    'ai',
    () => import('./ai').then(m => m.default),
    { name: 'ai', category: PluginCategory.AI, description: 'AI 助手' },
    { enabled: false, priority: 30, lazy: true }
  )

  console.log('[PluginRegistry] Built-in plugins registered:', registry.getStats())
}

/**
 * 注入 CSS 样式
 */
const injectedStyles = new Set<string>()

function injectStyles(name: string, css: string): void {
  if (injectedStyles.has(name)) return
  
  const style = document.createElement('style')
  style.id = `ldesign-plugin-${name}-styles`
  style.textContent = css
  document.head.appendChild(style)
  injectedStyles.add(name)
}

/**
 * 预设配置
 */
export const PluginPresets = {
  /** 最小配置 - 仅基础格式化 */
  minimal: ['bold', 'italic', 'underline', 'history'],
  
  /** 基础配置 */
  basic: [
    'bold', 'italic', 'underline', 'strike',
    'heading', 'bulletList', 'orderedList', 'link',
    'history',
  ],
  
  /** 标准配置 */
  standard: [
    'bold', 'italic', 'underline', 'strike', 'inlineCode',
    'heading', 'bulletList', 'orderedList', 'blockquote', 'link',
    'image', 'imageResize', 'mediaCommands',
    'textColor', 'backgroundColor', 'fontSize', 'align',
    'history', 'findReplace',
  ],
  
  /** 完整配置 */
  full: [
    // 格式化
    'bold', 'italic', 'underline', 'strike', 'inlineCode',
    'textColor', 'backgroundColor', 'fontSize', 'fontFamily', 'align',
    // 结构
    'heading', 'bulletList', 'orderedList', 'taskList', 'blockquote',
    // 链接
    'link', 'linkPreview',
    // 媒体
    'image', 'imageResize', 'imageToolbar', 'imageStyleDialog',
    'mediaDialog', 'mediaCommands',
    // 表格和代码
    'table', 'tableToolbar', 'horizontalRule',
    'codeBlock', 'codeBlockToolbar',
    // 工具
    'history', 'findReplace', 'wordCount', 'fullscreen',
    'exportMarkdown', 'contextMenu', 'emoji',
  ],
  
  /** 文档模式 */
  document: [
    'bold', 'italic', 'underline', 'strike', 'inlineCode',
    'heading', 'bulletList', 'orderedList', 'taskList', 'blockquote', 'link',
    'image', 'imageResize',
    'table', 'horizontalRule', 'codeBlock',
    'textColor', 'fontSize', 'align',
    'history', 'findReplace', 'wordCount', 'exportMarkdown',
  ],
  
  /** 博客模式 */
  blog: [
    'bold', 'italic', 'underline', 'strike', 'inlineCode',
    'heading', 'bulletList', 'orderedList', 'blockquote', 'link',
    'image', 'imageResize', 'imageToolbar', 'mediaDialog',
    'codeBlock',
    'history', 'emoji', 'exportMarkdown',
  ],
}

export type PresetName = keyof typeof PluginPresets
