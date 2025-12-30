/**
 * 插件模板管理
 */
export interface PluginTemplate {
    name: string;
    description: string;
    files?: string[];
}
export declare function getTemplates(): Record<string, PluginTemplate>;
//# sourceMappingURL=index.d.ts.map