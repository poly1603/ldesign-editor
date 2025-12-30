/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { Plugin } from '../../core/Plugin.js';
import { getLucideIcon } from '../../ui/icons/lucide.js';

class ImageStyleDialogPlugin extends Plugin {
  constructor(options = {}) {
    super();
    this.name = "imageStyleDialog";
    this.config = {
      name: "imageStyleDialog",
      commands: {},
      keys: {}
    };
    this.dialog = null;
    this.currentImage = null;
    this.originalStyles = {};
    this.options = {
      defaultWidthUnit: "px",
      showAdvanced: true,
      ...options
    };
  }
  install(editor) {
    super.install(editor);
    editor.on("image:openStyleDialog", this.handleOpenDialog.bind(this));
    editor.contentElement?.addEventListener("dblclick", this.handleDoubleClick.bind(this));
    console.log("[ImageStyleDialogPlugin] Installed");
  }
  handleDoubleClick(e) {
    const target = e.target;
    if (target.tagName === "IMG") {
      e.preventDefault();
      this.openDialog(target);
    }
  }
  handleOpenDialog(data) {
    this.openDialog(data.image);
  }
  openDialog(image) {
    this.currentImage = image;
    this.saveOriginalStyles();
    this.dialog = this.createDialog();
    document.body.appendChild(this.dialog);
  }
  saveOriginalStyles() {
    if (!this.currentImage)
      return;
    this.originalStyles = {
      width: this.currentImage.style.width,
      height: this.currentImage.style.height,
      borderRadius: this.currentImage.style.borderRadius,
      border: this.currentImage.style.border,
      boxShadow: this.currentImage.style.boxShadow,
      opacity: this.currentImage.style.opacity,
      filter: this.currentImage.style.filter,
      marginLeft: this.currentImage.style.marginLeft,
      marginRight: this.currentImage.style.marginRight,
      display: this.currentImage.style.display
    };
  }
  restoreOriginalStyles() {
    if (!this.currentImage)
      return;
    Object.entries(this.originalStyles).forEach(([key, value]) => {
      this.currentImage.style[key] = value;
    });
  }
  createDialog() {
    const overlay = document.createElement("div");
    overlay.className = "ldesign-image-style-dialog-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10002;
    `;
    const dialog = document.createElement("div");
    dialog.className = "ldesign-image-style-dialog";
    dialog.style.cssText = `
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
      width: 480px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    `;
    const header = this.createHeader();
    dialog.appendChild(header);
    const content = this.createContent();
    dialog.appendChild(content);
    const footer = this.createFooter();
    dialog.appendChild(footer);
    overlay.appendChild(dialog);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.closeDialog(false);
      }
    });
    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        this.closeDialog(false);
        document.removeEventListener("keydown", handleKeydown);
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return overlay;
  }
  createHeader() {
    const header = document.createElement("div");
    header.style.cssText = `
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `;
    const title = document.createElement("h3");
    title.textContent = "\u56FE\u7247\u8BBE\u7F6E";
    title.style.cssText = "margin: 0; font-size: 18px; font-weight: 600; color: #111827;";
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = getLucideIcon("x");
    closeBtn.style.cssText = `
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: #6b7280;
      border-radius: 4px;
    `;
    closeBtn.onclick = () => this.closeDialog(false);
    header.appendChild(title);
    header.appendChild(closeBtn);
    return header;
  }
  createContent() {
    const content = document.createElement("div");
    content.style.cssText = `
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    `;
    content.appendChild(this.createSection("\u5C3A\u5BF8", [this.createSizeInput()]));
    content.appendChild(this.createSection("\u5BF9\u9F50", [this.createAlignButtons()]));
    content.appendChild(this.createSection("\u6837\u5F0F", [this.createRangeInput("\u5706\u89D2", "borderRadius", 0, 100, "px", parseInt(this.currentImage?.style.borderRadius || "0")), this.createRangeInput("\u900F\u660E\u5EA6", "opacity", 0, 100, "%", Math.round(parseFloat(this.currentImage?.style.opacity || "1") * 100))]));
    content.appendChild(this.createSection("\u8FB9\u6846", [this.createBorderInput()]));
    content.appendChild(this.createSection("\u9634\u5F71", [this.createShadowButtons()]));
    content.appendChild(this.createSection("\u66FF\u4EE3\u6587\u672C (Alt)", [this.createTextInput("alt", this.currentImage?.alt || "", "\u4E3A\u56FE\u7247\u6DFB\u52A0\u63CF\u8FF0\u6587\u5B57")]));
    content.appendChild(this.createSection("\u6807\u9898 (Title)", [this.createTextInput("title", this.currentImage?.title || "", "\u9F20\u6807\u60AC\u505C\u65F6\u663E\u793A\u7684\u6587\u5B57")]));
    return content;
  }
  createSection(title, items) {
    const section = document.createElement("div");
    section.style.cssText = "margin-bottom: 20px;";
    const label = document.createElement("label");
    label.textContent = title;
    label.style.cssText = `
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;
    `;
    section.appendChild(label);
    items.forEach((item) => section.appendChild(item));
    return section;
  }
  createSizeInput() {
    const container = document.createElement("div");
    container.style.cssText = "display: flex; gap: 12px; align-items: center;";
    const widthGroup = document.createElement("div");
    widthGroup.style.cssText = "flex: 1;";
    const widthLabel = document.createElement("span");
    widthLabel.textContent = "\u5BBD\u5EA6";
    widthLabel.style.cssText = "font-size: 12px; color: #6b7280; display: block; margin-bottom: 4px;";
    const widthInput = document.createElement("input");
    widthInput.type = "text";
    widthInput.value = this.currentImage?.style.width || "auto";
    widthInput.style.cssText = this.getInputStyle();
    widthInput.onchange = () => {
      if (this.currentImage) {
        this.currentImage.style.width = widthInput.value || "auto";
        this.triggerChange();
      }
    };
    widthGroup.appendChild(widthLabel);
    widthGroup.appendChild(widthInput);
    const heightGroup = document.createElement("div");
    heightGroup.style.cssText = "flex: 1;";
    const heightLabel = document.createElement("span");
    heightLabel.textContent = "\u9AD8\u5EA6";
    heightLabel.style.cssText = "font-size: 12px; color: #6b7280; display: block; margin-bottom: 4px;";
    const heightInput = document.createElement("input");
    heightInput.type = "text";
    heightInput.value = this.currentImage?.style.height || "auto";
    heightInput.style.cssText = this.getInputStyle();
    heightInput.onchange = () => {
      if (this.currentImage) {
        this.currentImage.style.height = heightInput.value || "auto";
        this.triggerChange();
      }
    };
    heightGroup.appendChild(heightLabel);
    heightGroup.appendChild(heightInput);
    const lockBtn = document.createElement("button");
    lockBtn.innerHTML = getLucideIcon("lock");
    lockBtn.title = "\u9501\u5B9A\u6BD4\u4F8B";
    lockBtn.style.cssText = `
      background: #f3f4f6;
      border: none;
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 18px;
    `;
    container.appendChild(widthGroup);
    container.appendChild(lockBtn);
    container.appendChild(heightGroup);
    return container;
  }
  createAlignButtons() {
    const container = document.createElement("div");
    container.style.cssText = "display: flex; gap: 8px;";
    const alignOptions = [{
      value: "left",
      icon: "alignLeft",
      title: "\u5DE6\u5BF9\u9F50"
    }, {
      value: "center",
      icon: "alignCenter",
      title: "\u5C45\u4E2D"
    }, {
      value: "right",
      icon: "alignRight",
      title: "\u53F3\u5BF9\u9F50"
    }];
    alignOptions.forEach((option) => {
      const btn = document.createElement("button");
      btn.innerHTML = getLucideIcon(option.icon);
      btn.title = option.title;
      btn.style.cssText = `
        flex: 1;
        padding: 10px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        transition: all 0.2s;
      `;
      btn.onclick = () => {
        if (!this.currentImage)
          return;
        this.currentImage.style.float = "";
        this.currentImage.style.marginLeft = "";
        this.currentImage.style.marginRight = "";
        this.currentImage.style.display = "block";
        switch (option.value) {
          case "left":
            this.currentImage.style.marginRight = "auto";
            break;
          case "center":
            this.currentImage.style.marginLeft = "auto";
            this.currentImage.style.marginRight = "auto";
            break;
          case "right":
            this.currentImage.style.marginLeft = "auto";
            break;
        }
        this.triggerChange();
      };
      container.appendChild(btn);
    });
    return container;
  }
  createRangeInput(label, property, min, max, unit, value) {
    const container = document.createElement("div");
    container.style.cssText = "margin-bottom: 12px;";
    const labelRow = document.createElement("div");
    labelRow.style.cssText = "display: flex; justify-content: space-between; margin-bottom: 4px;";
    const labelText = document.createElement("span");
    labelText.textContent = label;
    labelText.style.cssText = "font-size: 12px; color: #6b7280;";
    const valueText = document.createElement("span");
    valueText.textContent = `${value}${unit}`;
    valueText.style.cssText = "font-size: 12px; color: #111827; font-weight: 500;";
    labelRow.appendChild(labelText);
    labelRow.appendChild(valueText);
    const range = document.createElement("input");
    range.type = "range";
    range.min = String(min);
    range.max = String(max);
    range.value = String(value);
    range.style.cssText = "width: 100%; cursor: pointer;";
    range.oninput = () => {
      const val = range.value;
      valueText.textContent = `${val}${unit}`;
      if (this.currentImage) {
        if (property === "opacity") {
          this.currentImage.style.opacity = String(parseInt(val) / 100);
        } else if (property === "borderRadius") {
          this.currentImage.style.borderRadius = `${val}px`;
        }
        this.triggerChange();
      }
    };
    container.appendChild(labelRow);
    container.appendChild(range);
    return container;
  }
  createBorderInput() {
    const container = document.createElement("div");
    container.style.cssText = "display: flex; gap: 8px; align-items: center;";
    const widthInput = document.createElement("input");
    widthInput.type = "number";
    widthInput.min = "0";
    widthInput.max = "20";
    widthInput.value = "0";
    widthInput.placeholder = "\u5BBD\u5EA6";
    widthInput.style.cssText = this.getInputStyle() + "width: 80px;";
    const styleSelect = document.createElement("select");
    styleSelect.style.cssText = this.getInputStyle() + "width: 100px;";
    const styles = ["solid", "dashed", "dotted", "double"];
    styles.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      styleSelect.appendChild(opt);
    });
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = "#000000";
    colorInput.style.cssText = "width: 40px; height: 36px; padding: 2px; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer;";
    const updateBorder = () => {
      if (this.currentImage) {
        const width = widthInput.value;
        if (parseInt(width) > 0) {
          this.currentImage.style.border = `${width}px ${styleSelect.value} ${colorInput.value}`;
        } else {
          this.currentImage.style.border = "";
        }
        this.triggerChange();
      }
    };
    widthInput.onchange = updateBorder;
    styleSelect.onchange = updateBorder;
    colorInput.onchange = updateBorder;
    container.appendChild(widthInput);
    container.appendChild(styleSelect);
    container.appendChild(colorInput);
    return container;
  }
  createShadowButtons() {
    const container = document.createElement("div");
    container.style.cssText = "display: flex; gap: 8px; flex-wrap: wrap;";
    const shadows = [{
      label: "\u65E0",
      value: "none"
    }, {
      label: "\u5C0F",
      value: "0 2px 4px rgba(0,0,0,0.1)"
    }, {
      label: "\u4E2D",
      value: "0 4px 12px rgba(0,0,0,0.15)"
    }, {
      label: "\u5927",
      value: "0 10px 30px rgba(0,0,0,0.2)"
    }];
    shadows.forEach((shadow) => {
      const btn = document.createElement("button");
      btn.textContent = shadow.label;
      btn.style.cssText = `
        padding: 8px 16px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
      `;
      btn.onclick = () => {
        if (this.currentImage) {
          this.currentImage.style.boxShadow = shadow.value === "none" ? "" : shadow.value;
          this.triggerChange();
        }
      };
      container.appendChild(btn);
    });
    return container;
  }
  createTextInput(property, value, placeholder) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = value;
    input.placeholder = placeholder;
    input.style.cssText = this.getInputStyle() + "width: 100%;";
    input.onchange = () => {
      if (this.currentImage) {
        this.currentImage[property] = input.value;
        this.triggerChange();
      }
    };
    return input;
  }
  createFooter() {
    const footer = document.createElement("div");
    footer.style.cssText = `
      padding: 16px 20px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    `;
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "\u53D6\u6D88";
    cancelBtn.style.cssText = `
      padding: 10px 20px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-size: 14px;
    `;
    cancelBtn.onclick = () => this.closeDialog(false);
    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "\u786E\u5B9A";
    confirmBtn.style.cssText = `
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      background: #3b82f6;
      color: white;
      cursor: pointer;
      font-size: 14px;
    `;
    confirmBtn.onclick = () => this.closeDialog(true);
    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);
    return footer;
  }
  getInputStyle() {
    return `
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    `;
  }
  closeDialog(save) {
    if (!save) {
      this.restoreOriginalStyles();
    }
    if (this.dialog) {
      this.dialog.remove();
      this.dialog = null;
    }
    this.currentImage = null;
    this.originalStyles = {};
  }
  triggerChange() {
    const event = new Event("input", {
      bubbles: true
    });
    this.editor?.contentElement?.dispatchEvent(event);
  }
  destroy() {
    if (this.dialog) {
      this.dialog.remove();
    }
    this.editor?.contentElement?.removeEventListener("dblclick", this.handleDoubleClick.bind(this));
    console.log("[ImageStyleDialogPlugin] Destroyed");
  }
}

export { ImageStyleDialogPlugin, ImageStyleDialogPlugin as default };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=image-style-dialog.js.map
