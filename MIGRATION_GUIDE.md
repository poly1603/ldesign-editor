# 🔄 Monorepo 架构迁移指南

## 📋 迁移概述

LDesign Editor 已重构为标准的 **Monorepo** 架构，将核心功能与框架封装分离，提供更好的代码组织和使用体验。

---

## 🏗️ 新架构优势

### 之前（单体架构）
```
libraries/editor/
├── src/          # 所有代码混在一起
├── examples/     # 示例分散
└── dist/         # 单一构建产物
```

**问题**：
- ❌ 核心逻辑与框架封装耦合
- ❌ 用户必须引入整个库
- ❌ 难以支持多框架
- ❌ 构建产物臃肿

### 现在（Monorepo架构）
```
libraries/editor/
├── packages/
│   ├── core/      # 核心库（框架无关）
│   ├── vue/       # Vue封装
│   ├── react/     # React封装
│   └── lit/       # Web Component封装
└── pnpm-workspace.yaml
```

**优势**：
- ✅ 核心逻辑独立，可在任何框架使用
- ✅ 按需引入，减小包体积
- ✅ 多框架支持，灵活选择
- ✅ 每个包独立构建和发布

---

## 📦 包对应关系

| 旧包名 | 新包名 | 说明 |
|--------|--------|------|
| `@ldesign/editor` | `@ldesign/editor-core` | 核心库 |
| - | `@ldesign/editor-vue` | Vue封装 |
| - | `@ldesign/editor-react` | React封装 |
| - | `@ldesign/editor-lit` | Web Component |

---

## 🔧 代码迁移

### 方案1：使用核心库（推荐原生JS项目）

**之前**：
```typescript
import { Editor } from '@ldesign/editor'

const editor = new Editor()
editor.mount('#app')
```

**现在**：
```typescript
import { Editor } from '@ldesign/editor-core'

const editor = new Editor()
editor.mount('#app')
```

✅ **改动最小**：只需改包名

---

### 方案2：使用Vue组件（推荐Vue项目）

**之前**：
```vue
<script setup>
import { Editor } from '@ldesign/editor'
import { onMounted, ref } from 'vue'

const container = ref()

onMounted(() => {
  const editor = new Editor()
  editor.mount(container.value)
})
</script>

<template>
  <div ref="container"></div>
</template>
```

**现在**：
```vue
<script setup>
import { LdEditor } from '@ldesign/editor-vue'
import { ref } from 'vue'

const content = ref('<p>Hello</p>')
</script>

<template>
  <LdEditor v-model="content" placeholder="输入..." />
</template>
```

✅ **更简洁**：使用组件，支持v-model

---

### 方案3：使用React组件（推荐React项目）

**之前**：
```tsx
import { useEffect, useRef } from 'react'
import { Editor } from '@ldesign/editor'

function MyEditor() {
  const containerRef = useRef(null)
  
  useEffect(() => {
    const editor = new Editor()
    editor.mount(containerRef.current)
  }, [])
  
  return <div ref={containerRef} />
}
```

**现在**：
```tsx
import { LdEditor } from '@ldesign/editor-react'
import { useState } from 'react'

function MyEditor() {
  const [content, setContent] = useState('<p>Hello</p>')
  
  return (
    <LdEditor
      value={content}
      onChange={setContent}
      placeholder="输入..."
    />
  )
}
```

✅ **更React化**：使用组件和Hooks

---

### 方案4：使用Web Component（任何框架）

**现在（新增）**：
```html
<!-- 原生HTML -->
<script type="module">
  import '@ldesign/editor-lit'
</script>

<ld-editor content="<p>Hello</p>" placeholder="输入..."></ld-editor>

<!-- 可在Vue、React、Angular等任何框架中使用 -->
```

✅ **最灵活**：标准Web Component

---

## 📝 迁移步骤

### 步骤1：更新依赖

```bash
# 移除旧包
pnpm remove @ldesign/editor

# 安装新包（选择一个）
pnpm add @ldesign/editor-core    # 核心库
pnpm add @ldesign/editor-vue     # Vue项目
pnpm add @ldesign/editor-react   # React项目
pnpm add @ldesign/editor-lit     # Web Component
```

### 步骤2：更新导入

```typescript
// 之前
import { Editor, PWAManager } from '@ldesign/editor'

// 现在
import { Editor, PWAManager } from '@ldesign/editor-core'
// 或
import { LdEditor } from '@ldesign/editor-vue'
// 或
import { LdEditor } from '@ldesign/editor-react'
```

### 步骤3：更新使用方式（可选）

如果使用Vue/React，建议使用对应的组件封装以获得更好的框架集成。

### 步骤4：测试

```bash
# 运行测试确保功能正常
pnpm test

# 运行demo查看效果
pnpm demo:vue   # Vue demo
pnpm demo:react # React demo
```

---

## 🎯 迁移策略

### 渐进式迁移

1. **第一阶段**：只改包名
   - `@ldesign/editor` → `@ldesign/editor-core`
   - 代码逻辑不变
   - 确保功能正常

2. **第二阶段**：使用框架封装
   - Vue项目改用 `@ldesign/editor-vue`
   - React项目改用 `@ldesign/editor-react`
   - 享受框架集成优势

3. **第三阶段**：优化使用方式
   - 使用Composable/Hooks
   - 充分利用框架特性
   - 代码更简洁

### 兼容性保证

- ✅ API 100%向后兼容
- ✅ 功能完全一致
- ✅ 性能更优

---

## ❓ FAQ

### Q: 必须迁移吗？

A: 不必须，但强烈建议：
- 新架构更清晰
- 包体积更小
- 框架集成更好
- 未来维护性更好

### Q: 迁移会影响功能吗？

A: 不会！
- 所有功能100%保留
- API完全兼容
- 性能更优

### Q: 如何选择包？

A: 根据项目选择：
- **纯JS**项目 → `@ldesign/editor-core`
- **Vue** 项目 → `@ldesign/editor-vue`
- **React** 项目 → `@ldesign/editor-react`
- **跨框架** → `@ldesign/editor-lit`

### Q: 可以混用吗？

A: 可以！
- Core是基础，其他包都依赖它
- 可以同时使用多个封装
- 共享核心逻辑，无重复加载

### Q: 构建工具是什么？

A: 统一使用 `@ldesign/builder`
- 配置简单
- 输出标准
- 支持多格式

---

## 📞 支持

遇到迁移问题？

- 📖 查看 [Monorepo架构文档](./MONOREPO_STRUCTURE.md)
- 🎯 运行各个demo项目查看示例
- 💬 提交Issue获取帮助

---

**迁移很简单，收益很明显！** 🚀


