/**
 * 可视化调试面板
 * 提供实时性能监控、内存分析、插件调试等功能
 */

import type { Editor } from '../core/Editor'
import { EventEmitter } from '../core/EventEmitter'
import { createLogger } from '../utils/logger'
import { getPerformanceMonitor } from '../utils/PerformanceMonitor'
import { ConfigTab } from './tabs/ConfigTab'
import { ConsoleTab } from './tabs/ConsoleTab'
import { DOMInspector } from './tabs/DOMInspector'
import { HistoryTab } from './tabs/HistoryTab'
import { MemoryTab } from './tabs/MemoryTab'
import { NetworkTab } from './tabs/NetworkTab'
import { PerformanceTab } from './tabs/PerformanceTab'
import { PluginsTab } from './tabs/PluginsTab'

const logger = createLogger('DebugPanel')

export interface DebugPanelOptions {
  /** 编辑器实例 */
  editor: Editor
  /** 是否默认展开 */
  expanded?: boolean
  /** 初始标签页 */
  initialTab?: TabName
  /** 主题 */
  theme?: 'light' | 'dark' | 'auto'
  /** 位置 */
  position?: 'bottom' | 'right' | 'floating'
  /** 高度/宽度（像素或百分比） */
  size?: string
  /** 是否可调整大小 */
  resizable?: boolean
  /** 是否显示在生产环境 */
  showInProduction?: boolean
}

export type TabName = 'performance' | 'memory' | 'network' | 'plugins' | 'console' | 'dom' | 'history' | 'config'

export interface TabDefinition {
  name: TabName
  label: string
  icon: string
  component: any
  badge?: string | number
}

export class DebugPanel extends EventEmitter {
  private editor: Editor
  private options: Required<DebugPanelOptions>
  private container?: HTMLElement
  private panel?: HTMLElement
  private tabsContainer?: HTMLElement
  private contentContainer?: HTMLElement
  private tabs = new Map<TabName, any>()
  private activeTab?: TabName
  private isExpanded: boolean
  private isDragging = false
  private performanceMonitor = getPerformanceMonitor()

  /** 标签页定义 */
  private tabDefinitions: TabDefinition[] = [
    {
      name: 'performance',
      label: '性能',
      icon: '📊',
      component: PerformanceTab,
    },
    {
      name: 'memory',
      label: '内存',
      icon: '💾',
      component: MemoryTab,
    },
    {
      name: 'network',
      label: '网络',
      icon: '🌐',
      component: NetworkTab,
      badge: 0,
    },
    {
      name: 'plugins',
      label: '插件',
      icon: '🔌',
      component: PluginsTab,
    },
    {
      name: 'console',
      label: '控制台',
      icon: '💻',
      component: ConsoleTab,
      badge: 0,
    },
    {
      name: 'dom',
      label: 'DOM',
      icon: '🌳',
      component: DOMInspector,
    },
    {
      name: 'history',
      label: '历史',
      icon: '📜',
      component: HistoryTab,
    },
    {
      name: 'config',
      label: '配置',
      icon: '⚙️',
      component: ConfigTab,
    },
  ]

  constructor(options: DebugPanelOptions) {
    super()
    this.editor = options.editor
    this.options = {
      expanded: false,
      initialTab: 'performance',
      theme: 'auto',
      position: 'bottom',
      size: '300px',
      resizable: true,
      showInProduction: false,
      ...options,
    }

    this.isExpanded = this.options.expanded

    // 检查是否应该显示
    if (process.env.NODE_ENV === 'production' && !this.options.showInProduction) {
      logger.info('Debug panel disabled in production')
      return
    }

    this.initialize()
  }

  /**
   * 初始化调试面板
   */
  private initialize(): void {
    logger.info('Initializing debug panel')

    // 创建容器
    this.createContainer()

    // 初始化标签页
    this.initializeTabs()

    // 设置事件监听
    this.setupEventListeners()

    // 设置快捷键
    this.setupHotkeys()

    // 激活初始标签页
    this.switchTab(this.options.initialTab)

    // 开始监控
    this.startMonitoring()

    logger.info('Debug panel initialized')
  }

