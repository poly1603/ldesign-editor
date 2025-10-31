/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var event = require('../utils/event.cjs');
var logger$1 = require('../utils/logger.cjs');
var BackgroundSyncManager = require('./BackgroundSyncManager.cjs');
var CacheManager = require('./CacheManager.cjs');
var InstallPromptManager = require('./InstallPromptManager.cjs');
var ServiceWorkerManager = require('./ServiceWorkerManager.cjs');

/**
 * PWA管理器
 * 管理Service Worker、离线缓存、后台同步等PWA功能
 */
const logger = logger$1.createLogger('PWAManager');
class PWAManager extends event.EventEmitter {
    constructor(config = {}) {
        super();
        this.status = 'idle';
        this.updateAvailable = false;
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
        };
        // 初始化子管理器
        this.swManager = new ServiceWorkerManager.ServiceWorkerManager(this.config);
        this.cacheManager = new CacheManager.CacheManager(this.config);
        this.syncManager = new BackgroundSyncManager.BackgroundSyncManager(this.config);
        this.installManager = new InstallPromptManager.InstallPromptManager(this.config);
        this.setupEventListeners();
    }
    /**
     * 初始化PWA
     */
    async initialize() {
        if (!this.config.enabled) {
            logger.info('PWA is disabled');
            return;
        }
        if (!this.isSupported()) {
            logger.warn('PWA is not supported in this browser');
            this.emit('unsupported');
            return;
        }
        logger.info('Initializing PWA');
        this.status = 'initializing';
        this.emit('status-change', 'initializing');
        try {
            // 注册Service Worker
            await this.swManager.register();
            // 初始化缓存
            await this.cacheManager.initialize();
            // 初始化后台同步
            if (this.config.backgroundSync)
                await this.syncManager.initialize();
            // 显示安装提示
            if (this.config.installPrompt)
                await this.installManager.initialize();
            this.status = 'ready';
            this.emit('status-change', 'ready');
            this.emit('ready');
            // 开始检查更新
            this.startUpdateCheck();
            logger.info('PWA initialized successfully');
        }
        catch (error) {
            logger.error('Failed to initialize PWA:', error);
            this.status = 'error';
            this.emit('status-change', 'error');
            this.emit('error', error);
        }
    }
    /**
     * 检查PWA支持
     */
    isSupported() {
        return ('serviceWorker' in navigator
            && 'caches' in window
            && 'PushManager' in window);
    }
    /**
     * 设置事件监听
     */
    setupEventListeners() {
        // Service Worker事件
        this.swManager.on('update-available', () => {
            this.updateAvailable = true;
            this.emit('update-available');
        });
        this.swManager.on('update-installed', () => {
            this.emit('update-installed');
        });
        this.swManager.on('update-activated', () => {
            this.updateAvailable = false;
            this.emit('update-activated');
        });
        this.swManager.on('offline', () => {
            this.emit('offline');
        });
        this.swManager.on('online', () => {
            this.emit('online');
        });
        // 缓存事件
        this.cacheManager.on('cache-updated', (cacheName) => {
            this.emit('cache-updated', cacheName);
        });
        // 同步事件
        this.syncManager.on('sync-success', (tag) => {
            this.emit('sync-success', tag);
        });
        this.syncManager.on('sync-error', (error) => {
            this.emit('sync-error', error);
        });
        // 安装提示事件
        this.installManager.on('prompt-shown', () => {
            this.emit('install-prompt-shown');
        });
        this.installManager.on('installed', () => {
            this.emit('installed');
        });
        this.installManager.on('dismissed', () => {
            this.emit('install-dismissed');
        });
    }
    /**
     * 开始检查更新
     */
    startUpdateCheck() {
        if (this.config.updateInterval <= 0)
            return;
        setInterval(async () => {
            try {
                await this.checkForUpdates();
            }
            catch (error) {
                logger.error('Update check failed:', error);
            }
        }, this.config.updateInterval);
    }
    /**
     * 检查更新
     */
    async checkForUpdates() {
        return await this.swManager.checkForUpdates();
    }
    /**
     * 应用更新
     */
    async applyUpdate() {
        if (!this.updateAvailable) {
            logger.warn('No update available');
            return;
        }
        await this.swManager.update();
        if (this.config.updateOnReload)
            window.location.reload();
    }
    /**
     * 跳过等待，立即激活新版本
     */
    async skipWaiting() {
        await this.swManager.skipWaiting();
    }
    /**
     * 缓存资源
     */
    async cacheResources(urls) {
        await this.cacheManager.addResources(urls);
    }
    /**
     * 清除缓存
     */
    async clearCache(cacheName) {
        await this.cacheManager.clear(cacheName);
    }
    /**
     * 获取缓存大小
     */
    async getCacheSize() {
        return await this.cacheManager.getSize();
    }
    /**
     * 注册后台同步
     */
    async registerSync(tag, data) {
        await this.syncManager.register(tag, data);
    }
    /**
     * 显示安装提示
     */
    async showInstallPrompt() {
        return await this.installManager.show();
    }
    /**
     * 检查是否已安装
     */
    isInstalled() {
        return this.installManager.isInstalled();
    }
    /**
     * 获取状态
     */
    getStatus() {
        return this.status;
    }
    /**
     * 是否有更新
     */
    hasUpdate() {
        return this.updateAvailable;
    }
    /**
     * 是否在线
     */
    isOnline() {
        return navigator.onLine;
    }
    /**
     * 获取统计信息
     */
    async getStats() {
        const [cacheSize, swStatus] = await Promise.all([
            this.cacheManager.getSize(),
            this.swManager.getStatus(),
        ]);
        return {
            status: this.status,
            online: this.isOnline(),
            installed: this.isInstalled(),
            updateAvailable: this.updateAvailable,
            cacheSize,
            serviceWorker: swStatus,
            backgroundSync: this.syncManager.isSupported(),
            pushNotifications: 'Notification' in window && Notification.permission === 'granted',
        };
    }
    /**
     * 注销PWA
     */
    async unregister() {
        logger.info('Unregistering PWA');
        await this.swManager.unregister();
        await this.cacheManager.clear();
        this.status = 'idle';
        this.emit('status-change', 'idle');
        logger.info('PWA unregistered');
    }
    /**
     * 销毁
     */
    destroy() {
        this.swManager.destroy();
        this.cacheManager.destroy();
        this.syncManager.destroy();
        this.installManager.destroy();
        this.removeAllListeners();
    }
}

exports.PWAManager = PWAManager;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=PWAManager.cjs.map
