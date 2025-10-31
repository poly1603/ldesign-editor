/**
 * 统一的下拉框功能
 * 为颜色选择、表情选择等提供一致的下拉框体验
 */
/**
 * 显示颜色选择下拉框（简化版）
 */
export declare function showColorDropdown(button: HTMLElement, onSelect: (color: string) => void, includeCustom?: boolean, title?: string): void;
/**
 * 显示表情选择下拉框
 */
export declare function showEmojiDropdown(button: HTMLElement, onSelect: (emoji: string) => void): void;
