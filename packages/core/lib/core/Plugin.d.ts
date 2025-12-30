/**
 * Plugin - 插件基类
 * 提供插件系统的基础功能
 */
import type { EditorInstance, PluginConfig, Plugin as PluginType } from '../types';
/**
 * 插件基类
 * 所有插件都应该继承此类
 *
 * @example
 * ```typescript
 * class MyPlugin extends Plugin {
 *   name = 'my-plugin'
 *   config: PluginConfig = {
 *     name: 'my-plugin',
 *     commands: {
 *       myCommand: (state) => true
 *     }
 *   }
 * }
 * ```
 */
export declare abstract class Plugin implements PluginType {
    /** 插件名称（必须唯一） */
    abstract name: string;
    /** 插件配置 */
    abstract config: PluginConfig;
    /** 编辑器实例引用 */
    protected editor?: EditorInstance;
    /**
     * 安装插件
     * @param editor - 编辑器实例
     */
    install(editor: EditorInstance): void;
    /**
     * 销毁插件
     * 清理插件注册的所有资源
     */
    destroy(): void;
    /**
     * 插件安装时的钩子
     * 子类可以重写此方法来添加自定义初始化逻辑
     *
     * @param editor - 编辑器实例
     */
    protected onInstall?(editor: EditorInstance): void;
    /**
     * 插件销毁时的钩子
     * 子类可以重写此方法来添加自定义清理逻辑
     *
     * @param editor - 编辑器实例
     */
    protected onDestroy?(editor: EditorInstance): void;
}
/**
 * 插件管理器
 * 管理编辑器中的所有插件
 *
 * @example
 * ```typescript
 * const manager = new PluginManager(editor)
 * manager.register(new MyPlugin())
 * manager.get('my-plugin')
 * ```
 */
export declare class PluginManager {
    private plugins;
    private editor;
    constructor(editor: EditorInstance);
    /**
     * 注册插件
     * @param plugin - 要注册的插件实例
     */
    register(plugin: PluginType): void;
    /**
     * 获取插件实例
     * @param name - 插件名称
     * @returns 插件实例，如果不存在则返回undefined
     */
    get(name: string): PluginType | undefined;
    /**
     * 注销插件
     * @param name - 插件名称
     */
    unregister(name: string): void;
    /**
     * 获取所有插件
     * @returns 所有插件实例的数组
     */
    getAll(): PluginType[];
    /**
     * 检查插件是否已注册
     * @param name - 插件名称
     * @returns 如果插件已注册返回true，否则返回false
     */
    has(name: string): boolean;
    /**
     * 清除所有插件
     * 销毁并移除所有已注册的插件
     */
    clear(): void;
}
/**
 * 创建插件辅助函数
 * 快速创建一个简单的插件，无需继承Plugin类
 *
 * @param config - 插件配置
 * @returns 插件实例
 *
 * @example
 * ```typescript
 * const myPlugin = createPlugin({
 *   name: 'my-plugin',
 *   commands: {
 *     myCommand: (state) => {
 *       console.log('Command executed')
 *       return true
 *     }
 *   },
 *   init: (editor) => {
 *     console.log('Plugin initialized')
 *   }
 * })
 * ```
 */
export declare function createPlugin(config: PluginConfig): PluginType;
//# sourceMappingURL=Plugin.d.ts.map