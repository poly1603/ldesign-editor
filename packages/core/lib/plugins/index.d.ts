/**
 * 插件导出 - 优化后的结构
 */
export { default as AIPlugin } from './ai';
export { CodeBlockPlugin } from './codeblock';
export * from './emoji';
export * from './formatting';
export * from './media';
export * from './table';
export * from './table-enhanced';
export { default as TemplatePlugin } from './template';
export { getTemplateManager } from './template';
export * from './text';
export * from './utils';
export declare const allPlugins: (string | import("../types").Plugin)[];
export declare const defaultPlugins: string[];
export declare const extendedPlugins: string[];
