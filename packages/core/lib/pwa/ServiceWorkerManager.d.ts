/**
 * Service Worker管理器
 */
import type { PWAConfig, ServiceWorkerMessage, ServiceWorkerStatus } from './types';
import { EventEmitter } from '../core/EventEmitter';
export declare class ServiceWorkerManager extends EventEmitter {
    private config;
    private registration?;
    private updateCheckTimer?;
    constructor(config: PWAConfig);
    /**
     * 注册Service Worker
     */
    register(): Promise<ServiceWorkerRegistration>;
    /**
     * 获取Service Worker URL
     */
    private getServiceWorkerURL;
    /**
     * 设置事件监听
     */
    private setupEventListeners;
    /**
     * 监听Service Worker
     */
    private watchServiceWorker;
    /**
     * 处理Service Worker消息
     */
    private handleMessage;
    /**
     * 检查更新
     */
    checkForUpdates(): Promise<boolean>;
    /**
     * 应用更新
     */
    update(): Promise<void>;
    /**
     * 跳过等待
     */
    skipWaiting(): Promise<void>;
    /**
     * 发送消息给Service Worker
     */
    postMessage(message: ServiceWorkerMessage): Promise<void>;
    /**
     * 获取状态
     */
    getStatus(): Promise<ServiceWorkerStatus>;
    /**
     * 注销Service Worker
     */
    unregister(): Promise<boolean>;
    /**
     * 销毁
     */
    destroy(): void;
}
//# sourceMappingURL=ServiceWorkerManager.d.ts.map