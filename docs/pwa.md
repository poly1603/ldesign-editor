# PWA支持文档

## 概述

LDesign Editor提供完整的PWA（Progressive Web App）支持，包括：

- ✅ Service Worker离线缓存
- ✅ 后台数据同步
- ✅ 应用安装提示
- ✅ 离线编辑支持
- ✅ 自动更新检测
- ✅ 推送通知（可选）

## 快速开始

### 1. 基础配置

```typescript
import { Editor, PWAManager } from '@ldesign/editor'

// 创建编辑器
const editor = new Editor({
  pwa: {
    enabled: true,
    offlineSupport: true,
    backgroundSync: true,
    installPrompt: true
  }
})

// 初始化PWA管理器
const pwa = new PWAManager({
  enabled: true,
  cacheStrategy: 'network-first',
  offlineSupport: true,
  backgroundSync: true
})

await pwa.initialize()
```

### 2. HTML配置

在您的HTML文件中添加：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta name="theme-color" content="#667eea">
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" type="image/png" href="/icons/icon-192x192.png">
  
  <!-- iOS支持 -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-mobile-web-app-title" content="LDesign">
  <link rel="apple-touch-icon" href="/icons/icon-192x192.png">
</head>
</html>
```

### 3. Service Worker文件

将 `public/sw.js` 复制到您的公共目录根路径。

## 核心功能

### Service Worker

```typescript
// 检查Service Worker支持
if (pwa.isSupported()) {
  await pwa.initialize()
}

// 获取Service Worker状态
const status = await pwa.swManager.getStatus()
console.log('状态:', status.state)
console.log('作用域:', status.scope)

// 检查更新
const hasUpdate = await pwa.checkForUpdates()
if (hasUpdate) {
  await pwa.applyUpdate()
}

// 跳过等待，立即激活
await pwa.skipWaiting()

// 注销Service Worker
await pwa.unregister()
```

### 离线缓存

```typescript
// 缓存资源
await pwa.cacheResources([
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/images/logo.png'
])

// 获取缓存大小
const size = await pwa.getCacheSize()
console.log(`缓存大小: ${size} 字节`)

// 清除缓存
await pwa.clearCache() // 清除所有
await pwa.clearCache('my-cache') // 清除指定缓存
```

### 离线存储

```typescript
import { OfflineStorage } from '@ldesign/editor'

const storage = new OfflineStorage()
await storage.initialize()

// 保存文档
await storage.save({
  id: 'doc-123',
  type: 'document',
  content: editor.getContent()
})

// 获取文档
const doc = await storage.get('doc-123')
console.log(doc.content)

// 获取所有未同步的文档
const unsynced = await storage.getUnsynced()
console.log(`${unsynced.length} 个文档待同步`)

// 标记为已同步
await storage.markAsSynced('doc-123')

// 删除文档
await storage.delete('doc-123')
```

### 后台同步

```typescript
// 注册后台同步任务
await pwa.registerSync('sync-documents', {
  url: '/api/sync',
  method: 'POST',
  body: {
    documents: await storage.getUnsynced()
  }
})

// 监听同步事件
pwa.on('sync-success', (tag) => {
  console.log('同步成功:', tag)
})

pwa.on('sync-error', (error) => {
  console.error('同步失败:', error)
})
```

### 安装提示

```typescript
// 检查是否可以显示安装提示
if (pwa.installManager.canShowPrompt()) {
  // 显示安装提示
  const installed = await pwa.showInstallPrompt()
  
  if (installed) {
    console.log('用户已安装应用')
  }
}

// 检查是否已安装
if (pwa.isInstalled()) {
  console.log('应用已安装')
}

// 监听安装事件
pwa.on('installed', () => {
  console.log('应用安装完成')
})
```

## 高级功能

### 缓存策略

支持5种缓存策略：

1. **cache-first**（缓存优先）
   - 优先从缓存读取
   - 缓存未命中时从网络获取
   - 适用于：静态资源（CSS、JS、图片）

2. **network-first**（网络优先）
   - 优先从网络获取
   - 网络失败时从缓存读取
   - 适用于：HTML、API请求

3. **cache-only**（仅缓存）
   - 只从缓存读取
   - 适用于：完全离线场景

4. **network-only**（仅网络）
   - 只从网络获取
   - 适用于：始终需要最新数据

5. **stale-while-revalidate**（过期重新验证）
   - 返回缓存同时更新缓存
   - 适用于：可接受稍微过期的数据

```typescript
const pwa = new PWAManager({
  cacheStrategy: 'network-first' // 选择策略
})
```

### 更新策略

```typescript
const pwa = new PWAManager({
  updateInterval: 60000,     // 每分钟检查一次更新
  updateOnReload: false,      // 更新后不自动刷新
  skipWaiting: false          // 不跳过等待
})

// 监听更新
pwa.on('update-available', () => {
  // 显示更新提示
  if (confirm('发现新版本，是否更新？')) {
    pwa.applyUpdate()
  }
})

pwa.on('update-installed', () => {
  // 新版本已安装，等待激活
  console.log('新版本已准备好')
})

pwa.on('update-activated', () => {
  // 新版本已激活
  window.location.reload()
})
```

### 网络状态监听

```typescript
// 监听网络状态
pwa.on('offline', () => {
  console.log('网络断开，切换到离线模式')
  // 显示离线提示
  showOfflineUI()
})

