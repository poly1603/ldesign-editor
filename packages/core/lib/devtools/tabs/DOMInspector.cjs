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

const logger = logger$1.createLogger("DOMInspector");
class DOMInspector {
  constructor(options) {
    this.expandedNodes = /* @__PURE__ */ new Set();
    this.editor = options.editor;
    this.rootElement = this.editor.getElement();
  }
  /**
   * 渲染标签页
   */
  render() {
    this.container = document.createElement("div");
    this.container.className = "dom-inspector";
    this.container.style.cssText = `
      display: flex;
      height: 100%;
    `;
    const toolbar = this.createToolbar();
    const content = document.createElement("div");
    content.style.cssText = `
      display: flex;
      flex: 1;
      overflow: hidden;
    `;
    this.treeContainer = document.createElement("div");
    this.treeContainer.className = "dom-tree";
    this.treeContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 12px;
      background: #f8f9fa;
    `;
    this.detailsContainer = document.createElement("div");
    this.detailsContainer.className = "dom-details";
    this.detailsContainer.style.cssText = `
      width: 350px;
      border-left: 1px solid #e0e0e0;
      overflow-y: auto;
      background: white;
      display: none;
    `;
    content.appendChild(this.treeContainer);
    content.appendChild(this.detailsContainer);
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      display: flex;
      flex-direction: column;
      height: 100%;
    `;
    wrapper.appendChild(toolbar);
    wrapper.appendChild(content);
    this.container.appendChild(wrapper);
    this.createHighlightOverlay();
    this.renderDOMTree();
    return this.container;
  }
  /**
   * 创建工具栏
   */
  createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.style.cssText = `
      display: flex;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
      gap: 10px;
      flex-shrink: 0;
    `;
    const refreshBtn = document.createElement("button");
    refreshBtn.style.cssText = `
      padding: 4px 8px;
      background: transparent;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `;
    refreshBtn.innerHTML = "\u{1F504} \u5237\u65B0";
    refreshBtn.onclick = () => this.refresh();
    const expandBtn = document.createElement("button");
    expandBtn.style.cssText = refreshBtn.style.cssText;
    expandBtn.innerHTML = "\u{1F4C2} \u5C55\u5F00\u5168\u90E8";
    expandBtn.onclick = () => this.expandAll();
    const collapseBtn = document.createElement("button");
    collapseBtn.style.cssText = refreshBtn.style.cssText;
    collapseBtn.innerHTML = "\u{1F4C1} \u6298\u53E0\u5168\u90E8";
    collapseBtn.onclick = () => this.collapseAll();
    const highlightCheck = document.createElement("label");
    highlightCheck.style.cssText = `
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      margin-left: auto;
    `;
    highlightCheck.innerHTML = `
      <input type="checkbox" id="highlight-mode" checked>
      <span>\u9AD8\u4EAE\u5143\u7D20</span>
    `;
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "\u641C\u7D22\u5143\u7D20...";
    searchInput.style.cssText = `
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 12px;
      width: 200px;
    `;
    searchInput.oninput = (e) => this.searchDOM(e.target.value);
    toolbar.appendChild(refreshBtn);
    toolbar.appendChild(expandBtn);
    toolbar.appendChild(collapseBtn);
    toolbar.appendChild(searchInput);
    toolbar.appendChild(highlightCheck);
    return toolbar;
  }
  /**
   * 创建高亮覆盖层
   */
  createHighlightOverlay() {
    this.highlightOverlay = document.createElement("div");
    this.highlightOverlay.className = "dom-highlight-overlay";
    this.highlightOverlay.style.cssText = `
      position: absolute;
      background: rgba(102, 126, 234, 0.3);
      border: 2px solid #667eea;
      pointer-events: none;
      z-index: 9999;
      display: none;
      transition: all 0.2s;
    `;
    document.body.appendChild(this.highlightOverlay);
  }
  /**
   * 渲染DOM树
   */
  renderDOMTree() {
    if (!this.treeContainer || !this.rootElement)
      return;
    this.treeContainer.innerHTML = "";
    const tree = this.buildDOMTree(this.rootElement, 0);
    const treeElement = this.createTreeElement(tree);
    this.treeContainer.appendChild(treeElement);
  }
  /**
   * 构建DOM树数据
   */
  buildDOMTree(element, depth) {
    const nodeInfo = {
      tagName: element.tagName.toLowerCase(),
      depth
    };
    if (element.id)
      nodeInfo.id = element.id;
    if (element.classList.length > 0)
      nodeInfo.classList = Array.from(element.classList);
    const attributes = {};
    for (const attr of element.attributes)
      attributes[attr.name] = attr.value;
    if (Object.keys(attributes).length > 0)
      nodeInfo.attributes = attributes;
    if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
      const text = element.textContent?.trim();
      if (text && text.length < 50)
        nodeInfo.textContent = text;
    }
    if (element.children.length > 0) {
      nodeInfo.children = Array.from(element.children).map((child) => this.buildDOMTree(child, depth + 1));
    }
    return nodeInfo;
  }
  /**
   * 创建树元素
   */
  createTreeElement(node, parentElement) {
    const container = document.createElement("div");
    container.style.cssText = `
      margin-left: ${node.depth * 20}px;
      position: relative;
    `;
    const row = document.createElement("div");
    row.className = "dom-tree-node";
    row.style.cssText = `
      padding: 4px 8px;
      cursor: pointer;
      border-radius: 4px;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      gap: 4px;
    `;
    if (node.children && node.children.length > 0) {
      const expandIcon = document.createElement("span");
      expandIcon.style.cssText = `
        width: 16px;
        display: inline-block;
        text-align: center;
        user-select: none;
      `;
      expandIcon.textContent = "\u25B6";
      expandIcon.onclick = (e) => {
        e.stopPropagation();
        this.toggleNode(container, expandIcon);
      };
      row.appendChild(expandIcon);
    } else {
      const spacer = document.createElement("span");
      spacer.style.width = "16px";
      spacer.style.display = "inline-block";
      row.appendChild(spacer);
    }
    const tag = document.createElement("span");
    tag.style.cssText = `
      color: #e83e8c;
      font-weight: bold;
    `;
    tag.textContent = `<${node.tagName}`;
    row.appendChild(tag);
    if (node.id) {
      const id = document.createElement("span");
      id.style.cssText = `
        color: #e67e22;
      `;
      id.textContent = ` id="${node.id}"`;
      row.appendChild(id);
    }
    if (node.classList && node.classList.length > 0) {
      const classes = document.createElement("span");
      classes.style.cssText = `
        color: #27ae60;
      `;
      classes.textContent = ` class="${node.classList.join(" ")}"`;
      row.appendChild(classes);
    }
    if (node.attributes) {
      Object.entries(node.attributes).forEach(([name, value]) => {
        if (name !== "id" && name !== "class") {
          const attr = document.createElement("span");
          attr.style.cssText = `
            color: #3498db;
          `;
          attr.textContent = ` ${name}="${value.substring(0, 20)}${value.length > 20 ? "..." : ""}"`;
          row.appendChild(attr);
        }
      });
    }
    const closeTag = document.createElement("span");
    closeTag.style.color = "#e83e8c";
    closeTag.textContent = ">";
    row.appendChild(closeTag);
    if (node.textContent) {
      const text = document.createElement("span");
      text.style.cssText = `
        color: #666;
        font-style: italic;
        margin-left: 8px;
      `;
      text.textContent = node.textContent;
      row.appendChild(text);
    }
    row.onmouseenter = () => {
      row.style.background = "#e8f4f8";
      this.highlightElement(node);
    };
    row.onmouseleave = () => {
      row.style.background = "transparent";
      this.unhighlightElement();
    };
    row.onclick = () => {
      this.selectNode(node);
    };
    container.appendChild(row);
    if (node.children && node.children.length > 0) {
      const childrenContainer = document.createElement("div");
      childrenContainer.className = "dom-tree-children";
      childrenContainer.style.display = "none";
      node.children.forEach((child) => {
        const childElement = this.createTreeElement(child);
        childrenContainer.appendChild(childElement);
      });
      container.appendChild(childrenContainer);
    }
    return container;
  }
  /**
   * 切换节点展开/折叠
   */
  toggleNode(container, icon) {
    const childrenContainer = container.querySelector(".dom-tree-children");
    if (childrenContainer) {
      if (childrenContainer.style.display === "none") {
        childrenContainer.style.display = "block";
        icon.textContent = "\u25BC";
      } else {
        childrenContainer.style.display = "none";
        icon.textContent = "\u25B6";
      }
    }
  }
  /**
   * 高亮元素
   */
  highlightElement(node) {
    const checkbox = document.querySelector("#highlight-mode");
    if (!checkbox?.checked || !this.highlightOverlay)
      return;
    const element = this.findElementByNode(node);
    if (!element)
      return;
    const rect = element.getBoundingClientRect();
    this.highlightOverlay.style.left = `${rect.left + window.scrollX}px`;
    this.highlightOverlay.style.top = `${rect.top + window.scrollY}px`;
    this.highlightOverlay.style.width = `${rect.width}px`;
    this.highlightOverlay.style.height = `${rect.height}px`;
    this.highlightOverlay.style.display = "block";
  }
  /**
   * 取消高亮
   */
  unhighlightElement() {
    if (this.highlightOverlay)
      this.highlightOverlay.style.display = "none";
  }
  /**
   * 根据节点信息查找元素
   */
  findElementByNode(node) {
    if (!this.rootElement)
      return null;
    let selector = node.tagName;
    if (node.id)
      selector += `#${node.id}`;
    if (node.classList && node.classList.length > 0)
      selector += `.${node.classList.join(".")}`;
    return this.rootElement.querySelector(selector);
  }
  /**
   * 选择节点
   */
  selectNode(node) {
    const element = this.findElementByNode(node);
    if (!element)
      return;
    this.selectedNode = element;
    this.showNodeDetails(node, element);
  }
  /**
   * 显示节点详情
   */
  showNodeDetails(node, element) {
    if (!this.detailsContainer)
      return;
    this.detailsContainer.style.display = "block";
    const computed = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    this.detailsContainer.innerHTML = `
      <div style="padding: 20px;">
        <h3 style="margin: 0 0 15px 0; font-size: 14px;">\u5143\u7D20\u8BE6\u60C5</h3>
        
        <!-- \u57FA\u672C\u4FE1\u606F -->
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #666;">\u57FA\u672C\u4FE1\u606F</h4>
          <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px;">
            <div style="margin-bottom: 5px;"><strong>\u6807\u7B7E:</strong> ${node.tagName}</div>
            ${node.id ? `<div style="margin-bottom: 5px;"><strong>ID:</strong> ${node.id}</div>` : ""}
            ${node.classList ? `<div style="margin-bottom: 5px;"><strong>\u7C7B\u540D:</strong> ${node.classList.join(" ")}</div>` : ""}
          </div>
        </div>

        <!-- \u4F4D\u7F6E\u548C\u5927\u5C0F -->
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #666;">\u4F4D\u7F6E\u548C\u5927\u5C0F</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background: #f5f5f5; padding: 8px; border-radius: 4px; font-size: 11px;">
              <strong>\u5BBD\u5EA6:</strong> ${rect.width.toFixed(0)}px
            </div>
            <div style="background: #f5f5f5; padding: 8px; border-radius: 4px; font-size: 11px;">
              <strong>\u9AD8\u5EA6:</strong> ${rect.height.toFixed(0)}px
            </div>
            <div style="background: #f5f5f5; padding: 8px; border-radius: 4px; font-size: 11px;">
              <strong>\u5DE6:</strong> ${rect.left.toFixed(0)}px
            </div>
            <div style="background: #f5f5f5; padding: 8px; border-radius: 4px; font-size: 11px;">
              <strong>\u4E0A:</strong> ${rect.top.toFixed(0)}px
            </div>
          </div>
        </div>

        <!-- \u8BA1\u7B97\u6837\u5F0F -->
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #666;">\u5E38\u7528\u6837\u5F0F</h4>
          <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 11px; max-height: 200px; overflow-y: auto;">
            <div><strong>display:</strong> ${computed.display}</div>
            <div><strong>position:</strong> ${computed.position}</div>
            <div><strong>color:</strong> ${computed.color}</div>
            <div><strong>background:</strong> ${computed.background}</div>
            <div><strong>font-size:</strong> ${computed.fontSize}</div>
            <div><strong>padding:</strong> ${computed.padding}</div>
            <div><strong>margin:</strong> ${computed.margin}</div>
            <div><strong>border:</strong> ${computed.border}</div>
          </div>
        </div>

        <!-- \u5C5E\u6027 -->
        ${node.attributes && Object.keys(node.attributes).length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #666;">\u5C5E\u6027</h4>
            <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 11px;">
              ${Object.entries(node.attributes).map(([key, value]) => `<div style="margin-bottom: 5px;"><strong>${key}:</strong> ${value}</div>`).join("")}
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }
  /**
   * 搜索DOM
   */
  searchDOM(query) {
    if (!query) {
      this.renderDOMTree();
      return;
    }
    const nodes = this.treeContainer?.querySelectorAll(".dom-tree-node");
    nodes?.forEach((node) => {
      const text = node.textContent?.toLowerCase() || "";
      if (text.includes(query.toLowerCase()))
        node.style.background = "#fff3cd";
      else
        node.style.background = "transparent";
    });
  }
  /**
   * 展开全部
   */
  expandAll() {
    const childrenContainers = this.treeContainer?.querySelectorAll(".dom-tree-children");
    childrenContainers?.forEach((container) => {
      container.style.display = "block";
    });
    const icons = this.treeContainer?.querySelectorAll(".dom-tree-node span:first-child");
    icons?.forEach((icon) => {
      if (icon.textContent === "\u25B6")
        icon.textContent = "\u25BC";
    });
  }
  /**
   * 折叠全部
   */
  collapseAll() {
    const childrenContainers = this.treeContainer?.querySelectorAll(".dom-tree-children");
    childrenContainers?.forEach((container) => {
      container.style.display = "none";
    });
    const icons = this.treeContainer?.querySelectorAll(".dom-tree-node span:first-child");
    icons?.forEach((icon) => {
      if (icon.textContent === "\u25BC")
        icon.textContent = "\u25B6";
    });
  }
  /**
   * 刷新
   */
  refresh() {
    this.renderDOMTree();
    logger.info("DOM tree refreshed");
  }
  /**
   * 激活标签页
   */
  activate() {
    this.refresh();
  }
  /**
   * 停用标签页
   */
  deactivate() {
    this.unhighlightElement();
  }
  /**
   * 销毁
   */
  destroy() {
    this.highlightOverlay?.remove();
    this.container = void 0;
  }
}

exports.DOMInspector = DOMInspector;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=DOMInspector.cjs.map
