/**
 * 离线存储管理器
 * 使用IndexedDB存储离线编辑数据
 */

import { createLogger } from '../utils/logger'
import type { OfflineData } from './types'

const logger = createLogger('OfflineStorage')

export class OfflineStorage {
  private db?: IDBDatabase
  private dbName = 'ldesign-offline'
  private version = 1
  private storeName = 'documents'

  /**
   * 初始化
   */
  async initialize(): Promise<void> {
    logger.info('Initializing offline storage')

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        logger.error('Failed to open database:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        logger.info('Offline storage initialized')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // 创建对象存储
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' })

          // 创建索引
          store.createIndex('type', 'type', { unique: false })
          store.createIndex('synced', 'synced', { unique: false })
          store.createIndex('updatedAt', 'updatedAt', { unique: false })
        }
      }
    })
  }

  /**
   * 保存数据
   */
  async save(data: Omit<OfflineData, 'createdAt' | 'updatedAt' | 'synced'>): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    const record: OfflineData = {
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      synced: false
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.put(record)

      request.onsuccess = () => {
        logger.debug(`Saved: ${data.id}`)
        resolve()
      }

      request.onerror = () => {
        logger.error('Failed to save:', request.error)
        reject(request.error)
      }
    })
  }

  /**
   * 获取数据
   */
  async get(id: string): Promise<OfflineData | undefined> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 获取所有数据
   */
  async getAll(): Promise<OfflineData[]> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 获取未同步的数据
   */
  async getUnsynced(): Promise<OfflineData[]> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('synced')
      const request = index.getAll(false)

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 更新数据
   */
  async update(id: string, updates: Partial<OfflineData>): Promise<void> {
    const existing = await this.get(id)
    if (!existing) {
      throw new Error(`Document not found: ${id}`)
    }

    const updated: OfflineData = {
      ...existing,
      ...updates,
      updatedAt: Date.now()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.put(updated)

      request.onsuccess = () => {
        logger.debug(`Updated: ${id}`)
        resolve()
      }

      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 标记为已同步
   */
  async markAsSynced(id: string): Promise<void> {
    await this.update(id, { synced: true })
  }

  /**
   * 删除数据
   */
  async delete(id: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(id)

      request.onsuccess = () => {
        logger.debug(`Deleted: ${id}`)
        resolve()
      }

      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 清空所有数据
   */
  async clear(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.clear()

      request.onsuccess = () => {
        logger.info('All offline data cleared')
        resolve()
      }

      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 获取存储大小
   */
  async getSize(): Promise<number> {
    if (!('estimate' in navigator.storage)) {
      return 0
    }

    try {
      const estimate = await navigator.storage.estimate()
      return estimate.usage || 0
    } catch (error) {
      logger.error('Failed to get storage size:', error)
      return 0
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.db?.close()
    this.db = undefined
  }
}

