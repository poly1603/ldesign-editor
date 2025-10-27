/**
 * 编辑器虚拟滚动适配器
 * 专门为富文本编辑器优化的虚拟滚动实现
 */

import { VirtualScroller, VirtualScrollerItem } from './VirtualScroller'
import { Editor } from './Editor'
import { getPerformanceMonitor } from '../utils/PerformanceMonitor'
import { createLogger } from '../utils/logger'

const logger = createLogger('EditorVirtualScroller')

export interface EditorLine {
  id: string
  lineNumber: number
  content: string
  height?: number
  isDirty?: boolean
  syntaxTokens?: any[]
}

export interface EditorVirtualScrollerOptions {
  editor: Editor
  lineHeight?: number
  maxLines?: number
  enableSyntaxHighlight?: boolean
  enableLineNumbers?: boolean
  enableWordWrap?: boolean
}

export class EditorVirtualScroller {
  private virtualScroller: VirtualScroller
  private editor: Editor
  private lines: EditorLine[] = []
  private lineCache: Map<number, EditorLine> = new Map()
  private syntaxWorker?: Worker
  private options: Required<EditorVirtualScrollerOptions>
  private performanceMonitor = getPerformanceMonitor()
  private renderTimer: any
  private isDirty = false

  constructor(options: EditorVirtualScrollerOptions) {
    this.editor = options.editor
    this.options = {
      lineHeight: 21,
      maxLines: 1000000,
      enableSyntaxHighlight: true,
      enableLineNumbers: true,
      enableWordWrap: true,
      ...options
    }

    // 创建容器
    const container = this.createContainer()

    // 初始化虚拟滚动器
    this.virtualScroller = new VirtualScroller({
      container,
      itemHeight: this.options.lineHeight,
      bufferSize: 10,
      dynamicHeight: this.options.enableWordWrap,
      scrollThrottle: 8,
      renderer: this.renderLine.bind(this)
    })

    this.setupEventListeners()
    this.initializeSyntaxWorker()
  }

  /**
   * 设置编辑器内容
   */
  setContent(content: string): void {
    const timer = this.performanceMonitor.startTimer('virtualscroll.setContent')

    try {
      const lines = this.parseContent(content)
      this.lines = lines
      this.lineCache.clear()

      // 转换为虚拟滚动项
      const items: VirtualScrollerItem[] = lines.map((line, index) => ({
        id: line.id,
        data: line,
        height: this.estimateLineHeight(line)
      }))

      this.virtualScroller.setItems(items)
      logger.info(`Loaded ${lines.length} lines`)
    } finally {
      this.performanceMonitor.endTimer(timer)
    }
  }

  /**
   * 更新指定行
   */
  updateLine(lineNumber: number, content: string): void {
    if (lineNumber < 0 || lineNumber >= this.lines.length) return

    const line = this.lines[lineNumber]
    line.content = content
    line.isDirty = true

    // 清除缓存
    this.lineCache.delete(lineNumber)

    // 刷新渲染
    this.virtualScroller.refreshItem(line.id)

    // 异步更新语法高亮
    if (this.options.enableSyntaxHighlight) {
      this.requestSyntaxHighlight(lineNumber)
    }
  }

  /**
   * 插入行
   */
  insertLines(lineNumber: number, contents: string[]): void {
    const newLines: EditorLine[] = contents.map((content, index) => ({
      id: `line-${Date.now()}-${index}`,
      lineNumber: lineNumber + index,
      content,
      isDirty: true
    }))

    // 更新行号
    for (let i = lineNumber; i < this.lines.length; i++) {
      this.lines[i].lineNumber += contents.length
    }

    this.lines.splice(lineNumber, 0, ...newLines)

    // 转换为虚拟滚动项
    const items: VirtualScrollerItem[] = newLines.map(line => ({
      id: line.id,
      data: line,
      height: this.estimateLineHeight(line)
    }))

    this.virtualScroller.addItems(items, lineNumber)
  }

