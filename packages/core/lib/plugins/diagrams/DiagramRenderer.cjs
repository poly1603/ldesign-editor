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

var logger$1 = require('../../utils/logger.cjs');

const logger = logger$1.createLogger("DiagramRenderer");
class DiagramRenderer {
  constructor(options) {
    this.editor = options.editor;
  }
  /**
   * 渲染图表
   */
  render(container, type, data, options) {
    logger.info(`Rendering diagram: ${type}`);
    container.innerHTML = "";
    const preview = document.createElement("div");
    preview.className = "diagram-preview";
    preview.style.cssText = `
      width: 100%;
      height: ${options?.height || 400}px;
      background: #f8f9fa;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;
    `;
    switch (type) {
      case "mindmap":
        this.renderMindMapPreview(preview, data);
        break;
      case "flowchart":
        this.renderFlowchartPreview(preview, data);
        break;
      case "uml":
        this.renderUMLPreview(preview, data);
        break;
      case "sequence":
        this.renderSequencePreview(preview, data);
        break;
      case "gantt":
        this.renderGanttPreview(preview, data);
        break;
      default:
        preview.innerHTML = `<div style="color: #999;">\u672A\u77E5\u56FE\u8868\u7C7B\u578B: ${type}</div>`;
    }
    const editBtn = document.createElement("button");
    editBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 6px 12px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      z-index: 10;
    `;
    editBtn.innerHTML = "\u270F\uFE0F \u7F16\u8F91";
    editBtn.onclick = () => {
      container.dispatchEvent(new CustomEvent("edit-diagram"));
    };
    preview.appendChild(editBtn);
    container.appendChild(preview);
  }
  /**
   * 渲染思维导图预览
   */
  renderMindMapPreview(container, data) {
    const mindmapData = data;
    if (!mindmapData.root)
      return;
    container.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 32px; margin-bottom: 10px;">\u{1F9E0}</div>
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">${mindmapData.root.text}</div>
        <div style="font-size: 14px; color: #666;">
          ${mindmapData.root.children?.length || 0} \u4E2A\u5206\u652F
        </div>
        <div style="margin-top: 20px; font-size: 12px; color: #999;">
          \u53CC\u51FB\u7F16\u8F91\u601D\u7EF4\u5BFC\u56FE
        </div>
      </div>
    `;
  }
  /**
   * 渲染流程图预览
   */
  renderFlowchartPreview(container, data) {
    const flowData = data;
    container.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 32px; margin-bottom: 10px;">\u{1F500}</div>
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">\u6D41\u7A0B\u56FE</div>
        <div style="font-size: 14px; color: #666;">
          ${flowData.nodes?.length || 0} \u4E2A\u8282\u70B9, ${flowData.edges?.length || 0} \u4E2A\u8FDE\u63A5
        </div>
        <div style="margin-top: 20px; font-size: 12px; color: #999;">
          \u53CC\u51FB\u7F16\u8F91\u6D41\u7A0B\u56FE
        </div>
      </div>
    `;
  }
  /**
   * 渲染UML预览
   */
  renderUMLPreview(container, data) {
    const umlData = data;
    container.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 32px; margin-bottom: 10px;">\u{1F4D0}</div>
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">UML\u7C7B\u56FE</div>
        <div style="font-size: 14px; color: #666;">
          ${umlData.classes?.length || 0} \u4E2A\u7C7B, ${umlData.relationships?.length || 0} \u4E2A\u5173\u7CFB
        </div>
        <div style="margin-top: 20px; font-size: 12px; color: #999;">
          \u53CC\u51FB\u7F16\u8F91UML\u56FE
        </div>
      </div>
    `;
  }
  /**
   * 渲染时序图预览
   */
  renderSequencePreview(container, data) {
    const seqData = data;
    container.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 32px; margin-bottom: 10px;">\u{1F4CA}</div>
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">\u65F6\u5E8F\u56FE</div>
        <div style="font-size: 14px; color: #666;">
          ${seqData.actors?.length || 0} \u4E2A\u53C2\u4E0E\u8005, ${seqData.messages?.length || 0} \u6761\u6D88\u606F
        </div>
        <div style="margin-top: 20px; font-size: 12px; color: #999;">
          \u53CC\u51FB\u7F16\u8F91\u65F6\u5E8F\u56FE
        </div>
      </div>
    `;
  }
  /**
   * 渲染甘特图预览
   */
  renderGanttPreview(container, data) {
    const ganttData = data;
    container.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 32px; margin-bottom: 10px;">\u{1F4C5}</div>
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">\u7518\u7279\u56FE</div>
        <div style="font-size: 14px; color: #666;">
          ${ganttData.tasks?.length || 0} \u4E2A\u4EFB\u52A1
        </div>
        <div style="margin-top: 20px; font-size: 12px; color: #999;">
          \u53CC\u51FB\u7F16\u8F91\u7518\u7279\u56FE
        </div>
      </div>
    `;
  }
  /**
   * 导出图表
   */
  async export(container, type, data, format = "png") {
    logger.info(`Exporting diagram as ${format}`);
    const json = JSON.stringify({
      type,
      data
    }, null, 2);
    const blob = new Blob([json], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diagram-${type}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logger.info("Diagram exported successfully");
  }
  /**
   * 销毁渲染器
   */
  destroy() {
    logger.info("Diagram renderer destroyed");
  }
}

exports.DiagramRenderer = DiagramRenderer;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=DiagramRenderer.cjs.map
