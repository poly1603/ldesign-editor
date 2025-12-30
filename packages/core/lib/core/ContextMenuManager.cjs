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

var ContextMenuSystem = require('../ui/ContextMenuSystem.cjs');
var event = require('../utils/event.cjs');

class ContextMenuManager extends event.EventEmitter {
  constructor(options = {}) {
    super();
    this.registrations = /* @__PURE__ */ new Map();
    this.activeMenu = null;
    this.container = null;
    this.clickHandlers = /* @__PURE__ */ new Map();
    this.options = {
      theme: "light",
      animation: true,
      maxHeight: window.innerHeight * 0.7,
      minWidth: 220,
      zIndex: 1e4,
      enableDefault: false,
      ...options
    };
    this.initialize();
  }
  initialize() {
    document.addEventListener("contextmenu", this.handleGlobalContextMenu.bind(this), true);
  }
  /**
   * 设置容器元素
   */
  setContainer(element) {
    this.container = element;
  }
  /**
   * 注册右键菜单
   */
  register(registration) {
    if (!registration.id)
      throw new Error("Menu registration must have an id");
    if (registration.priority === void 0)
      registration.priority = 0;
    this.registrations.set(registration.id, registration);
    this.emit("menu-registered", registration);
    console.log(`[ContextMenuManager] Registered menu: ${registration.id}`);
  }
  /**
   * 注销右键菜单
   */
  unregister(id) {
    if (this.registrations.has(id)) {
      this.registrations.delete(id);
      this.emit("menu-unregistered", id);
      console.log(`[ContextMenuManager] Unregistered menu: ${id}`);
    }
  }
  /**
   * 更新菜单项
   */
  updateMenu(id, items) {
    const registration = this.registrations.get(id);
    if (registration) {
      registration.items = items;
      this.emit("menu-updated", id);
    }
  }
  /**
   * 获取注册的菜单
   */
  getRegistration(id) {
    return this.registrations.get(id);
  }
  /**
   * 获取所有注册的菜单
   */
  getAllRegistrations() {
    return Array.from(this.registrations.values());
  }
  /**
   * 处理全局右键事件
   */
  handleGlobalContextMenu(e) {
    const target = e.target;
    console.log("[ContextMenuManager] Right click on:", target, "Classes:", target.className);
    if (this.container && !this.container.contains(target)) {
      console.log("[ContextMenuManager] Target not in container");
      return;
    }
    const matchedMenus = this.findMatchingMenus(target);
    console.log("[ContextMenuManager] Matched menus:", matchedMenus.map((m) => m.id));
    if (matchedMenus.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      matchedMenus.sort((a, b) => (b.priority || 0) - (a.priority || 0));
      const registration = matchedMenus[0];
      console.log("[ContextMenuManager] Using menu:", registration.id, "Priority:", registration.priority);
      this.showMenu(e, target, registration);
    } else if (!this.options.enableDefault) {
      if (this.container && this.container.contains(target)) {
        console.log("[ContextMenuManager] Preventing default context menu");
        e.preventDefault();
      }
    }
  }
  /**
   * 查找匹配的菜单
   */
  findMatchingMenus(element) {
    const matched = [];
    for (const registration of this.registrations.values()) {
      if (element.matches(registration.selector) || element.closest(registration.selector)) {
        if (!registration.condition || registration.condition(element))
          matched.push(registration);
      }
    }
    return matched;
  }
  /**
   * 显示菜单
   */
  showMenu(e, element, registration) {
    if (this.activeMenu) {
      this.activeMenu.destroy();
      this.activeMenu = null;
    }
    const context = {
      element,
      event: e,
      registration,
      manager: this
    };
    const items = typeof registration.items === "function" ? registration.items(context) : registration.items;
    const menuOptions = {
      items,
      context,
      theme: this.options.theme,
      animation: this.options.animation,
      maxHeight: this.options.maxHeight,
      minWidth: this.options.minWidth,
      zIndex: this.options.zIndex,
      onBeforeShow: (menu) => {
        registration.onBeforeShow?.(menu, context);
        this.emit("menu-before-show", {
          menu,
          context,
          registration
        });
      },
      onAfterShow: (menu) => {
        registration.onAfterShow?.(menu, context);
        this.emit("menu-after-show", {
          menu,
          context,
          registration
        });
      },
      onBeforeHide: (menu) => {
        registration.onBeforeHide?.(menu, context);
        this.emit("menu-before-hide", {
          menu,
          context,
          registration
        });
      },
      onAfterHide: (menu) => {
        registration.onAfterHide?.(menu, context);
        this.emit("menu-after-hide", {
          menu,
          context,
          registration
        });
        if (this.activeMenu === menu)
          this.activeMenu = null;
      }
    };
    this.activeMenu = new ContextMenuSystem.ContextMenuSystem(menuOptions);
    this.activeMenu.show(e.clientX, e.clientY, context);
  }
  /**
   * 手动触发右键菜单
   */
  trigger(e, menuId, _context) {
    const registration = this.registrations.get(menuId);
    if (!registration) {
      console.warn(`Menu with id "${menuId}" not found`);
      return;
    }
    const element = e.target;
    this.showMenu(e, element, registration);
  }
  /**
   * 关闭当前活动的菜单
   */
  closeActiveMenu() {
    if (this.activeMenu) {
      this.activeMenu.hide();
      this.activeMenu = null;
    }
  }
  /**
   * 为特定元素添加右键菜单
   */
  addContextMenu(element, items, options) {
    const id = options?.id || `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const className = `context-menu-${id}`;
    element.classList.add(className);
    this.register({
      id,
      selector: `.${className}`,
      items,
      ...options
    });
    return id;
  }
  /**
   * 批量注册菜单
   */
  registerBatch(registrations) {
    registrations.forEach((registration) => {
      this.register(registration);
    });
  }
  /**
   * 批量注销菜单
   */
  unregisterBatch(ids) {
    ids.forEach((id) => {
      this.unregister(id);
    });
  }
  /**
   * 清除所有注册的菜单
   */
  clear() {
    this.registrations.clear();
    this.closeActiveMenu();
    this.emit("menus-cleared");
  }
  /**
   * 更新全局选项
   */
  updateOptions(options) {
    this.options = {
      ...this.options,
      ...options
    };
    this.emit("options-updated", this.options);
  }
  /**
   * 获取当前选项
   */
  getOptions() {
    return {
      ...this.options
    };
  }
  /**
   * 销毁管理器
   */
  destroy() {
    this.clear();
    document.removeEventListener("contextmenu", this.handleGlobalContextMenu.bind(this), true);
    this.removeAllListeners();
  }
}
let globalManager = null;
function getContextMenuManager() {
  if (!globalManager)
    globalManager = new ContextMenuManager();
  return globalManager;
}
function registerContextMenu(registration) {
  getContextMenuManager().register(registration);
}

exports.ContextMenuManager = ContextMenuManager;
exports.getContextMenuManager = getContextMenuManager;
exports.registerContextMenu = registerContextMenu;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ContextMenuManager.cjs.map
