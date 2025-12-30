/**
 * Image Toolbar Plugin
 * 图片悬浮工具栏 - 提供快捷操作按钮
 */

import type { Editor } from '../../core/Editor'
import { Plugin } from '../../core/Plugin'
import { getLucideIcon } from '../../ui/icons/lucide'

export interface ImageToolbarOptions {
  /** 工具栏显示位置 */
  position?: 'top' | 'bottom'
  /** 是否显示对齐按钮 */
  showAlign?: boolean
  /** 是否显示链接按钮 */
  showLink?: boolean
  /** 是否显示删除按钮 */
  showDelete?: boolean
  /** 是否显示编辑按钮 */
  showEdit?: boolean
  /** 自定义工具栏项 */
  customItems?: ToolbarItem[]
}

export interface ToolbarItem {
  name: string
  icon: string
  title: string
  action: (image: HTMLImageElement, editor: Editor) => void
}

export class ImageToolbarPlugin extends Plugin {
  name = 'imageToolbar'
  config = {
    name: 'imageToolbar',
    commands: {},
    keys: {},
  }

  private options: ImageToolbarOptions
  private toolbar: HTMLElement | null = null
  private currentImage: HTMLImageElement | null = null

  constructor(options: ImageToolbarOptions = {}) {
    super()
    this.options = {
      position: 'top',
      showAlign: true,
      showLink: true,
      showDelete: true,
      showEdit: true,
      ...options,
    }
  }

  install(editor: Editor): void {
    super.install(editor)
    this.bindEvents()
    console.log('[ImageToolbarPlugin] Installed')
  }

  private bindEvents(): void {
    const editorElement = this.editor?.contentElement
    if (!editorElement)
      return

    // 点击图片显示工具栏
    editorElement.addEventListener('click', this.handleImageClick.bind(this))
    
    // 点击其他地方隐藏工具栏
    document.addEventListener('click', this.handleDocumentClick.bind(this))
    
    // 滚动时更新位置
    editorElement.addEventListener('scroll', this.updateToolbarPosition.bind(this))
    window.addEventListener('scroll', this.updateToolbarPosition.bind(this))
    window.addEventListener('resize', this.updateToolbarPosition.bind(this))
  }

  private handleImageClick(e: MouseEvent): void {
    const target = e.target as HTMLElement
    
    if (target.tagName === 'IMG') {
      e.stopPropagation()
      this.showToolbar(target as HTMLImageElement)
    }
  }

  private handleDocumentClick(e: MouseEvent): void {
    const target = e.target as HTMLElement
    
    // 如果点击的不是图片也不是工具栏，则隐藏
    if (target.tagName !== 'IMG' && !this.toolbar?.contains(target)) {
      this.hideToolbar()
    }
  }

  private showToolbar(image: HTMLImageElement): void {
    // 先隐藏现有工具栏
    this.hideToolbar()

    this.currentImage = image
    this.toolbar = this.createToolbar()
    document.body.appendChild(this.toolbar)
    this.updateToolbarPosition()
  }

  private hideToolbar(): void {
    if (this.toolbar) {
      this.toolbar.remove()
      this.toolbar = null
    }
    this.currentImage = null
  }

