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

var BaseComponent = require('../../../ui/base/BaseComponent.cjs');
var dom = require('../../../utils/dom.cjs');

class MediaPropertiesDialog extends BaseComponent.BaseComponent {
  constructor(container) {
    super({
      container,
      visible: false
    });
    this.properties = {};
  }
  createElement() {
    const el = document.createElement("div");
    el.className = "media-properties-container";
    el.style.display = "none";
    return el;
  }
  show(properties, onSave, onCancel) {
    this.properties = {
      ...properties
    };
    this.onSave = onSave;
    this.onCancel = onCancel;
    this.render();
  }
  render() {
    this.overlayElement = document.createElement("div");
    this.overlayElement.className = "media-properties-overlay";
    this.overlayElement.onclick = () => this.cancel();
    this.dialogElement = document.createElement("div");
    this.dialogElement.className = "media-properties-dialog";
    this.dialogElement.onclick = (e) => e.stopPropagation();
    const header = document.createElement("div");
    header.className = "dialog-header";
    header.innerHTML = `
      <h3>Media Properties</h3>
      <button class="close-btn" title="Close">&times;</button>
    `;
    header.querySelector(".close-btn")?.addEventListener("click", () => this.cancel());
    const content = document.createElement("div");
    content.className = "dialog-content";
    content.innerHTML = `
      <div class="form-group">
        <label for="media-src">Source URL</label>
        <input type="text" id="media-src" value="${this.properties.src || ""}" />
      </div>
      <div class="form-group">
        <label for="media-alt">Alt Text</label>
        <input type="text" id="media-alt" value="${this.properties.alt || ""}" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="media-width">Width</label>
          <input type="text" id="media-width" value="${this.properties.width || ""}" placeholder="auto" />
        </div>
        <div class="form-group">
          <label for="media-height">Height</label>
          <input type="text" id="media-height" value="${this.properties.height || ""}" placeholder="auto" />
        </div>
      </div>
      <div class="form-group">
        <label for="media-title">Title</label>
        <input type="text" id="media-title" value="${this.properties.title || ""}" />
      </div>
      <div class="form-group">
        <label for="media-caption">Caption</label>
        <textarea id="media-caption" rows="3">${this.properties.caption || ""}</textarea>
      </div>
    `;
    const footer = document.createElement("div");
    footer.className = "dialog-footer";
    const cancelBtn = dom.createButton("Cancel", () => this.cancel());
    cancelBtn.className = "btn btn-secondary";
    const saveBtn = dom.createButton("Save", () => this.save());
    saveBtn.className = "btn btn-primary";
    footer.appendChild(cancelBtn);
    footer.appendChild(saveBtn);
    this.dialogElement.appendChild(header);
    this.dialogElement.appendChild(content);
    this.dialogElement.appendChild(footer);
    this.overlayElement.appendChild(this.dialogElement);
    document.body.appendChild(this.overlayElement);
    const firstInput = this.dialogElement.querySelector("input");
    if (firstInput instanceof HTMLInputElement)
      firstInput.focus();
  }
  save() {
    if (!this.dialogElement)
      return;
    const getInputValue = (id) => {
      const input = this.dialogElement?.querySelector(`#${id}`);
      return input?.value || "";
    };
    const updatedProperties = {
      src: getInputValue("media-src"),
      alt: getInputValue("media-alt"),
      width: getInputValue("media-width"),
      height: getInputValue("media-height"),
      title: getInputValue("media-title"),
      caption: getInputValue("media-caption")
    };
    this.close();
    this.onSave?.(updatedProperties);
  }
  cancel() {
    this.close();
    this.onCancel?.();
  }
  close() {
    this.overlayElement?.remove();
    this.overlayElement = void 0;
    this.dialogElement = void 0;
  }
  destroy() {
    this.close();
    super.destroy();
  }
}

exports.MediaPropertiesDialog = MediaPropertiesDialog;
exports.default = MediaPropertiesDialog;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=MediaPropertiesDialog.cjs.map
