/**
 * Schema - 定义文档结构
 * 类似于 ProseMirror 的 Schema 系统
 */
import type { Mark, MarkSpec, Node, NodeSpec, SchemaSpec } from '../types';
export declare class Schema {
    nodes: Map<string, NodeSpec>;
    marks: Map<string, MarkSpec>;
    constructor(spec: SchemaSpec);
    /**
     * 获取节点规范
     */
    getNodeSpec(type: string): NodeSpec | undefined;
    /**
     * 获取标记规范
     */
    getMarkSpec(type: string): MarkSpec | undefined;
    /**
     * 检查节点类型是否有效
     */
    hasNode(type: string): boolean;
    /**
     * 检查标记类型是否有效
     */
    hasMark(type: string): boolean;
    /**
     * 创建节点
     */
    node(type: string, attrs?: any, content?: Node[], marks?: Mark[]): Node;
    /**
     * 创建文本节点
     */
    text(text: string, marks?: Mark[]): Node;
    /**
     * 创建标记
     */
    mark(type: string, attrs?: any): Mark;
}
/**
 * 默认 Schema
 */
export declare const defaultSchema: Schema;
