/**
 * 代码块悬浮工具栏插件
 * 提供主题切换、行号开关、语言切换、复制等功能
 */

import type { Plugin } from '../../types'
import { createPlugin } from '../../core/Plugin'

// 工具栏样式
const TOOLBAR_STYLES = `
.code-toolbar {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  font-size: 12px;
  user-select: none;
  backdrop-filter: blur(8px);
}

.code-toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.code-toolbar-group:last-child {
  border-right: none;
}

.code-toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 26px;
  padding: 0 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  color: #e5e7eb;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.code-toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.code-toolbar-btn:active {
  background: rgba(255, 255, 255, 0.2);
}

.code-toolbar-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.code-toolbar-btn svg {
  width: 14px;
  height: 14px;
}

.code-toolbar-select {
  height: 26px;
  padding: 0 24px 0 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: #e5e7eb;
  font-size: 11px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23e5e7eb' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 6px center;
}

.code-toolbar-select:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.code-toolbar-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.code-toolbar-select option {
  background: #1f2937;
  color: #e5e7eb;
}

.code-toolbar-label {
  color: #9ca3af;
  font-size: 11px;
  margin-right: 4px;
}

.code-toolbar-divider {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 4px;
}

/* 代码块选中效果 */
.code-block-container.selected {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* 复制成功提示 */
.code-toolbar-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: #10b981;
  color: #fff;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  animation: fadeInOut 2s ease;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  15% { opacity: 1; transform: translateX(-50%) translateY(0); }
  85% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
}
`

