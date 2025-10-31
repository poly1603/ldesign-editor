/**
 * 版本控制插件
 * 文档快照、版本对比、回滚功能
 *
 * 功能:
 * - 自动快照
 * - 手动保存版本
 * - 版本对比（Diff）
 * - 版本回滚
 * - 变更历史
 *
 * @packageDocumentation
 */
import { createPlugin } from '../../core/Plugin';
import { generateId } from '../../utils/helpers';
import { createLogger } from '../../utils/logger';
const logger = createLogger('VersionControl');
/**
 * 版本控制管理器
 */
export class VersionControlManager {
    constructor(editor, options = {}) {
        this.versions = [];
        this.currentVersionId = null;
        this.maxVersions = 50;
        this.autoSaveInterval = 5 * 60 * 1000; // 5分钟
        this.autoSaveTimer = null;
        this.editor = editor;
        this.maxVersions = options.maxVersions || 50;
        this.autoSaveInterval = options.autoSaveInterval || 5 * 60 * 1000;
    }
    /**
     * 启动自动保存
     */
    startAutoSave() {
        if (this.autoSaveTimer !== null)
            return;
        this.autoSaveTimer = window.setInterval(() => {
            this.createVersion('Auto-save');
        }, this.autoSaveInterval);
        logger.info('Auto-save started');
    }
    /**
     * 停止自动保存
     */
    stopAutoSave() {
        if (this.autoSaveTimer !== null) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
            logger.info('Auto-save stopped');
        }
    }
    /**
     * 创建版本快照
     * @param name - 版本名称
     * @param options - 版本选项
     * @returns 创建的版本
     */
    createVersion(name, options = {}) {
        const version = {
            id: generateId(),
            name,
            timestamp: Date.now(),
            content: this.editor.getHTML(),
            ...options,
        };
        this.versions.push(version);
        this.currentVersionId = version.id;
        // 限制版本数量
        if (this.versions.length > this.maxVersions)
            this.versions.shift();
        logger.info(`Version created: ${name}`);
        return version;
    }
    /**
     * 获取所有版本
     * @returns 版本列表
     */
    getVersions() {
        return [...this.versions];
    }
    /**
     * 获取指定版本
     * @param id - 版本ID
     * @returns 版本对象
     */
    getVersion(id) {
        return this.versions.find(v => v.id === id) || null;
    }
    /**
     * 恢复到指定版本
     * @param id - 版本ID
     * @returns 是否成功
     */
    restoreVersion(id) {
        const version = this.getVersion(id);
        if (!version) {
            logger.error(`Version not found: ${id}`);
            return false;
        }
        // 在恢复前创建当前版本快照
        this.createVersion('Before restore');
        // 恢复内容
        this.editor.setHTML(version.content);
        this.currentVersionId = version.id;
        logger.info(`Restored to version: ${version.name}`);
        return true;
    }
    /**
     * 比较两个版本
     * @param fromId - 起始版本ID
     * @param toId - 目标版本ID
     * @returns Diff结果
     */
    compareVersions(fromId, toId) {
        const fromVersion = this.getVersion(fromId);
        const toVersion = this.getVersion(toId);
        if (!fromVersion || !toVersion) {
            logger.error('One or both versions not found');
            return null;
        }
        return this.diff(fromVersion.content, toVersion.content);
    }
    /**
     * 与当前内容比较
     * @param versionId - 版本ID
     * @returns Diff结果
     */
    compareWithCurrent(versionId) {
        const version = this.getVersion(versionId);
        if (!version) {
            logger.error(`Version not found: ${versionId}`);
            return null;
        }
        return this.diff(version.content, this.editor.getHTML());
    }
    /**
     * 简单的Diff算法（基于字符）
     * @param oldContent - 旧内容
     * @param newContent - 新内容
     * @returns Diff结果
     */
    diff(oldContent, newContent) {
        const changes = [];
        let additions = 0;
        let deletions = 0;
        let modifications = 0;
        // 简单的逐字符比较（生产环境应使用更好的diff算法）
        const maxLen = Math.max(oldContent.length, newContent.length);
        for (let i = 0; i < maxLen; i++) {
            const oldChar = oldContent[i];
            const newChar = newContent[i];
            if (oldChar !== newChar) {
                if (!oldChar) {
                    // 添加
                    changes.push({
                        type: 'add',
                        position: i,
                        newContent: newChar,
                    });
                    additions++;
                }
                else if (!newChar) {
                    // 删除
                    changes.push({
                        type: 'remove',
                        position: i,
                        oldContent: oldChar,
                    });
                    deletions++;
                }
                else {
                    // 修改
                    changes.push({
                        type: 'modify',
                        position: i,
                        oldContent: oldChar,
                        newContent: newChar,
                    });
                    modifications++;
                }
            }
        }
        return {
            changes,
            additions,
            deletions,
            modifications,
        };
    }
    /**
     * 删除版本
     * @param id - 版本ID
     * @returns 是否成功
     */
    deleteVersion(id) {
        const index = this.versions.findIndex(v => v.id === id);
        if (index === -1)
            return false;
        this.versions.splice(index, 1);
        logger.info(`Version deleted: ${id}`);
        return true;
    }
    /**
     * 清空所有版本
     */
    clearVersions() {
        this.versions = [];
        this.currentVersionId = null;
        logger.info('All versions cleared');
    }
    /**
     * 导出版本历史
     * @returns JSON字符串
     */
    exportHistory() {
        return JSON.stringify(this.versions, null, 2);
    }
    /**
     * 导入版本历史
     * @param json - JSON字符串
     */
    importHistory(json) {
        try {
            const versions = JSON.parse(json);
            if (Array.isArray(versions)) {
                this.versions = versions;
                logger.info(`Imported ${versions.length} versions`);
            }
        }
        catch (error) {
            logger.error('Failed to import history:', error);
        }
    }
    /**
     * 清理资源
     */
    destroy() {
        this.stopAutoSave();
        this.clearVersions();
    }
}
/**
 * 创建版本控制插件
 */
export function createVersionControlPlugin(config = {}) {
    let manager = null;
    return createPlugin({
        name: 'version-control',
        commands: {
            // 创建版本
            'version:create': (state, dispatch, editor) => {
                if (manager && editor) {
                    manager.createVersion(`Version ${manager.getVersions().length + 1}`);
                    return true;
                }
                return false;
            },
            // 恢复版本
            'version:restore': (state, dispatch, editor) => {
                // 需要传入版本ID
                return false;
            },
        },
        init(editor) {
            manager = new VersionControlManager(editor, {
                maxVersions: config.maxVersions,
                autoSaveInterval: config.autoSaveInterval,
            });
            editor.versionControl = manager;
            // 启用自动保存
            if (config.enableAutoSave)
                manager.startAutoSave();
            logger.info('Version control initialized');
        },
        destroy() {
            if (manager) {
                manager.destroy();
                manager = null;
            }
        },
    });
}
/**
 * 默认导出
 */
export const VersionControlPlugin = createVersionControlPlugin();
/**
 * 获取版本控制管理器
 * @param editor - 编辑器实例
 * @returns 版本控制管理器
 */
export function getVersionControlManager(editor) {
    return editor.versionControl || null;
}
//# sourceMappingURL=index.js.map