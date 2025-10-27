# 离线协作功能文档

## 概述

LDesign Editor提供基于CRDT（Conflict-free Replicated Data Type）的离线协作功能，支持：

- ✅ 多用户实时协作编辑
- ✅ 离线编辑，联网后自动同步
- ✅ 自动冲突解决
- ✅ P2P点对点连接
- ✅ WebSocket服务器同步
- ✅ 用户在线状态
- ✅ 光标位置同步

## 快速开始

### 1. 基础使用

```typescript
import { Editor, CollaborationManager } from '@ldesign/editor'

// 创建编辑器
const editor = new Editor({
  content: '开始协作编辑...'
})

// 创建协作管理器
const collaboration = new CollaborationManager(editor, {
  user: {
    id: 'user-123',
    name: '张三',
    avatar: 'https://example.com/avatar.jpg'
  },
  serverUrl: 'wss://your-server.com/collaboration',
  enableP2P: true,
  autoReconnect: true
})

// 连接到协作服务器
await collaboration.connect()
```

### 2. 监听协作事件

```typescript
// 连接状态变化
collaboration.on('connection-status', (status) => {
  console.log('连接状态:', status)
})

// 用户加入
collaboration.on('user-joined', (user) => {
  console.log(`${user.name} 加入了协作`)
  showNotification(`${user.name} 加入`)
})

// 用户离开
collaboration.on('user-left', (userId) => {
  console.log('用户离开:', userId)
})

// 远程操作
collaboration.on('remote-operation', (operation) => {
  console.log('收到远程操作:', operation.type)
})

// 光标更新
collaboration.on('cursor-update', (userId, cursor) => {
  showRemoteCursor(userId, cursor)
})

// 同步完成
collaboration.on('sync-complete', () => {
  console.log('同步完成')
})

// 冲突解决
collaboration.on('conflict-resolved', (operations) => {
  console.log(`解决了 ${operations.length} 个冲突`)
})
```

## CRDT核心

### 什么是CRDT？

CRDT（Conflict-free Replicated Data Type）是一种特殊的数据结构，能够：

- 允许多个用户并发编辑
- 无需中央协调即可达到最终一致性
- 自动解决编辑冲突
- 支持离线编辑

### 基本操作

```typescript
import { CRDT } from '@ldesign/editor'

// 创建CRDT实例
const crdt = new CRDT('site-1')

// 插入字符
const op1 = crdt.insert(0, 'H')
const op2 = crdt.insert(1, 'e')
const op3 = crdt.insert(2, 'l')
const op4 = crdt.insert(3, 'l')
const op5 = crdt.insert(4, 'o')

// 获取文本
console.log(crdt.getText()) // "Hello"

// 删除字符
crdt.delete(4) // 删除 'o'
console.log(crdt.getText()) // "Hell"

// 获取状态
const state = crdt.getState()
console.log('站点ID:', state.siteId)
console.log('时钟:', state.clock)
console.log('操作数:', state.operations.length)
```

### 状态合并

```typescript
// 两个CRDT实例
const crdt1 = new CRDT('site-1')
const crdt2 = new CRDT('site-2')

// 实例1的操作
crdt1.insert(0, 'A')
crdt1.insert(1, 'B')

// 实例2的操作
crdt2.insert(0, 'X')
crdt2.insert(1, 'Y')

// 获取状态
const state1 = crdt1.getState()
const state2 = crdt2.getState()

// 合并状态
const newOps1 = crdt1.merge(state2)
const newOps2 = crdt2.merge(state1)

// 两个实例现在有相同的内容
console.log(crdt1.getText()) // 可能是 "ABXY" 或 "XABY"
console.log(crdt2.getText()) // 与crdt1.getText()相同
```

## 高级功能

### 用户管理

```typescript
// 获取在线用户
const users = collaboration.getOnlineUsers()
console.log('在线用户:', users.length)

users.forEach(user => {
  console.log(`- ${user.name} (${user.online ? '在线' : '离线'})`)
})

// 更新用户信息
collaboration.on('user-joined', (user) => {
  // 显示用户头像
  const avatarEl = document.createElement('img')
  avatarEl.src = user.avatar
  avatarEl.style.borderColor = user.color
})
```

### 光标同步

```typescript
// 本地光标变化时广播
editor.on('selectionUpdate', (selection) => {
  collaboration.sendCursorUpdate({
    index: selection.from,
    length: selection.to - selection.from
  })
})

// 显示远程用户光标
collaboration.on('cursor-update', (userId, cursor) => {
  const user = collaboration.getUser(userId)
  
  // 创建光标元素
  const cursorEl = document.createElement('div')
  cursorEl.style.cssText = `
    position: absolute;
    width: 2px;
    height: 20px;
    background: ${user.color};
    pointer-events: none;
  `
  
  // 定位光标
  const coords = editor.getCoordinatesAtIndex(cursor.index)
  cursorEl.style.left = coords.left + 'px'
  cursorEl.style.top = coords.top + 'px'
  
  // 显示用户名
  const label = document.createElement('div')
  label.textContent = user.name
  label.style.cssText = `
    position: absolute;
    top: -20px;
    background: ${user.color};
    color: white;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 11px;
    white-space: nowrap;
  `
  cursorEl.appendChild(label)
  
  editor.getElement().appendChild(cursorEl)
})
```

