/**
 * 阿里通义千问（Qwen）提供商
 */
import { createLogger } from '../../utils/logger';
const logger = createLogger('QwenProvider');
export class QwenProvider {
    constructor(config) {
        this.name = 'qwen';
        this.config = {
            ...config,
            provider: 'qwen',
            model: config.model || 'qwen-turbo',
            apiEndpoint: config.apiEndpoint || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        };
    }
    async initialize(config) {
        this.config = { ...this.config, ...config };
    }
    async request(request) {
        try {
            const messages = this.buildMessages(request);
            const response = await fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'X-DashScope-SSE': this.config.stream ? 'enable' : 'disable',
                },
                body: JSON.stringify({
                    model: this.config.model,
                    input: {
                        messages,
                    },
                    parameters: {
                        temperature: this.config.temperature || 0.7,
                        top_p: 0.9,
                        max_tokens: this.config.maxTokens || 2000,
                        stop: null,
                        stream: this.config.stream || false,
                        enable_search: false,
                        incremental_output: this.config.stream || false,
                    },
                }),
            });
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`通义千问请求失败: ${response.status} - ${error}`);
            }
            const data = await response.json();
            if (data.code && data.code !== 'Success')
                throw new Error(`通义千问错误: ${data.code} - ${data.message}`);
            // 处理响应
            const content = data.output?.text || data.output?.choices?.[0]?.message?.content || '';
            return {
                success: true,
                text: content,
                usage: data.usage
                    ? {
                        promptTokens: data.usage.input_tokens,
                        completionTokens: data.usage.output_tokens,
                        totalTokens: data.usage.total_tokens || (data.usage.input_tokens + data.usage.output_tokens),
                    }
                    : undefined,
            };
        }
        catch (error) {
            logger.error('通义千问请求失败:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : '未知错误',
            };
        }
    }
    validateConfig() {
        if (!this.config.apiKey) {
            logger.error('缺少阿里云API密钥');
            return false;
        }
        return true;
    }
    cleanup() {
        // 清理资源
    }
    buildMessages(request) {
        const messages = [];
        // 添加系统消息
        const systemPrompt = this.getSystemPrompt(request.type);
        if (systemPrompt) {
            messages.push({
                role: 'system',
                content: systemPrompt,
            });
        }
        // 添加用户消息
        messages.push({
            role: 'user',
            content: request.text,
        });
        return messages;
    }
    getSystemPrompt(type) {
        const prompts = {
            correct: '你是一个专业的文本校对助手。请仔细检查并纠正文本中的所有错误，包括拼写、语法、标点符号和表达问题。保持原意不变，只修正错误。',
            complete: '你是一个智能写作助手。请根据上下文和已有内容，自然地完成后续内容。保持风格和语气的一致性。',
            continue: '你是一个创意写作助手。请基于已有内容，继续创作下去。保持故事的连贯性和风格的一致性。',
            rewrite: '你是一个专业的文案编辑。请重写给定的内容，使其更加清晰、专业、有吸引力。可以调整结构和表达方式，但要保持核心信息不变。',
            suggest: '你是一个资深的内容顾问。请仔细分析给定的内容，并提供具体的改进建议，包括内容结构、表达方式、逻辑性等方面。',
        };
        return prompts[type] || '你是一个智能助手，请帮助用户处理文本内容。';
    }
    /**
     * 支持的模型列表
     */
    static getSupportedModels() {
        return [
            { id: 'qwen-turbo', name: '通义千问-Turbo', description: '速度更快，成本更低' },
            { id: 'qwen-plus', name: '通义千问-Plus', description: '能力更强，效果更好' },
            { id: 'qwen-max', name: '通义千问-Max', description: '最强大的模型' },
            { id: 'qwen-max-1201', name: '通义千问-Max-1201', description: '支持更长上下文' },
            { id: 'qwen-max-longcontext', name: '通义千问-超长上下文', description: '支持30万字上下文' },
        ];
    }
}
//# sourceMappingURL=QwenProvider.js.map