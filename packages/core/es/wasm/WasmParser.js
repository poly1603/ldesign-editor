/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createLogger } from '../utils/logger.js';
import { getPerformanceMonitor } from '../utils/PerformanceMonitor.js';

const logger = createLogger("WasmParser");
const performanceMonitor = getPerformanceMonitor();
var NodeType = /* @__PURE__ */ ((NodeType2) => {
  NodeType2[NodeType2["TEXT"] = 0] = "TEXT";
  NodeType2[NodeType2["PARAGRAPH"] = 1] = "PARAGRAPH";
  NodeType2[NodeType2["HEADING"] = 2] = "HEADING";
  NodeType2[NodeType2["LIST"] = 3] = "LIST";
  NodeType2[NodeType2["LIST_ITEM"] = 4] = "LIST_ITEM";
  NodeType2[NodeType2["BLOCKQUOTE"] = 5] = "BLOCKQUOTE";
  NodeType2[NodeType2["CODE_BLOCK"] = 6] = "CODE_BLOCK";
  NodeType2[NodeType2["HORIZONTAL_RULE"] = 7] = "HORIZONTAL_RULE";
  NodeType2[NodeType2["IMAGE"] = 8] = "IMAGE";
  NodeType2[NodeType2["LINK"] = 9] = "LINK";
  NodeType2[NodeType2["BOLD"] = 10] = "BOLD";
  NodeType2[NodeType2["ITALIC"] = 11] = "ITALIC";
  NodeType2[NodeType2["CODE"] = 12] = "CODE";
  NodeType2[NodeType2["TABLE"] = 13] = "TABLE";
  NodeType2[NodeType2["TABLE_ROW"] = 14] = "TABLE_ROW";
  NodeType2[NodeType2["TABLE_CELL"] = 15] = "TABLE_CELL";
  return NodeType2;
})(NodeType || {});
class WasmParser {
  constructor(options = {}) {
    this.initialized = false;
    this.cache = /* @__PURE__ */ new Map();
    this.options = {
      maxDocumentSize: 1e7,
      // 1000万字符
      enableCache: true,
      cacheSize: 50,
      parseInlineStyles: true,
      validateStructure: true,
      ...options
    };
  }
  /**
   * 初始化WASM模块
   */
  async initialize() {
    if (this.initialized)
      return;
    if (this.initPromise)
      return this.initPromise;
    this.initPromise = this.doInitialize();
    await this.initPromise;
  }
  async doInitialize() {
    try {
      logger.info("Initializing WebAssembly parser module");
      const startTime = performance.now();
      const wasmBytes = await this.loadWasmBytes();
      this.wasmMemory = new WebAssembly.Memory({
        initial: 2,
        // 128KB
        maximum: 200
        // 12.8MB
      });
      const importObject = {
        env: {
          memory: this.wasmMemory,
          log: (ptr, len) => {
            const msg = this.readString(ptr, len);
            logger.debug("WASM:", msg);
          },
          error: (ptr, len) => {
            const msg = this.readString(ptr, len);
            logger.error("WASM:", msg);
          }
        }
      };
      const {
        instance
      } = await WebAssembly.instantiate(wasmBytes, importObject);
      this.wasmInstance = instance;
      this.exports = instance.exports;
      this.initialized = true;
      const initTime = performance.now() - startTime;
      logger.info(`WebAssembly parser module initialized in ${initTime.toFixed(2)}ms`);
    } catch (error) {
      logger.error("Failed to initialize WebAssembly:", error);
      throw error;
    }
  }
  /**
   * 加载WASM字节码
   */
  async loadWasmBytes() {
    if (process.env.NODE_ENV === "development") {
      const response = await fetch("/src/wasm/parser.wasm");
      return response.arrayBuffer();
    }
    const base64 = await import('./parser.wasm.base64.js');
    return Uint8Array.from(atob(base64.default), (c) => c.charCodeAt(0)).buffer;
  }
  /**
   * 解析文档
   */
  async parse(text) {
    await this.initialize();
    const mark = performanceMonitor.mark("wasm-parse-start");
    const startTime = performance.now();
    const cacheKey = this.getCacheKey(text);
    if (this.options.enableCache && this.cache.has(cacheKey)) {
      logger.debug("Parse result from cache");
      return this.cache.get(cacheKey);
    }
    try {
      if (text.length > this.options.maxDocumentSize)
        throw new Error(`Document size exceeds limit of ${this.options.maxDocumentSize} characters`);
      const textPtr = this.writeString(text, 0);
      const outputPtr = textPtr + text.length + 1024;
      const nodeCount = this.exports.parseDocument(textPtr, text.length, outputPtr);
      const nodes = this.readNodes(outputPtr, nodeCount, text);
      if (this.options.parseInlineStyles)
        this.parseInlineStyles(nodes, text);
      if (this.options.validateStructure)
        this.validateNodeStructure(nodes);
      const result = {
        nodes,
        parseTime: performance.now() - startTime,
        nodeCount,
        memoryUsed: this.exports.getHeapUsage()
      };
      if (this.options.enableCache)
        this.addToCache(cacheKey, result);
      performanceMonitor.measure("wasm-parse", mark);
      logger.info(`Document parsed: ${nodeCount} nodes in ${result.parseTime.toFixed(2)}ms`);
      return result;
    } catch (error) {
      logger.error("Parse failed:", error);
      throw error;
    }
  }
  /**
   * 将节点转换为HTML
   */
  async toHTML(nodes) {
    await this.initialize();
    const htmlParts = [];
    for (const node of nodes)
      htmlParts.push(this.nodeToHTMLString(node));
    return htmlParts.join("");
  }
  /**
   * 节点转HTML字符串
   */
  nodeToHTMLString(node) {
    const tag = this.getHTMLTag(node.type);
    const content = node.content || "";
    const childrenHTML = node.children?.map((child) => this.nodeToHTMLString(child)).join("") || "";
    if (!tag)
      return content + childrenHTML;
    const attrs = this.buildHTMLAttributes(node.attributes);
    return `<${tag}${attrs}>${content}${childrenHTML}</${tag}>`;
  }
  /**
   * 获取HTML标签
   */
  getHTMLTag(type) {
    const tagMap = {
      [0 /* TEXT */]: null,
      [1 /* PARAGRAPH */]: "p",
      [2 /* HEADING */]: "h1",
      // 应该根据level动态
      [3 /* LIST */]: "ul",
      [4 /* LIST_ITEM */]: "li",
      [5 /* BLOCKQUOTE */]: "blockquote",
      [6 /* CODE_BLOCK */]: "pre",
      [7 /* HORIZONTAL_RULE */]: "hr",
      [8 /* IMAGE */]: "img",
      [9 /* LINK */]: "a",
      [10 /* BOLD */]: "strong",
      [11 /* ITALIC */]: "em",
      [12 /* CODE */]: "code",
      [13 /* TABLE */]: "table",
      [14 /* TABLE_ROW */]: "tr",
      [15 /* TABLE_CELL */]: "td"
    };
    return tagMap[type] || null;
  }
  /**
   * 构建HTML属性
   */
  buildHTMLAttributes(attrs) {
    if (!attrs)
      return "";
    const parts = [];
    for (const [key, value] of Object.entries(attrs))
      parts.push(` ${key}="${this.escapeHTML(String(value))}"`);
    return parts.join("");
  }
  /**
   * 转义HTML特殊字符
   */
  escapeHTML(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  /**
   * 写入字符串到WASM内存
   */
  writeString(str, offset) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    const mem = new Uint8Array(this.wasmMemory.buffer, offset);
    for (let i = 0; i < bytes.length; i++)
      mem[i] = bytes[i];
    return offset;
  }
  /**
   * 从WASM内存读取字符串
   */
  readString(ptr, length) {
    const mem = new Uint8Array(this.wasmMemory.buffer, ptr);
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++)
      bytes[i] = mem[i];
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }
  /**
   * 读取节点数组
   */
  readNodes(ptr, count, originalText) {
    const nodes = [];
    const view = new DataView(this.wasmMemory.buffer);
    for (let i = 0; i < count; i++) {
      const nodePtr = view.getUint32(ptr + i * 4, true);
      const node = this.readNode(nodePtr, originalText);
      if (node)
        nodes.push(node);
    }
    return nodes;
  }
  /**
   * 读取单个节点
   */
  readNode(ptr, originalText) {
    const view = new DataView(this.wasmMemory.buffer);
    try {
      const type = view.getUint32(ptr, true);
      const start = view.getUint32(ptr + 4, true);
      const end = view.getUint32(ptr + 8, true);
      const childrenPtr = view.getUint32(ptr + 12, true);
      const node = {
        type,
        start,
        end,
        content: originalText.slice(start, end)
      };
      if (childrenPtr !== 0) {
        node.children = [];
      }
      return node;
    } catch (error) {
      logger.error("Failed to read node:", error);
      return null;
    }
  }
  /**
   * 解析内联样式
   */
  parseInlineStyles(nodes, text) {
    for (const node of nodes) {
      if (node.type === 0 /* TEXT */ || node.type === 1 /* PARAGRAPH */) {
        const boldRegex = /(\*\*|__)(.*?)\1/g;
        let match;
        while ((match = boldRegex.exec(node.content || "")) !== null) {
          const boldNode = {
            type: 10 /* BOLD */,
            start: node.start + match.index,
            end: node.start + match.index + match[0].length,
            content: match[2]
          };
          if (!node.children)
            node.children = [];
          node.children.push(boldNode);
        }
        const italicRegex = /(\*|_)(.*?)\1/g;
        while ((match = italicRegex.exec(node.content || "")) !== null) {
          if (match[0].length === match[2].length + 2) {
            const italicNode = {
              type: 11 /* ITALIC */,
              start: node.start + match.index,
              end: node.start + match.index + match[0].length,
              content: match[2]
            };
            if (!node.children)
              node.children = [];
            node.children.push(italicNode);
          }
        }
        const codeRegex = /`([^`]+)`/g;
        while ((match = codeRegex.exec(node.content || "")) !== null) {
          const codeNode = {
            type: 12 /* CODE */,
            start: node.start + match.index,
            end: node.start + match.index + match[0].length,
            content: match[1]
          };
          if (!node.children)
            node.children = [];
          node.children.push(codeNode);
        }
      }
      if (node.children)
        this.parseInlineStyles(node.children, text);
    }
  }
  /**
   * 验证节点结构
   */
  validateNodeStructure(nodes) {
    for (const node of nodes) {
      if (node.start < 0 || node.end < node.start)
        logger.warn(`Invalid node position: start=${node.start}, end=${node.end}`);
      if (!Object.values(NodeType).includes(node.type))
        logger.warn(`Unknown node type: ${node.type}`);
      switch (node.type) {
        case 3 /* LIST */:
          if (!node.children || node.children.length === 0)
            logger.warn("List node has no children");
          break;
        case 13 /* TABLE */:
          if (!node.children || node.children.length === 0)
            logger.warn("Table node has no rows");
          break;
      }
      if (node.children)
        this.validateNodeStructure(node.children);
    }
  }
  /**
   * 获取缓存键
   */
  getCacheKey(text) {
    const preview = text.slice(0, 100);
    return `${text.length}:${this.simpleHash(preview)}`;
  }
  /**
   * 简单哈希函数
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }
  /**
   * 添加到缓存
   */
  addToCache(key, result) {
    if (this.cache.size >= this.options.cacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, result);
  }
  /**
   * 获取性能统计
   */
  getStats() {
    return {
      initialized: this.initialized,
      memorySize: this.exports?.getMemorySize() || 0,
      heapUsage: this.exports?.getHeapUsage() || 0,
      cacheSize: this.cache.size
    };
  }
  /**
   * 清理资源
   */
  dispose() {
    this.cache.clear();
    this.wasmInstance = void 0;
    this.wasmMemory = void 0;
    this.initialized = false;
    logger.info("WasmParser disposed");
  }
}

export { NodeType, WasmParser };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=WasmParser.js.map
