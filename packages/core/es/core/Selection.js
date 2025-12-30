/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class Selection {
  constructor(anchor, head) {
    this.anchor = anchor;
    this.head = head !== void 0 ? head : anchor;
  }
  /**
   * 是否为空选区（光标）
   */
  get empty() {
    return this.anchor === this.head;
  }
  /**
   * 选区起始位置
   */
  get from() {
    return Math.min(this.anchor, this.head);
  }
  /**
   * 选区结束位置
   */
  get to() {
    return Math.max(this.anchor, this.head);
  }
  /**
   * 获取范围
   */
  get range() {
    return {
      from: this.from,
      to: this.to
    };
  }
  /**
   * 转换为类型
   */
  toJSON() {
    return {
      anchor: this.anchor,
      head: this.head,
      empty: this.empty
    };
  }
  /**
   * 从类型创建
   */
  static fromJSON(json) {
    return new Selection(json.anchor, json.head);
  }
  /**
   * 创建空选区（光标）
   */
  static cursor(pos) {
    return new Selection(pos, pos);
  }
  /**
   * 创建范围选区
   */
  static range(from, to) {
    return new Selection(from, to);
  }
  /**
   * 比较两个选区是否相等
   */
  equals(other) {
    return this.anchor === other.anchor && this.head === other.head;
  }
  /**
   * 克隆选区
   */
  clone() {
    return new Selection(this.anchor, this.head);
  }
}
class SelectionManager {
  constructor(editor) {
    this.editor = editor;
    this.selection = Selection.cursor(0);
  }
  /**
   * 获取当前选区
   */
  getSelection() {
    return this.selection;
  }
  /**
   * 设置选区
   */
  setSelection(selection) {
    this.selection = selection;
    this.syncToDOM();
  }
  /**
   * 从 DOM 同步选区
   */
  syncFromDOM() {
    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0)
      return;
    const range = domSelection.getRangeAt(0);
    const anchor = this.domPositionToEditorPosition(range.startContainer, range.startOffset);
    const head = this.domPositionToEditorPosition(range.endContainer, range.endOffset);
    this.selection = new Selection(anchor, head);
  }
  /**
   * 同步到 DOM
   */
  syncToDOM() {
    const domSelection = window.getSelection();
    if (!domSelection)
      return;
    const range = this.editorRangeToDOMRange(this.selection.range);
    if (range) {
      domSelection.removeAllRanges();
      domSelection.addRange(range);
    }
  }
  /**
   * DOM 位置转编辑器位置
   */
  domPositionToEditorPosition(node, offset) {
    return offset;
  }
  /**
   * 编辑器范围转 DOM 范围
   */
  editorRangeToDOMRange(range) {
    return null;
  }
  /**
   * 清除选区
   */
  clear() {
    this.selection = Selection.cursor(0);
    window.getSelection()?.removeAllRanges();
  }
}

export { Selection, SelectionManager };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=Selection.js.map
