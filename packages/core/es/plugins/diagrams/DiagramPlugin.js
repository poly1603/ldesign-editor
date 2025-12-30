/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createLogger } from '../../utils/logger.js';
import { DiagramRenderer } from './DiagramRenderer.js';
import { DiagramToolbar } from './DiagramToolbar.js';
import { FlowchartEditor } from './editors/FlowchartEditor.js';
import { GanttEditor } from './editors/GanttEditor.js';
import { MindMapEditor } from './editors/MindMapEditor.js';
import { SequenceDiagramEditor } from './editors/SequenceDiagramEditor.js';
import { UMLEditor } from './editors/UMLEditor.js';

const logger = createLogger("DiagramPlugin");
class DiagramPlugin {
  constructor() {
    this.name = "diagram";
    this.config = {
      name: "diagram"
    };
    this.version = "1.0.0";
    this.description = "\u9AD8\u7EA7\u56FE\u8868\u7F16\u8F91\u652F\u6301";
    this.editors = /* @__PURE__ */ new Map();
  }
  /**
   * 初始化插件
   */
  async install(editor) {
    logger.info("Initializing diagram plugin");
    this.editor = editor;
    this.renderer = new DiagramRenderer({
      editor
    });
    this.toolbar = new DiagramToolbar({
      editor,
      onInsertDiagram: (type) => this.insertDiagram(type),
      onEditDiagram: (node) => this.editDiagram(node)
    });
    this.registerEditors();
    this.registerCommands();
    this.registerNodeViews();
    this.setupEventListeners();
    logger.info("Diagram plugin initialized");
  }
  /**
   * 注册编辑器
   */
  registerEditors() {
    this.editors.set("mindmap", new MindMapEditor());
    this.editors.set("flowchart", new FlowchartEditor());
    this.editors.set("uml", new UMLEditor());
    this.editors.set("sequence", new SequenceDiagramEditor());
    this.editors.set("gantt", new GanttEditor());
  }
  /**
   * 注册命令
   */
  registerCommands() {
    if (!this.editor)
      return;
    const {
      commands
    } = this.editor;
    commands.register("insertMindMap", {
      label: "\u63D2\u5165\u601D\u7EF4\u5BFC\u56FE",
      icon: "\u{1F9E0}",
      execute: () => this.insertDiagram("mindmap")
    });
    commands.register("insertFlowchart", {
      label: "\u63D2\u5165\u6D41\u7A0B\u56FE",
      icon: "\u{1F500}",
      execute: () => this.insertDiagram("flowchart")
    });
    commands.register("insertUML", {
      label: "\u63D2\u5165UML\u56FE",
      icon: "\u{1F4D0}",
      execute: () => this.insertDiagram("uml")
    });
    commands.register("insertSequenceDiagram", {
      label: "\u63D2\u5165\u65F6\u5E8F\u56FE",
      icon: "\u{1F4CA}",
      execute: () => this.insertDiagram("sequence")
    });
    commands.register("insertGantt", {
      label: "\u63D2\u5165\u7518\u7279\u56FE",
      icon: "\u{1F4C5}",
      execute: () => this.insertDiagram("gantt")
    });
    commands.register("editDiagram", {
      label: "\u7F16\u8F91\u56FE\u8868",
      icon: "\u270F\uFE0F",
      execute: () => {
        const node = this.getSelectedDiagramNode();
        if (node)
          this.editDiagram(node);
      }
    });
    commands.register("exportDiagram", {
      label: "\u5BFC\u51FA\u56FE\u8868",
      icon: "\u{1F4BE}",
      execute: () => this.exportDiagram()
    });
  }
  /**
   * 注册节点视图
   */
  registerNodeViews() {
    if (!this.editor)
      return;
    const schema = this.editor.schema;
    if (!schema)
      return;
    schema.nodes.diagram = {
      attrs: {
        type: {
          default: "mindmap"
        },
        data: {
          default: null
        },
        width: {
          default: "100%"
        },
        height: {
          default: 400
        }
      },
      content: "text*",
      group: "block",
      draggable: true,
      parseDOM: [{
        tag: "div[data-diagram]",
        getAttrs: (dom) => ({
          type: dom.dataset.diagramType,
          data: JSON.parse(dom.dataset.diagramData || "{}"),
          width: dom.style.width,
          height: dom.style.height
        })
      }],
      toDOM: (node) => ["div", {
        "data-diagram": "true",
        "data-diagram-type": node.attrs.type,
        "data-diagram-data": JSON.stringify(node.attrs.data),
        "style": `width: ${node.attrs.width}; height: ${node.attrs.height}px`,
        "class": "diagram-node"
      }, 0]
    };
  }
  /**
   * 设置事件监听
   */
  setupEventListeners() {
    if (!this.editor)
      return;
    const editor = this.editor;
    editor.on("selectionUpdate", () => {
      const node = this.getSelectedDiagramNode();
      this.toolbar?.updateState(!!node);
    });
    editor.contentElement?.addEventListener("dblclick", (e) => {
      const target = e.target;
      const diagramNode = target.closest(".diagram-node");
      if (diagramNode)
        this.editDiagram(diagramNode);
    });
  }
  /**
   * 插入图表
   */
  async insertDiagram(type, data) {
    logger.info(`Inserting ${type} diagram`);
    const editor = this.editors.get(type);
    if (!editor) {
      logger.error(`Unknown diagram type: ${type}`);
      return;
    }
    this.currentType = type;
    this.currentEditor = editor;
    const result = await this.showEditor(editor, {
      type,
      data: data || this.getDefaultData(type),
      isNew: true
    });
    if (result) {
      const {
        commands
      } = this.context;
      commands.execute("insertNode", {
        type: "diagram",
        attrs: {
          type,
          data: result.data,
          width: result.options?.width || "100%",
          height: result.options?.height || 400
        }
      });
    }
  }
  /**
   * 编辑图表
   */
  async editDiagram(node) {
    const type = node.dataset.diagramType;
    const data = JSON.parse(node.dataset.diagramData || "{}");
    logger.info(`Editing ${type} diagram`);
    const editor = this.editors.get(type);
    if (!editor) {
      logger.error(`Unknown diagram type: ${type}`);
      return;
    }
    this.currentType = type;
    this.currentEditor = editor;
    const result = await this.showEditor(editor, {
      type,
      data,
      isNew: false,
      node
    });
    if (result) {
      node.dataset.diagramData = JSON.stringify(result.data);
      this.renderer?.render(node, type, result.data);
    }
  }
  /**
   * 显示编辑器
   */
  async showEditor(editor, options) {
    const modal = this.createModal();
    document.body.appendChild(modal);
    const container = modal.querySelector(".diagram-editor-content");
    const result = await editor.render(container, {
      data: options.data,
      onSave: (data, opts) => {
        this.closeModal(modal);
        return {
          data,
          options: opts
        };
      },
      onCancel: () => {
        this.closeModal(modal);
        return null;
      }
    });
    return result;
  }
  /**
   * 创建模态框
   */
  createModal() {
    const modal = document.createElement("div");
    modal.className = "diagram-editor-modal";
    modal.style.cssText = `
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
    `;
    modal.innerHTML = `
      <div class="diagram-editor-dialog" style="
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        width: 90%;
        max-width: 1200px;
        height: 80vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      ">
        <div class="diagram-editor-header" style="
          padding: 15px 20px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        ">
          <h3 style="margin: 0; font-size: 18px;">
            ${this.getEditorTitle(this.currentType)}
          </h3>
          <button class="close-btn" style="
            background: transparent;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
          ">\xD7</button>
        </div>
        <div class="diagram-editor-content" style="
          flex: 1;
          overflow: auto;
          padding: 20px;
        "></div>
      </div>
    `;
    modal.addEventListener("click", (e) => {
      if (e.target === modal)
        this.closeModal(modal);
    });
    const closeBtn = modal.querySelector(".close-btn");
    closeBtn?.addEventListener("click", () => {
      this.closeModal(modal);
    });
    return modal;
  }
  /**
   * 关闭模态框
   */
  closeModal(modal) {
    modal.remove();
    this.currentEditor?.destroy?.();
    this.currentEditor = null;
    this.currentType = void 0;
  }
  /**
   * 获取编辑器标题
   */
  getEditorTitle(type) {
    const titles = {
      mindmap: "\u601D\u7EF4\u5BFC\u56FE\u7F16\u8F91\u5668",
      flowchart: "\u6D41\u7A0B\u56FE\u7F16\u8F91\u5668",
      uml: "UML\u56FE\u7F16\u8F91\u5668",
      sequence: "\u65F6\u5E8F\u56FE\u7F16\u8F91\u5668",
      gantt: "\u7518\u7279\u56FE\u7F16\u8F91\u5668"
    };
    return titles[type] || "\u56FE\u8868\u7F16\u8F91\u5668";
  }
  /**
   * 获取默认数据
   */
  getDefaultData(type) {
    switch (type) {
      case "mindmap":
        return {
          root: {
            text: "\u4E2D\u5FC3\u4E3B\u9898",
            children: [{
              text: "\u5206\u652F1",
              children: []
            }, {
              text: "\u5206\u652F2",
              children: []
            }, {
              text: "\u5206\u652F3",
              children: []
            }]
          }
        };
      case "flowchart":
        return {
          nodes: [{
            id: "1",
            type: "start",
            text: "\u5F00\u59CB",
            x: 100,
            y: 50
          }, {
            id: "2",
            type: "process",
            text: "\u5904\u7406",
            x: 100,
            y: 150
          }, {
            id: "3",
            type: "end",
            text: "\u7ED3\u675F",
            x: 100,
            y: 250
          }],
          edges: [{
            from: "1",
            to: "2"
          }, {
            from: "2",
            to: "3"
          }]
        };
      case "uml":
        return {
          classes: [{
            name: "User",
            attributes: ["id: number", "name: string"],
            methods: ["login()", "logout()"]
          }],
          relationships: []
        };
      case "sequence":
        return {
          actors: ["\u7528\u6237", "\u7CFB\u7EDF"],
          messages: [{
            from: "\u7528\u6237",
            to: "\u7CFB\u7EDF",
            text: "\u767B\u5F55\u8BF7\u6C42"
          }, {
            from: "\u7CFB\u7EDF",
            to: "\u7528\u6237",
            text: "\u8FD4\u56DE\u7ED3\u679C"
          }]
        };
      case "gantt":
        return {
          tasks: [{
            name: "\u4EFB\u52A11",
            start: (/* @__PURE__ */ new Date()).toISOString(),
            end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString(),
            progress: 0
          }]
        };
      default:
        return {};
    }
  }
  /**
   * 导出图表
   */
  async exportDiagram() {
    const node = this.getSelectedDiagramNode();
    if (!node)
      return;
    const type = node.dataset.diagramType;
    const data = JSON.parse(node.dataset.diagramData || "{}");
    await this.renderer?.export(node, type, data);
  }
  /**
   * 获取选中的图表节点
   */
  getSelectedDiagramNode() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
      return null;
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
    return element?.closest(".diagram-node") || null;
  }
  /**
   * 销毁插件
   */
  destroy() {
    logger.info("Destroying diagram plugin");
    this.editors.forEach((editor) => editor.destroy?.());
    this.editors.clear();
    this.renderer?.destroy();
    this.toolbar?.destroy();
    if (this.currentEditor)
      this.currentEditor.destroy?.();
    logger.info("Diagram plugin destroyed");
  }
}

export { DiagramPlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=DiagramPlugin.js.map
