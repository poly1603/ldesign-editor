/**
 * 日志工具
 * 提供统一的日志管理和输出
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LoggerOptions {
    level?: LogLevel;
    prefix?: string;
    timestamp?: boolean;
    color?: boolean;
}
export declare class Logger {
    private level;
    private prefix;
    private timestamp;
    private color;
    private static levels;
    private static colors;
    constructor(prefix: string, options?: LoggerOptions);
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    private log;
    setLevel(level: LogLevel): void;
}
/**
 * 创建日志记录器
 */
export declare function createLogger(prefix: string, options?: LoggerOptions): Logger;
/**
 * 获取日志记录器
 */
export declare function getLogger(prefix: string): Logger | undefined;
/**
 * 设置全局日志级别
 */
export declare function setGlobalLogLevel(level: LogLevel): void;
/**
 * 设置全局日志选项
 */
export declare function setGlobalLogOptions(options: LoggerOptions): void;
//# sourceMappingURL=logger.d.ts.map