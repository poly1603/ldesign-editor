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

var index = require('./icons/index.cjs');
var Dropdown = require('./Dropdown.cjs');
var UnifiedDialog = require('./UnifiedDialog.cjs');

function showMediaInsert(button, options) {
  const {
    type,
    onInsert,
    accept,
    multiple = true
  } = options;
  const mediaConfig = {
    image: {
      title: "\u63D2\u5165\u56FE\u7247",
      localLabel: "\u672C\u5730\u4E0A\u4F20",
      networkLabel: "\u7F51\u7EDC\u56FE\u7247",
      accept: accept || "image/*",
      icon: "image",
      localIcon: "upload",
      networkIcon: "globe",
      placeholder: "\u8BF7\u8F93\u5165\u56FE\u7247\u5730\u5740",
      dialogTitle: "\u63D2\u5165\u7F51\u7EDC\u56FE\u7247"
    },
    video: {
      title: "\u63D2\u5165\u89C6\u9891",
      localLabel: "\u672C\u5730\u4E0A\u4F20",
      networkLabel: "\u7F51\u7EDC\u89C6\u9891",
      accept: accept || "video/*",
      icon: "video",
      localIcon: "upload",
      networkIcon: "globe",
      placeholder: "\u8BF7\u8F93\u5165\u89C6\u9891\u5730\u5740",
      dialogTitle: "\u63D2\u5165\u7F51\u7EDC\u89C6\u9891"
    },
    audio: {
      title: "\u63D2\u5165\u97F3\u9891",
      localLabel: "\u672C\u5730\u4E0A\u4F20",
      networkLabel: "\u7F51\u7EDC\u97F3\u9891",
      accept: accept || "audio/*",
      icon: "audio",
      localIcon: "upload",
      networkIcon: "globe",
      placeholder: "\u8BF7\u8F93\u5165\u97F3\u9891\u5730\u5740",
      dialogTitle: "\u63D2\u5165\u7F51\u7EDC\u97F3\u9891"
    }
  };
  const config = mediaConfig[type];
  const customContent = document.createElement("div");
  customContent.style.cssText = "padding: 8px 0;";
  const localOption = createMediaOption(config.localIcon, config.localLabel, "\u4ECE\u672C\u5730\u9009\u62E9\u6587\u4EF6\u4E0A\u4F20", () => {
    handleLocalUpload(config.accept, multiple, onInsert);
    closeDropdown();
  });
  const networkOption = createMediaOption(config.networkIcon, config.networkLabel, "\u8F93\u5165\u7F51\u7EDC\u5730\u5740", () => {
    showNetworkDialog(config, onInsert);
    closeDropdown();
  });
  customContent.appendChild(localOption);
  customContent.appendChild(networkOption);
  Dropdown.showDropdown(button, {
    customContent,
    width: 220
  });
  function closeDropdown() {
    const dropdown = document.querySelector(".editor-dropdown");
    if (dropdown) {
      dropdown.classList.add("closing");
      setTimeout(() => dropdown.remove(), 150);
    }
  }
}
function createMediaOption(iconName, title, description, onClick) {
  const option = document.createElement("div");
  option.className = "editor-media-option";
  option.style.cssText = `
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    gap: 12px;
  `;
  const iconContainer = document.createElement("div");
  iconContainer.style.cssText = `
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
  `;
  const iconSvg = index.createIcon(iconName);
  if (iconSvg) {
    iconSvg.style.width = "20px";
    iconSvg.style.height = "20px";
    iconContainer.appendChild(iconSvg);
  }
  const textContainer = document.createElement("div");
  textContainer.style.cssText = "flex: 1;";
  const titleEl = document.createElement("div");
  titleEl.style.cssText = `
    font-size: 14px;
    font-weight: 500;
    color: #111827;
  `;
  titleEl.textContent = title;
  const descEl = document.createElement("div");
  descEl.style.cssText = `
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
  `;
  descEl.textContent = description;
  textContainer.appendChild(titleEl);
  textContainer.appendChild(descEl);
  option.appendChild(iconContainer);
  option.appendChild(textContainer);
  option.addEventListener("mouseenter", () => {
    option.style.backgroundColor = "#f9fafb";
  });
  option.addEventListener("mouseleave", () => {
    option.style.backgroundColor = "transparent";
  });
  option.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  });
  option.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });
  return option;
}
function handleLocalUpload(accept, multiple, onInsert) {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = accept;
  fileInput.multiple = multiple;
  fileInput.style.display = "none";
  fileInput.addEventListener("change", () => {
    const files = Array.from(fileInput.files || []);
    if (files.length === 0)
      return;
    const urls = [];
    let processed = 0;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result;
        urls.push(url);
        processed++;
        if (processed === files.length)
          onInsert(urls);
      };
      reader.onerror = () => {
        processed++;
        console.error("\u6587\u4EF6\u8BFB\u53D6\u5931\u8D25:", file.name);
        if (processed === files.length && urls.length > 0)
          onInsert(urls);
      };
      reader.readAsDataURL(file);
    });
    document.body.removeChild(fileInput);
  });
  fileInput.addEventListener("cancel", () => {
    document.body.removeChild(fileInput);
  });
  document.body.appendChild(fileInput);
  fileInput.click();
}
function showNetworkDialog(config, onInsert) {
  const selection = window.getSelection();
  let savedRange = null;
  if (selection && selection.rangeCount > 0)
    savedRange = selection.getRangeAt(0).cloneRange();
  const iconMap = {
    \u63D2\u5165\u7F51\u7EDC\u97F3\u9891: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>`,
    \u63D2\u5165\u7F51\u7EDC\u89C6\u9891: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="23 7 16 12 23 17 23 7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>`,
    \u63D2\u5165\u7F51\u7EDC\u56FE\u7247: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>`
  };
  UnifiedDialog.showUnifiedDialog({
    title: config.dialogTitle,
    icon: iconMap[config.dialogTitle] || iconMap["\u63D2\u5165\u7F51\u7EDC\u56FE\u7247"],
    width: 560,
    // 设置更宽的宽度
    fields: [{
      id: "urls",
      type: "textarea",
      label: "\u5730\u5740\uFF08\u6BCF\u884C\u4E00\u4E2A\uFF0C\u53EF\u63D2\u5165\u591A\u4E2A\uFF09",
      placeholder: `${config.placeholder}
${config.placeholder}
...`,
      required: true,
      rows: 5,
      helpText: `\u8BF7\u8F93\u5165${config.placeholder.replace("\u8BF7\u8F93\u5165", "")}\uFF0C\u6BCF\u884C\u4E00\u4E2AURL\u5730\u5740\uFF0C\u652F\u6301\u6279\u91CF\u63D2\u5165`,
      validator: (value) => {
        if (!value || !value.trim())
          return "\u8BF7\u8F93\u5165\u81F3\u5C11\u4E00\u4E2AURL\u5730\u5740";
        const urls = value.split("\n").map((url) => url.trim()).filter((url) => url);
        if (urls.length === 0)
          return "\u8BF7\u8F93\u5165\u81F3\u5C11\u4E00\u4E2AURL\u5730\u5740";
        for (const url of urls) {
          try {
            new URL(url);
          } catch {
            return `\u65E0\u6548\u7684URL\u5730\u5740: ${url}`;
          }
        }
        return null;
      }
    }, {
      id: "alt",
      type: "text",
      label: "\u63CF\u8FF0\u6587\u5B57\uFF08\u5168\u90E8\u5A92\u4F53\u5171\u7528\uFF09",
      placeholder: "\u53EF\u9009\uFF0C\u7528\u4E8ESEO\u548C\u65E0\u969C\u788D\u8BBF\u95EE",
      required: false
    }],
    onSubmit: (data) => {
      const urls = data.urls.split("\n").map((url) => url.trim()).filter((url) => url);
      setTimeout(() => {
        const editorContent = document.querySelector(".ldesign-editor-content");
        if (editorContent) {
          editorContent.focus();
          if (savedRange && selection) {
            selection.removeAllRanges();
            selection.addRange(savedRange);
          }
        }
        onInsert(urls);
      }, 250);
    }
  });
}
function insertMedia(type, urls, options) {
  const {
    alt = "",
    width,
    height,
    controls = true
  } = options || {};
  const editorContent = document.querySelector(".ldesign-editor-content");
  if (!editorContent) {
    console.error("[MediaInsert] Editor content element not found");
    return;
  }
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    const range = document.createRange();
    range.selectNodeContents(editorContent);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
  urls.forEach((url, index) => {
    let html = "";
    switch (type) {
      case "image":
        html = `<img src="${url}" alt="${alt}"${width ? ` width="${width}"` : ""}${height ? ` height="${height}"` : ""} style="max-width: 100%; height: auto;">`;
        break;
      case "video":
        html = `<video src="${url}"${controls ? " controls" : ""}${width ? ` width="${width}"` : ""}${height ? ` height="${height}"` : ""} style="max-width: 100%;"></video>`;
        break;
      case "audio":
        html = `<audio src="${url}"${controls ? " controls" : ""}></audio>`;
        break;
    }
    if (html) {
      if (index > 0)
        html = `<br>${html}`;
      const success = document.execCommand("insertHTML", false, html);
      if (!success) {
        console.error("[MediaInsert] Failed to insert HTML:", html);
        try {
          const range = selection?.getRangeAt(0);
          if (range) {
            const fragment = document.createRange().createContextualFragment(html);
            range.insertNode(fragment);
            range.collapse(false);
          }
        } catch (e) {
          console.error("[MediaInsert] Fallback insertion failed:", e);
        }
      }
    }
  });
  editorContent.dispatchEvent(new Event("input", {
    bubbles: true
  }));
}

exports.insertMedia = insertMedia;
exports.showMediaInsert = showMediaInsert;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=MediaInsert.cjs.map
