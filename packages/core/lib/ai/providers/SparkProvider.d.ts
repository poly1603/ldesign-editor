/**
 * 讯飞星火（Spark）提供商
 */
import type { AIModelConfig, AIProviderInterface, AIRequest, AIResponse } from '../types';
export declare class SparkProvider implements AIProviderInterface {
    name: "spark";
    config: AIModelConfig;
    private wsUrl;
    constructor(config: AIModelConfig);
    initialize(config: AIModelConfig): Promise<void>;
    request(request: AIRequest): Promise<AIResponse>;
    validateConfig(): boolean;
    cleanup(): void;
    private makeWebSocketRequest;
    private buildWebSocketParams;
    private buildMessages;
    private getSystemPrompt;
    private getWebSocketUrl;
    private getDomain;
    private generateUID;
    /**
     * 支持的模型列表
     */
    static getSupportedModels(): {
        id: string;
        name: string;
        description: string;
    }[];
}
