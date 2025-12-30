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

var logger$1 = require('../../../utils/logger.cjs');

const logger = logger$1.createLogger("FlowchartEditor");
class FlowchartEditor {
  async render(container, options) {
    logger.info("Rendering flowchart editor");
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
      <div class="flowchart-editor" style="display: flex; flex-direction: column; height: 100%;">
        <div style="padding: 15px; border-bottom: 1px solid #e0e0e0;">
          <h4 style="margin: 0 0 10px 0;">\u6D41\u7A0B\u56FE\u8282\u70B9</h4>
          <div id="nodeList" style="display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto;">
            ${this.data.nodes.map((node, index) => `
              <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
                <span style="flex: 1; font-size: 14px;">${this.getNodeIcon(node.type)} ${node.text}</span>
                <button onclick="window.editFlowNode(${index})" style="padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">\u7F16\u8F91</button>
                <button onclick="window.deleteFlowNode(${index})" style="padding: 4px 8px; border: 1px solid #f44336; color: #f44336; border-radius: 4px; cursor: pointer;">\u5220\u9664</button>
              </div>
            `).join("")}
          </div>
          <button id="addNode" style="margin-top: 10px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">
            \u2795 \u6DFB\u52A0\u8282\u70B9
          </button>
        </div>
        
        <div style="flex: 1; padding: 15px; overflow-y: auto;">
          <h4 style="margin: 0 0 10px 0;">\u8FDE\u63A5\u5173\u7CFB</h4>
          <div id="edgeList">
            ${this.data.edges.map((edge, index) => {
      const fromNode = this.data.nodes.find((n) => n.id === edge.from);
      const toNode = this.data.nodes.find((n) => n.id === edge.to);
      return `
                <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: #f5f5f5; border-radius: 4px; margin-bottom: 8px;">
                  <span style="flex: 1; font-size: 14px;">${fromNode?.text || edge.from} \u2192 ${toNode?.text || edge.to}</span>
                  <button onclick="window.deleteFlowEdge(${index})" style="padding: 4px 8px; border: 1px solid #f44336; color: #f44336; border-radius: 4px; cursor: pointer;">\u5220\u9664</button>
                </div>
              `;
    }).join("")}
          </div>
          <button id="addEdge" style="margin-top: 10px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">
            \u2795 \u6DFB\u52A0\u8FDE\u63A5
          </button>
        </div>
        
        <div style="padding: 15px; border-top: 1px solid #e0e0e0; display: flex; justify-content: flex-end; gap: 10px;">
          <button id="cancel" style="padding: 8px 20px; background: white; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">\u53D6\u6D88</button>
          <button id="save" style="padding: 8px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">\u4FDD\u5B58</button>
        </div>
      </div>
    `;
    this.bindEvents();
  }
  bindEvents() {
    window.editFlowNode = (index) => this.editNode(index);
    window.deleteFlowNode = (index) => this.deleteNode(index);
    window.deleteFlowEdge = (index) => this.deleteEdge(index);
    this.container?.querySelector("#addNode")?.addEventListener("click", () => this.addNode());
    this.container?.querySelector("#addEdge")?.addEventListener("click", () => this.addEdge());
    this.container?.querySelector("#save")?.addEventListener("click", () => {
      if (this.onSave && this.data)
        this.onSave(this.data);
    });
    this.container?.querySelector("#cancel")?.addEventListener("click", () => this.onCancel?.());
  }
  getNodeIcon(type) {
    const icons = {
      start: "\u2B55",
      end: "\u{1F534}",
      process: "\u25AD",
      decision: "\u25C6",
      io: "\u2B1F",
      subroutine: "\u25AD\u25AD"
    };
    return icons[type] || "\u25AD";
  }
  addNode() {
    if (!this.data)
      return;
    const text = prompt("\u8282\u70B9\u6587\u672C\uFF1A", "\u65B0\u8282\u70B9");
    if (!text)
      return;
    const type = prompt("\u8282\u70B9\u7C7B\u578B (start/end/process/decision/io):", "process");
    this.data.nodes.push({
      id: `node-${Date.now()}`,
      type: type || "process",
      text,
      x: 100 + this.data.nodes.length * 50,
      y: 100
    });
    this.createUI();
  }
  editNode(index) {
    if (!this.data)
      return;
    const node = this.data.nodes[index];
    const newText = prompt("\u7F16\u8F91\u8282\u70B9\u6587\u672C\uFF1A", node.text);
    if (newText !== null) {
      node.text = newText;
      this.createUI();
    }
  }
  deleteNode(index) {
    if (!this.data || !confirm("\u786E\u5B9A\u5220\u9664\uFF1F"))
      return;
    const nodeId = this.data.nodes[index].id;
    this.data.nodes.splice(index, 1);
    this.data.edges = this.data.edges.filter((e) => e.from !== nodeId && e.to !== nodeId);
    this.createUI();
  }
  addEdge() {
    if (!this.data || this.data.nodes.length < 2) {
      alert("\u81F3\u5C11\u9700\u89812\u4E2A\u8282\u70B9\u624D\u80FD\u6DFB\u52A0\u8FDE\u63A5");
      return;
    }
    const options = this.data.nodes.map((n) => `${n.id}: ${n.text}`).join("\n");
    const from = prompt(`\u8D77\u59CB\u8282\u70B9ID:
${options}`);
    const to = prompt(`\u76EE\u6807\u8282\u70B9ID:
${options}`);
    if (from && to) {
      this.data.edges.push({
        from,
        to
      });
      this.createUI();
    }
  }
  deleteEdge(index) {
    if (!this.data || !confirm("\u786E\u5B9A\u5220\u9664\uFF1F"))
      return;
    this.data.edges.splice(index, 1);
    this.createUI();
  }
  destroy() {
    delete window.editFlowNode;
    delete window.deleteFlowNode;
    delete window.deleteFlowEdge;
  }
}

exports.FlowchartEditor = FlowchartEditor;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=FlowchartEditor.cjs.map
