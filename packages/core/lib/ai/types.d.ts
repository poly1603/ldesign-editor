/**
 * AI 功能的类型定义
 */
/**
 * AI 提供商类型
 */
export type AIProvider = 'deepseek' | 'openai' | 'claude' | 'azure' | 'baidu' | 'qwen' | 'spark' | 'glm' | 'custom';
/**
 * AI 模型配置
 */
export interface AIModelConfig {
    provider: AIProvider;
    model: string;
    apiKey: string;
    apiEndpoint?: string;
    baseURL?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    stream?: boolean;
}
/**
 * AI 配置选项
 */
export interface AIConfig {
    enabled: boolean;
    defaultProvider: AIProvider;
    providers: {
        [key in AIProvider]?: AIModelConfig;
    };
    features: {
        errorCorrection: boolean;
        autoComplete: boolean;
        textContinuation: boolean;
        textRewrite: boolean;
        smartSuggestions: boolean;
    };
    shortcuts?: {
        errorCorrection?: string;
        autoComplete?: string;
        textContinuation?: string;
        textRewrite?: string;
    };
}
/**
 * AI 请求类型
 */
export type AIRequestType = 'correct' | 'complete' | 'continue' | 'rewrite' | 'suggest' | 'custom';
/**
 * AI 请求参数
 */
export interface AIRequest {
    type: AIRequestType;
    text: string;
    context?: string;
    language?: string;
    options?: Record<string, any>;
    model?: string;
    prompt?: string;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    stream?: boolean;
}
/**
 * AI 响应
 */
export interface AIResponse {
    success: boolean;
    text?: string;
    content?: string;
    suggestions?: string[];
    error?: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
/**
 * AI 提供商接口
 */
export interface AIProviderInterface {
    name: AIProvider;
    config: AIModelConfig;
    /**
     * 初始化提供商
     */
    initialize: (config: AIModelConfig) => Promise<void>;
    /**
     * 发送请求
     */
    request: (request: AIRequest) => Promise<AIResponse>;
    /**
     * 验证配置
     */
    validateConfig: () => boolean;
    /**
     * 清理资源
     */
    cleanup: () => void;
}
/**
 * 默认 AI 配置
 */
export declare const defaultAIConfig: AIConfig;
//# sourceMappingURL=types.d.ts.map