/**
 * 甘特图编辑器
 */

import type { DiagramEditor, GanttData } from '../types'

export class GanttEditor implements DiagramEditor {
  private container?: HTMLElement
  private data?: GanttData
  private onSave?: (data: GanttData) => void
  private onCancel?: () => void

  async render(container: HTMLElement, options: {
    data: GanttData
    onSave: (data: GanttData) => void
    onCancel: () => void
  }): Promise<void> {
    this.container = container
    this.data = JSON.parse(JSON.stringify(options.data))
    this.onSave = options.onSave
    this.onCancel = options.onCancel
    this.createUI()
  }

  private createUI(): void {
    if (!this.container || !this.data) return

    this.container.innerHTML = `
      <div style="padding: 20px; height: 100%; overflow-y: auto;">
        <h4>甘特图编辑器</h4>
        <div style="margin-top: 20px;">
          ${this.data.tasks.map((task, i) => `
            <div style="border: 1px solid #ddd; border-radius: 4px; padding: 12px; margin-bottom: 12px; background: white;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                  <strong>${task.name}</strong>
                  <div style="font-size: 13px; color: #666; margin-top: 4px;">
                    开始: ${new Date(task.start).toLocaleDateString()} | 结束: ${new Date(task.end).toLocaleDateString()} | 进度: ${task.progress}%
                  </div>
                </div>
                <button onclick="window.delGanttTask(${i})" style="padding: 4px 8px; border: 1px solid #f44336; color: #f44336; border-radius: 4px; cursor: pointer;">删除</button>
              </div>
            </div>
          `).join('')}
          
          <button id="addTask" style="padding: 10px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 10px;">
            ➕ 添加任务
          </button>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; display: flex; justify-content: flex-end; gap: 10px;">
          <button id="cancel" style="padding: 8px 20px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">取消</button>
          <button id="save" style="padding: 8px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
        </div>
      </div>
    `

    this.bindEvents()
  }

  private bindEvents(): void {
    (window as any).delGanttTask = (i: number) => {
      if (this.data && confirm('确定删除？')) {
        this.data.tasks.splice(i, 1)
        this.createUI()
      }
    }

    this.container?.querySelector('#addTask')?.addEventListener('click', () => {
      const name = prompt('任务名称：', '新任务')
      if (name && this.data) {
        const start = new Date()
        const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        this.data.tasks.push({
          name,
          start: start.toISOString(),
          end: end.toISOString(),
          progress: 0
        })
        this.createUI()
      }
    })

    this.container?.querySelector('#save')?.addEventListener('click', () => {
      if (this.onSave && this.data) this.onSave(this.data)
    })
    this.container?.querySelector('#cancel')?.addEventListener('click', () => this.onCancel?.())
  }

  destroy(): void {
    delete (window as any).delGanttTask
  }
}

