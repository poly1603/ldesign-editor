/**
 * DeepSeek AI 提供商实现
 */
import type { AIModelConfig, AIProviderInterface, AIRequest, AIResponse } from '../types';
export declare class DeepSeekProvider implements AIProviderInterface {
    name: 'deepseek';
    config: AIModelConfig;
    constructor(config?: AIModelConfig);
    initialize(config: AIModelConfig): Promise<void>;
    validateConfig(): boolean;
    request(request: AIRequest): Promise<AIResponse>;
    private getSystemPrompt;
    private getUserPrompt;
    private parseSuggestions;
    cleanup(): void;
}
//# sourceMappingURL=DeepSeekProvider.d.ts.map