// SVG 图标
const ICONS = {
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  lineNumbers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h2M4 12h2M4 18h2M10 6h10M10 12h10M10 18h10"/></svg>`,
  theme: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
  wrap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h15a3 3 0 1 1 0 6h-6l3-3M3 18h6"/></svg>`,
  delete: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  format: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`,
}

// 支持的编程语言
const LANGUAGES = [
  { value: 'plaintext', label: '纯文本' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'shell', label: 'Shell' },
  { value: 'markdown', label: 'Markdown' },
]

// 代码主题
const THEMES = [
  { value: 'oneDark', label: 'One Dark', bg: '#282c34', fg: '#abb2bf' },
  { value: 'vsLight', label: 'VS Light', bg: '#ffffff', fg: '#000000' },
  { value: 'monokai', label: 'Monokai', bg: '#272822', fg: '#f8f8f2' },
  { value: 'dracula', label: 'Dracula', bg: '#282a36', fg: '#f8f8f2' },
  { value: 'github', label: 'GitHub', bg: '#f6f8fa', fg: '#24292e' },
  { value: 'nord', label: 'Nord', bg: '#2e3440', fg: '#d8dee9' },
]

/**
 * 代码块工具栏类
 */
class CodeToolbar {
  private toolbar: HTMLElement | null = null
  private currentBlock: HTMLElement | null = null
  private styleInjected = false

  constructor() {
    this.injectStyles()
    this.setupEventListeners()
  }

  /**
   * 注入样式
   */
  private injectStyles() {
    if (this.styleInjected) return
    
    const styleId = 'code-toolbar-styles'
    if (document.getElementById(styleId)) {
      this.styleInjected = true
      return
    }

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = TOOLBAR_STYLES
    document.head.appendChild(style)
    this.styleInjected = true
  }

  /**
   * 设置事件监听
   */
  private setupEventListeners() {
    // 点击代码块显示工具栏
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const codeBlock = target.closest('.code-block-container') as HTMLElement

      if (codeBlock) {
        this.selectBlock(codeBlock)
      } else if (!target.closest('.code-toolbar')) {
        this.hideToolbar()
      }
    })

    // ESC 隐藏工具栏
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.toolbar) {
        this.hideToolbar()
      }
    })
  }

  /**
   * 选中代码块
   */
  private selectBlock(block: HTMLElement) {
    // 移除之前的选中状态
    document.querySelectorAll('.code-block-container.selected').forEach(el => {
      el.classList.remove('selected')
    })

    this.currentBlock = block
    block.classList.add('selected')
    this.showToolbar(block)
  }

  /**
   * 显示工具栏
   */
  private showToolbar(block: HTMLElement) {
    this.hideToolbar()

    this.toolbar = this.createToolbar()
    document.body.appendChild(this.toolbar)

    this.positionToolbar(block)
  }

  /**
   * 隐藏工具栏
   */
  private hideToolbar() {
    if (this.toolbar) {
      this.toolbar.remove()
      this.toolbar = null
    }

    document.querySelectorAll('.code-block-container.selected').forEach(el => {
      el.classList.remove('selected')
    })
    this.currentBlock = null
  }

  /**
   * 定位工具栏
   */
  private positionToolbar(block: HTMLElement) {
    if (!this.toolbar) return

    const rect = block.getBoundingClientRect()
    const toolbarRect = this.toolbar.getBoundingClientRect()

    let top = rect.top - toolbarRect.height - 8
    let left = rect.left + (rect.width - toolbarRect.width) / 2

    // 边界检查
    if (top < 10) {
      top = rect.bottom + 8
    }
    if (left < 10) {
      left = 10
    }
    if (left + toolbarRect.width > window.innerWidth - 10) {
      left = window.innerWidth - toolbarRect.width - 10
    }

    this.toolbar.style.top = `${top + window.scrollY}px`
    this.toolbar.style.left = `${left + window.scrollX}px`
  }

  /**
   * 创建工具栏
   */
  private createToolbar(): HTMLElement {
    const toolbar = document.createElement('div')
    toolbar.className = 'code-toolbar'

    // 语言选择组
    const langGroup = document.createElement('div')
    langGroup.className = 'code-toolbar-group'
    
    const langLabel = document.createElement('span')
    langLabel.className = 'code-toolbar-label'
    langLabel.textContent = '语言'
    langGroup.appendChild(langLabel)
    
    langGroup.appendChild(this.createLanguageSelect())
    toolbar.appendChild(langGroup)

    // 主题选择组
    const themeGroup = document.createElement('div')
    themeGroup.className = 'code-toolbar-group'
    
    const themeLabel = document.createElement('span')
    themeLabel.className = 'code-toolbar-label'
    themeLabel.textContent = '主题'
    themeGroup.appendChild(themeLabel)
    
    themeGroup.appendChild(this.createThemeSelect())
    toolbar.appendChild(themeGroup)

    // 功能按钮组
    const actionGroup = document.createElement('div')
    actionGroup.className = 'code-toolbar-group'
    
    actionGroup.appendChild(this.createButton('lineNumbers', '行号', () => this.toggleLineNumbers(), this.hasLineNumbers()))
    actionGroup.appendChild(this.createButton('wrap', '换行', () => this.toggleWrap(), this.hasWrap()))
    actionGroup.appendChild(this.createButton('copy', '复制', () => this.copyCode()))
    
    toolbar.appendChild(actionGroup)

    // 删除按钮
    const deleteGroup = document.createElement('div')
    deleteGroup.className = 'code-toolbar-group'
    deleteGroup.appendChild(this.createButton('delete', '删除', () => this.deleteBlock()))
    toolbar.appendChild(deleteGroup)

    return toolbar
  }

  /**
   * 创建按钮
   */
  private createButton(icon: string, label: string, onClick: () => void, isActive = false): HTMLButtonElement {
    const button = document.createElement('button')
    button.className = 'code-toolbar-btn' + (isActive ? ' active' : '')
    button.innerHTML = `${ICONS[icon as keyof typeof ICONS] || ''}${label}`
    button.onclick = (e) => {
      e.stopPropagation()
      onClick()
    }
    return button
  }

  /**
   * 创建语言选择器
   */
  private createLanguageSelect(): HTMLSelectElement {
    const select = document.createElement('select')
    select.className = 'code-toolbar-select'

    const currentLang = this.getCurrentLanguage()

    LANGUAGES.forEach(lang => {
      const option = document.createElement('option')
      option.value = lang.value
      option.textContent = lang.label
      if (lang.value === currentLang) {
        option.selected = true
      }
      select.appendChild(option)
    })

    select.onchange = (e) => {
      e.stopPropagation()
      this.changeLanguage(select.value)
    }

    return select
  }

  /**
   * 创建主题选择器
   */
  private createThemeSelect(): HTMLSelectElement {
    const select = document.createElement('select')
    select.className = 'code-toolbar-select'

    const currentTheme = this.getCurrentTheme()

    THEMES.forEach(theme => {
      const option = document.createElement('option')
      option.value = theme.value
      option.textContent = theme.label
      if (theme.value === currentTheme) {
        option.selected = true
      }
      select.appendChild(option)
    })

    select.onchange = (e) => {
      e.stopPropagation()
      this.changeTheme(select.value)
    }

    return select
  }

  /**
   * 获取当前语言
   */
  private getCurrentLanguage(): string {
    if (!this.currentBlock) return 'plaintext'

    const code = this.currentBlock.querySelector('code')
    if (code) {
      const classList = Array.from(code.classList)
      const langClass = classList.find(c => c.startsWith('language-'))
      if (langClass) {
        return langClass.replace('language-', '')
      }
    }

    const pre = this.currentBlock.querySelector('pre')
    return pre?.getAttribute('data-language') || 'plaintext'
  }

  /**
   * 获取当前主题
   */
  private getCurrentTheme(): string {
    if (!this.currentBlock) return 'oneDark'
    return this.currentBlock.getAttribute('data-theme') || 'oneDark'
  }

  /**
   * 是否有行号
   */
  private hasLineNumbers(): boolean {
    if (!this.currentBlock) return true
    const lineNumbers = this.currentBlock.querySelector('.line-numbers')
    return lineNumbers !== null && (lineNumbers as HTMLElement).style.display !== 'none'
  }

  /**
   * 是否换行
   */
  private hasWrap(): boolean {
    if (!this.currentBlock) return false
    const code = this.currentBlock.querySelector('code')
    return code?.style.whiteSpace === 'pre-wrap'
  }

  /**
   * 切换行号显示
   */
  private toggleLineNumbers() {
    if (!this.currentBlock) return

    const lineNumbers = this.currentBlock.querySelector('.line-numbers') as HTMLElement
    if (lineNumbers) {
      const isHidden = lineNumbers.style.display === 'none'
      lineNumbers.style.display = isHidden ? 'block' : 'none'
      
      // 更新按钮状态
      this.refreshToolbar()
    }
  }

  /**
   * 切换换行模式
   */
  private toggleWrap() {
    if (!this.currentBlock) return

    const code = this.currentBlock.querySelector('code') as HTMLElement
    if (code) {
      const isWrap = code.style.whiteSpace === 'pre-wrap'
      code.style.whiteSpace = isWrap ? 'pre' : 'pre-wrap'
      code.style.wordBreak = isWrap ? 'normal' : 'break-word'
      
      // 更新按钮状态
      this.refreshToolbar()
    }
  }

  /**
   * 复制代码
   */
  private copyCode() {
    if (!this.currentBlock) return

    const code = this.currentBlock.querySelector('code')
    const text = code?.textContent || ''

    navigator.clipboard.writeText(text).then(() => {
      this.showToast('代码已复制到剪贴板')
    }).catch(() => {
      this.showToast('复制失败', false)
    })
  }

  /**
   * 显示提示
   */
  private showToast(message: string, success = true) {
    const toast = document.createElement('div')
    toast.className = 'code-toolbar-toast'
    toast.textContent = message
    if (!success) {
      toast.style.background = '#ef4444'
    }
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.remove()
    }, 2000)
  }

  /**
   * 切换语言
   */
  private changeLanguage(language: string) {
    if (!this.currentBlock) return

    const code = this.currentBlock.querySelector('code')
    const pre = this.currentBlock.querySelector('pre')
    const langLabel = this.currentBlock.querySelector('div > span:first-child')

    if (code) {
      // 更新类名
      code.className = language === 'plaintext' ? '' : `language-${language}`
    }

    if (pre) {
      pre.setAttribute('data-language', language)
    }

    if (langLabel) {
      langLabel.textContent = language === 'plaintext' ? 'CODE' : language.toUpperCase()
    }

    // 触发重新高亮（如果有）
    this.triggerHighlight(code as HTMLElement, language)
    this.triggerUpdate()
  }

  /**
   * 切换主题
   */
  private changeTheme(theme: string) {
    if (!this.currentBlock) return

    const themeConfig = THEMES.find(t => t.value === theme)
    if (!themeConfig) return

    this.currentBlock.setAttribute('data-theme', theme)
    this.currentBlock.style.background = themeConfig.bg

    const code = this.currentBlock.querySelector('code') as HTMLElement
    if (code) {
      code.style.color = themeConfig.fg
    }

    const header = this.currentBlock.querySelector('div:first-child') as HTMLElement
    if (header) {
      // 暗色主题用暗色背景，亮色主题用亮色背景
      const isDark = ['oneDark', 'monokai', 'dracula', 'nord'].includes(theme)
      header.style.background = isDark ? '#21252b' : '#f5f5f5'
      header.style.borderBottomColor = isDark ? '#3a3f4a' : '#e5e7eb'
      
      // 更新标签和按钮颜色
      const label = header.querySelector('span')
      const button = header.querySelector('button')
      if (label) {
        label.style.color = isDark ? '#7f848e' : '#6b7280'
      }
      if (button) {
        button.style.color = isDark ? '#abb2bf' : '#374151'
      }
    }

    const lineNumbers = this.currentBlock.querySelector('.line-numbers') as HTMLElement
    if (lineNumbers) {
      const isDark = ['oneDark', 'monokai', 'dracula', 'nord'].includes(theme)
      lineNumbers.style.background = isDark ? '#21252b' : '#f5f5f5'
      lineNumbers.style.color = isDark ? '#5c6370' : '#6b7280'
      lineNumbers.style.borderRightColor = isDark ? '#3a3f4a' : '#e5e7eb'
    }

    this.triggerUpdate()
  }

  /**
   * 触发语法高亮
   */
  private triggerHighlight(code: HTMLElement, language: string) {
    // 尝试使用已有的高亮函数
    // 这里需要导入代码块插件中的高亮函数，或者重新实现
    // 暂时不处理，保留原有高亮
  }

  /**
   * 删除代码块
   */
  private deleteBlock() {
    if (!this.currentBlock) return

    if (confirm('确定要删除这个代码块吗？')) {
      this.currentBlock.remove()
      this.hideToolbar()
      this.triggerUpdate()
    }
  }

  /**
   * 刷新工具栏
   */
  private refreshToolbar() {
    if (!this.currentBlock) return

    const block = this.currentBlock
    this.hideToolbar()
    this.selectBlock(block)
  }

  /**
   * 触发编辑器更新
   */
  private triggerUpdate() {
    const editorContent = document.querySelector('.ldesign-editor-content')
    if (editorContent) {
      const event = new Event('input', { bubbles: true })
      editorContent.dispatchEvent(event)
    }
  }

  /**
   * 销毁
   */
  destroy() {
    this.hideToolbar()
  }
}

// 工具栏实例
let codeToolbarInstance: CodeToolbar | null = null

/**
 * 代码块工具栏插件
 */
export const CodeBlockToolbarPlugin: Plugin = createPlugin({
  name: 'codeBlockToolbar',
  init: () => {
    if (!codeToolbarInstance) {
      codeToolbarInstance = new CodeToolbar()
    }
  },
  destroy: () => {
    if (codeToolbarInstance) {
      codeToolbarInstance.destroy()
      codeToolbarInstance = null
    }
  },
})
