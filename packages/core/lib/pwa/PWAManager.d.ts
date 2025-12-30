/**
 * PWA管理器
 * 管理Service Worker、离线缓存、后台同步等PWA功能
 */
import type { PWAConfig, PWAStatus } from './types';
import { EventEmitter } from '../core/EventEmitter';
export declare class PWAManager extends EventEmitter<any> {
    private config;
    private swManager;
    private cacheManager;
    private syncManager;
    private installManager;
    private status;
    private updateAvailable;
    constructor(config?: PWAConfig);
    /**
     * 初始化PWA
     */
    initialize(): Promise<void>;
    /**
     * 检查PWA支持
     */
    isSupported(): boolean;
    /**
     * 设置事件监听
     */
    private setupEventListeners;
    /**
     * 开始检查更新
     */
    private startUpdateCheck;
    /**
     * 检查更新
     */
    checkForUpdates(): Promise<boolean>;
    /**
     * 应用更新
     */
    applyUpdate(): Promise<void>;
    /**
     * 跳过等待，立即激活新版本
     */
    skipWaiting(): Promise<void>;
    /**
     * 缓存资源
     */
    cacheResources(urls: string[]): Promise<void>;
    /**
     * 清除缓存
     */
    clearCache(cacheName?: string): Promise<void>;
    /**
     * 获取缓存大小
     */
    getCacheSize(): Promise<number>;
    /**
     * 注册后台同步
     */
    registerSync(tag: string, data?: any): Promise<void>;
    /**
     * 显示安装提示
     */
    showInstallPrompt(): Promise<boolean>;
    /**
     * 检查是否已安装
     */
    isInstalled(): boolean;
    /**
     * 获取状态
     */
    getStatus(): PWAStatus;
    /**
     * 是否有更新
     */
    hasUpdate(): boolean;
    /**
     * 是否在线
     */
    isOnline(): boolean;
    /**
     * 获取统计信息
     */
    getStats(): Promise<{
        status: PWAStatus;
        online: boolean;
        installed: boolean;
        updateAvailable: boolean;
        cacheSize: number;
        serviceWorker: import("./types").ServiceWorkerStatus;
        backgroundSync: boolean;
        pushNotifications: boolean;
    }>;
    /**
     * 注销PWA
     */
    unregister(): Promise<void>;
    /**
     * 销毁
     */
    destroy(): void;
}
//# sourceMappingURL=PWAManager.d.ts.map