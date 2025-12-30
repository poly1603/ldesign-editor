/**
 * 后台同步管理器
 */
import type { PWAConfig } from './types';
import { EventEmitter } from '../core/EventEmitter';
export declare class BackgroundSyncManager extends EventEmitter {
    private config;
    private syncQueue;
    private db?;
    constructor(config: PWAConfig);
    /**
     * 初始化
     */
    initialize(): Promise<void>;
    /**
     * 检查是否支持
     */
    isSupported(): boolean;
    /**
     * 初始化数据库
     */
    private initDB;
    /**
     * 加载队列
     */
    private loadQueue;
    /**
     * 保存队列
     */
    private saveQueue;
    /**
     * 注册同步
     */
    register(tag: string, data?: any): Promise<void>;
    /**
     * 添加到队列
     */
    private addToQueue;
    /**
     * 处理队列
     */
    processQueue(): Promise<void>;
    /**
     * 处理单个项
     */
    private processItem;
    /**
     * 获取队列长度
     */
    getQueueLength(): number;
    /**
     * 清空队列
     */
    clearQueue(): Promise<void>;
    /**
     * 销毁
     */
    destroy(): void;
}
//# sourceMappingURL=BackgroundSyncManager.d.ts.map