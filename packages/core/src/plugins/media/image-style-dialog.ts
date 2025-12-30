/**
 * Image Style Dialog Plugin
 * 图片样式编辑弹窗 - 提供完整的图片属性设置界面
 */

import type { Editor } from '../../core/Editor'
import { Plugin } from '../../core/Plugin'
import { getLucideIcon } from '../../ui/icons/lucide'

export interface ImageStyleDialogOptions {
  /** 默认宽度单位 */
  defaultWidthUnit?: 'px' | '%' | 'auto'
  /** 显示高级选项 */
  showAdvanced?: boolean
}

export class ImageStyleDialogPlugin extends Plugin {
  name = 'imageStyleDialog'
  config = {
    name: 'imageStyleDialog',
    commands: {},
    keys: {},
  }

  private options: ImageStyleDialogOptions
  private dialog: HTMLElement | null = null
  private currentImage: HTMLImageElement | null = null
  private originalStyles: Record<string, string> = {}

  constructor(options: ImageStyleDialogOptions = {}) {
    super()
    this.options = {
      defaultWidthUnit: 'px',
      showAdvanced: true,
      ...options,
    }
  }

  install(editor: Editor): void {
    super.install(editor)
    
    // 监听打开对话框事件
    editor.on('image:openStyleDialog', this.handleOpenDialog.bind(this))
    
    // 双击图片打开对话框
    editor.contentElement?.addEventListener('dblclick', this.handleDoubleClick.bind(this))
    
    console.log('[ImageStyleDialogPlugin] Installed')
  }

  private handleDoubleClick(e: MouseEvent): void {
    const target = e.target as HTMLElement
    if (target.tagName === 'IMG') {
      e.preventDefault()
      this.openDialog(target as HTMLImageElement)
    }
  }

  private handleOpenDialog(data: { image: HTMLImageElement }): void {
    this.openDialog(data.image)
  }

  openDialog(image: HTMLImageElement): void {
    this.currentImage = image
    this.saveOriginalStyles()
    this.dialog = this.createDialog()
    document.body.appendChild(this.dialog)
  }

  private saveOriginalStyles(): void {
    if (!this.currentImage) return
    
    this.originalStyles = {
      width: this.currentImage.style.width,
      height: this.currentImage.style.height,
      borderRadius: this.currentImage.style.borderRadius,
      border: this.currentImage.style.border,
      boxShadow: this.currentImage.style.boxShadow,
      opacity: this.currentImage.style.opacity,
      filter: this.currentImage.style.filter,
      marginLeft: this.currentImage.style.marginLeft,
      marginRight: this.currentImage.style.marginRight,
      display: this.currentImage.style.display,
    }
  }

  private restoreOriginalStyles(): void {
    if (!this.currentImage) return
    
    Object.entries(this.originalStyles).forEach(([key, value]) => {
      (this.currentImage!.style as any)[key] = value
    })
  }

