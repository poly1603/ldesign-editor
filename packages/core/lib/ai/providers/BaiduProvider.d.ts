/**
 * 百度文心一言（ERNIE-Bot）提供商
 */
import type { AIModelConfig, AIProviderInterface, AIRequest, AIResponse } from '../types';
export declare class BaiduProvider implements AIProviderInterface {
    name: "baidu";
    config: AIModelConfig;
    private accessToken?;
    private tokenExpiry?;
    constructor(config: AIModelConfig);
    initialize(config: AIModelConfig): Promise<void>;
    request(request: AIRequest): Promise<AIResponse>;
    validateConfig(): boolean;
    cleanup(): void;
    private buildMessages;
    private getSystemPrompt;
    private getModelEndpoint;
    private refreshAccessToken;
    private ensureAccessToken;
}