  /**
   * 创建容器DOM
   */
  private createContainer(): void {
    // 创建主容器
    this.container = document.createElement('div')
    this.container.className = 'ldesign-debug-container'
    this.container.style.cssText = this.getContainerStyles()

    // 创建面板
    this.panel = document.createElement('div')
    this.panel.className = 'ldesign-debug-panel'
    this.panel.style.cssText = this.getPanelStyles()

    // 创建头部
    const header = this.createHeader()

    // 创建标签栏
    this.tabsContainer = document.createElement('div')
    this.tabsContainer.className = 'ldesign-debug-tabs'
    this.tabsContainer.style.cssText = this.getTabsStyles()

    // 创建内容区
    this.contentContainer = document.createElement('div')
    this.contentContainer.className = 'ldesign-debug-content'
    this.contentContainer.style.cssText = this.getContentStyles()

    // 组装
    this.panel.appendChild(header)
    this.panel.appendChild(this.tabsContainer)
    this.panel.appendChild(this.contentContainer)
    this.container.appendChild(this.panel)

    // 渲染标签页按钮
    this.renderTabs()

    // 添加到DOM
    document.body.appendChild(this.container)

    // 应用主题
    this.applyTheme()

    // 设置展开状态
    if (this.isExpanded)
      this.expand()
    else
      this.collapse()
  }

