import { BaseComponent } from '../base/BaseComponent';
import './Popover.css';
export type PopoverPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end' | 'auto';
export type PopoverTrigger = 'click' | 'hover' | 'focus' | 'manual';
export interface PopoverConfig {
    trigger?: HTMLElement;
    content: string | HTMLElement;
    placement?: PopoverPlacement;
    triggerType?: PopoverTrigger;
    delay?: number;
    hideDelay?: number;
    offset?: number;
    arrow?: boolean;
    className?: string;
    interactive?: boolean;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    maxWidth?: number;
    onShow?: () => void;
    onHide?: () => void;
}
export declare class Popover extends BaseComponent {
    private config;
    private popoverElement;
    private arrowElement?;
    private contentContainer;
    private isVisibleState;
    private showTimeout?;
    private hideTimeout?;
    private boundUpdatePosition;
    constructor(config: PopoverConfig);
    protected createElement(): HTMLElement;
    protected init(): void;
    private createElements;
    private bindEvents;
    private scheduleShow;
    private scheduleHide;
    private cancelShow;
    private cancelHide;
    show(triggerElement?: HTMLElement): void;
    hide(): void;
    toggle(): void;
    getElement(): HTMLElement;
    private updatePosition;
    private calculateBestPlacement;
    private calculatePosition;
    private positionArrow;
    setContent(content: string | HTMLElement): void;
    setTrigger(trigger: HTMLElement): void;
    isShown(): boolean;
    destroy(): void;
}
//# sourceMappingURL=Popover.d.ts.map