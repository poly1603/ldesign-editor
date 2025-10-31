/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ContextMenuManager = require('../../../core/ContextMenuManager.cjs');
var lucide = require('../../../ui/icons/lucide.cjs');
var MediaPropertiesDialog = require('./MediaPropertiesDialog.cjs');

/**
 * Media Context Menu Plugin
 * Provides right-click context menus for images, videos, and audio elements
 */
class MediaContextMenuPlugin {
    constructor() {
        this.name = 'MediaContextMenu';
        this.editor = null;
        this.propertiesDialog = null;
        this.registeredMenuIds = [];
    }
    install(editor) {
        this.editor = editor;
        this.propertiesDialog = new MediaPropertiesDialog.MediaPropertiesDialog(editor);
        // Register menus with the global ContextMenuManager so they take precedence
        this.registerWithManager();
        this.bindEvents();
        console.log('[MediaContextMenu] Plugin installed');
    }
    // Register media menus with the shared manager (high priority)
    registerWithManager() {
        if (!this.editor)
            return;
        const manager = ContextMenuManager.getContextMenuManager();
        if (this.editor.contentElement)
            manager.setContainer(this.editor.contentElement);
        // Image menu
        ContextMenuManager.registerContextMenu({
            id: 'media-image-menu',
            selector: '.ldesign-editor-content img',
            priority: 20, // higher than paragraph/table
            items: ctx => this.getImageMenuItems(ctx.element),
        });
        // Video menu
        ContextMenuManager.registerContextMenu({
            id: 'media-video-menu',
            selector: '.ldesign-editor-content video',
            priority: 20,
            items: ctx => this.getVideoMenuItems(ctx.element),
        });
        // Audio menu
        ContextMenuManager.registerContextMenu({
            id: 'media-audio-menu',
            selector: '.ldesign-editor-content audio',
            priority: 20,
            items: ctx => this.getAudioMenuItems(ctx.element),
        });
        this.registeredMenuIds = ['media-image-menu', 'media-video-menu', 'media-audio-menu'];
    }
    bindEvents() {
        if (!this.editor || !this.editor.contentElement)
            return;
        // Only keep double-click behavior. Context menu is handled by ContextMenuManager now.
        this.editor.contentElement.addEventListener('dblclick', (e) => {
            const target = e.target;
            if (this.isMediaElement(target)) {
                e.preventDefault();
                this.openProperties(target);
            }
        });
    }
    isMediaElement(element) {
        const tagName = element.tagName.toLowerCase();
        return tagName === 'img' || tagName === 'video' || tagName === 'audio';
    }
    getMenuItemsForElement(element) {
        const tagName = element.tagName.toLowerCase();
        switch (tagName) {
            case 'img':
                return this.getImageMenuItems(element);
            case 'video':
                return this.getVideoMenuItems(element);
            case 'audio':
                return this.getAudioMenuItems(element);
            default:
                return [];
        }
    }
    getImageMenuItems(img) {
        return [
            {
                id: 'properties',
                label: '图片属性',
                icon: lucide.getLucideIcon('settings'),
                shortcut: 'Alt+Enter',
                action: ctx => this.openProperties(ctx?.element || ctx),
            },
            { divider: true },
            {
                id: 'filters',
                label: '滤镜效果',
                icon: lucide.getLucideIcon('palette'),
                submenu: [
                    {
                        id: 'filter-none',
                        label: '无滤镜',
                        checked: !img.style.filter,
                        action: ctx => this.applyFilter(ctx?.element || ctx, ''),
                    },
                    { divider: true },
                    {
                        id: 'filter-grayscale',
                        label: '黑白',
                        action: ctx => this.applyFilter(ctx?.element || ctx, 'grayscale(100%)'),
                    },
                    {
                        id: 'filter-sepia',
                        label: '复古',
                        action: ctx => this.applyFilter(ctx?.element || ctx, 'sepia(100%)'),
                    },
                    {
                        id: 'filter-blur',
                        label: '模糊',
                        action: ctx => this.applyFilter(ctx?.element || ctx, 'blur(3px)'),
                    },
                    {
                        id: 'filter-brightness',
                        label: '增亮',
                        action: ctx => this.applyFilter(ctx?.element || ctx, 'brightness(1.5)'),
                    },
                    {
                        id: 'filter-contrast',
                        label: '高对比度',
                        action: ctx => this.applyFilter(ctx?.element || ctx, 'contrast(1.5)'),
                    },
                    {
                        id: 'filter-invert',
                        label: '反色',
                        action: ctx => this.applyFilter(ctx?.element || ctx, 'invert(100%)'),
                    },
                ],
            },
            {
                id: 'size',
                label: '尺寸',
                icon: lucide.getLucideIcon('maximize'),
                submenu: [
                    {
                        id: 'size-small',
                        label: 'Text',
                        action: ctx => this.setImageSize(ctx?.element || ctx, '25%'),
                    },
                    {
                        id: 'size-medium',
                        label: 'Text',
                        action: ctx => this.setImageSize(ctx?.element || ctx, '50%'),
                    },
                    {
                        id: 'size-large',
                        label: 'Text',
                        action: ctx => this.setImageSize(ctx?.element || ctx, '75%'),
                    },
                    {
                        id: 'size-full',
                        label: '原始大小',
                        action: ctx => this.setImageSize(ctx?.element || ctx, 'auto'),
                    },
                    { divider: true },
                    {
                        id: 'size-custom',
                        label: 'Text',
                        action: ctx => this.openSizeDialog(ctx?.element || ctx),
                    },
                ],
            },
            {
                id: 'align',
                label: '对齐方式',
                icon: lucide.getLucideIcon('alignJustify'),
                submenu: [
                    {
                        id: 'align-left',
                        label: '左对齐',
                        action: ctx => this.setAlignment(ctx?.element || ctx, 'left'),
                    },
                    {
                        id: 'align-center',
                        label: '居中',
                        action: ctx => this.setAlignment(ctx?.element || ctx, 'center'),
                    },
                    {
                        id: 'align-right',
                        label: '右对齐',
                        action: ctx => this.setAlignment(ctx?.element || ctx, 'right'),
                    },
                ],
            },
            {
                id: 'float',
                label: '文字环绕',
                icon: lucide.getLucideIcon('wrapText'),
                submenu: [
                    {
                        id: 'float-none',
                        label: '无环绕',
                        checked: !img.style.float,
                        action: ctx => this.setFloat(ctx?.element || ctx, 'none'),
                    },
                    {
                        id: 'float-left',
                        label: '左侧环绕',
                        action: ctx => this.setFloat(ctx?.element || ctx, 'left'),
                    },
                    {
                        id: 'float-right',
                        label: '右侧环绕',
                        action: ctx => this.setFloat(ctx?.element || ctx, 'right'),
                    },
                ],
            },
            {
                id: 'border',
                label: '边框',
                icon: lucide.getLucideIcon('square'),
                submenu: [
                    {
                        id: 'border-none',
                        label: '无边框',
                        checked: !img.style.border,
                        action: ctx => this.setBorder(ctx?.element || ctx, 'none'),
                    },
                    {
                        id: 'border-thin',
                        label: '细边框',
                        action: ctx => this.setBorder(ctx?.element || ctx, '1px solid #ccc'),
                    },
                    {
                        id: 'border-medium',
                        label: '中等边框',
                        action: ctx => this.setBorder(ctx?.element || ctx, '2px solid #999'),
                    },
                    {
                        id: 'border-thick',
                        label: '粗边框',
                        action: ctx => this.setBorder(ctx?.element || ctx, '3px solid #666'),
                    },
                    {
                        id: 'border-rounded',
                        label: '圆角边框',
                        action: (ctx) => {
                            const target = ctx?.element || ctx;
                            this.setBorder(target, '2px solid #999');
                            target.style.borderRadius = '8px';
                        },
                    },
                ],
            },
            {
                id: 'shadow',
                label: '阴影',
                icon: lucide.getLucideIcon('droplet'),
                submenu: [
                    {
                        id: 'shadow-none',
                        label: '无阴影',
                        checked: !img.style.boxShadow,
                        action: ctx => this.setShadow(ctx?.element || ctx, 'none'),
                    },
                    {
                        id: 'shadow-small',
                        label: '小阴影',
                        action: ctx => this.setShadow(ctx?.element || ctx, '0 2px 4px rgba(0,0,0,0.1)'),
                    },
                    {
                        id: 'shadow-medium',
                        label: '中等阴影',
                        action: ctx => this.setShadow(ctx?.element || ctx, '0 4px 8px rgba(0,0,0,0.15)'),
                    },
                    {
                        id: 'shadow-large',
                        label: '大阴影',
                        action: ctx => this.setShadow(ctx?.element || ctx, '0 8px 16px rgba(0,0,0,0.2)'),
                    },
                ],
            },
            { divider: true },
            {
                id: 'copy-image',
                label: '复制图片',
                icon: lucide.getLucideIcon('copy'),
                shortcut: 'Ctrl+C',
                action: ctx => this.copyImage((ctx?.element || ctx)),
            },
            {
                id: 'save-as',
                label: 'Text',
                icon: lucide.getLucideIcon('download'),
                shortcut: 'Ctrl+S',
                action: ctx => this.saveImage((ctx?.element || ctx)),
            },
            { divider: true },
            {
                id: 'delete',
                label: '删除',
                icon: lucide.getLucideIcon('trash2'),
                shortcut: 'Delete',
                action: ctx => this.deleteElement(ctx?.element || ctx),
            },
        ];
    }
    getVideoMenuItems(video) {
        return [
            {
                id: 'properties',
                label: '视频属性',
                icon: lucide.getLucideIcon('settings'),
                shortcut: 'Alt+Enter',
                action: ctx => this.openProperties(ctx?.element || ctx),
            },
            { divider: true },
            {
                id: 'playback',
                label: '播放控制',
                icon: lucide.getLucideIcon('play'),
                submenu: [
                    {
                        id: 'play-pause',
                        label: video.paused ? '播放' : '暂停',
                        action: ctx => this.togglePlayPause((ctx?.element || ctx)),
                    },
                    {
                        id: 'mute',
                        label: video.muted ? '取消静音' : '静音',
                        action: ctx => this.toggleMute((ctx?.element || ctx)),
                    },
                    { divider: true },
                    {
                        id: 'speed-0.5',
                        label: '0.5x 速度',
                        action: ctx => this.setPlaybackSpeed((ctx?.element || ctx), 0.5),
                    },
                    {
                        id: 'speed-1',
                        label: '正常速度',
                        checked: video.playbackRate === 1,
                        action: ctx => this.setPlaybackSpeed((ctx?.element || ctx), 1),
                    },
                    {
                        id: 'speed-1.5',
                        label: '1.5x 速度',
                        action: ctx => this.setPlaybackSpeed((ctx?.element || ctx), 1.5),
                    },
                    {
                        id: 'speed-2',
                        label: '2x 速度',
                        action: ctx => this.setPlaybackSpeed((ctx?.element || ctx), 2),
                    },
                ],
            },
            {
                id: 'size',
                label: '尺寸',
                icon: lucide.getLucideIcon('maximize'),
                submenu: [
                    {
                        id: 'size-small',
                        label: 'Text',
                        action: ctx => this.setVideoSize(ctx?.element || ctx, 320),
                    },
                    {
                        id: 'size-medium',
                        label: 'Text',
                        action: ctx => this.setVideoSize(ctx?.element || ctx, 640),
                    },
                    {
                        id: 'size-large',
                        label: 'Text',
                        action: ctx => this.setVideoSize(ctx?.element || ctx, 960),
                    },
                    {
                        id: 'size-full',
                        label: '全宽',
                        action: ctx => this.setVideoSize(ctx?.element || ctx, -1),
                    },
                ],
            },
            {
                id: 'align',
                label: '对齐方式',
                icon: lucide.getLucideIcon('alignJustify'),
                submenu: [
                    {
                        id: 'align-left',
                        label: '左对齐',
                        action: ctx => this.setAlignment(ctx?.element || ctx, 'left'),
                    },
                    {
                        id: 'align-center',
                        label: '居中',
                        action: ctx => this.setAlignment(ctx?.element || ctx, 'center'),
                    },
                    {
                        id: 'align-right',
                        label: '右对齐',
                        action: ctx => this.setAlignment(ctx?.element || ctx, 'right'),
                    },
                ],
            },
            { divider: true },
            {
                id: 'loop',
                label: '循环播放',
                icon: lucide.getLucideIcon('repeat'),
                checked: video.loop,
                action: ctx => this.toggleLoop((ctx?.element || ctx)),
            },
            {
                id: 'controls',
                label: '显示控件',
                icon: lucide.getLucideIcon('eye'),
                checked: video.controls,
                action: ctx => this.toggleControls((ctx?.element || ctx)),
            },
            { divider: true },
            {
                id: 'delete',
                label: '删除',
                icon: lucide.getLucideIcon('trash2'),
                shortcut: 'Delete',
                action: ctx => this.deleteElement(ctx?.element || ctx),
            },
        ];
    }
    getAudioMenuItems(audio) {
        return [
            {
                id: 'properties',
                label: '音频属性',
                icon: lucide.getLucideIcon('settings'),
                shortcut: 'Alt+Enter',
                action: ctx => this.openProperties(ctx?.element || ctx),
            },
            { divider: true },
            {
                id: 'playback',
                label: '播放控制',
                icon: lucide.getLucideIcon('music'),
                submenu: [
                    {
                        id: 'play-pause',
                        label: audio.paused ? '播放' : '暂停',
                        action: ctx => this.togglePlayPause((ctx?.element || ctx)),
                    },
                    {
                        id: 'mute',
                        label: audio.muted ? '取消静音' : '静音',
                        action: ctx => this.toggleMute((ctx?.element || ctx)),
                    },
                    { divider: true },
                    {
                        id: 'speed-0.5',
                        label: '0.5x 速度',
                        action: ctx => this.setPlaybackSpeed((ctx?.element || ctx), 0.5),
                    },
                    {
                        id: 'speed-1',
                        label: '正常速度',
                        checked: audio.playbackRate === 1,
                        action: ctx => this.setPlaybackSpeed((ctx?.element || ctx), 1),
                    },
                    {
                        id: 'speed-1.5',
                        label: '1.5x 速度',
                        action: ctx => this.setPlaybackSpeed((ctx?.element || ctx), 1.5),
                    },
                    {
                        id: 'speed-2',
                        label: '2x 速度',
                        action: ctx => this.setPlaybackSpeed((ctx?.element || ctx), 2),
                    },
                ],
            },
            { divider: true },
            {
                id: 'loop',
                label: '循环播放',
                icon: lucide.getLucideIcon('repeat'),
                checked: audio.loop,
                action: ctx => this.toggleLoop((ctx?.element || ctx)),
            },
            {
                id: 'controls',
                label: '显示控件',
                icon: lucide.getLucideIcon('eye'),
                checked: audio.controls,
                action: ctx => this.toggleControls((ctx?.element || ctx)),
            },
            { divider: true },
            {
                id: 'delete',
                label: '删除',
                icon: lucide.getLucideIcon('trash2'),
                shortcut: 'Delete',
                action: ctx => this.deleteElement(ctx?.element || ctx),
            },
        ];
    }
    // Image-specific actions
    applyFilter(target, filter) {
        target.style.filter = filter;
        this.editor?.emit('input');
        console.log('[MediaContextMenu] Applied filter:', filter);
    }
    setImageSize(target, size) {
        if (size === 'auto') {
            target.style.width = '';
            target.style.height = '';
        }
        else {
            target.style.width = size;
            target.style.height = 'auto';
        }
        this.editor?.emit('input');
        console.log('[MediaContextMenu] Set image size:', size);
    }
    setAlignment(target, align) {
        target.style.display = 'block';
        if (align === 'center') {
            target.style.marginLeft = 'auto';
            target.style.marginRight = 'auto';
        }
        else if (align === 'left') {
            target.style.marginLeft = '0';
            target.style.marginRight = 'auto';
        }
        else if (align === 'right') {
            target.style.marginLeft = 'auto';
            target.style.marginRight = '0';
        }
        this.editor?.emit('input');
        console.log('[MediaContextMenu] Set alignment:', align);
    }
    setFloat(target, float) {
        if (float === 'none') {
            target.style.float = '';
            target.style.margin = '';
        }
        else {
            target.style.float = float;
            target.style.margin = '10px';
            if (float === 'left')
                target.style.marginLeft = '0';
            else
                target.style.marginRight = '0';
        }
        this.editor?.emit('input');
        console.log('[MediaContextMenu] Set float:', float);
    }
    setBorder(target, border) {
        target.style.border = border;
        this.editor?.emit('input');
        console.log('[MediaContextMenu] Set border:', border);
    }
    setShadow(target, shadow) {
        target.style.boxShadow = shadow;
        this.editor?.emit('input');
        console.log('[MediaContextMenu] Set shadow:', shadow);
    }
    copyImage(img) {
        // Create a canvas to copy the image
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                if (blob) {
                    const item = new ClipboardItem({ 'image/png': blob });
                    navigator.clipboard.write([item]).then(() => {
                        console.log('[MediaContextMenu] Image copied to clipboard');
                    });
                }
            });
        }
    }
    saveImage(img) {
        const link = document.createElement('a');
        link.href = img.src;
        link.download = img.alt || 'image.png';
        link.click();
        console.log('[MediaContextMenu] Image download initiated');
    }
    // Video/Audio-specific actions
    togglePlayPause(media) {
        if (media.paused)
            media.play();
        else
            media.pause();
        console.log('[MediaContextMenu] Toggle play/pause:', !media.paused);
    }
    toggleMute(media) {
        media.muted = !media.muted;
        console.log('[MediaContextMenu] Toggle mute:', media.muted);
    }
    setPlaybackSpeed(media, speed) {
        media.playbackRate = speed;
        console.log('[MediaContextMenu] Set playback speed:', speed);
    }
    setVideoSize(target, width) {
        if (width === -1)
            target.style.width = '100%';
        else
            target.style.width = `${width}px`;
        target.style.height = 'auto';
        this.editor?.emit('input');
        console.log('[MediaContextMenu] Set video size:', width);
    }
    toggleLoop(media) {
        media.loop = !media.loop;
        this.editor?.emit('input');
        console.log('[MediaContextMenu] Toggle loop:', media.loop);
    }
    toggleControls(media) {
        media.controls = !media.controls;
        this.editor?.emit('input');
        console.log('[MediaContextMenu] Toggle controls:', media.controls);
    }
    // Common actions
    deleteElement(target) {
        if (confirm('确定要删除这个元素吗？')) {
            target.remove();
            this.editor?.emit('input');
            console.log('[MediaContextMenu] Element deleted');
        }
    }
    openSizeDialog(target) {
        const width = prompt('请输入宽度?(例如: 300px, 50%, auto):', target.style.width || 'auto');
        if (width !== null) {
            const height = prompt('请输入高度?(例如: 200px, auto):', target.style.height || 'auto');
            if (height !== null) {
                target.style.width = width;
                target.style.height = height;
                this.editor?.emit('input');
                console.log('[MediaContextMenu] Custom size set:', width, height);
            }
        }
    }
    openProperties(target) {
        if (this.propertiesDialog)
            this.propertiesDialog.open(target);
    }
    destroy() {
        // Unregister menus from manager
        if (this.registeredMenuIds.length) {
            try {
                const manager = ContextMenuManager.getContextMenuManager();
                this.registeredMenuIds.forEach((id) => {
                    try {
                        manager.unregister(id);
                    }
                    catch { }
                });
            }
            catch { }
            this.registeredMenuIds = [];
        }
        if (this.propertiesDialog) {
            this.propertiesDialog.destroy();
            this.propertiesDialog = null;
        }
        console.log('[MediaContextMenu] Plugin destroyed');
    }
}

exports.MediaContextMenuPlugin = MediaContextMenuPlugin;
exports.default = MediaContextMenuPlugin;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=MediaContextMenuPlugin.cjs.map