  private createToolbar(): HTMLElement {
    const toolbar = document.createElement('div')
    toolbar.className = 'ldesign-image-toolbar'
    toolbar.style.cssText = `
      position: fixed;
      display: flex;
      gap: 2px;
      padding: 4px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10001;
      user-select: none;
    `

    // 对齐按钮组
    if (this.options.showAlign) {
      this.addToolbarGroup(toolbar, [
        { name: 'alignLeft', icon: 'alignLeft', title: '左对齐', action: () => this.setAlign('left') },
        { name: 'alignCenter', icon: 'alignCenter', title: '居中', action: () => this.setAlign('center') },
        { name: 'alignRight', icon: 'alignRight', title: '右对齐', action: () => this.setAlign('right') },
      ])
      this.addSeparator(toolbar)
    }

    // 大小按钮组
    this.addToolbarGroup(toolbar, [
      { name: 'sizeSmall', icon: 'minimize2', title: '小尺寸 (25%)', action: () => this.setSize('25%') },
      { name: 'sizeMedium', icon: 'square', title: '中尺寸 (50%)', action: () => this.setSize('50%') },
      { name: 'sizeLarge', icon: 'maximize2', title: '大尺寸 (100%)', action: () => this.setSize('100%') },
    ])
    this.addSeparator(toolbar)

    // 链接按钮
    if (this.options.showLink) {
      this.addToolbarButton(toolbar, {
        name: 'link',
        icon: 'link',
        title: '添加链接',
        action: () => this.addLink(),
      })
    }

    // 编辑按钮
    if (this.options.showEdit) {
      this.addToolbarButton(toolbar, {
        name: 'edit',
        icon: 'settings',
        title: '图片设置',
        action: () => this.openStyleDialog(),
      })
    }

    // 替换按钮
    this.addToolbarButton(toolbar, {
      name: 'replace',
      icon: 'refreshCw',
      title: '替换图片',
      action: () => this.replaceImage(),
    })

    // 删除按钮
    if (this.options.showDelete) {
      this.addSeparator(toolbar)
      this.addToolbarButton(toolbar, {
        name: 'delete',
        icon: 'trash2',
        title: '删除图片',
        action: () => this.deleteImage(),
        danger: true,
      })
    }

    // 自定义项
    if (this.options.customItems?.length) {
      this.addSeparator(toolbar)
      this.options.customItems.forEach((item) => {
        this.addToolbarButton(toolbar, {
          ...item,
          action: () => item.action(this.currentImage!, this.editor!),
        })
      })
    }

    return toolbar
  }

  private addToolbarGroup(container: HTMLElement, items: Array<{ name: string, icon: string, title: string, action: () => void }>): void {
    const group = document.createElement('div')
    group.style.cssText = 'display: flex; gap: 2px;'
    
    items.forEach((item) => {
      this.addToolbarButton(group, item)
    })
    
    container.appendChild(group)
  }

