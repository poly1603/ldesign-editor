/**
 * LdEditor - React编辑器组件
 */

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { Editor, type EditorOptions } from '@ldesign/editor-core'

export interface EditorProps extends Omit<EditorOptions, 'onChange'> {
  /** 编辑器内容 */
  value?: string
  /** 默认内容 */
  defaultValue?: string
  /** 内容变化回调 */
  onChange?: (content: string) => void
  /** 聚焦回调 */
  onFocus?: () => void
  /** 失焦回调 */
  onBlur?: () => void
  /** 容器样式 */
  style?: React.CSSProperties
  /** 容器类名 */
  className?: string
}

export interface EditorRef {
  /** 编辑器实例 */
  editor: Editor | null
  /** 获取内容 */
  getContent: () => string
  /** 设置内容 */
  setContent: (content: string) => void
  /** 聚焦 */
  focus: () => void
  /** 获取DOM元素 */
  getElement: () => HTMLDivElement | null
}

/**
 * LDesign 编辑器 React 组件
 * 
 * @example
 * ```tsx
 * import { LdEditor } from '@ldesign/editor-react'
 * import { useState } from 'react'
 * 
 * function App() {
 *   const [content, setContent] = useState('<p>Hello World</p>')
 *   
 *   return (
 *     <LdEditor
 *       value={content}
 *       onChange={setContent}
 *       placeholder="开始输入..."
 *     />
 *   )
 * }
 * ```
 */
export const LdEditor = forwardRef<EditorRef, EditorProps>((props, ref) => {
  const {
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    style,
    className,
    ...editorOptions
  } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<Editor | null>(null)
  const isControlled = value !== undefined

  // 初始化编辑器
  useEffect(() => {
    if (!containerRef.current) return

    // 创建编辑器实例
    editorRef.current = new Editor({
      content: isControlled ? value : defaultValue,
      ...editorOptions,
      onChange: (content: string) => {
        onChange?.(content)
      },
      onFocus: () => {
        onFocus?.()
      },
      onBlur: () => {
        onBlur?.()
      }
    })

    // 挂载编辑器
    editorRef.current.mount(containerRef.current)

    return () => {
      editorRef.current?.destroy?.()
      editorRef.current = null
    }
  }, []) // 仅初始化一次

  // 受控模式：同步 value 到编辑器
  useEffect(() => {
    if (isControlled && editorRef.current && value !== editorRef.current.getContent?.()) {
      editorRef.current.setContent?.(value)
    }
  }, [value, isControlled])

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    editor: editorRef.current,
    getContent: () => editorRef.current?.getContent?.() || '',
    setContent: (content: string) => editorRef.current?.setContent?.(content),
    focus: () => editorRef.current?.focus?.(),
    getElement: () => containerRef.current
  }))

  return (
    <div
      ref={containerRef}
      className={`ld-editor-react-wrapper ${className || ''}`}
      style={{
        width: '100%',
        height: '100%',
        ...style
      }}
    />
  )
})

LdEditor.displayName = 'LdEditor'

export default LdEditor


