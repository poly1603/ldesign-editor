/**
 * Editor - 编辑器核心类
 * 管理编辑器的所有功能
 *
 * @example
 * ```typescript
 * // 最简用法 - 无任何插件
 * const editor = new Editor({ element: '#editor' })
 *
 * // 链式注册插件
 * editor
 *   .use(BoldPlugin)
 *   .use(ItalicPlugin)
 *   .use(HeadingPlugin)
 *
 * // 使用预设
 * import { standardPlugins } from '@ldesign/editor-core/presets'
 * const editor = new Editor({ element: '#editor', plugins: standardPlugins })
 * ```
 */

import type { EditorOptions, EditorState, Plugin as PluginType, SchemaSpec, Transaction } from '../types'
import type { DOMPatch } from './IncrementalRenderer'
import type { Schema } from './Schema'
import { DebugPanel } from '../devtools/DebugPanel'
import { DEFAULT_TOOLBAR_ITEMS } from '../ui/defaultToolbar'
import { Toolbar } from '../ui/Toolbar'
import { createLogger } from '../utils/logger'
import { WasmAccelerator } from '../wasm/WasmAccelerator'
import { CommandManager, KeymapManager } from './Command'
import { Document } from './Document'
import { EditorVirtualScroller } from './EditorVirtualScroller'
import { EventEmitter } from './EventEmitter'
import { IncrementalRenderer } from './IncrementalRenderer'
import { PluginManager } from './Plugin'
import { defaultSchema } from './Schema'
import { Selection, SelectionManager } from './Selection'

const logger = createLogger('Editor')

export class Editor {
  // 版本信息
  public static version = '1.3.0'
  public version = '1.3.0'

  // 核心组件
  private eventEmitter: EventEmitter
  private schema: Schema
  private document: Document
  private selectionManager: SelectionManager

  // 管理器
  public commands: CommandManager
  public keymap: KeymapManager
  public plugins: PluginManager
  public contextMenuManager?: any // 右键菜单管理器
  public toolbar?: Toolbar // 工具栏
  public virtualScroller?: EditorVirtualScroller // 虚拟滚动器
  public incrementalRenderer?: IncrementalRenderer // 增量渲染器
  public wasmAccelerator?: WasmAccelerator // WebAssembly加速器
  public debugPanel?: DebugPanel // 调试面板

  // 选项
  public options: EditorOptions
  private editable: boolean = true

  // DOM
  private element: HTMLElement | null = null
  public contentElement: HTMLElement | null = null
  private toolbarElement: HTMLElement | null = null

  // 状态
  private destroyed: boolean = false

  // DOM 选区快照（用于在弹窗交互后恢复插入位置）
  private savedRange: Range | null = null

  constructor(options: EditorOptions = {}) {
    this.options = options
    this.editable = options.editable !== false

    // 初始化核心组件
    this.eventEmitter = new EventEmitter()
    this.schema = defaultSchema
    this.document = new Document(options.content, this.schema)
    this.selectionManager = new SelectionManager(this)

    // 初始化管理器
    this.commands = new CommandManager(this)
    this.keymap = new KeymapManager(this)
    this.plugins = new PluginManager(this)

    // 初始化 DOM
    if (options.element)
      this.mount(options.element)

    // 注册插件 - 只加载用户明确指定的插件，默认为空
    const pluginsToLoad = options.plugins || []

    if (pluginsToLoad.length > 0) {
      logger.debug('Loading plugins, total:', pluginsToLoad.length)
      pluginsToLoad.forEach((plugin, index) => {
        if (typeof plugin === 'string') {
          logger.debug(`Loading builtin plugin [${index}]: "${plugin}"`)
          this.loadBuiltinPlugin(plugin)
        }
        else {
          logger.debug(`Loading plugin [${index}]: "${plugin.name || 'unnamed'}"`)
          this.plugins.register(plugin)
        }
      })
      logger.debug('All plugins loaded')
    }

    // 初始化事件监听
    this.setupEventListeners()
  }

  /**
   * 链式注册插件
   * @param plugin - 插件实例或插件名称
   * @returns 编辑器实例（支持链式调用）
   *
   * @example
   * ```typescript
   * editor
   *   .use(BoldPlugin)
   *   .use(ItalicPlugin)
   *   .use(new CustomPlugin({ option: 'value' }))
   * ```
   */
  use(plugin: PluginType | string): this {
    if (typeof plugin === 'string') {
      this.loadBuiltinPlugin(plugin)
    }
    else {
      this.plugins.register(plugin)
    }
    return this
  }

