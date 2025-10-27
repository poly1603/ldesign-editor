/**
 * 内存分析标签页
 * 监控内存使用、对象分配、垃圾回收等
 */

import { Editor } from '../../core/Editor'
import { createLogger } from '../../utils/logger'

const logger = createLogger('MemoryTab')

export interface MemorySnapshot {
  timestamp: number
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
  objects: ObjectAllocation[]
}

export interface ObjectAllocation {
  type: string
  count: number
  size: number
  retained: number
}

export class MemoryTab {
  private editor: Editor
  private container?: HTMLElement
  private snapshots: MemorySnapshot[] = []
  private currentSnapshot?: MemorySnapshot
  private isActive = false
  private updateInterval?: number
  private chart?: any

  constructor(options: { editor: Editor }) {
    this.editor = options.editor
  }

  /**
   * 渲染标签页
   */
  render(): HTMLElement {
    this.container = document.createElement('div')
    this.container.className = 'memory-tab'
    this.container.style.cssText = `
      padding: 20px;
      height: 100%;
      overflow-y: auto;
    `

    // 工具栏
    const toolbar = this.createToolbar()

    // 内存概览
    const overview = this.createOverview()

    // 内存时间线
    const timeline = this.createTimeline()

    // 对象分配表
    const allocations = this.createAllocationsTable()

    this.container.appendChild(toolbar)
    this.container.appendChild(overview)
    this.container.appendChild(timeline)
    this.container.appendChild(allocations)

    return this.container
  }

  /**
   * 创建工具栏
   */
  private createToolbar(): HTMLElement {
    const toolbar = document.createElement('div')
    toolbar.className = 'memory-toolbar'
    toolbar.style.cssText = `
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e0e0e0;
    `

    // 快照按钮
    const snapshotBtn = document.createElement('button')
    snapshotBtn.style.cssText = `
      padding: 6px 12px;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    `
    snapshotBtn.innerHTML = '📸 拍摄快照'
    snapshotBtn.onclick = () => this.takeSnapshot()

    // 比较按钮
    const compareBtn = document.createElement('button')
    compareBtn.style.cssText = snapshotBtn.style.cssText
    compareBtn.style.background = '#4caf50'
    compareBtn.innerHTML = '🔍 比较快照'
    compareBtn.onclick = () => this.compareSnapshots()

    // 清空按钮
    const clearBtn = document.createElement('button')
    clearBtn.style.cssText = snapshotBtn.style.cssText
    clearBtn.style.background = '#666'
    clearBtn.innerHTML = '🗑️ 清空'
    clearBtn.onclick = () => this.clearSnapshots()

    // GC按钮
    const gcBtn = document.createElement('button')
    gcBtn.style.cssText = snapshotBtn.style.cssText
    gcBtn.style.background = '#ff9800'
    gcBtn.innerHTML = '♻️ 垃圾回收'
    gcBtn.onclick = () => this.triggerGC()

    toolbar.appendChild(snapshotBtn)
    toolbar.appendChild(compareBtn)
    toolbar.appendChild(clearBtn)
    toolbar.appendChild(gcBtn)

    return toolbar
  }

