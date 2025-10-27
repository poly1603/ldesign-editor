/**
 * 协作管理器
 * 管理实时协作编辑、CRDT同步、P2P连接
 */

import { EventEmitter } from '../core/EventEmitter'
import { createLogger } from '../utils/logger'
import { CRDT } from './crdt/CRDT'
import type { Editor } from '../core/Editor'
import type {
  CollaborationConfig,
  CollaborationUser,
  CollaborationMessage,
  CollaborationEvents,
  ConnectionStatus,
  CRDTOperation
} from './crdt/types'

const logger = createLogger('CollaborationManager')

export class CollaborationManager extends EventEmitter<CollaborationEvents> {
  private editor: Editor
  private config: Required<CollaborationConfig>
  private crdt: CRDT
  private users = new Map<string, CollaborationUser>()
  private ws?: WebSocket
  private rtcConnections = new Map<string, RTCPeerConnection>()
  private status: ConnectionStatus = 'disconnected'
  private heartbeatTimer?: number
  private syncTimer?: number
  private reconnectAttempts = 0

  constructor(editor: Editor, config: CollaborationConfig) {
    super()
    this.editor = editor
    this.config = {
      heartbeatInterval: 30000,
      syncInterval: 5000,
      autoReconnect: true,
      maxReconnectAttempts: 5,
      enableP2P: false,
      cursorColor: this.generateColor(),
      ...config
    }

    // 初始化CRDT
    this.crdt = new CRDT(config.siteId)

    // 设置当前用户
    this.users.set(this.crdt.getSiteId(), {
      id: config.user.id,
      name: config.user.name,
      siteId: this.crdt.getSiteId(),
      avatar: config.user.avatar,
      color: this.config.cursorColor,
      lastActive: Date.now(),
      online: true
    })

    this.setupEditorListeners()
  }

  /**
   * 连接到协作服务器
   */
  async connect(): Promise<void> {
    if (!this.config.serverUrl) {
      logger.warn('No server URL configured')
      return
    }

    try {
      this.setStatus('connecting')

      logger.info(`Connecting to ${this.config.serverUrl}`)

      this.ws = new WebSocket(this.config.serverUrl)
      this.setupWebSocketListeners()

      // 等待连接建立
      await new Promise<void>((resolve, reject) => {
        if (!this.ws) return reject(new Error('WebSocket not created'))

        this.ws.onopen = () => resolve()
        this.ws.onerror = () => reject(new Error('Connection failed'))

        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      })

      this.setStatus('connected')

      // 发送加入消息
      this.sendJoin()

      // 启动心跳
      this.startHeartbeat()

      // 启动定期同步
      this.startSync()

      logger.info('Connected to collaboration server')
    } catch (error) {
      logger.error('Failed to connect:', error)
      this.setStatus('error')
      this.emit('error', error as Error)

      // 自动重连
      if (this.config.autoReconnect && this.reconnectAttempts < this.config.maxReconnectAttempts) {
        this.reconnect()
      }
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.ws) {
      this.sendLeave()
      this.ws.close()
      this.ws = undefined
    }

    this.stopHeartbeat()
    this.stopSync()
    this.closeAllP2PConnections()

    this.setStatus('disconnected')
    logger.info('Disconnected from collaboration server')
  }

  /**
   * 重新连接
   */
  private async reconnect(): Promise<void> {
    this.reconnectAttempts++
    this.setStatus('reconnecting')

    logger.info(`Reconnecting... (attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`)

    // 等待一段时间后重连
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000)
    await new Promise(resolve => setTimeout(resolve, delay))

