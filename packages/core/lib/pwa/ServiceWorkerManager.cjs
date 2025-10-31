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

/**
 * Service Worker管理器
 */
const logger = logger$1.createLogger('ServiceWorkerManager');
class ServiceWorkerManager extends event.EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.setupEventListeners();
    }
    /**
     * 注册Service Worker
     */
    async register() {
        if (!('serviceWorker' in navigator))
            throw new Error('Service Worker not supported');
        try {
            logger.info('Registering service worker');
            const swUrl = this.getServiceWorkerURL();
            this.registration = await navigator.serviceWorker.register(swUrl, {
                scope: this.config.scope || '/',
            });
            logger.info('Service worker registered successfully');
            // 监听Service Worker状态
            this.watchServiceWorker();
            return this.registration;
        }
        catch (error) {
            logger.error('Failed to register service worker:', error);
            throw error;
        }
    }
    /**
     * 获取Service Worker URL
     */
    getServiceWorkerURL() {
        // 在实际应用中，这应该是构建后的SW文件路径
        return '/sw.js';
    }
    /**
     * 设置事件监听
     */
    setupEventListeners() {
        // 监听在线/离线状态
        window.addEventListener('online', () => {
            logger.info('Application is online');
            this.emit('online');
        });
        window.addEventListener('offline', () => {
            logger.info('Application is offline');
            this.emit('offline');
        });
        // 监听Service Worker消息
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                this.handleMessage(event.data);
            });
        }
    }
    /**
     * 监听Service Worker
     */
    watchServiceWorker() {
        if (!this.registration)
            return;
        // 监听更新
        this.registration.addEventListener('updatefound', () => {
            logger.info('Service worker update found');
            const newWorker = this.registration.installing;
            if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        logger.info('New service worker installed');
                        this.emit('update-available');
                    }
                    if (newWorker.state === 'activated') {
                        logger.info('New service worker activated');
                        this.emit('update-activated');
                    }
                });
            }
        });
        // 检查是否有等待的Service Worker
        if (this.registration.waiting)
            this.emit('update-available');
        // 监听控制器变化
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            logger.info('Service worker controller changed');
            this.emit('controller-change');
        });
    }
    /**
     * 处理Service Worker消息
     */
    handleMessage(message) {
        logger.debug('Received message from service worker:', message);
        switch (message.type) {
            case 'CACHE_UPDATED':
                this.emit('cache-updated', message.payload);
                break;
            case 'SYNC_COMPLETE':
                this.emit('sync-complete', message.payload);
                break;
            case 'NOTIFICATION':
                this.emit('notification', message.payload);
                break;
            default:
                logger.debug('Unknown message type:', message.type);
        }
    }
    /**
     * 检查更新
     */
    async checkForUpdates() {
        if (!this.registration) {
            logger.warn('No service worker registration');
            return false;
        }
        try {
            await this.registration.update();
            return !!this.registration.waiting;
        }
        catch (error) {
            logger.error('Failed to check for updates:', error);
            return false;
        }
    }
    /**
     * 应用更新
     */
    async update() {
        if (!this.registration?.waiting) {
            logger.warn('No waiting service worker');
            return;
        }
        // 发送跳过等待消息
        this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        // 等待控制器变化
        await new Promise((resolve) => {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                resolve();
            }, { once: true });
        });
        this.emit('update-installed');
    }
    /**
     * 跳过等待
     */
    async skipWaiting() {
        if (!this.registration?.waiting)
            return;
        this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    /**
     * 发送消息给Service Worker
     */
    async postMessage(message) {
        if (!navigator.serviceWorker.controller) {
            logger.warn('No service worker controller');
            return;
        }
        navigator.serviceWorker.controller.postMessage(message);
    }
    /**
     * 获取状态
     */
    async getStatus() {
        if (!this.registration) {
            return {
                state: 'redundant',
                updateAvailable: false,
            };
        }
        const sw = this.registration.active || this.registration.installing || this.registration.waiting;
        return {
            state: sw?.state || 'redundant',
            scriptURL: sw?.scriptURL,
            scope: this.registration.scope,
            updateAvailable: !!this.registration.waiting,
        };
    }
    /**
     * 注销Service Worker
     */
    async unregister() {
        if (!this.registration)
            return false;
        try {
            const result = await this.registration.unregister();
            logger.info('Service worker unregistered');
            this.registration = undefined;
            return result;
        }
        catch (error) {
            logger.error('Failed to unregister service worker:', error);
            return false;
        }
    }
    /**
     * 销毁
     */
    destroy() {
        if (this.updateCheckTimer)
            clearInterval(this.updateCheckTimer);
        this.removeAllListeners();
    }
}

exports.ServiceWorkerManager = ServiceWorkerManager;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ServiceWorkerManager.cjs.map
