/**
 * 统一错误处理
 */
/**
 * 编辑器错误类
 */
export declare class EditorError extends Error {
    code: string;
    details?: any | undefined;
    constructor(message: string, code: string, details?: any | undefined);
}
/**
 * 文件错误类
 */
export declare class FileError extends EditorError {
    file?: File | undefined;
    constructor(message: string, code: string, file?: File | undefined, details?: any);
}
/**
 * 命令错误类
 */
export declare class CommandError extends EditorError {
    commandName: string;
    constructor(message: string, commandName: string, details?: any);
}
/**
 * 插件错误类
 */
export declare class PluginError extends EditorError {
    pluginName: string;
    constructor(message: string, pluginName: string, details?: any);
}
/**
 * AI 错误类
 */
export declare class AIError extends EditorError {
    constructor(message: string, code?: string, details?: any);
}
/**
 * 错误处理器
 */
export declare function handleError(error: Error, context?: string): void;
/**
 * 异步错误处理器
 */
export declare function handleAsyncError<T>(fn: () => Promise<T>, context?: string, fallback?: T): Promise<T | undefined>;
/**
 * 同步错误处理器
 */
export declare function handleSyncError<T>(fn: () => T, context?: string, fallback?: T): T | undefined;
/**
 * 文件验证
 */
export declare function validateFile(file: File): void;
/**
 * URL 验证
 */
export declare function validateURL(url: string): void;
/**
 * 创建用户友好的错误消息
 */
export declare function getUserFriendlyMessage(error: Error): string;
//# sourceMappingURL=error-handler.d.ts.map