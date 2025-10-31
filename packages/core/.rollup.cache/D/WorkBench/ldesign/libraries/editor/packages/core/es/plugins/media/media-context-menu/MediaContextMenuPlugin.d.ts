import type { Editor } from '../../../core/Editor';
import type { Plugin } from '../../../types';
/**
 * Media Context Menu Plugin
 * Provides right-click context menus for images, videos, and audio elements
 */
export declare class MediaContextMenuPlugin implements Plugin {
    name: string;
    editor: Editor | null;
    private propertiesDialog;
    private registeredMenuIds;
    install(editor: Editor): void;
    private registerWithManager;
    private bindEvents;
    private isMediaElement;
    private getMenuItemsForElement;
    private getImageMenuItems;
    private getVideoMenuItems;
    private getAudioMenuItems;
    private applyFilter;
    private setImageSize;
    private setAlignment;
    private setFloat;
    private setBorder;
    private setShadow;
    private copyImage;
    private saveImage;
    private togglePlayPause;
    private toggleMute;
    private setPlaybackSpeed;
    private setVideoSize;
    private toggleLoop;
    private toggleControls;
    private deleteElement;
    private openSizeDialog;
    private openProperties;
    destroy(): void;
}
export default MediaContextMenuPlugin;
