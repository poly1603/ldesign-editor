/**
 * 缓存管理器
 */
import type { PWAConfig } from './types';
import { EventEmitter } from '../core/EventEmitter';
export declare class CacheManager extends EventEmitter {
    private config;
    private cacheName;
    private cacheVersion;
    constructor(config: PWAConfig);
    /**
     * 初始化缓存
     */
    initialize(): Promise<void>;
    /**
     * 添加资源到缓存
     */
    addResources(urls: string[]): Promise<void>;
    /**
     * 从缓存获取
     */
    get(request: Request | string): Promise<Response | undefined>;
    /**
     * 添加到缓存
     */
    put(request: Request | string, response: Response): Promise<void>;
    /**
     * 删除缓存项
     */
    delete(request: Request | string): Promise<boolean>;
    /**
     * 清除所有缓存
     */
    clear(cacheName?: string): Promise<void>;
    /**
     * 清理旧版本缓存
     */
    private cleanOldCaches;
    /**
     * 获取缓存大小
     */
    getSize(): Promise<number>;
    /**
     * 获取所有缓存的URL
     */
    getCachedUrls(): Promise<string[]>;
    /**
     * 销毁
     */
    destroy(): void;
}
//# sourceMappingURL=CacheManager.d.ts.map