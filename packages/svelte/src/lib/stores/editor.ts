import { writable, derived } from 'svelte/store'
import type { Editor } from '@ldesign/editor-core'

export function createEditorStore() {
  const editor = writable<Editor | null>(null)
  const content = writable<string>('')
  const isReady = writable<boolean>(false)

  const canUndo = derived(editor, ($editor) => {
    return $editor?.commands?.canUndo() ?? false
  })

  const canRedo = derived(editor, ($editor) => {
    return $editor?.commands?.canRedo() ?? false
  })

  return {
    editor,
    content,
    isReady,
    canUndo,
    canRedo,
  }
}