  private createDialog(): HTMLElement {
    const overlay = document.createElement('div')
    overlay.className = 'ldesign-image-style-dialog-overlay'
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10002;
    `

    const dialog = document.createElement('div')
    dialog.className = 'ldesign-image-style-dialog'
    dialog.style.cssText = `
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
      width: 480px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    `

    // 头部
    const header = this.createHeader()
    dialog.appendChild(header)

    // 内容区
    const content = this.createContent()
    dialog.appendChild(content)

    // 底部按钮
    const footer = this.createFooter()
    dialog.appendChild(footer)

    overlay.appendChild(dialog)

    // 点击遮罩关闭
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeDialog(false)
      }
    })

    // ESC 关闭
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.closeDialog(false)
        document.removeEventListener('keydown', handleKeydown)
      }
    }
    document.addEventListener('keydown', handleKeydown)

    return overlay
  }

  private createHeader(): HTMLElement {
    const header = document.createElement('div')
    header.style.cssText = `
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `

    const title = document.createElement('h3')
    title.textContent = '图片设置'
    title.style.cssText = 'margin: 0; font-size: 18px; font-weight: 600; color: #111827;'

    const closeBtn = document.createElement('button')
    closeBtn.innerHTML = getLucideIcon('x')
    closeBtn.style.cssText = `
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: #6b7280;
      border-radius: 4px;
    `
    closeBtn.onclick = () => this.closeDialog(false)

    header.appendChild(title)
    header.appendChild(closeBtn)

    return header
  }

  private createContent(): HTMLElement {
    const content = document.createElement('div')
    content.style.cssText = `
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    `

    // 尺寸设置
    content.appendChild(this.createSection('尺寸', [
      this.createSizeInput(),
    ]))

    // 对齐设置
    content.appendChild(this.createSection('对齐', [
      this.createAlignButtons(),
    ]))

    // 样式设置
    content.appendChild(this.createSection('样式', [
      this.createRangeInput('圆角', 'borderRadius', 0, 100, 'px', parseInt(this.currentImage?.style.borderRadius || '0')),
      this.createRangeInput('透明度', 'opacity', 0, 100, '%', Math.round((parseFloat(this.currentImage?.style.opacity || '1')) * 100)),
    ]))

    // 边框设置
    content.appendChild(this.createSection('边框', [
      this.createBorderInput(),
    ]))

    // 阴影设置
    content.appendChild(this.createSection('阴影', [
      this.createShadowButtons(),
    ]))

    // Alt 文本
    content.appendChild(this.createSection('替代文本 (Alt)', [
      this.createTextInput('alt', this.currentImage?.alt || '', '为图片添加描述文字'),
    ]))

    // 标题
    content.appendChild(this.createSection('标题 (Title)', [
      this.createTextInput('title', this.currentImage?.title || '', '鼠标悬停时显示的文字'),
    ]))

    return content
  }

  private createSection(title: string, items: HTMLElement[]): HTMLElement {
    const section = document.createElement('div')
    section.style.cssText = 'margin-bottom: 20px;'

    const label = document.createElement('label')
    label.textContent = title
    label.style.cssText = `
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;
    `
    section.appendChild(label)

    items.forEach(item => section.appendChild(item))

    return section
  }

  private createSizeInput(): HTMLElement {
    const container = document.createElement('div')
    container.style.cssText = 'display: flex; gap: 12px; align-items: center;'

    // 宽度输入
    const widthGroup = document.createElement('div')
    widthGroup.style.cssText = 'flex: 1;'
    
    const widthLabel = document.createElement('span')
    widthLabel.textContent = '宽度'
    widthLabel.style.cssText = 'font-size: 12px; color: #6b7280; display: block; margin-bottom: 4px;'
    
    const widthInput = document.createElement('input')
    widthInput.type = 'text'
    widthInput.value = this.currentImage?.style.width || 'auto'
    widthInput.style.cssText = this.getInputStyle()
    widthInput.onchange = () => {
      if (this.currentImage) {
        this.currentImage.style.width = widthInput.value || 'auto'
        this.triggerChange()
      }
    }
    
    widthGroup.appendChild(widthLabel)
    widthGroup.appendChild(widthInput)

    // 高度输入
    const heightGroup = document.createElement('div')
    heightGroup.style.cssText = 'flex: 1;'
    
    const heightLabel = document.createElement('span')
    heightLabel.textContent = '高度'
    heightLabel.style.cssText = 'font-size: 12px; color: #6b7280; display: block; margin-bottom: 4px;'
    
    const heightInput = document.createElement('input')
    heightInput.type = 'text'
    heightInput.value = this.currentImage?.style.height || 'auto'
    heightInput.style.cssText = this.getInputStyle()
    heightInput.onchange = () => {
      if (this.currentImage) {
        this.currentImage.style.height = heightInput.value || 'auto'
        this.triggerChange()
      }
    }
    
    heightGroup.appendChild(heightLabel)
    heightGroup.appendChild(heightInput)

    // 锁定比例按钮
    const lockBtn = document.createElement('button')
    lockBtn.innerHTML = getLucideIcon('lock')
    lockBtn.title = '锁定比例'
    lockBtn.style.cssText = `
      background: #f3f4f6;
      border: none;
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 18px;
    `

    container.appendChild(widthGroup)
    container.appendChild(lockBtn)
    container.appendChild(heightGroup)

    return container
  }

  private createAlignButtons(): HTMLElement {
    const container = document.createElement('div')
    container.style.cssText = 'display: flex; gap: 8px;'

    const alignOptions = [
      { value: 'left', icon: 'alignLeft', title: '左对齐' },
      { value: 'center', icon: 'alignCenter', title: '居中' },
      { value: 'right', icon: 'alignRight', title: '右对齐' },
    ]

    alignOptions.forEach((option) => {
      const btn = document.createElement('button')
      btn.innerHTML = getLucideIcon(option.icon)
      btn.title = option.title
      btn.style.cssText = `
        flex: 1;
        padding: 10px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        transition: all 0.2s;
      `

      btn.onclick = () => {
        if (!this.currentImage) return

        // 清除之前的对齐
        this.currentImage.style.float = ''
        this.currentImage.style.marginLeft = ''
        this.currentImage.style.marginRight = ''
        this.currentImage.style.display = 'block'

        switch (option.value) {
          case 'left':
            this.currentImage.style.marginRight = 'auto'
            break
          case 'center':
            this.currentImage.style.marginLeft = 'auto'
            this.currentImage.style.marginRight = 'auto'
            break
          case 'right':
            this.currentImage.style.marginLeft = 'auto'
            break
        }

        this.triggerChange()
      }

      container.appendChild(btn)
    })

    return container
  }

  private createRangeInput(label: string, property: string, min: number, max: number, unit: string, value: number): HTMLElement {
    const container = document.createElement('div')
    container.style.cssText = 'margin-bottom: 12px;'

    const labelRow = document.createElement('div')
    labelRow.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 4px;'

    const labelText = document.createElement('span')
    labelText.textContent = label
    labelText.style.cssText = 'font-size: 12px; color: #6b7280;'

    const valueText = document.createElement('span')
    valueText.textContent = `${value}${unit}`
    valueText.style.cssText = 'font-size: 12px; color: #111827; font-weight: 500;'

    labelRow.appendChild(labelText)
    labelRow.appendChild(valueText)

    const range = document.createElement('input')
    range.type = 'range'
    range.min = String(min)
    range.max = String(max)
    range.value = String(value)
    range.style.cssText = 'width: 100%; cursor: pointer;'

    range.oninput = () => {
      const val = range.value
      valueText.textContent = `${val}${unit}`
      
      if (this.currentImage) {
        if (property === 'opacity') {
          this.currentImage.style.opacity = String(parseInt(val) / 100)
        } else if (property === 'borderRadius') {
          this.currentImage.style.borderRadius = `${val}px`
        }
        this.triggerChange()
      }
    }

    container.appendChild(labelRow)
    container.appendChild(range)

    return container
  }

  private createBorderInput(): HTMLElement {
    const container = document.createElement('div')
    container.style.cssText = 'display: flex; gap: 8px; align-items: center;'

    // 边框宽度
    const widthInput = document.createElement('input')
    widthInput.type = 'number'
    widthInput.min = '0'
    widthInput.max = '20'
    widthInput.value = '0'
    widthInput.placeholder = '宽度'
    widthInput.style.cssText = this.getInputStyle() + 'width: 80px;'

    // 边框样式
    const styleSelect = document.createElement('select')
    styleSelect.style.cssText = this.getInputStyle() + 'width: 100px;'
    const styles = ['solid', 'dashed', 'dotted', 'double']
    styles.forEach((s) => {
      const opt = document.createElement('option')
      opt.value = s
      opt.textContent = s
      styleSelect.appendChild(opt)
    })

    // 边框颜色
    const colorInput = document.createElement('input')
    colorInput.type = 'color'
    colorInput.value = '#000000'
    colorInput.style.cssText = 'width: 40px; height: 36px; padding: 2px; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer;'

    const updateBorder = () => {
      if (this.currentImage) {
        const width = widthInput.value
        if (parseInt(width) > 0) {
          this.currentImage.style.border = `${width}px ${styleSelect.value} ${colorInput.value}`
        } else {
          this.currentImage.style.border = ''
        }
        this.triggerChange()
      }
    }

    widthInput.onchange = updateBorder
    styleSelect.onchange = updateBorder
    colorInput.onchange = updateBorder

    container.appendChild(widthInput)
    container.appendChild(styleSelect)
    container.appendChild(colorInput)

    return container
  }

  private createShadowButtons(): HTMLElement {
    const container = document.createElement('div')
    container.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;'

    const shadows = [
      { label: '无', value: 'none' },
      { label: '小', value: '0 2px 4px rgba(0,0,0,0.1)' },
      { label: '中', value: '0 4px 12px rgba(0,0,0,0.15)' },
      { label: '大', value: '0 10px 30px rgba(0,0,0,0.2)' },
    ]

    shadows.forEach((shadow) => {
      const btn = document.createElement('button')
      btn.textContent = shadow.label
      btn.style.cssText = `
        padding: 8px 16px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
      `

      btn.onclick = () => {
        if (this.currentImage) {
          this.currentImage.style.boxShadow = shadow.value === 'none' ? '' : shadow.value
          this.triggerChange()
        }
      }

      container.appendChild(btn)
    })

    return container
  }

  private createTextInput(property: 'alt' | 'title', value: string, placeholder: string): HTMLElement {
    const input = document.createElement('input')
    input.type = 'text'
    input.value = value
    input.placeholder = placeholder
    input.style.cssText = this.getInputStyle() + 'width: 100%;'

    input.onchange = () => {
      if (this.currentImage) {
        this.currentImage[property] = input.value
        this.triggerChange()
      }
    }

    return input
  }

  private createFooter(): HTMLElement {
    const footer = document.createElement('div')
    footer.style.cssText = `
      padding: 16px 20px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    `

    const cancelBtn = document.createElement('button')
    cancelBtn.textContent = '取消'
    cancelBtn.style.cssText = `
      padding: 10px 20px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-size: 14px;
    `
    cancelBtn.onclick = () => this.closeDialog(false)

    const confirmBtn = document.createElement('button')
    confirmBtn.textContent = '确定'
    confirmBtn.style.cssText = `
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      background: #3b82f6;
      color: white;
      cursor: pointer;
      font-size: 14px;
    `
    confirmBtn.onclick = () => this.closeDialog(true)

    footer.appendChild(cancelBtn)
    footer.appendChild(confirmBtn)

    return footer
  }

  private getInputStyle(): string {
    return `
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    `
  }

  private closeDialog(save: boolean): void {
    if (!save) {
      this.restoreOriginalStyles()
    }

    if (this.dialog) {
      this.dialog.remove()
      this.dialog = null
    }

    this.currentImage = null
    this.originalStyles = {}
  }

  private triggerChange(): void {
    const event = new Event('input', { bubbles: true })
    this.editor?.contentElement?.dispatchEvent(event)
  }

  destroy(): void {
    if (this.dialog) {
      this.dialog.remove()
    }

    this.editor?.contentElement?.removeEventListener('dblclick', this.handleDoubleClick.bind(this))

    console.log('[ImageStyleDialogPlugin] Destroyed')
  }
}

export default ImageStyleDialogPlugin
