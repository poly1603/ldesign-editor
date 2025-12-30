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

const FormattingCommandsPlugin = {
  name: "FormattingCommands",
  install(editor) {
    editor.commands.register("alignLeft", () => {
      document.execCommand("justifyLeft");
      return true;
    });
    editor.commands.register("alignCenter", () => {
      document.execCommand("justifyCenter");
      return true;
    });
    editor.commands.register("alignRight", () => {
      document.execCommand("justifyRight");
      return true;
    });
    editor.commands.register("alignJustify", () => {
      document.execCommand("justifyFull");
      return true;
    });
    editor.commands.register("setFontSize", (state, dispatch, size) => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const span = document.createElement("span");
        span.style.fontSize = size;
        const range = selection.getRangeAt(0);
        try {
          range.surroundContents(span);
        } catch (e) {
          span.innerHTML = selection.toString();
          range.deleteContents();
          range.insertNode(span);
        }
      }
      return true;
    });
    editor.commands.register("setFontFamily", (state, dispatch, fontFamily) => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const span = document.createElement("span");
        span.style.fontFamily = fontFamily;
        const range = selection.getRangeAt(0);
        try {
          range.surroundContents(span);
        } catch (e) {
          span.innerHTML = selection.toString();
          range.deleteContents();
          range.insertNode(span);
        }
      }
      return true;
    });
    editor.commands.register("setTextColor", (state, dispatch, color) => {
      document.execCommand("foreColor", false, color);
      return true;
    });
    editor.commands.register("setBackgroundColor", (state, dispatch, color) => {
      document.execCommand("hiliteColor", false, color);
      return true;
    });
    editor.commands.register("setLineHeight", (state, dispatch, lineHeight) => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const div = document.createElement("div");
        div.style.lineHeight = lineHeight;
        const range = selection.getRangeAt(0);
        try {
          range.surroundContents(div);
        } catch (e) {
          div.innerHTML = selection.toString();
          range.deleteContents();
          range.insertNode(div);
        }
      }
      return true;
    });
    editor.commands.register("replaceSelection", (state, dispatch, options) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0)
        return false;
      const range = selection.getRangeAt(0);
      if (!editor.contentElement?.contains(range.commonAncestorContainer))
        return false;
      range.deleteContents();
      const textNode = document.createTextNode(options.text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
      editor.handleInput?.();
      return true;
    });
    editor.commands.register("insertText", (state, dispatch, options) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        if (editor.contentElement) {
          editor.contentElement.focus();
          const range2 = document.createRange();
          range2.selectNodeContents(editor.contentElement);
          range2.collapse(false);
          selection?.removeAllRanges();
          selection?.addRange(range2);
        } else {
          return false;
        }
      }
      const range = selection.getRangeAt(0);
      if (!editor.contentElement?.contains(range.commonAncestorContainer))
        return false;
      const textNode = document.createTextNode(options.text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
      editor.handleInput?.();
      return true;
    });
    console.log("[FormattingCommandsPlugin] All formatting commands registered");
  }
};

exports.default = FormattingCommandsPlugin;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=formatting-commands.cjs.map
