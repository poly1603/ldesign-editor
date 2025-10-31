/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { throttle } from '../utils/helpers.js';
import { EventEmitter } from '../utils/event.js';

/**
 * 虚拟滚动器 - 支持超大文档的高性能滚动
 *
 * 特性：
 * - 支持10万+行文档流畅滚动
 * - 只渲染可视区域内容
 * - 动态回收和复用DOM节点
 * - 平滑滚动和快速跳转
 */
class VirtualScroller extends EventEmitter {
    constructor(options) {
        super();
        this.items = [];
        this.itemHeights = new Map();
        this.nodePool = [];
        this.renderedItems = new Map();
        this.isScrolling = false;
        this.measurementCache = new Map();
        this.options = {
            itemHeight: 50,
            bufferSize: 5,
            dynamicHeight: false,
            scrollThrottle: 16,
            smoothScroll: true,
            maxCachedNodes: 100,
            renderer: this.defaultRenderer.bind(this),
            ...options,
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
        if (index !== undefined)
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
        this.items = this.items.filter(item => !idSet.has(item.id));
        // 清理缓存
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
            behavior: smooth && this.options.smoothScroll ? 'smooth' : 'auto',
        });
    }
    /**
     * 滚动到指定项目
     */
    scrollToItem(id, position = 'start') {
        const index = this.items.findIndex(item => item.id === id);
        if (index === -1)
            return;
        const offset = this.calculateItemOffset(index);
        let scrollPosition = offset;
        if (position === 'center')
            scrollPosition = offset - this.metrics.containerHeight / 2 + this.getItemHeight(index) / 2;
        else if (position === 'end')
            scrollPosition = offset + this.getItemHeight(index) - this.metrics.containerHeight;
        this.scrollTo(scrollPosition);
    }
    /**
     * 获取当前可见的项目
     */
    getVisibleItems() {
        const { visibleStart, visibleEnd } = this.metrics;
        return this.items.slice(visibleStart, visibleEnd + 1);
    }
    /**
     * 刷新指定项目
     */
    refreshItem(id) {
        const element = this.renderedItems.get(id);
        if (!element)
            return;
        const item = this.items.find(i => i.id === id);
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
        this.viewport.removeEventListener('scroll', this.scrollHandler);
        this.resizeObserver.disconnect();
        this.intersectionObserver.disconnect();
        this.nodePool = [];
        this.renderedItems.clear();
        this.itemHeights.clear();
        this.measurementCache.clear();
    }
    setupDOM() {
        // 创建视口容器
        this.viewport = document.createElement('div');
        this.viewport.className = 'virtual-scroller-viewport';
        this.viewport.style.cssText = `
      height: 100%;
      overflow-y: auto;
      position: relative;
    `;
        // 创建内容容器
        this.content = document.createElement('div');
        this.content.className = 'virtual-scroller-content';
        this.content.style.cssText = `
      position: relative;
      width: 100%;
    `;
        this.viewport.appendChild(this.content);
        this.container.appendChild(this.viewport);
    }
    setupEventListeners() {
        this.viewport.addEventListener('scroll', this.scrollHandler);
    }
    setupObservers() {
        // 监听容器大小变化
        this.resizeObserver = new ResizeObserver((entries) => {
            this.metrics = this.calculateMetrics();
            this.render();
        });
        this.resizeObserver.observe(this.viewport);
        // 监听项目可见性（用于动态高度测量）
        if (this.options.dynamicHeight) {
            this.intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting)
                        this.measureItem(entry.target);
                });
            }, { root: this.viewport });
        }
    }
    handleScroll() {
        this.isScrolling = true;
        clearTimeout(this.scrollTimeout);
        this.metrics = this.calculateMetrics();
        this.render();
        this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
            this.emit('scrollEnd', this.metrics);
        }, 150);
        this.emit('scroll', this.metrics);
    }
    calculateMetrics() {
        const scrollTop = this.viewport.scrollTop;
        const containerHeight = this.viewport.clientHeight;
        const scrollHeight = this.content.scrollHeight;
        // 计算可见区域
        const visibleStart = this.findStartIndex(scrollTop);
        const visibleEnd = this.findEndIndex(scrollTop + containerHeight);
        // 计算渲染区域（包含缓冲区）
        const renderStart = Math.max(0, visibleStart - this.options.bufferSize);
        const renderEnd = Math.min(this.items.length - 1, visibleEnd + this.options.bufferSize);
        return {
            scrollTop,
            scrollHeight,
            containerHeight,
            visibleStart,
            visibleEnd,
            renderStart,
            renderEnd,
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
        }
        else {
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
        }
        else {
            return Math.ceil(scrollBottom / this.options.itemHeight);
        }
    }
    getItemHeight(index) {
        const item = this.items[index];
        if (!item)
            return this.options.itemHeight;
        if (this.options.dynamicHeight) {
            // 优先使用缓存的高度
            if (this.itemHeights.has(item.id))
                return this.itemHeights.get(item.id);
            // 使用预设高度或默认高度
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
        }
        else {
            return index * this.options.itemHeight;
        }
    }
    updateContentHeight() {
        let totalHeight;
        if (this.options.dynamicHeight) {
            totalHeight = 0;
            for (let i = 0; i < this.items.length; i++)
                totalHeight += this.getItemHeight(i);
        }
        else {
            totalHeight = this.items.length * this.options.itemHeight;
        }
        this.content.style.height = `${totalHeight}px`;
    }
    render() {
        const { renderStart, renderEnd } = this.metrics;
        const fragment = document.createDocumentFragment();
        const renderedIds = new Set();
        // 移除不在渲染范围内的元素
        this.renderedItems.forEach((element, id) => {
            const index = this.items.findIndex(item => item.id === id);
            if (index < renderStart || index > renderEnd) {
                this.recycleNode(element);
                this.renderedItems.delete(id);
            }
        });
        // 渲染可见项目
        for (let i = renderStart; i <= renderEnd; i++) {
            const item = this.items[i];
            if (!item)
                continue;
            renderedIds.add(item.id);
            // 如果已经渲染，跳过
            if (this.renderedItems.has(item.id))
                continue;
            // 获取或创建元素
            const element = this.getOrCreateNode();
            const renderedElement = this.options.renderer(item.data, i);
            // 复制渲染的内容到池化的元素
            element.innerHTML = renderedElement.innerHTML;
            element.className = renderedElement.className;
            element.setAttribute('data-index', String(i));
            element.setAttribute('data-id', String(item.id));
            // 设置位置
            const offset = this.calculateItemOffset(i);
            element.style.position = 'absolute';
            element.style.top = `${offset}px`;
            element.style.left = '0';
            element.style.right = '0';
            // 动态高度监听
            if (this.options.dynamicHeight && this.intersectionObserver)
                this.intersectionObserver.observe(element);
            fragment.appendChild(element);
            this.renderedItems.set(item.id, element);
        }
        // 批量添加到DOM
        if (fragment.childNodes.length > 0)
            this.content.appendChild(fragment);
    }
    getOrCreateNode() {
        if (this.nodePool.length > 0)
            return this.nodePool.pop();
        const element = document.createElement('div');
        element.className = 'virtual-scroller-item';
        return element;
    }
    recycleNode(element) {
        if (this.nodePool.length < this.options.maxCachedNodes) {
            element.remove();
            element.innerHTML = '';
            element.style.cssText = '';
            element.className = 'virtual-scroller-item';
            this.nodePool.push(element);
        }
        else {
            element.remove();
        }
    }
    measureItem(element) {
        const id = element.getAttribute('data-id');
        if (!id)
            return;
        const height = element.offsetHeight;
        const previousHeight = this.itemHeights.get(id) || this.options.itemHeight;
        if (height !== previousHeight) {
            this.itemHeights.set(id, height);
            this.updateContentHeight();
            // 如果高度变化较大，可能需要重新渲染
            if (Math.abs(height - previousHeight) > 10)
                this.render();
        }
    }
    defaultRenderer(data, index) {
        const element = document.createElement('div');
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
            memoryUsage: this.estimateMemoryUsage(),
        };
    }
    estimateMemoryUsage() {
        // 估算内存使用（字节）
        const itemMemory = this.renderedItems.size * 1024; // 假设每个渲染项1KB
        const cacheMemory = this.nodePool.length * 512; // 假设每个缓存节点512B
        const heightCacheMemory = this.itemHeights.size * 16; // 每个高度缓存16B
        return itemMemory + cacheMemory + heightCacheMemory;
    }
}

export { VirtualScroller };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=VirtualScroller.js.map
