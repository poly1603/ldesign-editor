/**
 * 插件导出 - 优化后的结构
 */
export { registerBuiltinPlugins, PluginPresets } from './registry';
export type { PresetName } from './registry';
export { default as AIPlugin } from './ai';
export { CodeBlockPlugin } from './codeblock';
export * from './emoji';
export * from './formatting';
export { HorizontalRulePlugin } from './horizontal-rule';
export * from './media';
export * from './table';
export { default as TemplatePlugin, getTemplateManager } from './template';
export * from './text';
export * from './utils';
export declare const allPlugins: (string | import("../types").Plugin)[];
export declare const defaultPlugins: string[];
export declare const extendedPlugins: string[];
//# sourceMappingURL=index.d.ts.map