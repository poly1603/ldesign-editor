/**
 * 缓存管理器
 */

import type { PWAConfig } from './types'
import { EventEmitter } from '../core/EventEmitter'
import { createLogger } from '../utils/logger'

const logger = createLogger('CacheManager')

export class CacheManager extends EventEmitter {
  private config: PWAConfig
  private cacheName = 'ldesign-editor-v1'
  private cacheVersion = 1

  constructor(config: PWAConfig) {
    super()
    this.config = config
  }

  /**
   * 初始化缓存
   */
  async initialize(): Promise<void> {
    if (!('caches' in window))
      throw new Error('Cache API not supported')

    logger.info('Initializing cache manager')

    // 清理旧版本缓存
    await this.cleanOldCaches()

    logger.info('Cache manager initialized')
  }

  /**
   * 添加资源到缓存
   */
  async addResources(urls: string[]): Promise<void> {
    try {
      const cache = await caches.open(this.cacheName)
      await cache.addAll(urls)
      logger.info(`Cached ${urls.length} resources`)
      this.emit('cache-updated', this.cacheName)
    }
    catch (error) {
      logger.error('Failed to cache resources:', error)
      throw error
    }
  }

  /**
   * 从缓存获取
   */
  async get(request: Request | string): Promise<Response | undefined> {
    try {
      const cache = await caches.open(this.cacheName)
      return await cache.match(request)
    }
    catch (error) {
      logger.error('Failed to get from cache:', error)
      return undefined
    }
  }

  /**
   * 添加到缓存
   */
  async put(request: Request | string, response: Response): Promise<void> {
    try {
      const cache = await caches.open(this.cacheName)
      await cache.put(request, response)
      this.emit('cache-updated', this.cacheName)
    }
    catch (error) {
      logger.error('Failed to put to cache:', error)
    }
  }

  /**
   * 删除缓存项
   */
  async delete(request: Request | string): Promise<boolean> {
    try {
      const cache = await caches.open(this.cacheName)
      return await cache.delete(request)
    }
    catch (error) {
      logger.error('Failed to delete from cache:', error)
      return false
    }
  }

  /**
   * 清除所有缓存
   */
  async clear(cacheName?: string): Promise<void> {
    try {
      if (cacheName) {
        await caches.delete(cacheName)
      }
      else {
        const keys = await caches.keys()
        await Promise.all(keys.map(key => caches.delete(key)))
      }
      logger.info('Cache cleared')
    }
    catch (error) {
      logger.error('Failed to clear cache:', error)
    }
  }

  /**
   * 清理旧版本缓存
   */
  private async cleanOldCaches(): Promise<void> {
    const keys = await caches.keys()
    const oldCaches = keys.filter(key => key !== this.cacheName)

    await Promise.all(oldCaches.map(key => caches.delete(key)))

    if (oldCaches.length > 0)
      logger.info(`Cleaned ${oldCaches.length} old caches`)
  }

  /**
   * 获取缓存大小
   */
  async getSize(): Promise<number> {
    if (!('estimate' in navigator.storage))
      return 0

    try {
      const estimate = await navigator.storage.estimate()
      return estimate.usage || 0
    }
    catch (error) {
      logger.error('Failed to get cache size:', error)
      return 0
    }
  }

  /**
   * 获取所有缓存的URL
   */
  async getCachedUrls(): Promise<string[]> {
    try {
      const cache = await caches.open(this.cacheName)
      const requests = await cache.keys()
      return requests.map(req => req.url)
    }
    catch (error) {
      logger.error('Failed to get cached URLs:', error)
      return []
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.removeAllListeners()
  }
}