  /**
   * 创建内存概览
   */
  private createOverview(): HTMLElement {
    const overview = document.createElement('div')
    overview.className = 'memory-overview'
    overview.style.cssText = `
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    `

    overview.innerHTML = `
      <h3 style="margin: 0 0 15px 0; font-size: 16px;">内存概览</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
        <div class="memory-stat">
          <div style="font-size: 12px; color: #999; margin-bottom: 5px;">已使用</div>
          <div style="font-size: 24px; font-weight: bold; color: #2196f3;" id="used-memory">0 MB</div>
          <div style="font-size: 11px; color: #666; margin-top: 5px;" id="used-percent">0%</div>
        </div>
        <div class="memory-stat">
          <div style="font-size: 12px; color: #999; margin-bottom: 5px;">总分配</div>
          <div style="font-size: 24px; font-weight: bold; color: #4caf50;" id="total-memory">0 MB</div>
          <div style="font-size: 11px; color: #666; margin-top: 5px;" id="total-percent">0%</div>
        </div>
        <div class="memory-stat">
          <div style="font-size: 12px; color: #999; margin-bottom: 5px;">限制</div>
          <div style="font-size: 24px; font-weight: bold; color: #ff9800;" id="limit-memory">0 GB</div>
          <div style="font-size: 11px; color: #666; margin-top: 5px;">最大可用</div>
        </div>
      </div>
      
      <div style="margin-top: 20px;">
        <div style="background: #f0f0f0; height: 20px; border-radius: 10px; overflow: hidden;">
          <div id="memory-bar" style="
            height: 100%;
            background: linear-gradient(90deg, #2196f3, #4caf50);
            width: 0%;
            transition: width 0.3s ease-out;
          "></div>
        </div>
      </div>
    `

    return overview
  }

  /**
   * 创建内存时间线
   */
  private createTimeline(): HTMLElement {
    const timeline = document.createElement('div')
    timeline.className = 'memory-timeline'
    timeline.style.cssText = `
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    `

    timeline.innerHTML = `
      <h3 style="margin: 0 0 15px 0; font-size: 16px;">内存时间线</h3>
      <canvas id="memory-timeline-chart" width="600" height="200" style="width: 100%; height: 200px;"></canvas>
    `

    return timeline
  }

  /**
   * 创建对象分配表
   */
  private createAllocationsTable(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'allocations-container'
    container.style.cssText = `
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
    `

    container.innerHTML = `
      <h3 style="margin: 0 0 15px 0; font-size: 16px;">对象分配</h3>
      <div style="max-height: 300px; overflow-y: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e0e0e0;">类型</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e0e0e0;">数量</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e0e0e0;">大小</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e0e0e0;">保留</th>
            </tr>
          </thead>
          <tbody id="allocations-tbody">
            <tr>
              <td colspan="4" style="padding: 20px; text-align: center; color: #999;">
                点击"拍摄快照"查看对象分配
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `

    return container
  }

  /**
   * 激活标签页
   */
  activate(): void {
    this.isActive = true
    logger.debug('Memory tab activated')

    // 初始化图表
    this.initializeChart()

    // 开始更新
    this.startUpdating()
  }

  /**
   * 停用标签页
   */
  deactivate(): void {
    this.isActive = false
    logger.debug('Memory tab deactivated')

    // 停止更新
    this.stopUpdating()
  }

  /**
   * 初始化图表
   */
  private initializeChart(): void {
    const canvas = this.container?.querySelector('#memory-timeline-chart') as HTMLCanvasElement
    if (canvas) {
      this.chart = new MemoryChart(canvas)
    }
  }

  /**
   * 开始更新
   */
  private startUpdating(): void {
    this.update()
    this.updateInterval = window.setInterval(() => {
      this.update()
    }, 2000)
  }