pwa.on('online', () => {
  console.log('网络恢复，开始同步数据')
  // 隐藏离线提示
  hideOfflineUI()
  // 触发数据同步
  syncOfflineData()
})

// 检查在线状态
if (pwa.isOnline()) {
  console.log('当前在线')
}
```

### 获取统计信息

```typescript
const stats = await pwa.getStats()

console.log('状态:', stats.status)
console.log('在线:', stats.online)
console.log('已安装:', stats.installed)
console.log('有更新:', stats.updateAvailable)
console.log('缓存大小:', stats.cacheSize)
console.log('Service Worker:', stats.serviceWorker)
console.log('后台同步支持:', stats.backgroundSync)
console.log('推送通知:', stats.pushNotifications)
```

## PWA事件

完整的事件列表：

```typescript
pwa.on('status-change', (status) => {
  console.log('状态变化:', status)
})

pwa.on('ready', () => {
  console.log('PWA就绪')
})

pwa.on('unsupported', () => {
  console.log('浏览器不支持PWA')
})

pwa.on('error', (error) => {
  console.error('错误:', error)
})

pwa.on('update-available', () => {
  console.log('有更新可用')
})

pwa.on('update-installed', () => {
  console.log('更新已安装')
})

pwa.on('update-activated', () => {
  console.log('更新已激活')
})

pwa.on('offline', () => {
  console.log('离线')
})

pwa.on('online', () => {
  console.log('在线')
})

pwa.on('cache-updated', (cacheName) => {
  console.log('缓存已更新:', cacheName)
})

pwa.on('sync-success', (tag) => {
  console.log('同步成功:', tag)
})

pwa.on('sync-error', (error) => {
  console.error('同步错误:', error)
})

pwa.on('install-prompt-shown', () => {
  console.log('显示了安装提示')
})

pwa.on('installed', () => {
  console.log('应用已安装')
})

pwa.on('install-dismissed', () => {
  console.log('用户取消了安装')
})
```

## Manifest配置

`manifest.json` 配置示例：

```json
{
  "name": "LDesign Editor",
  "short_name": "LDesign",
  "description": "功能强大的现代化富文本编辑器",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#667eea",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 最佳实践

### 1. 离线优先设计

```typescript
// 始终保存到本地
editor.on('change', async (content) => {
  await offlineStorage.save({
    id: 'current-doc',
    type: 'document',
    content
  })
})

// 在线时同步到服务器
if (pwa.isOnline()) {
  await syncToServer()
}
```

### 2. 优雅的错误处理

```typescript
try {
  await fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify({ content })
  })
} catch (error) {
  // 网络错误，保存到离线队列
  await pwa.registerSync('save-document', {
    url: '/api/save',
    method: 'POST',
    body: { content }
  })
  
  console.log('已添加到同步队列，将在网络恢复后自动同步')
}
```

### 3. 用户体验优化

```typescript
// 显示离线提示
pwa.on('offline', () => {
  showToast('您当前处于离线状态，编辑将在网络恢复后自动同步')
})

// 同步进度提示
pwa.on('sync-success', (tag) => {
  showToast('数据同步成功')
})

// 更新提示
pwa.on('update-available', () => {
  showToast('发现新版本，点击更新', {
    action: '更新',
    onClick: () => pwa.applyUpdate()
  })
})
```

## 调试

### 开发环境调试

```bash
# 在Chrome DevTools中：
1. Application -> Service Workers
2. 勾选 "Update on reload"
3. 勾选 "Bypass for network"

# 测试离线模式：
1. Application -> Service Workers
2. 勾选 "Offline"

# 清除所有数据：
1. Application -> Clear storage
2. 点击 "Clear site data"
```

### 生产环境监控

```typescript
// 定期检查PWA状态
setInterval(async () => {
  const stats = await pwa.getStats()
  
  // 上报到监控系统
  reportMetrics({
    cacheSize: stats.cacheSize,
    online: stats.online,
    syncQueue: pwa.syncManager.getQueueLength()
  })
}, 60000)
```

## 浏览器兼容性

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+
- ⚠️ IE不支持

## 常见问题

### Q: Service Worker未注册？

**A**: 确保：
1. 使用HTTPS或localhost
2. Service Worker文件路径正确
3. 浏览器支持Service Worker

### Q: 缓存未生效？

**A**: 检查：
1. Service Worker是否激活
2. 缓存策略是否正确
3. 资源URL是否匹配

### Q: 离线数据未同步？

**A**: 确认：
1. 已注册后台同步
2. 网络已恢复
3. 同步队列未超过最大重试次数

### Q: 应用无法安装？

**A**: 需要满足：
1. 使用HTTPS
2. 有有效的manifest.json
3. 注册了Service Worker
4. 至少访问过2次

## 示例

查看完整示例：
- [PWA演示](../examples/pwa-demo.html)
- [离线编辑示例](../examples/offline-editing.html)

## API参考

详见：
- [PWAManager API](../src/pwa/PWAManager.ts)
- [OfflineStorage API](../src/pwa/OfflineStorage.ts)
- [Service Worker文件](../public/sw.js)

