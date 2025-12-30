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

var logger$1 = require('../../utils/logger.cjs');

const logger = logger$1.createLogger("BaiduProvider");
class BaiduProvider {
  constructor(config) {
    this.name = "baidu";
    this.config = {
      ...config,
      provider: "baidu",
      model: config.model || "ernie-bot",
      apiEndpoint: config.apiEndpoint || "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat"
    };
  }
  async initialize(config) {
    this.config = {
      ...this.config,
      ...config
    };
    await this.refreshAccessToken();
  }
  async request(request) {
    try {
      await this.ensureAccessToken();
      const messages = this.buildMessages(request);
      const response = await fetch(`${this.config.apiEndpoint}/${this.getModelEndpoint()}?access_token=${this.accessToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages,
          temperature: this.config.temperature || 0.7,
          top_p: 0.9,
          penalty_score: 1,
          stream: this.config.stream || false
        })
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`\u767E\u5EA6\u6587\u5FC3\u4E00\u8A00\u8BF7\u6C42\u5931\u8D25: ${response.status} - ${error}`);
      }
      const data = await response.json();
      if (data.error_code)
        throw new Error(`\u767E\u5EA6\u6587\u5FC3\u4E00\u8A00\u9519\u8BEF: ${data.error_code} - ${data.error_msg}`);
      return {
        success: true,
        text: data.result,
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        } : void 0
      };
    } catch (error) {
      logger.error("\u6587\u5FC3\u4E00\u8A00\u8BF7\u6C42\u5931\u8D25:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "\u672A\u77E5\u9519\u8BEF"
      };
    }
  }
  validateConfig() {
    if (!this.config.apiKey) {
      logger.error("\u7F3A\u5C11\u767E\u5EA6API\u5BC6\u94A5");
      return false;
    }
    const [apiKey, secretKey] = this.config.apiKey.split(":");
    if (!apiKey || !secretKey) {
      logger.error('\u767E\u5EA6API\u5BC6\u94A5\u683C\u5F0F\u9519\u8BEF\uFF0C\u5E94\u4E3A "API_KEY:SECRET_KEY"');
      return false;
    }
    return true;
  }
  cleanup() {
    this.accessToken = void 0;
    this.tokenExpiry = void 0;
  }
  buildMessages(request) {
    const systemPrompt = this.getSystemPrompt(request.type);
    const messages = [];
    if (systemPrompt) {
      messages.push({
        role: "user",
        content: `${systemPrompt}

${request.text}`
      });
    } else {
      messages.push({
        role: "user",
        content: request.text
      });
    }
    return messages;
  }
  getSystemPrompt(type) {
    const prompts = {
      correct: "\u8BF7\u7EA0\u6B63\u4EE5\u4E0B\u6587\u672C\u4E2D\u7684\u9519\u8BEF\uFF0C\u5305\u62EC\u62FC\u5199\u3001\u8BED\u6CD5\u548C\u8868\u8FBE\u95EE\u9898\uFF1A",
      complete: "\u8BF7\u6839\u636E\u4E0A\u4E0B\u6587\u5B8C\u6210\u4EE5\u4E0B\u5185\u5BB9\uFF1A",
      continue: "\u8BF7\u7EE7\u7EED\u5199\u4E0B\u53BB\uFF1A",
      rewrite: "\u8BF7\u91CD\u5199\u4EE5\u4E0B\u5185\u5BB9\uFF0C\u4F7F\u5176\u66F4\u52A0\u6E05\u6670\u3001\u4E13\u4E1A\uFF1A",
      suggest: "\u8BF7\u4E3A\u4EE5\u4E0B\u5185\u5BB9\u63D0\u4F9B\u6539\u8FDB\u5EFA\u8BAE\uFF1A"
    };
    return prompts[type] || "";
  }
  getModelEndpoint() {
    const modelMap = {
      "ernie-bot": "ernie_bot",
      "ernie-bot-turbo": "ernie_bot_turbo",
      "ernie-bot-4": "ernie_bot_4",
      "ernie-3.5-8k": "ernie_3.5_8k",
      "ernie-3.5-128k": "ernie_3.5_128k"
    };
    return modelMap[this.config.model] || "ernie_bot";
  }
  async refreshAccessToken() {
    if (!this.validateConfig())
      throw new Error("\u767E\u5EA6\u914D\u7F6E\u65E0\u6548");
    const [apiKey, secretKey] = this.config.apiKey.split(":");
    const response = await fetch(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`, {
      method: "POST"
    });
    if (!response.ok)
      throw new Error("\u83B7\u53D6\u767E\u5EA6\u8BBF\u95EE\u4EE4\u724C\u5931\u8D25");
    const data = await response.json();
    if (data.error)
      throw new Error(`\u83B7\u53D6\u767E\u5EA6\u8BBF\u95EE\u4EE4\u724C\u5931\u8D25: ${data.error} - ${data.error_description}`);
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + data.expires_in * 1e3 - 6e4;
    logger.info("\u767E\u5EA6\u8BBF\u95EE\u4EE4\u724C\u5237\u65B0\u6210\u529F");
  }
  async ensureAccessToken() {
    if (!this.accessToken || !this.tokenExpiry || Date.now() >= this.tokenExpiry)
      await this.refreshAccessToken();
  }
}

exports.BaiduProvider = BaiduProvider;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=BaiduProvider.cjs.map
