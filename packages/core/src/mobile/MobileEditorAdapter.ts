/**
 * 移动端编辑器适配器
 * 为编辑器添加移动端特定功能和优化
 */

import type { Editor } from '../core/Editor'
import type { GestureEvent } from './gestures/GestureRecognizer'
import { debounce } from '../utils/helpers'
import { createLogger } from '../utils/logger'
import { ContextMenu } from './components/ContextMenu'
import { MobileToolbar } from './components/MobileToolbar'
import { SwipeMenu } from './components/SwipeMenu'
import { GestureRecognizer } from './gestures/GestureRecognizer'

const logger = createLogger('MobileEditorAdapter')

export interface MobileEditorOptions {
  /** 是否启用手势 */
  enableGestures?: boolean
  /** 是否启用滑动菜单 */
  enableSwipeMenu?: boolean
  /** 是否启用长按菜单 */
  enableContextMenu?: boolean
  /** 是否启用移动端工具栏 */
  enableMobileToolbar?: boolean
  /** 最小缩放比例 */
  minZoom?: number
  /** 最大缩放比例 */
  maxZoom?: number
  /** 初始缩放比例 */
  initialZoom?: number
  /** 是否启用惯性滚动 */
  enableMomentum?: boolean
  /** 是否启用橡皮筋效果 */
  enableBounce?: boolean
}

export class MobileEditorAdapter {
  private editor: Editor
  private options: Required<MobileEditorOptions>
  private gestureRecognizer?: GestureRecognizer
  private swipeMenu?: SwipeMenu
  private contextMenu?: ContextMenu
  private mobileToolbar?: MobileToolbar

  private currentZoom = 1
  private currentPanX = 0
  private currentPanY = 0
  private isPinching = false
  private isPanning = false

  private editorContainer: HTMLElement
  private contentWrapper: HTMLElement
  private viewportMeta?: HTMLMetaElement

  constructor(editor: Editor, options: MobileEditorOptions = {}) {
    this.editor = editor
    this.options = {
      enableGestures: true,
      enableSwipeMenu: true,
      enableContextMenu: true,
      enableMobileToolbar: true,
      minZoom: 0.5,
      maxZoom: 3,
      initialZoom: 1,
      enableMomentum: true,
      enableBounce: true,
      ...options,
    }

    this.editorContainer = editor.getElement()
    this.contentWrapper = this.createContentWrapper()

    this.initialize()
  }

  /**
   * 初始化移动端适配
   */
  private initialize(): void {
    logger.info('Initializing mobile editor adapter')

    // 设置viewport
    this.setupViewport()

    // 添加移动端样式
    this.applyMobileStyles()

    // 初始化手势识别
    if (this.options.enableGestures)
      this.initializeGestures()

    // 初始化滑动菜单
    if (this.options.enableSwipeMenu)
      this.initializeSwipeMenu()

    // 初始化长按菜单
    if (this.options.enableContextMenu)
      this.initializeContextMenu()

    // 初始化移动端工具栏
    if (this.options.enableMobileToolbar)
      this.initializeMobileToolbar()

    // 监听屏幕方向变化
    this.setupOrientationListener()

    // 监听键盘事件
    this.setupKeyboardListener()
  }

  /**
   * 创建内容包装器
   */
  private createContentWrapper(): HTMLElement {
    const wrapper = document.createElement('div')
    wrapper.className = 'mobile-content-wrapper'
    wrapper.style.cssText = `
      width: 100%;
      height: 100%;
      transform-origin: 0 0;
      transition: transform 0.2s ease-out;
      will-change: transform;
    `

    // 将编辑器内容移动到包装器中
    while (this.editorContainer.firstChild)
      wrapper.appendChild(this.editorContainer.firstChild)

    this.editorContainer.appendChild(wrapper)

    return wrapper
  }

  /**
   * 设置viewport
   */
  private setupViewport(): void {
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement

    if (!viewport) {
      viewport = document.createElement('meta')
      viewport.name = 'viewport'
      document.head.appendChild(viewport)
    }

    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover'
    this.viewportMeta = viewport
  }

