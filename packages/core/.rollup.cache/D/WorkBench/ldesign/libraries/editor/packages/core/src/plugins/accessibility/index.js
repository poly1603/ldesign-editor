/**
 * 无障碍访问（Accessibility）插件
 * 提升编辑器的可访问性
 *
 * 功能:
 * - ARIA标签完善
 * - 键盘导航优化
 * - 屏幕阅读器支持
 * - 高对比度模式
 * - 焦点管理
 *
 * @packageDocumentation
 */
import { createPlugin } from '../../core/Plugin';
import { createLogger } from '../../utils/logger';
const logger = createLogger('Accessibility');
/**
 * 无障碍管理器
 */
export class AccessibilityManager {
    constructor(editor, config = {}) {
        this.focusableElements = [];
        this.currentFocusIndex = -1;
        this.editor = editor;
        this.config = {
            enableKeyboardNav: true,
            enableScreenReader: true,
            enableHighContrast: false,
            ...config,
        };
    }
    /**
     * 初始化ARIA标签
     */
    setupARIA() {
        if (!this.editor.contentElement)
            return;
        // 编辑器角色
        this.editor.contentElement.setAttribute('role', 'textbox');
        this.editor.contentElement.setAttribute('aria-multiline', 'true');
        this.editor.contentElement.setAttribute('aria-label', this.config.ariaLabels?.editor || '富文本编辑器');
        // 如果有工具栏
        const toolbar = document.querySelector('.ldesign-toolbar');
        if (toolbar) {
            toolbar.setAttribute('role', 'toolbar');
            toolbar.setAttribute('aria-label', this.config.ariaLabels?.toolbar || '编辑器工具栏');
            // 为工具栏按钮添加ARIA
            const buttons = toolbar.querySelectorAll('button');
            buttons.forEach((button) => {
                if (!button.getAttribute('aria-label')) {
                    const title = button.getAttribute('title') || button.textContent || '按钮';
                    button.setAttribute('aria-label', title);
                }
                button.setAttribute('tabindex', '0');
            });
        }
        logger.info('ARIA labels set up');
    }
    /**
     * 设置键盘导航
     */
    setupKeyboardNav() {
        if (!this.config.enableKeyboardNav)
            return;
        // 收集可聚焦元素
        this.collectFocusableElements();
        // 监听键盘事件
        document.addEventListener('keydown', this.handleKeyboardNav.bind(this));
        logger.info('Keyboard navigation set up');
    }
    /**
     * 收集可聚焦元素
     */
    collectFocusableElements() {
        const selectors = [
            '.ldesign-toolbar button',
            '.ldesign-editor-content',
            '.ldesign-dialog button',
            '.ldesign-dropdown-item',
        ];
        this.focusableElements = [];
        selectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el) => {
                if (el instanceof HTMLElement && !el.hasAttribute('disabled'))
                    this.focusableElements.push(el);
            });
        });
    }
    /**
     * 处理键盘导航
     */
    handleKeyboardNav(e) {
        // Tab键导航
        if (e.key === 'Tab') {
            if (this.focusableElements.length === 0)
                this.collectFocusableElements();
            if (e.shiftKey)
                this.focusPrevious();
            else
                this.focusNext();
            e.preventDefault();
        }
        // Escape键关闭对话框
        if (e.key === 'Escape') {
            const dialog = document.querySelector('.ldesign-dialog');
            if (dialog) {
                const closeBtn = dialog.querySelector('.dialog-close');
                if (closeBtn instanceof HTMLElement)
                    closeBtn.click();
            }
        }
    }
    /**
     * 聚焦下一个元素
     */
    focusNext() {
        this.currentFocusIndex = (this.currentFocusIndex + 1) % this.focusableElements.length;
        this.focusableElements[this.currentFocusIndex]?.focus();
    }
    /**
     * 聚焦上一个元素
     */
    focusPrevious() {
        this.currentFocusIndex = (this.currentFocusIndex - 1 + this.focusableElements.length) % this.focusableElements.length;
        this.focusableElements[this.currentFocusIndex]?.focus();
    }
    /**
     * 启用高对比度模式
     */
    enableHighContrast() {
        document.documentElement.classList.add('high-contrast');
        logger.info('High contrast mode enabled');
    }
    /**
     * 禁用高对比度模式
     */
    disableHighContrast() {
        document.documentElement.classList.remove('high-contrast');
        logger.info('High contrast mode disabled');
    }
    /**
     * 切换高对比度模式
     */
    toggleHighContrast() {
        if (document.documentElement.classList.contains('high-contrast'))
            this.disableHighContrast();
        else
            this.enableHighContrast();
    }
    /**
     * 宣告内容变化（屏幕阅读器）
     * @param message - 消息内容
     * @param priority - 优先级（polite/assertive）
     */
    announce(message, priority = 'polite') {
        if (!this.config.enableScreenReader)
            return;
        // 创建或获取aria-live区域
        let liveRegion = document.getElementById('editor-aria-live');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'editor-aria-live';
            liveRegion.setAttribute('aria-live', priority);
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
            document.body.appendChild(liveRegion);
        }
        liveRegion.setAttribute('aria-live', priority);
        liveRegion.textContent = message;
        // 清除消息
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
    /**
     * 检查无障碍性问题
     * @returns 问题列表
     */
    checkAccessibility() {
        const issues = [];
        // 检查编辑器ARIA
        if (this.editor.contentElement) {
            if (!this.editor.contentElement.hasAttribute('aria-label'))
                issues.push('编辑器缺少aria-label');
            if (!this.editor.contentElement.hasAttribute('role'))
                issues.push('编辑器缺少role属性');
        }
        // 检查工具栏按钮
        const buttons = document.querySelectorAll('.ldesign-toolbar button');
        buttons.forEach((button, index) => {
            if (!button.hasAttribute('aria-label'))
                issues.push(`工具栏按钮${index + 1}缺少aria-label`);
        });
        // 检查图片alt
        if (this.editor.contentElement) {
            const images = this.editor.contentElement.querySelectorAll('img');
            images.forEach((img, index) => {
                if (!img.hasAttribute('alt'))
                    issues.push(`图片${index + 1}缺少alt属性`);
            });
        }
        return issues;
    }
    /**
     * 自动修复无障碍性问题
     */
    autoFix() {
        const issues = this.checkAccessibility();
        logger.info(`Found ${issues.length} accessibility issues, attempting to fix...`);
        this.setupARIA();
        // 修复图片alt
        if (this.editor.contentElement) {
            const images = this.editor.contentElement.querySelectorAll('img:not([alt])');
            images.forEach((img) => {
                img.setAttribute('alt', '图片');
            });
        }
        logger.info('Accessibility auto-fix completed');
    }
    /**
     * 清理资源
     */
    destroy() {
        const liveRegion = document.getElementById('editor-aria-live');
        if (liveRegion)
            liveRegion.remove();
    }
}
/**
 * 创建无障碍访问插件
 */
