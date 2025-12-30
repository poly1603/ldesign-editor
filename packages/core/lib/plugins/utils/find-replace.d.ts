/**
 * 查找替换插件
 */
import type { Plugin } from '../../types';
/**
 * 查找文本选项
 */
export interface SearchOptions {
    caseSensitive?: boolean;
    wholeWord?: boolean;
    useRegex?: boolean;
    fuzzySearch?: boolean;
}
/**
 * 显示查找替换对话框 - 无遮罩可拖拽版本
 */
export declare function showFindReplaceDialog(editor: any): void;
/**
 * 创建查找替换插件
 */
export declare const FindReplacePlugin: Plugin;
export default FindReplacePlugin;
//# sourceMappingURL=find-replace.d.ts.map