  /**
   * 应用移动端样式
   */
  private applyMobileStyles(): void {
    const style = document.createElement('style')
    style.textContent = `
      .mobile-editor {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        touch-action: none;
      }
      
      .mobile-editor.pinching {
        touch-action: pinch-zoom;
      }
      
      .mobile-editor.panning {
        touch-action: pan-x pan-y;
      }
      
      .mobile-content-wrapper {
        position: relative;
      }
      
      .mobile-toolbar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        border-top: 1px solid #e0e0e0;
        z-index: 1000;
        transform: translateY(0);
        transition: transform 0.3s ease-out;
      }
      
      .mobile-toolbar.hidden {
        transform: translateY(100%);
      }
      
      .swipe-menu {
        position: fixed;
        top: 0;
        left: -80%;
        width: 80%;
        height: 100%;
        background: white;
        box-shadow: 2px 0 8px rgba(0,0,0,0.15);
        z-index: 999;
        transition: transform 0.3s ease-out;
      }
      
      .swipe-menu.open {
        transform: translateX(100%);
      }
      
      .context-menu {
        position: fixed;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 16px rgba(0,0,0,0.2);
        padding: 8px 0;
        z-index: 1001;
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 0.2s, transform 0.2s;
      }
      
      .context-menu.visible {
        opacity: 1;
        transform: scale(1);
      }
      
      @media (max-width: 768px) {
        .ldesign-toolbar {
          display: none;
        }
        
        .ldesign-editor-content {
          font-size: 16px;
          padding: 10px;
        }
      }
      
      @supports (padding: env(safe-area-inset-bottom)) {
        .mobile-toolbar {
          padding-bottom: env(safe-area-inset-bottom);
        }
      }
    `
    document.head.appendChild(style)

    this.editorContainer.classList.add('mobile-editor')
  }

  /**
   * 初始化手势识别
   */
  private initializeGestures(): void {
    this.gestureRecognizer = new GestureRecognizer(this.editorContainer, {
      longPressThreshold: 500,
      doubleTapInterval: 300,
      swipeThreshold: 30,
      preventDefault: false,
    })

    // 双指缩放
    this.gestureRecognizer.on('pinchstart', () => {
      this.isPinching = true
      this.editorContainer.classList.add('pinching')
    })

    this.gestureRecognizer.on('pinch', (e: GestureEvent) => {
      this.handlePinch(e)
    })

    this.gestureRecognizer.on('pinchend', () => {
      this.isPinching = false
      this.editorContainer.classList.remove('pinching')
    })

    // 双击缩放
    this.gestureRecognizer.on('doubletap', (e: GestureEvent) => {
      this.handleDoubleTap(e)
    })

    // 单指拖动
    this.gestureRecognizer.on('pan', (e: GestureEvent) => {
      if (!this.isPinching)
        this.handlePan(e)
    })

    // 滑动手势
    this.gestureRecognizer.on('swipeleft', () => {
      if (this.swipeMenu?.isOpen())
        this.swipeMenu.close()
    })

    this.gestureRecognizer.on('swiperight', () => {
      if (this.currentPanX === 0 && !this.swipeMenu?.isOpen())
        this.swipeMenu?.open()
    })

    // 长按
    this.gestureRecognizer.on('longpress', (e: GestureEvent) => {
      this.handleLongPress(e)
    })
  }

  /**
   * 处理双指缩放
   */
  private handlePinch(e: GestureEvent): void {
    const newZoom = Math.max(
      this.options.minZoom,
      Math.min(this.options.maxZoom, this.currentZoom * e.scale),
    )

    if (newZoom !== this.currentZoom) {
      // 计算缩放中心点
      const rect = this.editorContainer.getBoundingClientRect()
      const centerX = e.center.x - rect.left
      const centerY = e.center.y - rect.top

      // 调整平移以保持缩放中心
      const scaleDiff = newZoom - this.currentZoom
      this.currentPanX -= centerX * scaleDiff
      this.currentPanY -= centerY * scaleDiff

      this.currentZoom = newZoom
      this.updateTransform()
    }
  }

