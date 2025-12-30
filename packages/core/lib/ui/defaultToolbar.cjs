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

function execCommand(command, value) {
  return () => {
    document.execCommand(command, false, value);
    return true;
  };
}
function isCommandActive(command) {
  return () => document.queryCommandState(command);
}
const DEFAULT_TOOLBAR_ITEMS = [
  // 历史操作
  {
    name: "undo",
    title: "\u64A4\u9500 (Ctrl+Z)",
    icon: "undo",
    command: execCommand("undo")
  },
  {
    name: "redo",
    title: "\u91CD\u505A (Ctrl+Y)",
    icon: "redo",
    command: execCommand("redo")
  },
  // 文本格式
  {
    name: "bold",
    title: "\u7C97\u4F53 (Ctrl+B)",
    icon: "bold",
    command: execCommand("bold"),
    active: isCommandActive("bold")
  },
  {
    name: "italic",
    title: "\u659C\u4F53 (Ctrl+I)",
    icon: "italic",
    command: execCommand("italic"),
    active: isCommandActive("italic")
  },
  {
    name: "underline",
    title: "\u4E0B\u5212\u7EBF (Ctrl+U)",
    icon: "underline",
    command: execCommand("underline"),
    active: isCommandActive("underline")
  },
  {
    name: "strike",
    title: "\u5220\u9664\u7EBF",
    icon: "strikethrough",
    command: execCommand("strikeThrough"),
    active: isCommandActive("strikeThrough")
  },
  {
    name: "inlineCode",
    title: "\u884C\u5185\u4EE3\u7801 (Ctrl+`)",
    icon: "code",
    command: () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0)
        return false;
      const range = selection.getRangeAt(0);
      const text = range.toString();
      if (text) {
        const parent = range.commonAncestorContainer.parentElement;
        if (parent && parent.tagName === "CODE") {
          const textNode = document.createTextNode(text);
          parent.parentNode?.replaceChild(textNode, parent);
        } else {
          document.execCommand("insertHTML", false, `<code style="padding: 2px 4px; margin: 0 2px; background-color: rgba(135, 131, 120, 0.15); border-radius: 3px; font-size: 85%; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;">${text}</code>`);
        }
      }
      return true;
    },
    active: () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0)
        return false;
      const parent = selection.getRangeAt(0).commonAncestorContainer.parentElement;
      return parent?.tagName === "CODE";
    }
  },
  {
    name: "superscript",
    title: "\u4E0A\u6807",
    icon: "superscript",
    command: execCommand("superscript"),
    active: isCommandActive("superscript")
  },
  {
    name: "subscript",
    title: "\u4E0B\u6807",
    icon: "subscript",
    command: execCommand("subscript"),
    active: isCommandActive("subscript")
  },
  // 标题（下拉）
  {
    name: "heading",
    title: "\u6807\u9898/\u6B63\u6587",
    icon: "heading-1",
    // 由 Toolbar.ts 以下拉方式处理
    command: () => true
  },
  // 引用和代码块
  {
    name: "blockquote",
    title: "\u5F15\u7528",
    icon: "quote",
    command: execCommand("formatBlock", "<blockquote>")
  },
  {
    name: "codeblock",
    title: "\u4EE3\u7801\u5757",
    icon: "code-2",
    command: "insertCodeBlock"
    // 使用插件命令
  },
  // 列表
  {
    name: "bulletList",
    title: "\u65E0\u5E8F\u5217\u8868",
    icon: "list",
    command: execCommand("insertUnorderedList"),
    active: isCommandActive("insertUnorderedList")
  },
  {
    name: "orderedList",
    title: "\u6709\u5E8F\u5217\u8868",
    icon: "list-ordered",
    command: execCommand("insertOrderedList"),
    active: isCommandActive("insertOrderedList")
  },
  {
    name: "taskList",
    title: "\u4EFB\u52A1\u5217\u8868",
    icon: "list-checks",
    command: () => {
      const html = '<ul><li><input type="checkbox"> \u4EFB\u52A1\u9879</li></ul>';
      document.execCommand("insertHTML", false, html);
      return true;
    }
  },
  // 缩进
  {
    name: "outdent",
    title: "\u51CF\u5C11\u7F29\u8FDB",
    icon: "indent-decrease",
    command: execCommand("outdent")
  },
  {
    name: "indent",
    title: "\u589E\u52A0\u7F29\u8FDB",
    icon: "indent-increase",
    command: execCommand("indent")
  },
  // 对齐（下拉）
  {
    name: "align",
    title: "\u5BF9\u9F50\u65B9\u5F0F",
    icon: "align-left",
    // 由 Toolbar.ts 以下拉方式处理
    command: () => true
  },
  // 插入
  {
    name: "emoji",
    title: "\u63D2\u5165\u8868\u60C5",
    icon: "emoji",
    command: "insertEmoji"
    // 使用命令名称，由EmojiPlugin处理
  },
  {
    name: "link",
    title: "\u63D2\u5165\u94FE\u63A5",
    icon: "link",
    command: () => {
      const url = prompt("\u8BF7\u8F93\u5165\u94FE\u63A5\u5730\u5740:");
      if (url)
        document.execCommand("createLink", false, url);
      return true;
    }
  },
  {
    name: "unlink",
    title: "\u79FB\u9664\u94FE\u63A5",
    icon: "unlink",
    command: execCommand("unlink")
  },
  {
    name: "image",
    title: "\u63D2\u5165\u56FE\u7247",
    icon: "image",
    command: "insertImage"
    // 使用命令名称，由MediaDialogPlugin处理
  },
  {
    name: "video",
    title: "\u63D2\u5165\u89C6\u9891",
    icon: "video",
    command: "insertVideo"
    // 使用命令名称，由MediaDialogPlugin处理
  },
  {
    name: "audio",
    title: "\u63D2\u5165\u97F3\u9891",
    icon: "audio",
    command: "insertAudio"
    // 使用命令名称，由MediaDialogPlugin处理
  },
  {
    name: "file",
    title: "\u63D2\u5165\u6587\u4EF6",
    icon: "file",
    command: () => {
      const input = document.createElement("input");
      input.type = "file";
      input.onchange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const fileUrl = URL.createObjectURL(file);
          const fileSize = (file.size / 1024).toFixed(2);
          const fileHtml = `
            <a href="${fileUrl}" download="${file.name}" style="display: inline-flex; align-items: center; padding: 8px 12px; background: #f3f4f6; border-radius: 6px; text-decoration: none; color: #374151;">
              <svg style="margin-right: 8px; width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <span>${file.name}</span>
              <span style="margin-left: 8px; color: #6b7280; font-size: 0.875em;">(${fileSize} KB)</span>
            </a>
          `;
          document.execCommand("insertHTML", false, fileHtml);
        }
      };
      input.click();
      return true;
    }
  },
  {
    name: "table",
    title: "\u63D2\u5165\u8868\u683C",
    icon: "table",
    command: "insertTable"
    // 使用命令名称，由 TablePlugin 处理
  },
  {
    name: "horizontalRule",
    title: "\u6C34\u5E73\u7EBF",
    icon: "minus",
    command: execCommand("insertHorizontalRule")
  },
  // 字体
  {
    name: "fontSize",
    title: "\u5B57\u4F53\u5927\u5C0F",
    icon: "type",
    command: () => true
    // 由 Toolbar.ts 特殊处理
  },
  {
    name: "fontFamily",
    title: "\u5B57\u4F53",
    icon: "a-large-small",
    command: () => true
    // 由 Toolbar.ts 特殊处理
  },
  // 颜色
  {
    name: "textColor",
    title: "\u6587\u5B57\u989C\u8272",
    icon: "palette",
    command: () => {
      const color = prompt("\u8BF7\u8F93\u5165\u989C\u8272\u503C (\u5982: #ff0000 \u6216 red):");
      if (color)
        document.execCommand("foreColor", false, color);
      return true;
    }
  },
  {
    name: "backgroundColor",
    title: "\u80CC\u666F\u989C\u8272",
    icon: "paint-bucket",
    command: () => {
      const color = prompt("\u8BF7\u8F93\u5165\u989C\u8272\u503C (\u5982: #ffff00 \u6216 yellow):");
      if (color)
        document.execCommand("hiliteColor", false, color);
      return true;
    }
  },
  // 清除格式
  {
    name: "removeFormat",
    title: "\u6E05\u9664\u683C\u5F0F",
    icon: "eraser",
    command: execCommand("removeFormat")
  },
  // 全屏
  {
    name: "fullscreen",
    title: "\u5168\u5C4F",
    icon: "maximize",
    command: () => {
      const editor = document.querySelector(".ldesign-editor");
      if (editor) {
        editor.classList.toggle("fullscreen");
        if (!document.getElementById("fullscreen-style")) {
          const style = document.createElement("style");
          style.id = "fullscreen-style";
          style.textContent = `
            .ldesign-editor.fullscreen {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              width: 100% !important;
              height: 100% !important;
              z-index: 9999 !important;
              background: white !important;
            }
            .ldesign-editor.fullscreen .ldesign-editor-content {
              height: calc(100vh - 60px) !important;
              overflow-y: auto !important;
            }
          `;
          document.head.appendChild(style);
        }
      }
      return true;
    }
  },
  // 查找替换
  {
    name: "search",
    title: "\u67E5\u627E",
    icon: "search",
    command: () => {
      console.log("[Search] Button clicked, showing find dialog");
      if (window.openFindDialog) {
        window.openFindDialog();
      } else {
        Promise.resolve().then(function () { return require('../plugins/utils/find-replace.cjs'); }).then((module) => {
          if (module.showFindReplaceDialog) {
            console.log("[Search] Calling showFindReplaceDialog");
            module.showFindReplaceDialog(window.editor);
          }
        }).catch((err) => {
          console.error("[Search] Failed to load find-replace module:", err);
          const text = prompt("\u67E5\u627E\u5185\u5BB9:");
          if (text && window.find)
            window.find(text);
        });
      }
      return true;
    }
  },
  // AI 功能下拉菜单
  {
    name: "ai",
    title: "AI \u52A9\u624B",
    icon: "sparkles",
    command: () => true
    // 由 Toolbar.ts 以下拉方式处理
  },
  // 字数统计
  {
    name: "wordCount",
    title: "\u5B57\u6570\u7EDF\u8BA1",
    icon: "file-text",
    command: () => {
      const editorContent = document.querySelector(".ldesign-editor-content");
      if (!editorContent)
        return false;
      const text = editorContent.textContent || "";
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const characters = text.length;
      const charactersNoSpaces = text.replace(/\s/g, "").length;
      const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim()).length;
      const lines = text.split("\n").length;
      const overlay = document.createElement("div");
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
        z-index: 10000;
      `;
      const dialog = document.createElement("div");
      dialog.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 24px;
        min-width: 300px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      `;
      dialog.innerHTML = `
        <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          \u5B57\u6570\u7EDF\u8BA1
        </h3>
        <div style="line-height: 1.8;">
          <div><strong>\u5B57\u6570\uFF1A</strong> ${words}</div>
          <div><strong>\u5B57\u7B26\uFF08\u542B\u7A7A\u683C\uFF09\uFF1A</strong> ${characters}</div>
          <div><strong>\u5B57\u7B26\uFF08\u4E0D\u542B\u7A7A\u683C\uFF09\uFF1A</strong> ${charactersNoSpaces}</div>
          <div><strong>\u6BB5\u843D\u6570\uFF1A</strong> ${paragraphs}</div>
          <div><strong>\u884C\u6570\uFF1A</strong> ${lines}</div>
        </div>
        <button style="
          margin-top: 20px;
          padding: 8px 16px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          width: 100%;
        " onclick="this.closest('div').parentElement.remove()">\u5173\u95ED</button>
      `;
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay)
          overlay.remove();
      });
      return true;
    }
  }
];

exports.DEFAULT_TOOLBAR_ITEMS = DEFAULT_TOOLBAR_ITEMS;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=defaultToolbar.cjs.map
