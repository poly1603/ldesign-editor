/**
 * 智谱清言（GLM）提供商
 */
import type { AIModelConfig, AIProviderInterface, AIRequest, AIResponse } from '../types';
export declare class GLMProvider implements AIProviderInterface {
    name: "glm";
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
    /**
     * 获取模型定价信息
     */
    static getPricing(): {
        'glm-4': {
            input: number;
            output: number;
            unit: string;
        };
        'glm-4-air': {
            input: number;
            output: number;
            unit: string;
        };
        'glm-4-airx': {
            input: number;
            output: number;
            unit: string;
        };
        'glm-4-flash': {
            input: number;
            output: number;
            unit: string;
        };
        'glm-3-turbo': {
            input: number;
            output: number;
            unit: string;
        };
    };
}
