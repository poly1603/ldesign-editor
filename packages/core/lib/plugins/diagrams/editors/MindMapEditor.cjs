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

const logger = logger$1.createLogger("MindMapEditor");
class MindMapEditor {
  constructor() {
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
  }
  /**
   * 渲染编辑器
   */
  async render(container, options) {
    logger.info("Rendering mind map editor");
    this.container = container;
    this.data = JSON.parse(JSON.stringify(options.data));
    this.onSave = options.onSave;
    this.onCancel = options.onCancel;
    this.createUI();
    this.renderMindMap();
  }
  /**
   * 创建UI
   */
  createUI() {
    if (!this.container)
      return;
    this.container.innerHTML = `
      <div class="mindmap-editor" style="display: flex; flex-direction: column; height: 100%;">
        <div class="mindmap-toolbar" style="
          padding: 10px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          gap: 10px;
          align-items: center;
        ">
          <button id="addChild" style="
            padding: 6px 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          ">\u2795 \u6DFB\u52A0\u5B50\u8282\u70B9</button>
          
          <button id="addSibling" style="
            padding: 6px 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          ">\u2795 \u6DFB\u52A0\u540C\u7EA7\u8282\u70B9</button>
          
          <button id="deleteNode" style="
            padding: 6px 12px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          ">\u{1F5D1}\uFE0F \u5220\u9664\u8282\u70B9</button>
          
          <div style="flex: 1;"></div>
          
          <button id="zoomIn" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">\u{1F50D}+</button>
          <button id="zoomOut" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">\u{1F50D}-</button>
          <button id="resetZoom" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">\u91CD\u7F6E</button>
        </div>
        
        <div class="mindmap-canvas-container" style="
          flex: 1;
          position: relative;
          overflow: hidden;
          background: #f8f9fa;
        ">
          <canvas id="mindmapCanvas" style="
            position: absolute;
            top: 0;
            left: 0;
            cursor: grab;
          "></canvas>
        </div>
        
        <div class="mindmap-footer" style="
          padding: 15px;
          border-top: 1px solid #e0e0e0;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        ">
          <button id="cancel" style="
            padding: 8px 20px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
          ">\u53D6\u6D88</button>
          
          <button id="save" style="
            padding: 8px 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          ">\u4FDD\u5B58</button>
        </div>
      </div>
    `;
    this.setupCanvas();
    this.bindEvents();
  }
  /**
   * 设置画布
   */
  setupCanvas() {
    const canvas = this.container?.querySelector("#mindmapCanvas");
    if (!canvas)
      return;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    this.offsetX = canvas.width / 2;
    this.offsetY = canvas.height / 2;
  }
  /**
   * 绑定事件
   */
  bindEvents() {
    this.container?.querySelector("#addChild")?.addEventListener("click", () => this.addChildNode());
    this.container?.querySelector("#addSibling")?.addEventListener("click", () => this.addSiblingNode());
    this.container?.querySelector("#deleteNode")?.addEventListener("click", () => this.deleteNode());
    this.container?.querySelector("#zoomIn")?.addEventListener("click", () => this.zoom(1.2));
    this.container?.querySelector("#zoomOut")?.addEventListener("click", () => this.zoom(0.8));
    this.container?.querySelector("#resetZoom")?.addEventListener("click", () => this.resetZoom());
    this.container?.querySelector("#save")?.addEventListener("click", () => {
      if (this.onSave && this.data)
        this.onSave(this.data, {
          width: "100%",
          height: 400
        });
    });
    this.container?.querySelector("#cancel")?.addEventListener("click", () => {
      this.onCancel?.();
    });
    if (this.canvas) {
      this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
      this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
      this.canvas.addEventListener("mouseup", () => this.handleMouseUp());
      this.canvas.addEventListener("wheel", (e) => this.handleWheel(e));
      this.canvas.addEventListener("click", (e) => this.handleClick(e));
      this.canvas.addEventListener("dblclick", (e) => this.handleDoubleClick(e));
    }
  }
  /**
   * 渲染思维导图
   */
  renderMindMap() {
    if (!this.ctx || !this.canvas || !this.data)
      return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.scale(this.scale, this.scale);
    this.renderNode(this.data.root, 0, 0, true);
    this.ctx.restore();
  }
  /**
   * 渲染节点
   */
  renderNode(node, x, y, isRoot = false) {
    if (!this.ctx)
      return {
        width: 0,
        height: 0
      };
    const ctx = this.ctx;
    const padding = 12;
    const fontSize = isRoot ? 18 : 14;
    const borderRadius = 6;
    ctx.font = `${node.style?.fontWeight || "normal"} ${fontSize}px Arial`;
    const textWidth = ctx.measureText(node.text).width;
    const nodeWidth = textWidth + padding * 2;
    const nodeHeight = fontSize + padding * 2;
    const isSelected = this.selectedNode === node;
    ctx.fillStyle = node.style?.backgroundColor || (isRoot ? "#667eea" : isSelected ? "#e8f4f8" : "#ffffff");
    ctx.strokeStyle = isSelected ? "#667eea" : "#e0e0e0";
    ctx.lineWidth = isSelected ? 2 : 1;
    this.roundRect(ctx, x - nodeWidth / 2, y - nodeHeight / 2, nodeWidth, nodeHeight, borderRadius);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = node.style?.color || (isRoot ? "#ffffff" : "#333333");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.text, x, y);
    if (node.children && node.children.length > 0 && !node.collapsed) {
      const childSpacing = 80;
      const levelSpacing = 150;
      const totalHeight = (node.children.length - 1) * childSpacing;
      const startY = y - totalHeight / 2;
      node.children.forEach((child, index) => {
        const childY = startY + index * childSpacing;
        const childX = x + levelSpacing;
        ctx.strokeStyle = "#999999";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + nodeWidth / 2, y);
        ctx.bezierCurveTo(x + levelSpacing / 2, y, x + levelSpacing / 2, childY, childX - nodeWidth / 2, childY);
        ctx.stroke();
        this.renderNode(child, childX, childY, false);
      });
    }
    if (node.children && node.children.length > 0) {
      const indicatorX = x + nodeWidth / 2 + 10;
      const indicatorY = y;
      const indicatorSize = 8;
      ctx.fillStyle = "#667eea";
      ctx.beginPath();
      ctx.arc(indicatorX, indicatorY, indicatorSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.collapsed ? "+" : "-", indicatorX, indicatorY);
    }
    return {
      width: nodeWidth,
      height: nodeHeight
    };
  }
  /**
   * 绘制圆角矩形
   */
  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
  /**
   * 添加子节点
   */
  addChildNode() {
    if (!this.selectedNode) {
      alert("\u8BF7\u5148\u9009\u62E9\u4E00\u4E2A\u8282\u70B9");
      return;
    }
    const text = prompt("\u8F93\u5165\u8282\u70B9\u6587\u672C\uFF1A", "\u65B0\u8282\u70B9");
    if (!text)
      return;
    if (!this.selectedNode.children)
      this.selectedNode.children = [];
    this.selectedNode.children.push({
      text,
      children: []
    });
    this.renderMindMap();
  }
  /**
   * 添加同级节点
   */
  addSiblingNode() {
    if (!this.selectedNode || !this.data) {
      alert("\u8BF7\u5148\u9009\u62E9\u4E00\u4E2A\u8282\u70B9");
      return;
    }
    const text = prompt("\u8F93\u5165\u8282\u70B9\u6587\u672C\uFF1A", "\u65B0\u8282\u70B9");
    if (!text)
      return;
    const parent = this.findParentNode(this.data.root, this.selectedNode);
    if (parent && parent.children) {
      const index = parent.children.indexOf(this.selectedNode);
      parent.children.splice(index + 1, 0, {
        text,
        children: []
      });
      this.renderMindMap();
    }
  }
  /**
   * 删除节点
   */
  deleteNode() {
    if (!this.selectedNode || !this.data) {
      alert("\u8BF7\u5148\u9009\u62E9\u4E00\u4E2A\u8282\u70B9");
      return;
    }
    if (this.selectedNode === this.data.root) {
      alert("\u4E0D\u80FD\u5220\u9664\u6839\u8282\u70B9");
      return;
    }
    if (!confirm("\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u8282\u70B9\u5417\uFF1F"))
      return;
    const parent = this.findParentNode(this.data.root, this.selectedNode);
    if (parent && parent.children) {
      const index = parent.children.indexOf(this.selectedNode);
      parent.children.splice(index, 1);
      this.selectedNode = void 0;
      this.renderMindMap();
    }
  }
  /**
   * 查找父节点
   */
  findParentNode(current, target) {
    if (!current.children)
      return null;
    if (current.children.includes(target))
      return current;
    for (const child of current.children) {
      const parent = this.findParentNode(child, target);
      if (parent)
        return parent;
    }
    return null;
  }
  /**
   * 缩放
   */
  zoom(factor) {
    this.scale *= factor;
    this.scale = Math.max(0.1, Math.min(3, this.scale));
    this.renderMindMap();
  }
  /**
   * 重置缩放
   */
  resetZoom() {
    this.scale = 1;
    this.offsetX = this.canvas.width / 2;
    this.offsetY = this.canvas.height / 2;
    this.renderMindMap();
  }
  /**
   * 处理鼠标按下
   */
  handleMouseDown(e) {
    this.isDragging = true;
    this.dragStartX = e.offsetX;
    this.dragStartY = e.offsetY;
    if (this.canvas)
      this.canvas.style.cursor = "grabbing";
  }
  /**
   * 处理鼠标移动
   */
  handleMouseMove(e) {
    if (!this.isDragging)
      return;
    const dx = e.offsetX - this.dragStartX;
    const dy = e.offsetY - this.dragStartY;
    this.offsetX += dx;
    this.offsetY += dy;
    this.dragStartX = e.offsetX;
    this.dragStartY = e.offsetY;
    this.renderMindMap();
  }
  /**
   * 处理鼠标释放
   */
  handleMouseUp() {
    this.isDragging = false;
    if (this.canvas)
      this.canvas.style.cursor = "grab";
  }
  /**
   * 处理滚轮
   */
  handleWheel(e) {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    this.zoom(factor);
  }
  /**
   * 处理点击
   */
  handleClick(e) {
    if (!this.data)
      return;
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.offsetX) / this.scale;
    const y = (e.clientY - rect.top - this.offsetY) / this.scale;
    const clicked = this.findNodeAtPosition(this.data.root, x, y, 0, 0, true);
    this.selectedNode = clicked || void 0;
    this.renderMindMap();
  }
  /**
   * 处理双击
   */
  handleDoubleClick(e) {
    if (!this.selectedNode)
      return;
    const newText = prompt("\u7F16\u8F91\u8282\u70B9\u6587\u672C\uFF1A", this.selectedNode.text);
    if (newText !== null) {
      this.selectedNode.text = newText;
      this.renderMindMap();
    }
  }
  /**
   * 查找指定位置的节点
   */
  findNodeAtPosition(node, x, y, nodeX, nodeY, isRoot) {
    if (!this.ctx)
      return null;
    const fontSize = isRoot ? 18 : 14;
    const padding = 12;
    this.ctx.font = `${fontSize}px Arial`;
    const textWidth = this.ctx.measureText(node.text).width;
    const nodeWidth = textWidth + padding * 2;
    const nodeHeight = fontSize + padding * 2;
    if (x >= nodeX - nodeWidth / 2 && x <= nodeX + nodeWidth / 2 && y >= nodeY - nodeHeight / 2 && y <= nodeY + nodeHeight / 2)
      return node;
    if (node.children && node.children.length > 0 && !node.collapsed) {
      const childSpacing = 80;
      const levelSpacing = 150;
      const totalHeight = (node.children.length - 1) * childSpacing;
      const startY = nodeY - totalHeight / 2;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const childY = startY + i * childSpacing;
        const childX = nodeX + levelSpacing;
        const found = this.findNodeAtPosition(child, x, y, childX, childY, false);
        if (found)
          return found;
      }
    }
    return null;
  }
  /**
   * 销毁编辑器
   */
  destroy() {
    this.container = void 0;
    this.data = void 0;
    this.selectedNode = void 0;
    this.canvas = void 0;
    this.ctx = void 0;
  }
}

exports.MindMapEditor = MindMapEditor;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=MindMapEditor.cjs.map