  /**
   * 删除行
   */
  deleteLines(startLine: number, count: number): void {
    const deletedLines = this.lines.splice(startLine, count)
    const ids = deletedLines.map(line => line.id)

    // 更新后续行号
    for (let i = startLine; i < this.lines.length; i++) {
      this.lines[i].lineNumber -= count
    }

    // 清理缓存
    deletedLines.forEach(line => {
      this.lineCache.delete(line.lineNumber)
    })

    this.virtualScroller.removeItems(ids)
  }

  /**
   * 滚动到指定行
   */
  scrollToLine(lineNumber: number, position: 'start' | 'center' | 'end' = 'center'): void {
    if (lineNumber < 0 || lineNumber >= this.lines.length) return

    const line = this.lines[lineNumber]
    this.virtualScroller.scrollToItem(line.id, position)
  }

  /**
   * 获取可见行范围
   */
  getVisibleLineRange(): { start: number; end: number } {
    const visibleItems = this.virtualScroller.getVisibleItems()
    if (visibleItems.length === 0) {
      return { start: 0, end: 0 }
    }

    const start = (visibleItems[0].data as EditorLine).lineNumber
    const end = (visibleItems[visibleItems.length - 1].data as EditorLine).lineNumber

    return { start, end }
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.virtualScroller.destroy()
    this.syntaxWorker?.terminate()
    clearTimeout(this.renderTimer)
  }

