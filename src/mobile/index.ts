/**
 * 移动端优化
 * 提供移动设备的优化支持
 * 
 * 功能:
 * - 触摸手势支持
 * - 虚拟键盘适配
 * - 移动端工具栏
 * - 响应式布局
 * - 性能优化
 * 
 * @packageDocumentation
 */

import { createPlugin } from '../core/Plugin'
import type { EditorInstance } from '../types'
import { createLogger } from '../utils/logger'

const logger = createLogger('Mobile')

/**
 * 移动端配置
 */
export interface MobileConfig {
  /** 是否启用触摸手势 */
  enableGestures?: boolean
  /** 是否使用移动端工具栏 */
  useMobileToolbar?: boolean
  /** 是否自动适配虚拟键盘 */
  adaptKeyboard?: boolean
  /** 最小触摸目标大小（px） */
  minTouchTarget?: number
}

/**
 * 手势类型
 */
export type GestureType = 'tap' | 'double-tap' | 'long-press' | 'swipe' | 'pinch'

/**
 * 手势事件
 */
export interface GestureEvent {
  type: GestureType
  target: HTMLElement
  x: number
  y: number
  deltaX?: number
  deltaY?: number
  scale?: number
}

/**
 * 移动端管理器
 */
export class MobileManager {
  private editor: EditorInstance
  private config: Required<MobileConfig>
  private isMobile: boolean
  private keyboardHeight: number = 0
  private originalViewportHeight: number = 0

  constructor(editor: EditorInstance, config: MobileConfig = {}) {
    this.editor = editor
    this.config = {
      enableGestures: true,
      useMobileToolbar: true,
      adaptKeyboard: true,
      minTouchTarget: 44,
      ...config
    }

    this.isMobile = this.detectMobile()
  }

  /**
   * 检测是否为移动设备
   */
  private detectMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  /**
   * 初始化
   */
  init(): void {
    if (!this.isMobile) {
      logger.info('Not a mobile device, skipping mobile optimizations')
      return
    }

    logger.info('Initializing mobile optimizations')

    // 设置视口
    this.setupViewport()

    // 触摸手势
    if (this.config.enableGestures) {
      this.setupGestures()
    }

    // 虚拟键盘适配
    if (this.config.adaptKeyboard) {
      this.setupKeyboardAdaptation()
    }

    // 移动端工具栏
    if (this.config.useMobileToolbar) {
      this.setupMobileToolbar()
    }

    // 触摸目标优化
    this.optimizeTouchTargets()
  }

  /**
   * 设置视口
   */
  private setupViewport(): void {
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement

    if (!viewport) {
      viewport = document.createElement('meta')
      viewport.name = 'viewport'
      document.head.appendChild(viewport)
    }

    viewport.content = 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes'
  }

  /**
   * 设置手势支持
   */
  private setupGestures(): void {
    if (!this.editor.contentElement) return

    const el = this.editor.contentElement

    // 双击放大
    let lastTap = 0
    el.addEventListener('touchend', (e) => {
      const now = Date.now()
      const timeSince = now - lastTap

      if (timeSince < 300 && timeSince > 0) {
        // 双击事件
        this.handleGesture({
          type: 'double-tap',
          target: e.target as HTMLElement,
          x: 0,
          y: 0
        })
      }

      lastTap = now
    })

    // 长按事件
    let pressTimer: number | null = null
    el.addEventListener('touchstart', (e) => {
      pressTimer = window.setTimeout(() => {
        this.handleGesture({
          type: 'long-press',
          target: e.target as HTMLElement,
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        })
      }, 500)
    })

    el.addEventListener('touchend', () => {
      if (pressTimer) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    })

    el.addEventListener('touchmove', () => {
      if (pressTimer) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    })
  }

  /**
   * 处理手势
   */
  private handleGesture(gesture: GestureEvent): void {
    logger.debug('Gesture detected:', gesture.type)

    switch (gesture.type) {
      case 'double-tap':
        // 双击选中单词
        document.execCommand('selectWord')
        break
      case 'long-press':
        // 长按显示上下文菜单
        if (this.editor.emit) {
          this.editor.emit('contextmenu', gesture)
        }
        break
    }
  }

