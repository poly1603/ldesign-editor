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

var event = require('../../utils/event.cjs');
var logger$1 = require('../../utils/logger.cjs');

const logger = logger$1.createLogger("SwipeMenu");
class SwipeMenu extends event.EventEmitter {
  constructor(options) {
    super();
    this.isOpen_ = false;
    this.startX = 0;
    this.currentX = 0;
    this.isDragging = false;
    this.container = options.container;
    this.options = {
      items: [],
      width: "80%",
      backgroundColor: "#ffffff",
      textColor: "#333333",
      activeColor: "#2196F3",
      ...options
    };
    this.createMenu();
    this.setupEventListeners();
  }
  /**
   * 创建菜单DOM
   */
  createMenu() {
    this.overlayElement = document.createElement("div");
    this.overlayElement.className = "swipe-menu-overlay";
    this.overlayElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 998;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
    `;
    this.menuElement = document.createElement("div");
    this.menuElement.className = "swipe-menu";
    this.menuElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: ${this.options.width};
      height: 100%;
      background: ${this.options.backgroundColor};
      z-index: 999;
      transform: translateX(-100%);
      transition: transform 0.3s ease-out;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      box-shadow: 2px 0 8px rgba(0,0,0,0.15);
    `;
    const header = document.createElement("div");
    header.className = "swipe-menu-header";
    header.style.cssText = `
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      min-height: 120px;
    `;
    const logo = document.createElement("div");
    logo.style.cssText = `
      width: 50px;
      height: 50px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #667eea;
      margin-right: 15px;
    `;
    logo.textContent = "\u270F\uFE0F";
    const title = document.createElement("div");
    title.innerHTML = `
      <h3 style="margin: 0; font-size: 20px;">LDesign Editor</h3>
      <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">\u79FB\u52A8\u7248</p>
    `;
    header.appendChild(logo);
    header.appendChild(title);
    this.menuElement.appendChild(header);
    const itemsContainer = document.createElement("div");
    itemsContainer.className = "swipe-menu-items";
    itemsContainer.style.cssText = `
      padding: 10px 0;
    `;
    this.options.items.forEach((item) => {
      itemsContainer.appendChild(this.createMenuItem(item));
    });
    this.menuElement.appendChild(itemsContainer);
    document.body.appendChild(this.overlayElement);
    document.body.appendChild(this.menuElement);
  }
  /**
   * 创建菜单项
   */
  createMenuItem(item, level = 0) {
    const menuItem = document.createElement("div");
    menuItem.className = "swipe-menu-item";
    menuItem.style.cssText = `
      display: flex;
      align-items: center;
      padding: 15px 20px;
      padding-left: ${20 + level * 20}px;
      color: ${item.disabled ? "#999" : this.options.textColor};
      cursor: ${item.disabled ? "not-allowed" : "pointer"};
      transition: background-color 0.2s;
      position: relative;
    `;
    if (!item.disabled) {
      menuItem.addEventListener("mouseenter", () => {
        menuItem.style.backgroundColor = "#f5f5f5";
      });
      menuItem.addEventListener("mouseleave", () => {
        menuItem.style.backgroundColor = "transparent";
      });
      menuItem.addEventListener("click", () => {
        if (item.action) {
          item.action();
          this.close();
        }
        this.emit("itemclick", item);
      });
    }
    if (item.icon) {
      const icon = document.createElement("span");
      icon.className = "swipe-menu-item-icon";
      icon.style.cssText = `
        margin-right: 15px;
        font-size: 20px;
        width: 24px;
        text-align: center;
      `;
      icon.textContent = item.icon;
      menuItem.appendChild(icon);
    }
    const label = document.createElement("span");
    label.className = "swipe-menu-item-label";
    label.style.cssText = `
      flex: 1;
      font-size: 16px;
    `;
    label.textContent = item.label;
    menuItem.appendChild(label);
    if (item.children && item.children.length > 0) {
      const arrow2 = document.createElement("span");
      arrow2.className = "swipe-menu-item-arrow";
      arrow2.style.cssText = `
        color: #999;
        font-size: 12px;
      `;
      arrow2.textContent = "\u25B6";
      menuItem.appendChild(arrow2);
    }
    const container = document.createElement("div");
    container.appendChild(menuItem);
    if (item.children && item.children.length > 0) {
      const submenu = document.createElement("div");
      submenu.className = "swipe-menu-submenu";
      submenu.style.cssText = `
        display: none;
        background: #fafafa;
      `;
      item.children.forEach((child) => {
        submenu.appendChild(this.createMenuItem(child, level + 1));
      });
      container.appendChild(submenu);
      menuItem.addEventListener("click", (e) => {
        e.stopPropagation();
        const isExpanded = submenu.style.display === "block";
        submenu.style.display = isExpanded ? "none" : "block";
        arrow.style.transform = isExpanded ? "rotate(0deg)" : "rotate(90deg)";
      });
    }
    return container;
  }
  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    this.overlayElement.addEventListener("click", () => {
      this.close();
    });
    let touchStartX = 0;
    let menuStartX = 0;
    let isSwiping = false;
    document.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      if (touch.pageX < 20 && !this.isOpen_) {
        touchStartX = touch.pageX;
        menuStartX = -this.menuElement.offsetWidth;
        isSwiping = true;
        this.menuElement.style.transition = "none";
      } else if (this.isOpen_) {
        touchStartX = touch.pageX;
        menuStartX = 0;
        isSwiping = true;
        this.menuElement.style.transition = "none";
      }
    });
    document.addEventListener("touchmove", (e) => {
      if (!isSwiping)
        return;
      const touch = e.touches[0];
      const deltaX = touch.pageX - touchStartX;
      let newX = menuStartX + deltaX;
      const maxX = 0;
      const minX = -this.menuElement.offsetWidth;
      newX = Math.max(minX, Math.min(maxX, newX));
      this.menuElement.style.transform = `translateX(${newX}px)`;
      const progress = Math.abs(newX / this.menuElement.offsetWidth);
      this.overlayElement.style.opacity = String(1 - progress * 0.5);
      this.overlayElement.style.visibility = "visible";
      e.preventDefault();
    });
    document.addEventListener("touchend", (e) => {
      if (!isSwiping)
        return;
      isSwiping = false;
      this.menuElement.style.transition = "transform 0.3s ease-out";
      const currentTransform = this.menuElement.style.transform;
      const match = currentTransform.match(/translateX\(([-\d.]+)px\)/);
      const currentX = match ? Number.parseFloat(match[1]) : 0;
      if (currentX > -this.menuElement.offsetWidth * 0.5)
        this.open();
      else
        this.close();
    });
  }
  /**
   * 打开菜单
   */
  open() {
    if (this.isOpen_)
      return;
    this.isOpen_ = true;
    this.menuElement.style.transform = "translateX(0)";
    this.overlayElement.style.opacity = "1";
    this.overlayElement.style.visibility = "visible";
    this.emit("open");
    logger.info("Menu opened");
  }
  /**
   * 关闭菜单
   */
  close() {
    if (!this.isOpen_)
      return;
    this.isOpen_ = false;
    this.menuElement.style.transform = "translateX(-100%)";
    this.overlayElement.style.opacity = "0";
    this.overlayElement.style.visibility = "hidden";
    this.emit("close");
    logger.info("Menu closed");
  }
  /**
   * 切换菜单
   */
  toggle() {
    if (this.isOpen_)
      this.close();
    else
      this.open();
  }
  /**
   * 检查菜单是否打开
   */
  isOpen() {
    return this.isOpen_;
  }
  /**
   * 更新菜单项
   */
  updateItems(items) {
    this.options.items = items;
    const itemsContainer = this.menuElement.querySelector(".swipe-menu-items");
    if (itemsContainer) {
      itemsContainer.innerHTML = "";
      items.forEach((item) => {
        itemsContainer.appendChild(this.createMenuItem(item));
      });
    }
  }
  /**
   * 设置菜单项启用/禁用状态
   */
  setItemEnabled(label, enabled) {
    const items = this.menuElement.querySelectorAll(".swipe-menu-item");
    items.forEach((item) => {
      const labelElement = item.querySelector(".swipe-menu-item-label");
      if (labelElement && labelElement.textContent === label) {
        const menuItem = item;
        menuItem.style.color = enabled ? this.options.textColor : "#999";
        menuItem.style.cursor = enabled ? "pointer" : "not-allowed";
        menuItem.style.pointerEvents = enabled ? "auto" : "none";
      }
    });
  }
  /**
   * 销毁菜单
   */
  destroy() {
    this.menuElement.remove();
    this.overlayElement.remove();
    this.removeAllListeners();
  }
}

exports.SwipeMenu = SwipeMenu;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=SwipeMenu.cjs.map
