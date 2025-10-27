/**
 * 历史记录标签页
 * 显示编辑器操作历史和撤销/重做栈
 */

import { Editor } from '../../core/Editor'
import { createLogger } from '../../utils/logger'

const logger = createLogger('HistoryTab')

export interface HistoryEntry {
  id: string
  timestamp: number
  type: string
  description: string
  data?: any
  snapshot?: string
  canUndo: boolean
  canRedo: boolean
  size?: number
}

export class HistoryTab {
  private editor: Editor
  private container?: HTMLElement
  private history: HistoryEntry[] = []
  private currentIndex = -1
  private maxHistory = 100
  private listContainer?: HTMLElement
  private detailsContainer?: HTMLElement
  private selectedEntry?: HistoryEntry

  constructor(options: { editor: Editor }) {
    this.editor = options.editor
    this.setupHistoryTracking()
  }

  /**
   * 设置历史记录追踪
   */
  private setupHistoryTracking(): void {
    // 监听编辑器变化
    this.editor.on('change', (change: any) => {
      this.addHistoryEntry({
        type: 'edit',
        description: this.getChangeDescription(change),
        data: change,
        snapshot: this.editor.getContent?.()
      })
    })

    // 监听撤销/重做
    this.editor.on('undo', () => {
      this.currentIndex = Math.max(0, this.currentIndex - 1)
      this.render()
    })

    this.editor.on('redo', () => {
      this.currentIndex = Math.min(this.history.length - 1, this.currentIndex + 1)
      this.render()
    })
  }

