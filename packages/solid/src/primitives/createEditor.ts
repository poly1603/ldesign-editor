import { createSignal, onCleanup, onMount } from 'solid-js'
import { Editor } from '@ldesign/editor-core'
import type { EditorOptions } from '@ldesign/editor-core'

export interface CreateEditorOptions extends EditorOptions {
  initialContent?: string
}

export function createEditor(options: CreateEditorOptions = {}) {
  const [editor, setEditor] = createSignal<Editor | null>(null)
  const [isReady, setIsReady] = createSignal(false)

  onMount(() => {
    const instance = new Editor({
      ...options,
      content: options.initialContent || options.content,
    })

    setEditor(instance)
    setIsReady(true)
  })

  onCleanup(() => {
    editor()?.destroy()
  })

  return {
    editor,
    isReady,
  }
}
