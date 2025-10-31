/**
 * 默认工具栏配置
 * 包含所有常用的编辑器功能按钮
 */
import type { ToolbarItem } from '../types';
/**
 * 默认工具栏配置
 */
export declare const DEFAULT_TOOLBAR_ITEMS: ToolbarItem[];
/**
 * 分组的工具栏配置
 */
export declare const TOOLBAR_GROUPS: {
    history: string[];
    format: string[];
    heading: string[];
    block: string[];
    list: string[];
    indent: string[];
    align: string[];
    insert: string[];
    font: string[];
    color: string[];
    ai: string[];
    tools: string[];
};
/**
 * 获取带分隔符的工具栏项
 */
export declare function getToolbarItemsWithSeparators(): ToolbarItem[];