  private addToolbarButton(container: HTMLElement, item: { name: string, icon: string, title: string, action: () => void, danger?: boolean }): void {
    const button = document.createElement('button')
    button.className = `image-toolbar-btn btn-${item.name}`
    button.title = item.title
    button.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      background: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      color: ${item.danger ? '#ef4444' : '#374151'};
      transition: all 0.2s;
    `
    button.innerHTML = getLucideIcon(item.icon)
    
    button.onmouseenter = () => {
      button.style.background = item.danger ? '#fee2e2' : '#f3f4f6'
    }
    button.onmouseleave = () => {
      button.style.background = 'transparent'
    }
    
    button.onclick = (e) => {
      e.stopPropagation()
      item.action()
    }
    
    container.appendChild(button)
  }

  private addSeparator(container: HTMLElement): void {
    const separator = document.createElement('div')
    separator.style.cssText = `
      width: 1px;
      height: 24px;
      background: #e5e7eb;
      margin: 4px 4px;
    `
    container.appendChild(separator)
  }

  private updateToolbarPosition(): void {
    if (!this.toolbar || !this.currentImage)
      return

    const imgRect = this.currentImage.getBoundingClientRect()
    const toolbarRect = this.toolbar.getBoundingClientRect()
    
    let top: number
    if (this.options.position === 'bottom') {
      top = imgRect.bottom + 8
    } else {
      top = imgRect.top - toolbarRect.height - 8
    }
    
    // 确保工具栏在视口内
    if (top < 10) {
      top = imgRect.bottom + 8
    }
    if (top + toolbarRect.height > window.innerHeight - 10) {
      top = imgRect.top - toolbarRect.height - 8
    }
    
    let left = imgRect.left + (imgRect.width - toolbarRect.width) / 2
    left = Math.max(10, Math.min(left, window.innerWidth - toolbarRect.width - 10))
    
    this.toolbar.style.top = `${top}px`
    this.toolbar.style.left = `${left}px`
  }

  // 功能实现
  private setAlign(align: 'left' | 'center' | 'right'): void {
    if (!this.currentImage)
      return

    // 清除之前的对齐样式
    this.currentImage.style.float = ''
    this.currentImage.style.marginLeft = ''
    this.currentImage.style.marginRight = ''
    this.currentImage.style.display = ''

    switch (align) {
      case 'left':
        this.currentImage.style.display = 'block'
        this.currentImage.style.marginRight = 'auto'
        break
      case 'center':
        this.currentImage.style.display = 'block'
        this.currentImage.style.marginLeft = 'auto'
        this.currentImage.style.marginRight = 'auto'
        break
      case 'right':
        this.currentImage.style.display = 'block'
        this.currentImage.style.marginLeft = 'auto'
        break
    }

    this.triggerChange()
  }

  private setSize(size: string): void {
    if (!this.currentImage)
      return

    this.currentImage.style.width = size
    this.currentImage.style.height = 'auto'
    this.updateToolbarPosition()
    this.triggerChange()
  }

  private addLink(): void {
    if (!this.currentImage)
      return

    const existingLink = this.currentImage.parentElement?.tagName === 'A'
      ? (this.currentImage.parentElement as HTMLAnchorElement).href
      : ''

    const url = prompt('输入链接地址:', existingLink)
    if (url === null)
      return

    if (url) {
      // 如果已有链接，更新它
      if (this.currentImage.parentElement?.tagName === 'A') {
        (this.currentImage.parentElement as HTMLAnchorElement).href = url
      } else {
        // 创建新链接包裹图片
        const link = document.createElement('a')
        link.href = url
        link.target = '_blank'
        this.currentImage.parentNode?.insertBefore(link, this.currentImage)
        link.appendChild(this.currentImage)
      }
    } else {
      // 移除链接
      if (this.currentImage.parentElement?.tagName === 'A') {
        const link = this.currentImage.parentElement
        link.parentNode?.insertBefore(this.currentImage, link)
        link.remove()
      }
    }

    this.triggerChange()
  }

  private openStyleDialog(): void {
    if (!this.currentImage || !this.editor)
      return

    // 触发打开样式对话框事件
    this.editor.emit('image:openStyleDialog', { image: this.currentImage })
    
    // 如果没有监听器处理，使用简单的 prompt
    setTimeout(() => {
      // 检查是否已经有对话框打开
      if (document.querySelector('.ldesign-image-style-dialog'))
        return

      // 简单的样式设置
      const borderRadius = prompt('设置圆角 (如: 0, 8px, 50%):', this.currentImage?.style.borderRadius || '0')
      if (borderRadius !== null && this.currentImage) {
        this.currentImage.style.borderRadius = borderRadius
        this.triggerChange()
      }
    }, 100)
  }

  private replaceImage(): void {
    if (!this.currentImage)
      return

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file && this.currentImage) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (this.currentImage) {
            this.currentImage.src = e.target?.result as string
            this.triggerChange()
          }
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  private deleteImage(): void {
    if (!this.currentImage)
      return

    // 如果图片被链接包裹，删除链接
    if (this.currentImage.parentElement?.tagName === 'A') {
      this.currentImage.parentElement.remove()
    } else {
      this.currentImage.remove()
    }

    this.hideToolbar()
    this.triggerChange()
  }

  private triggerChange(): void {
    const event = new Event('input', { bubbles: true })
    this.editor?.contentElement?.dispatchEvent(event)
  }

  destroy(): void {
    this.hideToolbar()
    
    const editorElement = this.editor?.contentElement
    if (editorElement) {
      editorElement.removeEventListener('click', this.handleImageClick.bind(this))
      editorElement.removeEventListener('scroll', this.updateToolbarPosition.bind(this))
    }
    
    document.removeEventListener('click', this.handleDocumentClick.bind(this))
    window.removeEventListener('scroll', this.updateToolbarPosition.bind(this))
    window.removeEventListener('resize', this.updateToolbarPosition.bind(this))
    
    console.log('[ImageToolbarPlugin] Destroyed')
  }
}

export default ImageToolbarPlugin
