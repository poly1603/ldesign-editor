/**
 * 上下文菜单组件
 * 长按后显示的快捷操作菜单
 */

import { EventEmitter } from '../../core/EventEmitter'
import { createLogger } from '../../utils/logger'

const logger = createLogger('ContextMenu')

export interface ContextMenuItem {
  label: string
  icon?: string
  action?: () => void
  type?: 'normal' | 'separator'
  disabled?: boolean
  destructive?: boolean
}

export interface ContextMenuOptions {
  container: HTMLElement
  backgroundColor?: string
  textColor?: string
  borderRadius?: string
  maxWidth?: string
  zIndex?: number
}

export interface ShowOptions {
  x: number
  y: number
  items: ContextMenuItem[]
  selectedText?: string
}

export class ContextMenu extends EventEmitter {
  private container: HTMLElement
  private menuElement: HTMLElement
  private options: Required<ContextMenuOptions>
  private isVisible = false
  private currentItems: ContextMenuItem[] = []

  constructor(options: ContextMenuOptions) {
    super()
    this.container = options.container
    this.options = {
      backgroundColor: '#ffffff',
      textColor: '#333333',
      borderRadius: '8px',
      maxWidth: '280px',
      zIndex: 1001,
      ...options,
    }

    this.createMenu()
    this.setupEventListeners()
  }

  /**
   * 创建菜单DOM
   */
  private createMenu(): void {
    this.menuElement = document.createElement('div')
    this.menuElement.className = 'context-menu'
    this.menuElement.style.cssText = `
      position: fixed;
      background: ${this.options.backgroundColor};
      border-radius: ${this.options.borderRadius};
      box-shadow: 0 2px 16px rgba(0,0,0,0.2);
      padding: 8px 0;
      z-index: ${this.options.zIndex};
      max-width: ${this.options.maxWidth};
      min-width: 180px;
      opacity: 0;
      transform: scale(0.9);
      transition: opacity 0.2s, transform 0.2s;
      pointer-events: none;
      will-change: transform, opacity;
    `

    document.body.appendChild(this.menuElement)
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    // 点击其他地方关闭菜单
    document.addEventListener('click', (e) => {
      if (!this.menuElement.contains(e.target as Node))
        this.hide()
    })

    // 滚动时关闭菜单
    window.addEventListener('scroll', () => {
      if (this.isVisible)
        this.hide()
    }, { passive: true })

    // 触摸开始关闭菜单
    document.addEventListener('touchstart', (e) => {
      if (!this.menuElement.contains(e.target as Node))
        this.hide()
    })
  }

  /**
   * 显示菜单
   */
  show(options: ShowOptions): void {
    logger.info('Showing context menu', options)

    this.currentItems = options.items
    this.renderItems(options.items)

    // 设置位置
    const { x, y } = this.adjustPosition(options.x, options.y)
    this.menuElement.style.left = `${x}px`
    this.menuElement.style.top = `${y}px`

    // 显示动画
    this.menuElement.style.pointerEvents = 'auto'
    requestAnimationFrame(() => {
      this.menuElement.classList.add('visible')
      this.menuElement.style.opacity = '1'
      this.menuElement.style.transform = 'scale(1)'
    })

    this.isVisible = true
    this.emit('show')
  }

  /**
   * 隐藏菜单
   */
  hide(): void {
    if (!this.isVisible)
      return

    this.menuElement.classList.remove('visible')
    this.menuElement.style.opacity = '0'
    this.menuElement.style.transform = 'scale(0.9)'
    this.menuElement.style.pointerEvents = 'none'

    setTimeout(() => {
      this.menuElement.innerHTML = ''
    }, 200)

    this.isVisible = false
    this.emit('hide')
    logger.info('Context menu hidden')
  }

  /**
   * 渲染菜单项
   */
  private renderItems(items: ContextMenuItem[]): void {
    this.menuElement.innerHTML = ''

    items.forEach((item, index) => {
      if (item.type === 'separator')
        this.menuElement.appendChild(this.createSeparator())
      else
        this.menuElement.appendChild(this.createMenuItem(item, index))
    })
  }

