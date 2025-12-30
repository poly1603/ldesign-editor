/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Plugin = require('../../core/Plugin.cjs');
var lucide = require('../../ui/icons/lucide.cjs');

class ImageToolbarPlugin extends Plugin.Plugin {
  constructor(options = {}) {
    super();
    this.name = "imageToolbar";
    this.config = {
      name: "imageToolbar",
      commands: {},
      keys: {}
    };
    this.toolbar = null;
    this.currentImage = null;
    this.options = {
      position: "top",
      showAlign: true,
      showLink: true,
      showDelete: true,
      showEdit: true,
      ...options
    };
  }
  install(editor) {
    super.install(editor);
    this.bindEvents();
    console.log("[ImageToolbarPlugin] Installed");
  }
  bindEvents() {
    const editorElement = this.editor?.contentElement;
    if (!editorElement)
      return;
    editorElement.addEventListener("click", this.handleImageClick.bind(this));
    document.addEventListener("click", this.handleDocumentClick.bind(this));
    editorElement.addEventListener("scroll", this.updateToolbarPosition.bind(this));
    window.addEventListener("scroll", this.updateToolbarPosition.bind(this));
    window.addEventListener("resize", this.updateToolbarPosition.bind(this));
  }
  handleImageClick(e) {
    const target = e.target;
    if (target.tagName === "IMG") {
      e.stopPropagation();
      this.showToolbar(target);
    }
  }
  handleDocumentClick(e) {
    const target = e.target;
    if (target.tagName !== "IMG" && !this.toolbar?.contains(target)) {
      this.hideToolbar();
    }
  }
  showToolbar(image) {
    this.hideToolbar();
    this.currentImage = image;
    this.toolbar = this.createToolbar();
    document.body.appendChild(this.toolbar);
    this.updateToolbarPosition();
  }
  hideToolbar() {
    if (this.toolbar) {
      this.toolbar.remove();
      this.toolbar = null;
    }
    this.currentImage = null;
  }
  createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "ldesign-image-toolbar";
    toolbar.style.cssText = `
      position: fixed;
      display: flex;
      gap: 2px;
      padding: 4px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10001;
      user-select: none;
    `;
    if (this.options.showAlign) {
      this.addToolbarGroup(toolbar, [{
        name: "alignLeft",
        icon: "alignLeft",
        title: "\u5DE6\u5BF9\u9F50",
        action: () => this.setAlign("left")
      }, {
        name: "alignCenter",
        icon: "alignCenter",
        title: "\u5C45\u4E2D",
        action: () => this.setAlign("center")
      }, {
        name: "alignRight",
        icon: "alignRight",
        title: "\u53F3\u5BF9\u9F50",
        action: () => this.setAlign("right")
      }]);
      this.addSeparator(toolbar);
    }
    this.addToolbarGroup(toolbar, [{
      name: "sizeSmall",
      icon: "minimize2",
      title: "\u5C0F\u5C3A\u5BF8 (25%)",
      action: () => this.setSize("25%")
    }, {
      name: "sizeMedium",
      icon: "square",
      title: "\u4E2D\u5C3A\u5BF8 (50%)",
      action: () => this.setSize("50%")
    }, {
      name: "sizeLarge",
      icon: "maximize2",
      title: "\u5927\u5C3A\u5BF8 (100%)",
      action: () => this.setSize("100%")
    }]);
    this.addSeparator(toolbar);
    if (this.options.showLink) {
      this.addToolbarButton(toolbar, {
        name: "link",
        icon: "link",
        title: "\u6DFB\u52A0\u94FE\u63A5",
        action: () => this.addLink()
      });
    }
    if (this.options.showEdit) {
      this.addToolbarButton(toolbar, {
        name: "edit",
        icon: "settings",
        title: "\u56FE\u7247\u8BBE\u7F6E",
        action: () => this.openStyleDialog()
      });
    }
    this.addToolbarButton(toolbar, {
      name: "replace",
      icon: "refreshCw",
      title: "\u66FF\u6362\u56FE\u7247",
      action: () => this.replaceImage()
    });
    if (this.options.showDelete) {
      this.addSeparator(toolbar);
      this.addToolbarButton(toolbar, {
        name: "delete",
        icon: "trash2",
        title: "\u5220\u9664\u56FE\u7247",
        action: () => this.deleteImage(),
        danger: true
      });
    }
    if (this.options.customItems?.length) {
      this.addSeparator(toolbar);
      this.options.customItems.forEach((item) => {
        this.addToolbarButton(toolbar, {
          ...item,
          action: () => item.action(this.currentImage, this.editor)
        });
      });
    }
    return toolbar;
  }
  addToolbarGroup(container, items) {
    const group = document.createElement("div");
    group.style.cssText = "display: flex; gap: 2px;";
    items.forEach((item) => {
      this.addToolbarButton(group, item);
    });
    container.appendChild(group);
  }
  addToolbarButton(container, item) {
    const button = document.createElement("button");
    button.className = `image-toolbar-btn btn-${item.name}`;
    button.title = item.title;
    button.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      background: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      color: ${item.danger ? "#ef4444" : "#374151"};
      transition: all 0.2s;
    `;
    button.innerHTML = lucide.getLucideIcon(item.icon);
    button.onmouseenter = () => {
      button.style.background = item.danger ? "#fee2e2" : "#f3f4f6";
    };
    button.onmouseleave = () => {
      button.style.background = "transparent";
    };
    button.onclick = (e) => {
      e.stopPropagation();
      item.action();
    };
    container.appendChild(button);
  }
  addSeparator(container) {
    const separator = document.createElement("div");
    separator.style.cssText = `
      width: 1px;
      height: 24px;
      background: #e5e7eb;
      margin: 4px 4px;
    `;
    container.appendChild(separator);
  }
  updateToolbarPosition() {
    if (!this.toolbar || !this.currentImage)
      return;
    const imgRect = this.currentImage.getBoundingClientRect();
    const toolbarRect = this.toolbar.getBoundingClientRect();
    let top;
    if (this.options.position === "bottom") {
      top = imgRect.bottom + 8;
    } else {
      top = imgRect.top - toolbarRect.height - 8;
    }
    if (top < 10) {
      top = imgRect.bottom + 8;
    }
    if (top + toolbarRect.height > window.innerHeight - 10) {
      top = imgRect.top - toolbarRect.height - 8;
    }
    let left = imgRect.left + (imgRect.width - toolbarRect.width) / 2;
    left = Math.max(10, Math.min(left, window.innerWidth - toolbarRect.width - 10));
    this.toolbar.style.top = `${top}px`;
    this.toolbar.style.left = `${left}px`;
  }
  // 功能实现
  setAlign(align) {
    if (!this.currentImage)
      return;
    this.currentImage.style.float = "";
    this.currentImage.style.marginLeft = "";
    this.currentImage.style.marginRight = "";
    this.currentImage.style.display = "";
    switch (align) {
      case "left":
        this.currentImage.style.display = "block";
        this.currentImage.style.marginRight = "auto";
        break;
      case "center":
        this.currentImage.style.display = "block";
        this.currentImage.style.marginLeft = "auto";
        this.currentImage.style.marginRight = "auto";
        break;
      case "right":
        this.currentImage.style.display = "block";
        this.currentImage.style.marginLeft = "auto";
        break;
    }
    this.triggerChange();
  }
  setSize(size) {
    if (!this.currentImage)
      return;
    this.currentImage.style.width = size;
    this.currentImage.style.height = "auto";
    this.updateToolbarPosition();
    this.triggerChange();
  }
  addLink() {
    if (!this.currentImage)
      return;
    const existingLink = this.currentImage.parentElement?.tagName === "A" ? this.currentImage.parentElement.href : "";
    const url = prompt("\u8F93\u5165\u94FE\u63A5\u5730\u5740:", existingLink);
    if (url === null)
      return;
    if (url) {
      if (this.currentImage.parentElement?.tagName === "A") {
        this.currentImage.parentElement.href = url;
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        this.currentImage.parentNode?.insertBefore(link, this.currentImage);
        link.appendChild(this.currentImage);
      }
    } else {
      if (this.currentImage.parentElement?.tagName === "A") {
        const link = this.currentImage.parentElement;
        link.parentNode?.insertBefore(this.currentImage, link);
        link.remove();
      }
    }
    this.triggerChange();
  }
  openStyleDialog() {
    if (!this.currentImage || !this.editor)
      return;
    this.editor.emit("image:openStyleDialog", {
      image: this.currentImage
    });
    setTimeout(() => {
      if (document.querySelector(".ldesign-image-style-dialog"))
        return;
      const borderRadius = prompt("\u8BBE\u7F6E\u5706\u89D2 (\u5982: 0, 8px, 50%):", this.currentImage?.style.borderRadius || "0");
      if (borderRadius !== null && this.currentImage) {
        this.currentImage.style.borderRadius = borderRadius;
        this.triggerChange();
      }
    }, 100);
  }
  replaceImage() {
    if (!this.currentImage)
      return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file && this.currentImage) {
        const reader = new FileReader();
        reader.onload = (e2) => {
          if (this.currentImage) {
            this.currentImage.src = e2.target?.result;
            this.triggerChange();
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }
  deleteImage() {
    if (!this.currentImage)
      return;
    if (this.currentImage.parentElement?.tagName === "A") {
      this.currentImage.parentElement.remove();
    } else {
      this.currentImage.remove();
    }
    this.hideToolbar();
    this.triggerChange();
  }
  triggerChange() {
    const event = new Event("input", {
      bubbles: true
    });
    this.editor?.contentElement?.dispatchEvent(event);
  }
  destroy() {
    this.hideToolbar();
    const editorElement = this.editor?.contentElement;
    if (editorElement) {
      editorElement.removeEventListener("click", this.handleImageClick.bind(this));
      editorElement.removeEventListener("scroll", this.updateToolbarPosition.bind(this));
    }
    document.removeEventListener("click", this.handleDocumentClick.bind(this));
    window.removeEventListener("scroll", this.updateToolbarPosition.bind(this));
    window.removeEventListener("resize", this.updateToolbarPosition.bind(this));
    console.log("[ImageToolbarPlugin] Destroyed");
  }
}

exports.ImageToolbarPlugin = ImageToolbarPlugin;
exports.default = ImageToolbarPlugin;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=image-toolbar.cjs.map
