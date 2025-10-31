/**
 * Enhanced Emoji Picker using Popover and DropdownMenu components
 * Modular, reusable, with consistent styling
 */
export interface EmojiPickerOptions {
    onSelect?: (emoji: string) => void;
    defaultCategory?: string;
    width?: number;
    maxHeight?: number;
}
/**
 * Enhanced Emoji Picker Component
 */
export declare class EmojiPicker {
    private popover;
    private currentCategory;
    private options;
    private categoryDropdown;
    constructor(options?: EmojiPickerOptions);
    /**
     * Show emoji picker attached to trigger element
     */
    show(triggerElement: HTMLElement): void;
    /**
     * Hide emoji picker
     */
    hide(): void;
    /**
     * Create picker content element
     */
    private createPickerContent;
    /**
     * Update emoji grid with category emojis
     */
    private updateEmojiGrid;
    /**
     * Destroy picker and cleanup
     */
    destroy(): void;
}
/**
 * Utility function to show emoji picker (backward compatibility)
 */
export declare function showEmojiPicker(button: HTMLElement, onSelect?: (emoji: string) => void): void;
