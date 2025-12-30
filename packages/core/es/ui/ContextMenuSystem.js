/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { getLucideIcon } from './icons/lucide.js';

class ContextMenuSystem {
  constructor(options) {
    this.visible = false;
    this.submenuMap = /* @__PURE__ */ new Map();
    this.activeSubmenus = [];
    this.hideTimeouts = /* @__PURE__ */ new Map();
    this.options = {
      theme: "light",
      animation: true,
      maxHeight: window.innerHeight * 0.7,
      minWidth: 200,
      zIndex: 1e4,
      ...options
    };
    this.container = this.createContainer();
    this.attachEventListeners();
  }
  createContainer() {
    const container = document.createElement("div");
    container.className = `context-menu-system context-menu-${this.options.theme}`;
    container.style.cssText = `
      position: fixed;
      display: none;
      z-index: ${this.options.zIndex};
      min-width: ${this.options.minWidth}px;
      max-height: ${this.options.maxHeight}px;
      overflow-y: auto;
      background: var(--menu-bg, #ffffff);
      border: 1px solid var(--menu-border, #e5e7eb);
      border-radius: 8px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      padding: 4px;
      font-size: 14px;
      color: var(--menu-text, #374151);
      user-select: none;
      backdrop-filter: blur(10px);
      ${this.options.animation ? "transition: opacity 0.15s, transform 0.15s;" : ""}
    `;
    document.body.appendChild(container);
    return container;
  }
  attachEventListeners() {
    document.addEventListener("mousedown", (e) => {
      if (!this.visible)
        return;
      const target = e.target;
      if (!this.container.contains(target) && !Array.from(this.submenuMap.values()).some((submenu) => submenu.contains(target)))
        this.hide();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.visible)
        this.hide();
    });
    let scrollTimeout = null;
    document.addEventListener("scroll", (e) => {
      if (!this.visible)
        return;
      const target = e.target;
      if (this.container.contains(target) || Array.from(this.submenuMap.values()).some((submenu) => submenu.contains(target)))
        return;
      if (scrollTimeout)
        clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        if (this.visible) {
          const rect = this.container.getBoundingClientRect();
          if (rect.top >= -rect.height && rect.bottom <= window.innerHeight + rect.height)
            return;
          this.hide();
        }
      }, 300);
    }, true);
    window.addEventListener("resize", () => {
      if (this.visible)
        this.hide();
    });
  }
  show(x, y, context) {
    if (this.visible)
      this.hide();
    if (context !== void 0)
      this.options.context = context;
    this.options.onBeforeShow?.(this);
    this.render();
    this.container.style.display = "block";
    if (this.options.animation) {
      this.container.style.opacity = "0";
      this.container.style.transform = "scale(0.95)";
    }
    requestAnimationFrame(() => {
      const rect = this.container.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const padding = 10;
      let posX = x;
      let posY = y;
      if (x + rect.width + padding > windowWidth)
        posX = Math.max(padding, x - rect.width);
      if (y + rect.height + padding > windowHeight)
        posY = Math.max(padding, windowHeight - rect.height - padding);
      this.container.style.left = `${posX}px`;
      this.container.style.top = `${posY}px`;
      if (this.options.animation) {
        this.container.style.opacity = "1";
        this.container.style.transform = "scale(1)";
      }
      this.visible = true;
      this.options.onAfterShow?.(this);
    });
  }
  hide() {
    if (!this.visible)
      return;
    this.options.onBeforeHide?.(this);
    this.cleanupSubmenus();
    if (this.options.animation) {
      this.container.style.opacity = "0";
      this.container.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.container.style.display = "none";
        this.container.innerHTML = "";
      }, 150);
    } else {
      this.container.style.display = "none";
      this.container.innerHTML = "";
    }
    this.visible = false;
    this.options.onAfterHide?.(this);
  }
  cleanupSubmenus() {
    this.hideTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.hideTimeouts.clear();
    this.submenuMap.forEach((submenu) => {
      if (document.body.contains(submenu))
        document.body.removeChild(submenu);
    });
    this.submenuMap.clear();
    this.activeSubmenus = [];
  }
  render() {
    this.container.innerHTML = "";
    this.renderItems(this.options.items, this.container);
  }
  renderItems(items, container) {
    items.forEach((item) => {
      if (item.visible !== void 0) {
        const isVisible = typeof item.visible === "function" ? item.visible(this.options.context) : item.visible;
        if (!isVisible)
          return;
      }
      if (item.divider)
        this.renderDivider(container);
      else
        this.renderMenuItem(item, container);
    });
  }
  renderDivider(container) {
    const divider = document.createElement("div");
    divider.className = "context-menu-divider";
    divider.style.cssText = `
      height: 1px;
      background: var(--menu-divider, #e5e7eb);
      margin: 4px 0;
    `;
    container.appendChild(divider);
  }
  renderMenuItem(item, container) {
    const menuItem = document.createElement("div");
    menuItem.className = "context-menu-item";
    const isDisabled = typeof item.disabled === "function" ? item.disabled(this.options.context) : item.disabled;
    if (isDisabled)
      menuItem.classList.add("disabled");
    if (item.className)
      menuItem.classList.add(...item.className.split(" "));
    menuItem.style.cssText = `
      display: flex;
      align-items: center;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: ${isDisabled ? "not-allowed" : "pointer"};
      opacity: ${isDisabled ? "0.5" : "1"};
      position: relative;
      min-height: 32px;
      transition: background-color 0.15s;
    `;
    if (!isDisabled) {
      menuItem.addEventListener("mouseenter", () => {
        menuItem.style.backgroundColor = "var(--menu-hover, #f3f4f6)";
      });
      menuItem.addEventListener("mouseleave", () => {
        menuItem.style.backgroundColor = "transparent";
      });
    }
    if (item.type === "checkbox" || item.type === "radio") {
      const checked = typeof item.checked === "function" ? item.checked(this.options.context) : item.checked;
      const checkIcon = document.createElement("span");
      checkIcon.className = "context-menu-check";
      checkIcon.style.cssText = `
        width: 16px;
        height: 16px;
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      if (checked) {
        checkIcon.innerHTML = item.type === "radio" ? getLucideIcon("circle") : getLucideIcon("check");
      }
      menuItem.appendChild(checkIcon);
    }
    if (item.icon) {
      const icon = document.createElement("span");
      icon.className = "context-menu-icon";
      icon.style.cssText = `
        width: 16px;
        height: 16px;
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      `;
      icon.innerHTML = item.icon;
      menuItem.appendChild(icon);
    }
    if (item.label) {
      const label = document.createElement("span");
      label.className = "context-menu-label";
      label.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `;
      label.textContent = item.label;
      menuItem.appendChild(label);
    }
    if (item.shortcut) {
      const shortcut = document.createElement("span");
      shortcut.className = "context-menu-shortcut";
      shortcut.style.cssText = `
        margin-left: 20px;
        font-size: 12px;
        color: var(--menu-muted, #9ca3af);
      `;
      shortcut.textContent = item.shortcut;
      menuItem.appendChild(shortcut);
    }
    if (item.submenu && item.submenu.length > 0) {
      const arrow = document.createElement("span");
      arrow.className = "context-menu-arrow";
      arrow.style.cssText = `
        width: 16px;
        height: 16px;
        margin-left: auto;
        padding-left: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      arrow.innerHTML = getLucideIcon("chevronRight");
      menuItem.appendChild(arrow);
      if (!isDisabled)
        this.setupSubmenu(menuItem, item.submenu);
    }
    if (item.tooltip)
      menuItem.title = item.tooltip;
    if (item.action && !isDisabled && !item.submenu) {
      menuItem.addEventListener("click", (e) => {
        e.stopPropagation();
        item.action(this.options.context);
        this.hide();
      });
    }
    container.appendChild(menuItem);
  }
  setupSubmenu(parentItem, items) {
    const submenu = this.createSubmenu(items);
    this.submenuMap.set(parentItem, submenu);
    let hideTimeout = null;
    parentItem.addEventListener("mouseenter", () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
      this.activeSubmenus.forEach((s) => {
        if (s !== submenu)
          s.style.display = "none";
      });
      submenu.style.display = "block";
      const itemRect = parentItem.getBoundingClientRect();
      const submenuRect = submenu.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      let left = itemRect.right - 4;
      let top = itemRect.top;
      if (left + submenuRect.width > windowWidth - 10)
        left = itemRect.left - submenuRect.width + 4;
      if (top + submenuRect.height > windowHeight - 10)
        top = Math.max(10, windowHeight - submenuRect.height - 10);
      submenu.style.left = `${left}px`;
      submenu.style.top = `${top}px`;
      if (this.options.animation) {
        submenu.style.opacity = "1";
        submenu.style.transform = "translateX(0)";
      }
      if (!this.activeSubmenus.includes(submenu))
        this.activeSubmenus.push(submenu);
    });
    parentItem.addEventListener("mouseleave", (e) => {
      const relatedTarget = e.relatedTarget;
      if (relatedTarget && submenu.contains(relatedTarget))
        return;
      hideTimeout = window.setTimeout(() => {
        submenu.style.display = "none";
      }, 150);
      this.hideTimeouts.set(parentItem, hideTimeout);
    });
    submenu.addEventListener("mouseenter", () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
    });
    submenu.addEventListener("mouseleave", (e) => {
      const relatedTarget = e.relatedTarget;
      if (relatedTarget && parentItem.contains(relatedTarget))
        return;
      hideTimeout = window.setTimeout(() => {
        submenu.style.display = "none";
      }, 150);
      this.hideTimeouts.set(parentItem, hideTimeout);
    });
  }
  createSubmenu(items) {
    const submenu = document.createElement("div");
    submenu.className = `context-submenu context-menu-${this.options.theme}`;
    submenu.style.cssText = `
      position: fixed;
      display: none;
      z-index: ${this.options.zIndex + 1};
      min-width: ${this.options.minWidth}px;
      max-height: ${this.options.maxHeight}px;
      overflow-y: auto;
      background: var(--menu-bg, #ffffff);
      border: 1px solid var(--menu-border, #e5e7eb);
      border-radius: 8px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      padding: 4px;
      font-size: 14px;
      color: var(--menu-text, #374151);
      user-select: none;
      backdrop-filter: blur(10px);
      ${this.options.animation ? "opacity: 0; transform: translateX(-10px); transition: opacity 0.15s, transform 0.15s;" : ""}
    `;
    this.renderItems(items, submenu);
    document.body.appendChild(submenu);
    return submenu;
  }
  // 公共方法：更新菜单项
  updateItems(items) {
    this.options.items = items;
    if (this.visible)
      this.render();
  }
  // 公共方法：更新上下文
  updateContext(context) {
    this.options.context = context;
  }
  // 公共方法：销毁菜单
  destroy() {
    this.hide();
    if (document.body.contains(this.container))
      document.body.removeChild(this.container);
  }
}

export { ContextMenuSystem };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ContextMenuSystem.js.map