### 离线编辑

```typescript
// 监听网络状态
collaboration.on('connection-status', (status) => {
  if (status === 'disconnected') {
    showToast('已断开连接，切换到离线模式')
  } else if (status === 'connected') {
    showToast('已重新连接，正在同步数据...')
    
    // 自动同步本地更改
    collaboration.sync()
  }
})

// 离线时的操作会自动排队
editor.insertText('离线编辑的内容')

// 联网后自动同步
// CRDT保证最终一致性
```

### 冲突解决

```typescript
// 监听冲突解决
collaboration.on('conflict-resolved', (operations) => {
  console.log('自动解决了冲突')
  
  // CRDT算法保证：
  // 1. 所有客户端最终达到相同状态
  // 2. 不会丢失任何用户的编辑
  // 3. 不需要手动介入
  
  showToast(`已自动解决 ${operations.length} 个冲突`)
})
```

## P2P连接

### 启用P2P

```typescript
const collaboration = new CollaborationManager(editor, {
  user: { id: 'user-1', name: '用户1' },
  enableP2P: true,
  serverUrl: 'wss://signaling-server.com'
})

// P2P连接建立后，数据直接在客户端间传输
// 减少服务器负载，降低延迟
```

### P2P配置

```typescript
const p2pConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:your-turn-server.com',
      username: 'user',
      credential: 'pass'
    }
  ],
  roomId: 'document-123'
}
```

## API参考

### CollaborationManager

```typescript
class CollaborationManager {
  // 连接到服务器
  connect(): Promise<void>
  
  // 断开连接
  disconnect(): void
  
  // 获取在线用户
  getOnlineUsers(): CollaborationUser[]
  
  // 获取连接状态
  getStatus(): ConnectionStatus
  
  // 获取CRDT状态
  getCRDTState(): CRDTState
  
  // 销毁
  destroy(): void
}
```

### CRDT

```typescript
class CRDT {
  // 插入字符
  insert(index: number, char: string): CRDTOperation
  
  // 删除字符
  delete(index: number): CRDTOperation | null
  
  // 应用操作
  applyOperation(operation: CRDTOperation): void
  
  // 获取文本
  getText(): string
  
  // 设置文本
  setText(text: string): CRDTOperation[]
  
  // 获取状态
  getState(): CRDTState
  
  // 合并远程状态
  merge(remoteState: CRDTState): CRDTOperation[]
  
  // 获取增量
  getDelta(remoteVersionVector: Record<string, number>): CRDTOperation[]
}
```

## 最佳实践

### 1. 处理大规模协作

```typescript
// 限制历史记录大小
const MAX_HISTORY = 10000

if (crdt.getState().operations.length > MAX_HISTORY) {
  // 压缩历史
  compressHistory(crdt)
}
```

### 2. 优化同步性能

```typescript
// 使用增量同步而非全量同步
const delta = crdt.getDelta(remoteVersionVector)

// 只发送增量操作
collaboration.sendDelta(delta)
```

### 3. 用户体验优化

```typescript
// 显示协作状态
collaboration.on('user-joined', (user) => {
  showToast(`${user.name} 加入了协作`, {
    icon: user.avatar,
    color: user.color
  })
})

// 显示远程编辑
collaboration.on('remote-operation', (op) => {
  if (op.type === 'insert') {
    highlightChange(op.identifier.position, 'green')
  } else {
    highlightChange(op.identifier.position, 'red')
  }
})
```

## 示例

查看完整示例：
- [协作演示](../examples/collaboration-demo.html)
- [P2P演示](../examples/p2p-demo.html)

## 常见问题

### Q: 如何处理大量用户？

**A**: 
1. 使用房间分组
2. 限制单个房间用户数
3. 使用P2P减轻服务器压力

### Q: 冲突如何自动解决？

**A**: CRDT使用Logoot算法，通过位置标识符保证操作的顺序一致性，从而自动解决冲突。

### Q: 离线多久后可以同步？

**A**: 理论上无限制，只要CRDT状态没有被清除。实际建议在7天内同步。

### Q: 性能影响？

**A**: 
- 单个操作：<1ms
- 状态合并：O(n)，n为操作数
- 建议定期压缩历史记录

## 技术细节

### Logoot算法

LDesign Editor使用Logoot算法实现CRDT：

1. **位置标识符**：每个字符有唯一的位置标识符
2. **偏序关系**：位置标识符可排序
3. **插入算法**：在两个现有位置间生成新位置
4. **删除算法**：逻辑删除，保留墓碑
5. **合并算法**：基于向量时钟的因果一致性

### 版本向量

使用版本向量（Version Vector）追踪因果关系：

