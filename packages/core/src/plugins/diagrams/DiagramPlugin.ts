/**
 * 图表插件
 * 提供思维导图、流程图、UML图等图表编辑支持
 */

import type { Plugin } from '../../core/Plugin'
import type { EditorInstance } from '../../types'
import type { DiagramData, DiagramOptions, DiagramType } from './types'
import { createLogger } from '../../utils/logger'
import { DiagramRenderer } from './DiagramRenderer'
import { DiagramToolbar } from './DiagramToolbar'
import { FlowchartEditor } from './editors/FlowchartEditor'
import { GanttEditor } from './editors/GanttEditor'
import { MindMapEditor } from './editors/MindMapEditor'
import { SequenceDiagramEditor } from './editors/SequenceDiagramEditor'
import { UMLEditor } from './editors/UMLEditor'

const logger = createLogger('DiagramPlugin')

export class DiagramPlugin implements Plugin {
  name = 'diagram'
  config = {
    name: 'diagram',
  }

  version = '1.0.0'
  description = '高级图表编辑支持'

  private editor?: EditorInstance
  private renderer?: DiagramRenderer
  private toolbar?: DiagramToolbar
  private editors = new Map<DiagramType, any>()
  private currentEditor?: any
  private currentType?: DiagramType
  private container?: HTMLElement

  /**
   * 初始化插件
   */
  async install(editor: EditorInstance): Promise<void> {
    logger.info('Initializing diagram plugin')
    this.editor = editor

    // 初始化渲染器
    this.renderer = new DiagramRenderer({
      editor,
    })

    // 初始化工具栏
    this.toolbar = new DiagramToolbar({
      editor,
      onInsertDiagram: type => this.insertDiagram(type),
      onEditDiagram: node => this.editDiagram(node),
    })

    // 注册编辑器
    this.registerEditors()

    // 注册命令
    this.registerCommands()

    // 注册节点视图
    this.registerNodeViews()

    // 设置事件监听
    this.setupEventListeners()

    logger.info('Diagram plugin initialized')
  }

  /**
   * 注册编辑器
   */
  private registerEditors(): void {
    this.editors.set('mindmap', new MindMapEditor())
    this.editors.set('flowchart', new FlowchartEditor())
    this.editors.set('uml', new UMLEditor())
    this.editors.set('sequence', new SequenceDiagramEditor())
    this.editors.set('gantt', new GanttEditor())
  }

  /**
   * 注册命令
   */
  private registerCommands(): void {
    if (!this.editor) return
    const { commands } = this.editor

    // 插入图表命令
    commands.register('insertMindMap', {
      label: '插入思维导图',
      icon: '🧠',
      execute: () => this.insertDiagram('mindmap'),
    })

    commands.register('insertFlowchart', {
      label: '插入流程图',
      icon: '🔀',
      execute: () => this.insertDiagram('flowchart'),
    })

    commands.register('insertUML', {
      label: '插入UML图',
      icon: '📐',
      execute: () => this.insertDiagram('uml'),
    })

    commands.register('insertSequenceDiagram', {
      label: '插入时序图',
      icon: '📊',
      execute: () => this.insertDiagram('sequence'),
    })

    commands.register('insertGantt', {
      label: '插入甘特图',
      icon: '📅',
      execute: () => this.insertDiagram('gantt'),
    })

    // 编辑图表命令
    commands.register('editDiagram', {
      label: '编辑图表',
      icon: '✏️',
      execute: () => {
        const node = this.getSelectedDiagramNode()
        if (node)
          this.editDiagram(node)
      },
    })

    // 导出图表命令
    commands.register('exportDiagram', {
      label: '导出图表',
      icon: '💾',
      execute: () => this.exportDiagram(),
    })
  }