  /**
   * 渲染标签页
   */
  render(): HTMLElement {
    this.container = document.createElement('div')
    this.container.className = 'history-tab'
    this.container.style.cssText = `
      display: flex;
      height: 100%;
    `

    // 工具栏
    const toolbar = this.createToolbar()

    // 主内容区
    const content = document.createElement('div')
    content.style.cssText = `
      display: flex;
      flex: 1;
      overflow: hidden;
    `

    // 历史列表
    this.listContainer = document.createElement('div')
    this.listContainer.className = 'history-list'
    this.listContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      border-right: 1px solid #e0e0e0;
    `

    // 详情面板
    this.detailsContainer = document.createElement('div')
    this.detailsContainer.className = 'history-details'
    this.detailsContainer.style.cssText = `
      width: 350px;
      overflow-y: auto;
      background: #fafafa;
      display: none;
    `

    content.appendChild(this.listContainer)
    content.appendChild(this.detailsContainer)

    const wrapper = document.createElement('div')
    wrapper.style.cssText = `
      display: flex;
      flex-direction: column;
      height: 100%;
    `
    wrapper.appendChild(toolbar)
    wrapper.appendChild(content)

    this.container.appendChild(wrapper)

    // 渲染历史列表
    this.renderHistory()

    return this.container
  }

  /**
   * 创建工具栏
   */
  private createToolbar(): HTMLElement {
    const toolbar = document.createElement('div')
    toolbar.style.cssText = `
      display: flex;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
      gap: 10px;
      flex-shrink: 0;
    `

    // 撤销按钮
    const undoBtn = document.createElement('button')
    undoBtn.style.cssText = `
      padding: 4px 8px;
      background: transparent;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    `
    undoBtn.innerHTML = '↶ 撤销'
    undoBtn.onclick = () => this.undo()
    undoBtn.disabled = !this.canUndo()

    // 重做按钮
    const redoBtn = document.createElement('button')
    redoBtn.style.cssText = undoBtn.style.cssText
    redoBtn.innerHTML = '↷ 重做'
    redoBtn.onclick = () => this.redo()
    redoBtn.disabled = !this.canRedo()

    // 清空历史
    const clearBtn = document.createElement('button')
    clearBtn.style.cssText = undoBtn.style.cssText
    clearBtn.innerHTML = '🗑️ 清空历史'
    clearBtn.onclick = () => this.clearHistory()

    // 统计信息
    const stats = document.createElement('div')
    stats.className = 'history-stats'
    stats.style.cssText = `
      margin-left: auto;
      font-size: 12px;
      color: #666;
      display: flex;
      gap: 15px;
    `
    stats.innerHTML = `
      <span>共 ${this.history.length} 条记录</span>
      <span>当前位置: ${this.currentIndex + 1}</span>
      <span>内存占用: ${this.calculateMemoryUsage()}</span>
    `

    toolbar.appendChild(undoBtn)
    toolbar.appendChild(redoBtn)
    toolbar.appendChild(clearBtn)
    toolbar.appendChild(stats)

    return toolbar
  }

  /**
   * 渲染历史列表
   */
  private renderHistory(): void {
    if (!this.listContainer) return

    this.listContainer.innerHTML = ''

    if (this.history.length === 0) {
      this.listContainer.innerHTML = `
        <div style="
          padding: 40px;
          text-align: center;
          color: #999;
        ">
          <div style="font-size: 32px; margin-bottom: 10px;">📜</div>
          <div>暂无操作历史</div>
        </div>
      `
      return
    }

    // 创建时间线
    const timeline = document.createElement('div')
    timeline.className = 'history-timeline'
    timeline.style.cssText = `
      padding: 20px;
    `

    this.history.forEach((entry, index) => {
      const item = this.createHistoryItem(entry, index)
      timeline.appendChild(item)
    })

    this.listContainer.appendChild(timeline)

    // 滚动到当前位置
    if (this.currentIndex >= 0) {
      const currentItem = this.listContainer.querySelector(`[data-index="${this.currentIndex}"]`)
      currentItem?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  /**
   * 创建历史条目
   */
  private createHistoryItem(entry: HistoryEntry, index: number): HTMLElement {
    const item = document.createElement('div')
    item.className = 'history-item'
    item.dataset.index = String(index)
    item.style.cssText = `
      display: flex;
      align-items: start;
      gap: 15px;
      margin-bottom: 20px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      padding-left: 30px;
    `

    // 时间线
    const timeline = document.createElement('div')
    timeline.style.cssText = `
      position: absolute;
      left: 10px;
      top: 0;
      bottom: ${index === this.history.length - 1 ? '50%' : '-20px'};
      width: 2px;
      background: ${index <= this.currentIndex ? '#667eea' : '#e0e0e0'};
    `

    // 时间点
    const dot = document.createElement('div')
    dot.style.cssText = `
      position: absolute;
      left: 6px;
      top: 8px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${index === this.currentIndex ? '#667eea' : index < this.currentIndex ? '#667eea' : '#e0e0e0'};
      border: 2px solid white;
      box-shadow: 0 0 0 1px #e0e0e0;
      z-index: 1;
    `

    // 内容卡片
    const card = document.createElement('div')
    card.style.cssText = `
      flex: 1;
      background: ${index === this.currentIndex ? '#f0f4ff' : 'white'};
      border: 1px solid ${index === this.currentIndex ? '#667eea' : '#e0e0e0'};
      border-radius: 6px;
      padding: 12px 15px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      transition: all 0.2s;
    `

    // 标题行
    const header = document.createElement('div')
    header.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    `

    const title = document.createElement('div')
    title.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
    `

    const icon = this.getTypeIcon(entry.type)
    const typeSpan = document.createElement('span')
    typeSpan.style.cssText = `
      font-size: 16px;
    `
    typeSpan.textContent = icon

    const descSpan = document.createElement('span')
    descSpan.style.cssText = `
      font-size: 13px;
      font-weight: 500;
      color: #333;
    `
    descSpan.textContent = entry.description

    title.appendChild(typeSpan)
    title.appendChild(descSpan)

    const time = document.createElement('span')
    time.style.cssText = `
      font-size: 11px;
      color: #999;
    `
    time.textContent = this.formatTime(entry.timestamp)

    header.appendChild(title)
    header.appendChild(time)

    // 状态指示
    if (index === this.currentIndex) {
      const current = document.createElement('div')
      current.style.cssText = `
        font-size: 11px;
        color: #667eea;
        margin-top: 4px;
      `
      current.textContent = '当前位置'
      card.appendChild(current)
    } else if (index > this.currentIndex) {
      card.style.opacity = '0.5'
    }

    card.appendChild(header)

    // 悬停效果
    card.onmouseenter = () => {
      if (index !== this.currentIndex) {
        card.style.transform = 'translateX(5px)'
        card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
      }
    }

    card.onmouseleave = () => {
      card.style.transform = 'translateX(0)'
      card.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
    }

    // 点击事件
    card.onclick = () => {
      this.selectEntry(entry, index)
    }

    item.appendChild(timeline)
    item.appendChild(dot)
    item.appendChild(card)

    return item
  }

  /**
   * 获取类型图标
   */
  private getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      edit: '✏️',
      insert: '➕',
      delete: '➖',
      format: '🎨',
      paste: '📋',
      cut: '✂️',
      undo: '↶',
      redo: '↷',
      plugin: '🔌',
      default: '📝'
    }
    return icons[type] || icons.default
  }

  /**
   * 格式化时间
   */
  private formatTime(timestamp: number): string {
    const now = Date.now()
    const diff = now - timestamp

    if (diff < 60000) {
      return '刚刚'
    } else if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000)
      return `${minutes} 分钟前`
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000)
      return `${hours} 小时前`
    } else {
      const date = new Date(timestamp)
      return date.toLocaleString()
    }
  }

  /**
   * 选择历史条目
   */
  private selectEntry(entry: HistoryEntry, index: number): void {
    this.selectedEntry = entry

    if (!this.detailsContainer) return

    this.detailsContainer.style.display = 'block'
    this.detailsContainer.innerHTML = `
      <div style="padding: 20px;">
        <h3 style="margin: 0 0 15px 0; font-size: 14px;">操作详情</h3>
        
        <div style="margin-bottom: 20px;">
          <div style="font-size: 12px; color: #999; margin-bottom: 5px;">类型</div>
          <div style="font-size: 13px;">
            ${this.getTypeIcon(entry.type)} ${entry.type}
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="font-size: 12px; color: #999; margin-bottom: 5px;">描述</div>
          <div style="font-size: 13px;">${entry.description}</div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="font-size: 12px; color: #999; margin-bottom: 5px;">时间</div>
          <div style="font-size: 13px;">${new Date(entry.timestamp).toLocaleString()}</div>
        </div>
        
        ${entry.size ? `
          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: #999; margin-bottom: 5px;">大小</div>
            <div style="font-size: 13px;">${this.formatSize(entry.size)}</div>
          </div>
        ` : ''}
        
        ${entry.data ? `
          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: #999; margin-bottom: 5px;">数据</div>
            <div style="
              background: #f5f5f5;
              padding: 10px;
              border-radius: 4px;
              font-family: monospace;
              font-size: 11px;
              max-height: 200px;
              overflow-y: auto;
            ">
              <pre style="margin: 0;">${JSON.stringify(entry.data, null, 2)}</pre>
            </div>
          </div>
        ` : ''}
        
        <div style="display: flex; gap: 10px;">
          <button onclick="console.log('Goto:', ${index})" style="
            flex: 1;
            padding: 8px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
          ">跳转到此状态</button>
          <button onclick="this.parentElement.parentElement.parentElement.style.display='none'" style="
            flex: 1;
            padding: 8px;
            background: #666;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
          ">关闭</button>
        </div>
      </div>
    `
  }

  /**
   * 添加历史记录
   */
  private addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp' | 'canUndo' | 'canRedo'>): void {
    // 如果当前不在最新位置，删除后面的历史
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1)
    }

    const newEntry: HistoryEntry = {
      ...entry,
      id: `history-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      canUndo: true,
      canRedo: false,
      size: entry.snapshot ? new Blob([entry.snapshot]).size : undefined
    }

