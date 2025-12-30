/**
 * 编辑器操作助手类
 * 统一封装常用的编辑器操作，避免代码重复
 */
export declare class EditorHelper {
    private editor;
    constructor(editor: any);
    /**
     * 获取选中的纯文本
     */
    getSelectedText(): string;
    /**
     * 替换选中的文本
     * @param text 要替换的新文本
     * @param savedRange 保存的选区Range对象（可选）
     */
    replaceSelectedText(text: string, savedRange?: Range | null): boolean;
    /**
     * 在当前光标位置插入文本
     */
    insertText(text: string): boolean;
    /**
     * 保存当前选区
     */
    saveSelection(): Range | null;
    /**
     * 恢复选区
     */
    restoreSelection(range: Range): boolean;
    /**
     * 执行格式化命令
     */
    execCommand(command: string, value?: string): boolean;
    /**
     * 应用样式到选中文本
     */
    applyStyle(style: {
        [key: string]: string;
    }): void;
}
/**
 * 创建编辑器助手实例
 */
export declare function createEditorHelper(editor: any): EditorHelper;
//# sourceMappingURL=EditorHelper.d.ts.map