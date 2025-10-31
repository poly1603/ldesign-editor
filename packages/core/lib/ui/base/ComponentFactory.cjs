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

var index = require('../../i18n/index.cjs');
var IconManager = require('../../icons/IconManager.cjs');

/**
 * UI组件工厂
 * 提供统一的组件创建方法，减少重复代码
 */
/**
 * UI组件工厂类
 */
class ComponentFactory {
    constructor() {
        this.iconManager = IconManager.getIconManager();
        this.i18n = index.getI18n();
    }
    /**
     * 创建按钮
     */
    createButton(options) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = this.getButtonClassName(options);
        if (options.title)
            button.title = options.title;
        if (options.disabled)
            button.disabled = true;
        // 按钮内容容器
        const content = document.createElement('span');
        content.className = 'btn-content';
        // 添加图标
        if (options.icon) {
            const iconEl = this.iconManager.createIconElement(options.icon, {
                size: this.getIconSize(options.size),
                ...options.iconOptions,
            });
            content.appendChild(iconEl);
        }
        // 添加文本
        if (options.label) {
            const label = document.createElement('span');
            label.className = 'btn-label';
            label.textContent = options.label;
            content.appendChild(label);
        }
        button.appendChild(content);
        // 添加加载状态
        if (options.loading)
            this.setButtonLoading(button, true);
        // 添加点击事件
        if (options.onClick)
            button.addEventListener('click', options.onClick);
        // 应用样式
        this.applyButtonStyles(button, options);
        return button;
    }
    /**
     * 创建图标按钮
     */
    createIconButton(icon, options = {}) {
        return this.createButton({
            icon,
            type: options.type || 'text',
            ...options,
        });
    }
    /**
     * 创建输入框
     */
    createInput(options) {
        const input = document.createElement('input');
        input.type = options.type || 'text';
        input.className = `input ${options.className || ''}`;
        if (options.placeholder)
            input.placeholder = options.placeholder;
        if (options.value)
            input.value = options.value;
        if (options.disabled)
            input.disabled = true;
        if (options.required)
            input.required = true;
        if (options.onChange) {
            input.addEventListener('input', (e) => {
                options.onChange(e.target.value);
            });
        }
        // 应用样式
        this.applyInputStyles(input);
        return input;
    }
    /**
     * 创建文本域
     */
    createTextarea(options) {
        const textarea = document.createElement('textarea');
        textarea.className = `textarea ${options.className || ''}`;
        if (options.placeholder)
            textarea.placeholder = options.placeholder;
        if (options.value)
            textarea.value = options.value;
        if (options.disabled)
            textarea.disabled = true;
        if (options.required)
            textarea.required = true;
        if (options.rows)
            textarea.rows = options.rows;
        if (options.onChange) {
            textarea.addEventListener('input', (e) => {
                options.onChange(e.target.value);
            });
        }
        // 应用样式
        this.applyTextareaStyles(textarea);
        return textarea;
    }
    /**
     * 创建下拉选择框
     */
    createSelect(options) {
        const select = document.createElement('select');
        select.className = `select ${options.className || ''}`;
        if (options.placeholder) {
            const placeholderOption = document.createElement('option');
            placeholderOption.value = '';
            placeholderOption.textContent = options.placeholder;
            placeholderOption.disabled = true;
            placeholderOption.selected = !options.value;
            select.appendChild(placeholderOption);
        }
        options.options.forEach((opt) => {
            const option = document.createElement('option');
            option.value = String(opt.value);
            option.textContent = opt.label;
            if (opt.disabled)
                option.disabled = true;
            if (opt.value === options.value)
                option.selected = true;
            select.appendChild(option);
        });
        if (options.disabled)
            select.disabled = true;
        if (options.onChange) {
            select.addEventListener('change', (e) => {
                const value = e.target.value;
                options.onChange(isNaN(Number(value)) ? value : Number(value));
            });
        }
        // 应用样式
        this.applySelectStyles(select);
        return select;
    }
    /**
     * 创建复选框
     */
    createCheckbox(label, checked = false, onChange) {
        const container = document.createElement('label');
        container.className = 'checkbox-container';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'checkbox';
        input.checked = checked;
        if (onChange) {
            input.addEventListener('change', (e) => {
                onChange(e.target.checked);
            });
        }
        const labelSpan = document.createElement('span');
        labelSpan.className = 'checkbox-label';
        labelSpan.textContent = label;
        container.appendChild(input);
        container.appendChild(labelSpan);
        // 应用样式
        this.applyCheckboxStyles(container);
        return container;
    }
    /**
     * 创建分隔线
     */
    createDivider(className = '') {
        const divider = document.createElement('div');
        divider.className = `divider ${className}`;
        divider.style.cssText = `
      height: 1px;
      background: var(--editor-color-border, #e5e7eb);
      margin: 8px 0;
    `;
        return divider;
    }
    /**
     * 创建标签
     */
    createLabel(text, htmlFor) {
        const label = document.createElement('label');
        label.className = 'label';
        label.textContent = text;
        if (htmlFor)
            label.htmlFor = htmlFor;
        label.style.cssText = `
      display: block;
      margin-bottom: 4px;
      font-size: 14px;
      font-weight: 500;
      color: var(--editor-color-text-primary, #1f2937);
    `;
        return label;
    }
    /**
     * 创建表单组
     */
    createFormGroup(label, input) {
        const group = document.createElement('div');
        group.className = 'form-group';
        group.style.cssText = `
      margin-bottom: 16px;
    `;
        const labelEl = this.createLabel(label);
        group.appendChild(labelEl);
        group.appendChild(input);
        return group;
    }
    /**
     * 创建卡片
     */
    createCard(options) {
        const card = document.createElement('div');
        card.className = `card ${options.className || ''}`;
        card.style.cssText = `
      background: var(--editor-color-background-paper, #f9fafb);
      border: 1px solid var(--editor-color-border, #e5e7eb);
      border-radius: 8px;
      padding: 16px;
    `;
        if (options.title) {
            const title = document.createElement('h3');
            title.className = 'card-title';
            title.textContent = options.title;
            title.style.cssText = `
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--editor-color-text-primary, #1f2937);
      `;
            card.appendChild(title);
        }
        if (options.content) {
            const content = document.createElement('div');
            content.className = 'card-content';
            if (typeof options.content === 'string')
                content.textContent = options.content;
            else
                content.appendChild(options.content);
            card.appendChild(content);
        }
        return card;
    }
    /**
     * 获取按钮类名
     */
    getButtonClassName(options) {
        const classes = ['btn'];
        if (options.type)
            classes.push(`btn-${options.type}`);
        if (options.size)
            classes.push(`btn-${options.size}`);
        if (options.loading)
            classes.push('btn-loading');
        if (options.className)
            classes.push(options.className);
        return classes.join(' ');
    }
    /**
     * 获取图标大小
     */
    getIconSize(size) {
        const sizes = {
            small: 14,
            medium: 16,
            large: 20,
        };
        return sizes[size] || sizes.medium;
    }
    /**
     * 设置按钮加载状态
     */
    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('btn-loading');
            button.disabled = true;
            // 添加加载图标
            const spinner = this.iconManager.createIconElement('refresh-cw', {
                size: 16,
                spinning: true,
                className: 'btn-spinner',
            });
            const content = button.querySelector('.btn-content');
            if (content)
                content.insertBefore(spinner, content.firstChild);
        }
        else {
            button.classList.remove('btn-loading');
            button.disabled = false;
            // 移除加载图标
            const spinner = button.querySelector('.btn-spinner');
            if (spinner)
                spinner.remove();
        }
    }
    /**
     * 应用按钮样式
     */
    applyButtonStyles(button, options) {
        const typeStyles = {
            primary: `
        background: var(--editor-color-primary, #3b82f6);
        color: white;
        border: none;
      `,
            secondary: `
        background: var(--editor-color-background-paper, #f3f4f6);
        color: var(--editor-color-text-primary, #374151);
        border: 1px solid var(--editor-color-border, #d1d5db);
      `,
            danger: `
        background: var(--editor-color-error, #ef4444);
        color: white;
        border: none;
      `,
            success: `
        background: var(--editor-color-success, #10b981);
        color: white;
        border: none;
      `,
            warning: `
        background: var(--editor-color-warning, #f59e0b);
        color: white;
        border: none;
      `,
            link: `
        background: none;
        color: var(--editor-color-primary, #3b82f6);
        border: none;
        padding: 8px 12px;
      `,
            text: `
        background: none;
        color: var(--editor-color-text-primary, #374151);
        border: none;
        padding: 8px 12px;
      `,
        };
        const sizeStyles = {
            small: 'padding: 6px 12px; font-size: 12px;',
            medium: 'padding: 8px 16px; font-size: 14px;',
            large: 'padding: 10px 20px; font-size: 16px;',
        };
        button.style.cssText = `
      ${typeStyles[options.type || 'secondary']}
      ${sizeStyles[options.size || 'medium']}
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    `;
    }
    /**
     * 应用输入框样式
     */
    applyInputStyles(input) {
        input.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--editor-color-border, #d1d5db);
      border-radius: 6px;
      font-size: 14px;
      color: var(--editor-color-text-primary, #1f2937);
      background: var(--editor-color-background, #ffffff);
      transition: all 0.2s;
    `;
        input.addEventListener('focus', () => {
            input.style.outline = 'none';
            input.style.borderColor = 'var(--editor-color-primary, #3b82f6)';
            input.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = 'var(--editor-color-border, #d1d5db)';
            input.style.boxShadow = 'none';
        });
    }
    /**
     * 应用文本域样式
     */
    applyTextareaStyles(textarea) {
        textarea.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--editor-color-border, #d1d5db);
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      color: var(--editor-color-text-primary, #1f2937);
      background: var(--editor-color-background, #ffffff);
      transition: all 0.2s;
      resize: vertical;
    `;
        textarea.addEventListener('focus', () => {
            textarea.style.outline = 'none';
            textarea.style.borderColor = 'var(--editor-color-primary, #3b82f6)';
            textarea.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        });
        textarea.addEventListener('blur', () => {
            textarea.style.borderColor = 'var(--editor-color-border, #d1d5db)';
            textarea.style.boxShadow = 'none';
        });
    }
    /**
     * 应用下拉框样式
     */
    applySelectStyles(select) {
        select.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--editor-color-border, #d1d5db);
      border-radius: 6px;
      font-size: 14px;
      color: var(--editor-color-text-primary, #1f2937);
      background: var(--editor-color-background, #ffffff);
      cursor: pointer;
      transition: all 0.2s;
    `;
        select.addEventListener('focus', () => {
            select.style.outline = 'none';
            select.style.borderColor = 'var(--editor-color-primary, #3b82f6)';
            select.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        });
        select.addEventListener('blur', () => {
            select.style.borderColor = 'var(--editor-color-border, #d1d5db)';
            select.style.boxShadow = 'none';
        });
    }
    /**
     * 应用复选框样式
     */
    applyCheckboxStyles(container) {
        container.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    `;
        const checkbox = container.querySelector('.checkbox');
        if (checkbox) {
            checkbox.style.cssText = `
        width: 16px;
        height: 16px;
        cursor: pointer;
      `;
        }
        const label = container.querySelector('.checkbox-label');
        if (label) {
            label.style.cssText = `
        font-size: 14px;
        color: var(--editor-color-text-primary, #1f2937);
      `;
        }
    }
}
// 全局单例
let factoryInstance = null;
/**
 * 获取组件工厂实例
 */
function getComponentFactory() {
    if (!factoryInstance)
        factoryInstance = new ComponentFactory();
    return factoryInstance;
}
/**
 * 便捷函数
 */
function createButton(options) {
    return getComponentFactory().createButton(options);
}
function createIconButton(icon, options) {
    return getComponentFactory().createIconButton(icon, options);
}
function createInput(options) {
    return getComponentFactory().createInput(options);
}
function createSelect(options) {
    return getComponentFactory().createSelect(options);
}
function createCheckbox(label, checked, onChange) {
    return getComponentFactory().createCheckbox(label, checked, onChange);
}

exports.ComponentFactory = ComponentFactory;
exports.createButton = createButton;
exports.createCheckbox = createCheckbox;
exports.createIconButton = createIconButton;
exports.createInput = createInput;
exports.createSelect = createSelect;
exports.getComponentFactory = getComponentFactory;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ComponentFactory.cjs.map
