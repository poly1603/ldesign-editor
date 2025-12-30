/**
 * PWA类型定义
 */
/**
 * PWA配置
 */
export interface PWAConfig {
    /** 是否启用PWA */
    enabled?: boolean;
    /** Service Worker作用域 */
    scope?: string;
    /** 更新检查间隔（毫秒） */
    updateInterval?: number;
    /** 缓存策略 */
    cacheStrategy?: CacheStrategy;
    /** 是否支持离线 */
    offlineSupport?: boolean;
    /** 是否启用后台同步 */
    backgroundSync?: boolean;
    /** 是否显示安装提示 */
    installPrompt?: boolean;
    /** 更新时是否自动重载 */
    updateOnReload?: boolean;
    /** Service Worker是否跳过等待 */
    skipWaiting?: boolean;
}
/**
 * 缓存策略
 */
export type CacheStrategy = 'cache-first' | 'network-first' | 'cache-only' | 'network-only' | 'stale-while-revalidate';
/**
 * PWA状态
 */
export type PWAStatus = 'idle' | 'initializing' | 'ready' | 'updating' | 'error';
/**
 * Service Worker状态
 */
export interface ServiceWorkerStatus {
    state: ServiceWorkerState;
    scriptURL?: string;
    scope?: string;
    updateAvailable: boolean;
}
/**
 * 缓存配置
 */
export interface CacheConfig {
    /** 缓存名称 */
    name: string;
    /** 缓存版本 */
    version: number;
    /** 需要预缓存的资源 */
    precacheUrls: string[];
    /** 最大缓存大小（字节） */
    maxSize?: number;
    /** 最大缓存时间（毫秒） */
    maxAge?: number;
    /** 缓存策略 */
    strategy: CacheStrategy;
}
/**
 * 后台同步配置
 */
export interface BackgroundSyncConfig {
    /** 同步标签 */
    tag: string;
    /** 同步数据 */
    data?: any;
    /** 重试次数 */
    maxRetries?: number;
    /** 重试间隔（毫秒） */
    retryInterval?: number;
}
/**
 * 安装提示配置
 */
export interface InstallPromptConfig {
    /** 提示延迟（毫秒） */
    delay?: number;
    /** 是否自动显示 */
    autoShow?: boolean;
    /** 自定义提示UI */
    customUI?: boolean;
    /** 提示文本 */
    message?: string;
}
/**
 * PWA事件
 */
export interface PWAEvents {
    /** 状态变化 */
    'status-change': (status: PWAStatus) => void;
    /** PWA就绪 */
    'ready': () => void;
    /** 不支持PWA */
    'unsupported': () => void;
    /** 错误 */
    'error': (error: Error) => void;
    /** 有更新可用 */
    'update-available': () => void;
    /** 更新已安装 */
    'update-installed': () => void;
    /** 更新已激活 */
    'update-activated': () => void;
    /** 离线 */
    'offline': () => void;
    /** 在线 */
    'online': () => void;
    /** 缓存已更新 */
    'cache-updated': (cacheName: string) => void;
    /** 同步成功 */
    'sync-success': (tag: string) => void;
    /** 同步错误 */
    'sync-error': (error: Error) => void;
    /** 显示安装提示 */
    'install-prompt-shown': () => void;
    /** 已安装 */
    'installed': () => void;
    /** 安装提示被取消 */
    'install-dismissed': () => void;
}
/**
 * 离线存储数据
 */
export interface OfflineData {
    /** 数据ID */
    id: string;
    /** 数据类型 */
    type: string;
    /** 数据内容 */
    content: any;
    /** 创建时间 */
    createdAt: number;
    /** 更新时间 */
    updatedAt: number;
    /** 是否已同步 */
    synced: boolean;
    /** 冲突信息 */
    conflicts?: any[];
}
/**
 * 同步队列项
 */
export interface SyncQueueItem {
    /** 队列ID */
    id: string;
    /** 同步标签 */
    tag: string;
    /** 请求URL */
    url: string;
    /** 请求方法 */
    method: string;
    /** 请求数据 */
    data?: any;
    /** 请求头 */
    headers?: Record<string, string>;
    /** 创建时间 */
    timestamp: number;
    /** 重试次数 */
    retries: number;
    /** 最大重试次数 */
    maxRetries: number;
}
/**
 * PWA Manifest
 */
export interface PWAManifest {
    name: string;
    short_name: string;
    description?: string;
    start_url: string;
    display: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
    background_color: string;
    theme_color: string;
    orientation?: 'any' | 'natural' | 'landscape' | 'portrait';
    icons: Array<{
        src: string;
        sizes: string;
        type: string;
        purpose?: 'any' | 'maskable' | 'monochrome';
    }>;
    categories?: string[];
    screenshots?: Array<{
        src: string;
        sizes: string;
        type: string;
    }>;
}
/**
 * Service Worker消息
 */
export interface ServiceWorkerMessage {
    type: string;
    payload?: any;
}
/**
 * 缓存响应
 */
export interface CacheResponse {
    /** 是否来自缓存 */
    fromCache: boolean;
    /** 响应 */
    response: Response;
    /** 缓存时间 */
    cachedAt?: number;
}
//# sourceMappingURL=types.d.ts.map