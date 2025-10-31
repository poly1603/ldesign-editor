import { h } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { Editor as CoreEditor } from '@ldesign/editor-core'
import type { EditorOptions } from '@ldesign/editor-core'

export interface EditorProps extends Partial<EditorOptions> {
  content?: string
  onChange?: (html: string) => void
  className?: string
  style?: h.JSX.CSSProperties
}

export function Editor(props: EditorProps) {
  const { content, onChange, className, style, ...editorOptions } = props
  const editorRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<CoreEditor | null>(null)

  useEffect(() => {
    if (!editorRef.current)
      return

    instanceRef.current = new CoreEditor({
      element: editorRef.current,
      content: content || '',
      ...editorOptions,
    })

    if (onChange) {
      instanceRef.current.on('update', () => {
        const html = instanceRef.current!.getContent()
        onChange(html)
      })
    }

    return () => {
      instanceRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (instanceRef.current && content !== undefined) {
      const currentContent = instanceRef.current.getContent()
      if (currentContent !== content) {
        instanceRef.current.setContent(content)
      }
    }
  }, [content])

  return (
    <div
      ref={editorRef}
      className={className}
      style={style}
    />
  )
}
