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

var constants = require('../config/constants.cjs');
var logger$1 = require('../utils/logger.cjs');

const logger = logger$1.createLogger("History");
class History {
  constructor(editor, maxStackSize) {
    this.undoStack = [];
    this.redoStack = [];
    this.isUndoing = false;
    this.isRedoing = false;
    this.isSaving = false;
    this.lastSavedState = "";
    this.saveTimeout = null;
    this.editor = editor;
    this.maxStackSize = maxStackSize || constants.EDITOR_CONFIG.MAX_HISTORY_SIZE;
    this.init();
  }
  /**
   * 初始化
   */
  init() {
    this.saveState();
    this.editor.on("update", () => {
      if (!this.isUndoing && !this.isRedoing && !this.isSaving)
        this.debouncedSave();
    });
    logger.debug("History initialized");
  }
  /**
   * 防抖保存（避免频繁保存）
   */
  debouncedSave() {
    if (this.saveTimeout !== null)
      clearTimeout(this.saveTimeout);
    this.saveTimeout = window.setTimeout(() => {
      this.saveState();
      this.saveTimeout = null;
    }, constants.EDITOR_CONFIG.DEBOUNCE_DELAY);
  }
  /**
   * 保存当前状态
   */
  saveState() {
    this.isSaving = true;
    try {
      const html = this.editor.getHTML();
      if (html === this.lastSavedState)
        return;
      const state = {
        html,
        selection: this.getCurrentSelection(),
        timestamp: Date.now()
      };
      this.undoStack.push(state);
      this.lastSavedState = html;
      if (this.undoStack.length > this.maxStackSize)
        this.undoStack.shift();
      this.redoStack = [];
      logger.debug("State saved", {
        stackSize: this.undoStack.length
      });
    } finally {
      this.isSaving = false;
    }
  }
  /**
   * 撤销
   */
  undo() {
    if (this.undoStack.length <= 1) {
      logger.debug("Cannot undo: no more history");
      return false;
    }
    this.isUndoing = true;
    try {
      const currentState = this.undoStack.pop();
      this.redoStack.push(currentState);
      const previousState = this.undoStack[this.undoStack.length - 1];
      this.restoreState(previousState);
      logger.debug("Undo successful", {
        undoStackSize: this.undoStack.length,
        redoStackSize: this.redoStack.length
      });
      return true;
    } finally {
      this.isUndoing = false;
    }
  }
  /**
   * 重做
   */
  redo() {
    if (this.redoStack.length === 0) {
      logger.debug("Cannot redo: no redo history");
      return false;
    }
    this.isRedoing = true;
    try {
      const state = this.redoStack.pop();
      this.undoStack.push(state);
      this.restoreState(state);
      logger.debug("Redo successful", {
        undoStackSize: this.undoStack.length,
        redoStackSize: this.redoStack.length
      });
      return true;
    } finally {
      this.isRedoing = false;
    }
  }
  /**
   * 恢复状态
   */
  restoreState(state) {
    this.editor.setHTML(state.html);
    this.lastSavedState = state.html;
    setTimeout(() => {
      if (state.selection)
        this.restoreSelection(state.selection);
    }, 0);
  }
  /**
   * 获取当前选区
   */
  getCurrentSelection() {
    if (!this.editor.contentElement)
      return null;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
      return null;
    const range = selection.getRangeAt(0);
    try {
      return {
        start: this.getOffset(this.editor.contentElement, range.startContainer, range.startOffset),
        end: this.getOffset(this.editor.contentElement, range.endContainer, range.endOffset)
      };
    } catch (e) {
      logger.warn("Failed to get selection", e);
      return null;
    }
  }
  /**
   * 恢复选区
   */
  restoreSelection(selection) {
    if (!this.editor.contentElement)
      return;
    try {
      const range = this.createRangeFromOffsets(this.editor.contentElement, selection.start, selection.end);
      if (range) {
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        logger.debug("Selection restored");
      }
    } catch (e) {
      logger.warn("Failed to restore selection", e);
    }
  }
  /**
   * 获取节点在编辑器中的偏移量
   */
  getOffset(root, node, offset) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let totalOffset = 0;
    let currentNode;
    while (currentNode = walker.nextNode()) {
      if (currentNode === node)
        return totalOffset + offset;
      totalOffset += currentNode.textContent?.length || 0;
    }
    return totalOffset;
  }
  /**
   * 从偏移量创建 Range
   */
  createRangeFromOffsets(root, start, end) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let currentOffset = 0;
    let startNode = null;
    let startOffset = 0;
    let endNode = null;
    let endOffset = 0;
    let currentNode;
    while (currentNode = walker.nextNode()) {
      const nodeLength = currentNode.textContent?.length || 0;
      if (!startNode && currentOffset + nodeLength >= start) {
        startNode = currentNode;
        startOffset = start - currentOffset;
      }
      if (!endNode && currentOffset + nodeLength >= end) {
        endNode = currentNode;
        endOffset = end - currentOffset;
        break;
      }
      currentOffset += nodeLength;
    }
    if (startNode && endNode) {
      const range = document.createRange();
      range.setStart(startNode, Math.min(startOffset, startNode.textContent?.length || 0));
      range.setEnd(endNode, Math.min(endOffset, endNode.textContent?.length || 0));
      return range;
    }
    return null;
  }
  /**
   * 清空历史
   */
  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this.lastSavedState = "";
    logger.debug("History cleared");
  }
  /**
   * 检查是否可以撤销
   */
  canUndo() {
    return this.undoStack.length > 1;
  }
  /**
   * 检查是否可以重做
   */
  canRedo() {
    return this.redoStack.length > 0;
  }
  /**
   * 获取历史记录信息
   */
  getInfo() {
    return {
      undoCount: this.undoStack.length,
      redoCount: this.redoStack.length,
      canUndo: this.canUndo(),
      canRedo: this.canRedo()
    };
  }
  /**
   * 销毁
   */
  destroy() {
    if (this.saveTimeout !== null) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    this.clear();
    logger.debug("History destroyed");
  }
}

exports.History = History;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=History.cjs.map