  /**
   * 批量注册插件
   * @param plugins - 插件数组
   * @returns 编辑器实例（支持链式调用）
   *
   * @example
   * ```typescript
   * import { standardPlugins } from '@ldesign/editor-core/presets'
   * editor.usePlugins(standardPlugins)
   * ```
   */
  usePlugins(plugins: (PluginType | string)[]): this {
    plugins.forEach(plugin => this.use(plugin))
    return this
  }

  /**
   * 挂载编辑器
   */
  mount(element: HTMLElement | string): void {
    if (typeof element === 'string') {
      const el = document.querySelector(element)
      if (!el)
        throw new Error(`Element "${element}" not found`)

      this.element = el as HTMLElement
    }
    else {
      this.element = element
    }

    // 创建编辑器 DOM 结构
    this.element.classList.add('ldesign-editor')
    this.element.classList.add('ldesign-editor-wrapper')

    // 创建工具栏容器 (默认创建)
    if (this.options.toolbar !== false) {
      this.toolbarElement = document.createElement('div')
      this.toolbarElement.classList.add('ldesign-toolbar')
      this.element.appendChild(this.toolbarElement)

      // 创建工具栏实例
      this.toolbar = new Toolbar(this, {
        container: this.toolbarElement,
        items: this.options.toolbarItems || DEFAULT_TOOLBAR_ITEMS,
      })
    }

    // 创建编辑器内容区域
    this.contentElement = document.createElement('div')
    this.contentElement.classList.add('ldesign-editor-content')
    this.contentElement.contentEditable = String(this.editable)

    // 设置占位符
    if (this.options.placeholder)
      this.contentElement.dataset.placeholder = this.options.placeholder

    this.element.appendChild(this.contentElement)

    // 初始化增量渲染器
    if (this.options.incrementalRender?.enabled !== false) {
      this.incrementalRenderer = new IncrementalRenderer({
        batchDelay: this.options.incrementalRender?.batchDelay,
        maxBatchSize: this.options.incrementalRender?.maxBatchSize,
        useRAF: this.options.incrementalRender?.useRAF !== false,
        useWorker: this.options.incrementalRender?.useWorker,
        useVirtualDOM: this.options.incrementalRender?.useVirtualDOM,
      })

      // 观察内容元素的变化
      this.incrementalRenderer.observeElement(this.contentElement)
    }

    // 初始化WebAssembly加速器
    if (this.options.wasm?.enabled !== false && WasmAccelerator.isSupported()) {
      this.wasmAccelerator = new WasmAccelerator({
        enabled: this.options.wasm?.enabled !== false,
        enableDiff: this.options.wasm?.enableDiff !== false,
        enableParser: this.options.wasm?.enableParser !== false,
        useWorker: this.options.wasm?.useWorker,
        warmupStrategy: this.options.wasm?.warmupStrategy || 'lazy',
      })

      // 预热WASM模块（异步）
      if (this.options.wasm?.warmupStrategy === 'eager') {
        this.wasmAccelerator.initialize().catch((error) => {
          logger.warn('WASM initialization failed:', error)
        })
      }
    }

    // 初始化虚拟滚动（如果启用）
    if (this.options.virtualScroll?.enabled) {
      this.virtualScroller = new EditorVirtualScroller({
        editor: this,
        lineHeight: this.options.virtualScroll.lineHeight,
        maxLines: this.options.virtualScroll.maxLines,
        enableSyntaxHighlight: this.options.virtualScroll.enableSyntaxHighlight,
        enableLineNumbers: this.options.virtualScroll.enableLineNumbers,
        enableWordWrap: this.options.virtualScroll.enableWordWrap,
      })

      // 使用虚拟滚动渲染
      this.virtualScroller.setContent(this.document.toText())
    }
    else {
      // 普通渲染
      this.render()
    }

    // 自动聚焦
    if (this.options.autofocus)
      this.focus()

    // 初始化调试面板
    if (this.options.debugPanel?.enabled) {
      this.debugPanel = new DebugPanel({
        editor: this,
        expanded: this.options.debugPanel.expanded,
        initialTab: this.options.debugPanel.initialTab,
        theme: this.options.debugPanel.theme,
        position: this.options.debugPanel.position,
        size: this.options.debugPanel.size,
        resizable: this.options.debugPanel.resizable,
        showInProduction: this.options.debugPanel.showInProduction,
      })
    }
  }

