/**
 * Image Style Dialog Plugin
 * 图片样式编辑弹窗 - 提供完整的图片属性设置界面
 */
import type { Editor } from '../../core/Editor';
import { Plugin } from '../../core/Plugin';
export interface ImageStyleDialogOptions {
    /** 默认宽度单位 */
    defaultWidthUnit?: 'px' | '%' | 'auto';
    /** 显示高级选项 */
    showAdvanced?: boolean;
}
export declare class ImageStyleDialogPlugin extends Plugin {
    name: string;
    config: {
        name: string;
        commands: {};
        keys: {};
    };
    private options;
    private dialog;
    private currentImage;
    private originalStyles;
    constructor(options?: ImageStyleDialogOptions);
    install(editor: Editor): void;
    private handleDoubleClick;
    private handleOpenDialog;
    openDialog(image: HTMLImageElement): void;
    private saveOriginalStyles;
    private restoreOriginalStyles;
    private createDialog;
    private createHeader;
    private createContent;
    private createSection;
    private createSizeInput;
    private createAlignButtons;
    private createRangeInput;
    private createBorderInput;
    private createShadowButtons;
    private createTextInput;
    private createFooter;
    private getInputStyle;
    private closeDialog;
    private triggerChange;
    destroy(): void;
}
export default ImageStyleDialogPlugin;
//# sourceMappingURL=image-style-dialog.d.ts.map