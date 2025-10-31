/**
 * 颜色选择器 - 基于Modal基类重构
 */
import type { ModalOptions } from '../base/Modal';
import { Modal } from '../base/Modal';
export interface ColorPickerOptions extends Omit<ModalOptions, 'content'> {
    onSelect?: (color: string) => void;
    onCancel?: () => void;
    colors?: string[];
    customColors?: boolean;
    recentColors?: boolean;
    currentColor?: string;
}
export declare class ColorPicker extends Modal {
    private pickerOptions;
    private selectedColor;
    private colorPreview;
    private hexInput;
    private rgbInputs;
    private colorSlider;
    private opacitySlider;
    constructor(options?: ColorPickerOptions);
    private renderContent;
    private createColorPreview;
    private createColorSection;
    private createCustomColorSection;
    private createFooterButtons;
    private updateColorPreview;
    private updateHexInput;
    private updateRGBInputs;
    getSelectedColor(): string;
    setSelectedColor(color: string): void;
}
