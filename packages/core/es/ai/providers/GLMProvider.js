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

const logger = createLogger("GLMProvider");
class GLMProvider {
  constructor(config) {
    this.name = "glm";
    this.config = {
      ...config,
      provider: "glm",
      model: config.model || "glm-4",
      apiEndpoint: config.apiEndpoint || "https://open.bigmodel.cn/api/paas/v4/chat/completions"
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
          "Accept": this.config.stream ? "text/event-stream" : "application/json"
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: this.config.temperature || 0.7,
          top_p: 0.9,
          max_tokens: this.config.maxTokens || 2e3,
          stream: this.config.stream || false,
          stop: null
        })
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`\u667A\u8C31\u6E05\u8A00\u8BF7\u6C42\u5931\u8D25: ${response.status} - ${error}`);
      }
      const data = await response.json();
      if (data.error)
        throw new Error(`\u667A\u8C31\u6E05\u8A00\u9519\u8BEF: ${data.error.code} - ${data.error.message}`);
      const content = data.choices?.[0]?.message?.content || "";
      return {
        success: true,
        text: content,
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        } : void 0
      };
    } catch (error) {
      logger.error("\u667A\u8C31\u6E05\u8A00\u8BF7\u6C42\u5931\u8D25:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "\u672A\u77E5\u9519\u8BEF"
      };
    }
  }
  validateConfig() {
    if (!this.config.apiKey) {
      logger.error("\u7F3A\u5C11\u667A\u8C31API\u5BC6\u94A5");
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
      correct: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u6587\u672C\u6821\u5BF9\u4E13\u5BB6\u3002\u8BF7\u4ED4\u7EC6\u68C0\u67E5\u5E76\u7EA0\u6B63\u6587\u672C\u4E2D\u7684\u6240\u6709\u9519\u8BEF\uFF0C\u5305\u62EC\uFF1A\n1. \u62FC\u5199\u9519\u8BEF\n2. \u8BED\u6CD5\u9519\u8BEF\n3. \u6807\u70B9\u7B26\u53F7\u9519\u8BEF\n4. \u4E0D\u901A\u987A\u7684\u8868\u8FBE\n\n\u8BF7\u76F4\u63A5\u7ED9\u51FA\u4FEE\u6B63\u540E\u7684\u6587\u672C\uFF0C\u4E0D\u9700\u8981\u89E3\u91CA\u3002",
      complete: "\u4F60\u662F\u4E00\u4E2A\u667A\u80FD\u5199\u4F5C\u52A9\u624B\u3002\u8BF7\u6839\u636E\u7ED9\u5B9A\u7684\u4E0A\u4E0B\u6587\uFF0C\u81EA\u7136\u5730\u5B8C\u6210\u540E\u7EED\u5185\u5BB9\u3002\u8981\u6C42\uFF1A\n1. \u4FDD\u6301\u8BED\u8A00\u98CE\u683C\u4E00\u81F4\n2. \u5185\u5BB9\u8FDE\u8D2F\u81EA\u7136\n3. \u7B26\u5408\u903B\u8F91",
      continue: "\u4F60\u662F\u4E00\u4E2A\u521B\u610F\u5199\u4F5C\u52A9\u624B\u3002\u8BF7\u57FA\u4E8E\u5DF2\u6709\u5185\u5BB9\u7EE7\u7EED\u5199\u4F5C\u3002\u8981\u6C42\uFF1A\n1. \u4FDD\u6301\u6545\u4E8B\u7684\u8FDE\u8D2F\u6027\n2. \u7EF4\u6301\u76F8\u540C\u7684\u5199\u4F5C\u98CE\u683C\n3. \u60C5\u8282\u53D1\u5C55\u8981\u5408\u7406",
      rewrite: "\u4F60\u662F\u4E00\u4E2A\u8D44\u6DF1\u7684\u6587\u6848\u7F16\u8F91\u3002\u8BF7\u5C06\u7ED9\u5B9A\u7684\u5185\u5BB9\u91CD\u5199\uFF0C\u8981\u6C42\uFF1A\n1. \u8868\u8FBE\u66F4\u52A0\u6E05\u6670\u51C6\u786E\n2. \u8BED\u8A00\u66F4\u52A0\u4E13\u4E1A\u5F97\u4F53\n3. \u7ED3\u6784\u66F4\u52A0\u5408\u7406\n4. \u4FDD\u6301\u539F\u610F\u4E0D\u53D8",
      suggest: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u5185\u5BB9\u987E\u95EE\u3002\u8BF7\u4ED4\u7EC6\u5206\u6790\u7ED9\u5B9A\u7684\u5185\u5BB9\uFF0C\u5E76\u4ECE\u4EE5\u4E0B\u65B9\u9762\u63D0\u4F9B\u5177\u4F53\u7684\u6539\u8FDB\u5EFA\u8BAE\uFF1A\n1. \u5185\u5BB9\u7ED3\u6784\n2. \u8868\u8FBE\u65B9\u5F0F\n3. \u903B\u8F91\u6027\n4. \u53EF\u8BFB\u6027\n5. \u4E13\u4E1A\u6027\n\n\u8BF7\u4EE5\u6761\u76EE\u5F62\u5F0F\u7ED9\u51FA\u5EFA\u8BAE\u3002"
    };
    return prompts[type] || "\u4F60\u662F\u4E00\u4E2A\u667A\u80FD\u52A9\u624B\uFF0C\u8BF7\u6839\u636E\u7528\u6237\u9700\u6C42\u5904\u7406\u6587\u672C\u5185\u5BB9\u3002";
  }
  /**
   * 支持的模型列表
   */
  static getSupportedModels() {
    return [{
      id: "glm-4",
      name: "GLM-4",
      description: "\u6700\u65B0\u4E00\u4EE3\u6A21\u578B\uFF0C\u80FD\u529B\u5168\u9762\u63D0\u5347"
    }, {
      id: "glm-4-air",
      name: "GLM-4-Air",
      description: "\u6027\u80FD\u4E0E\u4EF7\u683C\u5E73\u8861\u7684\u6A21\u578B"
    }, {
      id: "glm-4-airx",
      name: "GLM-4-AirX",
      description: "\u9AD8\u6027\u4EF7\u6BD4\u6A21\u578B"
    }, {
      id: "glm-4-flash",
      name: "GLM-4-Flash",
      description: "\u8D85\u5FEB\u901F\u54CD\u5E94\uFF0C\u9002\u5408\u7B80\u5355\u4EFB\u52A1"
    }, {
      id: "glm-3-turbo",
      name: "GLM-3-Turbo",
      description: "\u4E0A\u4E00\u4EE3\u4E3B\u529B\u6A21\u578B\uFF0C\u7A33\u5B9A\u53EF\u9760"
    }];
  }
  /**
   * 获取模型定价信息
   */
  static getPricing() {
    return {
      "glm-4": {
        input: 0.1,
        output: 0.1,
        unit: "\u5143/\u5343tokens"
      },
      "glm-4-air": {
        input: 0.01,
        output: 0.01,
        unit: "\u5143/\u5343tokens"
      },
      "glm-4-airx": {
        input: 0.01,
        output: 0.01,
        unit: "\u5143/\u5343tokens"
      },
      "glm-4-flash": {
        input: 1e-4,
        output: 1e-4,
        unit: "\u5143/\u5343tokens"
      },
      "glm-3-turbo": {
        input: 5e-3,
        output: 5e-3,
        unit: "\u5143/\u5343tokens"
      }
    };
  }
}

export { GLMProvider };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=GLMProvider.js.map
