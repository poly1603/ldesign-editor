/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class BaseComponent {
  constructor(options = {}) {
    this.visible = false;
    this.eventListeners = /* @__PURE__ */ new Map();
    this.boundEvents = [];
    this.options = {
      zIndex: 9999,
      visible: false,
      destroyOnHide: false,
      ...options
    };
    this.element = this.createElement();
    this.setupElement();
    this.attachToDOM();
    if (this.options.visible)
      this.show();
  }
  /**
   * 设置元素基本属性
   */
  setupElement() {
    if (this.options.className)
      this.element.classList.add(...this.options.className.split(" "));
    if (this.options.zIndex)
      this.element.style.zIndex = this.options.zIndex.toString();
    this.element.style.display = "none";
  }
  /**
   * 将元素附加到DOM
   */
  attachToDOM() {
    const container = this.options.container || document.body;
    container.appendChild(this.element);
  }
  /**
   * 显示组件
   */
  show() {
    if (this.visible)
      return;
    this.beforeShow();
    this.element.style.display = "";
    this.visible = true;
    this.afterShow();
    this.emit("show");
  }
  /**
   * 隐藏组件
   */
  hide() {
    if (!this.visible)
      return;
    this.beforeHide();
    this.element.style.display = "none";
    this.visible = false;
    this.afterHide();
    this.emit("hide");
    if (this.options.destroyOnHide)
      this.destroy();
  }
  /**
   * 切换显示状态
   */
  toggle() {
    if (this.visible)
      this.hide();
    else
      this.show();
  }
  /**
   * 销毁组件
   */
  destroy() {
    this.beforeDestroy();
    this.removeAllEvents();
    if (this.element.parentNode)
      this.element.parentNode.removeChild(this.element);
    this.afterDestroy();
    this.emit("destroy");
  }
  /**
   * 设置位置
   */
  setPosition(x, y) {
    this.element.style.position = "fixed";
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  }
  /**
   * 获取位置
   */
  getPosition() {
    const rect = this.element.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top
    };
  }
  /**
   * 设置大小
   */
  setSize(width, height) {
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
  }
  /**
   * 获取大小
   */
  getSize() {
    const rect = this.element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height
    };
  }
  /**
   * 调整位置以保持在视口内
   */
  keepInViewport() {
    const rect = this.element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 10;
    let {
      x,
      y
    } = this.getPosition();
    if (rect.right > viewportWidth - padding)
      x = viewportWidth - rect.width - padding;
    if (x < padding)
      x = padding;
    if (rect.bottom > viewportHeight - padding)
      y = viewportHeight - rect.height - padding;
    if (y < padding)
      y = padding;
    this.setPosition(x, y);
  }
  /**
   * 绑定事件
   */
  bindEvent(element, type, handler, options) {
    element.addEventListener(type, handler, options);
    this.boundEvents.push({
      element,
      type,
      handler
    });
  }
  /**
   * 移除所有绑定的事件
   */
  removeAllEvents() {
    this.boundEvents.forEach(({
      element,
      type,
      handler
    }) => {
      element.removeEventListener(type, handler);
    });
    this.boundEvents = [];
    this.eventListeners.clear();
  }
  /**
   * 事件发射
   */
  emit(event, ...args) {
    const listeners = this.eventListeners.get(event);
    if (listeners)
      listeners.forEach((listener) => listener(...args));
  }
  /**
   * 事件监听
   */
  on(event, handler) {
    if (!this.eventListeners.has(event))
      this.eventListeners.set(event, /* @__PURE__ */ new Set());
    this.eventListeners.get(event).add(handler);
  }
  /**
   * 移除事件监听
   */
  off(event, handler) {
    const listeners = this.eventListeners.get(event);
    if (listeners)
      listeners.delete(handler);
  }
  /**
   * 生命周期钩子 - 显示前
   */
  beforeShow() {
  }
  /**
   * 生命周期钩子 - 显示后
   */
  afterShow() {
  }
  /**
   * 生命周期钩子 - 隐藏前
   */
  beforeHide() {
  }
  /**
   * 生命周期钩子 - 隐藏后
   */
  afterHide() {
  }
  /**
   * 生命周期钩子 - 销毁前
   */
  beforeDestroy() {
  }
  /**
   * 生命周期钩子 - 销毁后
   */
  afterDestroy() {
  }
  /**
   * 获取DOM元素
   */
  getElement() {
    return this.element;
  }
  /**
   * 是否可见
   */
  isVisible() {
    return this.visible;
  }
  /**
   * 添加CSS类
   */
  addClass(className) {
    this.element.classList.add(...className.split(" "));
  }
  /**
   * 移除CSS类
   */
  removeClass(className) {
    this.element.classList.remove(...className.split(" "));
  }
  /**
   * 切换CSS类
   */
  toggleClass(className) {
    this.element.classList.toggle(className);
  }
  /**
   * 设置样式
   */
  setStyle(styles) {
    Object.assign(this.element.style, styles);
  }
  /**
   * 设置属性
   */
  setAttribute(name, value) {
    this.element.setAttribute(name, value);
  }
  /**
   * 获取属性
   */
  getAttribute(name) {
    return this.element.getAttribute(name);
  }
  /**
   * 移除属性
   */
  removeAttribute(name) {
    this.element.removeAttribute(name);
  }
  /**
   * 设置内容
   */
  setContent(content) {
    if (typeof content === "string") {
      this.element.innerHTML = content;
    } else {
      this.element.innerHTML = "";
      this.element.appendChild(content);
    }
  }
  /**
   * 追加内容
   */
  appendContent(content) {
    if (typeof content === "string")
      this.element.insertAdjacentHTML("beforeend", content);
    else
      this.element.appendChild(content);
  }
  /**
   * 前置内容
   */
  prependContent(content) {
    if (typeof content === "string")
      this.element.insertAdjacentHTML("afterbegin", content);
    else
      this.element.insertBefore(content, this.element.firstChild);
  }
  /**
   * 聚焦
   */
  focus() {
    this.element.focus();
  }
  /**
   * 失焦
   */
  blur() {
    this.element.blur();
  }
}

export { BaseComponent };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=BaseComponent.js.map
