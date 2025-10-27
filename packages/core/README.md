# @ldesign/editor-core

> LDesign Editor 核心库 - 框架无关的富文本编辑器核心功能

[![npm version](https://img.shields.io/npm/v/@ldesign/editor-core.svg)](https://www.npmjs.com/package/@ldesign/editor-core)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)

## 特性

- ⚡ **极致性能** - 虚拟滚动 + WASM + 增量渲染
- 🎯 **框架无关** - 可在任何框架中使用
- 🤖 **AI赋能** - 7个AI提供商支持
- 👥 **实时协作** - CRDT算法
- 🏢 **企业级** - 权限 + SSO + 审计
- 📱 **移动优先** - PWA + 手势
- 📊 **图表支持** - 5种图表类型
- 🛠️ **开发友好** - CLI + 调试面板

## 安装

```bash
pnpm add @ldesign/editor-core
```

## 快速开始

```typescript
import { Editor } from '@ldesign/editor-core'

const editor = new Editor({
  content: '<p>Hello World!</p>',
  placeholder: '开始输入...',
  onChange: (content) => {
    console.log('内容更新:', content)
  }
})

editor.mount('#editor')
```

## 高级功能

### 虚拟滚动

```typescript
const editor = new Editor({
  virtualScroll: {
    enabled: true,
    maxLines: 1000000
  }
})
```

### WebAssembly加速

```typescript
const editor = new Editor({
  wasm: {
    enabled: true,
    warmupStrategy: 'eager'
  }
})
```

### AI集成

```typescript
const editor = new Editor({
  ai: {
    provider: 'qwen',
    apiKey: 'YOUR_API_KEY'
  }
})
```

## API

查看完整API文档：[API文档](../../docs/)

## License

MIT © LDesign


