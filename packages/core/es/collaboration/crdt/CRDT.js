/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createLogger } from '../../utils/logger.js';

const logger = createLogger("CRDT");
class CRDT {
  constructor(siteId) {
    /** 逻辑时钟 */
    this.clock = 0;
    /** 文档状态（位置 -> 字符） */
    this.state = /* @__PURE__ */ new Map();
    /** 操作历史 */
    this.history = [];
    /** 版本向量（站点ID -> 时钟值） */
    this.versionVector = /* @__PURE__ */ new Map();
    this.siteId = siteId || this.generateSiteId();
    this.versionVector.set(this.siteId, 0);
    logger.info(`CRDT initialized with site ID: ${this.siteId}`);
  }
  /**
   * 生成站点ID
   */
  generateSiteId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  /**
   * 插入字符
   */
  insert(index, char) {
    this.clock++;
    this.versionVector.set(this.siteId, this.clock);
    const position = this.generatePosition(index);
    const identifier = {
      position,
      siteId: this.siteId,
      clock: this.clock
    };
    const operation = {
      type: "insert",
      identifier,
      char,
      siteId: this.siteId,
      clock: this.clock,
      timestamp: Date.now()
    };
    this.applyOperation(operation);
    this.history.push(operation);
    logger.debug(`Insert: ${char} at position ${index}`);
    return operation;
  }
  /**
   * 删除字符
   */
  delete(index) {
    const items = this.getVisibleItems();
    if (index < 0 || index >= items.length) {
      logger.warn(`Invalid delete index: ${index}`);
      return null;
    }
    this.clock++;
    this.versionVector.set(this.siteId, this.clock);
    const item = items[index];
    const operation = {
      type: "delete",
      identifier: item.id,
      siteId: this.siteId,
      clock: this.clock,
      timestamp: Date.now()
    };
    this.applyOperation(operation);
    this.history.push(operation);
    logger.debug(`Delete at index ${index}`);
    return operation;
  }
  /**
   * 应用操作
   */
  applyOperation(operation) {
    const key = this.identifierToKey(operation.identifier);
    switch (operation.type) {
      case "insert":
        this.state.set(key, {
          char: operation.char,
          id: operation.identifier,
          visible: true
        });
        break;
      case "delete":
        const item = this.state.get(key);
        if (item)
          item.visible = false;
        break;
    }
    const remoteClock = this.versionVector.get(operation.siteId) || 0;
    if (operation.clock > remoteClock)
      this.versionVector.set(operation.siteId, operation.clock);
  }
  /**
   * 生成位置标识符
   */
  generatePosition(index) {
    const items = this.getVisibleItems();
    let prevPos = [{
      digit: 0,
      siteId: ""
    }];
    let nextPos = [{
      digit: Number.MAX_SAFE_INTEGER,
      siteId: ""
    }];
    if (index > 0 && items[index - 1])
      prevPos = items[index - 1].id.position;
    if (index < items.length && items[index])
      nextPos = items[index].id.position;
    return this.generatePositionBetween(prevPos, nextPos);
  }
  /**
   * 在两个位置之间生成新位置
   */
  generatePositionBetween(prev, next) {
    const maxDepth = Math.max(prev.length, next.length);
    const newPos = [];
    for (let i = 0; i < maxDepth; i++) {
      const prevDigit = prev[i]?.digit || 0;
      const nextDigit = next[i]?.digit || Number.MAX_SAFE_INTEGER;
      if (nextDigit - prevDigit > 1) {
        const midDigit = Math.floor((prevDigit + nextDigit) / 2);
        newPos.push({
          digit: midDigit,
          siteId: this.siteId
        });
        break;
      } else if (i === maxDepth - 1) {
        newPos.push(...prev.slice(0, i + 1));
        newPos.push({
          digit: prevDigit + 1,
          siteId: this.siteId
        });
        break;
      } else {
        newPos.push({
          digit: prevDigit,
          siteId: prev[i]?.siteId || this.siteId
        });
      }
    }
    return newPos;
  }
  /**
   * 将标识符转换为键
   */
  identifierToKey(identifier) {
    return identifier.position.map((p) => `${p.digit}:${p.siteId}`).join("|");
  }
  /**
   * 获取可见项
   */
  getVisibleItems() {
    return Array.from(this.state.values()).filter((item) => item.visible).sort((a, b) => this.comparePositions(a.id.position, b.id.position));
  }
  /**
   * 比较位置
   */
  comparePositions(a, b) {
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      const aDigit = a[i]?.digit || 0;
      const bDigit = b[i]?.digit || 0;
      if (aDigit !== bDigit)
        return aDigit - bDigit;
      const aSiteId = a[i]?.siteId || "";
      const bSiteId = b[i]?.siteId || "";
      if (aSiteId !== bSiteId)
        return aSiteId.localeCompare(bSiteId);
    }
    return 0;
  }
  /**
   * 获取文本内容
   */
  getText() {
    return this.getVisibleItems().map((item) => item.char).join("");
  }
  /**
   * 设置文本内容
   */
  setText(text) {
    const operations = [];
    const items = this.getVisibleItems();
    for (let i = items.length - 1; i >= 0; i--) {
      const op = this.delete(i);
      if (op)
        operations.push(op);
    }
    for (let i = 0; i < text.length; i++)
      operations.push(this.insert(i, text[i]));
    return operations;
  }
  /**
   * 获取状态
   */
  getState() {
    return {
      siteId: this.siteId,
      clock: this.clock,
      versionVector: Object.fromEntries(this.versionVector),
      operations: this.history
    };
  }
  /**
   * 合并远程状态
   */
  merge(remoteState) {
    logger.info(`Merging state from site: ${remoteState.siteId}`);
    const newOperations = [];
    remoteState.operations.forEach((remoteOp) => {
      const localClock = this.versionVector.get(remoteOp.siteId) || 0;
      if (remoteOp.clock > localClock) {
        this.applyOperation(remoteOp);
        this.history.push(remoteOp);
        newOperations.push(remoteOp);
      }
    });
    logger.info(`Merged ${newOperations.length} new operations`);
    return newOperations;
  }
  /**
   * 获取增量操作（自指定版本向量以来的操作）
   */
  getDelta(remoteVersionVector) {
    const delta = [];
    this.history.forEach((op) => {
      const remoteClock = remoteVersionVector[op.siteId] || 0;
      if (op.clock > remoteClock)
        delta.push(op);
    });
    return delta;
  }
  /**
   * 清空所有数据
   */
  clear() {
    this.state.clear();
    this.history = [];
    this.clock = 0;
    this.versionVector.clear();
    this.versionVector.set(this.siteId, 0);
  }
  /**
   * 获取站点ID
   */
  getSiteId() {
    return this.siteId;
  }
  /**
   * 获取时钟值
   */
  getClock() {
    return this.clock;
  }
}

export { CRDT };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=CRDT.js.map
