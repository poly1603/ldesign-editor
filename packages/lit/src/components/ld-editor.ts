/**
 * LdEditor - Lit Web Component
 */

import { LitElement, html, css } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import { Editor, type EditorOptions } from '@ldesign/editor-core'

/**
 * LDesign 编辑器 Web Component
 * 
 * @element ld-editor
 * 
 * @example
 * ```html
 * <ld-editor 
 *   content="<p>Hello World</p>" 
 *   placeholder="开始输入..."
 *   .on-change="${(e) => console.log(e.detail)}"
 * ></ld-editor>
 * ```
 * 
 * @fires change - 内容变化事件
 * @fires focus - 聚焦事件
 * @fires blur - 失焦事件
 */
@customElement('ld-editor')
export class LdEditor extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    
    .editor-container {
      width: 100%;
      height: 100%;
    }
  `

  /**
   * 编辑器内容
   */
  @property({ type: String })
  content = ''

  /**
   * 占位符文本
   */
  @property({ type: String })
  placeholder = ''

  /**
   * 是否只读
   */
  @property({ type: Boolean })
  readonly = false

  /**
   * 是否自动聚焦
   */
  @property({ type: Boolean })
  autofocus = false

  /**
   * 是否启用虚拟滚动
   */
  @property({ type: Boolean, attribute: 'virtual-scroll' })
  virtualScroll = false

  /**
   * 是否启用WASM加速
   */
  @property({ type: Boolean, attribute: 'wasm' })
  wasm = false

  /**
   * AI提供商
   */
  @property({ type: String, attribute: 'ai-provider' })
  aiProvider = ''

  /**
   * 容器元素
   */
  @query('.editor-container')
  private containerElement?: HTMLDivElement

  /**
   * 编辑器实例
   */
  @state()
  private editor: Editor | null = null

  override connectedCallback(): void {
    super.connectedCallback()
  }

  override firstUpdated(): void {
    this.initializeEditor()
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.destroyEditor()
  }

  /**
   * 初始化编辑器
   */
  private initializeEditor(): void {
    if (!this.containerElement) return

    const options: EditorOptions = {
      content: this.content,
      placeholder: this.placeholder,
      autofocus: this.autofocus,

      // 虚拟滚动
      virtualScroll: this.virtualScroll ? { enabled: true } : undefined,

      // WASM加速
      wasm: this.wasm ? { enabled: true } : undefined,

      // AI配置
      ai: this.aiProvider ? { provider: this.aiProvider as any } : undefined,

      // 事件处理
      onChange: (content: string) => {
        this.content = content
        this.dispatchEvent(new CustomEvent('change', {
          detail: content,
          bubbles: true,
          composed: true
        }))
      },

      onFocus: () => {
        this.dispatchEvent(new Event('focus', {
          bubbles: true,
          composed: true
        }))
      },

      onBlur: () => {
        this.dispatchEvent(new Event('blur', {
          bubbles: true,
          composed: true
        }))
      }
    }

    this.editor = new Editor(options)
    this.editor.mount(this.containerElement)
  }

  /**
   * 销毁编辑器
   */
  private destroyEditor(): void {
    this.editor?.destroy?.()
    this.editor = null
  }

  /**
   * 监听属性变化
   */
  override updated(changedProperties: Map<string, any>): void {
    // 内容变化
    if (changedProperties.has('content') && this.editor) {
      const currentContent = this.editor.getContent?.()
      if (this.content !== currentContent) {
        this.editor.setContent?.(this.content)
      }
    }

    // 只读状态变化
    if (changedProperties.has('readonly') && this.editor) {
      this.editor.setEditable?.(!this.readonly)
    }
  }

  /**
   * 获取内容
   */
  getContent(): string {
    return this.editor?.getContent?.() || this.content
  }

  /**
   * 设置内容
   */
  setContent(content: string): void {
    this.content = content
    this.editor?.setContent?.(content)
  }

  /**
   * 聚焦编辑器
   */
  focus(): void {
    this.editor?.focus?.()
  }

  override render() {
    return html`
      <div class="editor-container"></div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ld-editor': LdEditor
  }
}