  /**
   * 停止更新
   */
  private stopUpdating(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = undefined
    }
  }

  /**
   * 更新内存信息
   */
  update(): void {
    if (!this.isActive) return

    if (!performance.memory) {
      logger.warn('Performance.memory not available')
      return
    }

    const memory = performance.memory
    const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
    const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024)
    const limitGB = (memory.jsHeapSizeLimit / 1024 / 1024 / 1024).toFixed(2)

    // 更新概览
    this.updateElement('#used-memory', `${usedMB} MB`)
    this.updateElement('#used-percent', `${Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100)}%`)
    this.updateElement('#total-memory', `${totalMB} MB`)
    this.updateElement('#total-percent', `${Math.round((memory.totalJSHeapSize / memory.jsHeapSizeLimit) * 100)}%`)
    this.updateElement('#limit-memory', `${limitGB} GB`)

    // 更新进度条
    const memoryBar = this.container?.querySelector('#memory-bar') as HTMLElement
    if (memoryBar) {
      const percent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      memoryBar.style.width = `${percent}%`

      // 根据使用率改变颜色
      if (percent > 80) {
        memoryBar.style.background = 'linear-gradient(90deg, #ff4444, #ff6666)'
      } else if (percent > 60) {
        memoryBar.style.background = 'linear-gradient(90deg, #ff9800, #ffb74d)'
      } else {
        memoryBar.style.background = 'linear-gradient(90deg, #2196f3, #4caf50)'
      }
    }

    // 更新图表
    this.chart?.addDataPoint({
      used: usedMB,
      total: totalMB,
      timestamp: Date.now()
    })
  }

  /**
   * 拍摄内存快照
   */
  private async takeSnapshot(): Promise<void> {
    logger.info('Taking memory snapshot')

    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      usedJSHeapSize: performance.memory?.usedJSHeapSize || 0,
      totalJSHeapSize: performance.memory?.totalJSHeapSize || 0,
      jsHeapSizeLimit: performance.memory?.jsHeapSizeLimit || 0,
      objects: this.analyzeObjects()
    }

    this.snapshots.push(snapshot)
    this.currentSnapshot = snapshot

    // 更新对象分配表
    this.updateAllocationsTable(snapshot.objects)

    // 显示提示
    this.showNotification('快照已创建', 'success')
  }

  /**
   * 分析对象分配
   */
  private analyzeObjects(): ObjectAllocation[] {
    const allocations: ObjectAllocation[] = []

    // 分析DOM节点
    const elements = document.querySelectorAll('*')
    const elementsByTag = new Map<string, number>()

    elements.forEach(el => {
      const tag = el.tagName.toLowerCase()
      elementsByTag.set(tag, (elementsByTag.get(tag) || 0) + 1)
    })

    elementsByTag.forEach((count, tag) => {
      allocations.push({
        type: `DOM:${tag}`,
        count,
        size: count * 100, // 估算
        retained: count * 50
      })
    })

    // 分析编辑器对象
    const editorSize = this.estimateObjectSize(this.editor)
    allocations.push({
      type: 'Editor',
      count: 1,
      size: editorSize,
      retained: editorSize
    })

    // 排序
    allocations.sort((a, b) => b.size - a.size)

    return allocations.slice(0, 20) // 只返回前20个
  }

  /**
   * 估算对象大小
   */
  private estimateObjectSize(obj: any): number {
    // 简单的大小估算
    const str = JSON.stringify(obj, null, 2)
    return str ? str.length * 2 : 0 // UTF-16编码
  }

  /**
   * 更新对象分配表
   */
  private updateAllocationsTable(allocations: ObjectAllocation[]): void {
    const tbody = this.container?.querySelector('#allocations-tbody')
    if (!tbody) return

    tbody.innerHTML = allocations.map(alloc => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">
          <span style="font-family: monospace; font-size: 12px;">${alloc.type}</span>
        </td>
        <td style="padding: 8px; text-align: right; border-bottom: 1px solid #f0f0f0;">
          ${alloc.count.toLocaleString()}
        </td>
        <td style="padding: 8px; text-align: right; border-bottom: 1px solid #f0f0f0;">
          ${this.formatBytes(alloc.size)}
        </td>
        <td style="padding: 8px; text-align: right; border-bottom: 1px solid #f0f0f0;">
          ${this.formatBytes(alloc.retained)}
        </td>
      </tr>
    `).join('')
  }

  /**
   * 比较快照
   */
  private compareSnapshots(): void {
    if (this.snapshots.length < 2) {
      this.showNotification('需要至少2个快照进行比较', 'warning')
      return
    }

    // TODO: 实现快照比较功能
    logger.info('Comparing snapshots')
  }

  /**
   * 清空快照
   */
  private clearSnapshots(): void {
    this.snapshots = []
    this.currentSnapshot = undefined

    const tbody = this.container?.querySelector('#allocations-tbody')
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="padding: 20px; text-align: center; color: #999;">
            点击"拍摄快照"查看对象分配
          </td>
        </tr>
      `
    }

    this.showNotification('快照已清空', 'info')
  }

  /**
   * 触发垃圾回收
   */
  private triggerGC(): void {
    if ((window as any).gc) {
      (window as any).gc()
      this.showNotification('垃圾回收已触发', 'success')

      // 延迟更新显示
      setTimeout(() => {
        this.update()
      }, 500)
    } else {
      this.showNotification('垃圾回收不可用，请使用 --expose-gc 标志启动Chrome', 'error')
    }
  }

  /**
   * 格式化字节数
   */
  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
  }

  /**
   * 更新元素内容
   */
  private updateElement(selector: string, content: string): void {
    const element = this.container?.querySelector(selector)
    if (element) {
      element.textContent = content
    }
  }

  /**
   * 显示通知
   */
  private showNotification(message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info'): void {
    // TODO: 实现通知功能
    logger.info(`[${type}] ${message}`)
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.stopUpdating()
    this.container = undefined
  }
}

