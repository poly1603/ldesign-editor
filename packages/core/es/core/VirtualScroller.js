/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { throttle } from '../utils/helpers.js';
import { EventEmitter } from '../utils/event.js';

class VirtualScroller extends EventEmitter {
  constructor(options) {
    super();
    this.items = [];
    this.itemHeights = /* @__PURE__ */ new Map();
    this.nodePool = [];
    this.renderedItems = /* @__PURE__ */ new Map();
    this.isScrolling = false;
    this.measurementCache = /* @__PURE__ */ new Map();
    this.options = {
      itemHeight: 50,
      bufferSize: 5,
      dynamicHeight: false,
      scrollThrottle: 16,
      smoothScroll: true,
      maxCachedNodes: 100,
      renderer: this.defaultRenderer.bind(this),
      ...options
    };
    this.container = options.container;
    this.setupDOM();
    this.setupEventListeners();
    this.setupObservers();
    this.metrics = this.calculateMetrics();
    this.scrollHandler = throttle(() => this.handleScroll(), this.options.scrollThrottle);
  }
  /**
   * 设置要渲染的项目列表
   */
  setItems(items) {
    this.items = items;
    this.updateContentHeight();
    this.render();
  }
  /**
   * 添加项目
   */
  addItems(items, index) {
    if (index !== void 0)
      this.items.splice(index, 0, ...items);
    else
      this.items.push(...items);
    this.updateContentHeight();
    this.render();
  }
  /**
   * 移除项目
   */
  removeItems(ids) {
    const idSet = new Set(ids);
    this.items = this.items.filter((item) => !idSet.has(item.id));
    ids.forEach((id) => {
      this.itemHeights.delete(id);
      const element = this.renderedItems.get(id);
      if (element) {
        this.recycleNode(element);
        this.renderedItems.delete(id);
      }
    });
    this.updateContentHeight();
    this.render();
  }
  /**
   * 滚动到指定位置
   */
  scrollTo(position, smooth = true) {
    this.viewport.scrollTo({
      top: position,
      behavior: smooth && this.options.smoothScroll ? "smooth" : "auto"
    });
  }
  /**
   * 滚动到指定项目
   */
  scrollToItem(id, position = "start") {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1)
      return;
    const offset = this.calculateItemOffset(index);
    let scrollPosition = offset;
    if (position === "center")
      scrollPosition = offset - this.metrics.containerHeight / 2 + this.getItemHeight(index) / 2;
    else if (position === "end")
      scrollPosition = offset + this.getItemHeight(index) - this.metrics.containerHeight;
    this.scrollTo(scrollPosition);
  }
  /**
   * 获取当前可见的项目
   */
  getVisibleItems() {
    const {
      visibleStart,
      visibleEnd
    } = this.metrics;
    return this.items.slice(visibleStart, visibleEnd + 1);
  }
  /**
   * 刷新指定项目
   */
  refreshItem(id) {
    const element = this.renderedItems.get(id);
    if (!element)
      return;
    const item = this.items.find((i) => i.id === id);
    if (!item)
      return;
    const newElement = this.options.renderer(item.data, this.items.indexOf(item));
    element.replaceWith(newElement);
    this.renderedItems.set(id, newElement);
  }
  /**
   * 销毁虚拟滚动器
   */
  destroy() {
    this.viewport.removeEventListener("scroll", this.scrollHandler);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.nodePool = [];
    this.renderedItems.clear();
    this.itemHeights.clear();
    this.measurementCache.clear();
  }
  setupDOM() {
    this.viewport = document.createElement("div");
    this.viewport.className = "virtual-scroller-viewport";
    this.viewport.style.cssText = `
      height: 100%;
      overflow-y: auto;
      position: relative;
    `;
    this.content = document.createElement("div");
    this.content.className = "virtual-scroller-content";
    this.content.style.cssText = `
      position: relative;
      width: 100%;
    `;
    this.viewport.appendChild(this.content);
    this.container.appendChild(this.viewport);
  }
  setupEventListeners() {
    this.viewport.addEventListener("scroll", this.scrollHandler);
  }
  setupObservers() {
    this.resizeObserver = new ResizeObserver((entries) => {
      this.metrics = this.calculateMetrics();
      this.render();
    });
    this.resizeObserver.observe(this.viewport);
    if (this.options.dynamicHeight) {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            this.measureItem(entry.target);
        });
      }, {
        root: this.viewport
      });
    }
  }
  handleScroll() {
    this.isScrolling = true;
    clearTimeout(this.scrollTimeout);
    this.metrics = this.calculateMetrics();
    this.render();
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
      this.emit("scrollEnd", this.metrics);
    }, 150);
    this.emit("scroll", this.metrics);
  }
  calculateMetrics() {
    const scrollTop = this.viewport.scrollTop;
    const containerHeight = this.viewport.clientHeight;
    const scrollHeight = this.content.scrollHeight;
    const visibleStart = this.findStartIndex(scrollTop);
    const visibleEnd = this.findEndIndex(scrollTop + containerHeight);
    const renderStart = Math.max(0, visibleStart - this.options.bufferSize);
    const renderEnd = Math.min(this.items.length - 1, visibleEnd + this.options.bufferSize);
    return {
      scrollTop,
      scrollHeight,
      containerHeight,
      visibleStart,
      visibleEnd,
      renderStart,
      renderEnd
    };
  }
  findStartIndex(scrollTop) {
    if (this.options.dynamicHeight) {
      let accumulatedHeight = 0;
      for (let i = 0; i < this.items.length; i++) {
        if (accumulatedHeight >= scrollTop)
          return i;
        accumulatedHeight += this.getItemHeight(i);
      }
      return this.items.length - 1;
    } else {
      return Math.floor(scrollTop / this.options.itemHeight);
    }
  }
  findEndIndex(scrollBottom) {
    if (this.options.dynamicHeight) {
      let accumulatedHeight = 0;
      for (let i = 0; i < this.items.length; i++) {
        accumulatedHeight += this.getItemHeight(i);
        if (accumulatedHeight >= scrollBottom)
          return i;
      }
      return this.items.length - 1;
    } else {
      return Math.ceil(scrollBottom / this.options.itemHeight);
    }
  }
  getItemHeight(index) {
    const item = this.items[index];
    if (!item)
      return this.options.itemHeight;
    if (this.options.dynamicHeight) {
      if (this.itemHeights.has(item.id))
        return this.itemHeights.get(item.id);
      return item.height || this.options.itemHeight;
    }
    return this.options.itemHeight;
  }
  calculateItemOffset(index) {
    if (this.options.dynamicHeight) {
      let offset = 0;
      for (let i = 0; i < index; i++)
        offset += this.getItemHeight(i);
      return offset;
    } else {
      return index * this.options.itemHeight;
    }
  }
  updateContentHeight() {
    let totalHeight;
    if (this.options.dynamicHeight) {
      totalHeight = 0;
      for (let i = 0; i < this.items.length; i++)
        totalHeight += this.getItemHeight(i);
    } else {
      totalHeight = this.items.length * this.options.itemHeight;
    }
    this.content.style.height = `${totalHeight}px`;
  }
  render() {
    const {
      renderStart,
      renderEnd
    } = this.metrics;
    const fragment = document.createDocumentFragment();
    const renderedIds = /* @__PURE__ */ new Set();
    this.renderedItems.forEach((element, id) => {
      const index = this.items.findIndex((item) => item.id === id);
      if (index < renderStart || index > renderEnd) {
        this.recycleNode(element);
        this.renderedItems.delete(id);
      }
    });
    for (let i = renderStart; i <= renderEnd; i++) {
      const item = this.items[i];
      if (!item)
        continue;
      renderedIds.add(item.id);
      if (this.renderedItems.has(item.id))
        continue;
      const element = this.getOrCreateNode();
      const renderedElement = this.options.renderer(item.data, i);
      element.innerHTML = renderedElement.innerHTML;
      element.className = renderedElement.className;
      element.setAttribute("data-index", String(i));
      element.setAttribute("data-id", String(item.id));
      const offset = this.calculateItemOffset(i);
      element.style.position = "absolute";
      element.style.top = `${offset}px`;
      element.style.left = "0";
      element.style.right = "0";
      if (this.options.dynamicHeight && this.intersectionObserver)
        this.intersectionObserver.observe(element);
      fragment.appendChild(element);
      this.renderedItems.set(item.id, element);
    }
    if (fragment.childNodes.length > 0)
      this.content.appendChild(fragment);
  }
  getOrCreateNode() {
    if (this.nodePool.length > 0)
      return this.nodePool.pop();
    const element = document.createElement("div");
    element.className = "virtual-scroller-item";
    return element;
  }
  recycleNode(element) {
    if (this.nodePool.length < this.options.maxCachedNodes) {
      element.remove();
      element.innerHTML = "";
      element.style.cssText = "";
      element.className = "virtual-scroller-item";
      this.nodePool.push(element);
    } else {
      element.remove();
    }
  }
  measureItem(element) {
    const id = element.getAttribute("data-id");
    if (!id)
      return;
    const height = element.offsetHeight;
    const previousHeight = this.itemHeights.get(id) || this.options.itemHeight;
    if (height !== previousHeight) {
      this.itemHeights.set(id, height);
      this.updateContentHeight();
      if (Math.abs(height - previousHeight) > 10)
        this.render();
    }
  }
  defaultRenderer(data, index) {
    const element = document.createElement("div");
    element.textContent = `Item ${index}: ${JSON.stringify(data)}`;
    return element;
  }
  /**
   * 获取性能指标
   */
  getPerformanceMetrics() {
    return {
      totalItems: this.items.length,
      renderedItems: this.renderedItems.size,
      cachedNodes: this.nodePool.length,
      memoryUsage: this.estimateMemoryUsage()
    };
  }
  estimateMemoryUsage() {
    const itemMemory = this.renderedItems.size * 1024;
    const cacheMemory = this.nodePool.length * 512;
    const heightCacheMemory = this.itemHeights.size * 16;
    return itemMemory + cacheMemory + heightCacheMemory;
  }
}

export { VirtualScroller };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=VirtualScroller.js.map
