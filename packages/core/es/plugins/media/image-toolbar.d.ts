/**
 * Image Toolbar Plugin
 * 图片悬浮工具栏 - 提供快捷操作按钮
 */
import type { Editor } from '../../core/Editor';
import { Plugin } from '../../core/Plugin';
export interface ImageToolbarOptions {
    /** 工具栏显示位置 */
    position?: 'top' | 'bottom';
    /** 是否显示对齐按钮 */
    showAlign?: boolean;
    /** 是否显示链接按钮 */
    showLink?: boolean;
    /** 是否显示删除按钮 */
    showDelete?: boolean;
    /** 是否显示编辑按钮 */
    showEdit?: boolean;
    /** 自定义工具栏项 */
    customItems?: ToolbarItem[];
}
export interface ToolbarItem {
    name: string;
    icon: string;
    title: string;
    action: (image: HTMLImageElement, editor: Editor) => void;
}
export declare class ImageToolbarPlugin extends Plugin {
    name: string;
    config: {
        name: string;
        commands: {};
        keys: {};
    };
    private options;
    private toolbar;
    private currentImage;
    constructor(options?: ImageToolbarOptions);
    install(editor: Editor): void;
    private bindEvents;
    private handleImageClick;
    private handleDocumentClick;
    private showToolbar;
    private hideToolbar;
    private createToolbar;
    private addToolbarGroup;
    private addToolbarButton;
    private addSeparator;
    private updateToolbarPosition;
    private setAlign;
    private setSize;
    private addLink;
    private openStyleDialog;
    private replaceImage;
    private deleteImage;
    private triggerChange;
    destroy(): void;
}
export default ImageToolbarPlugin;
//# sourceMappingURL=image-toolbar.d.ts.map