  /**
   * 设置虚拟键盘适配
   */
  private setupKeyboardAdaptation(): void {
    this.originalViewportHeight = window.innerHeight

    // 监听视口变化（键盘弹出）
    window.visualViewport?.addEventListener('resize', () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight
      this.keyboardHeight = this.originalViewportHeight - currentHeight

      if (this.keyboardHeight > 100) {
        // 键盘已弹出
        this.handleKeyboardShow()
      } else {
        // 键盘已隐藏
        this.handleKeyboardHide()
      }
    })
  }

  /**
   * 处理键盘显示
   */
  private handleKeyboardShow(): void {
    logger.debug('Keyboard shown, height:', this.keyboardHeight)

    if (this.editor.contentElement) {
      // 调整编辑器高度
      this.editor.contentElement.style.paddingBottom = `${this.keyboardHeight}px`

      // 滚动到光标位置
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()

        if (rect.bottom > window.innerHeight - this.keyboardHeight) {
          window.scrollBy(0, rect.bottom - (window.innerHeight - this.keyboardHeight) + 20)
        }
      }
    }
  }

  /**
   * 处理键盘隐藏
   */
  private handleKeyboardHide(): void {
    logger.debug('Keyboard hidden')

    if (this.editor.contentElement) {
      this.editor.contentElement.style.paddingBottom = '0'
    }
  }

  /**
   * 设置移动端工具栏
   */
  private setupMobileToolbar(): void {
    const toolbar = document.querySelector('.ldesign-toolbar')
    if (!toolbar) return

    // 添加移动端样式
    toolbar.classList.add('mobile-toolbar')

    // 添加移动端特定CSS
    const style = document.createElement('style')
    style.textContent = `
      .mobile-toolbar {
        position: sticky;
        top: 0;
        z-index: 100;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      .mobile-toolbar button {
        min-width: 44px;
        min-height: 44px;
        font-size: 18px;
      }
      
      .mobile-toolbar .ldesign-editor-toolbar-separator {
        margin: 0 4px;
      }
    `
    document.head.appendChild(style)
  }

  /**
   * 优化触摸目标大小
   */
  private optimizeTouchTargets(): void {
    const minSize = this.config.minTouchTarget

    // 检查所有按钮
    const buttons = document.querySelectorAll('.ldesign-toolbar button')
    buttons.forEach(button => {
      if (button instanceof HTMLElement) {
        const rect = button.getBoundingClientRect()

        if (rect.width < minSize || rect.height < minSize) {
          button.style.minWidth = `${minSize}px`
          button.style.minHeight = `${minSize}px`
        }
      }
    })
  }

  /**
   * 启用轻量模式（禁用某些功能以提升性能）
   */
  enableLightweightMode(): void {
    logger.info('Enabling lightweight mode for mobile')

    // 禁用动画
    document.documentElement.classList.add('no-animations')

    // 禁用一些高级功能
    // TODO: 实现功能禁用逻辑
  }

  /**
   * 检测设备类型
   * @returns 设备类型信息
   */
  getDeviceInfo(): {
    isMobile: boolean
    isTablet: boolean
    isPhone: boolean
    os: string
    screenSize: { width: number; height: number }
  } {
    const ua = navigator.userAgent
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua)
    const isPhone = /iPhone|Android.*Mobile/i.test(ua)

    let os = 'unknown'
    if (/Android/i.test(ua)) os = 'android'
    else if (/iPhone|iPad|iPod/i.test(ua)) os = 'ios'

    return {
      isMobile: this.isMobile,
      isTablet,
      isPhone,
      os,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height
      }
    }
  }

  /**
   * 清理资源
   */
  destroy(): void {
    if (this.editor.contentElement) {
      this.editor.contentElement.style.paddingBottom = '0'
    }

    const toolbar = document.querySelector('.ldesign-toolbar')
    if (toolbar) {
      toolbar.classList.remove('mobile-toolbar')
    }
  }
}

/**
 * 创建移动端插件
 */
export function createMobilePlugin(config: MobileConfig = {}) {
  let manager: MobileManager | null = null

  return createPlugin({
    name: 'mobile',

    commands: {
      // 启用轻量模式
      'mobile:lightweight': (state, dispatch, editor) => {
        if (manager) {
          manager.enableLightweightMode()
          return true
        }
        return false
      }
    },

    init(editor: EditorInstance) {
      manager = new MobileManager(editor, config)

        // 暴露到编辑器
        ; (editor as any).mobile = manager

      // 初始化
      manager.init()

      logger.info('Mobile optimization initialized')
    },

    destroy() {
      if (manager) {
        manager.destroy()
        manager = null
      }
    }
  })
}

/**
 * 默认导出
 */
export const MobilePlugin = createMobilePlugin()

/**
 * 获取移动端管理器
 * @param editor - 编辑器实例
 * @returns 移动端管理器
 */
export function getMobileManager(editor: EditorInstance): MobileManager | null {
  return (editor as any).mobile || null
}


