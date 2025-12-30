/**
 * useEditor composable
 * 在 Vue 组件中使用编辑器的组合式函数
 */

import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { Editor, type EditorOptions } from '@ldesign/editor-core'

export interface UseEditorOptions extends EditorOptions {
  /** 容器元素或选择器 */
  container?: HTMLElement | string
  /** 是否自动挂载 */
  autoMount?: boolean
}

export interface UseEditorReturn {
  /** 编辑器实例 */
  editor: Ref<Editor | null>
  /** 编辑器内容 */
  content: Ref<string>
  /** 是否准备就绪 */
  ready: Ref<boolean>
  /** 获取HTML内容 */
  getHTML: () => string
  /** 设置HTML内容 */
  setHTML: (content: string) => void
  /** 插入HTML */
  insertHTML: (html: string) => void
  /** 聚焦编辑器 */
  focus: () => void
  /** 销毁编辑器 */
  destroy: () => void
}

/**
 * 使用编辑器
 * 
 * @param options - 编辑器配置选项
 * @returns 编辑器实例和辅助方法
 * 
 * @example
 * ```typescript
 * import { useEditor } from '@ldesign/editor-vue'
 * 
 * const { editor, content, ready, setContent } = useEditor({
 *   content: '<p>Hello</p>',
 *   placeholder: '开始输入...',
 *   onChange: (html) => {
 *     console.log('内容变化:', html)
 *   }
 * })
 * 
 * // 在 onMounted 中挂载
 * onMounted(() => {
 *   editor.value?.mount('#editor')
 * })
 * ```
 */
export function useEditor(options: UseEditorOptions = {}): UseEditorReturn {
  const editor = ref<Editor | null>(null)
  const content = ref<string>(typeof options.content === 'string' ? options.content : '')
  const ready = ref(false)

  onMounted(() => {
    // 创建编辑器实例
    editor.value = new Editor({
      ...options,
      onChange: (html: string) => {
        content.value = html
        options.onChange?.(html)
      }
    })

    // 自动挂载
    if (options.autoMount !== false && options.container) {
      editor.value.mount(options.container)
      ready.value = true
    }
  })

  onUnmounted(() => {
    destroy()
  })

  /**
   * 获取HTML内容
   */
  const getHTML = (): string => {
    return editor.value?.getHTML?.() || content.value
  }

  /**
   * 设置HTML内容
   */
  const setHTML = (newContent: string): void => {
    content.value = newContent
    editor.value?.setHTML?.(newContent)
  }

  /**
   * 插入HTML
   */
  const insertHTML = (html: string): void => {
    editor.value?.insertHTML?.(html)
  }

  /**
   * 聚焦编辑器
   */
  const focus = (): void => {
    editor.value?.focus?.()
  }

  /**
   * 销毁编辑器
   */
  const destroy = (): void => {
    editor.value?.destroy?.()
    editor.value = null
    ready.value = false
  }

  return {
    editor,
    content,
    ready,
    getHTML,
    setHTML,
    insertHTML,
    focus,
    destroy
  }
}


