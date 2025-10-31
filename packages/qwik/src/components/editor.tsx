import { component$, useSignal, useVisibleTask$, $, type QRL } from '@builder.io/qwik'
import { Editor as CoreEditor } from '@ldesign/editor-core'
import type { EditorOptions } from '@ldesign/editor-core'

export interface EditorProps extends Partial<EditorOptions> {
  content?: string
  onUpdate$?: QRL<(html: string) => void>
  class?: string
}

export const Editor = component$<EditorProps>((props) => {
  const editorRef = useSignal<HTMLDivElement>()
  const editorInstance = useSignal<CoreEditor>()

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    if (!editorRef.value)
      return

    const instance = new CoreEditor({
      element: editorRef.value,
      content: props.content || '',
      editable: props.editable,
      plugins: props.plugins,
    })

    editorInstance.value = instance

    if (props.onUpdate$) {
      const updateHandler = $(() => {
        const html = instance.getContent()
        props.onUpdate$?.(html)
      })

      instance.on('update', updateHandler)
    }

    cleanup(() => {
      instance.destroy()
    })
  })

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => props.content)

    if (editorInstance.value && props.content !== undefined) {
      const currentContent = editorInstance.value.getContent()
      if (currentContent !== props.content) {
        editorInstance.value.setContent(props.content)
      }
    }
  })

  return (
    <div
      ref={editorRef}
      class={props.class || 'ldesign-editor'}
    />
  )
})
