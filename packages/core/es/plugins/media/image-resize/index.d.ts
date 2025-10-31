import type { Editor } from '../../../core/Editor';
import { Plugin } from '../../../core/Plugin';
import './styles.css';
export interface ImageResizeOptions {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    preserveAspectRatio?: boolean;
    showDimensions?: boolean;
}
export declare class ImageResizePlugin extends Plugin {
    name: string;
    config: {
        name: string;
        commands: {};
        keys: {};
    };
    private options;
    private currentImage;
    private resizeOverlay;
    private isResizing;
    private startX;
    private startY;
    private startWidth;
    private startHeight;
    private resizeHandle;
    private aspectRatio;
    private dimensionsDisplay;
    constructor(options?: ImageResizeOptions);
    install(editor: Editor): void;
    private bindEvents;
    private handleImageClick;
    private isResizeHandle;
    private showResizeOverlay;
    private hideResizeOverlay;
    private updateOverlayPosition;
    private updateDimensionsDisplay;
    private startResize;
    private handleMouseMove;
    private handleMouseUp;
    private handleKeyDown;
    destroy(): void;
}
export default ImageResizePlugin;
