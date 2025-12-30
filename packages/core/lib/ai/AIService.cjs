/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var BaiduProvider = require('./providers/BaiduProvider.cjs');
var ClaudeProvider = require('./providers/ClaudeProvider.cjs');
var DeepSeekProvider = require('./providers/DeepSeekProvider.cjs');
var GLMProvider = require('./providers/GLMProvider.cjs');
var OpenAIProvider = require('./providers/OpenAIProvider.cjs');
var QwenProvider = require('./providers/QwenProvider.cjs');
var SparkProvider = require('./providers/SparkProvider.cjs');
var types = require('./types.cjs');

class AIService {
  constructor(config) {
    this.providers = /* @__PURE__ */ new Map();
    this.currentProvider = null;
    this.configStorageKey = "ldesign-editor-ai-config";
    this.config = this.loadConfig(config);
    this.initializeProviders();
    this.setProvider(this.config.defaultProvider);
  }
  /**
   * 加载配置
   */
  loadConfig(customConfig) {
    let savedConfig = {};
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const saved = localStorage.getItem(this.configStorageKey);
        if (saved)
          savedConfig = JSON.parse(saved);
      } catch (error) {
        console.error("Failed to load AI config from localStorage:", error);
      }
    }
    return {
      ...types.defaultAIConfig,
      ...savedConfig,
      ...customConfig,
      providers: {
        ...types.defaultAIConfig.providers,
        ...savedConfig.providers,
        ...customConfig?.providers
      },
      features: {
        ...types.defaultAIConfig.features,
        ...savedConfig.features,
        ...customConfig?.features
      },
      shortcuts: {
        ...types.defaultAIConfig.shortcuts,
        ...savedConfig.shortcuts,
        ...customConfig?.shortcuts
      }
    };
  }
  /**
   * 保存配置
   */
  saveConfig() {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.setItem(this.configStorageKey, JSON.stringify(this.config));
      } catch (error) {
        console.error("Failed to save AI config to localStorage:", error);
      }
    }
  }
  /**
   * 初始化提供商
   */
  initializeProviders() {
    if (this.config.providers.deepseek?.apiKey)
      this.providers.set("deepseek", new DeepSeekProvider.DeepSeekProvider(this.config.providers.deepseek));
    if (this.config.providers.openai?.apiKey)
      this.providers.set("openai", new OpenAIProvider.OpenAIProvider(this.config.providers.openai));
    if (this.config.providers.claude?.apiKey)
      this.providers.set("claude", new ClaudeProvider.ClaudeProvider(this.config.providers.claude));
    if (this.config.providers.baidu?.apiKey)
      this.providers.set("baidu", new BaiduProvider.BaiduProvider(this.config.providers.baidu));
    if (this.config.providers.qwen?.apiKey)
      this.providers.set("qwen", new QwenProvider.QwenProvider(this.config.providers.qwen));
    if (this.config.providers.spark?.apiKey)
      this.providers.set("spark", new SparkProvider.SparkProvider(this.config.providers.spark));
    if (this.config.providers.glm?.apiKey)
      this.providers.set("glm", new GLMProvider.GLMProvider(this.config.providers.glm));
  }
  /**
   * 设置当前提供商
   */
  setProvider(provider) {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      console.warn(`[AIService] Provider ${provider} is not available. AI features will be disabled.`);
      this.currentProvider = null;
      return false;
    }
    this.currentProvider = providerInstance;
    this.config.defaultProvider = provider;
    this.saveConfig();
    return true;
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
        ...config.providers
      },
      features: {
        ...this.config.features,
        ...config.features
      },
      shortcuts: {
        ...this.config.shortcuts,
        ...config.shortcuts
      }
    };
    this.providers.clear();
    this.initializeProviders();
    this.setProvider(this.config.defaultProvider);
    this.saveConfig();
  }
  /**
   * 更新 API 密钥
   */
  updateApiKey(provider, apiKey) {
    if (this.config.providers[provider]) {
      this.config.providers[provider].apiKey = apiKey;
      const config = this.config.providers[provider];
      switch (provider) {
        case "deepseek":
          this.providers.set("deepseek", new DeepSeekProvider.DeepSeekProvider(config));
          break;
        case "openai":
          this.providers.set("openai", new OpenAIProvider.OpenAIProvider(config));
          break;
        case "claude":
          this.providers.set("claude", new ClaudeProvider.ClaudeProvider(config));
          break;
        case "baidu":
          this.providers.set("baidu", new BaiduProvider.BaiduProvider(config));
          break;
        case "qwen":
          this.providers.set("qwen", new QwenProvider.QwenProvider(config));
          break;
        case "spark":
          this.providers.set("spark", new SparkProvider.SparkProvider(config));
          break;
        case "glm":
          this.providers.set("glm", new GLMProvider.GLMProvider(config));
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
    return {
      ...this.config
    };
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
        error: "AI features are disabled"
      };
    }
    if (!this.currentProvider) {
      return {
        success: false,
        error: "No AI provider is configured"
      };
    }
    try {
      return await this.currentProvider.request(request);
    } catch (error) {
      console.error("AI request failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
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
        error: "Error correction feature is disabled"
      };
    }
    return this.request({
      type: "correct",
      text,
      context
    });
  }
  /**
   * 自动补全
   */
  async complete(text, context) {
    if (!this.config.features.autoComplete) {
      return {
        success: false,
        error: "Auto-complete feature is disabled"
      };
    }
    return this.request({
      type: "complete",
      text,
      context
    });
  }
  /**
   * 续写
   */
  async continue(text, context) {
    if (!this.config.features.textContinuation) {
      return {
        success: false,
        error: "Text continuation feature is disabled"
      };
    }
    return this.request({
      type: "continue",
      text,
      context
    });
  }
  /**
   * 重写
   */
  async rewrite(text, context) {
    if (!this.config.features.textRewrite) {
      return {
        success: false,
        error: "Text rewrite feature is disabled"
      };
    }
    return this.request({
      type: "rewrite",
      text,
      context
    });
  }
  /**
   * 获取建议
   */
  async suggest(text, context) {
    if (!this.config.features.smartSuggestions) {
      return {
        success: false,
        error: "Smart suggestions feature is disabled"
      };
    }
    return this.request({
      type: "suggest",
      text,
      context
    });
  }
  /**
   * 清理资源
   */
  cleanup() {
    this.providers.forEach((provider) => provider.cleanup());
    this.providers.clear();
    this.currentProvider = null;
  }
}
let aiServiceInstance = null;
function getAIService(config) {
  if (!aiServiceInstance)
    aiServiceInstance = new AIService(config);
  return aiServiceInstance;
}
function resetAIService() {
  if (aiServiceInstance) {
    aiServiceInstance.cleanup();
    aiServiceInstance = null;
  }
}

exports.AIService = AIService;
exports.getAIService = getAIService;
exports.resetAIService = resetAIService;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=AIService.cjs.map
