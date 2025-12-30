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

var font = require('../plugins/formatting/font.cjs');
var lineHeight = require('../plugins/formatting/line-height.cjs');
var defaultToolbar = require('./defaultToolbar.cjs');
var Dropdown = require('./Dropdown.cjs');
var index = require('./icons/index.cjs');
var MediaInsert = require('./MediaInsert.cjs');
var Tooltip = require('./Tooltip.cjs');
var UnifiedDialog = require('./UnifiedDialog.cjs');
var UnifiedDropdown = require('./UnifiedDropdown.cjs');

class Toolbar {
  constructor(editor, options = {}) {
    this.buttons = /* @__PURE__ */ new Map();
    this.editor = editor;
    this.options = options;
    this.element = document.createElement("div");
    this.element.className = `ldesign-editor-toolbar ${options.className || ""}`;
    this.render();
    this.editor.on("update", () => this.updateButtonStates());
    this.editor.on("selectionUpdate", () => this.updateButtonStates());
  }
  /**
   * 渲染工具栏
   */
  render() {
    console.log("[Toolbar] Starting render...");
    console.log("[Toolbar] Options:", this.options);
    const items = this.options.items || this.getDefaultItems();
    console.log("[Toolbar] Items to render:", items.length, items);
    items.forEach((item, index) => {
      console.log(`[Toolbar] Creating button for: ${item.name}`);
      const button = this.createButton(item);
      this.buttons.set(item.name, button);
      this.element.appendChild(button);
      if (this.shouldAddSeparator(index, items)) {
        const separator = document.createElement("div");
        separator.className = "ldesign-editor-toolbar-separator";
        this.element.appendChild(separator);
      }
    });
    if (this.options.container) {
      console.log("[Toolbar] Appending to container:", this.options.container);
      this.options.container.appendChild(this.element);
    } else {
      console.log("[Toolbar] No container provided");
    }
    console.log("[Toolbar] Render complete. Element:", this.element);
    console.log("[Toolbar] Element children:", this.element.children.length);
  }
  /**
   * 创建按钮
   */
  createButton(item) {
    const button = document.createElement("button");
    button.className = "ldesign-editor-toolbar-button";
    button.type = "button";
    if (item.title)
      Tooltip.bindTooltip(button, item.title);
    button.setAttribute("data-name", item.name);
    const isDropdown = ["heading", "align", "fontSize", "fontFamily", "lineHeight", "textTransform", "ai"].includes(item.name);
    if (isDropdown) {
      button.style.width = "auto";
      button.style.minWidth = item.name === "heading" ? "80px" : "48px";
      button.style.paddingLeft = "8px";
      button.style.paddingRight = "8px";
      button.style.gap = "4px";
      button.style.display = "flex";
      button.style.alignItems = "center";
      button.style.justifyContent = "space-between";
    }
    if (item.name === "heading") {
      const levelText = document.createElement("span");
      levelText.className = "heading-level-text";
      levelText.style.fontSize = "14px";
      levelText.style.fontWeight = "600";
      levelText.style.marginRight = "auto";
      levelText.textContent = "H1";
      button.appendChild(levelText);
      const updateLevelText = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
          levelText.textContent = "\u6B63\u6587";
          return;
        }
        let element = selection.anchorNode;
        if (!element) {
          levelText.textContent = "\u6B63\u6587";
          return;
        }
        element = element.nodeType === Node.TEXT_NODE ? element.parentElement : element;
        while (element && element !== document.body) {
          const tagName = element.tagName?.toUpperCase();
          switch (tagName) {
            case "H1":
              levelText.textContent = "H1";
              return;
            case "H2":
              levelText.textContent = "H2";
              return;
            case "H3":
              levelText.textContent = "H3";
              return;
            case "H4":
              levelText.textContent = "H4";
              return;
            case "H5":
              levelText.textContent = "H5";
              return;
            case "H6":
              levelText.textContent = "H6";
              return;
            case "P":
            case "DIV":
              if (!element.closest("h1,h2,h3,h4,h5,h6")) {
                levelText.textContent = "\u6B63\u6587";
                return;
              }
              break;
          }
          element = element.parentElement;
        }
        levelText.textContent = "\u6B63\u6587";
      };
      button.addEventListener("mouseenter", updateLevelText);
      document.addEventListener("selectionchange", updateLevelText);
      if (this.editor.contentElement)
        this.editor.contentElement.addEventListener("input", updateLevelText);
      updateLevelText();
    } else {
      const iconElement = index.createIcon(item.icon);
      if (iconElement)
        button.appendChild(iconElement);
      else
        button.textContent = item.title;
    }
    if (isDropdown) {
      const chevron = index.createIcon("chevron-down");
      if (chevron) {
        chevron.style.opacity = "0.6";
        button.appendChild(chevron);
      }
    }
    button.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    button.addEventListener("click", (e) => {
      e.preventDefault();
      if (item.name === "textColor") {
        UnifiedDropdown.showColorDropdown(button, (color) => {
          this.editor.commands.execute("setTextColor", color);
        }, true, "\u6587\u5B57\u989C\u8272");
        return;
      }
      if (item.name === "backgroundColor") {
        UnifiedDropdown.showColorDropdown(button, (color) => {
          this.editor.commands.execute("setBackgroundColor", color);
        }, true, "\u80CC\u666F\u8272");
        return;
      }
      if (item.name === "heading") {
        const getCurrentLevel = () => {
          const selection = window.getSelection();
          if (!selection || selection.rangeCount === 0)
            return "p";
          let element = selection.anchorNode;
          if (!element)
            return "p";
          element = element.nodeType === Node.TEXT_NODE ? element.parentElement : element;
          while (element && element !== document.body) {
            const tagName = element.tagName?.toUpperCase();
            if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(tagName))
              return tagName.toLowerCase();
            if (["P", "DIV"].includes(tagName) && !element.closest("h1,h2,h3,h4,h5,h6"))
              return "p";
            element = element.parentElement;
          }
          return "p";
        };
        const currentLevel = getCurrentLevel();
        Dropdown.showDropdown(button, {
          options: [{
            label: "\u6B63\u6587",
            value: "p"
          }, {
            label: "\u6807\u9898 1",
            value: "h1"
          }, {
            label: "\u6807\u9898 2",
            value: "h2"
          }, {
            label: "\u6807\u9898 3",
            value: "h3"
          }, {
            label: "\u6807\u9898 4",
            value: "h4"
          }, {
            label: "\u6807\u9898 5",
            value: "h5"
          }, {
            label: "\u6807\u9898 6",
            value: "h6"
          }],
          selectedValue: currentLevel,
          // 传递当前值
          onSelect: (value) => {
            const map = {
              p: "setParagraph",
              h1: "setHeading1",
              h2: "setHeading2",
              h3: "setHeading3",
              h4: "setHeading4",
              h5: "setHeading5",
              h6: "setHeading6"
            };
            const cmd = map[value];
            if (cmd) {
              this.editor.commands.execute(cmd);
            } else {
              document.execCommand("formatBlock", false, value);
            }
          }
        });
        return;
      }
      if (item.name === "align") {
        Dropdown.showDropdown(button, {
          options: [{
            label: "\u5DE6\u5BF9\u9F50",
            value: "left"
          }, {
            label: "\u5C45\u4E2D",
            value: "center"
          }, {
            label: "\u53F3\u5BF9\u9F50",
            value: "right"
          }, {
            label: "\u4E24\u7AEF\u5BF9\u9F50",
            value: "justify"
          }],
          onSelect: (value) => {
            const map = {
              left: "alignLeft",
              center: "alignCenter",
              right: "alignRight",
              justify: "alignJustify"
            };
            const cmd = map[value];
            if (cmd)
              this.editor.commands.execute(cmd);
          }
        });
        return;
      }
      if (item.name === "fontSize") {
        Dropdown.showDropdown(button, {
          options: font.FONT_SIZES,
          onSelect: (size) => {
            this.editor.commands.execute("setFontSize", size);
          }
        });
        return;
      }
      if (item.name === "fontFamily") {
        Dropdown.showDropdown(button, {
          options: font.FONT_FAMILIES,
          onSelect: (family) => {
            this.editor.commands.execute("setFontFamily", family);
          }
        });
        return;
      }
      if (item.name === "lineHeight") {
        Dropdown.showDropdown(button, {
          options: lineHeight.LINE_HEIGHTS,
          onSelect: (height) => {
            this.editor.commands.execute("setLineHeight", height);
          }
        });
        return;
      }
      if (item.name === "textTransform") {
        Dropdown.showDropdown(button, {
          options: [{
            label: "\u5927\u5199",
            value: "toUpperCase"
          }, {
            label: "\u5C0F\u5199",
            value: "toLowerCase"
          }, {
            label: "\u9996\u5B57\u6BCD\u5927\u5199",
            value: "toCapitalize"
          }, {
            label: "\u53E5\u5B50\u5927\u5C0F\u5199",
            value: "toSentenceCase"
          }, {
            label: "\u5168\u89D2\u8F6C\u534A\u89D2",
            value: "toHalfWidth"
          }, {
            label: "\u534A\u89D2\u8F6C\u5168\u89D2",
            value: "toFullWidth"
          }],
          onSelect: (command) => {
            this.editor.commands.execute(command);
          }
        });
        return;
      }
      if (item.name === "ai") {
        Dropdown.showDropdown(button, {
          options: [
            {
              label: "AI \u7EA0\u9519",
              value: "ai-correct",
              icon: "sparkles"
            },
            {
              label: "AI \u8865\u5168",
              value: "ai-complete",
              icon: "lightbulb"
            },
            {
              label: "AI \u7EED\u5199",
              value: "ai-continue",
              icon: "pen-tool"
            },
            {
              label: "AI \u91CD\u5199",
              value: "ai-rewrite",
              icon: "refresh-cw"
            },
            {
              label: "---",
              value: "separator"
            },
            // 分隔线
            {
              label: "AI \u8BBE\u7F6E",
              value: "ai-config",
              icon: "settings"
            }
          ],
          onSelect: (command) => {
            if (command === "separator")
              return;
            console.log("[Toolbar] AI dropdown selected:", command);
            console.log("[Toolbar] Available commands:", this.editor.commands.getCommands());
            console.log("[Toolbar] Has command?", this.editor.commands.has(command));
            if (this.editor.commands.has(command)) {
              console.log("[Toolbar] Executing AI command:", command);
              this.editor.commands.execute(command);
            } else {
              console.warn(`[Toolbar] AI command '${command}' not found. Make sure AI plugin is loaded.`);
              console.warn("[Toolbar] Available commands:", this.editor.commands.getCommands());
            }
          },
          renderOption: (option) => {
            if (option.value === "separator") {
              const separator = document.createElement("div");
              separator.style.cssText = "height: 1px; background: #e0e0e0; margin: 4px 0;";
              return separator;
            }
            return null;
          }
        });
        return;
      }
      if (item.name === "image") {
        MediaInsert.showMediaInsert(button, {
          type: "image",
          onInsert: (urls, alt) => {
            if (this.editor.contentElement)
              this.editor.contentElement.focus();
            MediaInsert.insertMedia("image", urls, {
              alt
            });
            if (this.editor.emit)
              this.editor.emit("update");
          },
          multiple: true
        });
        return;
      }
      if (item.name === "video") {
        MediaInsert.showMediaInsert(button, {
          type: "video",
          onInsert: (urls, alt) => {
            if (this.editor.contentElement)
              this.editor.contentElement.focus();
            MediaInsert.insertMedia("video", urls);
            if (this.editor.emit)
              this.editor.emit("update");
          },
          multiple: false
        });
        return;
      }
      if (item.name === "audio") {
        MediaInsert.showMediaInsert(button, {
          type: "audio",
          onInsert: (urls, alt) => {
            if (this.editor.contentElement)
              this.editor.contentElement.focus();
            MediaInsert.insertMedia("audio", urls);
            if (this.editor.emit)
              this.editor.emit("update");
          },
          multiple: false
        });
        return;
      }
      if (item.name === "emoji") {
        console.log("[Toolbar] Opening emoji picker");
        UnifiedDropdown.showEmojiDropdown(button, (emoji) => {
          console.log("[Toolbar] Inserting emoji:", emoji);
          document.execCommand("insertText", false, emoji);
        });
        return;
      }
      if (item.name === "search") {
        console.log("[Toolbar] Opening find-replace dialog");
        const selection = window.getSelection();
        const selectedText = selection && selection.toString().trim() || "";
        let currentHighlights = null;
        UnifiedDialog.showUnifiedDialog({
          title: "\u67E5\u627E\u548C\u66FF\u6362",
          width: 520,
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>`,
          fields: [{
            id: "findText",
            type: "text",
            label: "\u67E5\u627E\u5185\u5BB9",
            placeholder: "\u8F93\u5165\u8981\u67E5\u627E\u7684\u6587\u672C",
            required: true,
            defaultValue: selectedText
          }, {
            id: "replaceText",
            type: "text",
            label: "\u66FF\u6362\u4E3A",
            placeholder: "\u8F93\u5165\u66FF\u6362\u6587\u672C",
            required: false
          }, {
            id: "actionType",
            type: "select",
            label: "\u64CD\u4F5C",
            defaultValue: "find",
            options: [{
              label: "\u4EC5\u67E5\u627E",
              value: "find"
            }, {
              label: "\u67E5\u627E\u5E76\u66FF\u6362\u5168\u90E8",
              value: "replaceAll"
            }]
          }, {
            id: "caseSensitive",
            type: "checkbox",
            label: "\u533A\u5206\u5927\u5C0F\u5199",
            defaultValue: false
          }, {
            id: "wholeWord",
            type: "checkbox",
            label: "\u5168\u5B57\u5339\u914D",
            defaultValue: false
          }],
          onSubmit: (data) => {
            console.log("[Toolbar] Find/Replace data:", data);
            const content = this.editor.contentElement;
            if (!content)
              return;
            const findText = data.findText;
            const replaceText = data.replaceText || "";
            const actionType = data.actionType || "find";
            const caseSensitive = data.caseSensitive;
            const wholeWord = data.wholeWord;
            const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const wordBoundary = wholeWord ? "\\b" : "";
            const pattern = new RegExp(`${wordBoundary}${escaped}${wordBoundary}`, caseSensitive ? "g" : "gi");
            console.log("[Find] Starting search for:", findText);
            console.log("[Find] Options:", {
              caseSensitive,
              wholeWord
            });
            content.querySelectorAll(".editor-highlight").forEach((el) => {
              const text = el.textContent || "";
              const textNode = document.createTextNode(text);
              const parent = el.parentNode;
              if (parent)
                parent.replaceChild(textNode, el);
            });
            let count = 0;
            const processNode = (node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent || "";
                if (!text.trim())
                  return;
                pattern.lastIndex = 0;
                const matches = [];
                let match;
                while ((match = pattern.exec(text)) !== null) {
                  matches.push([...match]);
                  count++;
                  if (!pattern.global)
                    break;
                }
                if (matches.length > 0) {
                  const parent = node.parentNode;
                  if (!parent)
                    return;
                  const fragment = document.createDocumentFragment();
                  let lastIndex = 0;
                  matches.forEach((m) => {
                    const matchIndex = m.index || 0;
                    const matchText = m[0];
                    if (matchIndex > lastIndex) {
                      fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchIndex)));
                    }
                    const highlight = document.createElement("span");
                    highlight.className = "editor-highlight";
                    highlight.style.background = "#fef08a";
                    highlight.style.padding = "1px 2px";
                    highlight.style.borderRadius = "2px";
                    highlight.textContent = matchText;
                    fragment.appendChild(highlight);
                    lastIndex = matchIndex + matchText.length;
                  });
                  if (lastIndex < text.length) {
                    fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
                  }
                  parent.replaceChild(fragment, node);
                }
              } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName?.toLowerCase();
                if (tagName === "script" || tagName === "style" || tagName === "noscript")
                  return;
                const children = Array.from(node.childNodes);
                children.forEach((child) => processNode(child));
              }
            };
            processNode(content);
            console.log("[Find] Found matches:", count);
            if (count > 0) {
              const firstMatch = content.querySelector(".editor-highlight");
              if (firstMatch instanceof HTMLElement) {
                firstMatch.scrollIntoView({
                  behavior: "smooth",
                  block: "center"
                });
                firstMatch.style.background = "#facc15";
              }
            }
            currentHighlights = content.querySelectorAll(".editor-highlight");
            if (actionType === "replaceAll" && count > 0) {
              if (!replaceText && replaceText !== "") {
                alert("\u8BF7\u8F93\u5165\u66FF\u6362\u6587\u672C");
                return;
              }
              if (confirm(`\u786E\u5B9A\u8981\u5C06 ${count} \u5904 "${findText}" \u66FF\u6362\u4E3A "${replaceText || "(\u7A7A)"}" \u5417\uFF1F`)) {
                const nodeGroups = [];
                const processedNodes = /* @__PURE__ */ new Set();
                currentHighlights.forEach((el) => {
                  if (!(el instanceof HTMLElement) || !el.parentNode || processedNodes.has(el))
                    return;
                  const group = [el];
                  processedNodes.add(el);
                  let nextSibling = el.nextSibling;
                  while (nextSibling) {
                    if (nextSibling instanceof HTMLElement && nextSibling.classList.contains("editor-highlight") && !processedNodes.has(nextSibling)) {
                      group.push(nextSibling);
                      processedNodes.add(nextSibling);
                      nextSibling = nextSibling.nextSibling;
                    } else if (nextSibling.nodeType === Node.TEXT_NODE && !nextSibling.textContent?.trim()) {
                      nextSibling = nextSibling.nextSibling;
                    } else {
                      break;
                    }
                  }
                  nodeGroups.push({
                    elements: group,
                    parent: el.parentNode
                  });
                });
                let replacedCount = 0;
                nodeGroups.forEach(({
                  elements,
                  parent
                }) => {
                  try {
                    const fullText = elements.map((el) => el.textContent || "").join("");
                    console.log(`[Replace] Replacing "${fullText}" with "${replaceText}"`);
                    const newTextNode = document.createTextNode(replaceText);
                    parent.replaceChild(newTextNode, elements[0]);
                    for (let i = 1; i < elements.length; i++) {
                      if (elements[i].parentNode)
                        elements[i].remove();
                    }
                    replacedCount++;
                  } catch (e2) {
                    console.error("\u66FF\u6362\u5931\u8D25:", e2);
                  }
                });
                const successMessage = document.createElement("div");
                successMessage.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #10b981;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10001;
                  `;
                successMessage.textContent = `\u6210\u529F\u66FF\u6362 ${replacedCount} \u5904`;
                document.body.appendChild(successMessage);
                setTimeout(() => successMessage.remove(), 3e3);
                console.log(`\u66FF\u6362\u5B8C\u6210: \u603B\u8BA1${count}\u5904, \u5B9E\u9645\u66FF\u6362${replacedCount}\u5904`);
              }
            } else if (count > 0) {
              const resultMessage = document.createElement("div");
              resultMessage.style.cssText = `
                  position: fixed;
                  bottom: 20px;
                  right: 20px;
                  background: #3b82f6;
                  color: white;
                  padding: 12px 20px;
                  border-radius: 8px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                  z-index: 10001;
                `;
              resultMessage.textContent = `\u627E\u5230 ${count} \u4E2A\u5339\u914D\u9879`;
              document.body.appendChild(resultMessage);
              setTimeout(() => resultMessage.remove(), 3e3);
            } else {
              alert(`\u672A\u627E\u5230 "${findText}"`);
            }
          }
        });
        return;
      }
      if (item.name === "link") {
        console.log("[Toolbar] Opening link dialog");
        const selection = window.getSelection();
        const selectedText = selection && selection.toString().trim() || "";
        let savedRange = null;
        if (selection && selection.rangeCount > 0)
          savedRange = selection.getRangeAt(0).cloneRange();
        UnifiedDialog.showUnifiedDialog({
          title: "\u63D2\u5165\u94FE\u63A5",
          width: 500,
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>`,
          fields: [{
            id: "text",
            type: "text",
            label: "\u94FE\u63A5\u6587\u672C",
            placeholder: "\u8BF7\u8F93\u5165\u94FE\u63A5\u6587\u672C",
            required: !selectedText,
            defaultValue: selectedText,
            disabled: !!selectedText
          }, {
            id: "url",
            type: "url",
            label: "\u94FE\u63A5\u5730\u5740",
            placeholder: "https://example.com",
            required: true,
            helpText: "\u8BF7\u8F93\u5165\u5B8C\u6574\u7684URL\u5730\u5740\uFF0C\u5305\u62EC http:// \u6216 https://"
          }],
          onSubmit: (data) => {
            const text = selectedText || data.text;
            const url = data.url;
            console.log("[Toolbar] Inserting link:", text, url);
            const editorContent = this.editor.contentElement;
            if (editorContent)
              editorContent.focus();
            if (savedRange && selection) {
              selection.removeAllRanges();
              selection.addRange(savedRange);
            }
            if (selectedText) {
              const success = document.execCommand("createLink", false, url);
              if (!success && selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const link = document.createElement("a");
                link.href = url;
                link.target = "_blank";
                link.textContent = selectedText;
                range.deleteContents();
                range.insertNode(link);
                range.setStartAfter(link);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
              }
            } else {
              const link = document.createElement("a");
              link.href = url;
              link.target = "_blank";
              link.textContent = text;
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(link);
                range.setStartAfter(link);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
              } else {
                const linkHtml = `<a href="${url}" target="_blank">${text}</a>`;
                document.execCommand("insertHTML", false, linkHtml);
              }
            }
            if (this.editor.emit)
              this.editor.emit("update");
          }
        });
        return;
      }
      if (typeof item.command === "string") {
        if (this.editor.commands && this.editor.commands.execute) {
          console.log(`[Toolbar] Executing string command: ${item.command}`);
          this.editor.commands.execute(item.command);
          return;
        }
      }
      if (typeof item.command === "function") {
        console.log(`[Toolbar] Executing function command for: ${item.name}`);
        const state = this.editor.getState();
        item.command(state, this.editor.dispatch.bind(this.editor), this.editor);
      }
    });
    return button;
  }
  /**
   * 是否添加分隔符
   */
  shouldAddSeparator(index, items) {
    const separatorAfter = ["redo", "code", "heading", "codeblock", "taskList", "indent", "align", "horizontalRule", "fontFamily", "backgroundColor", "removeFormat"];
    return separatorAfter.includes(items[index].name) && index < items.length - 1;
  }
  /**
   * 更新按钮状态
   */
  updateButtonStates() {
    const items = this.options.items || this.getDefaultItems();
    const state = this.editor.getState();
    items.forEach((item) => {
      const button = this.buttons.get(item.name);
      if (!button)
        return;
      if (item.active) {
        const isActive = item.active(state);
        button.classList.toggle("active", isActive);
      }
      if (item.disabled) {
        const isDisabled = item.disabled(state);
        button.disabled = isDisabled;
      }
    });
  }
  /**
   * 获取默认工具栏项
   */
  getDefaultItems() {
    const items = [];
    console.log("[Toolbar] Getting default items...");
    const plugins = this.editor.plugins.getAll();
    console.log("[Toolbar] Total plugins:", plugins.length);
    plugins.forEach((plugin) => {
      console.log(`[Toolbar] Checking plugin: ${plugin.name}`, plugin);
      if (plugin.config && plugin.config.toolbar) {
        console.log(`[Toolbar] Found toolbar config in ${plugin.name}:`, plugin.config.toolbar);
        items.push(...plugin.config.toolbar);
      } else {
        console.log(`[Toolbar] No toolbar config in ${plugin.name}`);
      }
    });
    console.log("[Toolbar] Total toolbar items collected from plugins:", items.length);
    if (items.length === 0) {
      console.log("[Toolbar] No items from plugins, using default toolbar");
      return defaultToolbar.DEFAULT_TOOLBAR_ITEMS;
    }
    return items;
  }
  /**
   * 获取工具栏元素
   */
  getElement() {
    return this.element;
  }
  /**
   * 销毁工具栏
   */
  destroy() {
    this.buttons.clear();
    this.element.remove();
  }
}

exports.Toolbar = Toolbar;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=Toolbar.cjs.map
