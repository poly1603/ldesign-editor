/**
 * 安装提示管理器
 */

import type { PWAConfig } from './types'
import { EventEmitter } from '../core/EventEmitter'
import { createLogger } from '../utils/logger'

const logger = createLogger('InstallPromptManager')

// 扩展Window接口
declare global {
  interface Window {
    deferredPrompt?: any
  }
}

export class InstallPromptManager extends EventEmitter {
  private config: PWAConfig
  private deferredPrompt?: any
  private installed = false

  constructor(config: PWAConfig) {
    super()
    this.config = config
    this.checkInstallStatus()
  }

  /**
   * 初始化
   */
  async initialize(): Promise<void> {
    logger.info('Initializing install prompt manager')

    // 监听安装提示事件
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.deferredPrompt = e
      logger.info('Install prompt available')
      this.emit('prompt-available')

      // 自动显示提示
      if (this.config.installPrompt) {
        setTimeout(() => {
          this.show()
        }, 3000) // 3秒后显示
      }
    })

    // 监听安装完成
    window.addEventListener('appinstalled', () => {
      logger.info('App installed')
      this.installed = true
      this.deferredPrompt = null
      this.emit('installed')
    })

    logger.info('Install prompt manager initialized')
  }

  /**
   * 检查安装状态
   */
  private checkInstallStatus(): void {
    // 检查是否在独立模式运行（已安装）
    this.installed
      = window.matchMedia('(display-mode: standalone)').matches
        || (window.navigator as any).standalone === true

    if (this.installed)
      logger.info('App is already installed')
  }

  /**
   * 显示安装提示
   */
  async show(): Promise<boolean> {
    if (!this.deferredPrompt) {
      logger.warn('Install prompt not available')
      return false
    }

    if (this.installed) {
      logger.info('App already installed')
      return false
    }

    try {
      // 显示提示
      this.deferredPrompt.prompt()
      this.emit('prompt-shown')

      // 等待用户响应
      const result = await this.deferredPrompt.userChoice

      if (result.outcome === 'accepted') {
        logger.info('User accepted install prompt')
        return true
      }
      else {
        logger.info('User dismissed install prompt')
        this.emit('dismissed')
        return false
      }
    }
    catch (error) {
      logger.error('Failed to show install prompt:', error)
      return false
    }
    finally {
      this.deferredPrompt = null
    }
  }

  /**
   * 是否可以显示提示
   */
  canShowPrompt(): boolean {
    return !!this.deferredPrompt && !this.installed
  }

  /**
   * 是否已安装
   */
  isInstalled(): boolean {
    return this.installed
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.deferredPrompt = null
    this.removeAllListeners()
  }
}
