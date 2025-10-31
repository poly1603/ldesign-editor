/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var logger$1 = require('../../utils/logger.cjs');

/**
 * 智谱清言（GLM）提供商
 */
const logger = logger$1.createLogger('GLMProvider');
class GLMProvider {
    constructor(config) {
        this.name = 'glm';
        this.config = {
            ...config,
            provider: 'glm',
            model: config.model || 'glm-4',
            apiEndpoint: config.apiEndpoint || 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
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
                    'Accept': this.config.stream ? 'text/event-stream' : 'application/json',
                },
                body: JSON.stringify({
                    model: this.config.model,
                    messages,
                    temperature: this.config.temperature || 0.7,
                    top_p: 0.9,
                    max_tokens: this.config.maxTokens || 2000,
                    stream: this.config.stream || false,
                    stop: null,
                }),
            });
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`智谱清言请求失败: ${response.status} - ${error}`);
            }
            const data = await response.json();
            if (data.error)
                throw new Error(`智谱清言错误: ${data.error.code} - ${data.error.message}`);
            // 提取响应内容
            const content = data.choices?.[0]?.message?.content || '';
            return {
                success: true,
                text: content,
                usage: data.usage
                    ? {
                        promptTokens: data.usage.prompt_tokens,
                        completionTokens: data.usage.completion_tokens,
                        totalTokens: data.usage.total_tokens,
                    }
                    : undefined,
            };
        }
        catch (error) {
            logger.error('智谱清言请求失败:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : '未知错误',
            };
        }
    }
    validateConfig() {
        if (!this.config.apiKey) {
            logger.error('缺少智谱API密钥');
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
            correct: '你是一个专业的文本校对专家。请仔细检查并纠正文本中的所有错误，包括：\n1. 拼写错误\n2. 语法错误\n3. 标点符号错误\n4. 不通顺的表达\n\n请直接给出修正后的文本，不需要解释。',
            complete: '你是一个智能写作助手。请根据给定的上下文，自然地完成后续内容。要求：\n1. 保持语言风格一致\n2. 内容连贯自然\n3. 符合逻辑',
            continue: '你是一个创意写作助手。请基于已有内容继续写作。要求：\n1. 保持故事的连贯性\n2. 维持相同的写作风格\n3. 情节发展要合理',
            rewrite: '你是一个资深的文案编辑。请将给定的内容重写，要求：\n1. 表达更加清晰准确\n2. 语言更加专业得体\n3. 结构更加合理\n4. 保持原意不变',
            suggest: '你是一个专业的内容顾问。请仔细分析给定的内容，并从以下方面提供具体的改进建议：\n1. 内容结构\n2. 表达方式\n3. 逻辑性\n4. 可读性\n5. 专业性\n\n请以条目形式给出建议。',
        };
        return prompts[type] || '你是一个智能助手，请根据用户需求处理文本内容。';
    }
    /**
     * 支持的模型列表
     */
    static getSupportedModels() {
        return [
            { id: 'glm-4', name: 'GLM-4', description: '最新一代模型，能力全面提升' },
            { id: 'glm-4-air', name: 'GLM-4-Air', description: '性能与价格平衡的模型' },
            { id: 'glm-4-airx', name: 'GLM-4-AirX', description: '高性价比模型' },
            { id: 'glm-4-flash', name: 'GLM-4-Flash', description: '超快速响应，适合简单任务' },
            { id: 'glm-3-turbo', name: 'GLM-3-Turbo', description: '上一代主力模型，稳定可靠' },
        ];
    }
    /**
     * 获取模型定价信息
     */
    static getPricing() {
        return {
            'glm-4': { input: 0.1, output: 0.1, unit: '元/千tokens' },
            'glm-4-air': { input: 0.01, output: 0.01, unit: '元/千tokens' },
            'glm-4-airx': { input: 0.01, output: 0.01, unit: '元/千tokens' },
            'glm-4-flash': { input: 0.0001, output: 0.0001, unit: '元/千tokens' },
            'glm-3-turbo': { input: 0.005, output: 0.005, unit: '元/千tokens' },
        };
    }
}

exports.GLMProvider = GLMProvider;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=GLMProvider.cjs.map
