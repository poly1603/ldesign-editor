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

Object.defineProperty(exports, '__esModule', { value: true });

var Plugin = require('../../core/Plugin.cjs');
var TemplateManager = require('../../template/TemplateManager.cjs');
var TemplateDialog = require('../../ui/TemplateDialog.cjs');

let globalTemplateManager = null;
function getTemplateManager() {
  if (!globalTemplateManager) {
    globalTemplateManager = new TemplateManager.TemplateManager({
      storage: "local",
      maxCustomTemplates: 50,
      enableVariables: true
    });
    globalTemplateManager.init().catch((error) => {
      console.error("Failed to initialize template manager:", error);
    });
  }
  return globalTemplateManager;
}
const TemplatePlugin = Plugin.createPlugin({
  name: "template",
  config: {
    toolbar: {
      items: [{
        name: "template",
        tooltip: "\u6A21\u677F",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <line x1="3" y1="9" x2="9" y2="9"/>
            <line x1="3" y1="15" x2="9" y2="15"/>
            <line x1="12" y1="7" x2="18" y2="7"/>
            <line x1="12" y1="12" x2="18" y2="12"/>
            <line x1="12" y1="17" x2="18" y2="17"/>
          </svg>`,
        action: "template:show-dialog"
      }]
    }
  },
  init(editor) {
    const templateManager = getTemplateManager();
    editor.templateManager = templateManager;
    editor.commands.register("template:show-dialog", {
      execute: () => {
        TemplateDialog.showTemplateDialog(templateManager, async (template) => {
          const options = {
            replaceContent: true
          };
          if (template.variables && template.variables.length > 0) {
            await templateManager.applyTemplate(editor, template.metadata.id, options);
          } else {
            await templateManager.applyTemplate(editor, template.metadata.id, options);
          }
        });
      }
    });
    editor.commands.register("template:create-from-content", {
      execute: async () => {
        const content = editor.getContent();
        if (!content || content === "<p><br></p>") {
          alert("\u5F53\u524D\u7F16\u8F91\u5668\u5185\u5BB9\u4E3A\u7A7A\uFF0C\u65E0\u6CD5\u521B\u5EFA\u6A21\u677F");
          return;
        }
        showCreateTemplateDialog(editor, templateManager);
      }
    });
    editor.commands.register("template:apply", {
      execute: async (templateId, options) => {
        await templateManager.applyTemplate(editor, templateId, options);
      }
    });
    editor.commands.register("template:export", {
      execute: async (templateId) => {
        try {
          const jsonStr = await templateManager.exportTemplate(templateId);
          downloadJSON(jsonStr, `template-${templateId}.json`);
        } catch (error) {
          console.error("Failed to export template:", error);
          alert("\u5BFC\u51FA\u6A21\u677F\u5931\u8D25");
        }
      }
    });
    editor.commands.register("template:import", {
      execute: async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.addEventListener("change", async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
              try {
                const jsonStr = event.target?.result;
                await templateManager.importTemplate(jsonStr);
                alert("\u6A21\u677F\u5BFC\u5165\u6210\u529F\uFF01");
              } catch (error) {
                alert(`\u6A21\u677F\u5BFC\u5165\u5931\u8D25\uFF1A${error}`);
              }
            };
            reader.readAsText(file);
          }
        });
        input.click();
      }
    });
    editor.keymap.register({
      "Ctrl+Shift+T": "template:show-dialog",
      "Cmd+Shift+T": "template:show-dialog"
    });
    editor.on("template:create-from-content", () => {
      editor.commands.execute("template:create-from-content");
    });
    if (editor.contextMenuManager) {
      editor.contextMenuManager.registerItem({
        id: "template",
        label: "\u6A21\u677F",
        submenu: [{
          id: "apply-template",
          label: "\u5E94\u7528\u6A21\u677F",
          action: () => editor.commands.execute("template:show-dialog")
        }, {
          id: "create-template",
          label: "\u4ECE\u5F53\u524D\u5185\u5BB9\u521B\u5EFA\u6A21\u677F",
          action: () => editor.commands.execute("template:create-from-content")
        }]
      });
    }
  },
  destroy() {
    if (globalTemplateManager) {
      globalTemplateManager.destroy();
      globalTemplateManager = null;
    }
  }
});
function showCreateTemplateDialog(editor, templateManager) {
  const dialog = document.createElement("div");
  dialog.className = "template-create-dialog-overlay";
  dialog.innerHTML = `
    <div class="template-create-dialog">
      <div class="template-create-header">
        <h3>\u521B\u5EFA\u65B0\u6A21\u677F</h3>
        <button class="close-btn">\xD7</button>
      </div>
      <div class="template-create-content">
        <div class="form-group">
          <label for="template-name">\u6A21\u677F\u540D\u79F0 <span class="required">*</span></label>
          <input type="text" id="template-name" placeholder="\u8F93\u5165\u6A21\u677F\u540D\u79F0" />
        </div>
        <div class="form-group">
          <label for="template-desc">\u6A21\u677F\u63CF\u8FF0</label>
          <textarea id="template-desc" placeholder="\u8F93\u5165\u6A21\u677F\u63CF\u8FF0\uFF08\u53EF\u9009\uFF09" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label for="template-category">\u5206\u7C7B <span class="required">*</span></label>
          <select id="template-category">
            <option value="business">\u5546\u52A1</option>
            <option value="personal">\u4E2A\u4EBA</option>
            <option value="creative">\u521B\u610F</option>
            <option value="education">\u6559\u80B2</option>
            <option value="technical">\u6280\u672F</option>
            <option value="custom" selected>\u81EA\u5B9A\u4E49</option>
          </select>
        </div>
        <div class="form-group">
          <label for="template-tags">\u6807\u7B7E</label>
          <input type="text" id="template-tags" placeholder="\u7528\u9017\u53F7\u5206\u9694\u591A\u4E2A\u6807\u7B7E" />
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="extract-variables" checked />
            \u81EA\u52A8\u63D0\u53D6\u53D8\u91CF\uFF08\u68C0\u6D4B {{variable}} \u683C\u5F0F\uFF09
          </label>
        </div>
      </div>
      <div class="template-create-footer">
        <button class="btn-secondary cancel-btn">\u53D6\u6D88</button>
        <button class="btn-primary save-btn">\u4FDD\u5B58\u6A21\u677F</button>
      </div>
    </div>
  `;
  addCreateDialogStyles();
  document.body.appendChild(dialog);
  const closeBtn = dialog.querySelector(".close-btn");
  const cancelBtn = dialog.querySelector(".cancel-btn");
  const saveBtn = dialog.querySelector(".save-btn");
  const close = () => document.body.removeChild(dialog);
  closeBtn.addEventListener("click", close);
  cancelBtn.addEventListener("click", close);
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog)
      close();
  });
  saveBtn.addEventListener("click", async () => {
    const name = dialog.querySelector("#template-name").value.trim();
    const description = dialog.querySelector("#template-desc").value.trim();
    const category = dialog.querySelector("#template-category").value;
    const tagsStr = dialog.querySelector("#template-tags").value.trim();
    if (!name) {
      alert("\u8BF7\u8F93\u5165\u6A21\u677F\u540D\u79F0");
      return;
    }
    const tags = tagsStr ? tagsStr.split(",").map((t) => t.trim()).filter(Boolean) : [];
    try {
      const template = await templateManager.createTemplateFromContent(editor, {
        id: "",
        name,
        description,
        category,
        tags,
        author: "User",
        isCustom: true
      });
      alert("\u6A21\u677F\u521B\u5EFA\u6210\u529F\uFF01");
      close();
    } catch (error) {
      alert(`\u521B\u5EFA\u6A21\u677F\u5931\u8D25\uFF1A${error}`);
    }
  });
}
function downloadJSON(jsonStr, filename) {
  const blob = new Blob([jsonStr], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function addCreateDialogStyles() {
  if (document.getElementById("template-create-dialog-styles"))
    return;
  const style = document.createElement("style");
  style.id = "template-create-dialog-styles";
  style.textContent = `
    .template-create-dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }

    .template-create-dialog {
      background: white;
      border-radius: 8px;
      width: 500px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    .template-create-header {
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .template-create-header h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }

    .template-create-content {
      padding: 20px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }

    .form-group input[type="text"],
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-group textarea {
      resize: vertical;
    }

    .form-group input[type="checkbox"] {
      margin-right: 8px;
    }

    .template-create-footer {
      padding: 15px 20px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    .required {
      color: #e74c3c;
    }
  `;
  document.head.appendChild(style);
}

exports.TemplatePlugin = TemplatePlugin;
exports.default = TemplatePlugin;
exports.getTemplateManager = getTemplateManager;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
