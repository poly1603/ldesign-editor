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

var Plugin = require('../../../core/Plugin.cjs');

class ImageResizePlugin extends Plugin.Plugin {
  constructor(options = {}) {
    super();
    this.name = "imageResize";
    this.config = {
      name: "imageResize",
      commands: {},
      keys: {}
    };
    this.currentImage = null;
    this.resizeOverlay = null;
    this.isResizing = false;
    this.startX = 0;
    this.startY = 0;
    this.startWidth = 0;
    this.startHeight = 0;
    this.resizeHandle = "";
    this.aspectRatio = 1;
    this.dimensionsDisplay = null;
    this.options = {
      minWidth: 50,
      minHeight: 50,
      maxWidth: 2e3,
      maxHeight: 2e3,
      preserveAspectRatio: true,
      showDimensions: true,
      ...options
    };
  }
  install(editor) {
    super.install(editor);
    this.editor = editor;
    this.bindEvents();
    console.log("[ImageResizePlugin] Installed with options:", this.options);
  }
  bindEvents() {
    const editorElement = this.editor.contentElement;
    if (!editorElement)
      return;
    editorElement.addEventListener("click", this.handleImageClick.bind(this));
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("mouseup", this.handleMouseUp.bind(this));
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    editorElement.addEventListener("blur", () => {
      setTimeout(() => this.hideResizeOverlay(), 200);
    });
    editorElement.addEventListener("dblclick", (e) => {
      const target = e.target;
      if (target.tagName === "IMG")
        this.hideResizeOverlay();
    });
    console.log("[ImageResizePlugin] Events bound");
  }
  handleImageClick(e) {
    const target = e.target;
    if (target.tagName === "IMG") {
      e.preventDefault();
      e.stopPropagation();
      this.showResizeOverlay(target);
    } else if (!this.isResizing && !this.isResizeHandle(target)) {
      this.hideResizeOverlay();
    }
  }
  isResizeHandle(element) {
    return element.classList.contains("image-resize-handle") || (element.parentElement?.classList.contains("image-resize-overlay") ?? false);
  }
  showResizeOverlay(img) {
    console.log("[ImageResizePlugin] Showing resize overlay for image:", img.src);
    this.hideResizeOverlay();
    this.currentImage = img;
    this.resizeOverlay = document.createElement("div");
    this.resizeOverlay.className = "image-resize-overlay";
    this.updateOverlayPosition();
    const handles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
    handles.forEach((handle) => {
      const handleElement = document.createElement("div");
      handleElement.className = `image-resize-handle handle-${handle}`;
      handleElement.dataset.handle = handle;
      handleElement.addEventListener("mousedown", this.startResize.bind(this));
      this.resizeOverlay.appendChild(handleElement);
    });
    if (this.options.showDimensions) {
      this.dimensionsDisplay = document.createElement("div");
      this.dimensionsDisplay.className = "image-resize-dimensions";
      this.updateDimensionsDisplay();
      this.resizeOverlay.appendChild(this.dimensionsDisplay);
    }
    const editorElement = this.editor.contentElement;
    if (editorElement)
      editorElement.appendChild(this.resizeOverlay);
    this.aspectRatio = img.naturalWidth / img.naturalHeight;
  }
  hideResizeOverlay() {
    if (this.resizeOverlay) {
      console.log("[ImageResizePlugin] Hiding resize overlay");
      this.resizeOverlay.remove();
      this.resizeOverlay = null;
      this.currentImage = null;
      this.dimensionsDisplay = null;
    }
  }
  updateOverlayPosition() {
    if (!this.resizeOverlay || !this.currentImage)
      return;
    const editorElement = this.editor.contentElement;
    if (!editorElement)
      return;
    const editorRect = editorElement.getBoundingClientRect();
    const imgRect = this.currentImage.getBoundingClientRect();
    this.resizeOverlay.style.left = `${imgRect.left - editorRect.left + editorElement.scrollLeft}px`;
    this.resizeOverlay.style.top = `${imgRect.top - editorRect.top + editorElement.scrollTop}px`;
    this.resizeOverlay.style.width = `${imgRect.width}px`;
    this.resizeOverlay.style.height = `${imgRect.height}px`;
  }
  updateDimensionsDisplay() {
    if (!this.dimensionsDisplay || !this.currentImage)
      return;
    const width = Math.round(this.currentImage.width);
    const height = Math.round(this.currentImage.height);
    this.dimensionsDisplay.textContent = `${width} \xD7 ${height}`;
  }
  startResize(e) {
    if (!this.currentImage)
      return;
    e.preventDefault();
    e.stopPropagation();
    const handle = e.target;
    this.resizeHandle = handle.dataset.handle || "";
    console.log("[ImageResizePlugin] Starting resize with handle:", this.resizeHandle);
    this.isResizing = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startWidth = this.currentImage.width;
    this.startHeight = this.currentImage.height;
    document.body.classList.add("image-resizing");
    e.preventDefault();
  }
  handleMouseMove(e) {
    if (!this.isResizing || !this.currentImage || !this.resizeOverlay)
      return;
    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;
    let newWidth = this.startWidth;
    let newHeight = this.startHeight;
    switch (this.resizeHandle) {
      case "e":
        newWidth = this.startWidth + deltaX;
        if (this.options.preserveAspectRatio)
          newHeight = newWidth / this.aspectRatio;
        break;
      case "w":
        newWidth = this.startWidth - deltaX;
        if (this.options.preserveAspectRatio)
          newHeight = newWidth / this.aspectRatio;
        break;
      case "s":
        newHeight = this.startHeight + deltaY;
        if (this.options.preserveAspectRatio)
          newWidth = newHeight * this.aspectRatio;
        break;
      case "n":
        newHeight = this.startHeight - deltaY;
        if (this.options.preserveAspectRatio)
          newWidth = newHeight * this.aspectRatio;
        break;
      case "se":
        if (this.options.preserveAspectRatio) {
          if (Math.abs(deltaX) > Math.abs(deltaY * this.aspectRatio)) {
            newWidth = this.startWidth + deltaX;
            newHeight = newWidth / this.aspectRatio;
          } else {
            newHeight = this.startHeight + deltaY;
            newWidth = newHeight * this.aspectRatio;
          }
        } else {
          newWidth = this.startWidth + deltaX;
          newHeight = this.startHeight + deltaY;
        }
        break;
      case "sw":
        if (this.options.preserveAspectRatio) {
          if (Math.abs(deltaX) > Math.abs(deltaY * this.aspectRatio)) {
            newWidth = this.startWidth - deltaX;
            newHeight = newWidth / this.aspectRatio;
          } else {
            newHeight = this.startHeight + deltaY;
            newWidth = newHeight * this.aspectRatio;
          }
        } else {
          newWidth = this.startWidth - deltaX;
          newHeight = this.startHeight + deltaY;
        }
        break;
      case "ne":
        if (this.options.preserveAspectRatio) {
          if (Math.abs(deltaX) > Math.abs(deltaY * this.aspectRatio)) {
            newWidth = this.startWidth + deltaX;
            newHeight = newWidth / this.aspectRatio;
          } else {
            newHeight = this.startHeight - deltaY;
            newWidth = newHeight * this.aspectRatio;
          }
        } else {
          newWidth = this.startWidth + deltaX;
          newHeight = this.startHeight - deltaY;
        }
        break;
      case "nw":
        if (this.options.preserveAspectRatio) {
          if (Math.abs(deltaX) > Math.abs(deltaY * this.aspectRatio)) {
            newWidth = this.startWidth - deltaX;
            newHeight = newWidth / this.aspectRatio;
          } else {
            newHeight = this.startHeight - deltaY;
            newWidth = newHeight * this.aspectRatio;
          }
        } else {
          newWidth = this.startWidth - deltaX;
          newHeight = this.startHeight - deltaY;
        }
        break;
    }
    newWidth = Math.max(this.options.minWidth, Math.min(newWidth, this.options.maxWidth));
    newHeight = Math.max(this.options.minHeight, Math.min(newHeight, this.options.maxHeight));
    this.currentImage.style.width = `${newWidth}px`;
    this.currentImage.style.height = `${newHeight}px`;
    this.currentImage.width = newWidth;
    this.currentImage.height = newHeight;
    if (!this.currentImage.style.display && !this.currentImage.style.margin) {
      this.currentImage.style.display = "inline-block";
      this.currentImage.style.verticalAlign = "top";
    }
    this.updateOverlayPosition();
    this.updateDimensionsDisplay();
    this.editor.emit("change");
  }
  handleMouseUp(e) {
    if (this.isResizing) {
      console.log("[ImageResizePlugin] Resize completed");
      this.isResizing = false;
      document.body.classList.remove("image-resizing");
      if (this.currentImage) {
        this.currentImage.setAttribute("width", String(this.currentImage.width));
        this.currentImage.setAttribute("height", String(this.currentImage.height));
        this.editor.emit("change");
      }
    }
  }
  handleKeyDown(e) {
    if (e.key === "Escape") {
      if (this.isResizing && this.currentImage) {
        this.currentImage.style.width = `${this.startWidth}px`;
        this.currentImage.style.height = `${this.startHeight}px`;
        this.currentImage.width = this.startWidth;
        this.currentImage.height = this.startHeight;
        this.isResizing = false;
        document.body.classList.remove("image-resizing");
      }
      this.hideResizeOverlay();
    }
  }
  destroy() {
    this.hideResizeOverlay();
    const editorElement = this.editor.contentElement;
    if (editorElement)
      editorElement.removeEventListener("click", this.handleImageClick.bind(this));
    document.removeEventListener("mousemove", this.handleMouseMove.bind(this));
    document.removeEventListener("mouseup", this.handleMouseUp.bind(this));
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
    console.log("[ImageResizePlugin] Destroyed");
  }
}

exports.ImageResizePlugin = ImageResizePlugin;
exports.default = ImageResizePlugin;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