    await this.connect()
  }

  /**
   * 设置状态
   */
  private setStatus(status: ConnectionStatus): void {
    this.status = status
    this.emit('connection-status', status)
  }

  /**
   * 设置编辑器监听
   */
  private setupEditorListeners(): void {
    // 监听编辑器变化
    let isRemoteChange = false

    this.editor.on('change', (change: any) => {
      if (isRemoteChange) return

      // 将编辑器变化转换为CRDT操作
      const operations = this.handleEditorChange(change)

      // 广播操作
      operations.forEach(op => this.broadcastOperation(op))
    })

    // 应用远程操作时设置标志
    this.on('remote-operation', (operation) => {
      isRemoteChange = true
      this.applyRemoteOperation(operation)
      isRemoteChange = false
    })
  }

  /**
   * 处理编辑器变化
   */
  private handleEditorChange(change: any): CRDTOperation[] {
    const operations: CRDTOperation[] = []

    // 根据变化类型生成CRDT操作
    if (change.type === 'insert') {
      for (let i = 0; i < change.text.length; i++) {
        operations.push(this.crdt.insert(change.from + i, change.text[i]))
      }
    } else if (change.type === 'delete') {
      for (let i = 0; i < change.length; i++) {
        const op = this.crdt.delete(change.from)
        if (op) operations.push(op)
      }
    }

    return operations
  }

  /**
   * 应用远程操作
   */
  private applyRemoteOperation(operation: CRDTOperation): void {
    this.crdt.applyOperation(operation)

    // 更新编辑器内容
    const newText = this.crdt.getText()
    this.editor.setContent?.(newText)
  }

  /**
   * 设置WebSocket监听
   */
  private setupWebSocketListeners(): void {
    if (!this.ws) return

    this.ws.onmessage = (event) => {
      try {
        const message: CollaborationMessage = JSON.parse(event.data)
        this.handleMessage(message)
      } catch (error) {
        logger.error('Failed to parse message:', error)
      }
    }

    this.ws.onclose = () => {
      logger.info('WebSocket closed')
      this.setStatus('disconnected')

      if (this.config.autoReconnect) {
        this.reconnect()
      }
    }

    this.ws.onerror = (error) => {
      logger.error('WebSocket error:', error)
      this.emit('error', new Error('WebSocket error'))
    }
  }

  /**
   * 处理消息
   */
  private handleMessage(message: CollaborationMessage): void {
    logger.debug(`Received message: ${message.type}`)

    switch (message.type) {
      case 'operation':
        this.handleOperationMessage(message)
        break

      case 'cursor':
        this.handleCursorMessage(message)
        break

      case 'join':
        this.handleJoinMessage(message)
        break

      case 'leave':
        this.handleLeaveMessage(message)
        break

      case 'sync-response':
        this.handleSyncResponse(message)
        break

      case 'heartbeat':
        // 心跳响应
        break
    }
  }

  /**
   * 处理操作消息
   */
  private handleOperationMessage(message: CollaborationMessage): void {
    const operation: CRDTOperation = message.payload
    this.emit('remote-operation', operation)
  }

  /**
   * 处理光标消息
   */
  private handleCursorMessage(message: CollaborationMessage): void {
    const { userId, cursor } = message.payload

    const user = Array.from(this.users.values()).find(u => u.id === userId)
    if (user) {
      user.cursor = cursor
      user.lastActive = Date.now()
      this.emit('cursor-update', userId, cursor)
    }
  }

  /**
   * 处理加入消息
   */
  private handleJoinMessage(message: CollaborationMessage): void {
    const user: CollaborationUser = message.payload
    this.users.set(user.siteId, user)
    this.emit('user-joined', user)
    logger.info(`User joined: ${user.name}`)
  }

  /**
   * 处理离开消息
   */
  private handleLeaveMessage(message: CollaborationMessage): void {
    const userId = message.payload.userId
    const user = Array.from(this.users.values()).find(u => u.id === userId)

    if (user) {
      this.users.delete(user.siteId)
      this.emit('user-left', userId)
      logger.info(`User left: ${user.name}`)
    }
  }

  /**
   * 处理同步响应
   */
  private handleSyncResponse(message: CollaborationMessage): void {
    const state: any = message.payload

    // 合并远程状态
    const newOps = this.crdt.merge(state)

    // 应用新操作
    newOps.forEach(op => this.emit('remote-operation', op))

    this.emit('sync-complete')
  }

  /**
   * 广播操作
   */
  private broadcastOperation(operation: CRDTOperation): void {
    this.sendMessage({
      type: 'operation',
      payload: operation
    })
  }

  /**
   * 发送消息
   */
  private sendMessage(message: Omit<CollaborationMessage, 'from' | 'timestamp' | 'id'>): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      logger.warn('Cannot send message: not connected')
      return
    }

    const fullMessage: CollaborationMessage = {
      ...message,
      from: this.crdt.getSiteId(),
      timestamp: Date.now(),
      id: `${Date.now()}-${Math.random()}`
    }

    this.ws.send(JSON.stringify(fullMessage))
  }

  /**
   * 发送加入消息
   */
  private sendJoin(): void {
    const user = this.users.get(this.crdt.getSiteId())!

    this.sendMessage({
      type: 'join',
      payload: user
    })
  }

  /**
   * 发送离开消息
   */
  private sendLeave(): void {
    this.sendMessage({
      type: 'leave',
      payload: {
        userId: this.config.user.id
      }
    })
  }

  /**
   * 启动心跳
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = window.setInterval(() => {
      this.sendMessage({
        type: 'heartbeat',
        payload: {
          siteId: this.crdt.getSiteId(),
          clock: this.crdt.getClock()
        }
      })
    }, this.config.heartbeatInterval)
  }

  /**
   * 停止心跳
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
    }
  }

  /**
   * 启动定期同步
   */
  private startSync(): void {
    this.syncTimer = window.setInterval(() => {
      this.requestSync()
    }, this.config.syncInterval)
  }

  /**
   * 停止同步
   */
  private stopSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
    }
  }

  /**
   * 请求同步
   */
  private requestSync(): void {
    this.sendMessage({
      type: 'sync-request',
      payload: {
        versionVector: Object.fromEntries(this.crdt['versionVector'])
      }
    })
  }

  /**
   * 关闭所有P2P连接
   */
  private closeAllP2PConnections(): void {
    this.rtcConnections.forEach(conn => conn.close())
    this.rtcConnections.clear()
  }

  /**
   * 生成颜色
   */
  private generateColor(): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  /**
   * 获取在线用户
   */
  getOnlineUsers(): CollaborationUser[] {
    return Array.from(this.users.values()).filter(u => u.online)
  }

  /**
   * 获取连接状态
   */
  getStatus(): ConnectionStatus {
    return this.status
  }

  /**
   * 获取CRDT状态
   */
  getCRDTState() {
    return this.crdt.getState()
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.disconnect()
    this.removeAllListeners()
    logger.info('Collaboration manager destroyed')
  }
}