export function createAccessibilityPlugin(config = {}) {
    let manager = null;
    return createPlugin({
        name: 'accessibility',
        commands: {
            // 切换高对比度
            'a11y:toggleHighContrast': (state, dispatch, editor) => {
                if (manager) {
                    manager.toggleHighContrast();
                    return true;
                }
                return false;
            },
            // 检查无障碍性
            'a11y:check': (state, dispatch, editor) => {
                if (manager) {
                    const issues = manager.checkAccessibility();
                    logger.info('Accessibility issues:', issues);
                    return true;
                }
                return false;
            },
            // 自动修复
            'a11y:autoFix': (state, dispatch, editor) => {
                if (manager) {
                    manager.autoFix();
                    return true;
                }
                return false;
            },
        },
        keys: {
            'Mod-Shift-a': (state, dispatch, editor) => {
                return editor?.commands.execute('a11y:check') || false;
            },
        },
        init(editor) {
            manager = new AccessibilityManager(editor, config);
            editor.accessibility = manager;
            // 设置ARIA
            manager.setupARIA();
            // 设置键盘导航
            if (config.enableKeyboardNav)
                manager.setupKeyboardNav();
            // 启用高对比度模式
            if (config.enableHighContrast)
                manager.enableHighContrast();
            logger.info('Accessibility initialized');
        },
        destroy() {
            if (manager) {
                manager.destroy();
                manager = null;
            }
        },
    });
}
/**
 * 默认导出
 */
export const AccessibilityPlugin = createAccessibilityPlugin();
/**
 * 获取无障碍管理器
 * @param editor - 编辑器实例
 * @returns 无障碍管理器
 */
export function getAccessibilityManager(editor) {
    return editor.accessibility || null;
}
//# sourceMappingURL=index.js.map