/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createLogger } from '../../../utils/logger.js';

/**
 * 流程图编辑器
 * 简化实现，支持基本的节点创建和连接
 */
const logger = createLogger('FlowchartEditor');
class FlowchartEditor {
    async render(container, options) {
        logger.info('Rendering flowchart editor');
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
          <h4 style="margin: 0 0 10px 0;">流程图节点</h4>
          <div id="nodeList" style="display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto;">
            ${this.data.nodes.map((node, index) => `
              <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
                <span style="flex: 1; font-size: 14px;">${this.getNodeIcon(node.type)} ${node.text}</span>
                <button onclick="window.editFlowNode(${index})" style="padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">编辑</button>
                <button onclick="window.deleteFlowNode(${index})" style="padding: 4px 8px; border: 1px solid #f44336; color: #f44336; border-radius: 4px; cursor: pointer;">删除</button>
              </div>
            `).join('')}
          </div>
          <button id="addNode" style="margin-top: 10px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">
            ➕ 添加节点
          </button>
        </div>
        
        <div style="flex: 1; padding: 15px; overflow-y: auto;">
          <h4 style="margin: 0 0 10px 0;">连接关系</h4>
          <div id="edgeList">
            ${this.data.edges.map((edge, index) => {
            const fromNode = this.data.nodes.find(n => n.id === edge.from);
            const toNode = this.data.nodes.find(n => n.id === edge.to);
            return `
                <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: #f5f5f5; border-radius: 4px; margin-bottom: 8px;">
                  <span style="flex: 1; font-size: 14px;">${fromNode?.text || edge.from} → ${toNode?.text || edge.to}</span>
                  <button onclick="window.deleteFlowEdge(${index})" style="padding: 4px 8px; border: 1px solid #f44336; color: #f44336; border-radius: 4px; cursor: pointer;">删除</button>
                </div>
              `;
        }).join('')}
          </div>
          <button id="addEdge" style="margin-top: 10px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">
            ➕ 添加连接
          </button>
        </div>
        
        <div style="padding: 15px; border-top: 1px solid #e0e0e0; display: flex; justify-content: flex-end; gap: 10px;">
          <button id="cancel" style="padding: 8px 20px; background: white; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">取消</button>
          <button id="save" style="padding: 8px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
        </div>
      </div>
    `;
        this.bindEvents();
    }
    bindEvents() {
        // 全局函数
        window.editFlowNode = (index) => this.editNode(index);
        window.deleteFlowNode = (index) => this.deleteNode(index);
        window.deleteFlowEdge = (index) => this.deleteEdge(index);
        this.container?.querySelector('#addNode')?.addEventListener('click', () => this.addNode());
        this.container?.querySelector('#addEdge')?.addEventListener('click', () => this.addEdge());
        this.container?.querySelector('#save')?.addEventListener('click', () => {
            if (this.onSave && this.data)
                this.onSave(this.data);
        });
        this.container?.querySelector('#cancel')?.addEventListener('click', () => this.onCancel?.());
    }
    getNodeIcon(type) {
        const icons = {
            start: '⭕',
            end: '🔴',
            process: '▭',
            decision: '◆',
            io: '⬟',
            subroutine: '▭▭',
        };
        return icons[type] || '▭';
    }
    addNode() {
        if (!this.data)
            return;
        const text = prompt('节点文本：', '新节点');
        if (!text)
            return;
        const type = prompt('节点类型 (start/end/process/decision/io):', 'process');
        this.data.nodes.push({
            id: `node-${Date.now()}`,
            type: type || 'process',
            text,
            x: 100 + this.data.nodes.length * 50,
            y: 100,
        });
        this.createUI();
    }
    editNode(index) {
        if (!this.data)
            return;
        const node = this.data.nodes[index];
        const newText = prompt('编辑节点文本：', node.text);
        if (newText !== null) {
            node.text = newText;
            this.createUI();
        }
    }
    deleteNode(index) {
        if (!this.data || !confirm('确定删除？'))
            return;
        const nodeId = this.data.nodes[index].id;
        this.data.nodes.splice(index, 1);
        this.data.edges = this.data.edges.filter(e => e.from !== nodeId && e.to !== nodeId);
        this.createUI();
    }
    addEdge() {
        if (!this.data || this.data.nodes.length < 2) {
            alert('至少需要2个节点才能添加连接');
            return;
        }
        const options = this.data.nodes.map(n => `${n.id}: ${n.text}`).join('\n');
        const from = prompt(`起始节点ID:\n${options}`);
        const to = prompt(`目标节点ID:\n${options}`);
        if (from && to) {
            this.data.edges.push({ from, to });
            this.createUI();
        }
    }
    deleteEdge(index) {
        if (!this.data || !confirm('确定删除？'))
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

export { FlowchartEditor };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=FlowchartEditor.js.map
