/**
 * 审计日志类型定义
 */

/**
 * 审计日志
 */
export interface AuditLog {
  /** 日志ID */
  id: string
  /** 用户ID */
  userId: string
  /** 操作类型 */
  action: string
  /** 资源类型 */
  resource?: string
  /** 资源ID */
  resourceId?: string
  /** 操作结果 */
  result?: 'success' | 'failure' | 'partial'
  /** 时间戳 */
  timestamp: number
  /** 变更内容 */
  changes?: {
    before?: any
    after?: any
    diff?: any
  }
  /** 元数据 */
  metadata?: {
    ip?: string
    userAgent?: string
    location?: string
    duration?: number
    [key: string]: any
  }
}

/**
 * 审计配置
 */
export interface AuditConfig {
  /** 是否启用审计 */
  enabled?: boolean
  /** 存储方式 */
  storage?: 'memory' | 'indexeddb' | 'server'
  /** 最大日志数 */
  maxLogs?: number
  /** 批量大小 */
  batchSize?: number
  /** 批量延迟（毫秒） */
  batchDelay?: number
  /** 是否持久化到磁盘 */
  persistToDisk?: boolean
  /** 是否同步到服务器 */
  serverSync?: boolean
  /** 服务器URL */
  serverUrl?: string
  /** 是否包含内容 */
  includeContent?: boolean
  /** 是否匿名化 */
  anonymize?: boolean
}

/**
 * 审计事件
 */
export interface AuditEvents {
  /** 日志创建 */
  'log-created': (log: AuditLog) => void
  /** 日志已清空 */
  'logs-cleared': () => void
  /** 同步错误 */
  'sync-error': (error: Error) => void
}

/**
 * 审计查询
 */
export interface AuditQuery {
  /** 用户ID */
  userId?: string
  /** 操作类型 */
  action?: string
  /** 资源类型 */
  resource?: string
  /** 资源ID */
  resourceId?: string
  /** 开始时间 */
  startTime?: number
  /** 结束时间 */
  endTime?: number
  /** 排序字段 */
  sortBy?: keyof AuditLog
  /** 排序顺序 */
  sortOrder?: 'asc' | 'desc'
  /** 限制数量 */
  limit?: number
  /** 偏移量 */
  offset?: number
}

/**
 * 审计报告
 */
export interface AuditReport {
  /** 总日志数 */
  totalLogs: number
  /** 时间范围 */
  timeRange: {
    start: number
    end: number
  }
  /** 统计信息 */
  statistics: {
    totalActions: number
    uniqueUsers: number
    actionCounts: Record<string, number>
    resourceCounts: Record<string, number>
    peakHours: number[]
  }
  /** 分组数据 */
  groupedData: Record<string, AuditLog[]>
  /** 生成时间 */
  generatedAt: number
}

/**
 * 合规性检查结果
 */
export interface ComplianceCheckResult {
  /** 是否合规 */
  compliant: boolean
  /** 检查项目 */
  checks: {
    name: string
    passed: boolean
    details?: string
  }[]
  /** 问题列表 */
  issues: {
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    recommendation?: string
  }[]
  /** 检查时间 */
  checkedAt: number
}