  /**
   * 处理双击缩放
   */
  private handleDoubleTap(e: GestureEvent): void {
    if (this.currentZoom > 1.01) {
      // 重置缩放
      this.animateZoom(1, 0, 0)
    }
    else {
      // 放大到2倍
      const rect = this.editorContainer.getBoundingClientRect()
      const centerX = e.center.x - rect.left
      const centerY = e.center.y - rect.top

      const targetPanX = -centerX
      const targetPanY = -centerY

      this.animateZoom(2, targetPanX, targetPanY)
    }
  }

  /**
   * 处理拖动
   */
  private handlePan(e: GestureEvent): void {
    if (this.currentZoom > 1) {
      this.currentPanX += e.deltaX
      this.currentPanY += e.deltaY

      // 限制拖动范围
      this.constrainPan()
      this.updateTransform()
    }
  }

  /**
   * 处理长按
   */
  private handleLongPress(e: GestureEvent): void {
    if (this.contextMenu) {
      // 获取选中的文本
      const selection = window.getSelection()
      const selectedText = selection?.toString()

      // 显示上下文菜单
      this.contextMenu.show({
        x: e.center.x,
        y: e.center.y,
        selectedText,
        items: this.getContextMenuItems(selectedText),
      })
    }

    // 触发触觉反馈（如果支持）
    if ('vibrate' in navigator)
      navigator.vibrate(50)
  }

  /**
   * 获取上下文菜单项
   */
  private getContextMenuItems(selectedText?: string): any[] {
    const items = []

    if (selectedText) {
      items.push(
        { label: '复制', icon: '📋', action: () => this.copyText(selectedText) },
        { label: '剪切', icon: '✂️', action: () => this.cutText() },
        { type: 'separator' },
      )
    }

    items.push(
      { label: '粘贴', icon: '📄', action: () => this.pasteText() },
      { label: '全选', icon: '🔲', action: () => this.selectAll() },
      { type: 'separator' },
      { label: '撤销', icon: '↩️', action: () => this.editor.undo() },
      { label: '重做', icon: '↪️', action: () => this.editor.redo() },
    )

    return items
  }

  /**
   * 初始化滑动菜单
   */
  private initializeSwipeMenu(): void {
    this.swipeMenu = new SwipeMenu({
      container: this.editorContainer,
      items: [
        { label: '文件', icon: '📁', action: () => this.showFileMenu() },
        { label: '编辑', icon: '✏️', action: () => this.showEditMenu() },
        { label: '插入', icon: '➕', action: () => this.showInsertMenu() },
        { label: '格式', icon: '🎨', action: () => this.showFormatMenu() },
        { label: '工具', icon: '🔧', action: () => this.showToolsMenu() },
        { label: '设置', icon: '⚙️', action: () => this.showSettings() },
      ],
    })
  }

  /**
   * 初始化长按上下文菜单
   */
  private initializeContextMenu(): void {
    this.contextMenu = new ContextMenu({
      container: this.editorContainer,
    })
  }

  /**
   * 初始化移动端工具栏
   */
  private initializeMobileToolbar(): void {
    this.mobileToolbar = new MobileToolbar({
      container: this.editorContainer,
      editor: this.editor,
      items: [
        { id: 'bold', icon: 'B', title: '加粗' },
        { id: 'italic', icon: 'I', title: '斜体' },
        { id: 'underline', icon: 'U', title: '下划线' },
        { type: 'separator' },
        { id: 'undo', icon: '↩', title: '撤销' },
        { id: 'redo', icon: '↪', title: '重做' },
        { type: 'separator' },
        { id: 'image', icon: '🖼', title: '插入图片' },
        { id: 'link', icon: '🔗', title: '插入链接' },
        { id: 'more', icon: '⋯', title: '更多' },
      ],
    })

    // 监听键盘显示/隐藏
    this.setupKeyboardVisibilityListener()
  }

