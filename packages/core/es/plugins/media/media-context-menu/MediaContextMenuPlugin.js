/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { getContextMenuManager, registerContextMenu } from '../../../core/ContextMenuManager.js';
import { getLucideIcon } from '../../../ui/icons/lucide.js';
import { MediaPropertiesDialog } from './MediaPropertiesDialog.js';

class MediaContextMenuPlugin {
  constructor() {
    this.name = "MediaContextMenu";
    this.editor = null;
    this.propertiesDialog = null;
    this.registeredMenuIds = [];
  }
  install(editor) {
    this.editor = editor;
    this.propertiesDialog = new MediaPropertiesDialog(editor);
    this.registerWithManager();
    this.bindEvents();
    console.log("[MediaContextMenu] Plugin installed");
  }
  // Register media menus with the shared manager (high priority)
  registerWithManager() {
    if (!this.editor)
      return;
    const manager = getContextMenuManager();
    if (this.editor.contentElement)
      manager.setContainer(this.editor.contentElement);
    registerContextMenu({
      id: "media-image-menu",
      selector: ".ldesign-editor-content img",
      priority: 20,
      // higher than paragraph/table
      items: (ctx) => this.getImageMenuItems(ctx.element)
    });
    registerContextMenu({
      id: "media-video-menu",
      selector: ".ldesign-editor-content video",
      priority: 20,
      items: (ctx) => this.getVideoMenuItems(ctx.element)
    });
    registerContextMenu({
      id: "media-audio-menu",
      selector: ".ldesign-editor-content audio",
      priority: 20,
      items: (ctx) => this.getAudioMenuItems(ctx.element)
    });
    this.registeredMenuIds = ["media-image-menu", "media-video-menu", "media-audio-menu"];
  }
  bindEvents() {
    if (!this.editor || !this.editor.contentElement)
      return;
    this.editor.contentElement.addEventListener("dblclick", (e) => {
      const target = e.target;
      if (this.isMediaElement(target)) {
        e.preventDefault();
        this.openProperties(target);
      }
    });
  }
  isMediaElement(element) {
    const tagName = element.tagName.toLowerCase();
    return tagName === "img" || tagName === "video" || tagName === "audio";
  }
  getMenuItemsForElement(element) {
    const tagName = element.tagName.toLowerCase();
    switch (tagName) {
      case "img":
        return this.getImageMenuItems(element);
      case "video":
        return this.getVideoMenuItems(element);
      case "audio":
        return this.getAudioMenuItems(element);
      default:
        return [];
    }
  }
  getImageMenuItems(img) {
    return [{
      id: "properties",
      label: "\u56FE\u7247\u5C5E\u6027",
      icon: getLucideIcon("settings"),
      shortcut: "Alt+Enter",
      action: (ctx) => this.openProperties(ctx?.element || ctx)
    }, {
      divider: true
    }, {
      id: "filters",
      label: "\u6EE4\u955C\u6548\u679C",
      icon: getLucideIcon("palette"),
      submenu: [{
        id: "filter-none",
        label: "\u65E0\u6EE4\u955C",
        checked: !img.style.filter,
        action: (ctx) => this.applyFilter(ctx?.element || ctx, "")
      }, {
        divider: true
      }, {
        id: "filter-grayscale",
        label: "\u9ED1\u767D",
        action: (ctx) => this.applyFilter(ctx?.element || ctx, "grayscale(100%)")
      }, {
        id: "filter-sepia",
        label: "\u590D\u53E4",
        action: (ctx) => this.applyFilter(ctx?.element || ctx, "sepia(100%)")
      }, {
        id: "filter-blur",
        label: "\u6A21\u7CCA",
        action: (ctx) => this.applyFilter(ctx?.element || ctx, "blur(3px)")
      }, {
        id: "filter-brightness",
        label: "\u589E\u4EAE",
        action: (ctx) => this.applyFilter(ctx?.element || ctx, "brightness(1.5)")
      }, {
        id: "filter-contrast",
        label: "\u9AD8\u5BF9\u6BD4\u5EA6",
        action: (ctx) => this.applyFilter(ctx?.element || ctx, "contrast(1.5)")
      }, {
        id: "filter-invert",
        label: "\u53CD\u8272",
        action: (ctx) => this.applyFilter(ctx?.element || ctx, "invert(100%)")
      }]
    }, {
      id: "size",
      label: "\u5C3A\u5BF8",
      icon: getLucideIcon("maximize"),
      submenu: [{
        id: "size-small",
        label: "Text",
        action: (ctx) => this.setImageSize(ctx?.element || ctx, "25%")
      }, {
        id: "size-medium",
        label: "Text",
        action: (ctx) => this.setImageSize(ctx?.element || ctx, "50%")
      }, {
        id: "size-large",
        label: "Text",
        action: (ctx) => this.setImageSize(ctx?.element || ctx, "75%")
      }, {
        id: "size-full",
        label: "\u539F\u59CB\u5927\u5C0F",
        action: (ctx) => this.setImageSize(ctx?.element || ctx, "auto")
      }, {
        divider: true
      }, {
        id: "size-custom",
        label: "Text",
        action: (ctx) => this.openSizeDialog(ctx?.element || ctx)
      }]
    }, {
      id: "align",
      label: "\u5BF9\u9F50\u65B9\u5F0F",
      icon: getLucideIcon("alignJustify"),
      submenu: [{
        id: "align-left",
        label: "\u5DE6\u5BF9\u9F50",
        action: (ctx) => this.setAlignment(ctx?.element || ctx, "left")
      }, {
        id: "align-center",
        label: "\u5C45\u4E2D",
        action: (ctx) => this.setAlignment(ctx?.element || ctx, "center")
      }, {
        id: "align-right",
        label: "\u53F3\u5BF9\u9F50",
        action: (ctx) => this.setAlignment(ctx?.element || ctx, "right")
      }]
    }, {
      id: "float",
      label: "\u6587\u5B57\u73AF\u7ED5",
      icon: getLucideIcon("wrapText"),
      submenu: [{
        id: "float-none",
        label: "\u65E0\u73AF\u7ED5",
        checked: !img.style.float,
        action: (ctx) => this.setFloat(ctx?.element || ctx, "none")
      }, {
        id: "float-left",
        label: "\u5DE6\u4FA7\u73AF\u7ED5",
        action: (ctx) => this.setFloat(ctx?.element || ctx, "left")
      }, {
        id: "float-right",
        label: "\u53F3\u4FA7\u73AF\u7ED5",
        action: (ctx) => this.setFloat(ctx?.element || ctx, "right")
      }]
    }, {
      id: "border",
      label: "\u8FB9\u6846",
      icon: getLucideIcon("square"),
      submenu: [{
        id: "border-none",
        label: "\u65E0\u8FB9\u6846",
        checked: !img.style.border,
        action: (ctx) => this.setBorder(ctx?.element || ctx, "none")
      }, {
        id: "border-thin",
        label: "\u7EC6\u8FB9\u6846",
        action: (ctx) => this.setBorder(ctx?.element || ctx, "1px solid #ccc")
      }, {
        id: "border-medium",
        label: "\u4E2D\u7B49\u8FB9\u6846",
        action: (ctx) => this.setBorder(ctx?.element || ctx, "2px solid #999")
      }, {
        id: "border-thick",
        label: "\u7C97\u8FB9\u6846",
        action: (ctx) => this.setBorder(ctx?.element || ctx, "3px solid #666")
      }, {
        id: "border-rounded",
        label: "\u5706\u89D2\u8FB9\u6846",
        action: (ctx) => {
          const target = ctx?.element || ctx;
          this.setBorder(target, "2px solid #999");
          target.style.borderRadius = "8px";
        }
      }]
    }, {
      id: "shadow",
      label: "\u9634\u5F71",
      icon: getLucideIcon("droplet"),
      submenu: [{
        id: "shadow-none",
        label: "\u65E0\u9634\u5F71",
        checked: !img.style.boxShadow,
        action: (ctx) => this.setShadow(ctx?.element || ctx, "none")
      }, {
        id: "shadow-small",
        label: "\u5C0F\u9634\u5F71",
        action: (ctx) => this.setShadow(ctx?.element || ctx, "0 2px 4px rgba(0,0,0,0.1)")
      }, {
        id: "shadow-medium",
        label: "\u4E2D\u7B49\u9634\u5F71",
        action: (ctx) => this.setShadow(ctx?.element || ctx, "0 4px 8px rgba(0,0,0,0.15)")
      }, {
        id: "shadow-large",
        label: "\u5927\u9634\u5F71",
        action: (ctx) => this.setShadow(ctx?.element || ctx, "0 8px 16px rgba(0,0,0,0.2)")
      }]
    }, {
      divider: true
    }, {
      id: "copy-image",
      label: "\u590D\u5236\u56FE\u7247",
      icon: getLucideIcon("copy"),
      shortcut: "Ctrl+C",
      action: (ctx) => this.copyImage(ctx?.element || ctx)
    }, {
      id: "save-as",
      label: "Text",
      icon: getLucideIcon("download"),
      shortcut: "Ctrl+S",
      action: (ctx) => this.saveImage(ctx?.element || ctx)
    }, {
      divider: true
    }, {
      id: "delete",
      label: "\u5220\u9664",
      icon: getLucideIcon("trash2"),
      shortcut: "Delete",
      action: (ctx) => this.deleteElement(ctx?.element || ctx)
    }];
  }
  getVideoMenuItems(video) {
    return [{
      id: "properties",
      label: "\u89C6\u9891\u5C5E\u6027",
      icon: getLucideIcon("settings"),
      shortcut: "Alt+Enter",
      action: (ctx) => this.openProperties(ctx?.element || ctx)
    }, {
      divider: true
    }, {
      id: "playback",
      label: "\u64AD\u653E\u63A7\u5236",
      icon: getLucideIcon("play"),
      submenu: [{
        id: "play-pause",
        label: video.paused ? "\u64AD\u653E" : "\u6682\u505C",
        action: (ctx) => this.togglePlayPause(ctx?.element || ctx)
      }, {
        id: "mute",
        label: video.muted ? "\u53D6\u6D88\u9759\u97F3" : "\u9759\u97F3",
        action: (ctx) => this.toggleMute(ctx?.element || ctx)
      }, {
        divider: true
      }, {
        id: "speed-0.5",
        label: "0.5x \u901F\u5EA6",
        action: (ctx) => this.setPlaybackSpeed(ctx?.element || ctx, 0.5)
      }, {
        id: "speed-1",
        label: "\u6B63\u5E38\u901F\u5EA6",
        checked: video.playbackRate === 1,
        action: (ctx) => this.setPlaybackSpeed(ctx?.element || ctx, 1)
      }, {
        id: "speed-1.5",
        label: "1.5x \u901F\u5EA6",
        action: (ctx) => this.setPlaybackSpeed(ctx?.element || ctx, 1.5)
      }, {
        id: "speed-2",
        label: "2x \u901F\u5EA6",
        action: (ctx) => this.setPlaybackSpeed(ctx?.element || ctx, 2)
      }]
    }, {
      id: "size",
      label: "\u5C3A\u5BF8",
      icon: getLucideIcon("maximize"),
      submenu: [{
        id: "size-small",
        label: "Text",
        action: (ctx) => this.setVideoSize(ctx?.element || ctx, 320)
      }, {
        id: "size-medium",
        label: "Text",
        action: (ctx) => this.setVideoSize(ctx?.element || ctx, 640)
      }, {
        id: "size-large",
        label: "Text",
        action: (ctx) => this.setVideoSize(ctx?.element || ctx, 960)
      }, {
        id: "size-full",
        label: "\u5168\u5BBD",
        action: (ctx) => this.setVideoSize(ctx?.element || ctx, -1)
      }]
    }, {
      id: "align",
      label: "\u5BF9\u9F50\u65B9\u5F0F",
      icon: getLucideIcon("alignJustify"),
      submenu: [{
        id: "align-left",
        label: "\u5DE6\u5BF9\u9F50",
        action: (ctx) => this.setAlignment(ctx?.element || ctx, "left")
      }, {
        id: "align-center",
        label: "\u5C45\u4E2D",
        action: (ctx) => this.setAlignment(ctx?.element || ctx, "center")
      }, {
        id: "align-right",
        label: "\u53F3\u5BF9\u9F50",
        action: (ctx) => this.setAlignment(ctx?.element || ctx, "right")
      }]
    }, {
      divider: true
    }, {
      id: "loop",
      label: "\u5FAA\u73AF\u64AD\u653E",
      icon: getLucideIcon("repeat"),
      checked: video.loop,
      action: (ctx) => this.toggleLoop(ctx?.element || ctx)
    }, {
      id: "controls",
      label: "\u663E\u793A\u63A7\u4EF6",
      icon: getLucideIcon("eye"),
      checked: video.controls,
      action: (ctx) => this.toggleControls(ctx?.element || ctx)
    }, {
      divider: true
    }, {
      id: "delete",
      label: "\u5220\u9664",
      icon: getLucideIcon("trash2"),
      shortcut: "Delete",
      action: (ctx) => this.deleteElement(ctx?.element || ctx)
    }];
  }
  getAudioMenuItems(audio) {
    return [{
      id: "properties",
      label: "\u97F3\u9891\u5C5E\u6027",
      icon: getLucideIcon("settings"),
      shortcut: "Alt+Enter",
      action: (ctx) => this.openProperties(ctx?.element || ctx)
    }, {
      divider: true
    }, {
      id: "playback",
      label: "\u64AD\u653E\u63A7\u5236",
      icon: getLucideIcon("music"),
      submenu: [{
        id: "play-pause",
        label: audio.paused ? "\u64AD\u653E" : "\u6682\u505C",
        action: (ctx) => this.togglePlayPause(ctx?.element || ctx)
      }, {
        id: "mute",
        label: audio.muted ? "\u53D6\u6D88\u9759\u97F3" : "\u9759\u97F3",
        action: (ctx) => this.toggleMute(ctx?.element || ctx)
      }, {
        divider: true
      }, {
        id: "speed-0.5",
        label: "0.5x \u901F\u5EA6",
        action: (ctx) => this.setPlaybackSpeed(ctx?.element || ctx, 0.5)
      }, {
        id: "speed-1",
        label: "\u6B63\u5E38\u901F\u5EA6",
        checked: audio.playbackRate === 1,
        action: (ctx) => this.setPlaybackSpeed(ctx?.element || ctx, 1)
      }, {
        id: "speed-1.5",
        label: "1.5x \u901F\u5EA6",
        action: (ctx) => this.setPlaybackSpeed(ctx?.element || ctx, 1.5)
      }, {
        id: "speed-2",
        label: "2x \u901F\u5EA6",
        action: (ctx) => this.setPlaybackSpeed(ctx?.element || ctx, 2)
      }]
    }, {
      divider: true
    }, {
      id: "loop",
      label: "\u5FAA\u73AF\u64AD\u653E",
      icon: getLucideIcon("repeat"),
      checked: audio.loop,
      action: (ctx) => this.toggleLoop(ctx?.element || ctx)
    }, {
      id: "controls",
      label: "\u663E\u793A\u63A7\u4EF6",
      icon: getLucideIcon("eye"),
      checked: audio.controls,
      action: (ctx) => this.toggleControls(ctx?.element || ctx)
    }, {
      divider: true
    }, {
      id: "delete",
      label: "\u5220\u9664",
      icon: getLucideIcon("trash2"),
      shortcut: "Delete",
      action: (ctx) => this.deleteElement(ctx?.element || ctx)
    }];
  }
  // Image-specific actions
  applyFilter(target, filter) {
    target.style.filter = filter;
    this.editor?.emit("input");
    console.log("[MediaContextMenu] Applied filter:", filter);
  }
  setImageSize(target, size) {
    if (size === "auto") {
      target.style.width = "";
      target.style.height = "";
    } else {
      target.style.width = size;
      target.style.height = "auto";
    }
    this.editor?.emit("input");
    console.log("[MediaContextMenu] Set image size:", size);
  }
  setAlignment(target, align) {
    target.style.display = "block";
    if (align === "center") {
      target.style.marginLeft = "auto";
      target.style.marginRight = "auto";
    } else if (align === "left") {
      target.style.marginLeft = "0";
      target.style.marginRight = "auto";
    } else if (align === "right") {
      target.style.marginLeft = "auto";
      target.style.marginRight = "0";
    }
    this.editor?.emit("input");
    console.log("[MediaContextMenu] Set alignment:", align);
  }
  setFloat(target, float) {
    if (float === "none") {
      target.style.float = "";
      target.style.margin = "";
    } else {
      target.style.float = float;
      target.style.margin = "10px";
      if (float === "left")
        target.style.marginLeft = "0";
      else
        target.style.marginRight = "0";
    }
    this.editor?.emit("input");
    console.log("[MediaContextMenu] Set float:", float);
  }
  setBorder(target, border) {
    target.style.border = border;
    this.editor?.emit("input");
    console.log("[MediaContextMenu] Set border:", border);
  }
  setShadow(target, shadow) {
    target.style.boxShadow = shadow;
    this.editor?.emit("input");
    console.log("[MediaContextMenu] Set shadow:", shadow);
  }
  copyImage(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const item = new ClipboardItem({
            "image/png": blob
          });
          navigator.clipboard.write([item]).then(() => {
            console.log("[MediaContextMenu] Image copied to clipboard");
          });
        }
      });
    }
  }
  saveImage(img) {
    const link = document.createElement("a");
    link.href = img.src;
    link.download = img.alt || "image.png";
    link.click();
    console.log("[MediaContextMenu] Image download initiated");
  }
  // Video/Audio-specific actions
  togglePlayPause(media) {
    if (media.paused)
      media.play();
    else
      media.pause();
    console.log("[MediaContextMenu] Toggle play/pause:", !media.paused);
  }
  toggleMute(media) {
    media.muted = !media.muted;
    console.log("[MediaContextMenu] Toggle mute:", media.muted);
  }
  setPlaybackSpeed(media, speed) {
    media.playbackRate = speed;
    console.log("[MediaContextMenu] Set playback speed:", speed);
  }
  setVideoSize(target, width) {
    if (width === -1)
      target.style.width = "100%";
    else
      target.style.width = `${width}px`;
    target.style.height = "auto";
    this.editor?.emit("input");
    console.log("[MediaContextMenu] Set video size:", width);
  }
  toggleLoop(media) {
    media.loop = !media.loop;
    this.editor?.emit("input");
    console.log("[MediaContextMenu] Toggle loop:", media.loop);
  }
  toggleControls(media) {
    media.controls = !media.controls;
    this.editor?.emit("input");
    console.log("[MediaContextMenu] Toggle controls:", media.controls);
  }
  // Common actions
  deleteElement(target) {
    if (confirm("\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u5143\u7D20\u5417\uFF1F")) {
      target.remove();
      this.editor?.emit("input");
      console.log("[MediaContextMenu] Element deleted");
    }
  }
  openSizeDialog(target) {
    const width = prompt("\u8BF7\u8F93\u5165\u5BBD\u5EA6?(\u4F8B\u5982: 300px, 50%, auto):", target.style.width || "auto");
    if (width !== null) {
      const height = prompt("\u8BF7\u8F93\u5165\u9AD8\u5EA6?(\u4F8B\u5982: 200px, auto):", target.style.height || "auto");
      if (height !== null) {
        target.style.width = width;
        target.style.height = height;
        this.editor?.emit("input");
        console.log("[MediaContextMenu] Custom size set:", width, height);
      }
    }
  }
  openProperties(target) {
    if (this.propertiesDialog)
      this.propertiesDialog.open(target);
  }
  destroy() {
    if (this.registeredMenuIds.length) {
      try {
        const manager = getContextMenuManager();
        this.registeredMenuIds.forEach((id) => {
          try {
            manager.unregister(id);
          } catch {
          }
        });
      } catch {
      }
      this.registeredMenuIds = [];
    }
    if (this.propertiesDialog) {
      this.propertiesDialog.destroy();
      this.propertiesDialog = null;
    }
    console.log("[MediaContextMenu] Plugin destroyed");
  }
}

export { MediaContextMenuPlugin, MediaContextMenuPlugin as default };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=MediaContextMenuPlugin.js.map
