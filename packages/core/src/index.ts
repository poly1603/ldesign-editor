/**
 * @ldesign/editor-core
 * 框架无关的富文本编辑器核心库
 * 
 * @packageDocumentation
 * 
 * 注意：实际的源代码需要从 ../../src/ 目录复制到这个包的 src/ 目录中
 * 这是一个占位符文件，展示了应该导出的API结构
 */

// 临时：从根目录的src导出（实际发布时需要复制代码到这个包内）
// 这样做是为了快速演示架构，实际使用时需要重新组织代码

/**
 * 核心编辑器类
 * 
 * @example
 * ```typescript
 * import { Editor } from '@ldesign/editor-core'
 * 
 * const editor = new Editor({
 *   content: '<p>Hello World</p>',
 *   virtualScroll: { enabled: true },
 *   wasm: { enabled: true }
 * })
 * 
 * editor.mount('#app')
 * ```
 */
export class Editor {
  version = '2.0.0'

  constructor(options: any = {}) {
    console.log('Editor initialized with options:', options)
  }

  mount(element: string | HTMLElement) {
    console.log('Editor mounted to:', element)
  }

  getContent(): string {
    return ''
  }

  setContent(content: string) {
    console.log('Content set:', content)
  }

  destroy() {
    console.log('Editor destroyed')
  }
}

// 类型定义
export interface EditorOptions {
  content?: string
  placeholder?: string
  virtualScroll?: { enabled: boolean; maxLines?: number }
  wasm?: { enabled: boolean }
  ai?: { provider?: string; apiKey?: string }
  pwa?: { enabled: boolean }
  [key: string]: any
}

// 版本信息
export const VERSION = '2.0.0'

// 默认导出
export default Editor

// ============================================================================
// 说明
// ============================================================================
// 
// 实际使用时，请将 ../../src/ 目录的完整代码复制到 packages/core/src/
// 然后从本地文件导出，而不是引用外部目录
// 
// 当前这是一个简化的占位符实现，用于演示Monorepo架构
// 
// ============================================================================

