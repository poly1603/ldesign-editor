/**
 * 编辑器工具函数集合
 * 统一管理常用的编辑器操作，避免重复代码
 */
/**
 * 执行编辑器命令
 */
export declare function execCommand(command: string, value?: string): boolean;
/**
 * 获取当前选区
 */
export declare function getSelection(): Selection | null;
/**
 * 获取选中的文本
 */
export declare function getSelectedText(): string;
/**
 * 保存当前选区
 */
export declare function saveRange(): Range | null;
/**
 * 恢复选区
 */
export declare function restoreRange(range: Range): boolean;
/**
 * 替换选中的文本
 */
export declare function replaceSelection(text: string, range?: Range | null): boolean;
/**
 * 在光标位置插入文本
 */
export declare function insertText(text: string, container?: HTMLElement): boolean;
/**
 * 应用样式到选中文本
 */
export declare function applyStyle(style: string, value?: string): boolean;
/**
 * 格式化文本对齐
 */
export declare function setAlignment(align: 'left' | 'center' | 'right' | 'justify'): boolean;
/**
 * 插入HTML内容
 */
export declare function insertHTML(html: string): boolean;
/**
 * 清除格式
 */
export declare function clearFormat(): boolean;
/**
 * 撤销/重做
 */
export declare function undo(): boolean;
export declare function redo(): boolean;
/**
 * 缩进操作
 */
export declare function indent(): boolean;
export declare function outdent(): boolean;