  /**
   * 注册节点视图
   */
  private registerNodeViews(): void {
    if (!this.editor) return
    const schema = (this.editor as any).schema
    if (!schema) return

    // 注册图表节点
    schema.nodes.diagram = {
      attrs: {
        type: { default: 'mindmap' },
        data: { default: null },
        width: { default: '100%' },
        height: { default: 400 },
      },
      content: 'text*',
      group: 'block',
      draggable: true,
      parseDOM: [{
        tag: 'div[data-diagram]',
        getAttrs: (dom: HTMLElement) => ({
          type: dom.dataset.diagramType,
          data: JSON.parse(dom.dataset.diagramData || '{}'),
          width: dom.style.width,
          height: dom.style.height,
        }),
      }],
      toDOM: (node: any) => ['div', {
        'data-diagram': 'true',
        'data-diagram-type': node.attrs.type,
        'data-diagram-data': JSON.stringify(node.attrs.data),
        'style': `width: ${node.attrs.width}; height: ${node.attrs.height}px`,
        'class': 'diagram-node',
      }, 0],
    }
  }

  /**
   * 设置事件监听
   */
  private setupEventListeners(): void {
    if (!this.editor) return
    const editor = this.editor

    // 监听选择变化
    editor.on('selectionUpdate', () => {
      const node = this.getSelectedDiagramNode()
      this.toolbar?.updateState(!!node)
    })

    // 监听双击编辑
    editor.contentElement?.addEventListener('dblclick', (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const diagramNode = target.closest('.diagram-node')
      if (diagramNode)
        this.editDiagram(diagramNode as HTMLElement)
    })
  }

  /**
   * 插入图表
   */
  async insertDiagram(type: DiagramType, data?: DiagramData): Promise<void> {
    logger.info(`Inserting ${type} diagram`)

    // 创建编辑器
    const editor = this.editors.get(type)
    if (!editor) {
      logger.error(`Unknown diagram type: ${type}`)
      return
    }

    // 显示编辑器
    this.currentType = type
    this.currentEditor = editor

    const result = await this.showEditor(editor, {
      type,
      data: data || this.getDefaultData(type),
      isNew: true,
    })

    if (result) {
      // 插入图表节点
      const { commands } = this.context!
      commands.execute('insertNode', {
        type: 'diagram',
        attrs: {
          type,
          data: result.data,
          width: result.options?.width || '100%',
          height: result.options?.height || 400,
        },
      })
    }
  }

  /**
   * 编辑图表
   */
  async editDiagram(node: HTMLElement): Promise<void> {
    const type = node.dataset.diagramType as DiagramType
    const data = JSON.parse(node.dataset.diagramData || '{}')

    logger.info(`Editing ${type} diagram`)

    const editor = this.editors.get(type)
    if (!editor) {
      logger.error(`Unknown diagram type: ${type}`)
      return
    }

    this.currentType = type
    this.currentEditor = editor

    const result = await this.showEditor(editor, {
      type,
      data,
      isNew: false,
      node,
    })

    if (result) {
      // 更新图表数据
      node.dataset.diagramData = JSON.stringify(result.data)

      // 重新渲染
      this.renderer?.render(node, type, result.data)
    }
  }

  /**
   * 显示编辑器
   */
  private async showEditor(editor: any, options: {
    type: DiagramType
    data: DiagramData
    isNew: boolean
    node?: HTMLElement
  }): Promise<{ data: DiagramData, options?: DiagramOptions } | null> {
    // 创建编辑器容器
    const modal = this.createModal()
    document.body.appendChild(modal)

    // 渲染编辑器
    const container = modal.querySelector('.diagram-editor-content') as HTMLElement
    const result = await editor.render(container, {
      data: options.data,
      onSave: (data: DiagramData, opts?: DiagramOptions) => {
        this.closeModal(modal)
        return { data, options: opts }
      },
      onCancel: () => {
        this.closeModal(modal)
        return null
      },
    })

    return result
  }

