/**
 * WebAssembly文档解析器包装器
 * 提供高性能的文档解析功能
 */

import { createLogger } from '../utils/logger'
import { getPerformanceMonitor } from '../utils/PerformanceMonitor'

const logger = createLogger('WasmParser')
const performanceMonitor = getPerformanceMonitor()

export interface ParsedNode {
  type: NodeType
  start: number
  end: number
  content?: string
  children?: ParsedNode[]
  attributes?: Record<string, any>
}

export enum NodeType {
  TEXT = 0,
  PARAGRAPH = 1,
  HEADING = 2,
  LIST = 3,
  LIST_ITEM = 4,
  BLOCKQUOTE = 5,
  CODE_BLOCK = 6,
  HORIZONTAL_RULE = 7,
  IMAGE = 8,
  LINK = 9,
  BOLD = 10,
  ITALIC = 11,
  CODE = 12,
  TABLE = 13,
  TABLE_ROW = 14,
  TABLE_CELL = 15,
}

export interface ParseResult {
  nodes: ParsedNode[]
  parseTime: number
  nodeCount: number
  memoryUsed: number
}

export interface WasmParserOptions {
  /** 最大文档大小（字符数） */
  maxDocumentSize?: number
  /** 是否启用缓存 */
  enableCache?: boolean
  /** 缓存大小 */
  cacheSize?: number
  /** 是否解析内联样式 */
  parseInlineStyles?: boolean
  /** 是否验证结构 */
  validateStructure?: boolean
}

export class WasmParser {
  private wasmInstance?: WebAssembly.Instance
  private wasmMemory?: WebAssembly.Memory
  private initialized = false
  private initPromise?: Promise<void>
  private options: Required<WasmParserOptions>
  private cache = new Map<string, ParseResult>()

  /** 导出的WASM函数 */
  private exports?: {
    memory: WebAssembly.Memory
    parseDocument: (textPtr: number, textLen: number, outputPtr: number) => number
    nodeToHTML: (nodePtr: number, outputPtr: number) => number
    getMemorySize: () => number
    getHeapUsage: () => number
  }

  constructor(options: WasmParserOptions = {}) {
    this.options = {
      maxDocumentSize: 10000000, // 1000万字符
      enableCache: true,
      cacheSize: 50,
      parseInlineStyles: true,
      validateStructure: true,
      ...options,
    }
  }

  /**
   * 初始化WASM模块
   */
  async initialize(): Promise<void> {
    if (this.initialized)
      return
    if (this.initPromise)
      return this.initPromise

    this.initPromise = this.doInitialize()
    await this.initPromise
  }

  private async doInitialize(): Promise<void> {
    try {
      logger.info('Initializing WebAssembly parser module')
      const startTime = performance.now()

      // 加载WASM字节码
      const wasmBytes = await this.loadWasmBytes()

      // 创建内存
      this.wasmMemory = new WebAssembly.Memory({
        initial: 2, // 128KB
        maximum: 200, // 12.8MB
      })

      // 实例化WASM模块
      const importObject = {
        env: {
          memory: this.wasmMemory,
          log: (ptr: number, len: number) => {
            const msg = this.readString(ptr, len)
            logger.debug('WASM:', msg)
          },
          error: (ptr: number, len: number) => {
            const msg = this.readString(ptr, len)
            logger.error('WASM:', msg)
          },
        },
      }

      const { instance } = await WebAssembly.instantiate(wasmBytes, importObject)
      this.wasmInstance = instance
      this.exports = instance.exports as any

      this.initialized = true
      const initTime = performance.now() - startTime
      logger.info(`WebAssembly parser module initialized in ${initTime.toFixed(2)}ms`)
    }
    catch (error) {
      logger.error('Failed to initialize WebAssembly:', error)
      throw error
    }
  }

  /**
   * 加载WASM字节码
   */
  private async loadWasmBytes(): Promise<ArrayBuffer> {
    // 开发环境：从文件加载
    if (process.env.NODE_ENV === 'development') {
      const response = await fetch('/src/wasm/parser.wasm')
      return response.arrayBuffer()
    }

    // 生产环境：使用内联的Base64
    const base64 = await import('./parser.wasm.base64')
    return Uint8Array.from(atob(base64.default), c => c.charCodeAt(0)).buffer
  }

