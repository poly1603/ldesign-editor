/**
 * 日志工具
 * 提供统一的日志管理和输出
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LoggerOptions {
  level?: LogLevel
  prefix?: string
  timestamp?: boolean
  color?: boolean
}

export class Logger {
  private level: LogLevel
  private prefix: string
  private timestamp: boolean
  private color: boolean

  private static levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  }

  private static colors: Record<LogLevel, string> = {
    debug: '#888',
    info: '#2196F3',
    warn: '#FF9800',
    error: '#F44336',
  }

  constructor(prefix: string, options: LoggerOptions = {}) {
    this.prefix = prefix
    this.level = options.level || 'info'
    this.timestamp = options.timestamp !== false
    this.color = options.color !== false
  }

  debug(...args: any[]): void {
    this.log('debug', ...args)
  }

  info(...args: any[]): void {
    this.log('info', ...args)
  }

  warn(...args: any[]): void {
    this.log('warn', ...args)
  }

  error(...args: any[]): void {
    this.log('error', ...args)
  }

  private log(level: LogLevel, ...args: any[]): void {
    if (Logger.levels[level] < Logger.levels[this.level])
      return

    const timestamp = this.timestamp ? new Date().toISOString() : ''
    const prefix = `[${this.prefix}]`

    const parts = []
    if (timestamp)
      parts.push(timestamp)
    parts.push(prefix)

    const message = parts.join(' ')

    if (this.color && typeof console !== 'undefined') {
      const color = Logger.colors[level]
      const css = `color: ${color}; font-weight: bold;`

      switch (level) {
        case 'debug':
          console.debug(`%c${message}`, css, ...args)
          break
        case 'info':
          console.info(`%c${message}`, css, ...args)
          break
        case 'warn':
          console.warn(`%c${message}`, css, ...args)
          break
        case 'error':
          console.error(`%c${message}`, css, ...args)
          break
      }
    }
    else {
      console[level](message, ...args)
    }
  }

  setLevel(level: LogLevel): void {
    this.level = level
  }
}

// 全局日志管理器
class LoggerManager {
  private loggers: Map<string, Logger> = new Map()
  private defaultOptions: LoggerOptions = {
    level: 'info',
    timestamp: true,
    color: true,
  }

  createLogger(prefix: string, options?: LoggerOptions): Logger {
    const logger = new Logger(prefix, { ...this.defaultOptions, ...options })
    this.loggers.set(prefix, logger)
    return logger
  }

  getLogger(prefix: string): Logger | undefined {
    return this.loggers.get(prefix)
  }

  setGlobalLevel(level: LogLevel): void {
    this.defaultOptions.level = level
    this.loggers.forEach(logger => logger.setLevel(level))
  }

  setGlobalOptions(options: LoggerOptions): void {
    this.defaultOptions = { ...this.defaultOptions, ...options }
  }
}

// 单例
const loggerManager = new LoggerManager()

/**
 * 创建日志记录器
 */
export function createLogger(prefix: string, options?: LoggerOptions): Logger {
  return loggerManager.createLogger(prefix, options)
}

/**
 * 获取日志记录器
 */
export function getLogger(prefix: string): Logger | undefined {
  return loggerManager.getLogger(prefix)
}

/**
 * 设置全局日志级别
 */
export function setGlobalLogLevel(level: LogLevel): void {
  loggerManager.setGlobalLevel(level)
}

/**
 * 设置全局日志选项
 */
export function setGlobalLogOptions(options: LoggerOptions): void {
  loggerManager.setGlobalOptions(options)
}

// 开发环境默认显示debug日志
if (process.env.NODE_ENV === 'development')
  setGlobalLogLevel('debug')
