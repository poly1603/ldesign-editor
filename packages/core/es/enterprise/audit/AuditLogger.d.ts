/**
 * 审计日志系统
 * 记录所有编辑器操作，支持合规性审计
 */
import type { AuditConfig, AuditEvents, AuditLog, AuditQuery, AuditReport } from './types';
import { EventEmitter } from '../../core/EventEmitter';
export declare class AuditLogger extends EventEmitter<AuditEvents> {
    private config;
    private logs;
    private db?;
    private maxLogs;
    private batchSize;
    private batchTimer?;
    private pendingLogs;
    constructor(config?: AuditConfig);
    /**
     * 初始化
     */
    initialize(): Promise<void>;
    /**
     * 初始化数据库
     */
    private initDB;
    /**
     * 加载日志
     */
    private loadLogs;
    /**
     * 记录日志
     */
    log(log: Omit<AuditLog, 'id' | 'timestamp'>): void;
    /**
     * 批量保存
     */
    private scheduleBatchSave;
    /**
     * 保存批次
     */
    private saveBatch;
    /**
     * 保存到IndexedDB
     */
    private saveToIndexedDB;
    /**
     * 同步到服务器
     */
    private syncToServer;
    /**
     * 查询日志
     */
    query(query: AuditQuery): Promise<AuditLog[]>;
    /**
     * 生成报告
     */
    generateReport(options: {
        startTime?: number;
        endTime?: number;
        groupBy?: 'user' | 'action' | 'resource' | 'day';
    }): Promise<AuditReport>;
    /**
     * 计算统计信息
     */
    private calculateStatistics;
    /**
     * 计算高峰时段
     */
    private calculatePeakHours;
    /**
     * 分组日志
     */
    private groupLogs;
    /**
     * 导出日志
     */
    export(format?: 'json' | 'csv' | 'pdf'): Promise<Blob>;
    /**
     * 导出为CSV
     */
    private exportCSV;
    /**
     * 生成文本报告
     */
    private generateTextReport;
    /**
     * 清空日志
     */
    clear(): Promise<void>;
    /**
     * 哈希用户ID
     */
    private hashUserId;
    /**
     * 哈希IP地址
     */
    private hashIP;
    /**
     * 获取统计信息
     */
    getStats(): {
        totalLogs: number;
        pendingLogs: number;
        uniqueUsers: number;
        uniqueActions: number;
        oldestLog: number;
        newestLog: number;
    };
    /**
     * 销毁
     */
    destroy(): void;
}
