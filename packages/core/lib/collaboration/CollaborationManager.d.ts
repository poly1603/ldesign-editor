/**
 * 协作管理器
 * 管理实时协作编辑、CRDT同步、P2P连接
 */
import type { Editor } from '../core/Editor';
import type { CollaborationConfig, CollaborationUser, ConnectionStatus } from './crdt/types';
import { EventEmitter } from '../core/EventEmitter';
export declare class CollaborationManager extends EventEmitter<any> {
    private editor;
    private config;
    private crdt;
    private users;
    private ws?;
    private rtcConnections;
    private status;
    private heartbeatTimer?;
    private syncTimer?;
    private reconnectAttempts;
    constructor(editor: Editor, config: CollaborationConfig);
    /**
     * 连接到协作服务器
     */
    connect(): Promise<void>;
    /**
     * 断开连接
     */
    disconnect(): void;
    /**
     * 重新连接
     */
    private reconnect;
    /**
     * 设置状态
     */
    private setStatus;
    /**
     * 设置编辑器监听
     */
    private setupEditorListeners;
    /**
     * 处理编辑器变化
     */
    private handleEditorChange;
    /**
     * 应用远程操作
     */
    private applyRemoteOperation;
    /**
     * 设置WebSocket监听
     */
    private setupWebSocketListeners;
    /**
     * 处理消息
     */
    private handleMessage;
    /**
     * 处理操作消息
     */
    private handleOperationMessage;
    /**
     * 处理光标消息
     */
    private handleCursorMessage;
    /**
     * 处理加入消息
     */
    private handleJoinMessage;
    /**
     * 处理离开消息
     */
    private handleLeaveMessage;
    /**
     * 处理同步响应
     */
    private handleSyncResponse;
    /**
     * 广播操作
     */
    private broadcastOperation;
    /**
     * 发送消息
     */
    private sendMessage;
    /**
     * 发送加入消息
     */
    private sendJoin;
    /**
     * 发送离开消息
     */
    private sendLeave;
    /**
     * 启动心跳
     */
    private startHeartbeat;
    /**
     * 停止心跳
     */
    private stopHeartbeat;
    /**
     * 启动定期同步
     */
    private startSync;
    /**
     * 停止同步
     */
    private stopSync;
    /**
     * 请求同步
     */
    private requestSync;
    /**
     * 关闭所有P2P连接
     */
    private closeAllP2PConnections;
    /**
     * 生成颜色
     */
    private generateColor;
    /**
     * 获取在线用户
     */
    getOnlineUsers(): CollaborationUser[];
    /**
     * 获取连接状态
     */
    getStatus(): ConnectionStatus;
    /**
     * 获取CRDT状态
     */
    getCRDTState(): import(".").CRDTState;
    /**
     * 销毁
     */
    destroy(): void;
}
//# sourceMappingURL=CollaborationManager.d.ts.map