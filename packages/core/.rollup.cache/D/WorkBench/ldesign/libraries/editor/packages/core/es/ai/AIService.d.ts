/**
 * AI 服务管理器
 * 统一管理 AI 功能，支持多种 AI 提供商
 */
import type { AIConfig, AIProvider, AIProviderInterface, AIRequest, AIResponse } from './types';
export declare class AIService {
    private config;
    private providers;
    private currentProvider;
    private configStorageKey;
    constructor(config?: Partial<AIConfig>);
    /**
     * 加载配置
     */
    private loadConfig;
    /**
     * 保存配置
     */
    private saveConfig;
    /**
     * 初始化提供商
     */
    private initializeProviders;
    /**
     * 设置当前提供商
     */
    setProvider(provider: AIProvider): void;
    /**
     * 更新配置
     */
    updateConfig(config: Partial<AIConfig>): void;
    /**
     * 更新 API 密钥
     */
    updateApiKey(provider: AIProvider, apiKey: string): void;
    /**
     * 注册自定义提供商
     */
    registerProvider(name: string, provider: AIProviderInterface): void;
    /**
     * 获取可用的提供商列表
     */
    getAvailableProviders(): AIProvider[];
    /**
     * 获取当前提供商
     */
    getCurrentProvider(): AIProvider | null;
    /**
     * 获取配置
     */
    getConfig(): AIConfig;
    /**
     * 检查 AI 功能是否启用
     */
    isEnabled(): boolean;
    /**
     * 启用/禁用 AI 功能
     */
    setEnabled(enabled: boolean): void;
    /**
     * 发送 AI 请求
     */
    request(request: AIRequest): Promise<AIResponse>;
    /**
     * 纠错
     */
    correct(text: string, context?: string): Promise<AIResponse>;
    /**
     * 自动补全
     */
    complete(text: string, context?: string): Promise<AIResponse>;
    /**
     * 续写
     */
    continue(text: string, context?: string): Promise<AIResponse>;
    /**
     * 重写
     */
    rewrite(text: string, context?: string): Promise<AIResponse>;
    /**
     * 获取建议
     */
    suggest(text: string, context?: string): Promise<AIResponse>;
    /**
     * 清理资源
     */
    cleanup(): void;
}
/**
 * 获取 AI 服务实例
 */
export declare function getAIService(config?: Partial<AIConfig>): AIService;
/**
 * 重置 AI 服务实例
 */
export declare function resetAIService(): void;
