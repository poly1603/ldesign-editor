/**
 * 审计日志系统
 * 记录所有编辑器操作，支持合规性审计
 */
import { EventEmitter } from '../../core/EventEmitter';
import { createLogger } from '../../utils/logger';
const logger = createLogger('AuditLogger');
export class AuditLogger extends EventEmitter {
    constructor(config = {}) {
        super();
        this.logs = [];
        this.maxLogs = 10000;
        this.batchSize = 50;
        this.pendingLogs = [];
        this.config = {
            enabled: true,
            storage: 'indexeddb',
            maxLogs: 10000,
            batchSize: 50,
            batchDelay: 1000,
            persistToDisk: true,
            serverSync: false,
            serverUrl: '',
            includeContent: true,
            anonymize: false,
            ...config,
        };
        this.maxLogs = this.config.maxLogs;
        this.batchSize = this.config.batchSize;
    }
    /**
     * 初始化
     */
    async initialize() {
        if (!this.config.enabled) {
            logger.info('Audit logging is disabled');
            return;
        }
        logger.info('Initializing audit logger');
        if (this.config.storage === 'indexeddb') {
            await this.initDB();
            await this.loadLogs();
        }
        logger.info('Audit logger initialized');
    }
    /**
     * 初始化数据库
     */
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('ldesign-audit', 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('logs')) {
                    const store = db.createObjectStore('logs', { keyPath: 'id' });
                    store.createIndex('userId', 'userId', { unique: false });
                    store.createIndex('action', 'action', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                    store.createIndex('resource', 'resource', { unique: false });
                }
            };
        });
    }
    /**
     * 加载日志
     */
    async loadLogs() {
        if (!this.db)
            return;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['logs'], 'readonly');
            const store = transaction.objectStore('logs');
            const index = store.index('timestamp');
            // 获取最近的日志
            const request = index.openCursor(null, 'prev');
            const logs = [];
            let count = 0;
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor && count < 1000) {
                    logs.push(cursor.value);
                    count++;
                    cursor.continue();
                }
                else {
                    this.logs = logs.reverse();
                    logger.info(`Loaded ${this.logs.length} audit logs`);
                    resolve();
                }
            };
            request.onerror = () => reject(request.error);
        });
    }
    /**
     * 记录日志
     */
    log(log) {
        if (!this.config.enabled)
            return;
        const auditLog = {
            ...log,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
        };
        // 匿名化处理
        if (this.config.anonymize) {
            auditLog.userId = this.hashUserId(auditLog.userId);
            if (auditLog.metadata?.ip)
                auditLog.metadata.ip = this.hashIP(auditLog.metadata.ip);
        }
        // 添加到内存
        this.logs.push(auditLog);
        // 限制内存中的日志数量
        if (this.logs.length > this.maxLogs)
            this.logs.shift();
        // 批量持久化
        if (this.config.persistToDisk) {
            this.pendingLogs.push(auditLog);
            this.scheduleBatchSave();
        }
        // 触发事件
        this.emit('log-created', auditLog);
        logger.debug(`Audit log: ${log.action} by ${log.userId}`);
    }
    /**
     * 批量保存
     */
    scheduleBatchSave() {
        if (this.batchTimer)
            clearTimeout(this.batchTimer);
        if (this.pendingLogs.length >= this.batchSize) {
            this.saveBatch();
        }
        else {
            this.batchTimer = window.setTimeout(() => {
                this.saveBatch();
            }, this.config.batchDelay);
        }
    }
    /**
     * 保存批次
     */
    async saveBatch() {
        if (this.pendingLogs.length === 0)
            return;
        const logsToSave = [...this.pendingLogs];
        this.pendingLogs = [];
        // 保存到IndexedDB
        if (this.db)
            await this.saveToIndexedDB(logsToSave);
        // 同步到服务器
        if (this.config.serverSync && this.config.serverUrl)
            await this.syncToServer(logsToSave);
    }
    /**
     * 保存到IndexedDB
     */
    async saveToIndexedDB(logs) {
        if (!this.db)
            return;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['logs'], 'readwrite');
            const store = transaction.objectStore('logs');
            logs.forEach(log => store.add(log));
            transaction.oncomplete = () => {
                logger.debug(`Saved ${logs.length} audit logs to IndexedDB`);
                resolve();
            };
            transaction.onerror = () => reject(transaction.error);
        });
    }
    /**
     * 同步到服务器
     */
    async syncToServer(logs) {
        try {
            const response = await fetch(this.config.serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ logs }),
            });
            if (!response.ok)
                throw new Error(`Server sync failed: ${response.statusText}`);
            logger.debug(`Synced ${logs.length} audit logs to server`);
        }
        catch (error) {
            logger.error('Failed to sync audit logs:', error);
            this.emit('sync-error', error);
        }
    }
    /**
     * 查询日志
     */
    async query(query) {
        let results = [...this.logs];
        // 用户过滤
        if (query.userId)
            results = results.filter(log => log.userId === query.userId);
        // 操作过滤
        if (query.action)
            results = results.filter(log => log.action === query.action);
        // 资源过滤
        if (query.resource)
            results = results.filter(log => log.resource === query.resource);
        // 时间范围过滤
        if (query.startTime)
            results = results.filter(log => log.timestamp >= query.startTime);
        if (query.endTime)
            results = results.filter(log => log.timestamp <= query.endTime);
        // 排序
        results.sort((a, b) => {
            const field = query.sortBy || 'timestamp';
            const order = query.sortOrder === 'asc' ? 1 : -1;
            return (a[field] > b[field] ? 1 : -1) * order;
        });
        // 分页
        if (query.limit) {
            const offset = query.offset || 0;
            results = results.slice(offset, offset + query.limit);
        }
        return results;
    }
    /**
     * 生成报告
     */
    async generateReport(options) {
        const logs = await this.query({
            startTime: options.startTime,
            endTime: options.endTime,
        });
        const report = {
            totalLogs: logs.length,
            timeRange: {
                start: options.startTime || logs[0]?.timestamp || Date.now(),
                end: options.endTime || logs[logs.length - 1]?.timestamp || Date.now(),
            },
            statistics: this.calculateStatistics(logs),
            groupedData: this.groupLogs(logs, options.groupBy || 'action'),
            generatedAt: Date.now(),
        };
        return report;
    }
    /**
     * 计算统计信息
     */
    calculateStatistics(logs) {
        const stats = {
            totalActions: logs.length,
            uniqueUsers: new Set(logs.map(l => l.userId)).size,
            actionCounts: {},
            resourceCounts: {},
            peakHours: this.calculatePeakHours(logs),
        };
        logs.forEach((log) => {
            stats.actionCounts[log.action] = (stats.actionCounts[log.action] || 0) + 1;
            if (log.resource)
                stats.resourceCounts[log.resource] = (stats.resourceCounts[log.resource] || 0) + 1;
        });
        return stats;
    }
    /**
     * 计算高峰时段
     */
    calculatePeakHours(logs) {
        const hourCounts = {};
        logs.forEach((log) => {
            const hour = new Date(log.timestamp).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        return Object.entries(hourCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([hour]) => Number(hour));
    }
    /**
     * 分组日志
     */
    groupLogs(logs, groupBy) {
        const grouped = {};
        logs.forEach((log) => {
            let key;
            switch (groupBy) {
                case 'user':
                    key = log.userId;
                    break;
                case 'action':
                    key = log.action;
                    break;
                case 'resource':
                    key = log.resource || 'unknown';
                    break;
                case 'day':
                    key = new Date(log.timestamp).toISOString().split('T')[0];
                    break;
                default:
                    key = 'all';
            }
            if (!grouped[key])
                grouped[key] = [];
            grouped[key].push(log);
        });
        return grouped;
    }
    /**
     * 导出日志
     */
    async export(format = 'json') {
        const logs = this.logs;
        switch (format) {
            case 'json':
                return new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
            case 'csv':
                return this.exportCSV(logs);
            case 'pdf':
                // PDF导出需要额外的库，这里简化处理
                return new Blob([this.generateTextReport(logs)], { type: 'text/plain' });
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }
    /**
     * 导出为CSV
     */
    exportCSV(logs) {
        const headers = ['ID', '时间', '用户', '操作', '资源', '结果', 'IP地址'];
        const rows = logs.map(log => [
            log.id,
            new Date(log.timestamp).toISOString(),
            log.userId,
            log.action,
            log.resource || '',
            log.result || '',
            log.metadata?.ip || '',
        ]);
        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
        ].join('\n');
        return new Blob([csv], { type: 'text/csv' });
    }
    /**
     * 生成文本报告
     */
    generateTextReport(logs) {
        const report = [
            '审计日志报告',
            '='.repeat(50),
            `生成时间: ${new Date().toLocaleString()}`,
            `日志数量: ${logs.length}`,
            '',
            '详细记录:',
            '-'.repeat(50),
        ];
        logs.forEach((log) => {
            report.push(`[${new Date(log.timestamp).toLocaleString()}] ${log.userId} ${log.action} ${log.resource || ''}`);
            if (log.metadata)
                report.push(`  元数据: ${JSON.stringify(log.metadata)}`);
            report.push('');
        });
        return report.join('\n');
    }
    /**
     * 清空日志
     */
    async clear() {
        this.logs = [];
        if (this.db) {
            await new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['logs'], 'readwrite');
                const store = transaction.objectStore('logs');
                const request = store.clear();
                request.onsuccess = () => {
                    logger.info('Audit logs cleared');
                    resolve();
                };
                request.onerror = () => reject(request.error);
            });
        }
        this.emit('logs-cleared');
    }
    /**
     * 哈希用户ID
     */
    hashUserId(userId) {
        // 简单哈希（生产环境应使用更安全的方法）
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = ((hash << 5) - hash) + userId.charCodeAt(i);
            hash = hash & hash;
        }
        return `user-${Math.abs(hash).toString(36)}`;
    }
    /**
     * 哈希IP地址
     */
    hashIP(ip) {
        const parts = ip.split('.');
        if (parts.length === 4)
            return `${parts[0]}.${parts[1]}.xxx.xxx`;
        return 'xxx.xxx.xxx.xxx';
    }
    /**
     * 获取统计信息
     */
    getStats() {
        return {
            totalLogs: this.logs.length,
            pendingLogs: this.pendingLogs.length,
            uniqueUsers: new Set(this.logs.map(l => l.userId)).size,
            uniqueActions: new Set(this.logs.map(l => l.action)).size,
            oldestLog: this.logs[0]?.timestamp,
            newestLog: this.logs[this.logs.length - 1]?.timestamp,
        };
    }
    /**
     * 销毁
     */
    destroy() {
        if (this.batchTimer)
            clearTimeout(this.batchTimer);
        // 立即保存pending的日志
        if (this.pendingLogs.length > 0)
            this.saveBatch();
        this.db?.close();
        this.removeAllListeners();
        logger.info('Audit logger destroyed');
    }
}
//# sourceMappingURL=AuditLogger.js.map