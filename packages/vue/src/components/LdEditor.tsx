/**
 * LdEditor - Vue 3 编辑器组件
 */

import { defineComponent, onMounted, onUnmounted, ref, watch, type PropType } from 'vue'
import type { EditorOptions } from '@ldesign/editor-core'
import { Editor } from '@ldesign/editor-core'

export interface EditorProps extends Omit<EditorOptions, 'onChange' | 'onUpdate'> {
  /** v-model绑定的内容 */
  modelValue?: string
}

export interface EditorEmits {
  /** 内容更新事件 */
  'update:modelValue': [value: string]
  /** 变化事件 */
  'change': [content: string]
  /** 聚焦事件 */
  'focus': []
  /** 失焦事件 */
  'blur': []
}

export interface EditorInstance {
  /** 编辑器实例 */
  editor: Editor | null
  /** 获取内容 */
  getContent: () => string
  /** 设置内容 */
  setContent: (content: string) => void
  /** 聚焦 */
  focus: () => void
}

/**
 * LDesign 编辑器 Vue 组件
 * 
 * @example
 * ```vue
 * <template>
 *   <LdEditor v-model="content" placeholder="开始输入..." />
 * </template>
 * 
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { LdEditor } from '@ldesign/editor-vue'
 * 
 * const content = ref('<p>Hello World</p>')
 * </script>
 * ```
 */
export const LdEditor = defineComponent({
  name: 'LdEditor',

  props: {
    /**
     * 编辑器内容（v-model）
     */
    modelValue: {
      type: String,
      default: ''
    },

    /**
     * 占位符文本
     */
    placeholder: {
      type: String,
      default: ''
    },

    /**
     * 是否只读
     */
    readonly: {
      type: Boolean,
      default: false
    },

    /**
     * 是否自动聚焦
     */
    autofocus: {
      type: Boolean,
      default: false
    },

    /**
     * 虚拟滚动配置
     */
    virtualScroll: {
      type: Object as PropType<EditorOptions['virtualScroll']>,
      default: undefined
    },

    /**
     * WASM加速配置
     */
    wasm: {
      type: Object as PropType<EditorOptions['wasm']>,
      default: undefined
    },

    /**
     * AI配置
     */
    ai: {
      type: Object as PropType<EditorOptions['ai']>,
      default: undefined
    },

    /**
     * PWA配置
     */
    pwa: {
      type: Object as PropType<EditorOptions['pwa']>,
      default: undefined
    },

    /**
     * 调试面板配置
     */
    debugPanel: {
      type: Object as PropType<EditorOptions['debugPanel']>,
      default: undefined
    },

    /**
     * 插件列表
     */
    plugins: {
      type: Array as PropType<EditorOptions['plugins']>,
      default: () => []
    }
  },

  emits: {
    /**
     * v-model更新事件
     */
    'update:modelValue': (value: string) => true,

    /**
     * 内容变化事件
     */
    'change': (content: string) => true,

    /**
     * 聚焦事件
     */
    'focus': () => true,

    /**
     * 失焦事件
     */
    'blur': () => true
  },

  setup(props, { emit, expose }) {
    const containerRef = ref<HTMLDivElement>()
    let editor: Editor | null = null

    onMounted(() => {
      if (!containerRef.value) return

      // 创建编辑器实例
      editor = new Editor({
        content: props.modelValue,
        placeholder: props.placeholder,
        autofocus: props.autofocus,
        virtualScroll: props.virtualScroll,
        wasm: props.wasm,
        ai: props.ai,
        pwa: props.pwa,
        debugPanel: props.debugPanel,
        plugins: props.plugins,

        // 事件处理
        onChange: (content: string) => {
          emit('update:modelValue', content)
          emit('change', content)
        },

        onFocus: () => {
          emit('focus')
        },

        onBlur: () => {
          emit('blur')
        }
      })

      // 挂载编辑器
      editor.mount(containerRef.value)
    })

    // 监听 modelValue 变化
    watch(() => props.modelValue, (newValue) => {
      if (editor && newValue !== editor.getContent?.()) {
        editor.setContent?.(newValue)
      }
    })

    // 监听只读状态
    watch(() => props.readonly, (readonly) => {
      if (editor) {
        editor.setEditable?.(!readonly)
      }
    })

    onUnmounted(() => {
      editor?.destroy?.()
      editor = null
    })

    // 暴露方法给父组件
    const instance: EditorInstance = {
      editor,
      getContent: () => editor?.getContent?.() || '',
      setContent: (content: string) => editor?.setContent?.(content),
      focus: () => editor?.focus?.()
    }

    expose(instance)

    return () => (
      <div
        ref={containerRef}
        class="ld-editor-vue-wrapper"
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    )
  }
})

export default LdEditor