  /**
   * 解析文档
   */
  async parse(text: string): Promise<ParseResult> {
    await this.initialize()

    const mark = performanceMonitor.mark('wasm-parse-start')
    const startTime = performance.now()

    // 检查缓存
    const cacheKey = this.getCacheKey(text)
    if (this.options.enableCache && this.cache.has(cacheKey)) {
      logger.debug('Parse result from cache')
      return this.cache.get(cacheKey)!
    }

    try {
      // 检查文档大小限制
      if (text.length > this.options.maxDocumentSize)
        throw new Error(`Document size exceeds limit of ${this.options.maxDocumentSize} characters`)

      // 写入文本到WASM内存
      const textPtr = this.writeString(text, 0)
      const outputPtr = textPtr + text.length + 1024 // 留出缓冲区

      // 调用WASM解析函数
      const nodeCount = this.exports!.parseDocument(textPtr, text.length, outputPtr)

      // 读取解析结果
      const nodes = this.readNodes(outputPtr, nodeCount, text)

      // 后处理
      if (this.options.parseInlineStyles)
        this.parseInlineStyles(nodes, text)

      if (this.options.validateStructure)
        this.validateNodeStructure(nodes)

      const result: ParseResult = {
        nodes,
        parseTime: performance.now() - startTime,
        nodeCount,
        memoryUsed: this.exports!.getHeapUsage(),
      }

      // 缓存结果
      if (this.options.enableCache)
        this.addToCache(cacheKey, result)

      performanceMonitor.measure('wasm-parse', mark)
      logger.info(`Document parsed: ${nodeCount} nodes in ${result.parseTime.toFixed(2)}ms`)

      return result
    }
    catch (error) {
      logger.error('Parse failed:', error)
      throw error
    }
  }

  /**
   * 将节点转换为HTML
   */
  async toHTML(nodes: ParsedNode[]): Promise<string> {
    await this.initialize()

    const htmlParts: string[] = []

    for (const node of nodes)
      htmlParts.push(this.nodeToHTMLString(node))

    return htmlParts.join('')
  }

  /**
   * 节点转HTML字符串
   */
  private nodeToHTMLString(node: ParsedNode): string {
    const tag = this.getHTMLTag(node.type)
    const content = node.content || ''
    const childrenHTML = node.children?.map(child => this.nodeToHTMLString(child)).join('') || ''

    if (!tag)
      return content + childrenHTML

    const attrs = this.buildHTMLAttributes(node.attributes)
    return `<${tag}${attrs}>${content}${childrenHTML}</${tag}>`
  }

  /**
   * 获取HTML标签
   */
  private getHTMLTag(type: NodeType): string | null {
    const tagMap: Record<NodeType, string | null> = {
      [NodeType.TEXT]: null,
      [NodeType.PARAGRAPH]: 'p',
      [NodeType.HEADING]: 'h1', // 应该根据level动态
      [NodeType.LIST]: 'ul',
      [NodeType.LIST_ITEM]: 'li',
      [NodeType.BLOCKQUOTE]: 'blockquote',
      [NodeType.CODE_BLOCK]: 'pre',
      [NodeType.HORIZONTAL_RULE]: 'hr',
      [NodeType.IMAGE]: 'img',
      [NodeType.LINK]: 'a',
      [NodeType.BOLD]: 'strong',
      [NodeType.ITALIC]: 'em',
      [NodeType.CODE]: 'code',
      [NodeType.TABLE]: 'table',
      [NodeType.TABLE_ROW]: 'tr',
      [NodeType.TABLE_CELL]: 'td',
    }

    return tagMap[type] || null
  }

  /**
   * 构建HTML属性
   */
  private buildHTMLAttributes(attrs?: Record<string, any>): string {
    if (!attrs)
      return ''

    const parts: string[] = []
    for (const [key, value] of Object.entries(attrs))
      parts.push(` ${key}="${this.escapeHTML(String(value))}"`)

    return parts.join('')
  }

  /**
   * 转义HTML特殊字符
   */
  private escapeHTML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  /**
   * 写入字符串到WASM内存
   */
  private writeString(str: string, offset: number): number {
    const encoder = new TextEncoder()
    const bytes = encoder.encode(str)
    const mem = new Uint8Array(this.wasmMemory!.buffer, offset)

    for (let i = 0; i < bytes.length; i++)
      mem[i] = bytes[i]

    return offset
  }

  /**
   * 从WASM内存读取字符串
   */
  private readString(ptr: number, length: number): string {
    const mem = new Uint8Array(this.wasmMemory!.buffer, ptr)
    const bytes = new Uint8Array(length)

    for (let i = 0; i < length; i++)
      bytes[i] = mem[i]

    const decoder = new TextDecoder()
    return decoder.decode(bytes)
  }

  /**
   * 读取节点数组
   */
  private readNodes(ptr: number, count: number, originalText: string): ParsedNode[] {
    const nodes: ParsedNode[] = []
    const view = new DataView(this.wasmMemory!.buffer)

    for (let i = 0; i < count; i++) {
      const nodePtr = view.getUint32(ptr + i * 4, true)
      const node = this.readNode(nodePtr, originalText)
      if (node)
        nodes.push(node)
    }

    return nodes
  }

