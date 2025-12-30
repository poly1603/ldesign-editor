/**
 * OpenAI 提供商
 * 支持 GPT-4, GPT-3.5-turbo 等模型
 */
import type { AIModelConfig, AIProvider, AIProviderInterface, AIRequest, AIResponse } from '../types';
export declare class OpenAIProvider implements AIProviderInterface {
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
//# sourceMappingURL=OpenAIProvider.d.ts.map