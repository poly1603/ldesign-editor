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

var logger$1 = require('../utils/logger.cjs');
var PerformanceMonitor = require('../utils/PerformanceMonitor.cjs');

const logger = logger$1.createLogger("IncrementalRenderer");
class IncrementalRenderer {
  constructor(options = {}) {
    this.patchQueue = [];
    this.isRendering = false;
    this.performanceMonitor = PerformanceMonitor.getPerformanceMonitor();
    this.lastRenderTime = 0;
    this.renderStats = {
      totalPatches: 0,
      batchCount: 0,
      averageBatchSize: 0,
      totalRenderTime: 0
    };
    this.options = {
      batchDelay: 16,
      // 约60fps
      maxBatchSize: 100,
      useRAF: true,
      useWorker: false,
      useVirtualDOM: false,
      ...options
    };
    this.setupWorker();
    this.setupObservers();
  }
  /**
   * 添加补丁到队列
   */
  queuePatch(patch) {
    this.patchQueue.push(patch);
    this.scheduleRender();
  }
  /**
   * 批量添加补丁
   */
  queuePatches(patches) {
    this.patchQueue.push(...patches);
    this.scheduleRender();
  }
  /**
   * 立即执行所有补丁
   */
  flush() {
    this.cancelScheduledRender();
    this.processBatch();
  }
  /**
   * 清空补丁队列
   */
  clear() {
    this.patchQueue = [];
    this.cancelScheduledRender();
  }
  /**
   * 销毁渲染器
   */
  destroy() {
    this.clear();
    this.mutationObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.resizeObserver?.disconnect();
    this.worker?.terminate();
  }
  /**
   * 调度渲染
   */
  scheduleRender() {
    if (this.isRendering || this.renderTimer)
      return;
    if (this.options.useRAF) {
      this.frameId = requestAnimationFrame(() => {
        this.renderTimer = null;
        this.processBatch();
      });
    } else {
      this.renderTimer = setTimeout(() => {
        this.renderTimer = null;
        this.processBatch();
      }, this.options.batchDelay);
    }
  }
  /**
   * 取消调度的渲染
   */
  cancelScheduledRender() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = void 0;
    }
    if (this.renderTimer) {
      clearTimeout(this.renderTimer);
      this.renderTimer = null;
    }
  }
  /**
   * 处理批次
   */
  processBatch() {
    if (this.patchQueue.length === 0)
      return;
    const timerName = "incrementalRender.batch";
    this.performanceMonitor.start(timerName);
    this.isRendering = true;
    try {
      const patches = this.patchQueue.splice(0, this.options.maxBatchSize);
      const optimizedPatches = this.optimizePatches(patches);
      if (this.options.useWorker && this.worker)
        this.applyPatchesInWorker(optimizedPatches);
      else
        this.applyPatches(optimizedPatches);
      this.updateStats(optimizedPatches.length);
      if (this.patchQueue.length > 0)
        this.scheduleRender();
    } finally {
      this.isRendering = false;
      this.performanceMonitor.end(timerName);
    }
  }
  /**
   * 优化补丁
   */
  optimizePatches(patches) {
    const patchMap = /* @__PURE__ */ new Map();
    const optimized = [];
    patches.forEach((patch) => {
      if (patch.target) {
        if (!patchMap.has(patch.target))
          patchMap.set(patch.target, []);
        patchMap.get(patch.target).push(patch);
      } else {
        optimized.push(patch);
      }
    });
    patchMap.forEach((targetPatches, target) => {
      const merged = this.mergePatches(targetPatches);
      optimized.push(...merged);
    });
    return optimized.sort((a, b) => {
      const order = {
        remove: 0,
        update: 1,
        attributes: 1,
        text: 1,
        move: 2,
        insert: 3
      };
      return (order[a.type] || 99) - (order[b.type] || 99);
    });
  }
  /**
   * 合并补丁
   */
  mergePatches(patches) {
    if (patches.length <= 1)
      return patches;
    const merged = [];
    const attributeUpdates = {};
    let lastTextUpdate = null;
    patches.forEach((patch) => {
      switch (patch.type) {
        case "attributes":
          Object.assign(attributeUpdates, patch.attributes);
          break;
        case "text":
          lastTextUpdate = patch;
          break;
        default:
          merged.push(patch);
      }
    });
    if (Object.keys(attributeUpdates).length > 0) {
      merged.push({
        type: "attributes",
        target: patches[0].target,
        attributes: attributeUpdates
      });
    }
    if (lastTextUpdate)
      merged.push(lastTextUpdate);
    return merged;
  }
  /**
   * 应用补丁
   */
  applyPatches(patches) {
    const fragment = document.createDocumentFragment();
    const insertPatches = [];
    patches.forEach((patch) => {
      try {
        switch (patch.type) {
          case "insert":
            if (patch.newNode && patch.parent) {
              if (patch.index !== void 0) {
                const refNode = patch.parent.children[patch.index];
                patch.parent.insertBefore(patch.newNode, refNode);
              } else {
                insertPatches.push(patch);
              }
            }
            break;
          case "update":
            if (patch.target && patch.newNode)
              patch.target.replaceWith(patch.newNode);
            break;
          case "remove":
            if (patch.target)
              patch.target.remove();
            break;
          case "move":
            if (patch.target && patch.parent && patch.index !== void 0) {
              const refNode = patch.parent.children[patch.index];
              patch.parent.insertBefore(patch.target, refNode);
            }
            break;
          case "attributes":
            if (patch.target instanceof Element && patch.attributes)
              this.updateAttributes(patch.target, patch.attributes);
            break;
          case "text":
            if (patch.target && patch.newValue !== void 0)
              patch.target.textContent = patch.newValue;
            break;
        }
      } catch (error) {
        logger.error("Failed to apply patch:", patch, error);
      }
    });
    if (insertPatches.length > 0) {
      insertPatches.forEach((patch) => {
        if (patch.newNode)
          fragment.appendChild(patch.newNode);
      });
      const firstPatch = insertPatches[0];
      if (firstPatch.parent)
        firstPatch.parent.appendChild(fragment);
    }
  }
  /**
   * 更新属性
   */
  updateAttributes(element, attributes) {
    Object.entries(attributes).forEach(([name, value]) => {
      if (value === null) {
        element.removeAttribute(name);
      } else {
        if (name === "class")
          element.className = value;
        else if (name === "style")
          element.style.cssText = value;
        else if (name.startsWith("data-"))
          element.dataset[name.slice(5)] = value;
        else
          element.setAttribute(name, value);
      }
    });
  }
  /**
   * 设置Worker
   */
  setupWorker() {
    if (!this.options.useWorker)
      return;
    const workerCode = `
      self.onmessage = function(e) {
        const { patches } = e.data
        
        // \u5728Worker\u4E2D\u8FDB\u884C\u8865\u4E01\u4F18\u5316
        const optimized = optimizePatches(patches)
        
        self.postMessage({ optimized })
      }
      
      function optimizePatches(patches) {
        // Worker\u4E2D\u7684\u4F18\u5316\u903B\u8F91
        return patches
      }
    `;
    const blob = new Blob([workerCode], {
      type: "application/javascript"
    });
    this.worker = new Worker(URL.createObjectURL(blob));
    this.worker.onmessage = (e) => {
      const {
        optimized
      } = e.data;
      this.applyPatches(optimized);
    };
  }
  /**
   * 在Worker中应用补丁
   */
  applyPatchesInWorker(patches) {
    if (!this.worker) {
      this.applyPatches(patches);
      return;
    }
    const serializedPatches = patches.map((patch) => ({
      ...patch,
      target: null,
      parent: null,
      newNode: null
    }));
    this.worker.postMessage({
      patches: serializedPatches
    });
  }
  /**
   * 设置观察器
   */
  setupObservers() {
    this.mutationObserver = new MutationObserver((mutations) => {
      const patches = [];
      mutations.forEach((mutation) => {
        switch (mutation.type) {
          case "attributes":
            patches.push({
              type: "attributes",
              target: mutation.target,
              attributes: {
                [mutation.attributeName]: mutation.target.getAttribute(mutation.attributeName)
              }
            });
            break;
          case "childList":
            mutation.removedNodes.forEach((node) => {
              patches.push({
                type: "remove",
                target: node
              });
            });
            mutation.addedNodes.forEach((node) => {
              patches.push({
                type: "insert",
                newNode: node,
                parent: mutation.target
              });
            });
            break;
          case "characterData":
            patches.push({
              type: "text",
              target: mutation.target,
              newValue: mutation.target.textContent
            });
            break;
        }
      });
      if (patches.length > 0)
        this.queuePatches(patches);
    });
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          logger.debug("Element entered viewport:", entry.target);
        }
      });
    });
    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        logger.debug("Element resized:", entry.target);
      });
    });
  }
  /**
   * 开始观察元素
   */
  observeElement(element) {
    this.mutationObserver?.observe(element, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    });
    this.intersectionObserver?.observe(element);
    this.resizeObserver?.observe(element);
  }
  /**
   * 停止观察元素
   */
  unobserveElement(element) {
    this.mutationObserver?.disconnect();
    this.intersectionObserver?.unobserve(element);
    this.resizeObserver?.unobserve(element);
  }
  /**
   * 更新统计信息
   */
  updateStats(patchCount) {
    this.renderStats.totalPatches += patchCount;
    this.renderStats.batchCount++;
    this.renderStats.averageBatchSize = this.renderStats.totalPatches / this.renderStats.batchCount;
  }
  /**
   * 获取渲染统计
   */
  getStats() {
    return {
      ...this.renderStats,
      queueSize: this.patchQueue.length,
      isRendering: this.isRendering
    };
  }
  /**
   * 创建虚拟节点（用于虚拟DOM模式）
   */
  createVNode(type, props = {}, children = []) {
    return {
      type,
      props,
      children
    };
  }
  /**
   * 比较虚拟节点并生成补丁
   */
  diff(oldVNode, newVNode) {
    const patches = [];
    if (!oldVNode && newVNode) {
      patches.push({
        type: "insert",
        newNode: this.createDOMFromVNode(newVNode)
      });
    } else if (oldVNode && !newVNode) {
      patches.push({
        type: "remove"
      });
    } else if (oldVNode && newVNode) {
      if (oldVNode.type !== newVNode.type) {
        patches.push({
          type: "update",
          newNode: this.createDOMFromVNode(newVNode)
        });
      } else {
        const propPatches = this.diffProps(oldVNode.props, newVNode.props);
        patches.push(...propPatches);
        const childPatches = this.diffChildren(oldVNode.children, newVNode.children);
        patches.push(...childPatches);
      }
    }
    return patches;
  }
  /**
   * 比较属性
   */
  diffProps(oldProps, newProps) {
    const patches = [];
    const attributes = {};
    Object.keys(newProps).forEach((key) => {
      if (oldProps[key] !== newProps[key])
        attributes[key] = newProps[key];
    });
    Object.keys(oldProps).forEach((key) => {
      if (!(key in newProps))
        attributes[key] = null;
    });
    if (Object.keys(attributes).length > 0) {
      patches.push({
        type: "attributes",
        attributes
      });
    }
    return patches;
  }
  /**
   * 比较子节点
   */
  diffChildren(oldChildren, newChildren) {
    const patches = [];
    const maxLength = Math.max(oldChildren.length, newChildren.length);
    for (let i = 0; i < maxLength; i++) {
      const oldChild = oldChildren[i];
      const newChild = newChildren[i];
      if (typeof oldChild === "string" || typeof newChild === "string") {
        if (oldChild !== newChild) {
          patches.push({
            type: "text",
            newValue: String(newChild || "")
          });
        }
      } else {
        const childPatches = this.diff(oldChild, newChild);
        patches.push(...childPatches);
      }
    }
    return patches;
  }
  /**
   * 从虚拟节点创建DOM
   */
  createDOMFromVNode(vnode) {
    const element = document.createElement(vnode.type);
    Object.entries(vnode.props).forEach(([key, value]) => {
      if (key === "className") {
        element.className = value;
      } else if (key === "style" && typeof value === "object") {
        Object.assign(element.style, value);
      } else if (key.startsWith("on")) {
        const eventName = key.slice(2).toLowerCase();
        element.addEventListener(eventName, value);
      } else {
        element.setAttribute(key, value);
      }
    });
    vnode.children.forEach((child) => {
      if (typeof child === "string")
        element.appendChild(document.createTextNode(child));
      else
        element.appendChild(this.createDOMFromVNode(child));
    });
    return element;
  }
}

exports.IncrementalRenderer = IncrementalRenderer;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=IncrementalRenderer.cjs.map