/**
 * 内存图表
 */
class MemoryChart {
  private ctx: CanvasRenderingContext2D
  private data: Array<{ used: number; total: number; timestamp: number }> = []
  private maxPoints = 60

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!

    // 设置画布尺寸
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    this.draw()
  }

  addDataPoint(point: { used: number; total: number; timestamp: number }): void {
    this.data.push(point)
    if (this.data.length > this.maxPoints) {
      this.data.shift()
    }
    this.draw()
  }

  private draw(): void {
    const { width, height } = this.ctx.canvas
    const actualWidth = width / window.devicePixelRatio
    const actualHeight = height / window.devicePixelRatio

    // 清空画布
    this.ctx.clearRect(0, 0, actualWidth, actualHeight)

    // 绘制背景网格
    this.drawGrid(actualWidth, actualHeight)

    if (this.data.length < 2) return

    // 找到最大值
    const maxValue = Math.max(...this.data.map(d => d.total))
    const scale = actualHeight / (maxValue * 1.2) // 留20%空间

    // 绘制总内存线
    this.drawLine(
      this.data.map(d => d.total),
      scale,
      actualWidth,
      actualHeight,
      '#4caf50',
      'rgba(76, 175, 80, 0.2)'
    )

    // 绘制已使用内存线
    this.drawLine(
      this.data.map(d => d.used),
      scale,
      actualWidth,
      actualHeight,
      '#2196f3',
      'rgba(33, 150, 243, 0.2)'
    )
  }

  private drawGrid(width: number, height: number): void {
    this.ctx.strokeStyle = '#f0f0f0'
    this.ctx.lineWidth = 1

    // 横线
    for (let i = 0; i <= 5; i++) {
      const y = (height / 5) * i
      this.ctx.beginPath()
      this.ctx.moveTo(0, y)
      this.ctx.lineTo(width, y)
      this.ctx.stroke()
    }
  }

  private drawLine(
    data: number[],
    scale: number,
    width: number,
    height: number,
    lineColor: string,
    fillColor: string
  ): void {
    const stepX = width / (this.maxPoints - 1)

    // 填充区域
    this.ctx.fillStyle = fillColor
    this.ctx.beginPath()
    this.ctx.moveTo(0, height)

    data.forEach((value, index) => {
      const x = index * stepX
      const y = height - (value * scale)
      this.ctx.lineTo(x, y)
    })

    this.ctx.lineTo((data.length - 1) * stepX, height)
    this.ctx.closePath()
    this.ctx.fill()

    // 绘制线条
    this.ctx.strokeStyle = lineColor
    this.ctx.lineWidth = 2
    this.ctx.beginPath()

    data.forEach((value, index) => {
      const x = index * stepX
      const y = height - (value * scale)

      if (index === 0) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
    })

    this.ctx.stroke()
  }
}



