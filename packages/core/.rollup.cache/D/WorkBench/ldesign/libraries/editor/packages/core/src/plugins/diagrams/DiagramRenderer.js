/**
 * 图表渲染器
 * 负责将图表数据渲染为可视化内容
 */
import { createLogger } from '../../utils/logger';
const logger = createLogger('DiagramRenderer');
export class DiagramRenderer {
    constructor(options) {
        this.editor = options.editor;
    }
    /**
     * 渲染图表
     */
    render(container, type, data, options) {
        logger.info(`Rendering diagram: ${type}`);
        // 清空容器
        container.innerHTML = '';
        // 创建图表预览
        const preview = document.createElement('div');
        preview.className = 'diagram-preview';
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
        // 渲染不同类型的图表
        switch (type) {
            case 'mindmap':
                this.renderMindMapPreview(preview, data);
                break;
            case 'flowchart':
                this.renderFlowchartPreview(preview, data);
                break;
            case 'uml':
                this.renderUMLPreview(preview, data);
                break;
            case 'sequence':
                this.renderSequencePreview(preview, data);
                break;
            case 'gantt':
                this.renderGanttPreview(preview, data);
                break;
            default:
                preview.innerHTML = `<div style="color: #999;">未知图表类型: ${type}</div>`;
        }
        // 添加编辑按钮
        const editBtn = document.createElement('button');
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
        editBtn.innerHTML = '✏️ 编辑';
        editBtn.onclick = () => {
            // 触发编辑事件
            container.dispatchEvent(new CustomEvent('edit-diagram'));
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
        <div style="font-size: 32px; margin-bottom: 10px;">🧠</div>
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">${mindmapData.root.text}</div>
        <div style="font-size: 14px; color: #666;">
          ${mindmapData.root.children?.length || 0} 个分支
        </div>
        <div style="margin-top: 20px; font-size: 12px; color: #999;">
          双击编辑思维导图
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
        <div style="font-size: 32px; margin-bottom: 10px;">🔀</div>
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">流程图</div>
        <div style="font-size: 14px; color: #666;">
          ${flowData.nodes?.length || 0} 个节点, ${flowData.edges?.length || 0} 个连接
        </div>
        <div style="margin-top: 20px; font-size: 12px; color: #999;">
          双击编辑流程图
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
        <div style="font-size: 32px; margin-bottom: 10px;">📐</div>
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">UML类图</div>
        <div style="font-size: 14px; color: #666;">
          ${umlData.classes?.length || 0} 个类, ${umlData.relationships?.length || 0} 个关系
        </div>
        <div style="margin-top: 20px; font-size: 12px; color: #999;">
          双击编辑UML图
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
        <div style="font-size: 32px; margin-bottom: 10px;">📊</div>
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">时序图</div>
        <div style="font-size: 14px; color: #666;">
          ${seqData.actors?.length || 0} 个参与者, ${seqData.messages?.length || 0} 条消息
        </div>
        <div style="margin-top: 20px; font-size: 12px; color: #999;">
          双击编辑时序图
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
        <div style="font-size: 32px; margin-bottom: 10px;">📅</div>
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">甘特图</div>
        <div style="font-size: 14px; color: #666;">
          ${ganttData.tasks?.length || 0} 个任务
        </div>
        <div style="margin-top: 20px; font-size: 12px; color: #999;">
          双击编辑甘特图
        </div>
      </div>
    `;
    }
    /**
     * 导出图表
     */
    async export(container, type, data, format = 'png') {
        logger.info(`Exporting diagram as ${format}`);
        // 简化实现：导出为JSON
        const json = JSON.stringify({ type, data }, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diagram-${type}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        logger.info('Diagram exported successfully');
    }
    /**
     * 销毁渲染器
     */
    destroy() {
        logger.info('Diagram renderer destroyed');
    }
}
//# sourceMappingURL=DiagramRenderer.js.map