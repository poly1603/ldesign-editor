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

class SequenceDiagramEditor {
  async render(container, options) {
    this.container = container;
    this.data = JSON.parse(JSON.stringify(options.data));
    this.onSave = options.onSave;
    this.onCancel = options.onCancel;
    this.createUI();
  }
  createUI() {
    if (!this.container || !this.data)
      return;
    this.container.innerHTML = `
      <div style="padding: 20px; height: 100%; overflow-y: auto;">
        <h4>\u65F6\u5E8F\u56FE\u7F16\u8F91\u5668</h4>
        <div style="margin: 20px 0;">
          <strong>\u53C2\u4E0E\u8005\uFF1A</strong>
          ${this.data.actors.map((actor, i) => `
            <span style="display: inline-block; margin: 5px; padding: 6px 12px; background: #e8f4f8; border-radius: 4px;">
              ${typeof actor === "string" ? actor : actor.name}
              <button onclick="window.delSeqActor(${i})" style="margin-left: 8px; border: none; background: transparent; cursor: pointer; color: #f44336;">\xD7</button>
            </span>
          `).join("")}
          <button id="addActor" style="margin-left: 10px; padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">+ \u6DFB\u52A0</button>
        </div>
        
        <div>
          <strong>\u6D88\u606F\uFF1A</strong>
          <div style="margin-top: 10px;">
            ${this.data.messages.map((msg, i) => `
              <div style="padding: 8px; margin-bottom: 8px; background: #f5f5f5; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                <span>${msg.from} \u2192 ${msg.to}: ${msg.text}</span>
                <button onclick="window.delSeqMsg(${i})" style="padding: 4px 8px; border: 1px solid #f44336; color: #f44336; border-radius: 4px; cursor: pointer;">\u5220\u9664</button>
              </div>
            `).join("")}
            <button id="addMessage" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 10px;">+ \u6DFB\u52A0\u6D88\u606F</button>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; display: flex; justify-content: flex-end; gap: 10px;">
          <button id="cancel" style="padding: 8px 20px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">\u53D6\u6D88</button>
          <button id="save" style="padding: 8px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">\u4FDD\u5B58</button>
        </div>
      </div>
    `;
    this.bindEvents();
  }
  bindEvents() {
    window.delSeqActor = (i) => {
      if (this.data) {
        this.data.actors.splice(i, 1);
        this.createUI();
      }
    };
    window.delSeqMsg = (i) => {
      if (this.data) {
        this.data.messages.splice(i, 1);
        this.createUI();
      }
    };
    this.container?.querySelector("#addActor")?.addEventListener("click", () => {
      const name = prompt("\u53C2\u4E0E\u8005\u540D\u79F0\uFF1A");
      if (name && this.data) {
        this.data.actors.push(name);
        this.createUI();
      }
    });
    this.container?.querySelector("#addMessage")?.addEventListener("click", () => {
      if (!this.data || this.data.actors.length < 2) {
        alert("\u81F3\u5C11\u9700\u89812\u4E2A\u53C2\u4E0E\u8005");
        return;
      }
      const from = prompt(`\u53D1\u9001\u65B9 (${this.data.actors.join(", ")}):`);
      const to = prompt(`\u63A5\u6536\u65B9 (${this.data.actors.join(", ")}):`);
      const text = prompt("\u6D88\u606F\u5185\u5BB9\uFF1A");
      if (from && to && text) {
        this.data.messages.push({
          from,
          to,
          text
        });
        this.createUI();
      }
    });
    this.container?.querySelector("#save")?.addEventListener("click", () => {
      if (this.onSave && this.data)
        this.onSave(this.data);
    });
    this.container?.querySelector("#cancel")?.addEventListener("click", () => this.onCancel?.());
  }
  destroy() {
    delete window.delSeqActor;
    delete window.delSeqMsg;
  }
}

exports.SequenceDiagramEditor = SequenceDiagramEditor;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=SequenceDiagramEditor.cjs.map
