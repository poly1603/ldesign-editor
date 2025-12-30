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

var IconManager = require('../icons/IconManager.cjs');

const $ = {
  /**
   * 创建元素
   */
  create(tag, props, children) {
    const el = document.createElement(tag);
    if (props) {
      Object.entries(props).forEach(([key, value]) => {
        if (key === "className")
          el.className = value;
        else if (key === "style" && typeof value === "string")
          el.style.cssText = value;
        else if (key === "html")
          el.innerHTML = value;
        else if (key === "text")
          el.textContent = value;
        else
          el[key] = value;
      });
    }
    if (children) {
      children.forEach((child) => {
        if (typeof child === "string")
          el.appendChild(document.createTextNode(child));
        else
          el.appendChild(child);
      });
    }
    return el;
  },
  /**
   * 选择元素
   */
  select(selector) {
    return document.querySelector(selector);
  },
  /**
   * 选择所有元素
   */
  selectAll(selector) {
    return Array.from(document.querySelectorAll(selector));
  },
  /**
   * 添加样式
   */
  style(el, styles) {
    if (typeof styles === "string")
      el.style.cssText = styles;
    else
      Object.assign(el.style, styles);
  },
  /**
   * 添加类
   */
  addClass(el, ...classes) {
    el.classList.add(...classes);
  },
  /**
   * 移除类
   */
  removeClass(el, ...classes) {
    el.classList.remove(...classes);
  },
  /**
   * 切换类
   */
  toggleClass(el, className, force) {
    el.classList.toggle(className, force);
  },
  /**
   * 移除元素
   */
  remove(el) {
    el.remove();
  },
  /**
   * 清空内容
   */
  empty(el) {
    el.innerHTML = "";
  },
  /**
   * 显示/隐藏
   */
  show(el) {
    el.style.display = "";
  },
  hide(el) {
    el.style.display = "none";
  },
  toggle(el) {
    el.style.display = el.style.display === "none" ? "" : "none";
  }
};
const on = {
  /**
   * 绑定事件
   */
  click(el, handler) {
    el.addEventListener("click", handler);
  },
  change(el, handler) {
    el.addEventListener("change", handler);
  },
  input(el, handler) {
    el.addEventListener("input", handler);
  },
  keydown(el, handler) {
    el.addEventListener("keydown", handler);
  },
  /**
   * 绑定一次性事件
   */
  once(el, event, handler) {
    el.addEventListener(event, handler, {
      once: true
    });
  },
  /**
   * 解绑事件
   */
  off(el, event, handler) {
    el.removeEventListener(event, handler);
  }
};
function cmd(editor) {
  return {
    /**
     * 切换格式
     */
    toggle(format) {
      return editor.commands.execute(`toggle${capitalize(format)}`);
    },
    /**
     * 插入内容
     */
    insert(type, data) {
      return editor.commands.execute(`insert${capitalize(type)}`, data);
    },
    /**
     * 设置格式
     */
    set(property, value) {
      return editor.commands.execute(`set${capitalize(property)}`, value);
    },
    /**
     * 执行命令
     */
    exec(command, ...args) {
      return editor.commands.execute(command, ...args);
    }
  };
}
const ui = {
  /**
   * 创建按钮
   */
  button(text, onClick, icon) {
    const btn = $.create("button", {
      text,
      className: "btn",
      style: `
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        background: var(--editor-color-primary, #3b82f6);
        color: white;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      `
    });
    if (icon) {
      const iconEl = IconManager.getIconManager().createIconElement(icon, {
        size: 16
      });
      btn.insertBefore(iconEl, btn.firstChild);
    }
    on.click(btn, onClick);
    return btn;
  },
  /**
   * 创建输入框
   */
  input(placeholder, onChange) {
    const input = $.create("input", {
      type: "text",
      placeholder,
      className: "input",
      style: `
        padding: 8px 12px;
        border: 1px solid var(--editor-color-border, #d1d5db);
        border-radius: 6px;
        font-size: 14px;
      `
    });
    if (onChange)
      on.input(input, (e) => onChange(e.target.value));
    return input;
  },
  /**
   * 创建对话框
   */
  dialog(title, content) {
    const overlay = $.create("div", {
      className: "dialog-overlay",
      style: `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      `
    });
    const dialog = $.create("div", {
      className: "dialog",
      style: `
        background: white;
        border-radius: 8px;
        min-width: 400px;
        max-width: 600px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      `
    });
    const header = $.create("div", {
      html: `<h2 style="margin: 0;">${title}</h2>`,
      style: `
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
      `
    });
    const body = $.create("div", {
      className: "dialog-body",
      style: "padding: 20px;"
    });
    if (typeof content === "string")
      body.innerHTML = content;
    else
      body.appendChild(content);
    dialog.appendChild(header);
    dialog.appendChild(body);
    overlay.appendChild(dialog);
    on.click(overlay, (e) => {
      if (e.target === overlay)
        $.remove(overlay);
    });
    return overlay;
  },
  /**
   * 显示提示
   */
  toast(message, type = "info") {
    const colors = {
      success: "#10b981",
      error: "#ef4444",
      info: "#3b82f6"
    };
    const toast = $.create("div", {
      text: message,
      className: "toast",
      style: `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${colors[type]};
        color: white;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        animation: slideIn 0.3s ease;
      `
    });
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease";
      setTimeout(() => $.remove(toast), 300);
    }, 3e3);
  }
};
const str = {
  /**
   * 首字母大写
   */
  capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  },
  /**
   * 驼峰转短横线
   */
  kebab(s) {
    return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
  },
  /**
   * 短横线转驼峰
   */
  camel(s) {
    return s.replace(/-([a-z])/g, (_, m) => m.toUpperCase());
  },
  /**
   * 截断
   */
  truncate(s, maxLength, suffix = "...") {
    if (s.length <= maxLength)
      return s;
    return s.slice(0, maxLength - suffix.length) + suffix;
  }
};
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function css(styles) {
  return Object.entries(styles).map(([key, value]) => {
    const cssKey = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    return `${cssKey}: ${value}${typeof value === "number" && key !== "opacity" && key !== "zIndex" ? "px" : ""}`;
  }).join("; ");
}
function classNames(...args) {
  return args.filter(Boolean).join(" ");
}

exports.$ = $;
exports.classNames = classNames;
exports.cmd = cmd;
exports.css = css;
exports.on = on;
exports.str = str;
exports.ui = ui;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=simplify.cjs.map
