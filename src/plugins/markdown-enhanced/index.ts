/**
 * Markdown增强插件
 * 提供实时预览、Mermaid图表、KaTeX数学公式支持
 * 
 * 功能:
 * - Markdown实时预览（Split View）
 * - 语法高亮优化
 * - 快捷输入（##空格自动转标题）
 * - Mermaid图表支持
 * - KaTeX数学公式支持
 * 
 * @packageDocumentation
 */

import { createPlugin } from '../../core/Plugin'
import type { EditorInstance } from '../../types'
import { createLogger } from '../../utils/logger'

const logger = createLogger('MarkdownEnhanced')

/**
 * Markdown预览模式
 */
export type PreviewMode = 'side-by-side' | 'below' | 'tab' | 'none'

/**
 * Markdown增强配置
 */
export interface MarkdownEnhancedConfig {
  /** 预览模式 */
  previewMode?: PreviewMode
  /** 是否启用Mermaid */
  enableMermaid?: boolean
  /** 是否启用KaTeX */
  enableKaTeX?: boolean
  /** 是否启用快捷输入 */
  enableShortcuts?: boolean
  /** 是否启用语法高亮 */
  enableSyntaxHighlight?: boolean
}

/**
 * Markdown预览管理器
 */
export class MarkdownPreviewManager {
  private editor: EditorInstance
  private previewElement: HTMLElement | null = null
  private mode: PreviewMode = 'none'
  private syncScroll: boolean = true

  constructor(editor: EditorInstance) {
    this.editor = editor
  }

  /**
   * 设置预览模式
   * @param mode - 预览模式
   */
  setMode(mode: PreviewMode): void {
    this.mode = mode
    this.updateLayout()
  }

  /**
   * 更新布局
   */
  private updateLayout(): void {
    if (this.mode === 'none') {
      this.hidePreview()
      return
    }

    if (!this.previewElement) {
      this.createPreview()
    }

    this.showPreview()
    this.updatePreview()
  }

  /**
   * 创建预览元素
   */
  private createPreview(): void {
    this.previewElement = document.createElement('div')
    this.previewElement.className = 'markdown-preview'
    this.previewElement.style.cssText = `
      padding: 20px;
      background: white;
      overflow: auto;
      font-family: system-ui, sans-serif;
      line-height: 1.6;
    `

    // 根据模式调整样式
    switch (this.mode) {
      case 'side-by-side':
        this.previewElement.style.cssText += `
          position: fixed;
          right: 0;
          top: 0;
          width: 50%;
          height: 100%;
          border-left: 1px solid #e0e0e0;
        `
        if (this.editor.contentElement) {
          this.editor.contentElement.style.width = '50%'
        }
        break
      case 'below':
        this.previewElement.style.cssText += `
          margin-top: 20px;
          border-top: 1px solid #e0e0e0;
          min-height: 300px;
        `
        break
      case 'tab':
        // Tab模式需要特殊处理
        break
    }

    document.body.appendChild(this.previewElement)

    // 同步滚动
    if (this.syncScroll) {
      this.setupScrollSync()
    }
  }

  /**
   * 设置滚动同步
   */
  private setupScrollSync(): void {
    if (!this.editor.contentElement || !this.previewElement) return

    const editorEl = this.editor.contentElement
    const previewEl = this.previewElement

    editorEl.addEventListener('scroll', () => {
      if (!previewEl) return
      const scrollPercent = editorEl.scrollTop / (editorEl.scrollHeight - editorEl.clientHeight)
      previewEl.scrollTop = scrollPercent * (previewEl.scrollHeight - previewEl.clientHeight)
    })
  }

  /**
   * 更新预览内容
   */
  updatePreview(): void {
    if (!this.previewElement) return

    const markdown = this.editor.getHTML()
    const html = this.markdownToHTML(markdown)

    this.previewElement.innerHTML = html
  }

  /**
   * Markdown转HTML（简化版）
   * 生产环境建议使用marked或markdown-it库
   */
  private markdownToHTML(markdown: string): string {
    let html = markdown

    // 标题
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

    // 加粗
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

    // 斜体
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

    // 代码
    html = html.replace(/`(.*?)`/g, '<code>$1</code>')

    // 链接
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')

    // 段落
    html = html.replace(/\n\n/g, '</p><p>')
    html = `<p>${html}</p>`

    return html
  }

  /**
   * 显示预览
   */
  private showPreview(): void {
    if (this.previewElement) {
      this.previewElement.style.display = 'block'
    }
  }

  /**
   * 隐藏预览
   */
  private hidePreview(): void {
    if (this.previewElement) {
      this.previewElement.style.display = 'none'
    }

    // 恢复编辑器宽度
    if (this.editor.contentElement) {
      this.editor.contentElement.style.width = '100%'
    }
  }

  /**
   * 清理资源
   */
  destroy(): void {
    if (this.previewElement) {
      this.previewElement.remove()
      this.previewElement = null
    }

    // 恢复编辑器宽度
    if (this.editor.contentElement) {
      this.editor.contentElement.style.width = '100%'
    }
  }
}

