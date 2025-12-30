/**
 * 下拉选择器
 */
export interface DropdownOption {
    label: string;
    value: string;
    icon?: string;
    color?: string;
    emoji?: string;
}
export interface DropdownOptions {
    options?: DropdownOption[];
    onSelect?: (value: string) => void;
    placeholder?: string;
    customContent?: HTMLElement;
    width?: number | string;
    maxHeight?: number | string;
    selectedValue?: string;
    renderOption?: (option: DropdownOption) => HTMLElement | null;
}
/**
 * 创建下拉选择器
 */
export declare function createDropdown(options: DropdownOptions): HTMLElement;
/**
 * 显示下拉选择器
 */
export declare function showDropdown(button: HTMLElement, options: DropdownOptions): void;
//# sourceMappingURL=Dropdown.d.ts.map