  /**
   * 读取单个节点
   */
  private readNode(ptr: number, originalText: string): ParsedNode | null {
    const view = new DataView(this.wasmMemory!.buffer)

    try {
      const type = view.getUint32(ptr, true) as NodeType
      const start = view.getUint32(ptr + 4, true)
      const end = view.getUint32(ptr + 8, true)
      const childrenPtr = view.getUint32(ptr + 12, true)

      const node: ParsedNode = {
        type,
        start,
        end,
        content: originalText.slice(start, end),
      }

      // 读取子节点（如果有）
      if (childrenPtr !== 0) {
        // 实现子节点读取逻辑
        node.children = []
      }

      return node
    }
    catch (error) {
      logger.error('Failed to read node:', error)
      return null
    }
  }

  /**
   * 解析内联样式
   */
  private parseInlineStyles(nodes: ParsedNode[], text: string): void {
    for (const node of nodes) {
      if (node.type === NodeType.TEXT || node.type === NodeType.PARAGRAPH) {
        // 解析加粗 **text** 或 __text__
        const boldRegex = /(\*\*|__)(.*?)\1/g
        let match
        while ((match = boldRegex.exec(node.content || '')) !== null) {
          // 创建加粗节点
          const boldNode: ParsedNode = {
            type: NodeType.BOLD,
            start: node.start + match.index,
            end: node.start + match.index + match[0].length,
            content: match[2],
          }

          if (!node.children)
            node.children = []
          node.children.push(boldNode)
        }

        // 解析斜体 *text* 或 _text_
        const italicRegex = /(\*|_)(.*?)\1/g
        while ((match = italicRegex.exec(node.content || '')) !== null) {
          // 确保不是加粗标记
          if (match[0].length === match[2].length + 2) {
            const italicNode: ParsedNode = {
              type: NodeType.ITALIC,
              start: node.start + match.index,
              end: node.start + match.index + match[0].length,
              content: match[2],
            }

            if (!node.children)
              node.children = []
            node.children.push(italicNode)
          }
        }

        // 解析行内代码 `code`
        const codeRegex = /`([^`]+)`/g
        while ((match = codeRegex.exec(node.content || '')) !== null) {
          const codeNode: ParsedNode = {
            type: NodeType.CODE,
            start: node.start + match.index,
            end: node.start + match.index + match[0].length,
            content: match[1],
          }

          if (!node.children)
            node.children = []
          node.children.push(codeNode)
        }
      }

      // 递归处理子节点
      if (node.children)
        this.parseInlineStyles(node.children, text)
    }
  }

  /**
   * 验证节点结构
   */
  private validateNodeStructure(nodes: ParsedNode[]): void {
    for (const node of nodes) {
      // 验证位置信息
      if (node.start < 0 || node.end < node.start)
        logger.warn(`Invalid node position: start=${node.start}, end=${node.end}`)

      // 验证节点类型
      if (!Object.values(NodeType).includes(node.type))
        logger.warn(`Unknown node type: ${node.type}`)

      // 验证特定类型的约束
      switch (node.type) {
        case NodeType.LIST:
          // 列表必须包含列表项
          if (!node.children || node.children.length === 0)
            logger.warn('List node has no children')

          break

        case NodeType.TABLE:
          // 表格必须包含行
          if (!node.children || node.children.length === 0)
            logger.warn('Table node has no rows')

          break
      }

      // 递归验证子节点
      if (node.children)
        this.validateNodeStructure(node.children)
    }
  }

  /**
   * 获取缓存键
   */
  private getCacheKey(text: string): string {
    // 使用文本长度和前100个字符的哈希
    const preview = text.slice(0, 100)
    return `${text.length}:${this.simpleHash(preview)}`
  }

  /**
   * 简单哈希函数
   */
  private simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash.toString(36)
  }

  /**
   * 添加到缓存
   */
  private addToCache(key: string, result: ParseResult): void {
    if (this.cache.size >= this.options.cacheSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, result)
  }

  /**
   * 获取性能统计
   */
  getStats(): {
    initialized: boolean
    memorySize: number
    heapUsage: number
    cacheSize: number
  } {
    return {
      initialized: this.initialized,
      memorySize: this.exports?.getMemorySize() || 0,
      heapUsage: this.exports?.getHeapUsage() || 0,
      cacheSize: this.cache.size,
    }
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.cache.clear()
    this.wasmInstance = undefined
    this.wasmMemory = undefined
    this.initialized = false
    logger.info('WasmParser disposed')
  }
}