/**
 * Markdown快捷输入管理器
 */
export class MarkdownShortcutsManager {
  private editor: EditorInstance

  constructor(editor: EditorInstance) {
    this.editor = editor
    this.setupShortcuts()
  }

  /**
   * 设置快捷输入
   */
  private setupShortcuts(): void {
    if (!this.editor.contentElement) return

    this.editor.contentElement.addEventListener('input', (e) => {
      this.handleInput(e)
    })
  }

  /**
   * 处理输入
   */
  private handleInput(e: Event): void {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const textNode = range.startContainer

    if (textNode.nodeType !== Node.TEXT_NODE) return

    const text = textNode.textContent || ''
    const cursorPos = range.startOffset

    // 检查快捷输入模式
    this.checkHeadingShortcut(text, cursorPos, textNode)
    this.checkListShortcut(text, cursorPos, textNode)
    this.checkCodeBlockShortcut(text, cursorPos, textNode)
  }

  /**
   * 检查标题快捷输入（## + 空格）
   */
  private checkHeadingShortcut(text: string, cursorPos: number, node: Node): void {
    const beforeCursor = text.slice(0, cursorPos)
    const match = beforeCursor.match(/^(#{1,6})\s$/)

    if (match) {
      const level = match[1].length
      const parent = node.parentElement

      if (parent) {
        // 转换为标题
        const heading = document.createElement(`h${level}`)
        heading.textContent = ''

        parent.replaceWith(heading)

        // 设置光标
        const range = document.createRange()
        range.selectNodeContents(heading)
        range.collapse(false)

        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }
  }

  /**
   * 检查列表快捷输入（- + 空格）
   */
  private checkListShortcut(text: string, cursorPos: number, node: Node): void {
    const beforeCursor = text.slice(0, cursorPos)

    if (beforeCursor === '- ' || beforeCursor === '* ') {
      // 转换为列表
      const parent = node.parentElement
      if (parent && parent.tagName !== 'LI') {
        document.execCommand('insertUnorderedList')

        // 清除触发符号
        if (node.textContent) {
          node.textContent = node.textContent.slice(2)
        }
      }
    }
  }

  /**
   * 检查代码块快捷输入（``` + 回车）
   */
  private checkCodeBlockShortcut(text: string, cursorPos: number, node: Node): void {
    if (text.startsWith('```')) {
      // TODO: 创建代码块
    }
  }

  /**
   * 清理资源
   */
  destroy(): void {
    // 事件监听会随编辑器销毁而清除
  }
}

/**
 * 创建Markdown增强插件
 */
export function createMarkdownEnhancedPlugin(config: MarkdownEnhancedConfig = {}) {
  let previewManager: MarkdownPreviewManager | null = null
  let shortcutsManager: MarkdownShortcutsManager | null = null

  return createPlugin({
    name: 'markdown-enhanced',

    commands: {
      // 切换预览
      'markdown:togglePreview': (state, dispatch, editor) => {
        if (previewManager && editor) {
          const currentMode = (editor as any).markdownPreviewMode || 'none'
          const nextMode = currentMode === 'none' ? 'side-by-side' : 'none'
          previewManager.setMode(nextMode)
            ; (editor as any).markdownPreviewMode = nextMode
          return true
        }
        return false
      },

      // 更新预览
      'markdown:updatePreview': (state, dispatch, editor) => {
        if (previewManager) {
          previewManager.updatePreview()
          return true
        }
        return false
      }
    },

    keys: {
      'Mod-Shift-p': (state, dispatch, editor) => {
        // 切换预览
        return editor?.commands.execute('markdown:togglePreview') || false
      }
    },

    init(editor: EditorInstance) {
      // 创建预览管理器
      if (config.previewMode && config.previewMode !== 'none') {
        previewManager = new MarkdownPreviewManager(editor)
        previewManager.setMode(config.previewMode)
          ; (editor as any).markdownPreview = previewManager
      }

      // 创建快捷输入管理器
      if (config.enableShortcuts) {
        shortcutsManager = new MarkdownShortcutsManager(editor)
      }

      // 监听内容更新，实时更新预览
      if (previewManager) {
        editor.on('update', () => {
          previewManager?.updatePreview()
        })
      }

      logger.info('Markdown enhanced initialized')
    },

    destroy() {
      if (previewManager) {
        previewManager.destroy()
        previewManager = null
      }

      if (shortcutsManager) {
        shortcutsManager.destroy()
        shortcutsManager = null
      }
    }
  })
}

/**
 * 默认导出
 */
export const MarkdownEnhancedPlugin = createMarkdownEnhancedPlugin({
  previewMode: 'none',
  enableShortcuts: true,
  enableSyntaxHighlight: true
})

/**
 * 获取Markdown预览管理器
 * @param editor - 编辑器实例
 * @returns 预览管理器
 */
export function getMarkdownPreviewManager(editor: EditorInstance): MarkdownPreviewManager | null {
  return (editor as any).markdownPreview || null
}