  /**
   * 设置屏幕方向监听
   */
  private setupOrientationListener(): void {
    const handleOrientationChange = debounce(() => {
      logger.info('Orientation changed:', window.orientation)

      // 重新计算视口
      this.metrics = this.calculateMetrics()

      // 调整UI布局
      this.adjustLayoutForOrientation()

      // 触发事件
      this.editor.emit('orientationchange', {
        orientation: this.getOrientation(),
        angle: window.orientation,
      })
    }, 300)

    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', handleOrientationChange)
  }

  /**
   * 设置键盘监听
   */
  private setupKeyboardListener(): void {
    // iOS虚拟键盘检测
    if (this.isIOS()) {
      let lastHeight = window.innerHeight

      window.addEventListener('resize', () => {
        const currentHeight = window.innerHeight
        const heightDiff = lastHeight - currentHeight

        if (Math.abs(heightDiff) > 100) {
          if (heightDiff > 0)
            this.onKeyboardShow(heightDiff)
          else
            this.onKeyboardHide()
        }

        lastHeight = currentHeight
      })
    }

    // Android虚拟键盘检测
    if (this.isAndroid()) {
      window.addEventListener('resize', () => {
        if (document.activeElement?.tagName === 'INPUT'
          || document.activeElement?.tagName === 'TEXTAREA') 
          this.onKeyboardShow(0)


        else 
          this.onKeyboardHide()

      })
    }
  }

  /**
   * 设置键盘可见性监听
   */
  private setupKeyboardVisibilityListener(): void {
    if ('visualViewport' in window) {
      window.visualViewport?.addEventListener('resize', () => {
        const hasKeyboard = window.visualViewport!.height < window.innerHeight * 0.75
        if (hasKeyboard)
          this.mobileToolbar?.hide()
        else
          this.mobileToolbar?.show()
      })
    }
  }

  /**
   * 键盘显示时的处理
   */
  private onKeyboardShow(keyboardHeight: number): void {
    logger.info('Keyboard shown, height:', keyboardHeight)

    // 隐藏工具栏
    this.mobileToolbar?.hide()

    // 滚动到光标位置
    this.scrollToCursor()

    // 触发事件
    this.editor.emit('keyboardshow', { height: keyboardHeight })
  }

  /**
   * 键盘隐藏时的处理
   */
  private onKeyboardHide(): void {
    logger.info('Keyboard hidden')

    // 显示工具栏
    this.mobileToolbar?.show()

    // 触发事件
    this.editor.emit('keyboardhide')
  }

  /**
   * 更新变换
   */
  private updateTransform(): void {
    const transform = `scale(${this.currentZoom}) translate(${this.currentPanX}px, ${this.currentPanY}px)`
    this.contentWrapper.style.transform = transform
  }

  /**
   * 动画缩放
   */
  private animateZoom(targetZoom: number, targetPanX: number, targetPanY: number): void {
    const startZoom = this.currentZoom
    const startPanX = this.currentPanX
    const startPanY = this.currentPanY
    const duration = 300
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = this.easeInOutCubic(progress)

      this.currentZoom = startZoom + (targetZoom - startZoom) * easeProgress
      this.currentPanX = startPanX + (targetPanX - startPanX) * easeProgress
      this.currentPanY = startPanY + (targetPanY - startPanY) * easeProgress

      this.updateTransform()

      if (progress < 1)
        requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }

  /**
   * 缓动函数
   */
  private easeInOutCubic(t: number): number {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - (-2 * t + 2) ** 3 / 2
  }

  /**
   * 限制拖动范围
   */
  private constrainPan(): void {
    const rect = this.editorContainer.getBoundingClientRect()
    const contentWidth = rect.width * this.currentZoom
    const contentHeight = rect.height * this.currentZoom

    const maxPanX = Math.max(0, (contentWidth - rect.width) / 2)
    const maxPanY = Math.max(0, (contentHeight - rect.height) / 2)

    this.currentPanX = Math.max(-maxPanX, Math.min(maxPanX, this.currentPanX))
    this.currentPanY = Math.max(-maxPanY, Math.min(maxPanY, this.currentPanY))
  }

