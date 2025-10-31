/**
 * UML类图编辑器
 */

import type { DiagramEditor, UMLData } from '../types'
import { createLogger } from '../../../utils/logger'

const logger = createLogger('UMLEditor')

export class UMLEditor implements DiagramEditor {
  private container?: HTMLElement
  private data?: UMLData
  private onSave?: (data: UMLData) => void
  private onCancel?: () => void

  async render(container: HTMLElement, options: {
    data: UMLData
    onSave: (data: UMLData) => void
    onCancel: () => void
  }): Promise<void> {
    logger.info('Rendering UML editor')
    this.container = container
    this.data = JSON.parse(JSON.stringify(options.data))
    this.onSave = options.onSave
    this.onCancel = options.onCancel
    this.createUI()
  }

  private createUI(): void {
    if (!this.container || !this.data)
      return

    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; height: 100%; overflow-y: auto; padding: 20px;">
        <h4>UML类图编辑器 (简化版)</h4>
        <p style="color: #666; font-size: 13px;">添加类、属性、方法和关系</p>
        
        <div style="margin-top: 20px;">
          ${this.data.classes.map((cls, i) => `
            <div style="border: 1px solid #ddd; border-radius: 4px; padding: 15px; margin-bottom: 15px; background: white;">
              <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                <strong style="font-size: 16px;">${cls.name}</strong>
                <button onclick="window.deleteUMLClass(${i})" style="padding: 4px 8px; border: 1px solid #f44336; color: #f44336; border-radius: 4px; cursor: pointer;">删除</button>
              </div>
              <div style="font-size: 13px; color: #666;">
                <div><strong>属性:</strong> ${cls.attributes.join(', ') || '无'}</div>
                <div><strong>方法:</strong> ${cls.methods.join(', ') || '无'}</div>
              </div>
            </div>
          `).join('')}
          
          <button id="addClass" style="padding: 10px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">
            ➕ 添加类
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
    (window as any).deleteUMLClass = (index: number) => {
      if (this.data && confirm('确定删除？')) {
        this.data.classes.splice(index, 1)
        this.createUI()
      }
    }

    this.container?.querySelector('#addClass')?.addEventListener('click', () => {
      const name = prompt('类名：', 'NewClass')
      if (name && this.data) {
        this.data.classes.push({ name, attributes: [], methods: [] })
        this.createUI()
      }
    })

    this.container?.querySelector('#save')?.addEventListener('click', () => {
      if (this.onSave && this.data)
        this.onSave(this.data)
    })
    this.container?.querySelector('#cancel')?.addEventListener('click', () => this.onCancel?.())
  }

  destroy(): void {
    delete (window as any).deleteUMLClass
  }
}