    this.history.push(newEntry)

    // 限制历史记录数量
    if (this.history.length > this.maxHistory) {
      this.history.shift()
    } else {
      this.currentIndex++
    }

    // 更新UI
    if (this.container) {
      this.renderHistory()
      this.updateToolbar()
    }
  }

  /**
   * 获取变更描述
   */
  private getChangeDescription(change: any): string {
    if (change.type === 'insert') {
      return `插入 ${change.text?.length || 0} 个字符`
    } else if (change.type === 'delete') {
      return `删除 ${change.removedLength || 0} 个字符`
    } else if (change.type === 'format') {
      return `格式化文本`
    } else {
      return '编辑文档'
    }
  }

  /**
   * 撤销
   */
  private undo(): void {
    if (!this.canUndo()) return

    this.editor.undo?.()
    logger.info('Undo performed')
  }

  /**
   * 重做
   */
  private redo(): void {
    if (!this.canRedo()) return

    this.editor.redo?.()
    logger.info('Redo performed')
  }

  /**
   * 判断是否可以撤销
   */
  private canUndo(): boolean {
    return this.currentIndex > 0
  }

  /**
   * 判断是否可以重做
   */
  private canRedo(): boolean {
    return this.currentIndex < this.history.length - 1
  }

  /**
   * 清空历史
   */
  private clearHistory(): void {
    if (confirm('确定要清空所有历史记录吗？此操作不可撤销。')) {
      this.history = []
      this.currentIndex = -1
      this.renderHistory()
      this.updateToolbar()
      logger.info('History cleared')
    }
  }

  /**
   * 更新工具栏
   */
  private updateToolbar(): void {
    const toolbar = this.container?.querySelector('.history-stats')
    if (toolbar) {
      toolbar.innerHTML = `
        <span>共 ${this.history.length} 条记录</span>
        <span>当前位置: ${this.currentIndex + 1}</span>
        <span>内存占用: ${this.calculateMemoryUsage()}</span>
      `
    }

    // 更新按钮状态
    const undoBtn = this.container?.querySelector('button:nth-child(1)') as HTMLButtonElement
    const redoBtn = this.container?.querySelector('button:nth-child(2)') as HTMLButtonElement

    if (undoBtn) undoBtn.disabled = !this.canUndo()
    if (redoBtn) redoBtn.disabled = !this.canRedo()
  }

  /**
   * 计算内存占用
   */
  private calculateMemoryUsage(): string {
    const totalSize = this.history.reduce((sum, entry) => sum + (entry.size || 0), 0)
    return this.formatSize(totalSize)
  }

  /**
   * 格式化大小
   */
  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`
  }

  /**
   * 激活标签页
   */
  activate(): void {
    this.renderHistory()
  }

  /**
   * 停用标签页
   */
  deactivate(): void {
    // 标签页停用
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.container = undefined
  }
}


