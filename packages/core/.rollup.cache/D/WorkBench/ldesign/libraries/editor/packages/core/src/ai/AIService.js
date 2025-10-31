/**
 * AI 服务管理器
 * 统一管理 AI 功能，支持多种 AI 提供商
 */
import { BaiduProvider } from './providers/BaiduProvider';
import { ClaudeProvider } from './providers/ClaudeProvider';
import { DeepSeekProvider } from './providers/DeepSeekProvider';
import { GLMProvider } from './providers/GLMProvider';
import { OpenAIProvider } from './providers/OpenAIProvider';
import { QwenProvider } from './providers/QwenProvider';
import { SparkProvider } from './providers/SparkProvider';
import { defaultAIConfig } from './types';
export class AIService {
    constructor(config) {
        this.providers = new Map();
        this.currentProvider = null;
        this.configStorageKey = 'ldesign-editor-ai-config';
        // 加载保存的配置或使用默认配置
        this.config = this.loadConfig(config);
        // 初始化提供商
        this.initializeProviders();
        // 设置当前提供商
        this.setProvider(this.config.defaultProvider);
    }
    /**
     * 加载配置
     */
    loadConfig(customConfig) {
        // 从 localStorage 加载保存的配置
        let savedConfig = {};
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                const saved = localStorage.getItem(this.configStorageKey);
                if (saved)
                    savedConfig = JSON.parse(saved);
            }
            catch (error) {
                console.error('Failed to load AI config from localStorage:', error);
            }
        }
        // 合并配置：默认 -> 保存的 -> 自定义的
        return {
            ...defaultAIConfig,
            ...savedConfig,
            ...customConfig,
            providers: {
                ...defaultAIConfig.providers,
                ...savedConfig.providers,
                ...customConfig?.providers,
            },
            features: {
                ...defaultAIConfig.features,
                ...savedConfig.features,
                ...customConfig?.features,
            },
            shortcuts: {
                ...defaultAIConfig.shortcuts,
                ...savedConfig.shortcuts,
                ...customConfig?.shortcuts,
            },
        };
    }
    /**
     * 保存配置
     */
    saveConfig() {
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                localStorage.setItem(this.configStorageKey, JSON.stringify(this.config));
            }
            catch (error) {
                console.error('Failed to save AI config to localStorage:', error);
            }
        }
    }
    /**
     * 初始化提供商
     */
    initializeProviders() {
        // 初始化 DeepSeek
        if (this.config.providers.deepseek?.apiKey)
            this.providers.set('deepseek', new DeepSeekProvider(this.config.providers.deepseek));
        // 初始化 OpenAI
        if (this.config.providers.openai?.apiKey)
            this.providers.set('openai', new OpenAIProvider(this.config.providers.openai));
        // 初始化 Claude
        if (this.config.providers.claude?.apiKey)
            this.providers.set('claude', new ClaudeProvider(this.config.providers.claude));
        // 初始化百度文心一言
        if (this.config.providers.baidu?.apiKey)
            this.providers.set('baidu', new BaiduProvider(this.config.providers.baidu));
        // 初始化阿里通义千问
        if (this.config.providers.qwen?.apiKey)
            this.providers.set('qwen', new QwenProvider(this.config.providers.qwen));
        // 初始化讯飞星火
        if (this.config.providers.spark?.apiKey)
            this.providers.set('spark', new SparkProvider(this.config.providers.spark));
        // 初始化智谱清言
        if (this.config.providers.glm?.apiKey)
            this.providers.set('glm', new GLMProvider(this.config.providers.glm));
    }
    /**
     * 设置当前提供商
     */
    setProvider(provider) {
        const providerInstance = this.providers.get(provider);
        if (!providerInstance)
            throw new Error(`Provider ${provider} is not available`);
        this.currentProvider = providerInstance;
        this.config.defaultProvider = provider;
        this.saveConfig();
    }
    /**
     * 更新配置
     */
    updateConfig(config) {
        this.config = {
            ...this.config,
            ...config,
            providers: {
                ...this.config.providers,
                ...config.providers,
            },
            features: {
                ...this.config.features,
                ...config.features,
            },
            shortcuts: {
                ...this.config.shortcuts,
                ...config.shortcuts,
            },
        };
        // 重新初始化提供商
        this.providers.clear();
        this.initializeProviders();
        // 重新设置当前提供商
        this.setProvider(this.config.defaultProvider);
        // 保存配置
        this.saveConfig();
    }
    /**
     * 更新 API 密钥
     */
    updateApiKey(provider, apiKey) {
        if (this.config.providers[provider]) {
            this.config.providers[provider].apiKey = apiKey;
            // 重新初始化该提供商
            const config = this.config.providers[provider];
            switch (provider) {
                case 'deepseek':
                    this.providers.set('deepseek', new DeepSeekProvider(config));
                    break;
                case 'openai':
                    this.providers.set('openai', new OpenAIProvider(config));
                    break;
                case 'claude':
                    this.providers.set('claude', new ClaudeProvider(config));
                    break;
                case 'baidu':
                    this.providers.set('baidu', new BaiduProvider(config));
                    break;
                case 'qwen':
                    this.providers.set('qwen', new QwenProvider(config));
                    break;
                case 'spark':
                    this.providers.set('spark', new SparkProvider(config));
                    break;
                case 'glm':
                    this.providers.set('glm', new GLMProvider(config));
                    break;
            }
            this.saveConfig();
        }
    }
    /**
     * 注册自定义提供商
     */
    registerProvider(name, provider) {
        this.providers.set(name, provider);
    }
    /**
     * 获取可用的提供商列表
     */
    getAvailableProviders() {
        return Array.from(this.providers.keys());
    }
    /**
     * 获取当前提供商
     */
    getCurrentProvider() {
        if (!this.currentProvider)
            return null;
        for (const [name, provider] of this.providers.entries()) {
            if (provider === this.currentProvider)
                return name;
        }
        return null;
    }
    /**
     * 获取配置
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * 检查 AI 功能是否启用
     */
    isEnabled() {
        return this.config.enabled;
    }
    /**
     * 启用/禁用 AI 功能
     */
    setEnabled(enabled) {
        this.config.enabled = enabled;
        this.saveConfig();
    }
    /**
     * 发送 AI 请求
     */
    async request(request) {
        if (!this.isEnabled()) {
            return {
                success: false,
                error: 'AI features are disabled',
            };
        }
        if (!this.currentProvider) {
            return {
                success: false,
                error: 'No AI provider is configured',
            };
        }
        try {
            return await this.currentProvider.request(request);
        }
        catch (error) {
            console.error('AI request failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    /**
     * 纠错
     */
    async correct(text, context) {
        if (!this.config.features.errorCorrection) {
            return {
                success: false,
                error: 'Error correction feature is disabled',
            };
        }
        return this.request({
            type: 'correct',
            text,
            context,
        });
    }
    /**
     * 自动补全
     */
    async complete(text, context) {
        if (!this.config.features.autoComplete) {
            return {
                success: false,
                error: 'Auto-complete feature is disabled',
            };
        }
        return this.request({
            type: 'complete',
            text,
            context,
        });
    }
    /**
     * 续写
     */
    async continue(text, context) {
        if (!this.config.features.textContinuation) {
            return {
                success: false,
                error: 'Text continuation feature is disabled',
            };
        }
        return this.request({
            type: 'continue',
            text,
            context,
        });
    }
    /**
     * 重写
     */
    async rewrite(text, context) {
        if (!this.config.features.textRewrite) {
            return {
                success: false,
                error: 'Text rewrite feature is disabled',
            };
        }
        return this.request({
            type: 'rewrite',
            text,
            context,
        });
    }
    /**
     * 获取建议
     */
    async suggest(text, context) {
        if (!this.config.features.smartSuggestions) {
            return {
                success: false,
                error: 'Smart suggestions feature is disabled',
            };
        }
        return this.request({
            type: 'suggest',
            text,
            context,
        });
    }
    /**
     * 清理资源
     */
    cleanup() {
        this.providers.forEach(provider => provider.cleanup());
        this.providers.clear();
        this.currentProvider = null;
    }
}
// 创建全局 AI 服务实例
let aiServiceInstance = null;
/**
 * 获取 AI 服务实例
 */
export function getAIService(config) {
    if (!aiServiceInstance)
        aiServiceInstance = new AIService(config);
    return aiServiceInstance;
}
/**
 * 重置 AI 服务实例
 */
export function resetAIService() {
    if (aiServiceInstance) {
        aiServiceInstance.cleanup();
        aiServiceInstance = null;
    }
}
//# sourceMappingURL=AIService.js.map