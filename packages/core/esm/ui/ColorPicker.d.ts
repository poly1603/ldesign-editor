/**
 * 颜色选择器
 */
export interface ColorPickerOptions {
    onSelect: (color: string) => void;
    colors?: string[];
    customColors?: boolean;
    recentColors?: boolean;
}
/**
 * 创建颜色选择器
 */
export declare function createColorPicker(options: ColorPickerOptions): HTMLElement;
/**
 * 显示颜色选择器
 */
export declare function showColorPicker(button: HTMLElement, options: ColorPickerOptions): void;
//# sourceMappingURL=ColorPicker.d.ts.map