  /**
   * 滚动到光标位置
   */
  private scrollToCursor(): void {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      if (rect.bottom > window.innerHeight - 100) {
        window.scrollTo({
          top: window.scrollY + rect.bottom - window.innerHeight + 100,
          behavior: 'smooth',
        })
      }
    }
  }

  /**
   * 计算视口指标
   */
  private calculateMetrics() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      orientation: this.getOrientation(),
      devicePixelRatio: window.devicePixelRatio,
      isKeyboardVisible: this.isKeyboardVisible(),
    }
  }

  private metrics = this.calculateMetrics()

  /**
   * 获取屏幕方向
   */
  private getOrientation(): 'portrait' | 'landscape' {
    return window.innerWidth < window.innerHeight ? 'portrait' : 'landscape'
  }

  /**
   * 检查键盘是否可见
   */
  private isKeyboardVisible(): boolean {
    if ('visualViewport' in window && window.visualViewport)
      return window.visualViewport.height < window.innerHeight * 0.75

    return false
  }

  /**
   * 调整布局以适应方向
   */
  private adjustLayoutForOrientation(): void {
    const orientation = this.getOrientation()

    if (orientation === 'landscape') {
      // 横屏布局调整
      this.mobileToolbar?.setCompactMode(true)
    }
    else {
      // 竖屏布局调整
      this.mobileToolbar?.setCompactMode(false)
    }
  }

  /**
   * 复制文本
   */
  private async copyText(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text)
      this.showToast('已复制到剪贴板')
    }
    catch (err) {
      logger.error('Failed to copy text:', err)
    }
  }

  /**
   * 剪切文本
   */
  private cutText(): void {
    document.execCommand('cut')
    this.showToast('已剪切')
  }

  /**
   * 粘贴文本
   */
  private async pasteText(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText()
      this.editor.insertText(text)
      this.showToast('已粘贴')
    }
    catch (err) {
      logger.error('Failed to paste text:', err)
    }
  }

  /**
   * 全选
   */
  private selectAll(): void {
    document.execCommand('selectAll')
  }

  /**
   * 显示提示
   */
  private showToast(message: string): void {
    // 创建提示元素
    const toast = document.createElement('div')
    toast.className = 'mobile-toast'
    toast.textContent = message
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px 20px;
      border-radius: 20px;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s;
    `

    document.body.appendChild(toast)

    // 显示动画
    setTimeout(() => {
      toast.style.opacity = '1'
    }, 10)

    // 自动隐藏
    setTimeout(() => {
      toast.style.opacity = '0'
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 2000)
  }

  /**
   * 显示文件菜单
   */
  private showFileMenu(): void {
    // 实现文件菜单逻辑
  }

  /**
   * 显示编辑菜单
   */
  private showEditMenu(): void {
    // 实现编辑菜单逻辑
  }

  /**
   * 显示插入菜单
   */
  private showInsertMenu(): void {
    // 实现插入菜单逻辑
  }

  /**
   * 显示格式菜单
   */
  private showFormatMenu(): void {
    // 实现格式菜单逻辑
  }

  /**
   * 显示工具菜单
   */
  private showToolsMenu(): void {
    // 实现工具菜单逻辑
  }

  /**
   * 显示设置
   */
  private showSettings(): void {
    // 实现设置逻辑
  }

  /**
   * 检测iOS
   */
  private isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
  }

  /**
   * 检测Android
   */
  private isAndroid(): boolean {
    return /Android/.test(navigator.userAgent)
  }

  /**
   * 销毁适配器
   */
  destroy(): void {
    this.gestureRecognizer?.destroy()
    this.swipeMenu?.destroy()
    this.contextMenu?.destroy()
    this.mobileToolbar?.destroy()
  }
}
