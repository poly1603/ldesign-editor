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

class OpenAIProvider {
  constructor(config) {
    this.name = "openai";
    this.config = config;
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || config.apiEndpoint || "https://api.openai.com/v1";
    this.model = config.model || "gpt-3.5-turbo";
    this.defaultConfig = {
      temperature: 0.7,
      maxTokens: 2e3,
      topP: 1
    };
  }
  async initialize(config) {
    this.config = config;
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || config.apiEndpoint || "https://api.openai.com/v1";
    this.model = config.model || "gpt-3.5-turbo";
  }
  validateConfig() {
    return !!this.apiKey && !!this.model;
  }
  cleanup() {
  }
  async request(request) {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: request.model || this.model,
          messages: [{
            role: "system",
            content: request.systemPrompt || "You are a helpful writing assistant."
          }, {
            role: "user",
            content: request.prompt
          }],
          temperature: request.temperature || this.defaultConfig.temperature,
          max_tokens: request.maxTokens || this.defaultConfig.maxTokens,
          top_p: request.topP || this.defaultConfig.topP,
          stream: request.stream || false
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "OpenAI API request failed");
      }
      const data = await response.json();
      return {
        success: true,
        content: data.choices[0]?.message?.content || "",
        text: data.choices[0]?.message?.content || "",
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      console.error("OpenAI request failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  async stream(request, onChunk) {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: request.model || this.model,
          messages: [{
            role: "system",
            content: request.systemPrompt || "You are a helpful writing assistant."
          }, {
            role: "user",
            content: request.prompt
          }],
          temperature: request.temperature || this.defaultConfig.temperature,
          max_tokens: request.maxTokens || this.defaultConfig.maxTokens,
          stream: true
        })
      });
      if (!response.ok)
        throw new Error("OpenAI streaming request failed");
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader)
        throw new Error("No reader available");
      while (true) {
        const {
          done,
          value
        } = await reader.read();
        if (done)
          break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]")
              continue;
            try {
              const json = JSON.parse(data);
              const content = json.choices[0]?.delta?.content;
              if (content)
                onChunk(content);
            } catch (e) {
              console.warn("Failed to parse SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("OpenAI streaming failed:", error);
      throw error;
    }
  }
  getSupportedModels() {
    return ["gpt-4", "gpt-4-turbo-preview", "gpt-4-32k", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"];
  }
}

exports.OpenAIProvider = OpenAIProvider;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=OpenAIProvider.cjs.map
