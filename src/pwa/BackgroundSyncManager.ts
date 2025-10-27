/**
 * 后台同步管理器
 */

import { EventEmitter } from '../core/EventEmitter'
import { createLogger } from '../utils/logger'
import type { PWAConfig, SyncQueueItem } from './types'

const logger = createLogger('BackgroundSyncManager')

export class BackgroundSyncManager extends EventEmitter {
  private config: PWAConfig
  private syncQueue: SyncQueueItem[] = []
  private db?: IDBDatabase

  constructor(config: PWAConfig) {
    super()
    this.config = config
  }

  /**
   * 初始化
   */
  async initialize(): Promise<void> {
    if (!this.isSupported()) {
      logger.warn('Background Sync API not supported')
      return
    }

    logger.info('Initializing background sync manager')

    // 初始化IndexedDB
    await this.initDB()

    // 加载队列
    await this.loadQueue()

    logger.info('Background sync manager initialized')
  }

  /**
   * 检查是否支持
   */
  isSupported(): boolean {
    return 'sync' in ServiceWorkerRegistration.prototype
  }

  /**
   * 初始化数据库
   */
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ldesign-sync', 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id' })
        }
      }
    })
  }

  /**
   * 加载队列
   */
  private async loadQueue(): Promise<void> {
    if (!this.db) return

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readonly')
      const store = transaction.objectStore('syncQueue')
      const request = store.getAll()

      request.onsuccess = () => {
        this.syncQueue = request.result || []
        logger.info(`Loaded ${this.syncQueue.length} sync items from queue`)
        resolve()
      }

      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 保存队列
   */
  private async saveQueue(): Promise<void> {
    if (!this.db) return

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite')
      const store = transaction.objectStore('syncQueue')

      // 清空并重新添加
      store.clear()
      this.syncQueue.forEach(item => store.add(item))

      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }

  /**
   * 注册同步
   */
  async register(tag: string, data?: any): Promise<void> {
    if (!this.isSupported()) {
      logger.warn('Background sync not supported, adding to local queue')
      await this.addToQueue(tag, data)
      return
    }

    try {
      const registration = await navigator.serviceWorker.ready
      await registration.sync.register(tag)

      logger.info(`Registered background sync: ${tag}`)

      // 添加到队列
      await this.addToQueue(tag, data)
    } catch (error) {
      logger.error('Failed to register sync:', error)
      throw error
    }
  }

  /**
   * 添加到队列
   */
  private async addToQueue(tag: string, data?: any): Promise<void> {
    const item: SyncQueueItem = {
      id: `${Date.now()}-${Math.random()}`,
      tag,
      url: data?.url || '',
      method: data?.method || 'POST',
      data: data?.body,
      headers: data?.headers,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: 3
    }

    this.syncQueue.push(item)
    await this.saveQueue()

    // 如果在线，立即尝试同步
    if (navigator.onLine) {
      await this.processQueue()
    }
  }

  /**
   * 处理队列
   */
  async processQueue(): Promise<void> {
    if (this.syncQueue.length === 0) return

    logger.info(`Processing ${this.syncQueue.length} sync items`)

    const results = await Promise.allSettled(
      this.syncQueue.map(item => this.processItem(item))
    )

    // 移除成功的项
    this.syncQueue = this.syncQueue.filter((item, index) => {
      const result = results[index]
      if (result.status === 'fulfilled') {
        this.emit('sync-success', item.tag)
        return false
      }

      // 增加重试次数
      item.retries++

      // 超过最大重试次数则移除
      if (item.retries >= item.maxRetries) {
        this.emit('sync-error', new Error(`Max retries reached for ${item.tag}`))
        return false
      }

      return true
    })

    await this.saveQueue()
  }

  /**
   * 处理单个项
   */
  private async processItem(item: SyncQueueItem): Promise<void> {
    try {
      const response = await fetch(item.url, {
        method: item.method,
        headers: item.headers,
        body: item.data ? JSON.stringify(item.data) : undefined
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      logger.info(`Sync completed: ${item.tag}`)
    } catch (error) {
      logger.error(`Sync failed: ${item.tag}`, error)
      throw error
    }
  }

  /**
   * 获取队列长度
   */
  getQueueLength(): number {
    return this.syncQueue.length
  }

  /**
   * 清空队列
   */
  async clearQueue(): Promise<void> {
    this.syncQueue = []
    await this.saveQueue()
    logger.info('Sync queue cleared')
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.db?.close()
    this.removeAllListeners()
  }
}

