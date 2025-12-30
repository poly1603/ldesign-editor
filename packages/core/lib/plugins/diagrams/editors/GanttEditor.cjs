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

class GanttEditor {
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
        <h4>\u7518\u7279\u56FE\u7F16\u8F91\u5668</h4>
        <div style="margin-top: 20px;">
          ${this.data.tasks.map((task, i) => `
            <div style="border: 1px solid #ddd; border-radius: 4px; padding: 12px; margin-bottom: 12px; background: white;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                  <strong>${task.name}</strong>
                  <div style="font-size: 13px; color: #666; margin-top: 4px;">
                    \u5F00\u59CB: ${new Date(task.start).toLocaleDateString()} | \u7ED3\u675F: ${new Date(task.end).toLocaleDateString()} | \u8FDB\u5EA6: ${task.progress}%
                  </div>
                </div>
                <button onclick="window.delGanttTask(${i})" style="padding: 4px 8px; border: 1px solid #f44336; color: #f44336; border-radius: 4px; cursor: pointer;">\u5220\u9664</button>
              </div>
            </div>
          `).join("")}
          
          <button id="addTask" style="padding: 10px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 10px;">
            \u2795 \u6DFB\u52A0\u4EFB\u52A1
          </button>
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
    window.delGanttTask = (i) => {
      if (this.data && confirm("\u786E\u5B9A\u5220\u9664\uFF1F")) {
        this.data.tasks.splice(i, 1);
        this.createUI();
      }
    };
    this.container?.querySelector("#addTask")?.addEventListener("click", () => {
      const name = prompt("\u4EFB\u52A1\u540D\u79F0\uFF1A", "\u65B0\u4EFB\u52A1");
      if (name && this.data) {
        const start = /* @__PURE__ */ new Date();
        const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
        this.data.tasks.push({
          name,
          start: start.toISOString(),
          end: end.toISOString(),
          progress: 0
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
    delete window.delGanttTask;
  }
}

exports.GanttEditor = GanttEditor;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=GanttEditor.cjs.map
