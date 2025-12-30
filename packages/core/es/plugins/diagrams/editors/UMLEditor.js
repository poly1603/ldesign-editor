/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createLogger } from '../../../utils/logger.js';

const logger = createLogger("UMLEditor");
class UMLEditor {
  async render(container, options) {
    logger.info("Rendering UML editor");
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
      <div style="display: flex; flex-direction: column; height: 100%; overflow-y: auto; padding: 20px;">
        <h4>UML\u7C7B\u56FE\u7F16\u8F91\u5668 (\u7B80\u5316\u7248)</h4>
        <p style="color: #666; font-size: 13px;">\u6DFB\u52A0\u7C7B\u3001\u5C5E\u6027\u3001\u65B9\u6CD5\u548C\u5173\u7CFB</p>
        
        <div style="margin-top: 20px;">
          ${this.data.classes.map((cls, i) => `
            <div style="border: 1px solid #ddd; border-radius: 4px; padding: 15px; margin-bottom: 15px; background: white;">
              <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                <strong style="font-size: 16px;">${cls.name}</strong>
                <button onclick="window.deleteUMLClass(${i})" style="padding: 4px 8px; border: 1px solid #f44336; color: #f44336; border-radius: 4px; cursor: pointer;">\u5220\u9664</button>
              </div>
              <div style="font-size: 13px; color: #666;">
                <div><strong>\u5C5E\u6027:</strong> ${cls.attributes.join(", ") || "\u65E0"}</div>
                <div><strong>\u65B9\u6CD5:</strong> ${cls.methods.join(", ") || "\u65E0"}</div>
              </div>
            </div>
          `).join("")}
          
          <button id="addClass" style="padding: 10px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">
            \u2795 \u6DFB\u52A0\u7C7B
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
    window.deleteUMLClass = (index) => {
      if (this.data && confirm("\u786E\u5B9A\u5220\u9664\uFF1F")) {
        this.data.classes.splice(index, 1);
        this.createUI();
      }
    };
    this.container?.querySelector("#addClass")?.addEventListener("click", () => {
      const name = prompt("\u7C7B\u540D\uFF1A", "NewClass");
      if (name && this.data) {
        this.data.classes.push({
          name,
          attributes: [],
          methods: []
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
    delete window.deleteUMLClass;
  }
}

export { UMLEditor };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=UMLEditor.js.map
