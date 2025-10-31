/**
 * AI 建议浮层组件
 * 用于显示 AI 生成的建议内容
 */
export interface AISuggestionsOverlayOptions {
    autoHide?: boolean;
    position?: 'cursor' | 'center' | 'bottom';
    maxHeight?: number;
    width?: number;
}
declare class AISuggestionsOverlay {
    private container;
    private suggestions;
    private selectedIndex;
    private onSelect;
    private options;
    constructor(editor: any, suggestions: string[], onSelect: (suggestion: string) => void, options?: AISuggestionsOverlayOptions);
    private createElement;
    private render;
    private escapeHtml;
    private attachEventListeners;
    private handleKeyDown;
    private updateSelection;
    private acceptSuggestion;
    private show;
    private hide;
}
/**
 * 显示 AI 建议浮层
 */
export declare function showAISuggestionsOverlay(editor: any, suggestions: string[], onSelect: (suggestion: string) => void, options?: AISuggestionsOverlayOptions): AISuggestionsOverlay;
export {};
