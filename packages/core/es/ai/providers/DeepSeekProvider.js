/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class DeepSeekProvider {
  constructor(config) {
    this.name = "deepseek";
    this.config = config || {
      provider: "deepseek",
      model: "deepseek-chat",
      apiKey: "sk-37b7e5f545814da1923cae055b498c9a",
      apiEndpoint: "https://api.deepseek.com/v1",
      temperature: 0.7,
      maxTokens: 2e3,
      stream: false
    };
  }
  async initialize(config) {
    this.config = {
      ...this.config,
      ...config
    };
    if (!this.validateConfig())
      throw new Error("Invalid DeepSeek configuration");
  }
  validateConfig() {
    return !!(this.config.apiKey && this.config.apiEndpoint && this.config.model);
  }
  async request(request) {
    try {
      const systemPrompt = this.getSystemPrompt(request.type);
      const userPrompt = this.getUserPrompt(request);
      const response = await fetch(`${this.config.apiEndpoint}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [{
            role: "system",
            content: systemPrompt
          }, {
            role: "user",
            content: userPrompt
          }],
          temperature: this.config.temperature || 0.7,
          max_tokens: this.config.maxTokens || 2e3,
          stream: false
        })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error)
        throw new Error(data.error.message || "DeepSeek API error");
      const content = data.choices?.[0]?.message?.content || "";
      return {
        success: true,
        text: content,
        suggestions: request.type === "suggest" ? this.parseSuggestions(content) : void 0,
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        } : void 0
      };
    } catch (error) {
      console.error("DeepSeek request error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  getSystemPrompt(type) {
    const prompts = {
      correct: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u6587\u672C\u7EA0\u9519\u52A9\u624B\u3002\u8BF7\u7EA0\u6B63\u6587\u672C\u4E2D\u7684\u62FC\u5199\u3001\u8BED\u6CD5\u548C\u6807\u70B9\u9519\u8BEF\u3002\u4FDD\u6301\u539F\u610F\u4E0D\u53D8\uFF0C\u53EA\u4FEE\u6B63\u9519\u8BEF\u3002\u76F4\u63A5\u8FD4\u56DE\u7EA0\u6B63\u540E\u7684\u6587\u672C\uFF0C\u4E0D\u8981\u89E3\u91CA\u3002",
      complete: "\u4F60\u662F\u4E00\u4E2A\u667A\u80FD\u5199\u4F5C\u52A9\u624B\u3002\u6839\u636E\u4E0A\u4E0B\u6587\uFF0C\u4E3A\u7528\u6237\u8865\u5168\u5F53\u524D\u6B63\u5728\u8F93\u5165\u7684\u5185\u5BB9\u3002\u8FD4\u56DE\u7B80\u6D01\u3001\u76F8\u5173\u7684\u8865\u5168\u5EFA\u8BAE\u3002",
      continue: "\u4F60\u662F\u4E00\u4E2A\u521B\u610F\u5199\u4F5C\u52A9\u624B\u3002\u6839\u636E\u5DF2\u6709\u5185\u5BB9\uFF0C\u81EA\u7136\u5730\u7EED\u5199\u540E\u7EED\u5185\u5BB9\u3002\u4FDD\u6301\u8BED\u8A00\u98CE\u683C\u548C\u4E3B\u9898\u4E00\u81F4\u3002",
      rewrite: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u6587\u672C\u91CD\u5199\u52A9\u624B\u3002\u8BF7\u6539\u5199\u6587\u672C\uFF0C\u4F7F\u5176\u66F4\u52A0\u6E05\u6670\u3001\u6D41\u7545\u548C\u4E13\u4E1A\u3002\u4FDD\u6301\u539F\u610F\uFF0C\u4F18\u5316\u8868\u8FBE\u3002",
      suggest: "\u4F60\u662F\u4E00\u4E2A\u667A\u80FD\u5EFA\u8BAE\u52A9\u624B\u3002\u6839\u636E\u4E0A\u4E0B\u6587\uFF0C\u63D0\u4F9B\u76F8\u5173\u7684\u5199\u4F5C\u5EFA\u8BAE\u3002\u8FD4\u56DE3-5\u4E2A\u7B80\u77ED\u7684\u5EFA\u8BAE\u9009\u9879\u3002"
    };
    return prompts[type] || prompts.correct;
  }
  getUserPrompt(request) {
    let prompt = `\u6587\u672C\uFF1A${request.text}`;
    if (request.context)
      prompt = `\u4E0A\u4E0B\u6587\uFF1A${request.context}

${prompt}`;
    if (request.language)
      prompt = `\u8BED\u8A00\uFF1A${request.language}

${prompt}`;
    return prompt;
  }
  parseSuggestions(content) {
    const suggestions = [];
    const lines = content.split("\n").filter((line) => line.trim());
    for (const line of lines) {
      const cleaned = line.replace(/^[\d.\-*\s]+/, "").trim();
      if (cleaned)
        suggestions.push(cleaned);
    }
    return suggestions.slice(0, 5);
  }
  cleanup() {
  }
}

export { DeepSeekProvider };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=DeepSeekProvider.js.map
