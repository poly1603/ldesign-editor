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

var BaseComponent = require('./BaseComponent.cjs');

class Modal extends BaseComponent.BaseComponent {
  constructor(options = {}) {
    const defaultOptions = {
      width: 500,
      maxWidth: window.innerWidth * 0.9,
      maxHeight: window.innerHeight * 0.9,
      showOverlay: true,
      closeOnOverlayClick: true,
      closeOnEscape: true,
      showCloseButton: true,
      centered: true,
      animation: true,
      zIndex: 1e4,
      className: "ldesign-modal",
      ...options
    };
    super(defaultOptions);
    this.overlay = null;
    this.header = null;
    this.footer = null;
    this.closeButton = null;
    this.modalOptions = defaultOptions;
    if (this.modalOptions.content)
      this.setContent(this.modalOptions.content);
  }
  createElement() {
    const modal = document.createElement("div");
    modal.className = "ldesign-modal-container";
    modal.style.cssText = `
      position: fixed;
      background: white;
      border-radius: 8px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `;
    if (this.modalOptions.title) {
      this.header = this.createHeader();
      modal.appendChild(this.header);
    }
    this.body = this.createBody();
    modal.appendChild(this.body);
    this.footer = this.createFooter();
    if (this.footer)
      modal.appendChild(this.footer);
    return modal;
  }
  createHeader() {
    const header = document.createElement("div");
    header.className = "ldesign-modal-header";
    header.style.cssText = `
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `;
    const title = document.createElement("h3");
    title.className = "ldesign-modal-title";
    title.style.cssText = `
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    `;
    title.textContent = this.modalOptions.title || "";
    header.appendChild(title);
    if (this.modalOptions.showCloseButton) {
      this.closeButton = this.createCloseButton();
      header.appendChild(this.closeButton);
    }
    return header;
  }
  createBody() {
    const body = document.createElement("div");
    body.className = "ldesign-modal-body";
    body.style.cssText = `
      padding: 20px;
      flex: 1;
      overflow-y: auto;
    `;
    return body;
  }
  createFooter() {
    return null;
  }
  createCloseButton() {
    const button = document.createElement("button");
    button.className = "ldesign-modal-close";
    button.innerHTML = "\xD7";
    button.style.cssText = `
      background: none;
      border: none;
      font-size: 24px;
      color: #6b7280;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s;
    `;
    button.addEventListener("mouseenter", () => {
      button.style.background = "#f3f4f6";
      button.style.color = "#111827";
    });
    button.addEventListener("mouseleave", () => {
      button.style.background = "none";
      button.style.color = "#6b7280";
    });
    button.addEventListener("click", () => this.close());
    return button;
  }
  setupElement() {
    super.setupElement();
    if (this.modalOptions.width)
      this.element.style.width = `${this.modalOptions.width}px`;
    if (this.modalOptions.height)
      this.element.style.height = `${this.modalOptions.height}px`;
    if (this.modalOptions.maxWidth)
      this.element.style.maxWidth = `${this.modalOptions.maxWidth}px`;
    if (this.modalOptions.maxHeight)
      this.element.style.maxHeight = `${this.modalOptions.maxHeight}px`;
    if (this.modalOptions.centered)
      this.center();
    if (this.modalOptions.showOverlay)
      this.createOverlay();
    if (this.modalOptions.closeOnEscape) {
      this.bindEvent(document, "keydown", (e) => {
        const event = e;
        if (event.key === "Escape" && this.isVisible())
          this.close();
      });
    }
  }
  createOverlay() {
    this.overlay = document.createElement("div");
    this.overlay.className = "ldesign-modal-overlay";
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: ${(this.modalOptions.zIndex || 1e4) - 1};
      display: none;
    `;
    if (this.modalOptions.closeOnOverlayClick)
      this.overlay.addEventListener("click", () => this.close());
    document.body.appendChild(this.overlay);
  }
  center() {
    this.element.style.position = "fixed";
    this.element.style.left = "50%";
    this.element.style.top = "50%";
    this.element.style.transform = "translate(-50%, -50%)";
  }
  setContent(content) {
    if (this.body) {
      if (typeof content === "string") {
        this.body.innerHTML = content;
      } else {
        this.body.innerHTML = "";
        this.body.appendChild(content);
      }
    }
  }
  setTitle(title) {
    if (this.header) {
      const titleElement = this.header.querySelector(".ldesign-modal-title");
      if (titleElement)
        titleElement.textContent = title;
    }
  }
  setFooter(content) {
    if (!this.footer) {
      this.footer = document.createElement("div");
      this.footer.className = "ldesign-modal-footer";
      this.footer.style.cssText = `
        padding: 16px 20px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
      `;
      this.element.appendChild(this.footer);
    }
    if (typeof content === "string") {
      this.footer.innerHTML = content;
    } else {
      this.footer.innerHTML = "";
      this.footer.appendChild(content);
    }
  }
  beforeShow() {
    if (this.overlay) {
      this.overlay.style.display = "block";
      if (this.modalOptions.animation) {
        this.overlay.style.opacity = "0";
        requestAnimationFrame(() => {
          if (this.overlay) {
            this.overlay.style.transition = "opacity 0.3s";
            this.overlay.style.opacity = "1";
          }
        });
      }
    }
    if (this.modalOptions.animation) {
      this.element.style.opacity = "0";
      this.element.style.transform = "translate(-50%, -50%) scale(0.9)";
      requestAnimationFrame(() => {
        this.element.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
        this.element.style.opacity = "1";
        this.element.style.transform = "translate(-50%, -50%) scale(1)";
      });
    }
  }
  beforeHide() {
    if (this.modalOptions.animation) {
      this.element.style.opacity = "0";
      this.element.style.transform = "translate(-50%, -50%) scale(0.9)";
      if (this.overlay)
        this.overlay.style.opacity = "0";
      setTimeout(() => {
        if (this.overlay)
          this.overlay.style.display = "none";
      }, 300);
    } else {
      if (this.overlay)
        this.overlay.style.display = "none";
    }
  }
  beforeDestroy() {
    if (this.overlay && this.overlay.parentNode)
      this.overlay.parentNode.removeChild(this.overlay);
  }
  close() {
    this.hide();
  }
  open() {
    this.show();
  }
}

exports.Modal = Modal;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=Modal.cjs.map
