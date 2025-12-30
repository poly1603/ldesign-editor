/**
 * 内置插件注册
 * 将所有内置插件注册到 PluginRegistry，支持按需加载
 */
/**
 * 注册所有内置插件
 */
export declare function registerBuiltinPlugins(): void;
/**
 * 预设配置
 */
export declare const PluginPresets: {
    /** 最小配置 - 仅基础格式化 */
    minimal: string[];
    /** 基础配置 */
    basic: string[];
    /** 标准配置 */
    standard: string[];
    /** 完整配置 */
    full: string[];
    /** 文档模式 */
    document: string[];
    /** 博客模式 */
    blog: string[];
};
export type PresetName = keyof typeof PluginPresets;
//# sourceMappingURL=registry.d.ts.map