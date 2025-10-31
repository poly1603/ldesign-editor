/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { EventEmitter } from '../../utils/event.js';
import { createLogger } from '../../utils/logger.js';

/**
 * 滑动菜单组件
 * 从左侧滑出的导航菜单
 */
const logger = createLogger('SwipeMenu');
class SwipeMenu extends EventEmitter {
    constructor(options) {
        super();
        this.isOpen_ = false;
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.container = options.container;
        this.options = {
            items: [],
            width: '80%',
            backgroundColor: '#ffffff',
            textColor: '#333333',
            activeColor: '#2196F3',
            ...options,
        };
        this.createMenu();
        this.setupEventListeners();
    }
    /**
     * 创建菜单DOM
     */
    createMenu() {
        // 创建遮罩层
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'swipe-menu-overlay';
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
        // 创建菜单容器
        this.menuElement = document.createElement('div');
        this.menuElement.className = 'swipe-menu';
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
        // 创建菜单头部
        const header = document.createElement('div');
        header.className = 'swipe-menu-header';
        header.style.cssText = `
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      min-height: 120px;
    `;
        const logo = document.createElement('div');
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
        logo.textContent = '✏️';
        const title = document.createElement('div');
        title.innerHTML = `
      <h3 style="margin: 0; font-size: 20px;">LDesign Editor</h3>
      <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">移动版</p>
    `;
        header.appendChild(logo);
        header.appendChild(title);
        this.menuElement.appendChild(header);
        // 创建菜单项容器
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'swipe-menu-items';
        itemsContainer.style.cssText = `
      padding: 10px 0;
    `;
        // 渲染菜单项
        this.options.items.forEach((item) => {
            itemsContainer.appendChild(this.createMenuItem(item));
        });
        this.menuElement.appendChild(itemsContainer);
        // 添加到容器
        document.body.appendChild(this.overlayElement);
        document.body.appendChild(this.menuElement);
    }
    /**
     * 创建菜单项
     */
    createMenuItem(item, level = 0) {
        const menuItem = document.createElement('div');
        menuItem.className = 'swipe-menu-item';
        menuItem.style.cssText = `
      display: flex;
      align-items: center;
      padding: 15px 20px;
      padding-left: ${20 + level * 20}px;
      color: ${item.disabled ? '#999' : this.options.textColor};
      cursor: ${item.disabled ? 'not-allowed' : 'pointer'};
      transition: background-color 0.2s;
      position: relative;
    `;
        if (!item.disabled) {
            menuItem.addEventListener('mouseenter', () => {
                menuItem.style.backgroundColor = '#f5f5f5';
            });
            menuItem.addEventListener('mouseleave', () => {
                menuItem.style.backgroundColor = 'transparent';
            });
            menuItem.addEventListener('click', () => {
                if (item.action) {
                    item.action();
                    this.close();
                }
                this.emit('itemclick', item);
            });
        }
        // 图标
        if (item.icon) {
            const icon = document.createElement('span');
            icon.className = 'swipe-menu-item-icon';
            icon.style.cssText = `
        margin-right: 15px;
        font-size: 20px;
        width: 24px;
        text-align: center;
      `;
            icon.textContent = item.icon;
            menuItem.appendChild(icon);
        }
        // 标签
        const label = document.createElement('span');
        label.className = 'swipe-menu-item-label';
        label.style.cssText = `
      flex: 1;
      font-size: 16px;
    `;
        label.textContent = item.label;
        menuItem.appendChild(label);
        // 子菜单箭头
        if (item.children && item.children.length > 0) {
            const arrow = document.createElement('span');
            arrow.className = 'swipe-menu-item-arrow';
            arrow.style.cssText = `
        color: #999;
        font-size: 12px;
      `;
            arrow.textContent = '▶';
            menuItem.appendChild(arrow);
        }
        const container = document.createElement('div');
        container.appendChild(menuItem);
        // 递归创建子菜单
        if (item.children && item.children.length > 0) {
            const submenu = document.createElement('div');
            submenu.className = 'swipe-menu-submenu';
            submenu.style.cssText = `
        display: none;
        background: #fafafa;
      `;
            item.children.forEach((child) => {
                submenu.appendChild(this.createMenuItem(child, level + 1));
            });
            container.appendChild(submenu);
            // 展开/收起子菜单
            menuItem.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = submenu.style.display === 'block';
                submenu.style.display = isExpanded ? 'none' : 'block';
                arrow.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
            });
        }
        return container;
    }
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 遮罩层点击关闭
        this.overlayElement.addEventListener('click', () => {
            this.close();
        });
        // 触摸滑动
        let touchStartX = 0;
        let menuStartX = 0;
        let isSwiping = false;
        // 边缘滑动打开
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            if (touch.pageX < 20 && !this.isOpen_) {
                touchStartX = touch.pageX;
                menuStartX = -this.menuElement.offsetWidth;
                isSwiping = true;
                this.menuElement.style.transition = 'none';
            }
            else if (this.isOpen_) {
                touchStartX = touch.pageX;
                menuStartX = 0;
                isSwiping = true;
                this.menuElement.style.transition = 'none';
            }
        });
        document.addEventListener('touchmove', (e) => {
            if (!isSwiping)
                return;
            const touch = e.touches[0];
            const deltaX = touch.pageX - touchStartX;
            let newX = menuStartX + deltaX;
            // 限制范围
            const maxX = 0;
            const minX = -this.menuElement.offsetWidth;
            newX = Math.max(minX, Math.min(maxX, newX));
            this.menuElement.style.transform = `translateX(${newX}px)`;
            // 更新遮罩层透明度
            const progress = Math.abs(newX / this.menuElement.offsetWidth);
            this.overlayElement.style.opacity = String(1 - progress * 0.5);
            this.overlayElement.style.visibility = 'visible';
            e.preventDefault();
        });
        document.addEventListener('touchend', (e) => {
            if (!isSwiping)
                return;
            isSwiping = false;
            this.menuElement.style.transition = 'transform 0.3s ease-out';
            const currentTransform = this.menuElement.style.transform;
            const match = currentTransform.match(/translateX\(([-\d.]+)px\)/);
            const currentX = match ? Number.parseFloat(match[1]) : 0;
            // 根据滑动距离决定打开或关闭
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
        this.menuElement.style.transform = 'translateX(0)';
        this.overlayElement.style.opacity = '1';
        this.overlayElement.style.visibility = 'visible';
        this.emit('open');
        logger.info('Menu opened');
    }
    /**
     * 关闭菜单
     */
    close() {
        if (!this.isOpen_)
            return;
        this.isOpen_ = false;
        this.menuElement.style.transform = 'translateX(-100%)';
        this.overlayElement.style.opacity = '0';
        this.overlayElement.style.visibility = 'hidden';
        this.emit('close');
        logger.info('Menu closed');
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
        // 清空现有菜单项
        const itemsContainer = this.menuElement.querySelector('.swipe-menu-items');
        if (itemsContainer) {
            itemsContainer.innerHTML = '';
            // 重新渲染菜单项
            items.forEach((item) => {
                itemsContainer.appendChild(this.createMenuItem(item));
            });
        }
    }
    /**
     * 设置菜单项启用/禁用状态
     */
    setItemEnabled(label, enabled) {
        const items = this.menuElement.querySelectorAll('.swipe-menu-item');
        items.forEach((item) => {
            const labelElement = item.querySelector('.swipe-menu-item-label');
            if (labelElement && labelElement.textContent === label) {
                const menuItem = item;
                menuItem.style.color = enabled ? this.options.textColor : '#999';
                menuItem.style.cursor = enabled ? 'pointer' : 'not-allowed';
                menuItem.style.pointerEvents = enabled ? 'auto' : 'none';
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

export { SwipeMenu };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=SwipeMenu.js.map
