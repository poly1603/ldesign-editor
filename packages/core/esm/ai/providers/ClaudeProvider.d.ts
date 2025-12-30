/**
 * Claude (Anthropic) 提供商
 * 支持 Claude 3 系列模型
 */
import type { AIModelConfig, AIProvider, AIProviderInterface, AIRequest, AIResponse } from '../types';
export declare class ClaudeProvider implements AIProviderInterface {
    name: AIProvider;
    config: AIModelConfig;
    private apiKey;
    private baseURL;
    private model;
    private defaultConfig;
    constructor(config: AIModelConfig);
    initialize(config: AIModelConfig): Promise<void>;
    validateConfig(): boolean;
    cleanup(): void;
    request(request: AIRequest): Promise<AIResponse>;
    stream(request: AIRequest, onChunk: (chunk: string) => void): Promise<void>;
    getSupportedModels(): string[];
}
//# sourceMappingURL=ClaudeProvider.d.ts.map