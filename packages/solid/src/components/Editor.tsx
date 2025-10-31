import type { Component, JSX } from 'solid-js'
import { onMount, onCleanup, createEffect } from 'solid-js'
import { Editor as CoreEditor } from '@ldesign/editor-core'
import type { EditorOptions } from '@ldesign/editor-core'

export interface EditorProps extends Partial<EditorOptions> {
  content?: string
  onUpdate?: (html: string) => void
  class?: string
  style?: JSX.CSSProperties
}

export const Editor: Component<EditorProps> = (props) => {
  let editorRef: HTMLDivElement
  let editorInstance: CoreEditor | null = null

  onMount(() => {
    editorInstance = new CoreEditor({
      element: editorRef,
      content: props.content || '',
      editable: props.editable,
      plugins: props.plugins,
    })

    if (props.onUpdate) {
      editorInstance.on('update', () => {
        const html = editorInstance!.getContent()
        props.onUpdate?.(html)
      })
    }
  })

  createEffect(() => {
    if (editorInstance && props.content !== undefined) {
      const currentContent = editorInstance.getContent()
      if (currentContent !== props.content) {
        editorInstance.setContent(props.content)
      }
    }
  })

  onCleanup(() => {
    editorInstance?.destroy()
  })

  return (
    <div
      ref={editorRef!}
      class={props.class}
      style={props.style}
    />
  )
}
