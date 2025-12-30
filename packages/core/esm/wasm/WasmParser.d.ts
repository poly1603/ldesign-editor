/**
 * WebAssembly文档解析器包装器
 * 提供高性能的文档解析功能
 */
export interface ParsedNode {
    type: NodeType;
    start: number;
    end: number;
    content?: string;
    children?: ParsedNode[];
    attributes?: Record<string, any>;
}
export declare enum NodeType {
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
    TABLE_CELL = 15
}
export interface ParseResult {
    nodes: ParsedNode[];
    parseTime: number;
    nodeCount: number;
    memoryUsed: number;
}
export interface WasmParserOptions {
    /** 最大文档大小（字符数） */
    maxDocumentSize?: number;
    /** 是否启用缓存 */
    enableCache?: boolean;
    /** 缓存大小 */
    cacheSize?: number;
    /** 是否解析内联样式 */
    parseInlineStyles?: boolean;
    /** 是否验证结构 */
    validateStructure?: boolean;
}
export declare class WasmParser {
    private wasmInstance?;
    private wasmMemory?;
    private initialized;
    private initPromise?;
    private options;
    private cache;
    /** 导出的WASM函数 */
    private exports?;
    constructor(options?: WasmParserOptions);
    /**
     * 初始化WASM模块
     */
    initialize(): Promise<void>;
    private doInitialize;
    /**
     * 加载WASM字节码
     */
    private loadWasmBytes;
    /**
     * 解析文档
     */
    parse(text: string): Promise<ParseResult>;
    /**
     * 将节点转换为HTML
     */
    toHTML(nodes: ParsedNode[]): Promise<string>;
    /**
     * 节点转HTML字符串
     */
    private nodeToHTMLString;
    /**
     * 获取HTML标签
     */
    private getHTMLTag;
    /**
     * 构建HTML属性
     */
    private buildHTMLAttributes;
    /**
     * 转义HTML特殊字符
     */
    private escapeHTML;
    /**
     * 写入字符串到WASM内存
     */
    private writeString;
    /**
     * 从WASM内存读取字符串
     */
    private readString;
    /**
     * 读取节点数组
     */
    private readNodes;
    /**
     * 读取单个节点
     */
    private readNode;
    /**
     * 解析内联样式
     */
    private parseInlineStyles;
    /**
     * 验证节点结构
     */
    private validateNodeStructure;
    /**
     * 获取缓存键
     */
    private getCacheKey;
    /**
     * 简单哈希函数
     */
    private simpleHash;
    /**
     * 添加到缓存
     */
    private addToCache;
    /**
     * 获取性能统计
     */
    getStats(): {
        initialized: boolean;
        memorySize: number;
        heapUsage: number;
        cacheSize: number;
    };
    /**
     * 清理资源
     */
    dispose(): void;
}
//# sourceMappingURL=WasmParser.d.ts.map