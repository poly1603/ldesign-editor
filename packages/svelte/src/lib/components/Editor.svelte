<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Editor as CoreEditor } from '@ldesign/editor-core'
  import type { EditorOptions } from '@ldesign/editor-core'

  export let content: string = ''
  export let editable: boolean = true
  export let plugins: string[] = []
  export let options: Partial<EditorOptions> = {}

  let editorElement: HTMLDivElement
  let editorInstance: CoreEditor | null = null

  onMount(() => {
    editorInstance = new CoreEditor({
      element: editorElement,
      content,
      editable,
      plugins,
      ...options,
    })

    editorInstance.on('update', () => {
      if (editorInstance) {
        content = editorInstance.getContent()
      }
    })
  })

  onDestroy(() => {
    editorInstance?.destroy()
  })

  $: if (editorInstance) {
    const currentContent = editorInstance.getContent()
    if (currentContent !== content) {
      editorInstance.setContent(content)
    }
  }
</script>

<div bind:this={editorElement} class="ldesign-editor" />

<style>
  .ldesign-editor {
    min-height: 200px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 12px;
  }
</style>
