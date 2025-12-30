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
import type { EditorInstance } from '../../types';
/**
 * 版本快照
 */
export interface Version {
    /** 版本ID */
    id: string;
    /** 版本名称 */
    name: string;
    /** 创建时间 */
    timestamp: number;
    /** 内容 */
    content: string;
    /** 创建者 */
    author?: string;
    /** 标签 */
    tags?: string[];
    /** 描述 */
    description?: string;
}
/**
 * 变更类型
 */
export type ChangeType = 'add' | 'remove' | 'modify';
/**
 * 文档变更
 */
export interface Change {
    /** 变更类型 */
    type: ChangeType;
    /** 位置 */
    position: number;
    /** 旧内容 */
    oldContent?: string;
    /** 新内容 */
    newContent?: string;
}
/**
 * Diff结果
 */
export interface DiffResult {
    /** 变更列表 */
    changes: Change[];
    /** 添加的字符数 */
    additions: number;
    /** 删除的字符数 */
    deletions: number;
    /** 修改的字符数 */
    modifications: number;
}
/**
 * 版本控制管理器
 */
export declare class VersionControlManager {
    private editor;
    private versions;
    private currentVersionId;
    private maxVersions;
    private autoSaveInterval;
    private autoSaveTimer;
    constructor(editor: EditorInstance, options?: {
        maxVersions?: number;
        autoSaveInterval?: number;
    });
    /**
     * 启动自动保存
     */
    startAutoSave(): void;
    /**
     * 停止自动保存
     */
    stopAutoSave(): void;
    /**
     * 创建版本快照
     * @param name - 版本名称
     * @param options - 版本选项
     * @returns 创建的版本
     */
    createVersion(name: string, options?: Partial<Omit<Version, 'id' | 'timestamp' | 'content' | 'name'>>): Version;
    /**
     * 获取所有版本
     * @returns 版本列表
     */
    getVersions(): Version[];
    /**
     * 获取指定版本
     * @param id - 版本ID
     * @returns 版本对象
     */
    getVersion(id: string): Version | null;
    /**
     * 恢复到指定版本
     * @param id - 版本ID
     * @returns 是否成功
     */
    restoreVersion(id: string): boolean;
    /**
     * 比较两个版本
     * @param fromId - 起始版本ID
     * @param toId - 目标版本ID
     * @returns Diff结果
     */
    compareVersions(fromId: string, toId: string): DiffResult | null;
    /**
     * 与当前内容比较
     * @param versionId - 版本ID
     * @returns Diff结果
     */
    compareWithCurrent(versionId: string): DiffResult | null;
    /**
     * 简单的Diff算法（基于字符）
     * @param oldContent - 旧内容
     * @param newContent - 新内容
     * @returns Diff结果
     */
    private diff;
    /**
     * 删除版本
     * @param id - 版本ID
     * @returns 是否成功
     */
    deleteVersion(id: string): boolean;
    /**
     * 清空所有版本
     */
    clearVersions(): void;
    /**
     * 导出版本历史
     * @returns JSON字符串
     */
    exportHistory(): string;
    /**
     * 导入版本历史
     * @param json - JSON字符串
     */
    importHistory(json: string): void;
    /**
     * 清理资源
     */
    destroy(): void;
}
/**
 * 版本控制插件配置
 */
export interface VersionControlPluginConfig {
    /** 最大版本数 */
    maxVersions?: number;
    /** 自动保存间隔（毫秒） */
    autoSaveInterval?: number;
    /** 是否启用自动保存 */
    enableAutoSave?: boolean;
}
/**
 * 创建版本控制插件
 */
export declare function createVersionControlPlugin(config?: VersionControlPluginConfig): import("../../types").Plugin;
/**
 * 默认导出
 */
export declare const VersionControlPlugin: import("../../types").Plugin;
/**
 * 获取版本控制管理器
 * @param editor - 编辑器实例
 * @returns 版本控制管理器
 */
export declare function getVersionControlManager(editor: EditorInstance): VersionControlManager | null;
//# sourceMappingURL=index.d.ts.map