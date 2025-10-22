/**
 * 统一日志工具
 * 开发环境输出详细日志，生产环境只输出错误
 * 
 * @packageDocumentation
 */

/**
 * 日志级别
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

/**
 * 日志配置选项
 */
export interface LoggerOptions {
  /** 日志前缀 */
  prefix?: string
  /** 是否启用日志 */
  enabled?: boolean
  /** 最低日志级别 */
  level?: LogLevel
  /** 是否显示时间戳 */
  showTimestamp?: boolean
  /** 是否分组显示 */
  grouping?: boolean
}

/**
 * 日志条目接口
 */
export interface LogEntry {
  /** 日志级别 */
  level: LogLevel
  /** 时间戳 */
  timestamp: number
  /** 消息 */
  message: string
  /** 附加数据 */
  data?: unknown[]
  /** 日志前缀 */
  prefix?: string
}

/**
 * 日志过滤器函数
 */
export type LogFilter = (entry: LogEntry) => boolean

/**
 * 全局Logger类
 * 提供统一的日志管理功能
 * 
 * @example
 * ```typescript
 * logger.setLevel('warn')  // 只显示warn和error
 * logger.debug('Debug message')  // 不会输出
 * logger.warn('Warning')  // 会输出
 * ```
 */
class Logger {
  private isDevelopment: boolean
  private currentLevel: LogLevel = 'debug'
  private enabled: boolean = true
  private showTimestamp: boolean = false
  private grouping: boolean = false
  private logHistory: LogEntry[] = []
  private maxHistorySize: number = 1000
  private filters: LogFilter[] = []

  private readonly logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  }

  constructor() {
    // 检测开发环境
    this.isDevelopment =
      typeof process !== 'undefined' &&
      process.env &&
      process.env.NODE_ENV === 'development'

    // 生产环境默认只显示error
    if (!this.isDevelopment) {
      this.currentLevel = 'error'
    }
  }

  /**
   * 设置日志级别
   * @param level - 日志级别
   */
  setLevel(level: LogLevel): void {
    this.currentLevel = level
  }

  /**
   * 获取当前日志级别
   * @returns 当前日志级别
   */
  getLevel(): LogLevel {
    return this.currentLevel
  }

  /**
   * 启用或禁用日志
   * @param enabled - 是否启用
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * 设置是否显示时间戳
   * @param show - 是否显示
   */
  setShowTimestamp(show: boolean): void {
    this.showTimestamp = show
  }

  /**
   * 添加日志过滤器
   * @param filter - 过滤器函数
   */
  addFilter(filter: LogFilter): void {
    this.filters.push(filter)
  }

  /**
   * 清除所有过滤器
   */
  clearFilters(): void {
    this.filters = []
  }

  /**
   * 检查日志是否应该输出
   * @param level - 日志级别
   * @returns 是否应该输出
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false
    return this.logLevels[level] >= this.logLevels[this.currentLevel]
  }

  /**
   * 应用过滤器
   * @param entry - 日志条目
   * @returns 是否通过过滤
   */
  private applyFilters(entry: LogEntry): boolean {
    return this.filters.every(filter => filter(entry))
  }

  /**
   * 添加到历史记录
   * @param entry - 日志条目
   */
  private addToHistory(entry: LogEntry): void {
    this.logHistory.push(entry)
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift()
    }
  }

  /**
   * 格式化日志消息
   * @param level - 日志级别
   * @param prefix - 前缀
   * @param args - 参数
   * @returns 格式化后的参数数组
   */
  private formatMessage(level: LogLevel, prefix: string | undefined, args: unknown[]): unknown[] {
    const parts: string[] = []

    if (this.showTimestamp) {
      const now = new Date()
      const time = now.toISOString().split('T')[1].slice(0, 12)
      parts.push(`[${time}]`)
    }

    parts.push(`[${level.toUpperCase()}]`)

    if (prefix) {
      parts.push(`[${prefix}]`)
    }

    return [parts.join(' '), ...args]
  }

  /**
   * 记录日志
   * @param level - 日志级别
   * @param prefix - 前缀
   * @param args - 参数
   */
  private log(level: LogLevel, prefix: string | undefined, ...args: unknown[]): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      level,
      timestamp: Date.now(),
      message: String(args[0] || ''),
      data: args,
      prefix
    }

    if (!this.applyFilters(entry)) return

    this.addToHistory(entry)

    const formatted = this.formatMessage(level, prefix, args)

    switch (level) {
      case 'debug':
        console.log(...formatted)
        break
      case 'info':
        console.info(...formatted)
        break
      case 'warn':
        console.warn(...formatted)
        break
      case 'error':
        console.error(...formatted)
        break
    }
  }

  /**
   * 调试日志（仅开发环境默认显示）
   * @param args - 日志参数
   */
  debug(...args: unknown[]): void {
    this.log('debug', undefined, ...args)
  }

  /**
   * 信息日志
   * @param args - 日志参数
   */
  info(...args: unknown[]): void {
    this.log('info', undefined, ...args)
  }

  /**
   * 警告日志
   * @param args - 日志参数
   */
  warn(...args: unknown[]): void {
    this.log('warn', undefined, ...args)
  }

  /**
   * 错误日志
   * @param args - 日志参数
   */
  error(...args: unknown[]): void {
    this.log('error', undefined, ...args)
  }

  /**
   * 分组日志
   * @param label - 分组标签
   * @param fn - 回调函数
   */
  group(label: string, fn: () => void): void {
    if (this.shouldLog('debug')) {
      console.group(label)
      try {
        fn()
      } finally {
        console.groupEnd()
      }
    } else {
      fn()
    }
  }

  /**
   * 获取日志历史
   * @param level - 可选的日志级别过滤
   * @returns 日志历史数组
   */
  getHistory(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logHistory.filter(entry => entry.level === level)
    }
    return [...this.logHistory]
  }

  /**
   * 清空日志历史
   */
  clearHistory(): void {
    this.logHistory = []
  }

  /**
   * 导出日志历史为JSON
   * @returns JSON字符串
   */
  exportHistory(): string {
    return JSON.stringify(this.logHistory, null, 2)
  }

  /**
   * 创建带前缀的日志记录器
   * @param prefix - 前缀字符串
   * @param options - 配置选项
   * @returns 日志记录器实例
   */
  createLogger(prefix: string, options?: LoggerOptions): PrefixLogger {
    return new PrefixLogger(prefix, this, options)
  }
}

