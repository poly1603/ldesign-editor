# 🚀 快速开始指南

## 📦 选择合适的包

根据你的项目选择对应的包：

| 项目类型 | 推荐包 | 安装命令 |
|---------|--------|----------|
| 原生JS/TS | `@ldesign/editor-core` | `pnpm add @ldesign/editor-core` |
| Vue 3 | `@ldesign/editor-vue` | `pnpm add @ldesign/editor-vue` |
| React 18+ | `@ldesign/editor-react` | `pnpm add @ldesign/editor-react` |
| 任何框架 | `@ldesign/editor-lit` | `pnpm add @ldesign/editor-lit` |

---

## 🎯 核心库（Core）

### 安装

```bash
pnpm add @ldesign/editor-core
```

### 使用

```typescript
import { Editor } from '@ldesign/editor-core'

const editor = new Editor({
  content: '<p>Hello World!</p>',
  placeholder: '开始输入...',
  virtualScroll: { enabled: true },  // 虚拟滚动
  wasm: { enabled: true },           // WASM加速
  onChange: (content) => {
    console.log('内容更新:', content)
  }
})

editor.mount('#editor')
```

### 运行Demo

```bash
cd packages/core/demo
pnpm dev
# 访问 http://localhost:3000
```

---

## 📘 Vue 封装

### 安装

```bash
pnpm add @ldesign/editor-vue
```

### 组件方式

```vue
<template>
  <LdEditor
    v-model="content"
    placeholder="开始输入..."
    :virtual-scroll="{ enabled: true }"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LdEditor } from '@ldesign/editor-vue'

const content = ref('<p>Hello Vue!</p>')

const handleChange = (newContent: string) => {
  console.log('内容变化:', newContent)
}
</script>
```

### Composable方式

```vue
<template>
  <div ref="editorContainer" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEditor } from '@ldesign/editor-vue'

const editorContainer = ref<HTMLDivElement>()

const { editor, content, setContent } = useEditor({
  content: '<p>Hello Vue!</p>',
  autoMount: false
})

onMounted(() => {
  if (editorContainer.value && editor.value) {
    editor.value.mount(editorContainer.value)
  }
})
</script>
```

### 运行Demo

```bash
cd packages/vue/demo
pnpm dev
# 访问 http://localhost:3001
```

---

## ⚛️ React 封装

### 安装

```bash
pnpm add @ldesign/editor-react
```

### 组件方式

```tsx
import { LdEditor } from '@ldesign/editor-react'
import { useState } from 'react'

function App() {
  const [content, setContent] = useState('<p>Hello React!</p>')
  
  return (
    <LdEditor
      value={content}
      onChange={setContent}
      placeholder="开始输入..."
      virtualScroll={{ enabled: true }}
      wasm={{ enabled: true }}
    />
  )
}
```

### Hook方式

```tsx
import { useEditor } from '@ldesign/editor-react'

function App() {
  const { containerRef, content, setContent } = useEditor({
    content: '<p>Hello React!</p>',
    placeholder: '开始输入...'
  })
  
  return <div ref={containerRef} />
}
```

### 运行Demo

```bash
cd packages/react/demo
pnpm dev
# 访问 http://localhost:3002
```

---

## 🔥 Lit Web Component

### 安装

```bash
pnpm add @ldesign/editor-lit
```

### 使用（任何框架）

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import '@ldesign/editor-lit'
  </script>
</head>
<body>
  <ld-editor
    id="myEditor"
    content="<p>Hello Web Components!</p>"
    placeholder="开始输入..."
    virtual-scroll
    wasm
  ></ld-editor>
  
  <script>
    const editor = document.getElementById('myEditor')
    
    editor.addEventListener('change', (e) => {
      console.log('内容变化:', e.detail)
    })
    
    // 调用方法
    editor.setContent('<p>新内容</p>')
    const content = editor.getContent()
  </script>
</body>
</html>
```

### 在Vue中使用

```vue
<template>
  <ld-editor
    :content="content"
    @change="handleChange"
  />
</template>
```

### 在React中使用

```tsx
import '@ldesign/editor-lit'

