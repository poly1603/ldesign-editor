/**
 * 阿里通义千问（Qwen）提供商
 */
import type { AIModelConfig, AIProviderInterface, AIRequest, AIResponse } from '../types';
export declare class QwenProvider implements AIProviderInterface {
    name: "qwen";
    config: AIModelConfig;
    constructor(config: AIModelConfig);
    initialize(config: AIModelConfig): Promise<void>;
    request(request: AIRequest): Promise<AIResponse>;
    validateConfig(): boolean;
    cleanup(): void;
    private buildMessages;
    private getSystemPrompt;
    /**
     * 支持的模型列表
     */
    static getSupportedModels(): {
        id: string;
        name: string;
        description: string;
    }[];
}
//# sourceMappingURL=QwenProvider.d.ts.map