/**
 * 带前缀的日志记录器
 * 提供模块化的日志输出
 * 
 * @example
 * ```typescript
 * const logger = createLogger('MyModule')
 * logger.info('Module initialized')
 * // 输出: [INFO] [MyModule] Module initialized
 * ```
 */
class PrefixLogger {
  private enabled: boolean

  constructor(
    private prefix: string,
    private parent: Logger,
    options?: LoggerOptions
  ) {
    this.enabled = options?.enabled ?? true
  }

  /**
   * 启用或禁用此日志记录器
   * @param enabled - 是否启用
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * 调试日志
   * @param args - 日志参数
   */
  debug(...args: unknown[]): void {
    if (this.enabled) {
      this.parent['log']('debug', this.prefix, ...args)
    }
  }

  /**
   * 信息日志
   * @param args - 日志参数
   */
  info(...args: unknown[]): void {
    if (this.enabled) {
      this.parent['log']('info', this.prefix, ...args)
    }
  }

  /**
   * 警告日志
   * @param args - 日志参数
   */
  warn(...args: unknown[]): void {
    if (this.enabled) {
      this.parent['log']('warn', this.prefix, ...args)
    }
  }

  /**
   * 错误日志
   * @param args - 日志参数
   */
  error(...args: unknown[]): void {
    if (this.enabled) {
      this.parent['log']('error', this.prefix, ...args)
    }
  }

  /**
   * 分组日志
   * @param label - 分组标签
   * @param fn - 回调函数
   */
  group(label: string, fn: () => void): void {
    this.parent.group(`[${this.prefix}] ${label}`, fn)
  }
}

// ============================================================================
// 导出
// ============================================================================

/**
 * 全局日志实例
 * 
 * @example
 * ```typescript
 * import { logger } from '@ldesign/editor'
 * 
 * logger.setLevel('warn')
 * logger.warn('Warning message')
 * ```
 */
export const logger = new Logger()

/**
 * 创建带前缀的日志记录器
 * 
 * @param prefix - 模块名称或前缀
 * @param options - 配置选项
 * @returns 日志记录器实例
 * 
 * @example
 * ```typescript
 * const moduleLogger = createLogger('MyModule')
 * moduleLogger.info('Module started')
 * // 输出: [INFO] [MyModule] Module started
 * ```
 */
export function createLogger(prefix: string, options?: LoggerOptions): PrefixLogger {
  return logger.createLogger(prefix, options)
}

/**
 * 设置全局日志级别
 * @param level - 日志级别
 * 
 * @example
 * ```typescript
 * setLogLevel('error')  // 只显示error级别日志
 * ```
 */
export function setLogLevel(level: LogLevel): void {
  logger.setLevel(level)
}

/**
 * 获取日志历史
 * @param level - 可选的日志级别过滤
 * @returns 日志历史数组
 * 
 * @example
 * ```typescript
 * const errors = getLogHistory('error')
 * console.log(`Total errors: ${errors.length}`)
 * ```
 */
export function getLogHistory(level?: LogLevel): LogEntry[] {
  return logger.getHistory(level)
}

/**
 * 导出日志历史为JSON字符串
 * @returns JSON字符串
 * 
 * @example
 * ```typescript
 * const logsJson = exportLogs()
 * downloadFile('logs.json', logsJson)
 * ```
 */
export function exportLogs(): string {
  return logger.exportHistory()
}

/**
 * 清空日志历史
 * 
 * @example
 * ```typescript
 * clearLogHistory()
 * ```
 */
export function clearLogHistory(): void {
  logger.clearHistory()
}