function App() {
  return (
    <ld-editor
      content="<p>Hello</p>"
      onchange={(e) => console.log(e.detail)}
    />
  )
}
```

### 运行Demo

```bash
cd packages/lit/demo
pnpm dev
# 访问 http://localhost:3003
```

---

## 🛠️ 开发者指南

### 本地开发

```bash
# 1. 克隆项目
git clone https://github.com/ldesign/ldesign.git
cd libraries/editor

# 2. 安装依赖
pnpm install

# 3. 构建所有包
pnpm build:all

# 4. 运行演示
pnpm demo:vue    # Vue demo
pnpm demo:react  # React demo
pnpm demo:lit    # Lit demo
pnpm demo:core   # Core demo
```

### 开发单个包

```bash
# 开发core包
cd packages/core
pnpm dev  # 监听模式

# 在另一个终端运行demo
cd packages/core/demo
pnpm dev
```

### 构建流程

```bash
# 构建顺序（重要！）
pnpm build:core    # 1. 先构建core
pnpm build:vue     # 2. 再构建vue
pnpm build:react   # 3. 再构建react
pnpm build:lit     # 4. 最后构建lit

# 或一键构建
pnpm build:all
```

---

## 📊 包大小对比

| 包名 | Gzip后大小 | 包含内容 |
|------|-----------|----------|
| @ldesign/editor-core | ~80KB | 核心功能 + 所有高级特性 |
| @ldesign/editor-vue | ~85KB | Core + Vue组件 |
| @ldesign/editor-react | ~90KB | Core + React组件 |
| @ldesign/editor-lit | ~82KB | Core + Lit组件 |

*注：框架封装层仅增加5-10KB*

---

## 🎨 高级功能使用

### 虚拟滚动（所有包都支持）

```typescript
// Core
const editor = new Editor({
  virtualScroll: { enabled: true, maxLines: 1000000 }
})

// Vue
<LdEditor :virtual-scroll="{ enabled: true }" />

// React
<LdEditor virtualScroll={{ enabled: true }} />

// Lit
<ld-editor virtual-scroll></ld-editor>
```

### AI功能

```typescript
// Core
const editor = new Editor({
  ai: {
    provider: 'qwen',
    apiKey: 'YOUR_KEY'
  }
})

// Vue
<LdEditor :ai="{ provider: 'qwen', apiKey: 'KEY' }" />

// React
<LdEditor ai={{ provider: 'qwen', apiKey: 'KEY' }} />

// Lit（需要通过JS配置）
const editor = document.querySelector('ld-editor')
editor.editor.ai.setProvider('qwen')
```

### PWA离线

```typescript
import { PWAManager } from '@ldesign/editor-core'

const pwa = new PWAManager({ enabled: true })
await pwa.initialize()
```

### 协作编辑

```typescript
import { CollaborationManager } from '@ldesign/editor-core'

const collab = new CollaborationManager(editor, {
  user: { id: '1', name: '张三' },
  serverUrl: 'wss://server.com/collab'
})

await collab.connect()
```

---

## 🎁 完整示例

查看各个包的demo项目，包含完整的使用示例：

1. **Core**: `packages/core/demo`
2. **Vue**: `packages/vue/demo`
3. **React**: `packages/react/demo`
4. **Lit**: `packages/lit/demo`

每个demo都展示了：
- ✅ 基础编辑功能
- ✅ 高级特性配置
- ✅ 事件处理
- ✅ 方法调用

---

## 📚 更多资源

- 📖 [Monorepo架构说明](./MONOREPO_STRUCTURE.md)
- 🔄 [迁移指南](./MIGRATION_GUIDE.md)
- 📊 [优化进度报告](./OPTIMIZATION_PROGRESS.md)
- 🎊 [完成总结](./🎉_ALL_TASKS_COMPLETE.md)

---

## 💡 提示

### 选择建议

- **性能第一** → 使用 `core` + 虚拟滚动 + WASM
- **Vue项目** → 使用 `vue`，享受响应式
- **React项目** → 使用 `react`，享受Hooks
- **跨框架** → 使用 `lit`，标准Web Component

### 最佳实践

1. 启用虚拟滚动处理大文档
2. 启用WASM加速核心算法
3. 配置PWA支持离线编辑
4. 使用调试面板监控性能

---

**开始使用吧！** 🚀


