/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createPlugin } from '../../core/Plugin.js';
import { showUnifiedDialog } from '../../ui/UnifiedDialog.js';

const PREVIEW_STYLES = `
.link-preview-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  font-size: 13px;
  max-width: 400px;
  animation: linkPreviewFadeIn 0.15s ease;
}

@keyframes linkPreviewFadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.link-preview-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border-radius: 6px;
  flex-shrink: 0;
}

.link-preview-icon svg {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

.link-preview-icon img {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.link-preview-content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.link-preview-text {
  font-weight: 500;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.link-preview-url {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-preview-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-left: 8px;
  border-left: 1px solid #e5e7eb;
  margin-left: 4px;
}

.link-preview-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.15s ease;
}

.link-preview-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.link-preview-btn.danger:hover {
  background: #fef2f2;
  color: #ef4444;
}

.link-preview-btn svg {
  width: 16px;
  height: 16px;
}

/* \u94FE\u63A5hover\u6548\u679C */
.ldesign-editor-content a {
  position: relative;
  color: #3b82f6;
  text-decoration: underline;
  text-decoration-color: rgba(59, 130, 246, 0.3);
  text-underline-offset: 2px;
  transition: all 0.15s ease;
}

.ldesign-editor-content a:hover {
  text-decoration-color: #3b82f6;
}

.ldesign-editor-content a.link-active {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 2px;
}

/* \u590D\u5236\u6210\u529F\u63D0\u793A */
.link-preview-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: #10b981;
  color: #fff;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  animation: toastFadeInOut 2s ease;
}

@keyframes toastFadeInOut {
  0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  15% { opacity: 1; transform: translateX(-50%) translateY(0); }
  85% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
}
`;
const ICONS = {
  link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  open: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  unlink: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.84 12.25l1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"/><path d="M5.17 11.75l-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"/><line x1="8" y1="2" x2="8" y2="5"/><line x1="2" y1="8" x2="5" y2="8"/><line x1="16" y1="19" x2="16" y2="22"/><line x1="19" y1="16" x2="22" y2="16"/></svg>`
};
function getFaviconUrl(url) {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
  } catch {
    return "";
  }
}
function formatUrl(url) {
  try {
    const urlObj = new URL(url);
    let display = urlObj.hostname + urlObj.pathname;
    if (display.length > 40) {
      display = display.substring(0, 37) + "...";
    }
    return display;
  } catch {
    if (url.length > 40) {
      return url.substring(0, 37) + "...";
    }
    return url;
  }
}
class LinkPreview {
  constructor() {
    this.previewCard = null;
    this.currentLink = null;
    this.hideTimeout = null;
    this.styleInjected = false;
    this.injectStyles();
    this.setupEventListeners();
  }
  /**
   * 注入样式
   */
  injectStyles() {
    if (this.styleInjected)
      return;
    const styleId = "link-preview-styles";
    if (document.getElementById(styleId)) {
      this.styleInjected = true;
      return;
    }
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = PREVIEW_STYLES;
    document.head.appendChild(style);
    this.styleInjected = true;
  }
  /**
   * 设置事件监听
   */
  setupEventListeners() {
    document.addEventListener("mouseover", (e) => {
      const target = e.target;
      const link = target.closest("a");
      if (link && link.closest(".ldesign-editor-content")) {
        this.clearHideTimeout();
        this.showPreview(link);
      }
    });
    document.addEventListener("mouseout", (e) => {
      const target = e.target;
      const relatedTarget = e.relatedTarget;
      if (relatedTarget?.closest(".link-preview-card")) {
        return;
      }
      if (target.closest("a") && target.closest(".ldesign-editor-content")) {
        this.scheduleHide();
      }
    });
    document.addEventListener("mouseover", (e) => {
      const target = e.target;
      if (target.closest(".link-preview-card")) {
        this.clearHideTimeout();
      }
    });
    document.addEventListener("mouseout", (e) => {
      const target = e.target;
      const relatedTarget = e.relatedTarget;
      if (target.closest(".link-preview-card")) {
        if (relatedTarget?.tagName === "A" && relatedTarget.closest(".ldesign-editor-content")) {
          return;
        }
        this.scheduleHide();
      }
    });
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!target.closest(".link-preview-card") && !target.closest("a")) {
        this.hidePreview();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.previewCard) {
        this.hidePreview();
      }
    });
    document.addEventListener("scroll", () => {
      if (this.previewCard) {
        this.hidePreview();
      }
    }, true);
  }
  /**
   * 显示预览卡片
   */
  showPreview(link) {
    if (this.currentLink === link && this.previewCard) {
      return;
    }
    this.hidePreview();
    this.currentLink = link;
    link.classList.add("link-active");
    this.previewCard = this.createPreviewCard(link);
    document.body.appendChild(this.previewCard);
    this.positionPreview(link);
  }
  /**
   * 隐藏预览卡片
   */
  hidePreview() {
    if (this.previewCard) {
      this.previewCard.remove();
      this.previewCard = null;
    }
    if (this.currentLink) {
      this.currentLink.classList.remove("link-active");
      this.currentLink = null;
    }
    this.clearHideTimeout();
  }
  /**
   * 计划隐藏
   */
  scheduleHide() {
    this.clearHideTimeout();
    this.hideTimeout = setTimeout(() => {
      this.hidePreview();
    }, 200);
  }
  /**
   * 清除隐藏计时器
   */
  clearHideTimeout() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
  /**
   * 定位预览卡片
   */
  positionPreview(link) {
    if (!this.previewCard)
      return;
    const rect = link.getBoundingClientRect();
    const previewRect = this.previewCard.getBoundingClientRect();
    let top = rect.bottom + 8;
    let left = rect.left;
    if (top + previewRect.height > window.innerHeight - 10) {
      top = rect.top - previewRect.height - 8;
    }
    if (left + previewRect.width > window.innerWidth - 10) {
      left = window.innerWidth - previewRect.width - 10;
    }
    if (left < 10) {
      left = 10;
    }
    this.previewCard.style.top = `${top + window.scrollY}px`;
    this.previewCard.style.left = `${left + window.scrollX}px`;
  }
  /**
   * 创建预览卡片
   */
  createPreviewCard(link) {
    const card = document.createElement("div");
    card.className = "link-preview-card";
    const url = link.href;
    const text = link.textContent || url;
    const iconWrapper = document.createElement("div");
    iconWrapper.className = "link-preview-icon";
    const faviconUrl = getFaviconUrl(url);
    if (faviconUrl) {
      const favicon = document.createElement("img");
      favicon.src = faviconUrl;
      favicon.onerror = () => {
        iconWrapper.innerHTML = ICONS.link;
      };
      iconWrapper.appendChild(favicon);
    } else {
      iconWrapper.innerHTML = ICONS.link;
    }
    const content = document.createElement("div");
    content.className = "link-preview-content";
    const textEl = document.createElement("div");
    textEl.className = "link-preview-text";
    textEl.textContent = text;
    textEl.title = text;
    const urlEl = document.createElement("div");
    urlEl.className = "link-preview-url";
    urlEl.textContent = formatUrl(url);
    urlEl.title = url;
    content.appendChild(textEl);
    content.appendChild(urlEl);
    const actions = document.createElement("div");
    actions.className = "link-preview-actions";
    actions.appendChild(this.createButton("edit", "\u7F16\u8F91\u94FE\u63A5", () => this.editLink(link)));
    actions.appendChild(this.createButton("open", "\u6253\u5F00\u94FE\u63A5", () => this.openLink(url)));
    actions.appendChild(this.createButton("copy", "\u590D\u5236\u94FE\u63A5", () => this.copyLink(url)));
    actions.appendChild(this.createButton("unlink", "\u79FB\u9664\u94FE\u63A5", () => this.removeLink(link), true));
    card.appendChild(iconWrapper);
    card.appendChild(content);
    card.appendChild(actions);
    return card;
  }
  /**
   * 创建按钮
   */
  createButton(icon, title, onClick, isDanger = false) {
    const button = document.createElement("button");
    button.className = "link-preview-btn" + (isDanger ? " danger" : "");
    button.title = title;
    button.innerHTML = ICONS[icon] || "";
    button.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      onClick();
    };
    return button;
  }
  /**
   * 编辑链接
   */
  editLink(link) {
    const currentUrl = link.href;
    const currentText = link.textContent || "";
    this.hidePreview();
    showUnifiedDialog({
      title: "\u7F16\u8F91\u94FE\u63A5",
      width: 500,
      icon: ICONS.edit,
      fields: [{
        id: "text",
        type: "text",
        label: "\u94FE\u63A5\u6587\u672C",
        placeholder: "\u8BF7\u8F93\u5165\u94FE\u63A5\u6587\u672C",
        defaultValue: currentText
      }, {
        id: "url",
        type: "url",
        label: "\u94FE\u63A5\u5730\u5740",
        placeholder: "https://example.com",
        required: true,
        defaultValue: currentUrl,
        helpText: "\u8BF7\u8F93\u5165\u5B8C\u6574\u7684URL\u5730\u5740\uFF0C\u5305\u62EC http:// \u6216 https://"
      }],
      onSubmit: (data) => {
        link.href = data.url;
        link.textContent = data.text || data.url;
        this.triggerUpdate();
      }
    });
  }
  /**
   * 打开链接
   */
  openLink(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
  /**
   * 复制链接
   */
  copyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
      this.showToast("\u94FE\u63A5\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F");
    }).catch(() => {
      this.showToast("\u590D\u5236\u5931\u8D25", false);
    });
  }
  /**
   * 移除链接
   */
  removeLink(link) {
    const text = document.createTextNode(link.textContent || "");
    link.parentNode?.replaceChild(text, link);
    this.hidePreview();
    this.triggerUpdate();
  }
  /**
   * 显示提示
   */
  showToast(message, success = true) {
    const toast = document.createElement("div");
    toast.className = "link-preview-toast";
    toast.textContent = message;
    if (!success) {
      toast.style.background = "#ef4444";
    }
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2e3);
  }
  /**
   * 触发编辑器更新
   */
  triggerUpdate() {
    const editorContent = document.querySelector(".ldesign-editor-content");
    if (editorContent) {
      const event = new Event("input", {
        bubbles: true
      });
      editorContent.dispatchEvent(event);
    }
  }
  /**
   * 销毁
   */
  destroy() {
    this.hidePreview();
  }
}
let linkPreviewInstance = null;
const LinkPreviewPlugin = createPlugin({
  name: "linkPreview",
  init: () => {
    if (!linkPreviewInstance) {
      linkPreviewInstance = new LinkPreview();
    }
  },
  destroy: () => {
    if (linkPreviewInstance) {
      linkPreviewInstance.destroy();
      linkPreviewInstance = null;
    }
  }
});

export { LinkPreviewPlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=link-preview.js.map
