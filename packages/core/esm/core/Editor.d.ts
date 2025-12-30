/**
 * Editor - 编辑器核心类
 * 管理编辑器的所有功能
 *
 * @example
 * ```typescript
 * // 最简用法 - 无任何插件
 * const editor = new Editor({ element: '#editor' })
 *
 * // 链式注册插件
 * editor
 *   .use(BoldPlugin)
 *   .use(ItalicPlugin)
 *   .use(HeadingPlugin)
 *
 * // 使用预设
 * import { standardPlugins } from '@ldesign/editor-core/presets'
 * const editor = new Editor({ element: '#editor', plugins: standardPlugins })
 * ```
 */
import type { EditorOptions, EditorState, Plugin as PluginType, SchemaSpec, Transaction } from '../types';
import { DebugPanel } from '../devtools/DebugPanel';
import { Toolbar } from '../ui/Toolbar';
import { WasmAccelerator } from '../wasm/WasmAccelerator';
import { CommandManager, KeymapManager } from './Command';
import { EditorVirtualScroller } from './EditorVirtualScroller';
import { IncrementalRenderer } from './IncrementalRenderer';
import { PluginManager } from './Plugin';
import { Selection } from './Selection';
export declare class Editor {
    static version: string;
    version: string;
    private eventEmitter;
    private schema;
    private document;
    private selectionManager;
    commands: CommandManager;
    keymap: KeymapManager;
    plugins: PluginManager;
    contextMenuManager?: any;
    toolbar?: Toolbar;
    virtualScroller?: EditorVirtualScroller;
    incrementalRenderer?: IncrementalRenderer;
    wasmAccelerator?: WasmAccelerator;
    debugPanel?: DebugPanel;
    options: EditorOptions;
    private editable;
    private element;
    contentElement: HTMLElement | null;
    private toolbarElement;
    private destroyed;
    private savedRange;
    constructor(options?: EditorOptions);
    /**
     * 链式注册插件
     * @param plugin - 插件实例或插件名称
     * @returns 编辑器实例（支持链式调用）
     *
     * @example
     * ```typescript
     * editor
     *   .use(BoldPlugin)
     *   .use(ItalicPlugin)
     *   .use(new CustomPlugin({ option: 'value' }))
     * ```
     */
    use(plugin: PluginType | string): this;
    /**
     * 批量注册插件
     * @param plugins - 插件数组
     * @returns 编辑器实例（支持链式调用）
     *
     * @example
     * ```typescript
     * import { standardPlugins } from '@ldesign/editor-core/presets'
     * editor.usePlugins(standardPlugins)
     * ```
     */
    usePlugins(plugins: (PluginType | string)[]): this;
    /**
     * 挂载编辑器
     */
    mount(element: HTMLElement | string): void;
    /**
     * 设置事件监听
     */
    private setupEventListeners;
    /**
     * 处理输入
     */
    private handleInput;
    /**
     * 渲染内容
     */
    private render;
    /**
     * 增量渲染内容
     */
    private renderIncremental;
    /**
     * 计算DOM补丁
     */
    private calculatePatches;
    /**
     * 加载内置插件
     */
    private loadBuiltinPlugin;
    /**
     * 获取编辑器容器元素
     */
    getElement(): HTMLElement;
    /**
     * 获取编辑器状态
     */
    getState(): EditorState;
    /**
     * 分发事务
     */
    dispatch(tr: Transaction): void;
    /**
     * 获取选区
     */
    getSelection(): Selection;
    /**
     * 设置选区
     */
    setSelection(selection: Selection): void;
    /**
     * 保存当前 DOM 选区（仅当选区在编辑器内部时）
     */
    saveSelection(): void;
    /**
     * 恢复先前保存的 DOM 选区
     * 返回是否恢复成功
     */
    restoreSelection(): boolean;
    /**
     * 获取 HTML 内容
     */
    getHTML(): string;
    /**
     * 获取选中的纯文本
     */
    getSelectedText(): string;
    /**
     * 设置 HTML 内容
     */
    setHTML(html: string): void;
    /**
     * 获取 JSON 内容
     */
    getJSON(): any;
    /**
     * 设置 JSON 内容
     */
    setJSON(json: any): void;
    /**
     * 插入 HTML 内容到当前光标位置
     */
    insertHTML(html: string): void;
    /**
     * 清空内容
     */
    clear(): void;
    /**
     * 聚焦编辑器
     */
    focus(): void;
    /**
     * 失焦编辑器
     */
    blur(): void;
    /**
     * 设置是否可编辑
     */
    setEditable(editable: boolean): void;
    /**
     * 检查是否可编辑
     */
    isEditable(): boolean;
    /**
     * 扩展 Schema
     */
    extendSchema(spec: SchemaSpec): void;
    /**
     * 事件系统
     */
    on(event: string, handler: (...args: any[]) => void): () => void;
    once(event: string, handler: (...args: any[]) => void): void;
    off(event: string, handler: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): void;
    /**
     * 销毁编辑器
     */
    destroy(): void;
    /**
     * 检查是否已销毁
     */
    isDestroyed(): boolean;
}
//# sourceMappingURL=Editor.d.ts.map