  /**
   * 创建菜单项
   */
  private createMenuItem(item: ContextMenuItem, index: number): HTMLElement {
    const menuItem = document.createElement('div')
    menuItem.className = 'context-menu-item'
    menuItem.style.cssText = `
      display: flex;
      align-items: center;
      padding: 12px 16px;
      color: ${item.disabled ? '#999' : (item.destructive ? '#ff4444' : this.options.textColor)};
      cursor: ${item.disabled ? 'not-allowed' : 'pointer'};
      transition: background-color 0.15s;
      font-size: 15px;
      line-height: 1.4;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    `

    if (!item.disabled) {
      // 悬停效果
      menuItem.addEventListener('mouseenter', () => {
        menuItem.style.backgroundColor = '#f5f5f5'
      })

      menuItem.addEventListener('mouseleave', () => {
        menuItem.style.backgroundColor = 'transparent'
      })

      // 点击效果
      menuItem.addEventListener('touchstart', () => {
        menuItem.style.backgroundColor = '#e0e0e0'
      })

      menuItem.addEventListener('touchend', () => {
        menuItem.style.backgroundColor = 'transparent'
      })

      // 点击处理
      menuItem.addEventListener('click', (e) => {
        e.stopPropagation()

        // 点击动画
        this.animateItemClick(menuItem)

        // 延迟执行动作，让动画完成
        setTimeout(() => {
          if (item.action)
            item.action()

          this.emit('itemclick', item, index)
          this.hide()
        }, 150)
      })
    }

    // 图标
    if (item.icon) {
      const icon = document.createElement('span')
      icon.className = 'context-menu-item-icon'
      icon.style.cssText = `
        margin-right: 12px;
        font-size: 18px;
        width: 24px;
        text-align: center;
        flex-shrink: 0;
      `
      icon.textContent = item.icon
      menuItem.appendChild(icon)
    }

    // 标签
    const label = document.createElement('span')
    label.className = 'context-menu-item-label'
    label.style.cssText = `
      flex: 1;
    `
    label.textContent = item.label
    menuItem.appendChild(label)

    // 快捷键提示（如果有）
    if ((item as any).shortcut) {
      const shortcut = document.createElement('span')
      shortcut.className = 'context-menu-item-shortcut'
      shortcut.style.cssText = `
        margin-left: 20px;
        color: #999;
        font-size: 13px;
      `
      shortcut.textContent = (item as any).shortcut
      menuItem.appendChild(shortcut)
    }

    return menuItem
  }

  /**
   * 创建分隔线
   */
  private createSeparator(): HTMLElement {
    const separator = document.createElement('div')
    separator.className = 'context-menu-separator'
    separator.style.cssText = `
      height: 1px;
      background: #e0e0e0;
      margin: 4px 0;
    `
    return separator
  }

  /**
   * 调整位置以确保菜单在屏幕内
   */
  private adjustPosition(x: number, y: number): { x: number, y: number } {
    // 临时显示以获取尺寸
    this.menuElement.style.visibility = 'hidden'
    this.menuElement.style.display = 'block'

    const menuRect = this.menuElement.getBoundingClientRect()
    const menuWidth = menuRect.width
    const menuHeight = menuRect.height

    this.menuElement.style.visibility = ''
    this.menuElement.style.display = ''

    const padding = 10
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // 调整X坐标
    let adjustedX = x
    if (x + menuWidth + padding > viewportWidth) {
      adjustedX = x - menuWidth
      if (adjustedX < padding)
        adjustedX = viewportWidth - menuWidth - padding
    }
    if (adjustedX < padding)
      adjustedX = padding

    // 调整Y坐标
    let adjustedY = y
    if (y + menuHeight + padding > viewportHeight) {
      adjustedY = y - menuHeight
      if (adjustedY < padding)
        adjustedY = viewportHeight - menuHeight - padding
    }
    if (adjustedY < padding)
      adjustedY = padding

    return { x: adjustedX, y: adjustedY }
  }

  /**
   * 菜单项点击动画
   */
  private animateItemClick(element: HTMLElement): void {
    // 创建涟漪效果
    const ripple = document.createElement('div')
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.1);
      transform: scale(0);
      animation: ripple 0.4s ease-out;
      pointer-events: none;
    `

    // 设置涟漪位置
    const rect = element.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${rect.width / 2 - size / 2}px`
    ripple.style.top = `${rect.height / 2 - size / 2}px`

    element.style.position = 'relative'
    element.appendChild(ripple)

    // 添加动画样式
    const style = document.createElement('style')
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)

    // 清理
    setTimeout(() => {
      ripple.remove()
      style.remove()
    }, 400)
  }

  /**
   * 更新菜单项
   */
  updateItems(items: ContextMenuItem[]): void {
    if (this.isVisible) {
      this.currentItems = items
      this.renderItems(items)
    }
  }

  /**
   * 设置菜单项启用/禁用状态
   */
  setItemEnabled(index: number, enabled: boolean): void {
    if (index >= 0 && index < this.currentItems.length) {
      this.currentItems[index].disabled = !enabled
      if (this.isVisible)
        this.renderItems(this.currentItems)
    }
  }

  /**
   * 获取当前显示状态
   */
  getVisible(): boolean {
    return this.isVisible
  }

  /**
   * 销毁菜单
   */
  destroy(): void {
    this.hide()
    this.menuElement.remove()
    this.removeAllListeners()
  }
}