```
Site A: {A: 5, B: 3}
Site B: {A: 4, B: 6}

合并后: {A: 5, B: 6}
```

### 垃圾回收

定期清理已删除的字符（墓碑）：

```typescript
// 在所有客户端都确认接收后，可以安全删除墓碑
collaboration.garbageCollect()
```

## 架构图

```
┌─────────────┐          ┌─────────────┐
│   Client A  │          │   Client B  │
│             │          │             │
│  ┌────────┐ │          │  ┌────────┐ │
│  │ Editor │ │          │  │ Editor │ │
│  └────┬───┘ │          │  └────┬───┘ │
│       │     │          │       │     │
│  ┌────▼───┐ │          │  ┌────▼───┐ │
│  │  CRDT  │ │◄────┐    │  │  CRDT  │ │
│  └────┬───┘ │     │    │  └────┬───┘ │
│       │     │     │    │       │     │
│  ┌────▼───┐ │     │    │  ┌────▼───┐ │
│  │  Sync  │ │     │    │  │  Sync  │ │
│  └────┬───┘ │     │    │  └────┬───┘ │
└───────┼─────┘     │    └───────┼─────┘
        │           │            │
        │    ┌──────▼──────┐     │
        └────►   Server    ◄─────┘
             │  WebSocket  │
             └─────────────┘
```

## 安全性

### 1. 身份验证

```typescript
const collaboration = new CollaborationManager(editor, {
  user: {
    id: userId,
    name: userName,
    token: authToken // JWT token
  },
  serverUrl: 'wss://server.com/collab?token=' + authToken
})
```

### 2. 权限控制

```typescript
// 只读模式
const collaboration = new CollaborationManager(editor, {
  user: user,
  permissions: {
    canEdit: false,
    canComment: true
  }
})
```

### 3. 数据加密

```typescript
// 端到端加密（客户端加密）
const encryptedData = await encrypt(crdt.getState())
collaboration.send(encryptedData)
```

## 性能优化

### 1. 操作批处理

```typescript
// 批量发送操作，减少网络请求
const BATCH_SIZE = 10
const BATCH_DELAY = 100 // ms

let operationBatch = []
let batchTimer

function queueOperation(op) {
  operationBatch.push(op)
  
  if (operationBatch.length >= BATCH_SIZE) {
    flushBatch()
  } else {
    clearTimeout(batchTimer)
    batchTimer = setTimeout(flushBatch, BATCH_DELAY)
  }
}

function flushBatch() {
  if (operationBatch.length > 0) {
    collaboration.sendBatch(operationBatch)
    operationBatch = []
  }
}
```

### 2. 压缩历史

```typescript
// 定期压缩CRDT历史
setInterval(() => {
  const state = crdt.getState()
  
  if (state.operations.length > 10000) {
    // 创建快照
    const snapshot = crdt.getText()
    
    // 重新初始化CRDT
    const newCrdt = new CRDT(crdt.getSiteId())
    newCrdt.setText(snapshot)
    
    // 通知其他客户端
    collaboration.broadcastSnapshot(snapshot)
  }
}, 60000)
```

### 3. 网络优化

```typescript
// 使用WebRTC DataChannel减少延迟
const collaboration = new CollaborationManager(editor, {
  enableP2P: true, // 启用P2P
  useDataChannel: true // 使用DataChannel
})

// P2P延迟通常 <50ms，比WebSocket快
```

## 故障处理

### 网络断开

```typescript
collaboration.on('connection-status', (status) => {
  if (status === 'disconnected') {
    // 1. 显示离线提示
    showOfflineIndicator()
    
    // 2. 保存到本地存储
    saveToLocalStorage(editor.getContent())
    
    // 3. 继续允许编辑
    // CRDT会记录所有操作，联网后自动同步
  }
})
```

### 数据恢复

```typescript
// 从本地恢复未同步的操作
const unsyncedOps = await loadUnsyncedOperations()

unsyncedOps.forEach(op => {
  crdt.applyOperation(op)
})

// 重新连接后发送
await collaboration.connect()
collaboration.sendBatch(unsyncedOps)
```

## 测试

### 本地测试

```bash
# 启动两个浏览器标签页
# 在两个标签页中同时编辑
# 观察同步效果
```

### 网络条件测试

```bash
# Chrome DevTools
1. Network -> Throttling -> Slow 3G
2. 测试离线场景
3. 观察同步延迟
```

## 部署

### 服务器要求

- WebSocket支持
- 低延迟网络
- Redis/内存存储（可选）
- 负载均衡（多用户）

### 示例服务器

```javascript
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

const rooms = new Map()

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const message = JSON.parse(data)
    
    // 广播给房间内其他用户
    const room = rooms.get(message.roomId) || []
    room.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  })
})
```

## 相关资源

- [CRDT论文](https://hal.inria.fr/inria-00397981/document)
- [Yjs (CRDT库)](https://github.com/yjs/yjs)
- [协作编辑最佳实践](https://blog.atom.io/2017/11/15/code-collaboration.html)

