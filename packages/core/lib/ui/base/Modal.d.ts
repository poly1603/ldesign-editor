/**
 * Modal 基础类
 * 所有模态框组件的基类
 */
import type { BaseComponentOptions } from './BaseComponent';
import { BaseComponent } from './BaseComponent';
export interface ModalOptions extends BaseComponentOptions {
    title?: string;
    content?: string | HTMLElement;
    width?: number;
    height?: number;
    maxWidth?: number;
    maxHeight?: number;
    showOverlay?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
    centered?: boolean;
    animation?: boolean;
}
export declare class Modal extends BaseComponent {
    protected overlay: HTMLElement | null;
    protected header: HTMLElement | null;
    protected body: HTMLElement;
    protected footer: HTMLElement | null;
    protected closeButton: HTMLElement | null;
    protected modalOptions: ModalOptions;
    constructor(options?: ModalOptions);
    protected createElement(): HTMLElement;
    protected createHeader(): HTMLElement;
    protected createBody(): HTMLElement;
    protected createFooter(): HTMLElement | null;
    protected createCloseButton(): HTMLElement;
    protected setupElement(): void;
    protected createOverlay(): void;
    center(): void;
    setContent(content: string | HTMLElement): void;
    setTitle(title: string): void;
    protected beforeShow(): void;
    protected beforeHide(): void;
    protected beforeDestroy(): void;
    close(): void;
    open(): void;
}
