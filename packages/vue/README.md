# @ldesign/editor-vue

> LDesign Editor 的 Vue 3 组件封装

## 安装

```bash
pnpm add @ldesign/editor-vue
```

## 使用

### 组件方式

```vue
<template>
  <LdEditor
    v-model="content"
    placeholder="开始输入..."
    :virtual-scroll="{ enabled: true }"
    :wasm="{ enabled: true }"
    @change="handleChange"
    @focus="handleFocus"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LdEditor } from '@ldesign/editor-vue'

const content = ref('<p>Hello Vue!</p>')

const handleChange = (newContent: string) => {
  console.log('内容变化:', newContent)
}

const handleFocus = () => {
  console.log('获得焦点')
}
</script>
```

### Composable方式

```vue
<template>
  <div ref="container" />
  <button @click="insertText('测试')">插入文本</button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEditor } from '@ldesign/editor-vue'

const container = ref<HTMLDivElement>()

const { editor, content, setContent, insertText } = useEditor({
  content: '<p>Hello!</p>',
  autoMount: false
})

onMounted(() => {
  if (container.value && editor.value) {
    editor.value.mount(container.value)
  }
})
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | string | '' | 编辑器内容（v-model） |
| placeholder | string | '' | 占位符文本 |
| readonly | boolean | false | 是否只读 |
| autofocus | boolean | false | 是否自动聚焦 |
| virtualScroll | object | undefined | 虚拟滚动配置 |
| wasm | object | undefined | WASM配置 |
| ai | object | undefined | AI配置 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | (content: string) | 内容更新 |
| change | (content: string) | 内容变化 |
| focus | () | 获得焦点 |
| blur | () | 失去焦点 |

## 运行Demo

```bash
cd demo
pnpm dev
```

访问 http://localhost:3001

## License

MIT


