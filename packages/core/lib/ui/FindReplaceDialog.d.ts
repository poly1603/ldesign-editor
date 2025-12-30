/**
 * 查找替换对话框 - 增强版
 * 支持模糊查找、实时预览、批量替换等功能
 */
export interface FindReplaceOptions {
    onFind?: (searchText: string, options: SearchOptions) => void;
    onReplace?: (searchText: string, replaceText: string, options: SearchOptions) => void;
    onReplaceAll?: (searchText: string, replaceText: string, options: SearchOptions) => void;
    onClose?: () => void;
    initialText?: string;
}
export interface SearchOptions {
    caseSensitive: boolean;
    wholeWord: boolean;
    useRegex: boolean;
    fuzzySearch: boolean;
}
export interface SearchResult {
    count: number;
    current: number;
    matches: Array<{
        text: string;
        index: number;
        length: number;
    }>;
}
/**
 * 创建增强版查找替换对话框
 */
export declare function createFindReplaceDialog(options: FindReplaceOptions): HTMLElement;
/**
 * 显示查找替换对话框
 */
export declare function showFindReplaceDialog(options: FindReplaceOptions): void;
export default showFindReplaceDialog;
//# sourceMappingURL=FindReplaceDialog.d.ts.map