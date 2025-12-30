/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { showUnifiedDialog } from './UnifiedDialog.js';

function showAIConfigDialog(editor, currentConfig, onSave) {
  const dialogContent = `
    <div class="ldesign-ai-config">
      <style>
        .ldesign-ai-config {
          min-width: 500px;
        }
        .ldesign-ai-config-section {
          margin-bottom: 24px;
        }
        .ldesign-ai-config-title {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 12px;
          color: #333;
        }
        .ldesign-ai-config-subtitle {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
          color: #666;
        }
        .ldesign-ai-config-group {
          margin-bottom: 16px;
        }
        .ldesign-ai-config-label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          color: #666;
        }
        .ldesign-ai-config-input,
        .ldesign-ai-config-select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.3s;
        }
        .ldesign-ai-config-input:focus,
        .ldesign-ai-config-select:focus {
          outline: none;
          border-color: #1890ff;
        }
        .ldesign-ai-config-checkbox {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        .ldesign-ai-config-checkbox input {
          margin-right: 8px;
        }
        .ldesign-ai-config-checkbox label {
          font-size: 14px;
          color: #333;
          cursor: pointer;
        }
        .ldesign-ai-config-tabs {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 20px;
        }
        .ldesign-ai-config-tab {
          padding: 10px 20px;
          cursor: pointer;
          border: none;
          background: none;
          font-size: 14px;
          color: #666;
          transition: all 0.3s;
        }
        .ldesign-ai-config-tab.active {
          color: #1890ff;
          border-bottom: 2px solid #1890ff;
        }
        .ldesign-ai-config-tab-content {
          display: none;
        }
        .ldesign-ai-config-tab-content.active {
          display: block;
        }
        .ldesign-ai-config-hint {
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }
        .ldesign-ai-config-provider-card {
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 16px;
          margin-bottom: 16px;
        }
        .ldesign-ai-config-provider-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .ldesign-ai-config-provider-name {
          font-weight: 500;
          font-size: 15px;
          color: #333;
        }
        .ldesign-ai-config-provider-status {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        .ldesign-ai-config-provider-status.configured {
          background: #f0f9ff;
          color: #1890ff;
        }
        .ldesign-ai-config-provider-status.not-configured {
          background: #fff7e6;
          color: #faad14;
        }
      </style>
      
      <div class="ldesign-ai-config-tabs">
        <button class="ldesign-ai-config-tab active" data-tab="general">\u5E38\u89C4\u8BBE\u7F6E</button>
        <button class="ldesign-ai-config-tab" data-tab="providers">\u6A21\u578B\u914D\u7F6E</button>
        <button class="ldesign-ai-config-tab" data-tab="features">\u529F\u80FD\u5F00\u5173</button>
        <button class="ldesign-ai-config-tab" data-tab="shortcuts">\u5FEB\u6377\u952E</button>
      </div>
      
      <!-- \u5E38\u89C4\u8BBE\u7F6E -->
      <div class="ldesign-ai-config-tab-content active" data-content="general">
        <div class="ldesign-ai-config-section">
          <div class="ldesign-ai-config-group">
            <label class="ldesign-ai-config-label">\u542F\u7528 AI \u529F\u80FD</label>
            <div class="ldesign-ai-config-checkbox">
              <input type="checkbox" id="ai-enabled" ${currentConfig.enabled ? "checked" : ""}>
              <label for="ai-enabled">\u5F00\u542F AI \u52A9\u624B\u529F\u80FD</label>
            </div>
          </div>
          
          <div class="ldesign-ai-config-group">
            <label class="ldesign-ai-config-label">\u9ED8\u8BA4 AI \u63D0\u4F9B\u5546</label>
            <select class="ldesign-ai-config-select" id="default-provider">
              <option value="deepseek" ${currentConfig.defaultProvider === "deepseek" ? "selected" : ""}>DeepSeek</option>
              <option value="openai" ${currentConfig.defaultProvider === "openai" ? "selected" : ""}>OpenAI</option>
              <option value="azure" ${currentConfig.defaultProvider === "azure" ? "selected" : ""}>Azure OpenAI</option>
              <option value="anthropic" ${currentConfig.defaultProvider === "anthropic" ? "selected" : ""}>Anthropic</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- \u6A21\u578B\u914D\u7F6E -->
      <div class="ldesign-ai-config-tab-content" data-content="providers">
        <div class="ldesign-ai-config-section">
          <!-- DeepSeek \u914D\u7F6E -->
          <div class="ldesign-ai-config-provider-card">
            <div class="ldesign-ai-config-provider-header">
              <span class="ldesign-ai-config-provider-name">DeepSeek</span>
              <span class="ldesign-ai-config-provider-status ${currentConfig.providers.deepseek?.apiKey ? "configured" : "not-configured"}">
                ${currentConfig.providers.deepseek?.apiKey ? "\u5DF2\u914D\u7F6E" : "\u672A\u914D\u7F6E"}
              </span>
            </div>
            <div class="ldesign-ai-config-group">
              <label class="ldesign-ai-config-label">API \u5BC6\u94A5</label>
              <input type="password" class="ldesign-ai-config-input" id="deepseek-api-key" 
                value="${currentConfig.providers.deepseek?.apiKey || ""}"
                placeholder="sk-...">
              <div class="ldesign-ai-config-hint">\u9ED8\u8BA4\u4F7F\u7528\u5185\u7F6E\u5BC6\u94A5\uFF0C\u4F60\u53EF\u4EE5\u8BBE\u7F6E\u81EA\u5DF1\u7684\u5BC6\u94A5</div>
            </div>
            <div class="ldesign-ai-config-group">
              <label class="ldesign-ai-config-label">\u6A21\u578B</label>
              <input type="text" class="ldesign-ai-config-input" id="deepseek-model"
                value="${currentConfig.providers.deepseek?.model || "deepseek-chat"}"
                placeholder="deepseek-chat">
            </div>
            <div class="ldesign-ai-config-group">
              <label class="ldesign-ai-config-label">API \u7AEF\u70B9</label>
              <input type="text" class="ldesign-ai-config-input" id="deepseek-endpoint"
                value="${currentConfig.providers.deepseek?.apiEndpoint || "https://api.deepseek.com/v1"}"
                placeholder="https://api.deepseek.com/v1">
            </div>
          </div>
          
          <!-- OpenAI \u914D\u7F6E -->
          <div class="ldesign-ai-config-provider-card">
            <div class="ldesign-ai-config-provider-header">
              <span class="ldesign-ai-config-provider-name">OpenAI</span>
              <span class="ldesign-ai-config-provider-status ${currentConfig.providers.openai?.apiKey ? "configured" : "not-configured"}">
                ${currentConfig.providers.openai?.apiKey ? "\u5DF2\u914D\u7F6E" : "\u672A\u914D\u7F6E"}
              </span>
            </div>
            <div class="ldesign-ai-config-group">
              <label class="ldesign-ai-config-label">API \u5BC6\u94A5</label>
              <input type="password" class="ldesign-ai-config-input" id="openai-api-key"
                value="${currentConfig.providers.openai?.apiKey || ""}"
                placeholder="sk-...">
            </div>
            <div class="ldesign-ai-config-group">
              <label class="ldesign-ai-config-label">\u6A21\u578B</label>
              <select class="ldesign-ai-config-select" id="openai-model">
                <option value="gpt-3.5-turbo" ${currentConfig.providers.openai?.model === "gpt-3.5-turbo" ? "selected" : ""}>GPT-3.5 Turbo</option>
                <option value="gpt-4" ${currentConfig.providers.openai?.model === "gpt-4" ? "selected" : ""}>GPT-4</option>
                <option value="gpt-4-turbo" ${currentConfig.providers.openai?.model === "gpt-4-turbo" ? "selected" : ""}>GPT-4 Turbo</option>
              </select>
            </div>
            <div class="ldesign-ai-config-group">
              <label class="ldesign-ai-config-label">API \u7AEF\u70B9</label>
              <input type="text" class="ldesign-ai-config-input" id="openai-endpoint"
                value="${currentConfig.providers.openai?.apiEndpoint || "https://api.openai.com/v1"}"
                placeholder="https://api.openai.com/v1">
            </div>
          </div>
        </div>
      </div>
      
      <!-- \u529F\u80FD\u5F00\u5173 -->
      <div class="ldesign-ai-config-tab-content" data-content="features">
        <div class="ldesign-ai-config-section">
          <div class="ldesign-ai-config-checkbox">
            <input type="checkbox" id="feature-error-correction" ${currentConfig.features.errorCorrection ? "checked" : ""}>
            <label for="feature-error-correction">AI \u7EA0\u9519</label>
          </div>
          <div class="ldesign-ai-config-checkbox">
            <input type="checkbox" id="feature-auto-complete" ${currentConfig.features.autoComplete ? "checked" : ""}>
            <label for="feature-auto-complete">AI \u81EA\u52A8\u8865\u5168</label>
          </div>
          <div class="ldesign-ai-config-checkbox">
            <input type="checkbox" id="feature-text-continuation" ${currentConfig.features.textContinuation ? "checked" : ""}>
            <label for="feature-text-continuation">AI \u7EED\u5199</label>
          </div>
          <div class="ldesign-ai-config-checkbox">
            <input type="checkbox" id="feature-text-rewrite" ${currentConfig.features.textRewrite ? "checked" : ""}>
            <label for="feature-text-rewrite">AI \u91CD\u5199</label>
          </div>
          <div class="ldesign-ai-config-checkbox">
            <input type="checkbox" id="feature-smart-suggestions" ${currentConfig.features.smartSuggestions ? "checked" : ""}>
            <label for="feature-smart-suggestions">\u667A\u80FD\u5EFA\u8BAE</label>
          </div>
        </div>
      </div>
      
      <!-- \u5FEB\u6377\u952E -->
      <div class="ldesign-ai-config-tab-content" data-content="shortcuts">
        <div class="ldesign-ai-config-section">
          <div class="ldesign-ai-config-group">
            <label class="ldesign-ai-config-label">AI \u7EA0\u9519</label>
            <input type="text" class="ldesign-ai-config-input" id="shortcut-error-correction"
              value="${currentConfig.shortcuts?.errorCorrection || "Alt+F"}"
              placeholder="Alt+F">
          </div>
          <div class="ldesign-ai-config-group">
            <label class="ldesign-ai-config-label">AI \u8865\u5168</label>
            <input type="text" class="ldesign-ai-config-input" id="shortcut-auto-complete"
              value="${currentConfig.shortcuts?.autoComplete || "Ctrl+Space"}"
              placeholder="Ctrl+Space">
          </div>
          <div class="ldesign-ai-config-group">
            <label class="ldesign-ai-config-label">AI \u7EED\u5199</label>
            <input type="text" class="ldesign-ai-config-input" id="shortcut-text-continuation"
              value="${currentConfig.shortcuts?.textContinuation || "Alt+Enter"}"
              placeholder="Alt+Enter">
          </div>
          <div class="ldesign-ai-config-group">
            <label class="ldesign-ai-config-label">AI \u91CD\u5199</label>
            <input type="text" class="ldesign-ai-config-input" id="shortcut-text-rewrite"
              value="${currentConfig.shortcuts?.textRewrite || "Alt+R"}"
              placeholder="Alt+R">
          </div>
        </div>
      </div>
    </div>
  `;
  showUnifiedDialog({
    title: "AI \u8BBE\u7F6E",
    content: dialogContent,
    width: 600,
    buttons: [{
      id: "cancel",
      label: "\u53D6\u6D88",
      type: "secondary",
      closeOnClick: true
    }, {
      id: "save",
      label: "\u4FDD\u5B58",
      type: "primary",
      onClick: () => {
        const newConfig = {
          enabled: document.getElementById("ai-enabled").checked,
          defaultProvider: document.getElementById("default-provider").value,
          providers: {
            deepseek: {
              provider: "deepseek",
              model: document.getElementById("deepseek-model").value || "deepseek-chat",
              apiKey: document.getElementById("deepseek-api-key").value,
              apiEndpoint: document.getElementById("deepseek-endpoint").value || "https://api.deepseek.com/v1",
              temperature: 0.7,
              maxTokens: 2e3,
              stream: false
            },
            openai: {
              provider: "openai",
              model: document.getElementById("openai-model").value || "gpt-3.5-turbo",
              apiKey: document.getElementById("openai-api-key").value,
              apiEndpoint: document.getElementById("openai-endpoint").value || "https://api.openai.com/v1",
              temperature: 0.7,
              maxTokens: 2e3,
              stream: false
            }
          },
          features: {
            errorCorrection: document.getElementById("feature-error-correction").checked,
            autoComplete: document.getElementById("feature-auto-complete").checked,
            textContinuation: document.getElementById("feature-text-continuation").checked,
            textRewrite: document.getElementById("feature-text-rewrite").checked,
            smartSuggestions: document.getElementById("feature-smart-suggestions").checked
          },
          shortcuts: {
            errorCorrection: document.getElementById("shortcut-error-correction").value,
            autoComplete: document.getElementById("shortcut-auto-complete").value,
            textContinuation: document.getElementById("shortcut-text-continuation").value,
            textRewrite: document.getElementById("shortcut-text-rewrite").value
          }
        };
        onSave(newConfig);
        return true;
      },
      closeOnClick: true
    }],
    onOpen: () => {
      const tabs = document.querySelectorAll(".ldesign-ai-config-tab");
      const contents = document.querySelectorAll(".ldesign-ai-config-tab-content");
      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const targetTab = tab.getAttribute("data-tab");
          tabs.forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");
          contents.forEach((content) => {
            if (content.getAttribute("data-content") === targetTab)
              content.classList.add("active");
            else
              content.classList.remove("active");
          });
        });
      });
    }
  });
}

export { showAIConfigDialog };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=AIConfigDialog.js.map