  /**
   * 创建模态框
   */
  private createModal(): HTMLElement {
    const modal = document.createElement('div')
    modal.className = 'diagram-editor-modal'
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `

    modal.innerHTML = `
      <div class="diagram-editor-dialog" style="
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        width: 90%;
        max-width: 1200px;
        height: 80vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      ">
        <div class="diagram-editor-header" style="
          padding: 15px 20px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        ">
          <h3 style="margin: 0; font-size: 18px;">
            ${this.getEditorTitle(this.currentType!)}
          </h3>
          <button class="close-btn" style="
            background: transparent;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
          ">×</button>
        </div>
        <div class="diagram-editor-content" style="
          flex: 1;
          overflow: auto;
          padding: 20px;
        "></div>
      </div>
    `

    // 点击背景关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal)
        this.closeModal(modal)
    })

    // 关闭按钮
    const closeBtn = modal.querySelector('.close-btn')
    closeBtn?.addEventListener('click', () => {
      this.closeModal(modal)
    })

    return modal
  }

  /**
   * 关闭模态框
   */
  private closeModal(modal: HTMLElement): void {
    modal.remove()
    this.currentEditor?.destroy?.()
    this.currentEditor = null
    this.currentType = undefined
  }

  /**
   * 获取编辑器标题
   */
  private getEditorTitle(type: DiagramType): string {
    const titles: Record<DiagramType, string> = {
      mindmap: '思维导图编辑器',
      flowchart: '流程图编辑器',
      uml: 'UML图编辑器',
      sequence: '时序图编辑器',
      gantt: '甘特图编辑器',
    }
    return titles[type] || '图表编辑器'
  }

  /**
   * 获取默认数据
   */
  private getDefaultData(type: DiagramType): DiagramData {
    switch (type) {
      case 'mindmap':
        return {
          root: {
            text: '中心主题',
            children: [
              { text: '分支1', children: [] },
              { text: '分支2', children: [] },
              { text: '分支3', children: [] },
            ],
          },
        }

      case 'flowchart':
        return {
          nodes: [
            { id: '1', type: 'start', text: '开始', x: 100, y: 50 },
            { id: '2', type: 'process', text: '处理', x: 100, y: 150 },
            { id: '3', type: 'end', text: '结束', x: 100, y: 250 },
          ],
          edges: [
            { from: '1', to: '2' },
            { from: '2', to: '3' },
          ],
        }

      case 'uml':
        return {
          classes: [
            {
              name: 'User',
              attributes: ['id: number', 'name: string'],
              methods: ['login()', 'logout()'],
            },
          ],
          relationships: [],
        }

      case 'sequence':
        return {
          actors: ['用户', '系统'],
          messages: [
            { from: '用户', to: '系统', text: '登录请求' },
            { from: '系统', to: '用户', text: '返回结果' },
          ],
        }

      case 'gantt':
        return {
          tasks: [
            {
              name: '任务1',
              start: new Date().toISOString(),
              end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              progress: 0,
            },
          ],
        }

      default:
        return {}
    }
  }

  /**
   * 导出图表
   */
  async exportDiagram(): Promise<void> {
    const node = this.getSelectedDiagramNode()
    if (!node)
      return

    const type = node.dataset.diagramType as DiagramType
    const data = JSON.parse(node.dataset.diagramData || '{}')

    // 让渲染器导出
    await this.renderer?.export(node, type, data)
  }

  /**
   * 获取选中的图表节点
   */
  private getSelectedDiagramNode(): HTMLElement | null {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0)
      return null

    const range = selection.getRangeAt(0)
    const container = range.commonAncestorContainer
    const element = container.nodeType === Node.TEXT_NODE
      ? container.parentElement
      : container as HTMLElement

    return element?.closest('.diagram-node') || null
  }

  /**
   * 销毁插件
   */
  destroy(): void {
    logger.info('Destroying diagram plugin')

    // 清理编辑器
    this.editors.forEach(editor => editor.destroy?.())
    this.editors.clear()

    // 清理组件
    this.renderer?.destroy()
    this.toolbar?.destroy()

    // 清理当前编辑器
    if (this.currentEditor)
      this.currentEditor.destroy?.()

    logger.info('Diagram plugin destroyed')
  }
}
