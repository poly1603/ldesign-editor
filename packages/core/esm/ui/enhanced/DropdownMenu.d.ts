import { BaseComponent } from '../base/BaseComponent';
import './DropdownMenu.css';
export interface DropdownMenuItem {
    id: string;
    label: string;
    value?: any;
    icon?: string;
    disabled?: boolean;
    selected?: boolean;
    shortcut?: string;
    divider?: boolean;
    children?: DropdownMenuItem[];
    render?: (item: DropdownMenuItem) => HTMLElement;
}
export interface DropdownMenuConfig {
    trigger?: HTMLElement;
    items: DropdownMenuItem[];
    multiSelect?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    position?: 'auto' | 'bottom' | 'top' | 'left' | 'right';
    maxHeight?: number;
    minWidth?: number;
    closeOnSelect?: boolean;
    onSelect?: (item: DropdownMenuItem, items?: DropdownMenuItem[]) => void;
    onOpen?: () => void;
    onClose?: () => void;
    className?: string;
}
export declare class DropdownMenu extends BaseComponent {
    private config;
    private menuElement;
    private searchInput?;
    private itemsContainer;
    private selectedItems;
    private focusedIndex;
    private filteredItems;
    private isOpen;
    private subMenus;
    constructor(config: DropdownMenuConfig);
    protected createElement(): HTMLElement;
    protected init(): void;
    private createElements;
    private renderItems;
    private createItemElement;
    private bindItemEvents;
    private showSubmenu;
    private hideSubmenu;
    private bindEvents;
    private filterItems;
    private handleArrowKey;
    private setFocusedIndex;
    private selectFocusedItem;
    private expandFocusedSubmenu;
    private collapseFocusedSubmenu;
    private selectItem;
    private updateSelectedItems;
    private positionMenu;
    open(): void;
    close(): void;
    toggle(): void;
    setItems(items: DropdownMenuItem[]): void;
    getSelectedItems(): DropdownMenuItem[];
    clearSelection(): void;
    destroy(): void;
}
//# sourceMappingURL=DropdownMenu.d.ts.map