  private createContainer(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'editor-virtual-scroll-container'
    container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
      line-height: ${this.options.lineHeight}px;
    `

    // 插入到编辑器容器
    const editorElement = this.editor.getElement()
    editorElement.appendChild(container)

    return container
  }

  private parseContent(content: string): EditorLine[] {
    const lines = content.split('\n')

    // 限制最大行数
    if (lines.length > this.options.maxLines) {
      logger.warn(`Content exceeds max lines limit (${this.options.maxLines})`)
      lines.length = this.options.maxLines
    }

    return lines.map((content, index) => ({
      id: `line-${index}`,
      lineNumber: index,
      content
    }))
  }

  private estimateLineHeight(line: EditorLine): number {
    if (!this.options.enableWordWrap) {
      return this.options.lineHeight
    }

    // 估算换行后的高度
    const charsPerLine = 80 // 假设每行80个字符
    const lines = Math.ceil(line.content.length / charsPerLine)
    return lines * this.options.lineHeight
  }

  private renderLine(line: EditorLine, index: number): HTMLElement {
    // 检查缓存
    const cached = this.lineCache.get(line.lineNumber)
    if (cached && !cached.isDirty) {
      return this.createLineElement(cached)
    }

    // 创建新元素
    const element = this.createLineElement(line)

    // 缓存
    this.lineCache.set(line.lineNumber, { ...line, isDirty: false })

    return element
  }

  private createLineElement(line: EditorLine): HTMLElement {
    const element = document.createElement('div')
    element.className = 'editor-line'
    element.style.cssText = `
      display: flex;
      white-space: ${this.options.enableWordWrap ? 'pre-wrap' : 'pre'};
      word-break: ${this.options.enableWordWrap ? 'break-word' : 'normal'};
      min-height: ${this.options.lineHeight}px;
    `

    // 行号
    if (this.options.enableLineNumbers) {
      const lineNumber = document.createElement('span')
      lineNumber.className = 'line-number'
      lineNumber.style.cssText = `
        display: inline-block;
        width: 50px;
        text-align: right;
        padding-right: 10px;
        color: #858585;
        user-select: none;
        flex-shrink: 0;
      `
      lineNumber.textContent = String(line.lineNumber + 1)
      element.appendChild(lineNumber)
    }

    // 内容
    const content = document.createElement('span')
    content.className = 'line-content'
    content.style.cssText = `
      flex: 1;
      padding-left: 10px;
    `

    if (line.syntaxTokens && this.options.enableSyntaxHighlight) {
      // 应用语法高亮
      content.innerHTML = this.applySyntaxHighlight(line.content, line.syntaxTokens)
    } else {
      content.textContent = line.content || '\u200B' // 空行使用零宽空格
    }

    element.appendChild(content)

    return element
  }

  private applySyntaxHighlight(content: string, tokens: any[]): string {
    let html = ''
    let lastIndex = 0

    tokens.forEach(token => {
      // 添加普通文本
      if (token.start > lastIndex) {
        html += this.escapeHtml(content.slice(lastIndex, token.start))
      }

      // 添加高亮文本
      const tokenText = content.slice(token.start, token.end)
      html += `<span class="token-${token.type}">${this.escapeHtml(tokenText)}</span>`

      lastIndex = token.end
    })

    // 添加剩余文本
    if (lastIndex < content.length) {
      html += this.escapeHtml(content.slice(lastIndex))
    }

    return html
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  private setupEventListeners(): void {
    // 监听滚动事件
    this.virtualScroller.on('scroll', (metrics) => {
      this.editor.emit('virtualScroll', metrics)
    })

    // 监听编辑器内容变化
    this.editor.on('change', () => {
      this.isDirty = true
      this.scheduleRender()
    })
  }

  private scheduleRender(): void {
    if (this.renderTimer) return

    this.renderTimer = requestAnimationFrame(() => {
      this.renderTimer = null
      if (this.isDirty) {
        this.isDirty = false
        // 更新变化的内容
        this.updateDirtyLines()
      }
    })
  }

  private updateDirtyLines(): void {
    // 批量更新脏行
    const dirtyLines = this.lines.filter(line => line.isDirty)
    dirtyLines.forEach(line => {
      this.virtualScroller.refreshItem(line.id)
      line.isDirty = false
    })
  }

  private initializeSyntaxWorker(): void {
    if (!this.options.enableSyntaxHighlight) return

    // 创建语法高亮 Worker
    const workerCode = `
      self.onmessage = function(e) {
        const { lineNumber, content } = e.data
        
        // 简单的语法高亮示例
        const tokens = []
        
        // 匹配关键字
        const keywords = /\\b(function|const|let|var|if|else|for|while|return|class|extends)\\b/g
        let match
        while ((match = keywords.exec(content)) !== null) {
          tokens.push({
            type: 'keyword',
            start: match.index,
            end: match.index + match[0].length
          })
        }
        
        // 匹配字符串
        const strings = /(['"])(?:(?=(\\\\?))\\2.)*?\\1/g
        while ((match = strings.exec(content)) !== null) {
          tokens.push({
            type: 'string',
            start: match.index,
            end: match.index + match[0].length
          })
        }
        
        // 匹配注释
        const comments = /\\/\\/.*$/gm
        while ((match = comments.exec(content)) !== null) {
          tokens.push({
            type: 'comment',
            start: match.index,
            end: match.index + match[0].length
          })
        }
        
        self.postMessage({ lineNumber, tokens })
      }
    `

    const blob = new Blob([workerCode], { type: 'application/javascript' })
    this.syntaxWorker = new Worker(URL.createObjectURL(blob))

    this.syntaxWorker.onmessage = (e) => {
      const { lineNumber, tokens } = e.data
      const line = this.lines[lineNumber]
      if (line) {
        line.syntaxTokens = tokens
        this.virtualScroller.refreshItem(line.id)
      }
    }
  }

  private requestSyntaxHighlight(lineNumber: number): void {
    if (!this.syntaxWorker) return

    const line = this.lines[lineNumber]
    if (line) {
      this.syntaxWorker.postMessage({
        lineNumber,
        content: line.content
      })
    }
  }

  /**
   * 获取性能指标
   */
  getPerformanceMetrics() {
    const virtualScrollerMetrics = this.virtualScroller.getPerformanceMetrics()

    return {
      ...virtualScrollerMetrics,
      totalLines: this.lines.length,
      cachedLines: this.lineCache.size,
      visibleRange: this.getVisibleLineRange()
    }
  }
}