  /**
   * 设置事件监听
   */
  private setupEventListeners(): void {
    if (!this.contentElement)
      return

    // 键盘事件
    this.contentElement.addEventListener('keydown', (e) => {
      if (this.keymap.handleKeyDown(e))
        e.preventDefault()
    })

    // 输入事件
    this.contentElement.addEventListener('input', (_e) => {
      this.handleInput()
    })

    // 选区变化
    document.addEventListener('selectionchange', () => {
      const sel = window.getSelection()
      if (this.contentElement && this.contentElement.contains(sel?.anchorNode || null)) {
        // 同步到内部 Selection 模型
        this.selectionManager.syncFromDOM()
        this.emit('selectionUpdate', this.getSelection())
        // 保存 DOM 级别的 Range 以便弹窗关闭后恢复
        if (sel && sel.rangeCount > 0) {
          try {
            this.savedRange = sel.getRangeAt(0).cloneRange()
          }
          catch { }
        }
      }
    })

    // 聚焦和失焦
    this.contentElement.addEventListener('focus', () => {
      this.emit('focus')
      this.options.onFocus?.()
    })

    this.contentElement.addEventListener('blur', () => {
      this.emit('blur')
      this.options.onBlur?.()
    })
  }

  /**
   * 处理输入
   */
  private handleInput(): void {
    if (!this.contentElement)
      return

    // 更新文档
    const html = this.contentElement.innerHTML
    this.document = new Document(html, this.schema)

    // 触发更新事件
    this.emit('update', this.getState())
    this.options.onUpdate?.(this.getState())
    this.options.onChange?.(this.getHTML())
  }

  /**
   * 渲染内容
   */
  private render(): void {
    if (!this.contentElement)
      return

    const html = this.document.toHTML()

    if (this.incrementalRenderer) {
      // 使用增量渲染
      this.renderIncremental(html)
    }
    else {
      // 保存当前选区
      const selection = this.getSelection()

      // 更新内容
      this.contentElement.innerHTML = html

      // 恢复选区
      if (selection)
        this.setSelection(selection)
    }
  }

  /**
   * 增量渲染内容
   */
  private renderIncremental(newHTML: string): void {
    if (!this.contentElement || !this.incrementalRenderer)
      return

    // 创建临时DOM来解析新HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = newHTML

    // 计算差异并生成补丁
    const patches = this.calculatePatches(this.contentElement, tempDiv)

    // 应用补丁
    if (patches.length > 0)
      this.incrementalRenderer.queuePatches(patches)
  }

  /**
   * 计算DOM补丁
   */
  private calculatePatches(oldRoot: Element, newRoot: Element): DOMPatch[] {
    const patches: DOMPatch[] = []

    // 简单的差异算法（实际应该使用更复杂的算法）
    const oldChildren = Array.from(oldRoot.children)
    const newChildren = Array.from(newRoot.children)

    // 处理删除的节点
    oldChildren.forEach((oldChild, index) => {
      if (!newChildren[index]) {
        patches.push({
          type: 'remove',
          target: oldChild,
        })
      }
    })

    // 处理新增和更新的节点
    newChildren.forEach((newChild, index) => {
      const oldChild = oldChildren[index]

      if (!oldChild) {
        // 新增节点
        patches.push({
          type: 'insert',
          parent: oldRoot,
          newNode: newChild.cloneNode(true),
          index,
        })
      }
      else if (oldChild.outerHTML !== newChild.outerHTML) {
        // 更新节点
        patches.push({
          type: 'update',
          target: oldChild,
          newNode: newChild.cloneNode(true),
        })
      }
    })

    return patches
  }

  /**
   * 加载内置插件
   */
  private loadBuiltinPlugin(name: string): void {
    // 动态导入插件
    switch (name) {
      case 'image':
        import('../plugins/media/image').then((module) => {
          this.plugins.register(module.ImagePlugin)
        })
        break
      case 'formatting':
        import('../plugins/formatting').then((module) => {
          if (module.BoldPlugin)
            this.plugins.register(module.BoldPlugin)
          if (module.ItalicPlugin)
            this.plugins.register(module.ItalicPlugin)
          if (module.UnderlinePlugin)
            this.plugins.register(module.UnderlinePlugin)
        })
        break
      // 其他插件可以在这里添加
      default:
        logger.warn(`未知插件: ${name}`)
    }
  }

  /**
   * 获取编辑器容器元素
   */
  getElement(): HTMLElement {
    if (!this.element)
      throw new Error('Editor not mounted')

    return this.element
  }

  /**
   * 获取编辑器状态
   */
  getState(): EditorState {
    return {
      doc: this.document.toJSON(),
      selection: this.getSelection().toJSON(),
    }
  }

