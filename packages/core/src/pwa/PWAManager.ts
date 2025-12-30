/**
 * PWA管理器
 * 管理Service Worker、离线缓存、后台同步等PWA功能
 */

import type { PWAConfig, PWAStatus } from './types'
import { EventEmitter } from '../core/EventEmitter'
import { createLogger } from '../utils/logger'
import { BackgroundSyncManager } from './BackgroundSyncManager'
import { CacheManager } from './CacheManager'
import { InstallPromptManager } from './InstallPromptManager'
import { ServiceWorkerManager } from './ServiceWorkerManager'

const logger = createLogger('PWAManager')

export class PWAManager extends EventEmitter<any> {
  private config: Required<PWAConfig>
  private swManager: ServiceWorkerManager
  private cacheManager: CacheManager
  private syncManager: BackgroundSyncManager
  private installManager: InstallPromptManager
  private status: PWAStatus = 'idle'
  private updateAvailable = false

  constructor(config: PWAConfig = {}) {
    super()

    this.config = {
      enabled: true,
      scope: '/',
      updateInterval: 60000, // 1分钟
      cacheStrategy: 'network-first',
      offlineSupport: true,
      backgroundSync: true,
      installPrompt: true,
      updateOnReload: false,
      skipWaiting: false,
      ...config,
    }

    // 初始化子管理器
    this.swManager = new ServiceWorkerManager(this.config)
    this.cacheManager = new CacheManager(this.config)
    this.syncManager = new BackgroundSyncManager(this.config)
    this.installManager = new InstallPromptManager(this.config)

    this.setupEventListeners()
  }

  /**
   * 初始化PWA
   */
  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      logger.info('PWA is disabled')
      return
    }

    if (!this.isSupported()) {
      logger.warn('PWA is not supported in this browser')
      this.emit('unsupported', [])
      return
    }

    logger.info('Initializing PWA')
    this.status = 'initializing'
    this.emit('status-change', ['initializing'])

    try {
      // 注册Service Worker
      await this.swManager.register()

      // 初始化缓存
      await this.cacheManager.initialize()

      // 初始化后台同步
      if (this.config.backgroundSync)
        await this.syncManager.initialize()

      // 显示安装提示
      if (this.config.installPrompt)
        await this.installManager.initialize()

      this.status = 'ready'
      this.emit('status-change', ['ready'])
      this.emit('ready', [])

      // 开始检查更新
      this.startUpdateCheck()

      logger.info('PWA initialized successfully')
    }
    catch (error) {
      logger.error('Failed to initialize PWA:', error)
      this.status = 'error'
      this.emit('status-change', ['error'])
      this.emit('error', [error as Error])
    }
  }

  /**
   * 检查PWA支持
   */
  isSupported(): boolean {
    return (
      'serviceWorker' in navigator
      && 'caches' in window
      && 'PushManager' in window
    )
  }

  /**
   * 设置事件监听
   */
  private setupEventListeners(): void {
    // Service Worker事件
    this.swManager.on('update-available', () => {
      this.updateAvailable = true
      this.emit('update-available', [])
    })

    this.swManager.on('update-installed', () => {
      this.emit('update-installed', [])
    })

    this.swManager.on('update-activated', () => {
      this.updateAvailable = false
      this.emit('update-activated', [])
    })

    this.swManager.on('offline', () => {
      this.emit('offline', [])
    })

    this.swManager.on('online', () => {
      this.emit('online', [])
    })

    // 缓存事件
    this.cacheManager.on('cache-updated', (cacheName: any) => {
      this.emit('cache-updated', [cacheName])
    })

    // 同步事件
    this.syncManager.on('sync-success', (tag: any) => {
      this.emit('sync-success', [tag])
    })

    this.syncManager.on('sync-error', (error: any) => {
      this.emit('sync-error', [error])
    })

    // 安装提示事件
    this.installManager.on('prompt-shown', () => {
      this.emit('install-prompt-shown', [])
    })

    this.installManager.on('installed', () => {
      this.emit('installed', [])
    })

    this.installManager.on('dismissed', () => {
      this.emit('install-dismissed', [])
    })
  }

  /**
   * 开始检查更新
   */
  private startUpdateCheck(): void {
    if (this.config.updateInterval <= 0)
      return

    setInterval(async () => {
      try {
        await this.checkForUpdates()
      }
      catch (error) {
        logger.error('Update check failed:', error)
      }
    }, this.config.updateInterval)
  }

  /**
   * 检查更新
   */
  async checkForUpdates(): Promise<boolean> {
    return await this.swManager.checkForUpdates()
  }

  /**
   * 应用更新
   */
  async applyUpdate(): Promise<void> {
    if (!this.updateAvailable) {
      logger.warn('No update available')
      return
    }

    await this.swManager.update()

    if (this.config.updateOnReload)
      window.location.reload()
  }

  /**
   * 跳过等待，立即激活新版本
   */
  async skipWaiting(): Promise<void> {
    await this.swManager.skipWaiting()
  }

  /**
   * 缓存资源
   */
  async cacheResources(urls: string[]): Promise<void> {
    await this.cacheManager.addResources(urls)
  }

  /**
   * 清除缓存
   */
  async clearCache(cacheName?: string): Promise<void> {
    await this.cacheManager.clear(cacheName)
  }

  /**
   * 获取缓存大小
   */
  async getCacheSize(): Promise<number> {
    return await this.cacheManager.getSize()
  }

  /**
   * 注册后台同步
   */
  async registerSync(tag: string, data?: any): Promise<void> {
    await this.syncManager.register(tag, data)
  }

  /**
   * 显示安装提示
   */
  async showInstallPrompt(): Promise<boolean> {
    return await this.installManager.show()
  }

  /**
   * 检查是否已安装
   */
  isInstalled(): boolean {
    return this.installManager.isInstalled()
  }

  /**
   * 获取状态
   */
  getStatus(): PWAStatus {
    return this.status
  }

  /**
   * 是否有更新
   */
  hasUpdate(): boolean {
    return this.updateAvailable
  }

  /**
   * 是否在线
   */
  isOnline(): boolean {
    return navigator.onLine
  }

  /**
   * 获取统计信息
   */
  async getStats() {
    const [cacheSize, swStatus] = await Promise.all([
      this.cacheManager.getSize(),
      this.swManager.getStatus(),
    ])

    return {
      status: this.status,
      online: this.isOnline(),
      installed: this.isInstalled(),
      updateAvailable: this.updateAvailable,
      cacheSize,
      serviceWorker: swStatus,
      backgroundSync: this.syncManager.isSupported(),
      pushNotifications: 'Notification' in window && Notification.permission === 'granted',
    }
  }

  /**
   * 注销PWA
   */
  async unregister(): Promise<void> {
    logger.info('Unregistering PWA')

    await this.swManager.unregister()
    await this.cacheManager.clear()

    this.status = 'idle'
    this.emit('status-change', ['idle'])

    logger.info('PWA unregistered')
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.swManager.destroy()
    this.cacheManager.destroy()
    this.syncManager.destroy()
    this.installManager.destroy()
    if (typeof (this as any).removeAllListeners === 'function') {
      (this as any).removeAllListeners()
    }
  }
}
