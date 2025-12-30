/**
 * 创建插件命令
 * 提供插件脚手架功能
 */
interface PluginOptions {
    template?: string;
    description?: string;
    author?: string;
    git?: boolean;
    install?: boolean;
}
export declare function createPlugin(name: string, options: PluginOptions): Promise<void>;
export {};
//# sourceMappingURL=create-plugin.d.ts.map