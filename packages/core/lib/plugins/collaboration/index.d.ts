/**
 * 协作编辑插件
 * 支持多用户实时协作编辑
 *
 * 功能:
 * - 多用户光标显示
 * - 实时内容同步
 * - 用户在线状态
 * - 冲突检测
 * - 协作历史
 *
 * @packageDocumentation
 */
import type { EditorInstance } from '../../types';
/**
 * 用户信息
 */
export interface CollaborationUser {
    /** 用户ID */
    id: string;
    /** 用户名 */
    name: string;
    /** 用户颜色（用于光标和高亮） */
    color: string;
    /** 是否在线 */
    online: boolean;
    /** 最后活动时间 */
    lastActivity: number;
}
/**
 * 远程光标
 */
export interface RemoteCursor {
    /** 用户ID */
    userId: string;
    /** 光标位置 */
    position: number;
    /** 选区范围 */
    selection?: {
        from: number;
        to: number;
    };
}
/**
 * 操作类型（用于OT算法）
 */
export type OperationType = 'insert' | 'delete' | 'retain';
/**
 * 文档操作（Operational Transformation）
 */
export interface Operation {
    /** 操作类型 */
    type: OperationType;
    /** 位置 */
    position: number;
    /** 内容（insert操作） */
    content?: string;
    /** 长度（delete/retain操作） */
    length?: number;
    /** 用户ID */
    userId: string;
    /** 时间戳 */
    timestamp: number;
}
/**
 * 协作事件
 */
export interface CollaborationEvents {
    /** 用户加入 */
    'user:joined': (user: CollaborationUser) => void;
    /** 用户离开 */
    'user:left': (userId: string) => void;
    /** 光标更新 */
    'cursor:update': (cursor: RemoteCursor) => void;
    /** 内容更新 */
    'content:update': (operation: Operation) => void;
    /** 连接状态变化 */
    'connection:change': (connected: boolean) => void;
}
/**
 * 协作管理器
 */
export declare class CollaborationManager {
    private editor;
    private users;
    private cursors;
    private operations;
    private connected;
    private ws;
    private currentUserId;
    constructor(editor: EditorInstance, userId: string);
    /**
     * 连接到协作服务器
     * @param url - WebSocket服务器URL
     */
    connect(url: string): Promise<void>;
    /**
     * 断开连接
     */
    disconnect(): void;
    /**
     * 处理服务器消息
     * @param message - 消息对象
     */
    private handleMessage;
    /**
     * 处理用户加入
     */
    private handleUserJoined;
    /**
     * 处理用户离开
     */
    private handleUserLeft;
    /**
     * 处理光标更新
     */
    private handleCursorUpdate;
    /**
     * 处理操作
     */
    private handleOperation;
    /**
     * 应用操作到文档
     */
    private applyOperation;
    /**
     * 在指定位置插入内容
     */
    private insertAt;
    /**
     * 在指定位置删除内容
     */
    private deleteAt;
    /**
     * 渲染远程光标
     */
    private renderRemoteCursor;
    /**
     * 发送本地光标位置
     */
    sendCursor(position: number, selection?: {
        from: number;
        to: number;
    }): void;
    /**
     * 发送操作
     */
    sendOperation(operation: Omit<Operation, 'userId' | 'timestamp'>): void;
    /**
     * 获取在线用户列表
     */
    getOnlineUsers(): CollaborationUser[];
    /**
     * 获取协作历史
     */
    getHistory(limit?: number): Operation[];
    /**
     * 事件发射（简化版）
     */
    private emit;
    /**
     * 清理资源
     */
    destroy(): void;
}
/**
 * 协作插件配置
 */
export interface CollaborationPluginConfig {
    /** WebSocket服务器URL */
    serverUrl?: string;
    /** 当前用户ID */
    userId?: string;
    /** 当前用户名 */
    userName?: string;
    /** 用户颜色 */
    userColor?: string;
    /** 是否自动连接 */
    autoConnect?: boolean;
}
/**
 * 创建协作插件
 */
export declare function createCollaborationPlugin(config?: CollaborationPluginConfig): import("../../types").Plugin;
/**
 * 默认导出
 */
export declare const CollaborationPlugin: import("../../types").Plugin;
/**
 * 获取协作管理器
 * @param editor - 编辑器实例
 * @returns 协作管理器
 */
export declare function getCollaborationManager(editor: EditorInstance): CollaborationManager | null;
//# sourceMappingURL=index.d.ts.map