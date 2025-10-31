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

var event = require('../../utils/event.cjs');
var logger$1 = require('../../utils/logger.cjs');

/**
 * 移动端工具栏组件
 * 自适应的底部工具栏
 */
const logger = logger$1.createLogger('MobileToolbar');
class MobileToolbar extends event.EventEmitter {
    constructor(options) {
        super();
        this.moreMenu = null;
        this.items = new Map();
        this.isVisible = true;
        this.isCompact = false;
        this.lastScrollY = 0;
        this.container = options.container;
        this.editor = options.editor;
        this.options = {
            items: [],
            height: '50px',
            backgroundColor: '#ffffff',
            activeColor: '#2196F3',
            autoHide: true,
            ...options,
        };
        this.createToolbar();
        this.setupEventListeners();
        this.updateActiveStates();
    }
    /**
     * 创建工具栏DOM
     */
    createToolbar() {
        this.toolbarElement = document.createElement('div');
        this.toolbarElement.className = 'mobile-toolbar';
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
        // 安全区域适配
        this.toolbarElement.style.paddingBottom = 'env(safe-area-inset-bottom, 0)';
        // 创建项目容器
        this.itemsContainer = document.createElement('div');
        this.itemsContainer.className = 'toolbar-items';
        this.itemsContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 5px;
      flex: 1;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    `;
        this.itemsContainer.style.msOverflowStyle = 'none';
        this.itemsContainer.style.setProperty('::-webkit-scrollbar', 'display: none');
        // 渲染工具栏项
        this.renderItems();
        this.toolbarElement.appendChild(this.itemsContainer);
        document.body.appendChild(this.toolbarElement);
    }
    /**
     * 渲染工具栏项
     */
    renderItems() {
        this.itemsContainer.innerHTML = '';
        this.items.clear();
        // 在紧凑模式下，只显示核心功能
        const itemsToRender = this.isCompact
            ? this.options.items.filter(item => ['bold', 'italic', 'undo', 'redo', 'more'].includes(item.id))
            : this.options.items;
        itemsToRender.forEach((item) => {
            if (item.type === 'separator') {
                this.itemsContainer.appendChild(this.createSeparator());
            }
            else {
                const element = this.createToolbarItem(item);
                this.itemsContainer.appendChild(element);
                this.items.set(item.id, { ...item, element });
            }
        });
    }
    /**
     * 创建工具栏项
     */
    createToolbarItem(item) {
        const button = document.createElement('button');
        button.className = `toolbar-item toolbar-item-${item.id}`;
        button.style.cssText = `
      min-width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      color: ${item.disabled ? '#999' : '#333'};
      font-size: 18px;
      font-weight: bold;
      border-radius: 8px;
      cursor: ${item.disabled ? 'not-allowed' : 'pointer'};
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
            // 触摸反馈
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.95)';
                button.style.backgroundColor = '#f0f0f0';
            });
            button.addEventListener('touchend', () => {
                button.style.transform = 'scale(1)';
                button.style.backgroundColor = item.active ? `${this.options.activeColor}20` : 'transparent';
            });
            // 点击处理
            button.addEventListener('click', () => {
                this.handleItemClick(item);
            });
        }
        return button;
    }
    /**
     * 创建分隔线
     */
    createSeparator() {
        const separator = document.createElement('div');
        separator.className = 'toolbar-separator';
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
        logger.info('Toolbar item clicked:', item.id);
        // 特殊处理更多按钮
        if (item.id === 'more') {
            this.showMoreMenu();
            return;
        }
        // 执行默认动作
        if (item.action)
            item.action(this.editor);
        else
            this.executeCommand(item.id);
        // 更新状态
        this.updateActiveStates();
        // 触发事件
        this.emit('itemclick', item);
    }
    /**
     * 执行编辑器命令
     */
    executeCommand(command) {
        switch (command) {
            case 'bold':
                this.editor.toggleBold();
                break;
            case 'italic':
                this.editor.toggleItalic();
                break;
            case 'underline':
                this.editor.toggleUnderline();
                break;
            case 'undo':
                this.editor.undo();
                break;
            case 'redo':
                this.editor.redo();
                break;
            case 'image':
                this.showImagePicker();
                break;
            case 'link':
                this.showLinkDialog();
                break;
            default:
                logger.warn('Unknown command:', command);
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
        this.moreMenu = document.createElement('div');
        this.moreMenu.className = 'toolbar-more-menu';
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
        // 添加动画
        const style = document.createElement('style');
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
        // 额外的工具按钮
        const extraItems = [
            { id: 'strikethrough', icon: 'S̶', title: '删除线' },
            { id: 'code', icon: '<>', title: '代码' },
            { id: 'quote', icon: '"', title: '引用' },
            { id: 'list', icon: '☰', title: '列表' },
            { id: 'heading', icon: 'H', title: '标题' },
            { id: 'table', icon: '⊞', title: '表格' },
            { id: 'emoji', icon: '😊', title: '表情' },
            { id: 'color', icon: '🎨', title: '颜色' },
        ];
        extraItems.forEach((item) => {
            const button = document.createElement('button');
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
            button.addEventListener('click', () => {
                this.executeCommand(item.id);
                this.hideMoreMenu();
            });
            this.moreMenu.appendChild(button);
        });
        document.body.appendChild(this.moreMenu);
        // 点击其他地方关闭
        setTimeout(() => {
            document.addEventListener('click', this.hideMoreMenu.bind(this), { once: true });
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
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const url = e.target?.result;
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
        const url = prompt('请输入链接地址:');
        if (url) {
            const text = prompt('请输入链接文字:') || url;
            this.editor.insertLink(url, text);
        }
    }
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 监听编辑器状态变化
        this.editor.on('selectionchange', () => {
            this.updateActiveStates();
        });
        // 自动隐藏功能
        if (this.options.autoHide) {
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
                    // 向下滚动，隐藏工具栏
                    this.hide();
                }
                else {
                    // 向上滚动，显示工具栏
                    this.show();
                }
                this.lastScrollY = currentScrollY;
                // 滚动停止后显示工具栏
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    this.show();
                }, 500);
            }, { passive: true });
        }
    }
    /**
     * 更新活动状态
     */
    updateActiveStates() {
        // 更新加粗状态
        this.setItemActive('bold', document.queryCommandState('bold'));
        this.setItemActive('italic', document.queryCommandState('italic'));
        this.setItemActive('underline', document.queryCommandState('underline'));
        // 更新撤销/重做状态
        this.setItemEnabled('undo', this.editor.canUndo());
        this.setItemEnabled('redo', this.editor.canRedo());
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
            }
            else {
                element.style.backgroundColor = 'transparent';
                element.style.color = '#333';
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
            element.style.color = enabled ? '#333' : '#999';
            element.style.cursor = enabled ? 'pointer' : 'not-allowed';
        }
    }
    /**
     * 设置紧凑模式
     */
    setCompactMode(compact) {
        if (this.isCompact !== compact) {
            this.isCompact = compact;
            this.renderItems();
            logger.info('Compact mode:', compact);
        }
    }
    /**
     * 显示工具栏
     */
    show() {
        if (!this.isVisible) {
            this.isVisible = true;
            this.toolbarElement.style.transform = 'translateY(0)';
            this.emit('show');
        }
    }
    /**
     * 隐藏工具栏
     */
    hide() {
        if (this.isVisible) {
            this.isVisible = false;
            this.toolbarElement.style.transform = 'translateY(calc(100% + env(safe-area-inset-bottom, 0)))';
            this.emit('hide');
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

exports.MobileToolbar = MobileToolbar;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=MobileToolbar.cjs.map
