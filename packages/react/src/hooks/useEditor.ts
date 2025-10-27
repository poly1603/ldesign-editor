/**
 * useEditor Hook
 * React Hook for using the editor
 */

import { useState, useEffect, useRef } from 'react'
import { Editor, type EditorOptions } from '@ldesign/editor-core'

export interface UseEditorOptions extends EditorOptions {
  /** 是否自动挂载 */
  autoMount?: boolean
}

export interface UseEditorReturn {
  /** 编辑器实例 */
  editor: Editor | null
  /** 编辑器内容 */
  content: string
  /** 是否准备就绪 */
  ready: boolean
  /** 容器ref */
  containerRef: React.RefObject<HTMLDivElement>
  /** 获取内容 */
  getContent: () => string
  /** 设置内容 */
  setContent: (content: string) => void
  /** 插入文本 */
  insertText: (text: string) => void
  /** 聚焦 */
  focus: () => void
}

/**
 * 使用编辑器 Hook
 * 
 * @param options - 编辑器配置选项
 * @returns 编辑器实例和辅助方法
 * 
 * @example
 * ```tsx
 * import { useEditor } from '@ldesign/editor-react'
 * 
 * function MyEditor() {
 *   const { containerRef, content, setContent } = useEditor({
 *     content: '<p>Hello</p>',
 *     placeholder: '开始输入...',
 *     onChange: (html) => console.log(html)
 *   })
 *   
 *   return <div ref={containerRef} />
 * }
 * ```
 */
export function useEditor(options: UseEditorOptions = {}): UseEditorReturn {
  const [content, setContent] = useState<string>(options.content || '')
  const [ready, setReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<Editor | null>(null)

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return

    // 创建编辑器实例
    editorRef.current = new Editor({
      ...options,
      onChange: (html: string) => {
        setContent(html)
        options.onChange?.(html)
      }
    })

    // 挂载编辑器
    if (options.autoMount !== false) {
      editorRef.current.mount(containerRef.current)
      setReady(true)
    }

    return () => {
      editorRef.current?.destroy?.()
      editorRef.current = null
      setReady(false)
    }
  }, [])

  return {
    editor: editorRef.current,
    content,
    ready,
    containerRef,
    getContent: () => editorRef.current?.getContent?.() || content,
    setContent: (newContent: string) => {
      setContent(newContent)
      editorRef.current?.setContent?.(newContent)
    },
    insertText: (text: string) => editorRef.current?.insertText?.(text),
    focus: () => editorRef.current?.focus?.()
  }
}