  /**
   * 分发事务
   */
  dispatch(tr: Transaction): void {
    // 更新文档
    this.document = new Document(tr.doc, this.schema)

    // 更新选区
    if (tr.selection)
      this.setSelection(Selection.fromJSON(tr.selection))

    // 重新渲染
    this.render()

    // 触发更新事件
    this.emit('update', this.getState())
    this.options.onUpdate?.(this.getState())
    this.options.onChange?.(this.getHTML())
  }

  /**
   * 获取选区
   */
  getSelection(): Selection {
    return this.selectionManager.getSelection()
  }

  /**
   * 设置选区
   */
  setSelection(selection: Selection): void {
    this.selectionManager.setSelection(selection)
  }

  /**
   * 保存当前 DOM 选区（仅当选区在编辑器内部时）
   */
  saveSelection(): void {
    if (!this.contentElement)
      return
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0)
      return
    const range = sel.getRangeAt(0)
    if (this.contentElement.contains(range.commonAncestorContainer)) {
      try {
        this.savedRange = range.cloneRange()
        logger.debug('DOM selection saved')
      }
      catch (e) {
        logger.warn('Failed to save selection:', e)
      }
    }
  }

  /**
   * 恢复先前保存的 DOM 选区
   * 返回是否恢复成功
   */
  restoreSelection(): boolean {
    if (!this.contentElement || !this.savedRange)
      return false
    try {
      if (!this.contentElement.contains(this.savedRange.commonAncestorContainer))
        return false

      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(this.savedRange)
      logger.debug('DOM selection restored')
      return true
    }
    catch (e) {
      logger.warn('Failed to restore selection:', e)
      return false
    }
  }

  /**
   * 获取 HTML 内容
   */
  getHTML(): string {
    return this.document.toHTML()
  }

  /**
   * 获取选中的纯文本
   */
  getSelectedText(): string {
    if (!this.contentElement)
      return ''

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0)
      return ''

    const range = selection.getRangeAt(0)
    if (!this.contentElement.contains(range.commonAncestorContainer))
      return ''

    // 获取选中的纯文本
    return selection.toString()
  }

  /**
   * 设置 HTML 内容
   */
  setHTML(html: string): void {
    this.document = new Document(html, this.schema)
    this.render()
  }

  /**
   * 获取 JSON 内容
   */
  getJSON(): any {
    return this.document.toJSON()
  }

  /**
   * 设置 JSON 内容
   */
  setJSON(json: any): void {
    this.document = Document.fromJSON(json, this.schema)
    this.render()
  }

  /**
   * 插入 HTML 内容到当前光标位置
   */
  insertHTML(html: string): void {
    if (!this.contentElement)
      return

    const beforeLen = this.contentElement.innerHTML.length
    logger.debug('insertHTML called. Before length:', beforeLen)
    logger.debug('html length:', html?.length)

    // 获取当前选区
    let selection = window.getSelection()
    logger.debug('Initial selection:', selection)
    if (!selection || selection.rangeCount === 0) {
      // 尝试恢复之前保存的选区
      const restored = this.restoreSelection()
      selection = window.getSelection()
      if (!restored || !selection || selection.rangeCount === 0) {
        // 如果没有选区，退化到在编辑器末尾插入
        logger.warn('No selection, creating range at end of editor')
        this.contentElement.focus()
        const range = document.createRange()
        range.selectNodeContents(this.contentElement)
        range.collapse(false)
        selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }

    let range = selection!.getRangeAt(0)
    logger.debug('Range obtained. Collapsed:', range.collapsed)

    // 确保选区在编辑器内
    if (!this.contentElement.contains(range.commonAncestorContainer)) {
      logger.warn('Selection is not in editor; attempting to restore saved selection')
      const restored = this.restoreSelection()
      selection = window.getSelection()
      if (restored && selection && selection.rangeCount > 0 && this.contentElement.contains(selection.getRangeAt(0).commonAncestorContainer)) {
        range = selection.getRangeAt(0)
      }
      else {
        logger.warn('Saved selection unavailable; moving caret to end')
        this.contentElement.focus()
        const newRange = document.createRange()
        newRange.selectNodeContents(this.contentElement)
        newRange.collapse(false)
        selection!.removeAllRanges()
        selection!.addRange(newRange)
        range = newRange
      }
    }

    // 再次确保焦点在编辑器
    this.contentElement.focus()

    // 尝试使用 execCommand，如果失败或无效果则使用手动插入
    let success = false
    try {
      success = document.execCommand('insertHTML', false, html)
      logger.debug('execCommand("insertHTML") returned:', success)
    }
    catch (err) {
      logger.warn('execCommand threw error, will use manual insertion:', err)
      success = false
    }

    // 检测 execCommand 是否无效果（内容长度未变化）
    const afterLenCandidate = this.contentElement.innerHTML.length
    const noChange = afterLenCandidate === beforeLen
    if (!success || noChange) {
      if (success && noChange)
        logger.warn('execCommand reported success but content did not change, falling back to manual insertion')
      else
        logger.debug('Falling back to manual insertion')

      // 手动插入 HTML
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html

      // 删除选中的内容
      try {
        range.deleteContents()
      }
      catch (err) {
        logger.warn('deleteContents error:', err)
      }

      // 插入新内容
      const fragment = document.createDocumentFragment()
      while (tempDiv.firstChild)
        fragment.appendChild(tempDiv.firstChild)

      try {
        range.insertNode(fragment)
      }
      catch (err) {
        logger.error('insertNode error:', err)
      }

      // 移动光标到插入内容之后
      try {
        range.collapse(false)
        selection!.removeAllRanges()
        selection!.addRange(range)
      }
      catch (err) {
        logger.warn('Reselection error:', err)
      }
    }

    const afterLen = this.contentElement.innerHTML.length
    logger.debug('After length:', afterLen, 'Delta:', afterLen - beforeLen)

    // 简要诊断：统计媒体标签数量
    try {
      const snapshot = this.contentElement.innerHTML
      const imgCount = (snapshot.match(/<img\b/gi) || []).length
      const videoCount = (snapshot.match(/<video\b/gi) || []).length
      const audioCount = (snapshot.match(/<audio\b/gi) || []).length
      logger.debug('Media counts -> img:', imgCount, 'video:', videoCount, 'audio:', audioCount)
    }
    catch { }

    // 将插入位置滚动到可见区域
    try {
      const selNow = window.getSelection()
      const anchor = selNow?.anchorNode as (Node | null)
      let targetEl: HTMLElement | null = null
      if (anchor) {
        if ((anchor as any).nodeType === 3)
          targetEl = (anchor as any).parentElement || null
        else if ((anchor as any).nodeType === 1)
          targetEl = anchor as any as HTMLElement
        else
          targetEl = (anchor as any).parentElement || null
      }
      // 优先滚动选区附近的元素，其次滚动到底部
      if (targetEl && this.contentElement?.contains(targetEl))
        targetEl.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
      else if (this.contentElement)
        this.contentElement.scrollTop = this.contentElement.scrollHeight
    }
    catch (err) {
      logger.warn('scrollIntoView failed:', err)
    }

    // 触发更新事件
    this.handleInput()
  }

  /**
   * 清空内容
   */
  clear(): void {
    this.setHTML('<p></p>')
  }

  /**
   * 聚焦编辑器
   */
  focus(): void {
    this.contentElement?.focus()
  }

  /**
   * 失焦编辑器
   */
  blur(): void {
    this.contentElement?.blur()
  }

  /**
   * 设置是否可编辑
   */
  setEditable(editable: boolean): void {
    this.editable = editable
    if (this.contentElement)
      this.contentElement.contentEditable = String(editable)
  }

  /**
   * 检查是否可编辑
   */
  isEditable(): boolean {
    return this.editable
  }

  /**
   * 扩展 Schema
   */
  extendSchema(spec: SchemaSpec): void {
    // 合并节点
    if (spec.nodes) {
      Object.entries(spec.nodes).forEach(([name, nodeSpec]) => {
        this.schema.nodes.set(name, nodeSpec)
      })
    }

    // 合并标记
    if (spec.marks) {
      Object.entries(spec.marks).forEach(([name, markSpec]) => {
        this.schema.marks.set(name, markSpec)
      })
    }
  }

  /**
   * 事件系统
   */
  on(event: string, handler: (...args: any[]) => void): () => void {
    return this.eventEmitter.on(event, handler)
  }

  once(event: string, handler: (...args: any[]) => void): void {
    this.eventEmitter.once(event, handler)
  }

  off(event: string, handler: (...args: any[]) => void): void {
    this.eventEmitter.off(event, handler)
  }

  emit(event: string, ...args: any[]): void {
    this.eventEmitter.emit(event, ...args)
  }

  /**
   * 销毁编辑器
   */
  destroy(): void {
    if (this.destroyed)
      return

    // 清理插件
    this.plugins.clear()

    // 清理命令和快捷键
    this.commands.clear()
    this.keymap.clear()

    // 清理事件
    this.eventEmitter.clear()

    // 清理 DOM
    if (this.element)
      this.element.innerHTML = ''

    this.destroyed = true
  }

  /**
   * 检查是否已销毁
   */
  isDestroyed(): boolean {
    return this.destroyed
  }
}
