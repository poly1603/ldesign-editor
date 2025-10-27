/**
 * CRDT类型定义
 */

/**
 * 位置组件
 */
export interface PositionComponent {
  /** 数字值 */
  digit: number
  /** 站点ID */
  siteId: string
}

/**
 * 位置（位置组件数组）
 */
export type Position = PositionComponent[]

/**
 * 标识符
 */
export interface Identifier {
  /** 位置 */
  position: Position
  /** 站点ID */
  siteId: string
  /** 逻辑时钟 */
  clock: number
}

/**
 * CRDT操作类型
 */
export type CRDTOperationType = 'insert' | 'delete'

/**
 * CRDT操作
 */
export interface CRDTOperation {
  /** 操作类型 */
  type: CRDTOperationType
  /** 标识符 */
  identifier: Identifier
  /** 字符（插入操作时） */
  char?: string
  /** 站点ID */
  siteId: string
  /** 逻辑时钟 */
  clock: number
  /** 时间戳 */
  timestamp: number
}

/**
 * CRDT状态
 */
export interface CRDTState {
  /** 站点ID */
  siteId: string
  /** 当前时钟 */
  clock: number
  /** 版本向量 */
  versionVector: Record<string, number>
  /** 操作历史 */
  operations: CRDTOperation[]
}

/**
 * 协作用户
 */
export interface CollaborationUser {
  /** 用户ID */
  id: string
  /** 用户名 */
  name: string
  /** 站点ID */
  siteId: string
  /** 头像URL */
  avatar?: string
  /** 光标位置 */
  cursor?: {
    index: number
    length: number
  }
  /** 光标颜色 */
  color?: string
  /** 最后活动时间 */
  lastActive: number
  /** 是否在线 */
  online: boolean
}

/**
 * 协作消息
 */
export interface CollaborationMessage {
  /** 消息类型 */
  type: 'operation' | 'cursor' | 'join' | 'leave' | 'sync-request' | 'sync-response' | 'heartbeat'
  /** 发送者站点ID */
  from: string
  /** 接收者站点ID（可选，广播时为空） */
  to?: string
  /** 消息内容 */
  payload: any
  /** 时间戳 */
  timestamp: number
  /** 消息ID */
  id: string
}

/**
 * 协作配置
 */
export interface CollaborationConfig {
  /** 站点ID */
  siteId?: string
  /** 用户信息 */
  user: {
    id: string
    name: string
    avatar?: string
  }
  /** 是否启用P2P */
  enableP2P?: boolean
  /** 服务器URL（WebSocket） */
  serverUrl?: string
  /** 心跳间隔（毫秒） */
  heartbeatInterval?: number
  /** 同步间隔（毫秒） */
  syncInterval?: number
  /** 是否自动重连 */
  autoReconnect?: boolean
  /** 重连最大次数 */
  maxReconnectAttempts?: number
  /** 光标颜色 */
  cursorColor?: string
}

/**
 * 连接状态
 */
export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error'

/**
 * 协作事件
 */
export interface CollaborationEvents {
  /** 连接状态变化 */
  'connection-status': (status: ConnectionStatus) => void
  /** 用户加入 */
  'user-joined': (user: CollaborationUser) => void
  /** 用户离开 */
  'user-left': (userId: string) => void
  /** 远程操作 */
  'remote-operation': (operation: CRDTOperation) => void
  /** 光标更新 */
  'cursor-update': (userId: string, cursor: { index: number; length: number }) => void
  /** 同步完成 */
  'sync-complete': () => void
  /** 冲突解决 */
  'conflict-resolved': (operations: CRDTOperation[]) => void
  /** 错误 */
  'error': (error: Error) => void
}

/**
 * P2P连接配置
 */
export interface P2PConfig {
  /** ICE服务器 */
  iceServers?: RTCIceServer[]
  /** 房间ID */
  roomId: string
  /** 信令服务器URL */
  signalingServer?: string
}

/**
 * 同步状态
 */
export interface SyncState {
  /** 是否正在同步 */
  syncing: boolean
  /** 最后同步时间 */
  lastSyncTime: number
  /** 待同步操作数 */
  pendingOperations: number
  /** 冲突数 */
  conflicts: number
}

