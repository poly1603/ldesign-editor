/**
 * Document - 文档模型
 * 管理文档内容和结构
 */
import type { Node } from '../types';
import type { Schema } from './Schema';
export declare class Document {
    root: Node;
    schema: Schema;
    constructor(content?: Node | string, schema?: Schema);
    /**
     * 从 HTML 解析文档
     */
    fromHTML(html: string): Node;
    /**
     * 转换为 HTML
     */
    toHTML(): string;
    /**
     * 转换为 JSON
     */
    toJSON(): Node;
    /**
     * 转换为纯文本
     */
    toText(): string;
    /**
     * 从 JSON 创建文档
     */
    static fromJSON(json: Node, schema?: Schema): Document;
    /**
     * 解析 DOM 节点
     */
    private parseDOM;
    /**
     * 解析元素节点
     */
    private parseElement;
    /**
     * 解析内联内容
     */
    private parseInlineContent;
    /**
     * 节点转 HTML
     */
    private nodeToHTML;
    /**
     * 包装标记
     */
    private wrapMark;
    /**
     * 转义 HTML
     */
    private escapeHTML;
    /**
     * 节点转纯文本
     */
    private nodeToText;
    /**
     * 获取文档大小
     */
    get size(): number;
    /**
     * 计算节点大小
     */
    private getNodeSize;
}
//# sourceMappingURL=Document.d.ts.map