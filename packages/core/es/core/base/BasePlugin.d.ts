/**
 * 插件基类
 * 提供通用的插件功能，减少重复代码
 */
import type { Editor } from '../Editor';
import { EventEmitter } from '../EventEmitter';
/**
 * 插件基础配置
 */
export interface BasePluginConfig {
    enabled?: boolean;
    toolbar?: {
        visible?: boolean;
        position?: 'left' | 'right' | 'center';
        order?: number;
    };
    [key: string]: any;
}
/**
 * 插件基类
 */
export declare abstract class BasePlugin<T extends BasePluginConfig = BasePluginConfig> extends EventEmitter {
    name: string;
    config: T;
    protected editor?: Editor;
    protected initialized: boolean;
    constructor(name: string, config: T);
    /**
     * 获取默认配置
     */
    protected abstract getDefaultConfig(): Partial<T>;
    /**
     * 初始化插件
     */
    init(editor: Editor): Promise<void>;
    /**
     * 插件初始化逻辑（子类实现）
     */
    protected abstract onInit(): Promise<void> | void;
    /**
     * 销毁插件
     */
    destroy(): Promise<void>;
    /**
     * 插件销毁逻辑（子类实现）
     */
    protected abstract onDestroy(): Promise<void> | void;
    /**
     * 更新配置
     */
    updateConfig(config: Partial<T>): void;
    /**
     * 配置更新回调（子类可选实现）
     */
    protected onConfigUpdate(config: Partial<T>): void;
    /**
     * 启用插件
     */
    enable(): void;
    /**
     * 禁用插件
     */
    disable(): void;
    /**
     * 启用回调（子类可选实现）
     */
    protected onEnable(): void;
    /**
     * 禁用回调（子类可选实现）
     */
    protected onDisable(): void;
    /**
     * 检查插件是否已初始化
     */
    isInitialized(): boolean;
    /**
     * 检查插件是否已启用
     */
    isEnabled(): boolean;
    /**
     * 获取编辑器实例
     */
    protected getEditor(): Editor;
}
