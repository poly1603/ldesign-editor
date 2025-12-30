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

const logger = logger$1.createLogger("DiagramToolbar");
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
    const toolbar = this.editor.toolbar;
    if (!toolbar) {
      logger.warn("No toolbar found");
      return;
    }
    const diagramGroup = document.createElement("div");
    diagramGroup.className = "toolbar-group diagram-group";
    diagramGroup.style.cssText = `
      display: inline-flex;
      gap: 4px;
      margin: 0 8px;
      padding: 0 8px;
      border-left: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;
    `;
    const diagramTypes = [{
      type: "mindmap",
      label: "\u601D\u7EF4\u5BFC\u56FE",
      icon: "\u{1F9E0}"
    }, {
      type: "flowchart",
      label: "\u6D41\u7A0B\u56FE",
      icon: "\u{1F500}"
    }, {
      type: "uml",
      label: "UML\u56FE",
      icon: "\u{1F4D0}"
    }, {
      type: "sequence",
      label: "\u65F6\u5E8F\u56FE",
      icon: "\u{1F4CA}"
    }, {
      type: "gantt",
      label: "\u7518\u7279\u56FE",
      icon: "\u{1F4C5}"
    }];
    diagramTypes.forEach(({
      type,
      label,
      icon
    }) => {
      const button = this.createButton(type, label, icon);
      diagramGroup.appendChild(button);
    });
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
    const button = document.createElement("button");
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
    button.onmouseenter = () => {
      button.style.background = "#f0f0f0";
      button.style.borderColor = "#ddd";
    };
    button.onmouseleave = () => {
      button.style.background = "transparent";
      button.style.borderColor = "transparent";
    };
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
    const buttons = this.container?.querySelectorAll(".diagram-button");
    buttons?.forEach((button) => {
      const htmlButton = button;
      htmlButton.style.opacity = hasDiagram ? "0.5" : "1";
    });
  }
  /**
   * 销毁工具栏
   */
  destroy() {
    this.container?.remove();
    this.container = void 0;
    logger.info("Diagram toolbar destroyed");
  }
}

exports.DiagramToolbar = DiagramToolbar;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=DiagramToolbar.cjs.map
