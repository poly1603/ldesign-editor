/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { EventEmitter } from '../../utils/event.js';
import { createLogger } from '../../utils/logger.js';

const logger = createLogger("MobileToolbar");
class MobileToolbar extends EventEmitter {
  constructor(options) {
    super();
    this.moreMenu = null;
    this.items = /* @__PURE__ */ new Map();
    this.isVisible = true;
    this.isCompact = false;
    this.lastScrollY = 0;
    this.container = options.container;
    this.editor = options.editor;
    this.options = {
      items: [],
      height: "50px",
      backgroundColor: "#ffffff",
      activeColor: "#2196F3",
      autoHide: true,
      ...options
    };
    this.createToolbar();
    this.setupEventListeners();
    this.updateActiveStates();
  }
  /**
   * 创建工具栏DOM
   */
  createToolbar() {
    this.toolbarElement = document.createElement("div");
    this.toolbarElement.className = "mobile-toolbar";
    this.toolbarElement.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: ${this.options.height};
      background: ${this.options.backgroundColor};
      border-top: 1px solid #e0e0e0;
      z-index: 1000;
      display: flex;
      align-items: center;
      padding: 0 10px;
      transform: translateY(0);
      transition: transform 0.3s ease-out;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
    `;
    this.toolbarElement.style.paddingBottom = "env(safe-area-inset-bottom, 0)";
    this.itemsContainer = document.createElement("div");
    this.itemsContainer.className = "toolbar-items";
    this.itemsContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 5px;
      flex: 1;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    `;
    this.itemsContainer.style.msOverflowStyle = "none";
    this.itemsContainer.style.setProperty("::-webkit-scrollbar", "display: none");
    this.renderItems();
    this.toolbarElement.appendChild(this.itemsContainer);
    document.body.appendChild(this.toolbarElement);
  }
  /**
   * 渲染工具栏项
   */
  renderItems() {
    this.itemsContainer.innerHTML = "";
    this.items.clear();
    const itemsToRender = this.isCompact ? this.options.items.filter((item) => ["bold", "italic", "undo", "redo", "more"].includes(item.id)) : this.options.items;
    itemsToRender.forEach((item) => {
      if (item.type === "separator") {
        this.itemsContainer.appendChild(this.createSeparator());
      } else {
        const element = this.createToolbarItem(item);
        this.itemsContainer.appendChild(element);
        this.items.set(item.id, {
          ...item,
          element
        });
      }
    });
  }
  /**
   * 创建工具栏项
   */
  createToolbarItem(item) {
    const button = document.createElement("button");
    button.className = `toolbar-item toolbar-item-${item.id}`;
    button.style.cssText = `
      min-width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      color: ${item.disabled ? "#999" : "#333"};
      font-size: 18px;
      font-weight: bold;
      border-radius: 8px;
      cursor: ${item.disabled ? "not-allowed" : "pointer"};
      transition: background-color 0.2s, transform 0.1s;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      flex-shrink: 0;
    `;
    if (item.active) {
      button.style.backgroundColor = `${this.options.activeColor}20`;
      button.style.color = this.options.activeColor;
    }
    button.innerHTML = item.icon;
    button.title = item.title;
    button.disabled = item.disabled || false;
    if (!item.disabled) {
      button.addEventListener("touchstart", () => {
        button.style.transform = "scale(0.95)";
        button.style.backgroundColor = "#f0f0f0";
      });
      button.addEventListener("touchend", () => {
        button.style.transform = "scale(1)";
        button.style.backgroundColor = item.active ? `${this.options.activeColor}20` : "transparent";
      });
      button.addEventListener("click", () => {
        this.handleItemClick(item);
      });
    }
    return button;
  }
  /**
   * 创建分隔线
   */
  createSeparator() {
    const separator = document.createElement("div");
    separator.className = "toolbar-separator";
    separator.style.cssText = `
      width: 1px;
      height: 24px;
      background: #e0e0e0;
      margin: 0 5px;
      flex-shrink: 0;
    `;
    return separator;
  }
  /**
   * 处理工具栏项点击
   */
  handleItemClick(item) {
    logger.info("Toolbar item clicked:", item.id);
    if (item.id === "more") {
      this.showMoreMenu();
      return;
    }
    if (item.action)
      item.action(this.editor);
    else
      this.executeCommand(item.id);
    this.updateActiveStates();
    this.emit("itemclick", item);
  }
  /**
   * 执行编辑器命令
   */
  executeCommand(command) {
    switch (command) {
      case "bold":
        this.editor.toggleBold();
        break;
      case "italic":
        this.editor.toggleItalic();
        break;
      case "underline":
        this.editor.toggleUnderline();
        break;
      case "undo":
        this.editor.undo();
        break;
      case "redo":
        this.editor.redo();
        break;
      case "image":
        this.showImagePicker();
        break;
      case "link":
        this.showLinkDialog();
        break;
      default:
        logger.warn("Unknown command:", command);
    }
  }
  /**
   * 显示更多菜单
   */
  showMoreMenu() {
    if (this.moreMenu) {
      this.hideMoreMenu();
      return;
    }
    this.moreMenu = document.createElement("div");
    this.moreMenu.className = "toolbar-more-menu";
    this.moreMenu.style.cssText = `
      position: fixed;
      bottom: ${Number.parseInt(this.options.height) + 10}px;
      right: 10px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.2);
      padding: 10px;
      z-index: 1001;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      min-width: 200px;
      animation: slideUp 0.2s ease-out;
    `;
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    const extraItems = [{
      id: "strikethrough",
      icon: "S\u0336",
      title: "\u5220\u9664\u7EBF"
    }, {
      id: "code",
      icon: "<>",
      title: "\u4EE3\u7801"
    }, {
      id: "quote",
      icon: '"',
      title: "\u5F15\u7528"
    }, {
      id: "list",
      icon: "\u2630",
      title: "\u5217\u8868"
    }, {
      id: "heading",
      icon: "H",
      title: "\u6807\u9898"
    }, {
      id: "table",
      icon: "\u229E",
      title: "\u8868\u683C"
    }, {
      id: "emoji",
      icon: "\u{1F60A}",
      title: "\u8868\u60C5"
    }, {
      id: "color",
      icon: "\u{1F3A8}",
      title: "\u989C\u8272"
    }];
    extraItems.forEach((item) => {
      const button = document.createElement("button");
      button.style.cssText = `
        width: 40px;
        height: 40px;
        border: none;
        background: #f5f5f5;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.2s;
      `;
      button.innerHTML = item.icon;
      button.title = item.title;
      button.addEventListener("click", () => {
        this.executeCommand(item.id);
        this.hideMoreMenu();
      });
      this.moreMenu.appendChild(button);
    });
    document.body.appendChild(this.moreMenu);
    setTimeout(() => {
      document.addEventListener("click", this.hideMoreMenu.bind(this), {
        once: true
      });
    }, 100);
  }
  /**
   * 隐藏更多菜单
   */
  hideMoreMenu() {
    if (this.moreMenu) {
      this.moreMenu.remove();
      this.moreMenu = null;
    }
  }
  /**
   * 显示图片选择器
   */
  showImagePicker() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e2) => {
          const url = e2.target?.result;
          this.editor.insertImage(url);
        };
        reader.readAsDataURL(file);
      }
    });
    input.click();
  }
  /**
   * 显示链接对话框
   */
  showLinkDialog() {
    const url = prompt("\u8BF7\u8F93\u5165\u94FE\u63A5\u5730\u5740:");
    if (url) {
      const text = prompt("\u8BF7\u8F93\u5165\u94FE\u63A5\u6587\u5B57:") || url;
      this.editor.insertLink(url, text);
    }
  }
  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    this.editor.on("selectionchange", () => {
      this.updateActiveStates();
    });
    if (this.options.autoHide) {
      let scrollTimeout;
      window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
          this.hide();
        } else {
          this.show();
        }
        this.lastScrollY = currentScrollY;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          this.show();
        }, 500);
      }, {
        passive: true
      });
    }
  }
  /**
   * 更新活动状态
   */
  updateActiveStates() {
    this.setItemActive("bold", document.queryCommandState("bold"));
    this.setItemActive("italic", document.queryCommandState("italic"));
    this.setItemActive("underline", document.queryCommandState("underline"));
    this.setItemEnabled("undo", this.editor.canUndo());
    this.setItemEnabled("redo", this.editor.canRedo());
  }
  /**
   * 设置项目激活状态
   */
  setItemActive(id, active) {
    const item = this.items.get(id);
    if (item) {
      item.active = active;
      const element = item.element;
      if (active) {
        element.style.backgroundColor = `${this.options.activeColor}20`;
        element.style.color = this.options.activeColor;
      } else {
        element.style.backgroundColor = "transparent";
        element.style.color = "#333";
      }
    }
  }
  /**
   * 设置项目启用状态
   */
  setItemEnabled(id, enabled) {
    const item = this.items.get(id);
    if (item) {
      item.disabled = !enabled;
      const element = item.element;
      element.disabled = !enabled;
      element.style.color = enabled ? "#333" : "#999";
      element.style.cursor = enabled ? "pointer" : "not-allowed";
    }
  }
  /**
   * 设置紧凑模式
   */
  setCompactMode(compact) {
    if (this.isCompact !== compact) {
      this.isCompact = compact;
      this.renderItems();
      logger.info("Compact mode:", compact);
    }
  }
  /**
   * 显示工具栏
   */
  show() {
    if (!this.isVisible) {
      this.isVisible = true;
      this.toolbarElement.style.transform = "translateY(0)";
      this.emit("show");
    }
  }
  /**
   * 隐藏工具栏
   */
  hide() {
    if (this.isVisible) {
      this.isVisible = false;
      this.toolbarElement.style.transform = "translateY(calc(100% + env(safe-area-inset-bottom, 0)))";
      this.emit("hide");
    }
  }
  /**
   * 切换显示状态
   */
  toggle() {
    if (this.isVisible)
      this.hide();
    else
      this.show();
  }
  /**
   * 获取显示状态
   */
  getVisible() {
    return this.isVisible;
  }
  /**
   * 销毁工具栏
   */
  destroy() {
    this.hideMoreMenu();
    this.toolbarElement.remove();
    this.removeAllListeners();
  }
}

export { MobileToolbar };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=MobileToolbar.js.map