  /**
   * 创建头部
   */
  private createHeader(): HTMLElement {
    const header = document.createElement('div')
    header.className = 'ldesign-debug-header'
    header.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 14px;
      font-weight: 600;
      user-select: none;
      cursor: move;
    `

    // 标题
    const title = document.createElement('div')
    title.style.display = 'flex'
    title.style.alignItems = 'center'
    title.style.gap = '8px'
    title.innerHTML = `
      <span style="font-size: 18px;">🔧</span>
      <span>LDesign Editor DevTools</span>
      <span style="
        background: rgba(255, 255, 255, 0.2);
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 11px;
      ">v${this.editor.version || '1.0.0'}</span>
    `

    // 控制按钮
    const controls = document.createElement('div')
    controls.style.display = 'flex'
    controls.style.gap = '8px'

    // 最小化/展开按钮
    const toggleBtn = document.createElement('button')
    toggleBtn.className = 'debug-toggle-btn'
    toggleBtn.style.cssText = `
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 16px;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;
    `
    toggleBtn.innerHTML = this.isExpanded ? '➖' : '➕'
    toggleBtn.onclick = () => this.toggle()
    toggleBtn.onmouseenter = () => {
      toggleBtn.style.background = 'rgba(255, 255, 255, 0.2)'
    }
    toggleBtn.onmouseleave = () => {
      toggleBtn.style.background = 'transparent'
    }

    // 关闭按钮
    const closeBtn = document.createElement('button')
    closeBtn.className = 'debug-close-btn'
    closeBtn.style.cssText = toggleBtn.style.cssText
    closeBtn.innerHTML = '✖'
    closeBtn.onclick = () => this.close()
    closeBtn.onmouseenter = () => {
      closeBtn.style.background = 'rgba(255, 255, 255, 0.2)'
    }
    closeBtn.onmouseleave = () => {
      closeBtn.style.background = 'transparent'
    }

    controls.appendChild(toggleBtn)
    controls.appendChild(closeBtn)

    header.appendChild(title)
    header.appendChild(controls)

    // 拖动功能
    this.makeHeaderDraggable(header)

    return header
  }

  /**
   * 渲染标签页按钮
   */
  private renderTabs(): void {
    if (!this.tabsContainer)
      return

    this.tabsContainer.innerHTML = ''

    this.tabDefinitions.forEach((tab) => {
      const button = document.createElement('button')
      button.className = 'debug-tab-btn'
      button.dataset.tab = tab.name
      button.style.cssText = `
        padding: 8px 16px;
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        color: #666;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
        position: relative;
        display: flex;
        align-items: center;
        gap: 6px;
      `

      // 图标和标签
      button.innerHTML = `
        <span style="font-size: 16px;">${tab.icon}</span>
        <span>${tab.label}</span>
        ${tab.badge
          ? `
          <span style="
            position: absolute;
            top: 4px;
            right: 4px;
            background: #ff4444;
            color: white;
            font-size: 10px;
            padding: 2px 4px;
            border-radius: 8px;
            min-width: 16px;
            text-align: center;
          ">${tab.badge}</span>
        `
          : ''}
      `

      button.onclick = () => this.switchTab(tab.name)

      button.onmouseenter = () => {
        if (button.dataset.tab !== this.activeTab)
          button.style.background = '#f5f5f5'
      }

      button.onmouseleave = () => {
        if (button.dataset.tab !== this.activeTab)
          button.style.background = 'transparent'
      }

      this.tabsContainer.appendChild(button)
    })
  }

  /**
   * 初始化标签页
   */
  private initializeTabs(): void {
    this.tabDefinitions.forEach((tab) => {
      const TabClass = tab.component
      const instance = new TabClass({
        editor: this.editor,
        debugPanel: this,
      })
      this.tabs.set(tab.name, instance)
    })
  }

  /**
   * 切换标签页
   */
  switchTab(name: TabName): void {
    if (this.activeTab === name)
      return

    logger.debug(`Switching to tab: ${name}`)

    // 停用当前标签页
    if (this.activeTab) {
      const currentTab = this.tabs.get(this.activeTab)
      currentTab?.deactivate()

      const currentBtn = this.tabsContainer?.querySelector(`[data-tab="${this.activeTab}"]`)
      if (currentBtn) {
        currentBtn.style.background = 'transparent'
        currentBtn.style.color = '#666'
        currentBtn.style.borderBottomColor = 'transparent'
      }
    }

    // 激活新标签页
    this.activeTab = name
    const newTab = this.tabs.get(name)

    if (newTab && this.contentContainer) {
      // 清空内容区
      this.contentContainer.innerHTML = ''

      // 渲染新标签页
      const content = newTab.render()
      this.contentContainer.appendChild(content)

      // 激活标签页
      newTab.activate()

      // 更新按钮样式
      const newBtn = this.tabsContainer?.querySelector(`[data-tab="${name}"]`)
      if (newBtn) {
        newBtn.style.background = '#f8f9fa'
        newBtn.style.color = '#667eea'
        newBtn.style.borderBottomColor = '#667eea'
      }
    }

    this.emit('tabchange', name)
  }

  /**
   * 设置事件监听
   */
  private setupEventListeners(): void {
    // 监听编辑器事件
    this.editor.on('error', (error: Error) => {
      this.logError(error)
      this.updateBadge('console', 1)
    })

    this.editor.on('warning', (warning: string) => {
      this.logWarning(warning)
    })

    // 监听网络请求
    this.interceptNetworkRequests()

    // 监听插件事件
    this.editor.plugins?.on('plugin-loaded', (name: string) => {
      this.logInfo(`Plugin loaded: ${name}`)
    })

    // 监听性能事件
    this.performanceMonitor.on('measure', (measure: any) => {
      const perfTab = this.tabs.get('performance')
      perfTab?.addMeasure(measure)
    })
  }

  /**
   * 设置快捷键
   */
  private setupHotkeys(): void {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Shift + D 切换调试面板
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        this.toggle()
      }

      // Ctrl/Cmd + Shift + P 切换到性能标签
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        this.switchTab('performance')
        this.expand()
      }

      // ESC 关闭面板
      if (e.key === 'Escape' && this.isExpanded)
        this.collapse()
    })
  }

  /**
   * 开始监控
   */
  private startMonitoring(): void {
    // 性能监控
    setInterval(() => {
      const perfTab = this.tabs.get('performance')
      perfTab?.update()
    }, 1000)

    // 内存监控
    setInterval(() => {
      const memTab = this.tabs.get('memory')
      memTab?.update()
    }, 2000)

    // FPS监控
    let lastTime = performance.now()
    let frames = 0

    const measureFPS = () => {
      frames++
      const currentTime = performance.now()

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime))
        const perfTab = this.tabs.get('performance')
        perfTab?.updateFPS(fps)

        frames = 0
        lastTime = currentTime
      }

      requestAnimationFrame(measureFPS)
    }

    requestAnimationFrame(measureFPS)
  }

  /**
   * 拦截网络请求
   */
  private interceptNetworkRequests(): void {
    // 拦截 fetch
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const startTime = performance.now()
      const [url, options] = args

      const networkTab = this.tabs.get('network')
      const requestId = networkTab?.startRequest({
        url: typeof url === 'string' ? url : url.toString(),
        method: options?.method || 'GET',
        headers: options?.headers,
      })

      try {
        const response = await originalFetch.apply(window, args)
        const duration = performance.now() - startTime

        networkTab?.completeRequest(requestId, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          duration,
        })

        this.updateBadge('network', 1)

        return response
      }
      catch (error) {
        const duration = performance.now() - startTime

        networkTab?.failRequest(requestId, {
          error: error.message,
          duration,
        })

        throw error
      }
    }

    // 拦截 XMLHttpRequest
    const originalXHR = window.XMLHttpRequest.prototype.open
    window.XMLHttpRequest.prototype.open = function (...args) {
      const [method, url] = args
      const networkTab = this.tabs?.get('network')

      const requestId = networkTab?.startRequest({
        url: url.toString(),
        method: method.toString(),
      })

      this.addEventListener('load', function () {
        networkTab?.completeRequest(requestId, {
          status: this.status,
          statusText: this.statusText,
        })
      })

      this.addEventListener('error', () => {
        networkTab?.failRequest(requestId, {
          error: 'Network error',
        })
      })

      return originalXHR.apply(this, args)
    }
  }

  /**
   * 日志方法
   */
  logError(error: Error | string): void {
    const consoleTab = this.tabs.get('console')
    consoleTab?.log('error', error)
  }

  logWarning(message: string): void {
    const consoleTab = this.tabs.get('console')
    consoleTab?.log('warn', message)
  }

  logInfo(message: string): void {
    const consoleTab = this.tabs.get('console')
    consoleTab?.log('info', message)
  }

  logDebug(message: string): void {
    const consoleTab = this.tabs.get('console')
    consoleTab?.log('debug', message)
  }

  /**
   * 更新标签页徽章
   */
  updateBadge(tab: TabName, increment: number = 0): void {
    const tabDef = this.tabDefinitions.find(t => t.name === tab)
    if (tabDef) {
      if (typeof tabDef.badge === 'number')
        tabDef.badge += increment
      else
        tabDef.badge = increment

      // 重新渲染标签页按钮
      this.renderTabs()

      // 恢复当前激活状态
      if (this.activeTab) {
        const activeBtn = this.tabsContainer?.querySelector(`[data-tab="${this.activeTab}"]`)
        if (activeBtn) {
          activeBtn.style.background = '#f8f9fa'
          activeBtn.style.color = '#667eea'
          activeBtn.style.borderBottomColor = '#667eea'
        }
      }
    }
  }

  /**
   * 使头部可拖动（浮动模式）
   */
  private makeHeaderDraggable(header: HTMLElement): void {
    if (this.options.position !== 'floating')
      return

    let isDragging = false
    let startX = 0
    let startY = 0
    let initialX = 0
    let initialY = 0

    header.addEventListener('mousedown', (e) => {
      if (e.target !== header && !header.contains(e.target as Node))
        return

      isDragging = true
      startX = e.clientX
      startY = e.clientY

      const rect = this.container!.getBoundingClientRect()
      initialX = rect.left
      initialY = rect.top

      header.style.cursor = 'grabbing'
      e.preventDefault()
    })

    document.addEventListener('mousemove', (e) => {
      if (!isDragging)
        return

      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      this.container!.style.left = `${initialX + deltaX}px`
      this.container!.style.top = `${initialY + deltaY}px`
    })

    document.addEventListener('mouseup', () => {
      isDragging = false
      header.style.cursor = 'move'
    })
  }

  /**
   * 切换展开/折叠
   */
  toggle(): void {
    if (this.isExpanded)
      this.collapse()
    else
      this.expand()
  }

  /**
   * 展开面板
   */
  expand(): void {
    if (!this.panel)
      return

    this.isExpanded = true
    this.panel.style.height = this.options.size

    const toggleBtn = this.panel.querySelector('.debug-toggle-btn')
    if (toggleBtn)
      toggleBtn.innerHTML = '➖'

    this.emit('expand')
    logger.debug('Debug panel expanded')
  }

  /**
   * 折叠面板
   */
  collapse(): void {
    if (!this.panel)
      return

    this.isExpanded = false
    this.panel.style.height = '40px'

    const toggleBtn = this.panel.querySelector('.debug-toggle-btn')
    if (toggleBtn)
      toggleBtn.innerHTML = '➕'

    this.emit('collapse')
    logger.debug('Debug panel collapsed')
  }

  /**
   * 关闭面板
   */
  close(): void {
    this.container?.remove()
    this.emit('close')
    logger.info('Debug panel closed')
  }

  /**
   * 应用主题
   */
  private applyTheme(): void {
    const theme = this.options.theme === 'auto'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : this.options.theme

    this.container?.setAttribute('data-theme', theme)
  }

  /**
   * 获取容器样式
   */
  private getContainerStyles(): string {
    const styles = {
      bottom: `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10000;
      `,
      right: `
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: ${this.options.size};
        z-index: 10000;
      `,
      floating: `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 800px;
        z-index: 10000;
      `,
    }

    return styles[this.options.position]
  }

  /**
   * 获取面板样式
   */
  private getPanelStyles(): string {
    return `
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px 8px 0 0;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      height: ${this.isExpanded ? this.options.size : '40px'};
      overflow: hidden;
      transition: height 0.3s ease-out;
    `
  }

  /**
   * 获取标签栏样式
   */
  private getTabsStyles(): string {
    return `
      display: flex;
      background: #fafafa;
      border-bottom: 1px solid #e0e0e0;
      overflow-x: auto;
      scrollbar-width: thin;
    `
  }

  /**
   * 获取内容区样式
   */
  private getContentStyles(): string {
    return `
      flex: 1;
      overflow: auto;
      padding: 0;
    `
  }

  /**
   * 销毁面板
   */
  destroy(): void {
    this.close()

    // 清理所有标签页
    this.tabs.forEach(tab => tab.destroy?.())
    this.tabs.clear()

    this.removeAllListeners()
    logger.info('Debug panel destroyed')
  }
}
