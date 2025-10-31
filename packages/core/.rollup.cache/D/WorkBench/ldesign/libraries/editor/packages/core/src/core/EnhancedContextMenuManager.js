/**
 * 增强的统一右键菜单管理器
 * 整合原有三套右键菜单系统的所有功能
 */
import { ContextMenu } from '../ui/base/ContextMenu';
import { EventEmitter, on } from '../utils/event';
/**
 * 单例模式的右键菜单管理器
 */
export class EnhancedContextMenuManager extends EventEmitter {
    constructor(options = {}) {
        super();
        this.registrations = new Map();
        this.activeMenu = null;
        this.activeContext = null;
        this.cleanupFunctions = [];
        this.options = {
            theme: 'light',
            animation: true,
            maxHeight: window.innerHeight * 0.7,
            minWidth: 220,
            zIndex: 10000,
            enableDefault: false,
            mergeMenus: false,
            ...options,
        };
        this.initialize();
    }
    /**
     * 获取单例实例
     */
    static getInstance(options) {
        if (!EnhancedContextMenuManager.instance)
            EnhancedContextMenuManager.instance = new EnhancedContextMenuManager(options);
        return EnhancedContextMenuManager.instance;
    }
    /**
     * 销毁单例实例
     */
    static destroy() {
        if (EnhancedContextMenuManager.instance) {
            EnhancedContextMenuManager.instance.dispose();
            EnhancedContextMenuManager.instance = null;
        }
    }
    initialize() {
        // 全局右键事件监听
        const cleanup = on(document, 'contextmenu', this.handleContextMenu.bind(this), {
            capture: true,
        });
        this.cleanupFunctions.push(cleanup);
        // 点击其他地方关闭菜单
        const clickCleanup = on(document, 'click', () => {
            if (this.activeMenu)
                this.hideMenu();
        });
        this.cleanupFunctions.push(clickCleanup);
        // ESC键关闭菜单
        const escCleanup = on(document, 'keydown', (e) => {
            const event = e;
            if (event.key === 'Escape' && this.activeMenu)
                this.hideMenu();
        });
        this.cleanupFunctions.push(escCleanup);
    }
    /**
     * 注册右键菜单
     */
    register(registration) {
        if (!registration.id)
            throw new Error('Menu registration must have an id');
        // 设置默认值
        registration.priority = registration.priority ?? 0;
        registration.merge = registration.merge ?? this.options.mergeMenus;
        this.registrations.set(registration.id, registration);
        this.emit('menu-registered', registration);
        console.log(`[ContextMenuManager] Registered menu: ${registration.id}`);
    }
    /**
     * 批量注册菜单
     */
    registerBatch(registrations) {
        registrations.forEach(reg => this.register(reg));
    }
    /**
     * 注销右键菜单
     */
    unregister(id) {
        if (this.registrations.has(id)) {
            this.registrations.delete(id);
            this.emit('menu-unregistered', id);
            console.log(`[ContextMenuManager] Unregistered menu: ${id}`);
        }
    }
    /**
     * 更新菜单项
     */
    updateMenu(id, updates) {
        const registration = this.registrations.get(id);
        if (registration) {
            Object.assign(registration, updates);
            this.emit('menu-updated', id);
        }
    }
    /**
     * 设置容器
     */
    setContainer(container) {
        this.options.container = container;
    }
    /**
     * 更新选项
     */
    updateOptions(options) {
        Object.assign(this.options, options);
    }
    /**
     * 处理右键事件
     */
    handleContextMenu(e) {
        const event = e;
        const target = event.target;
        // 检查容器限制
        if (this.options.container && !this.options.container.contains(target))
            return;
        // 查找匹配的菜单
        const matchedMenus = this.findMatchingMenus(target, event);
        if (matchedMenus.length > 0) {
            event.preventDefault();
            event.stopPropagation();
            // 创建上下文
            const context = {
                element: target,
                event,
            };
            // 合并或选择菜单
            if (this.options.mergeMenus && matchedMenus.length > 1) {
                this.showMergedMenu(matchedMenus, context);
            }
            else {
                // 使用优先级最高的菜单
                this.showSingleMenu(matchedMenus[0], context);
            }
        }
        else if (!this.options.enableDefault && this.options.container?.contains(target)) {
            // 阻止默认右键菜单
            event.preventDefault();
        }
    }
    /**
     * 查找匹配的菜单
     */
    findMatchingMenus(element, event) {
        const matched = [];
        const context = { element, event };
        for (const registration of this.registrations.values()) {
            const selectors = Array.isArray(registration.selector)
                ? registration.selector
                : [registration.selector];
            // 检查选择器匹配
            const isMatch = selectors.some((selector) => {
                return element.matches(selector) || element.closest(selector) !== null;
            });
            if (isMatch) {
                // 检查额外条件
                if (!registration.condition || registration.condition(element, context))
                    matched.push(registration);
            }
        }
        // 按优先级排序
        matched.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        return matched;
    }
    /**
     * 显示单个菜单
     */
    showSingleMenu(registration, context) {
        context.registration = registration;
        // 获取菜单项
        const items = typeof registration.items === 'function'
            ? registration.items(context)
            : registration.items;
        if (items.length === 0)
            return;
        // 关闭之前的菜单
        this.hideMenu();
        // 创建新菜单
        this.activeMenu = new ContextMenu({
            items,
            context,
            theme: this.options.theme,
            animation: this.options.animation,
            minWidth: this.options.minWidth,
            maxHeight: this.options.maxHeight,
            zIndex: this.options.zIndex,
            onBeforeShow: menu => registration.onBeforeShow?.(menu, context),
            onAfterShow: (menu) => {
                registration.onAfterShow?.(menu, context);
                this.emit('menu-show', context);
            },
            onBeforeHide: menu => registration.onBeforeHide?.(menu, context),
            onAfterHide: (menu) => {
                registration.onAfterHide?.(menu, context);
                this.emit('menu-hide', context);
            },
            onSelect: (item) => {
                this.emit('menu-select', item, context);
            },
        });
        this.activeContext = context;
        this.activeMenu.showAt(context.event.clientX, context.event.clientY, context);
    }
    /**
     * 显示合并的菜单
     */
    showMergedMenu(registrations, context) {
        const allItems = [];
        const groupedItems = new Map();
        // 收集所有菜单项
        for (const registration of registrations) {
            context.registration = registration;
            const items = typeof registration.items === 'function'
                ? registration.items(context)
                : registration.items;
            if (registration.group) {
                // 分组菜单
                if (!groupedItems.has(registration.group))
                    groupedItems.set(registration.group, []);
                groupedItems.get(registration.group).push(...items);
            }
            else {
                // 独立菜单项
                if (allItems.length > 0 && items.length > 0)
                    allItems.push({ divider: true }); // 添加分隔符
                allItems.push(...items);
            }
        }
        // 添加分组菜单项
        groupedItems.forEach((items, group) => {
            if (allItems.length > 0)
                allItems.push({ divider: true });
            allItems.push(...items);
        });
        if (allItems.length === 0)
            return;
        // 关闭之前的菜单
        this.hideMenu();
        // 创建合并菜单
        this.activeMenu = new ContextMenu({
            items: allItems,
            context,
            theme: this.options.theme,
            animation: this.options.animation,
            minWidth: this.options.minWidth,
            maxHeight: this.options.maxHeight,
            zIndex: this.options.zIndex,
            onAfterShow: () => this.emit('menu-show', context),
            onAfterHide: () => this.emit('menu-hide', context),
            onSelect: item => this.emit('menu-select', item, context),
        });
        this.activeContext = context;
        this.activeMenu.showAt(context.event.clientX, context.event.clientY, context);
    }
    /**
     * 隐藏当前菜单
     */
    hideMenu() {
        if (this.activeMenu) {
            this.activeMenu.hide();
            this.activeMenu = null;
            this.activeContext = null;
        }
    }
    /**
     * 手动触发菜单
     */
    trigger(e, menuId, context) {
        const registration = this.registrations.get(menuId);
        if (!registration) {
            console.warn(`[ContextMenuManager] Menu "${menuId}" not found`);
            return;
        }
        const menuContext = {
            element: e.target,
            event: e,
            registration,
            ...context,
        };
        this.showSingleMenu(registration, menuContext);
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
     * 获取当前活动的菜单
     */
    getActiveMenu() {
        return this.activeMenu;
    }
    /**
     * 获取当前活动的上下文
     */
    getActiveContext() {
        return this.activeContext;
    }
    /**
     * 清理资源
     */
    dispose() {
        this.hideMenu();
        this.registrations.clear();
        this.cleanupFunctions.forEach(cleanup => cleanup());
        this.cleanupFunctions = [];
        this.clear();
    }
}
EnhancedContextMenuManager.instance = null;
// 导出便捷函数
export function getContextMenuManager(options) {
    return EnhancedContextMenuManager.getInstance(options);
}
export function registerContextMenu(registration) {
    getContextMenuManager().register(registration);
}
export function unregisterContextMenu(id) {
    getContextMenuManager().unregister(id);
}
export function updateContextMenu(id, updates) {
    getContextMenuManager().updateMenu(id, updates);
}
export function triggerContextMenu(e, menuId, context) {
    getContextMenuManager().trigger(e, menuId, context);
}
export function hideContextMenu() {
    getContextMenuManager().hideMenu();
}
//# sourceMappingURL=EnhancedContextMenuManager.js.map