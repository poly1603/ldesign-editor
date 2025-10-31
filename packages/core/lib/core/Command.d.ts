/**
 * Command - 命令系统
 * 处理编辑器命令和快捷键
 */
import type { Command } from '../types';
import { History } from './History';
/**
 * 命令管理器
 */
export declare class CommandManager {
    private commands;
    private editor;
    history: History;
    constructor(editor: any);
    /**
     * 撤销
     */
    undo(): boolean;
    /**
     * 重做
     */
    redo(): boolean;
    /**
     * 检查是否可以撤销
     */
    canUndo(): boolean;
    /**
     * 检查是否可以重做
     */
    canRedo(): boolean;
    /**
     * 注册命令
     */
    register(name: string, command: Command): void;
    /**
     * 执行命令
     */
    execute(name: string, ...args: any[]): boolean;
    /**
     * 检查命令是否可用
     */
    canExecute(name: string): boolean;
    /**
     * 获取命令
     */
    get(name: string): Command | undefined;
    /**
     * 检查命令是否存在
     */
    has(name: string): boolean;
    /**
     * 获取所有命令
     */
    getCommands(): string[];
    /**
     * 移除命令
     */
    unregister(name: string): void;
    /**
     * 清除所有命令
     */
    clear(): void;
}
/**
 * 键盘快捷键管理器
 */
export declare class KeymapManager {
    private keymap;
    private editor;
    constructor(editor: any);
    /**
     * 注册快捷键
     * 支持两种形式：
     * - register('Mod-B', command)
     * - register({ key: 'Ctrl+Z', command: 'undo' | Command })
     */
    register(keys: string | {
        key: string;
        command: Command | string;
    }, command?: Command): void;
    /**
     * 处理键盘事件
     */
    handleKeyDown(event: KeyboardEvent): boolean;
    /**
     * 事件转快捷键字符串
     */
    private eventToKey;
    /**
     * 规范化快捷键
     */
    private normalizeKey;
    /**
     * 移除快捷键
     */
    unregister(keys: string): void;
    /**
     * 清除所有快捷键
     */
    clear(): void;
}
/**
 * 内置命令
 */
export declare const undo: Command;
export declare const redo: Command;
export declare function toggleMark(markType: string): Command;
export declare function setBlockType(nodeType: string, attrs?: any): Command;
export declare function insertNode(node: any): Command;
export declare const deleteSelection: Command;
