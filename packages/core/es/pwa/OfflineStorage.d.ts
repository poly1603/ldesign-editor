/**
 * 离线存储管理器
 * 使用IndexedDB存储离线编辑数据
 */
import type { OfflineData } from './types';
export declare class OfflineStorage {
    private db?;
    private dbName;
    private version;
    private storeName;
    /**
     * 初始化
     */
    initialize(): Promise<void>;
    /**
     * 保存数据
     */
    save(data: Omit<OfflineData, 'createdAt' | 'updatedAt' | 'synced'>): Promise<void>;
    /**
     * 获取数据
     */
    get(id: string): Promise<OfflineData | undefined>;
    /**
     * 获取所有数据
     */
    getAll(): Promise<OfflineData[]>;
    /**
     * 获取未同步的数据
     */
    getUnsynced(): Promise<OfflineData[]>;
    /**
     * 更新数据
     */
    update(id: string, updates: Partial<OfflineData>): Promise<void>;
    /**
     * 标记为已同步
     */
    markAsSynced(id: string): Promise<void>;
    /**
     * 删除数据
     */
    delete(id: string): Promise<void>;
    /**
     * 清空所有数据
     */
    clear(): Promise<void>;
    /**
     * 获取存储大小
     */
    getSize(): Promise<number>;
    /**
     * 销毁
     */
    destroy(): void;
}
