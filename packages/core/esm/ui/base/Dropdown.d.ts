/**
 * Dropdown 基础类
 * 所有下拉菜单组件的基类
 */
import type { BaseComponentOptions } from './BaseComponent';
import { BaseComponent } from './BaseComponent';
export interface DropdownItem {
    label: string;
    value?: any;
    icon?: string;
    divider?: boolean;
    disabled?: boolean;
    selected?: boolean;
    onClick?: (item: DropdownItem) => void;
    submenu?: DropdownItem[];
}
export interface DropdownOptions extends BaseComponentOptions {
    items?: DropdownItem[];
    trigger?: HTMLElement;
    position?: 'bottom' | 'top' | 'left' | 'right' | 'auto';
    alignment?: 'start' | 'center' | 'end';
    width?: number | 'auto' | 'match-trigger';
    maxHeight?: number;
    showOnHover?: boolean;
    hideOnClick?: boolean;
    searchable?: boolean;
    placeholder?: string;
    animation?: boolean;
}
export declare class Dropdown extends BaseComponent {
    protected dropdownOptions: DropdownOptions;
    protected trigger: HTMLElement | null;
    protected itemsContainer: HTMLElement;
    protected searchInput: HTMLInputElement | null;
    protected items: DropdownItem[];
    protected filteredItems: DropdownItem[];
    constructor(options?: DropdownOptions);
    protected createElement(): HTMLElement;
    protected createSearchInput(): HTMLInputElement;
    protected createItemsContainer(): HTMLElement;
    setItems(items: DropdownItem[]): void;
    protected renderItems(): void;
    protected createItem(item: DropdownItem, index: number): HTMLElement;
    protected createDivider(): HTMLElement;
    protected handleItemClick(item: DropdownItem, index: number): void;
    setTrigger(trigger: HTMLElement): void;
    protected filterItems(query: string): void;
    protected beforeShow(): void;
    protected positionDropdown(): void;
    private getAlignmentPosition;
    getSelectedItem(): DropdownItem | null;
    setSelectedItem(value: any): void;
    clearSelection(): void;
}
//# sourceMappingURL=Dropdown.d.ts.map