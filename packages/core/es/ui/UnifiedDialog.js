/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class UnifiedDialog {
  constructor(config) {
    this.fieldValues = /* @__PURE__ */ new Map();
    this.fieldElements = /* @__PURE__ */ new Map();
    this.buttonElements = /* @__PURE__ */ new Map();
    this.isOpen = false;
    this.isClosing = false;
    this.toastQueue = [];
    this.activeToasts = /* @__PURE__ */ new Map();
    this.config = this.mergeConfig(config);
    this.init();
  }
  mergeConfig(config) {
    return {
      showCloseButton: true,
      closeOnOverlayClick: true,
      closeOnEscape: true,
      preventScroll: true,
      centered: true,
      animation: true,
      width: config.width || 520,
      // 默认宽度520px
      maxWidth: config.maxWidth || "90%",
      maxHeight: config.maxHeight || "90vh",
      buttons: config.buttons || [{
        id: "cancel",
        label: "\u53D6\u6D88",
        type: "secondary",
        closeOnClick: true
      }, {
        id: "confirm",
        label: "\u786E\u5B9A",
        type: "primary",
        closeOnClick: false
      }],
      ...config
    };
  }
  init() {
    this.createElements();
    this.bindEvents();
    this.initFieldValues();
  }
  createElements() {
    this.overlay = document.createElement("div");
    this.overlay.className = "unified-dialog-overlay";
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
    `;
    this.dialog = document.createElement("div");
    this.dialog.className = `unified-dialog ${this.config.className || ""}`;
    this.dialog.setAttribute("role", "dialog");
    this.dialog.setAttribute("aria-modal", "true");
    this.dialog.setAttribute("aria-labelledby", "dialog-title");
    this.dialog.style.cssText = `
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      width: ${typeof this.config.width === "number" ? `${this.config.width}px` : this.config.width};
      min-width: 480px;
      max-width: ${typeof this.config.maxWidth === "number" ? `${this.config.maxWidth}px` : this.config.maxWidth};
      max-height: ${typeof this.config.maxHeight === "number" ? `${this.config.maxHeight}px` : this.config.maxHeight};
    `;
    if (this.config.height) {
      this.dialog.style.height = typeof this.config.height === "number" ? `${this.config.height}px` : this.config.height;
    }
    this.createHeader();
    this.createBody();
    this.createFooter();
    this.createToastContainer();
    this.overlay.appendChild(this.dialog);
    document.body.appendChild(this.overlay);
  }
  createToastContainer() {
    this.toastContainer = document.createElement("div");
    this.toastContainer.className = "unified-dialog-toast-container";
    this.toastContainer.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      left: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
      z-index: 100;
    `;
    this.dialog.appendChild(this.toastContainer);
  }
  createHeader() {
    this.header = document.createElement("div");
    this.header.className = "unified-dialog-header";
    this.header.style.cssText = `
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      gap: 12px;
    `;
    if (this.config.icon) {
      const iconWrapper = document.createElement("div");
      iconWrapper.className = "unified-dialog-icon";
      iconWrapper.style.cssText = `
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #3b82f6;
      `;
      if (typeof this.config.icon === "string")
        iconWrapper.innerHTML = this.config.icon;
      else
        iconWrapper.appendChild(this.config.icon);
      this.header.appendChild(iconWrapper);
    }
    const titleContainer = document.createElement("div");
    titleContainer.style.cssText = "flex: 1;";
    const title = document.createElement("h2");
    title.id = "dialog-title";
    title.className = "unified-dialog-title";
    title.style.cssText = `
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    `;
    title.textContent = this.config.title;
    titleContainer.appendChild(title);
    if (this.config.subtitle) {
      const subtitle = document.createElement("p");
      subtitle.className = "unified-dialog-subtitle";
      subtitle.style.cssText = `
        margin: 4px 0 0 0;
        font-size: 14px;
        color: #6b7280;
      `;
      subtitle.textContent = this.config.subtitle;
      titleContainer.appendChild(subtitle);
    }
    this.header.appendChild(titleContainer);
    if (this.config.showCloseButton) {
      const closeBtn = document.createElement("button");
      closeBtn.className = "unified-dialog-close";
      closeBtn.innerHTML = "\xD7";
      closeBtn.setAttribute("aria-label", "\u5173\u95ED\u5BF9\u8BDD\u6846");
      closeBtn.style.cssText = `
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
        border-radius: 6px;
        transition: all 0.2s;
      `;
      closeBtn.addEventListener("mouseenter", () => {
        closeBtn.style.background = "#f3f4f6";
        closeBtn.style.color = "#111827";
      });
      closeBtn.addEventListener("mouseleave", () => {
        closeBtn.style.background = "none";
        closeBtn.style.color = "#6b7280";
      });
      closeBtn.addEventListener("click", () => this.close());
      this.header.appendChild(closeBtn);
    }
    this.dialog.appendChild(this.header);
  }
  createBody() {
    this.body = document.createElement("div");
    this.body.className = "unified-dialog-body";
    this.body.style.cssText = `
      padding: 24px;
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    `;
    if (this.config.content) {
      if (typeof this.config.content === "string") {
        const contentDiv = document.createElement("div");
        contentDiv.className = "unified-dialog-content";
        contentDiv.style.cssText = `
          width: 100%;
          box-sizing: border-box;
        `;
        contentDiv.innerHTML = this.config.content;
        this.body.appendChild(contentDiv);
      } else {
        this.config.content.style.width = "100%";
        this.config.content.style.boxSizing = "border-box";
        this.body.appendChild(this.config.content);
      }
    }
    if (this.config.fields && this.config.fields.length > 0) {
      const form = document.createElement("form");
      form.className = "unified-dialog-form";
      form.style.cssText = `
        width: 100%;
        box-sizing: border-box;
      `;
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
      this.config.fields.forEach((field, index) => {
        const fieldGroup = this.createFieldElement(field);
        if (index > 0 && this.config.content)
          fieldGroup.style.marginTop = "16px";
        form.appendChild(fieldGroup);
      });
      this.body.appendChild(form);
    }
    this.dialog.appendChild(this.body);
  }
  createFieldElement(field) {
    const fieldGroup = document.createElement("div");
    fieldGroup.className = "unified-dialog-field-group";
    fieldGroup.dataset.fieldId = field.id;
    fieldGroup.style.cssText = `
      margin-bottom: 16px;
      width: 100%;
      box-sizing: border-box;
    `;
    if (field.type !== "checkbox" || !field.label) {
      const label = document.createElement("label");
      label.className = "unified-dialog-field-label";
      label.htmlFor = `field-${field.id}`;
      label.style.cssText = `
        display: block;
        margin-bottom: 6px;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
      `;
      label.textContent = field.label;
      if (field.required) {
        const required = document.createElement("span");
        required.style.cssText = "color: #ef4444; margin-left: 4px;";
        required.textContent = "*";
        label.appendChild(required);
      }
      fieldGroup.appendChild(label);
    }
    let inputElement;
    switch (field.type) {
      case "textarea":
        inputElement = document.createElement("textarea");
        inputElement.rows = field.rows || 4;
        inputElement.style.cssText = `
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        `;
        break;
      case "select":
        inputElement = document.createElement("select");
        inputElement.style.cssText = `
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
          background: white;
          cursor: pointer;
          box-sizing: border-box;
        `;
        if (field.placeholder) {
          const placeholder = document.createElement("option");
          placeholder.value = "";
          placeholder.textContent = field.placeholder;
          placeholder.disabled = true;
          placeholder.selected = !field.value && !field.defaultValue;
          inputElement.appendChild(placeholder);
        }
        if (field.options) {
          field.options.forEach((option) => {
            const optionEl = document.createElement("option");
            optionEl.value = String(option.value);
            optionEl.textContent = option.label;
            if (option.value === (field.value || field.defaultValue))
              optionEl.selected = true;
            inputElement.appendChild(optionEl);
          });
        }
        break;
      case "checkbox":
        const checkboxWrapper = document.createElement("div");
        checkboxWrapper.style.cssText = "display: flex; align-items: center; gap: 8px;";
        inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        inputElement.style.cssText = `
          width: 18px;
          height: 18px;
          cursor: pointer;
        `;
        if (field.value !== void 0 || field.defaultValue !== void 0) {
          inputElement.checked = !!(field.value || field.defaultValue);
        }
        const checkboxLabel = document.createElement("label");
        checkboxLabel.htmlFor = `field-${field.id}`;
        checkboxLabel.style.cssText = `
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          user-select: none;
        `;
        checkboxLabel.textContent = field.label;
        if (field.required) {
          const required = document.createElement("span");
          required.style.cssText = "color: #ef4444; margin-left: 4px;";
          required.textContent = "*";
          checkboxLabel.appendChild(required);
        }
        checkboxWrapper.appendChild(inputElement);
        checkboxWrapper.appendChild(checkboxLabel);
        fieldGroup.appendChild(checkboxWrapper);
        break;
      default:
        inputElement = document.createElement("input");
        inputElement.type = field.type;
        inputElement.style.cssText = `
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        `;
        if (field.type === "number") {
          if (field.min !== void 0)
            inputElement.min = String(field.min);
          if (field.max !== void 0)
            inputElement.max = String(field.max);
          if (field.step !== void 0)
            inputElement.step = String(field.step);
        }
    }
    inputElement.id = `field-${field.id}`;
    inputElement.name = field.id;
    if (field.placeholder && field.type !== "select" && "placeholder" in inputElement) {
      inputElement.placeholder = field.placeholder;
    }
    if (field.value !== void 0 && field.type !== "checkbox")
      inputElement.value = String(field.value);
    else if (field.defaultValue !== void 0 && field.type !== "checkbox")
      inputElement.value = String(field.defaultValue);
    if (field.disabled)
      inputElement.disabled = true;
    if (field.readonly && "readOnly" in inputElement)
      inputElement.readOnly = true;
    if (field.required)
      inputElement.required = true;
    if (field.pattern && "pattern" in inputElement)
      inputElement.pattern = field.pattern;
    inputElement.addEventListener("focus", () => {
      if (!field.disabled && !field.readonly) {
        inputElement.style.borderColor = "#3b82f6";
        inputElement.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
      }
    });
    inputElement.addEventListener("blur", () => {
      inputElement.style.boxShadow = "none";
      inputElement.style.borderColor = "#d1d5db";
      this.validateField(field);
    });
    inputElement.addEventListener("input", () => {
      const value = field.type === "checkbox" ? inputElement.checked : inputElement.value;
      this.setFieldValue(field.id, value);
      this.clearFieldError(field.id);
      if (field.onChange)
        field.onChange(value);
    });
    this.fieldElements.set(field.id, inputElement);
    if (field.type !== "checkbox")
      fieldGroup.appendChild(inputElement);
    if (field.helpText) {
      const helpText = document.createElement("div");
      helpText.className = "unified-dialog-help-text";
      helpText.style.cssText = `
        margin-top: 6px;
        font-size: 12px;
        color: #6b7280;
      `;
      helpText.textContent = field.helpText;
      fieldGroup.appendChild(helpText);
    }
    return fieldGroup;
  }
  createFooter() {
    if (!this.config.buttons || this.config.buttons.length === 0)
      return;
    this.footer = document.createElement("div");
    this.footer.className = "unified-dialog-footer";
    this.footer.style.cssText = `
      padding: 16px 24px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    `;
    this.config.buttons.forEach((buttonConfig) => {
      const button = this.createButtonElement(buttonConfig);
      this.buttonElements.set(buttonConfig.id, button);
      this.footer.appendChild(button);
    });
    this.dialog.appendChild(this.footer);
  }
  createButtonElement(config) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `unified-dialog-btn unified-dialog-btn-${config.type || "secondary"}`;
    button.dataset.buttonId = config.id;
    const styles = {
      primary: `
        background: #3b82f6;
        color: white;
        border: none;
      `,
      secondary: `
        background: white;
        color: #374151;
        border: 1px solid #d1d5db;
      `,
      danger: `
        background: #ef4444;
        color: white;
        border: none;
      `,
      success: `
        background: #10b981;
        color: white;
        border: none;
      `,
      link: `
        background: none;
        color: #3b82f6;
        border: none;
        padding: 10px 16px;
      `
    };
    button.style.cssText = `
      ${styles[config.type || "secondary"]}
      padding: 10px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    `;
    const content = document.createElement("span");
    content.textContent = config.label;
    button.appendChild(content);
    const spinner = document.createElement("span");
    spinner.className = "unified-dialog-btn-spinner";
    spinner.style.cssText = `
      display: none;
      width: 14px;
      height: 14px;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    `;
    button.appendChild(spinner);
    button.addEventListener("mouseenter", () => {
      if (!button.disabled) {
        button.style.opacity = "0.9";
        button.style.transform = "translateY(-1px)";
      }
    });
    button.addEventListener("mouseleave", () => {
      button.style.opacity = "1";
      button.style.transform = "translateY(0)";
    });
    if (config.disabled) {
      button.disabled = true;
      button.style.opacity = "0.5";
      button.style.cursor = "not-allowed";
    }
    button.addEventListener("click", async () => {
      if (config.onClick) {
        await this.handleButtonClick(config, button);
      } else {
        if (config.id === "cancel")
          this.close();
        else if (config.id === "confirm")
          await this.handleSubmit();
      }
      if (config.closeOnClick && !this.isClosing)
        this.close();
    });
    return button;
  }
  async handleButtonClick(config, button) {
    if (!config.onClick)
      return;
    try {
      this.setButtonLoading(config.id, true);
      await config.onClick(this);
    } catch (error) {
      console.error("Button click error:", error);
      this.showError(error instanceof Error ? error.message : "\u64CD\u4F5C\u5931\u8D25");
    } finally {
      this.setButtonLoading(config.id, false);
    }
  }
  async handleSubmit() {
    const errors = [];
    if (this.config.fields) {
      for (const field of this.config.fields) {
        const error = this.validateFieldWithoutToast(field);
        if (error) {
          errors.push({
            field: field.label,
            message: error
          });
          const inputElement = this.fieldElements.get(field.id);
          if (inputElement)
            inputElement.style.borderColor = "#ef4444";
        }
      }
    }
    if (errors.length > 0) {
      if (errors.length === 1) {
        this.showError(errors[0].message);
      } else {
        const errorMessage = errors.map((e) => `\u2022 ${e.message}`).join("\n");
        this.showError(`\u8BF7\u4FEE\u6B63\u4EE5\u4E0B\u9519\u8BEF\uFF1A
${errorMessage}`);
      }
      return;
    }
    if (this.config.onSubmit) {
      try {
        const data = this.getFormData();
        await this.config.onSubmit(data);
        this.close();
      } catch (error) {
        console.error("Submit error:", error);
        this.showError(error instanceof Error ? error.message : "\u63D0\u4EA4\u5931\u8D25");
      }
    } else {
      this.close();
    }
  }
  validateFieldWithoutToast(field) {
    const value = this.fieldValues.get(field.id);
    let error = null;
    if (field.required) {
      if (field.type === "checkbox") {
        if (!value)
          error = `\u8BF7\u52FE\u9009${field.label}`;
      } else if (!value || typeof value === "string" && !value.trim()) {
        error = `${field.label}\u4E0D\u80FD\u4E3A\u7A7A`;
      }
    }
    if (!error && field.validator)
      error = field.validator(value);
    if (!error && field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
      if (!emailRegex.test(value))
        error = "\u8BF7\u8F93\u5165\u6709\u6548\u7684\u90AE\u7BB1\u5730\u5740";
    }
    if (!error && field.type === "url" && value) {
      try {
        new URL(value);
      } catch {
        error = "\u8BF7\u8F93\u5165\u6709\u6548\u7684URL\u5730\u5740";
      }
    }
    if (!error && field.type === "number" && value) {
      const num = Number(value);
      if (field.min !== void 0 && num < field.min)
        error = `\u6700\u5C0F\u503C\u4E3A ${field.min}`;
      if (field.max !== void 0 && num > field.max)
        error = `\u6700\u5927\u503C\u4E3A ${field.max}`;
    }
    return error;
  }
  validateField(field) {
    const error = this.validateFieldWithoutToast(field);
    this.updateFieldError(field.id, error);
    return error;
  }
  updateFieldError(fieldId, error) {
    const inputElement = this.fieldElements.get(fieldId);
    if (error) {
      this.showError(error);
      if (inputElement) {
        inputElement.style.borderColor = "#ef4444";
      }
    } else {
      if (inputElement) {
        inputElement.style.borderColor = "#d1d5db";
      }
    }
  }
  clearFieldError(fieldId) {
    this.updateFieldError(fieldId, null);
  }
  initFieldValues() {
    if (this.config.fields) {
      this.config.fields.forEach((field) => {
        const value = field.value !== void 0 ? field.value : field.defaultValue;
        if (value !== void 0)
          this.fieldValues.set(field.id, value);
      });
    }
  }
  setFieldValue(fieldId, value) {
    this.fieldValues.set(fieldId, value);
  }
  bindEvents() {
    if (this.config.closeOnOverlayClick) {
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay)
          this.close();
      });
    }
    if (this.config.closeOnEscape) {
      const handleEscape = (e) => {
        if (this.isOpen && e.key === "Escape") {
          this.close();
          document.removeEventListener("keydown", handleEscape);
        }
      };
      document.addEventListener("keydown", handleEscape);
    }
    this.dialog.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        const target = e.target;
        if (target.tagName !== "TEXTAREA") {
          e.preventDefault();
          this.handleSubmit();
        }
      }
    });
  }
  open() {
    if (this.isOpen)
      return;
    this.isOpen = true;
    this.overlay.style.display = "flex";
    if (this.config.preventScroll)
      document.body.style.overflow = "hidden";
    if (this.config.animation) {
      if (!document.querySelector("#unified-dialog-styles")) {
        const style = document.createElement("style");
        style.id = "unified-dialog-styles";
        style.textContent = `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes slideDown {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(20px); opacity: 0; }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
      this.overlay.style.animation = "fadeIn 0.2s ease-out";
      this.dialog.style.animation = "slideUp 0.3s ease-out";
    }
    setTimeout(() => {
      const firstInput = this.dialog.querySelector("input:not([disabled]), textarea:not([disabled]), select:not([disabled])");
      if (firstInput instanceof HTMLElement)
        firstInput.focus();
    }, 100);
    if (this.config.onOpen)
      this.config.onOpen();
  }
  async close() {
    if (!this.isOpen || this.isClosing)
      return;
    if (this.config.beforeClose) {
      const canClose = await this.config.beforeClose();
      if (!canClose)
        return;
    }
    this.isClosing = true;
    if (this.config.animation) {
      this.overlay.style.animation = "fadeOut 0.2s ease-out";
      this.dialog.style.animation = "slideDown 0.2s ease-out";
      setTimeout(() => {
        this.overlay.style.display = "none";
        this.isOpen = false;
        this.isClosing = false;
        if (this.config.preventScroll)
          document.body.style.overflow = "";
        if (this.config.onClose)
          this.config.onClose();
      }, 200);
    } else {
      this.overlay.style.display = "none";
      this.isOpen = false;
      this.isClosing = false;
      if (this.config.onClose)
        this.config.onClose();
    }
  }
  // 公共API方法
  setButtonLoading(buttonId, loading) {
    const button = this.buttonElements.get(buttonId);
    if (button) {
      const spinner = button.querySelector(".unified-dialog-btn-spinner");
      if (loading) {
        button.disabled = true;
        if (spinner)
          spinner.style.display = "inline-block";
      } else {
        button.disabled = false;
        if (spinner)
          spinner.style.display = "none";
      }
    }
  }
  setButtonDisabled(buttonId, disabled) {
    const button = this.buttonElements.get(buttonId);
    if (button) {
      button.disabled = disabled;
      button.style.opacity = disabled ? "0.5" : "1";
      button.style.cursor = disabled ? "not-allowed" : "pointer";
    }
  }
  getFieldValue(fieldId) {
    return this.fieldValues.get(fieldId);
  }
  setFieldValueById(fieldId, value) {
    this.fieldValues.set(fieldId, value);
    const element = this.fieldElements.get(fieldId);
    if (element) {
      if (element instanceof HTMLInputElement && element.type === "checkbox")
        element.checked = !!value;
      else if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)
        element.value = String(value);
    }
  }
  getFormData() {
    const data = {};
    this.fieldValues.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }
  // Toast 通知系统
  showToast(message, type = "info", duration = 3e3) {
    const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast = document.createElement("div");
    toast.className = `unified-dialog-toast unified-dialog-toast-${type}`;
    toast.dataset.toastId = toastId;
    const styles = {
      error: {
        background: "#fef2f2",
        color: "#991b1b",
        border: "1px solid #fecaca",
        icon: "\u26A0\uFE0F"
      },
      success: {
        background: "#f0fdf4",
        color: "#166534",
        border: "1px solid #86efac",
        icon: "\u2705"
      },
      warning: {
        background: "#fffbeb",
        color: "#92400e",
        border: "1px solid #fde68a",
        icon: "\u26A0\uFE0F"
      },
      info: {
        background: "#eff6ff",
        color: "#1e40af",
        border: "1px solid #93c5fd",
        icon: "\u2139\uFE0F"
      }
    };
    const style = styles[type];
    toast.style.cssText = `
      padding: 12px 16px 12px 44px;
      background: ${style.background};
      border: ${style.border};
      border-radius: 8px;
      color: ${style.color};
      font-size: 14px;
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      opacity: 0;
      transform: translateX(20px);
      transition: all 0.3s ease;
      pointer-events: auto;
      max-width: 100%;
      word-wrap: break-word;
    `;
    const icon = document.createElement("span");
    icon.style.cssText = `
      position: absolute;
      left: 12px;
      font-size: 18px;
    `;
    icon.textContent = style.icon;
    toast.appendChild(icon);
    const messageSpan = document.createElement("span");
    messageSpan.style.cssText = `
      white-space: pre-line;
      flex: 1;
    `;
    messageSpan.textContent = message;
    toast.appendChild(messageSpan);
    const closeBtn = document.createElement("button");
    closeBtn.style.cssText = `
      margin-left: auto;
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      padding: 0 0 0 12px;
      font-size: 18px;
      opacity: 0.7;
      transition: opacity 0.2s;
    `;
    closeBtn.innerHTML = "\xD7";
    closeBtn.onclick = () => this.removeToast(toastId);
    closeBtn.onmouseenter = () => {
      closeBtn.style.opacity = "1";
    };
    closeBtn.onmouseleave = () => {
      closeBtn.style.opacity = "0.7";
    };
    toast.appendChild(closeBtn);
    this.toastContainer.appendChild(toast);
    this.activeToasts.set(toastId, toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    });
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(toastId);
      }, duration);
    }
  }
  removeToast(toastId) {
    const toast = this.activeToasts.get(toastId);
    if (toast) {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      setTimeout(() => {
        toast.remove();
        this.activeToasts.delete(toastId);
      }, 300);
    }
  }
  showError(message) {
    this.showToast(message, "error", 5e3);
  }
  showSuccess(message) {
    this.showToast(message, "success", 3e3);
  }
  showWarning(message) {
    this.showToast(message, "warning", 4e3);
  }
  showInfo(message) {
    this.showToast(message, "info", 3e3);
  }
  hideError() {
    this.activeToasts.forEach((toast, id) => {
      if (toast.classList.contains("unified-dialog-toast-error"))
        this.removeToast(id);
    });
  }
  destroy() {
    if (this.overlay && this.overlay.parentNode)
      this.overlay.parentNode.removeChild(this.overlay);
    this.activeToasts.forEach((toast) => {
      toast.remove();
    });
    this.activeToasts.clear();
    const styles = document.querySelector("#unified-dialog-styles");
    if (styles)
      styles.remove();
    this.fieldValues.clear();
    this.fieldElements.clear();
    this.buttonElements.clear();
  }
}
function showUnifiedDialog(config) {
  const dialog = new UnifiedDialog(config);
  dialog.open();
  return dialog;
}
function showConfirmDialog(title, message, onConfirm, onCancel) {
  return showUnifiedDialog({
    title,
    content: message,
    buttons: [{
      id: "cancel",
      label: "\u53D6\u6D88",
      type: "secondary",
      onClick: () => onCancel?.(),
      closeOnClick: true
    }, {
      id: "confirm",
      label: "\u786E\u5B9A",
      type: "primary",
      onClick: async (dialog) => {
        await onConfirm();
        dialog.close();
      }
    }]
  });
}
function showAlertDialog(title, message, onOk) {
  return showUnifiedDialog({
    title,
    content: message,
    buttons: [{
      id: "ok",
      label: "\u77E5\u9053\u4E86",
      type: "primary",
      onClick: () => onOk?.(),
      closeOnClick: true
    }]
  });
}
function showPromptDialog(title, label, onConfirm, options) {
  return showUnifiedDialog({
    title,
    fields: [{
      id: "input",
      type: options?.type || "text",
      label,
      placeholder: options?.placeholder,
      defaultValue: options?.defaultValue,
      required: true,
      validator: options?.validator
    }],
    onSubmit: async (data) => {
      await onConfirm(data.input);
    }
  });
}

export { UnifiedDialog, showAlertDialog, showConfirmDialog, showPromptDialog, showUnifiedDialog };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=UnifiedDialog.js.map
