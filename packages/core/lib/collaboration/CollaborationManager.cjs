/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var event = require('../utils/event.cjs');
var logger$1 = require('../utils/logger.cjs');
var CRDT = require('./crdt/CRDT.cjs');

const logger = logger$1.createLogger("CollaborationManager");
class CollaborationManager extends event.EventEmitter {
  constructor(editor, config) {
    super();
    this.users = /* @__PURE__ */ new Map();
    this.rtcConnections = /* @__PURE__ */ new Map();
    this.status = "disconnected";
    this.reconnectAttempts = 0;
    this.editor = editor;
    this.config = {
      heartbeatInterval: 3e4,
      syncInterval: 5e3,
      autoReconnect: true,
      maxReconnectAttempts: 5,
      enableP2P: false,
      cursorColor: this.generateColor(),
      ...config,
      siteId: config.siteId,
      user: config.user
    };
    this.crdt = new CRDT.CRDT(config.siteId);
    this.users.set(this.crdt.getSiteId(), {
      id: config.user.id,
      name: config.user.name,
      siteId: this.crdt.getSiteId(),
      avatar: config.user.avatar,
      color: this.config.cursorColor,
      lastActive: Date.now(),
      online: true
    });
    this.setupEditorListeners();
  }
  /**
   * 连接到协作服务器
   */
  async connect() {
    if (!this.config.serverUrl) {
      logger.warn("No server URL configured");
      return;
    }
    try {
      this.setStatus("connecting");
      logger.info(`Connecting to ${this.config.serverUrl}`);
      this.ws = new WebSocket(this.config.serverUrl);
      this.setupWebSocketListeners();
      await new Promise((resolve, reject) => {
        if (!this.ws)
          return reject(new Error("WebSocket not created"));
        this.ws.onopen = () => resolve();
        this.ws.onerror = () => reject(new Error("Connection failed"));
        setTimeout(() => reject(new Error("Connection timeout")), 1e4);
      });
      this.setStatus("connected");
      this.sendJoin();
      this.startHeartbeat();
      this.startSync();
      logger.info("Connected to collaboration server");
    } catch (error) {
      logger.error("Failed to connect:", error);
      this.setStatus("error");
      this.emit("error", [error]);
      if (this.config.autoReconnect && this.reconnectAttempts < this.config.maxReconnectAttempts)
        this.reconnect();
    }
  }
  /**
   * 断开连接
   */
  disconnect() {
    if (this.ws) {
      this.sendLeave();
      this.ws.close();
      this.ws = void 0;
    }
    this.stopHeartbeat();
    this.stopSync();
    this.closeAllP2PConnections();
    this.setStatus("disconnected");
    logger.info("Disconnected from collaboration server");
  }
  /**
   * 重新连接
   */
  async reconnect() {
    this.reconnectAttempts++;
    this.setStatus("reconnecting");
    logger.info(`Reconnecting... (attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);
    const delay = Math.min(1e3 * 2 ** (this.reconnectAttempts - 1), 3e4);
    await new Promise((resolve) => setTimeout(resolve, delay));
    await this.connect();
  }
  /**
   * 设置状态
   */
  setStatus(status) {
    this.status = status;
    this.emit("connection-status", [status]);
  }
  /**
   * 设置编辑器监听
   */
  setupEditorListeners() {
    let isRemoteChange = false;
    this.editor.on("change", (change) => {
      if (isRemoteChange)
        return;
      const operations = this.handleEditorChange(change);
      operations.forEach((op) => this.broadcastOperation(op));
    });
    this.on("remote-operation", (...args) => {
      isRemoteChange = true;
      this.applyRemoteOperation(args[0]);
      isRemoteChange = false;
    });
  }
  /**
   * 处理编辑器变化
   */
  handleEditorChange(change) {
    const operations = [];
    if (change.type === "insert") {
      for (let i = 0; i < change.text.length; i++)
        operations.push(this.crdt.insert(change.from + i, change.text[i]));
    } else if (change.type === "delete") {
      for (let i = 0; i < change.length; i++) {
        const op = this.crdt.delete(change.from);
        if (op)
          operations.push(op);
      }
    }
    return operations;
  }
  /**
   * 应用远程操作
   */
  applyRemoteOperation(operation) {
    this.crdt.applyOperation(operation);
    const newText = this.crdt.getText();
    if ("setContent" in this.editor && typeof this.editor.setContent === "function") {
      this.editor.setContent(newText);
    }
  }
  /**
   * 设置WebSocket监听
   */
  setupWebSocketListeners() {
    if (!this.ws)
      return;
    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        logger.error("Failed to parse message:", error);
      }
    };
    this.ws.onclose = () => {
      logger.info("WebSocket closed");
      this.setStatus("disconnected");
      if (this.config.autoReconnect)
        this.reconnect();
    };
    this.ws.onerror = (error) => {
      logger.error("WebSocket error:", error);
      this.emit("error", [new Error("WebSocket error")]);
    };
  }
  /**
   * 处理消息
   */
  handleMessage(message) {
    logger.debug(`Received message: ${message.type}`);
    switch (message.type) {
      case "operation":
        this.handleOperationMessage(message);
        break;
      case "cursor":
        this.handleCursorMessage(message);
        break;
      case "join":
        this.handleJoinMessage(message);
        break;
      case "leave":
        this.handleLeaveMessage(message);
        break;
      case "sync-response":
        this.handleSyncResponse(message);
        break;
    }
  }
  /**
   * 处理操作消息
   */
  handleOperationMessage(message) {
    const operation = message.payload;
    this.emit("remote-operation", [operation]);
  }
  /**
   * 处理光标消息
   */
  handleCursorMessage(message) {
    const {
      userId,
      cursor
    } = message.payload;
    const user = Array.from(this.users.values()).find((u) => u.id === userId);
    if (user) {
      user.cursor = cursor;
      user.lastActive = Date.now();
      this.emit("cursor-update", [userId, cursor]);
    }
  }
  /**
   * 处理加入消息
   */
  handleJoinMessage(message) {
    const user = message.payload;
    this.users.set(user.siteId, user);
    this.emit("user-joined", [user]);
    logger.info(`User joined: ${user.name}`);
  }
  /**
   * 处理离开消息
   */
  handleLeaveMessage(message) {
    const userId = message.payload.userId;
    const user = Array.from(this.users.values()).find((u) => u.id === userId);
    if (user) {
      this.users.delete(user.siteId);
      this.emit("user-left", [userId]);
      logger.info(`User left: ${user.name}`);
    }
  }
  /**
   * 处理同步响应
   */
  handleSyncResponse(message) {
    const state = message.payload;
    const newOps = this.crdt.merge(state);
    newOps.forEach((op) => this.emit("remote-operation", [op]));
    this.emit("sync-complete", []);
  }
  /**
   * 广播操作
   */
  broadcastOperation(operation) {
    this.sendMessage({
      type: "operation",
      payload: operation
    });
  }
  /**
   * 发送消息
   */
  sendMessage(message) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      logger.warn("Cannot send message: not connected");
      return;
    }
    const fullMessage = {
      ...message,
      from: this.crdt.getSiteId(),
      timestamp: Date.now(),
      id: `${Date.now()}-${Math.random()}`
    };
    this.ws.send(JSON.stringify(fullMessage));
  }
  /**
   * 发送加入消息
   */
  sendJoin() {
    const user = this.users.get(this.crdt.getSiteId());
    this.sendMessage({
      type: "join",
      payload: user
    });
  }
  /**
   * 发送离开消息
   */
  sendLeave() {
    this.sendMessage({
      type: "leave",
      payload: {
        userId: this.config.user.id
      }
    });
  }
  /**
   * 启动心跳
   */
  startHeartbeat() {
    this.heartbeatTimer = window.setInterval(() => {
      this.sendMessage({
        type: "heartbeat",
        payload: {
          siteId: this.crdt.getSiteId(),
          clock: this.crdt.getClock()
        }
      });
    }, this.config.heartbeatInterval);
  }
  /**
   * 停止心跳
   */
  stopHeartbeat() {
    if (this.heartbeatTimer)
      clearInterval(this.heartbeatTimer);
  }
  /**
   * 启动定期同步
   */
  startSync() {
    this.syncTimer = window.setInterval(() => {
      this.requestSync();
    }, this.config.syncInterval);
  }
  /**
   * 停止同步
   */
  stopSync() {
    if (this.syncTimer)
      clearInterval(this.syncTimer);
  }
  /**
   * 请求同步
   */
  requestSync() {
    this.sendMessage({
      type: "sync-request",
      payload: {
        versionVector: Object.fromEntries(this.crdt.versionVector)
      }
    });
  }
  /**
   * 关闭所有P2P连接
   */
  closeAllP2PConnections() {
    this.rtcConnections.forEach((conn) => conn.close());
    this.rtcConnections.clear();
  }
  /**
   * 生成颜色
   */
  generateColor() {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52B788"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  /**
   * 获取在线用户
   */
  getOnlineUsers() {
    return Array.from(this.users.values()).filter((u) => u.online);
  }
  /**
   * 获取连接状态
   */
  getStatus() {
    return this.status;
  }
  /**
   * 获取CRDT状态
   */
  getCRDTState() {
    return this.crdt.getState();
  }
  /**
   * 销毁
   */
  destroy() {
    this.disconnect();
    if (typeof this.removeAllListeners === "function") {
      this.removeAllListeners();
    }
    logger.info("Collaboration manager destroyed");
  }
}

exports.CollaborationManager = CollaborationManager;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=CollaborationManager.cjs.map
