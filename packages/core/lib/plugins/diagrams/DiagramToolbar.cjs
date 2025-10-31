/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var logger$1 = require('../../utils/logger.cjs');

/**
 * 图表工具栏
 * 提供图表插入和编辑的快捷操作
 */
const logger = logger$1.createLogger('DiagramToolbar');
class DiagramToolbar {
    constructor(options) {
        this.editor = options.editor;
        this.onInsertDiagram = options.onInsertDiagram;
        this.onEditDiagram = options.onEditDiagram;
        this.createToolbar();
    }
    /**
     * 创建工具栏
     */
    createToolbar() {
        // 查找或创建工具栏容器
        const toolbar = this.editor.toolbar;
        if (!toolbar) {
            logger.warn('No toolbar found');
            return;
        }
        // 创建图表按钮组
        const diagramGroup = document.createElement('div');
        diagramGroup.className = 'toolbar-group diagram-group';
        diagramGroup.style.cssText = `
      display: inline-flex;
      gap: 4px;
      margin: 0 8px;
      padding: 0 8px;
      border-left: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;
    `;
        // 图表类型
        const diagramTypes = [
            { type: 'mindmap', label: '思维导图', icon: '🧠' },
            { type: 'flowchart', label: '流程图', icon: '🔀' },
            { type: 'uml', label: 'UML图', icon: '📐' },
            { type: 'sequence', label: '时序图', icon: '📊' },
            { type: 'gantt', label: '甘特图', icon: '📅' },
        ];
        diagramTypes.forEach(({ type, label, icon }) => {
            const button = this.createButton(type, label, icon);
            diagramGroup.appendChild(button);
        });
        // 将按钮组添加到工具栏
        const toolbarElement = toolbar.element || toolbar.container;
        if (toolbarElement) {
            toolbarElement.appendChild(diagramGroup);
            this.container = diagramGroup;
        }
    }
    /**
     * 创建按钮
     */
    createButton(type, label, icon) {
        const button = document.createElement('button');
        button.className = `toolbar-button diagram-button diagram-button-${type}`;
        button.title = label;
        button.style.cssText = `
      padding: 6px 10px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    `;
        button.innerHTML = icon;
        // 悬停效果
        button.onmouseenter = () => {
            button.style.background = '#f0f0f0';
            button.style.borderColor = '#ddd';
        };
        button.onmouseleave = () => {
            button.style.background = 'transparent';
            button.style.borderColor = 'transparent';
        };
        // 点击事件
        button.onclick = () => {
            logger.info(`Insert diagram: ${type}`);
            this.onInsertDiagram(type);
        };
        return button;
    }
    /**
     * 更新状态
     */
    updateState(hasDiagram) {
        // 可以根据状态更新工具栏按钮的启用/禁用状态
        const buttons = this.container?.querySelectorAll('.diagram-button');
        buttons?.forEach((button) => {
            const htmlButton = button;
            htmlButton.style.opacity = hasDiagram ? '0.5' : '1';
        });
    }
    /**
     * 销毁工具栏
     */
    destroy() {
        this.container?.remove();
        this.container = undefined;
        logger.info('Diagram toolbar destroyed');
    }
}

exports.DiagramToolbar = DiagramToolbar;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=DiagramToolbar.cjs.map
