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

const logger = logger$1.createLogger("SparkProvider");
class SparkProvider {
  constructor(config) {
    this.name = "spark";
    this.wsUrl = "";
    this.config = {
      ...config,
      provider: "spark",
      model: config.model || "spark-3.5",
      apiEndpoint: config.apiEndpoint || "wss://spark-api.xf-yun.com/v3.5/chat"
    };
  }
  async initialize(config) {
    this.config = {
      ...this.config,
      ...config
    };
    this.wsUrl = this.getWebSocketUrl();
  }
  async request(request) {
    try {
      const response = await this.makeWebSocketRequest(request);
      return {
        success: true,
        text: response.text,
        usage: response.usage
      };
    } catch (error) {
      logger.error("\u8BAF\u98DE\u661F\u706B\u8BF7\u6C42\u5931\u8D25:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "\u672A\u77E5\u9519\u8BEF"
      };
    }
  }
  validateConfig() {
    if (!this.config.apiKey) {
      logger.error("\u7F3A\u5C11\u8BAF\u98DEAPI\u5BC6\u94A5");
      return false;
    }
    const parts = this.config.apiKey.split(":");
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
      logger.error('\u8BAF\u98DEAPI\u5BC6\u94A5\u683C\u5F0F\u9519\u8BEF\uFF0C\u5E94\u4E3A "APP_ID:API_KEY:API_SECRET"');
      return false;
    }
    return true;
  }
  cleanup() {
  }
  async makeWebSocketRequest(request) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.wsUrl);
      let fullText = "";
      let usage = null;
      ws.onopen = () => {
        logger.debug("WebSocket\u8FDE\u63A5\u5DF2\u5EFA\u7ACB");
        const params = this.buildWebSocketParams(request);
        ws.send(JSON.stringify(params));
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.header.code !== 0) {
          ws.close();
          reject(new Error(`\u8BAF\u98DE\u661F\u706B\u9519\u8BEF: ${data.header.code} - ${data.header.message}`));
          return;
        }
        const payload = data.payload;
        if (payload.choices && payload.choices.text) {
          payload.choices.text.forEach((item) => {
            fullText += item.content;
          });
        }
        if (payload.usage) {
          usage = {
            promptTokens: payload.usage.text.prompt_tokens,
            completionTokens: payload.usage.text.completion_tokens,
            totalTokens: payload.usage.text.total_tokens
          };
        }
        if (data.header.status === 2) {
          ws.close();
          resolve({
            text: fullText,
            usage
          });
        }
      };
      ws.onerror = (error) => {
        logger.error("WebSocket\u9519\u8BEF:", error);
        reject(new Error("WebSocket\u8FDE\u63A5\u9519\u8BEF"));
      };
      ws.onclose = () => {
        logger.debug("WebSocket\u8FDE\u63A5\u5DF2\u5173\u95ED");
      };
    });
  }
  buildWebSocketParams(request) {
    const [appId] = this.config.apiKey.split(":");
    return {
      header: {
        app_id: appId,
        uid: this.generateUID()
      },
      parameter: {
        chat: {
          domain: this.getDomain(),
          temperature: this.config.temperature || 0.7,
          max_tokens: this.config.maxTokens || 2e3,
          top_k: 4,
          chat_id: this.generateUID()
        }
      },
      payload: {
        message: {
          text: this.buildMessages(request)
        }
      }
    };
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
      correct: "\u8BF7\u7EA0\u6B63\u6587\u672C\u4E2D\u7684\u6240\u6709\u9519\u8BEF\uFF0C\u5305\u62EC\u62FC\u5199\u3001\u8BED\u6CD5\u548C\u6807\u70B9\u7B26\u53F7\u9519\u8BEF\u3002",
      complete: "\u8BF7\u81EA\u7136\u5730\u5B8C\u6210\u8FD9\u6BB5\u6587\u672C\u3002",
      continue: "\u8BF7\u7EE7\u7EED\u5199\u4F5C\uFF0C\u4FDD\u6301\u98CE\u683C\u4E00\u81F4\u3002",
      rewrite: "\u8BF7\u91CD\u5199\u8FD9\u6BB5\u6587\u672C\uFF0C\u4F7F\u5176\u66F4\u52A0\u4E13\u4E1A\u548C\u6E05\u6670\u3002",
      suggest: "\u8BF7\u4E3A\u8FD9\u6BB5\u6587\u672C\u63D0\u4F9B\u6539\u8FDB\u5EFA\u8BAE\u3002"
    };
    return prompts[type] || "";
  }
  getWebSocketUrl() {
    return this.config.apiEndpoint;
  }
  getDomain() {
    const modelMap = {
      "spark-1.5": "general",
      "spark-2.0": "generalv2",
      "spark-3.0": "generalv3",
      "spark-3.5": "generalv3.5"
    };
    return modelMap[this.config.model] || "generalv3.5";
  }
  generateUID() {
    return `uid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  /**
   * 支持的模型列表
   */
  static getSupportedModels() {
    return [{
      id: "spark-1.5",
      name: "\u661F\u706B1.5",
      description: "\u57FA\u7840\u7248\u672C"
    }, {
      id: "spark-2.0",
      name: "\u661F\u706B2.0",
      description: "\u589E\u5F3A\u7248\u672C"
    }, {
      id: "spark-3.0",
      name: "\u661F\u706B3.0",
      description: "\u4E13\u4E1A\u7248\u672C"
    }, {
      id: "spark-3.5",
      name: "\u661F\u706B3.5",
      description: "\u6700\u65B0\u7248\u672C\uFF0C\u80FD\u529B\u6700\u5F3A"
    }];
  }
}

exports.SparkProvider = SparkProvider;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=SparkProvider.cjs.map
