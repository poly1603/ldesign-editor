/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createLogger } from '../../utils/logger.js';

const logger = createLogger("QwenProvider");
class QwenProvider {
  constructor(config) {
    this.name = "qwen";
    this.config = {
      ...config,
      provider: "qwen",
      model: config.model || "qwen-turbo",
      apiEndpoint: config.apiEndpoint || "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"
    };
  }
  async initialize(config) {
    this.config = {
      ...this.config,
      ...config
    };
  }
  async request(request) {
    try {
      const messages = this.buildMessages(request);
      const response = await fetch(this.config.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.config.apiKey}`,
          "X-DashScope-SSE": this.config.stream ? "enable" : "disable"
        },
        body: JSON.stringify({
          model: this.config.model,
          input: {
            messages
          },
          parameters: {
            temperature: this.config.temperature || 0.7,
            top_p: 0.9,
            max_tokens: this.config.maxTokens || 2e3,
            stop: null,
            stream: this.config.stream || false,
            enable_search: false,
            incremental_output: this.config.stream || false
          }
        })
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`\u901A\u4E49\u5343\u95EE\u8BF7\u6C42\u5931\u8D25: ${response.status} - ${error}`);
      }
      const data = await response.json();
      if (data.code && data.code !== "Success")
        throw new Error(`\u901A\u4E49\u5343\u95EE\u9519\u8BEF: ${data.code} - ${data.message}`);
      const content = data.output?.text || data.output?.choices?.[0]?.message?.content || "";
      return {
        success: true,
        text: content,
        usage: data.usage ? {
          promptTokens: data.usage.input_tokens,
          completionTokens: data.usage.output_tokens,
          totalTokens: data.usage.total_tokens || data.usage.input_tokens + data.usage.output_tokens
        } : void 0
      };
    } catch (error) {
      logger.error("\u901A\u4E49\u5343\u95EE\u8BF7\u6C42\u5931\u8D25:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "\u672A\u77E5\u9519\u8BEF"
      };
    }
  }
  validateConfig() {
    if (!this.config.apiKey) {
      logger.error("\u7F3A\u5C11\u963F\u91CC\u4E91API\u5BC6\u94A5");
      return false;
    }
    return true;
  }
  cleanup() {
  }
  buildMessages(request) {
    const messages = [];
    const systemPrompt = this.getSystemPrompt(request.type);
    if (systemPrompt) {
      messages.push({
        role: "system",
        content: systemPrompt
      });
    }
    messages.push({
      role: "user",
      content: request.text
    });
    return messages;
  }
  getSystemPrompt(type) {
    const prompts = {
      correct: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u6587\u672C\u6821\u5BF9\u52A9\u624B\u3002\u8BF7\u4ED4\u7EC6\u68C0\u67E5\u5E76\u7EA0\u6B63\u6587\u672C\u4E2D\u7684\u6240\u6709\u9519\u8BEF\uFF0C\u5305\u62EC\u62FC\u5199\u3001\u8BED\u6CD5\u3001\u6807\u70B9\u7B26\u53F7\u548C\u8868\u8FBE\u95EE\u9898\u3002\u4FDD\u6301\u539F\u610F\u4E0D\u53D8\uFF0C\u53EA\u4FEE\u6B63\u9519\u8BEF\u3002",
      complete: "\u4F60\u662F\u4E00\u4E2A\u667A\u80FD\u5199\u4F5C\u52A9\u624B\u3002\u8BF7\u6839\u636E\u4E0A\u4E0B\u6587\u548C\u5DF2\u6709\u5185\u5BB9\uFF0C\u81EA\u7136\u5730\u5B8C\u6210\u540E\u7EED\u5185\u5BB9\u3002\u4FDD\u6301\u98CE\u683C\u548C\u8BED\u6C14\u7684\u4E00\u81F4\u6027\u3002",
      continue: "\u4F60\u662F\u4E00\u4E2A\u521B\u610F\u5199\u4F5C\u52A9\u624B\u3002\u8BF7\u57FA\u4E8E\u5DF2\u6709\u5185\u5BB9\uFF0C\u7EE7\u7EED\u521B\u4F5C\u4E0B\u53BB\u3002\u4FDD\u6301\u6545\u4E8B\u7684\u8FDE\u8D2F\u6027\u548C\u98CE\u683C\u7684\u4E00\u81F4\u6027\u3002",
      rewrite: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u6587\u6848\u7F16\u8F91\u3002\u8BF7\u91CD\u5199\u7ED9\u5B9A\u7684\u5185\u5BB9\uFF0C\u4F7F\u5176\u66F4\u52A0\u6E05\u6670\u3001\u4E13\u4E1A\u3001\u6709\u5438\u5F15\u529B\u3002\u53EF\u4EE5\u8C03\u6574\u7ED3\u6784\u548C\u8868\u8FBE\u65B9\u5F0F\uFF0C\u4F46\u8981\u4FDD\u6301\u6838\u5FC3\u4FE1\u606F\u4E0D\u53D8\u3002",
      suggest: "\u4F60\u662F\u4E00\u4E2A\u8D44\u6DF1\u7684\u5185\u5BB9\u987E\u95EE\u3002\u8BF7\u4ED4\u7EC6\u5206\u6790\u7ED9\u5B9A\u7684\u5185\u5BB9\uFF0C\u5E76\u63D0\u4F9B\u5177\u4F53\u7684\u6539\u8FDB\u5EFA\u8BAE\uFF0C\u5305\u62EC\u5185\u5BB9\u7ED3\u6784\u3001\u8868\u8FBE\u65B9\u5F0F\u3001\u903B\u8F91\u6027\u7B49\u65B9\u9762\u3002"
    };
    return prompts[type] || "\u4F60\u662F\u4E00\u4E2A\u667A\u80FD\u52A9\u624B\uFF0C\u8BF7\u5E2E\u52A9\u7528\u6237\u5904\u7406\u6587\u672C\u5185\u5BB9\u3002";
  }
  /**
   * 支持的模型列表
   */
  static getSupportedModels() {
    return [{
      id: "qwen-turbo",
      name: "\u901A\u4E49\u5343\u95EE-Turbo",
      description: "\u901F\u5EA6\u66F4\u5FEB\uFF0C\u6210\u672C\u66F4\u4F4E"
    }, {
      id: "qwen-plus",
      name: "\u901A\u4E49\u5343\u95EE-Plus",
      description: "\u80FD\u529B\u66F4\u5F3A\uFF0C\u6548\u679C\u66F4\u597D"
    }, {
      id: "qwen-max",
      name: "\u901A\u4E49\u5343\u95EE-Max",
      description: "\u6700\u5F3A\u5927\u7684\u6A21\u578B"
    }, {
      id: "qwen-max-1201",
      name: "\u901A\u4E49\u5343\u95EE-Max-1201",
      description: "\u652F\u6301\u66F4\u957F\u4E0A\u4E0B\u6587"
    }, {
      id: "qwen-max-longcontext",
      name: "\u901A\u4E49\u5343\u95EE-\u8D85\u957F\u4E0A\u4E0B\u6587",
      description: "\u652F\u630130\u4E07\u5B57\u4E0A\u4E0B\u6587"
    }];
  }
}

export { QwenProvider };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=QwenProvider.js.map
