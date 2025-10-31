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
import { createPlugin } from '../../core/Plugin';
import { createLogger } from '../../utils/logger';
const logger = createLogger('Collaboration');
/**
 * 协作管理器
 */
export class CollaborationManager {
    constructor(editor, userId) {
        this.users = new Map();
        this.cursors = new Map();
        this.operations = [];
        this.connected = false;
        this.ws = null;
        this.currentUserId = '';
        this.editor = editor;
        this.currentUserId = userId;
    }
    /**
     * 连接到协作服务器
     * @param url - WebSocket服务器URL
     */
    async connect(url) {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(url);
                this.ws.onopen = () => {
                    logger.info('Connected to collaboration server');
                    this.connected = true;
                    this.emit('connection:change', true);
                    resolve();
                };
                this.ws.onerror = (error) => {
                    logger.error('WebSocket error:', error);
                    reject(error);
                };
                this.ws.onclose = () => {
                    logger.info('Disconnected from collaboration server');
                    this.connected = false;
                    this.emit('connection:change', false);
                };
                this.ws.onmessage = (event) => {
                    this.handleMessage(JSON.parse(event.data));
                };
            }
            catch (error) {
                logger.error('Failed to connect:', error);
                reject(error);
            }
        });
    }
    /**
     * 断开连接
     */
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.connected = false;
    }
    /**
     * 处理服务器消息
     * @param message - 消息对象
     */
    handleMessage(message) {
        switch (message.type) {
            case 'user:joined':
                this.handleUserJoined(message.user);
                break;
            case 'user:left':
                this.handleUserLeft(message.userId);
                break;
            case 'cursor:update':
                this.handleCursorUpdate(message.cursor);
                break;
            case 'operation':
                this.handleOperation(message.operation);
                break;
            default:
                logger.warn('Unknown message type:', message.type);
        }
    }
    /**
     * 处理用户加入
     */
    handleUserJoined(user) {
        this.users.set(user.id, user);
        this.emit('user:joined', user);
        logger.info('User joined:', user.name);
    }
    /**
     * 处理用户离开
     */
    handleUserLeft(userId) {
        const user = this.users.get(userId);
        if (user) {
            this.users.delete(userId);
            this.cursors.delete(userId);
            this.emit('user:left', userId);
            logger.info('User left:', user.name);
        }
    }
    /**
     * 处理光标更新
     */
    handleCursorUpdate(cursor) {
        if (cursor.userId === this.currentUserId)
            return; // 忽略自己的光标
        this.cursors.set(cursor.userId, cursor);
        this.emit('cursor:update', cursor);
        this.renderRemoteCursor(cursor);
    }
    /**
     * 处理操作
     */
    handleOperation(operation) {
        if (operation.userId === this.currentUserId)
            return; // 忽略自己的操作
        this.operations.push(operation);
        this.applyOperation(operation);
        this.emit('content:update', operation);
    }
    /**
     * 应用操作到文档
     */
    applyOperation(operation) {
        const content = this.editor.getHTML();
        switch (operation.type) {
            case 'insert':
                if (operation.content)
                    this.insertAt(operation.position, operation.content);
                break;
            case 'delete':
                if (operation.length)
                    this.deleteAt(operation.position, operation.length);
                break;
            case 'retain':
                // 保留操作，不需要处理
                break;
        }
    }
    /**
     * 在指定位置插入内容
     */
    insertAt(position, content) {
        const html = this.editor.getHTML();
        const before = html.slice(0, position);
        const after = html.slice(position);
        this.editor.setHTML(before + content + after);
    }
    /**
     * 在指定位置删除内容
     */
    deleteAt(position, length) {
        const html = this.editor.getHTML();
        const before = html.slice(0, position);
        const after = html.slice(position + length);
        this.editor.setHTML(before + after);
    }
    /**
     * 渲染远程光标
     */
    renderRemoteCursor(cursor) {
        const user = this.users.get(cursor.userId);
        if (!user)
            return;
        // 移除旧的光标元素
        const oldCursor = document.getElementById(`cursor-${cursor.userId}`);
        if (oldCursor)
            oldCursor.remove();
        // 创建新的光标元素
        const cursorElement = document.createElement('span');
        cursorElement.id = `cursor-${cursor.userId}`;
        cursorElement.className = 'remote-cursor';
        cursorElement.style.cssText = `
      position: absolute;
      width: 2px;
      height: 1.2em;
      background-color: ${user.color};
      pointer-events: none;
      z-index: 1000;
    `;
        // 添加用户名标签
        const label = document.createElement('span');
        label.className = 'remote-cursor-label';
        label.textContent = user.name;
        label.style.cssText = `
      position: absolute;
      top: -20px;
      left: 0;
      background-color: ${user.color};
      color: white;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 12px;
      white-space: nowrap;
    `;
        cursorElement.appendChild(label);
        // TODO: 计算光标的实际位置并插入DOM
        // 这需要根据position计算DOM中的实际坐标
        if (this.editor.contentElement)
            this.editor.contentElement.appendChild(cursorElement);
    }
    /**
     * 发送本地光标位置
     */
    sendCursor(position, selection) {
        if (!this.connected || !this.ws)
            return;
        const cursor = {
            userId: this.currentUserId,
            position,
            selection,
        };
        this.ws.send(JSON.stringify({
            type: 'cursor:update',
            cursor,
        }));
    }
    /**
     * 发送操作
     */
    sendOperation(operation) {
        if (!this.connected || !this.ws)
            return;
        const fullOperation = {
            ...operation,
            userId: this.currentUserId,
            timestamp: Date.now(),
        };
        this.operations.push(fullOperation);
        this.ws.send(JSON.stringify({
            type: 'operation',
            operation: fullOperation,
        }));
    }
    /**
     * 获取在线用户列表
     */
    getOnlineUsers() {
        return Array.from(this.users.values()).filter(u => u.online);
    }
    /**
     * 获取协作历史
     */
    getHistory(limit) {
        if (limit)
            return this.operations.slice(-limit);
        return [...this.operations];
    }
    /**
     * 事件发射（简化版）
     */
    emit(event, data) {
        if (this.editor.emit)
            this.editor.emit(`collaboration:${event}`, data);
    }
    /**
     * 清理资源
     */
    destroy() {
        this.disconnect();
        this.users.clear();
        this.cursors.clear();
        this.operations = [];
        // 移除所有远程光标
        document.querySelectorAll('.remote-cursor').forEach(el => el.remove());
    }
}
/**
 * 创建协作插件
 */
export function createCollaborationPlugin(config = {}) {
    let manager = null;
    return createPlugin({
        name: 'collaboration',
        async init(editor) {
            const userId = config.userId || `user-${Date.now()}`;
            manager = new CollaborationManager(editor, userId);
            editor.collaboration = manager;
            // 自动连接
            if (config.autoConnect && config.serverUrl) {
                try {
                    await manager.connect(config.serverUrl);
                    logger.info('Auto-connected to collaboration server');
                }
                catch (error) {
                    logger.error('Auto-connect failed:', error);
                }
            }
            // 监听编辑器变化，发送操作
            editor.on('update', () => {
                // TODO: 将编辑器变化转换为操作并发送
            });
            // 监听选区变化，发送光标位置
            editor.on('selectionUpdate', () => {
                // TODO: 发送光标位置
            });
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
export const CollaborationPlugin = createCollaborationPlugin();
/**
 * 获取协作管理器
 * @param editor - 编辑器实例
 * @returns 协作管理器
 */
export function getCollaborationManager(editor) {
    return editor.collaboration || null;
}
//# sourceMappingURL=index.js.map