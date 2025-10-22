# 迁移指南：v1.2 → v1.3

## 概述

v1.3.0是@ldesign/editor的重大更新版本，但**完全向后兼容**v1.2。您可以直接升级，无需修改现有代码。

---

## 快速升级

### 1. 更新依赖

```bash
npm install @ldesign/editor@latest
```

### 2. 运行测试

```bash
npm run test
```

### 3. 完成！

您的应用应该可以正常运行，无需任何代码修改。

---

## 新功能使用

### 协作编辑

```typescript
import { Editor, CollaborationPlugin } from '@ldesign/editor'

const editor = new Editor({
  plugins: [CollaborationPlugin]
})

// 获取管理器
const manager = getCollaborationManager(editor)

// 连接服务器
await manager.connect('ws://your-server.com')

// 获取在线用户
const users = manager.getOnlineUsers()
```

### 版本控制

```typescript
import { Editor, VersionControlPlugin } from '@ldesign/editor'

const editor = new Editor({
  plugins: [VersionControlPlugin]
})

const manager = getVersionControlManager(editor)

// 创建版本
manager.createVersion('功能完成')

// 对比版本
const diff = manager.compareVersions(v1, v2)

// 回滚
manager.restoreVersion(versionId)
```

### 评论系统

```typescript
import { Editor, CommentsPlugin } from '@ldesign/editor'

const editor = new Editor({
  plugins: [CommentsPlugin]
})

const manager = getCommentsManager(editor)

// 添加评论
manager.addComment('Great!', userId, userName, { from: 0, to: 10 })
```

### AI增强

```typescript
import { Editor, AIEnhancedPlugin } from '@ldesign/editor'

const editor = new Editor({
  plugins: [AIEnhancedPlugin]
})

const manager = getAIEnhancedManager(editor)

// 智能排版
await manager.smartFormat()

// 生成摘要
const summary = await manager.generateSummary()

// 提取关键词
const keywords = await manager.extractKeywords(10)
```

### 移动端优化

```typescript
import { Editor, MobilePlugin } from '@ldesign/editor'

const editor = new Editor({
  plugins: [MobilePlugin]
})

// 自动检测并优化移动端体验
```

### 无障碍访问

```typescript
import { Editor, AccessibilityPlugin } from '@ldesign/editor'

const editor = new Editor({
  plugins: [AccessibilityPlugin]
})

const manager = getAccessibilityManager(editor)

// 检查问题
const issues = manager.checkAccessibility()

// 自动修复
manager.autoFix()
```

---

## 重要变更

### 日志系统

**推荐迁移**（可选）:

```typescript
// 旧方式（仍然支持，但不推荐）
console.log('Message')

// 新方式（推荐）
import { createLogger } from '@ldesign/editor'
const logger = createLogger('MyModule')
logger.info('Message')
```

### 类型定义

**TypeScript用户受益**:

v1.3提供了更完整的类型定义，您的IDE会提供更好的智能提示。

```typescript
// v1.2
const editor: any = new Editor()

// v1.3（推荐）
import type { EditorInstance } from '@ldesign/editor'
const editor: EditorInstance = new Editor()
```

---

## 性能优化建议

### 1. 使用代码分割

v1.3的构建已优化为30+个chunk，确保您的构建工具支持按需加载：

```typescript
// Vite/Webpack会自动处理
import { Editor } from '@ldesign/editor'
```

### 2. 只加载需要的插件

```typescript
// 不要
const editor = new Editor()  // 加载所有插件

// 推荐
const editor = new Editor({
  plugins: [
    // 只加载需要的插件
    'FormattingPlugin',
    'ImagePlugin',
    'TablePlugin'
  ]
})
```

### 3. 启用生产模式

确保构建时设置`NODE_ENV=production`：

```bash
NODE_ENV=production npm run build
```

这会：
- 移除所有debug日志
- 启用激进压缩
- 启用tree-shaking

---

## 测试迁移

### 新增测试工具

v1.3包含完整测试配置，您可以直接使用：

```bash
# 单元测试
npm run test

# E2E测试
npm run test:e2e

# 性能测试
npm run test:performance

# 覆盖率
npm run test:coverage
```

### 编写测试

```typescript
import { describe, it, expect } from 'vitest'
import { Editor } from '@ldesign/editor'

describe('My Tests', () => {
  it('should work', () => {
    const editor = new Editor({
      element: '#editor'
    })
    
    expect(editor).toBeDefined()
  })
})
```

---

## 故障排查

### 问题1：构建失败

**可能原因**: 依赖版本冲突

**解决方案**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### 问题2：类型错误

**可能原因**: TypeScript版本过旧

**解决方案**:
```bash
npm install typescript@latest --save-dev
```

### 问题3：测试失败

**可能原因**: 测试环境配置问题

**解决方案**:
```bash
npm install happy-dom --save-dev
```

### 问题4：新功能不可用

**可能原因**: 插件未加载

**解决方案**:
```typescript
import { CollaborationPlugin } from '@ldesign/editor'

const editor = new Editor({
  plugins: [CollaborationPlugin]  // 确保插件已加载
})
```

---

## 获取帮助

### 文档
- [API文档](./docs/api/)
- [用户指南](./docs/guide/)
- [示例代码](./examples/)

### 社区
- [GitHub Issues](https://github.com/ldesign/editor/issues)
- [讨论区](https://github.com/ldesign/editor/discussions)

### 联系
- Email: support@ldesign.dev

---

## 下一步

### 推荐阅读
1. [CHANGELOG_V1.3.0.md](./CHANGELOG_V1.3.0.md) - 完整更新日志
2. [OPTIMIZATION_V1.3.0.md](./OPTIMIZATION_V1.3.0.md) - 优化报告
3. [API文档](./docs/api/) - 完整API参考

### 尝试新功能
1. 启用协作编辑
2. 使用版本控制
3. 添加评论系统
4. 尝试AI增强功能

---

**祝升级顺利！** 🚀

如有任何问题，请随时在GitHub上提Issue。


