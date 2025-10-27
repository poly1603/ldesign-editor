/**
 * LDesign Editor Service Worker
 * 提供离线缓存、后台同步等PWA功能
 */

const CACHE_NAME = 'ldesign-editor-v1'
const CACHE_VERSION = 1

// 需要预缓存的资源
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  // 根据实际情况添加其他资源
]

// 缓存策略
const CACHE_STRATEGIES = {
  HTML: 'network-first',
  CSS: 'cache-first',
  JS: 'cache-first',
  IMAGE: 'cache-first',
  API: 'network-first'
}

/**
 * 安装事件
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker')

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching resources')
      return cache.addAll(PRECACHE_URLS)
    }).then(() => {
      // 强制跳过等待，立即激活
      return self.skipWaiting()
    })
  )
})

/**
 * 激活事件
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker')

  event.waitUntil(
    // 清理旧缓存
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    }).then(() => {
      // 立即接管所有客户端
      return self.clients.claim()
    })
  )
})

/**
 * 获取事件
 */
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 跳过非同源请求
  if (url.origin !== self.location.origin) {
    return
  }

  // 根据资源类型选择缓存策略
  const strategy = getStrategy(request)

  event.respondWith(
    handleRequest(request, strategy)
  )
})

/**
 * 消息事件
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break

    case 'CACHE_URLS':
      cacheUrls(payload)
      break

    case 'CLEAR_CACHE':
      clearCache()
      break

    default:
      console.log('[SW] Unknown message type:', type)
  }
})

/**
 * 后台同步事件
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag)

  if (event.tag === 'sync-editor-data') {
    event.waitUntil(syncEditorData())
  }
})

/**
 * 推送通知事件
 */
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}

  const options = {
    body: data.body || 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: data
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'LDesign Editor', options)
  )
})

/**
 * 通知点击事件
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  )
})

/**
 * 获取缓存策略
 */
function getStrategy(request) {
  const url = new URL(request.url)
  const ext = url.pathname.split('.').pop()

  if (request.headers.get('Accept').includes('text/html')) {
    return CACHE_STRATEGIES.HTML
  }

  switch (ext) {
    case 'css':
      return CACHE_STRATEGIES.CSS
    case 'js':
      return CACHE_STRATEGIES.JS
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
      return CACHE_STRATEGIES.IMAGE
    default:
      return url.pathname.startsWith('/api/')
        ? CACHE_STRATEGIES.API
        : 'network-first'
  }
}

/**
 * 处理请求
 */
async function handleRequest(request, strategy) {
  switch (strategy) {
    case 'cache-first':
      return cacheFirst(request)

    case 'network-first':
      return networkFirst(request)

    case 'cache-only':
      return cacheOnly(request)

    case 'network-only':
      return networkOnly(request)

    case 'stale-while-revalidate':
      return staleWhileRevalidate(request)

    default:
      return networkFirst(request)
  }
}

/**
 * 缓存优先策略
 */
async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)
    const cache = await caches.open(CACHE_NAME)
    cache.put(request, response.clone())
    return response
  } catch (error) {
    return new Response('Offline', { status: 503 })
  }
}

/**
 * 网络优先策略
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(CACHE_NAME)
    cache.put(request, response.clone())
    return response
  } catch (error) {
    const cached = await caches.match(request)
    return cached || new Response('Offline', { status: 503 })
  }
}

/**
 * 仅缓存策略
 */
async function cacheOnly(request) {
  return await caches.match(request) || new Response('Not found', { status: 404 })
}

/**
 * 仅网络策略
 */
async function networkOnly(request) {
  return fetch(request)
}

/**
 * 过期重新验证策略
 */
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request)

  const fetchPromise = fetch(request).then((response) => {
    const cache = caches.open(CACHE_NAME)
    cache.then(c => c.put(request, response.clone()))
    return response
  })

  return cached || fetchPromise
}

/**
 * 缓存URL列表
 */
async function cacheUrls(urls) {
  const cache = await caches.open(CACHE_NAME)
  await cache.addAll(urls)
  console.log('[SW] Cached', urls.length, 'URLs')
}

/**
 * 清除缓存
 */
async function clearCache() {
  const keys = await caches.keys()
  await Promise.all(keys.map(key => caches.delete(key)))
  console.log('[SW] Cache cleared')
}

/**
 * 同步编辑器数据
 */
async function syncEditorData() {
  try {
    // 从IndexedDB读取待同步数据
    // 发送到服务器
    // 这里是简化的示例
    console.log('[SW] Syncing editor data')
    return true
  } catch (error) {
    console.error('[SW] Sync failed:', error)
    throw error
  }
}

