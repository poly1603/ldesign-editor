import { useEffect, useRef, useState } from 'preact/hooks'
import { Editor } from '@ldesign/editor-core'
import type { EditorOptions } from '@ldesign/editor-core'

export interface UseEditorOptions extends EditorOptions {
  initialContent?: string
}

export function useEditor(options: UseEditorOptions = {}) {
  const [editor, setEditor] = useState<Editor | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [content, setContent] = useState(options.initialContent || '')

  useEffect(() => {
    const instance = new Editor({
      ...options,
      content: options.initialContent || options.content,
    })

    instance.on('update', () => {
      setContent(instance.getContent())
    })

    setEditor(instance)
    setIsReady(true)

    return () => {
      instance.destroy()
    }
  }, [])

  return {
    editor,
    isReady,
    content,
    setContent: (html: string) => {
      editor?.setContent(html)
    },
  }
}
