/**
 * 时序图编辑器
 */

import type { DiagramEditor, SequenceData } from '../types'

export class SequenceDiagramEditor implements DiagramEditor {
  private container?: HTMLElement
  private data?: SequenceData
  private onSave?: (data: SequenceData) => void
  private onCancel?: () => void

  async render(container: HTMLElement, options: {
    data: SequenceData
    onSave: (data: SequenceData) => void
    onCancel: () => void
  }): Promise<void> {
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
      <div style="padding: 20px; height: 100%; overflow-y: auto;">
        <h4>时序图编辑器</h4>
        <div style="margin: 20px 0;">
          <strong>参与者：</strong>
          ${this.data.actors.map((actor, i) => `
            <span style="display: inline-block; margin: 5px; padding: 6px 12px; background: #e8f4f8; border-radius: 4px;">
              ${typeof actor === 'string' ? actor : actor.name}
              <button onclick="window.delSeqActor(${i})" style="margin-left: 8px; border: none; background: transparent; cursor: pointer; color: #f44336;">×</button>
            </span>
          `).join('')}
          <button id="addActor" style="margin-left: 10px; padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">+ 添加</button>
        </div>
        
        <div>
          <strong>消息：</strong>
          <div style="margin-top: 10px;">
            ${this.data.messages.map((msg, i) => `
              <div style="padding: 8px; margin-bottom: 8px; background: #f5f5f5; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                <span>${msg.from} → ${msg.to}: ${msg.text}</span>
                <button onclick="window.delSeqMsg(${i})" style="padding: 4px 8px; border: 1px solid #f44336; color: #f44336; border-radius: 4px; cursor: pointer;">删除</button>
              </div>
            `).join('')}
            <button id="addMessage" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 10px;">+ 添加消息</button>
          </div>
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
    (window as any).delSeqActor = (i: number) => {
      if (this.data) { this.data.actors.splice(i, 1); this.createUI() }
    };
    (window as any).delSeqMsg = (i: number) => {
      if (this.data) { this.data.messages.splice(i, 1); this.createUI() }
    }

    this.container?.querySelector('#addActor')?.addEventListener('click', () => {
      const name = prompt('参与者名称：')
      if (name && this.data) { this.data.actors.push(name); this.createUI() }
    })

    this.container?.querySelector('#addMessage')?.addEventListener('click', () => {
      if (!this.data || this.data.actors.length < 2) {
        alert('至少需要2个参与者')
        return
      }
      const from = prompt(`发送方 (${this.data.actors.join(', ')}):`)
      const to = prompt(`接收方 (${this.data.actors.join(', ')}):`)
      const text = prompt('消息内容：')
      if (from && to && text) {
        this.data.messages.push({ from, to, text })
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
    delete (window as any).delSeqActor
    delete (window as any).delSeqMsg
  }
}
