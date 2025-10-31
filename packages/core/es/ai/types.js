/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
/**
 * AI 功能的类型定义
 */
/**
 * 默认 AI 配置
 */
const defaultAIConfig = {
    enabled: true,
    defaultProvider: 'deepseek',
    providers: {
        deepseek: {
            provider: 'deepseek',
            model: 'deepseek-chat',
            apiKey: '',
            apiEndpoint: 'https://api.deepseek.com/v1',
            temperature: 0.7,
            maxTokens: 2000,
            stream: false,
        },
        openai: {
            provider: 'openai',
            model: 'gpt-3.5-turbo',
            apiKey: '',
            apiEndpoint: 'https://api.openai.com/v1',
            temperature: 0.7,
            maxTokens: 2000,
            stream: false,
        },
        claude: {
            provider: 'claude',
            model: 'claude-3-sonnet-20240229',
            apiKey: '',
            apiEndpoint: 'https://api.anthropic.com/v1',
            temperature: 0.7,
            maxTokens: 4000,
            stream: false,
        },
        baidu: {
            provider: 'baidu',
            model: 'ernie-bot',
            apiKey: '', // 格式: API_KEY:SECRET_KEY
            apiEndpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat',
            temperature: 0.7,
            maxTokens: 2000,
            stream: false,
        },
        qwen: {
            provider: 'qwen',
            model: 'qwen-turbo',
            apiKey: '',
            apiEndpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
            temperature: 0.7,
            maxTokens: 2000,
            stream: false,
        },
        spark: {
            provider: 'spark',
            model: 'spark-3.5',
            apiKey: '', // 格式: APP_ID:API_KEY:API_SECRET
            apiEndpoint: 'wss://spark-api.xf-yun.com/v3.5/chat',
            temperature: 0.7,
            maxTokens: 2000,
            stream: false,
        },
        glm: {
            provider: 'glm',
            model: 'glm-4',
            apiKey: '',
            apiEndpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            temperature: 0.7,
            maxTokens: 2000,
            stream: false,
        },
    },
    features: {
        errorCorrection: true,
        autoComplete: true,
        textContinuation: true,
        textRewrite: true,
        smartSuggestions: true,
    },
    shortcuts: {
        errorCorrection: 'Alt+F',
        autoComplete: 'Ctrl+Space',
        textContinuation: 'Alt+Enter',
        textRewrite: 'Alt+R',
    },
};

export { defaultAIConfig };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=types.js.map
