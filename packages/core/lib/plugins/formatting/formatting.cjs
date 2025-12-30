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

var Plugin = require('../../core/Plugin.cjs');

function toggleMarkCommand(markType) {
  return (state, dispatch) => {
    if (!dispatch)
      return true;
    document.execCommand(markType, false);
    return true;
  };
}
function isMarkActive(markType) {
  return () => {
    return document.queryCommandState(markType);
  };
}
const BoldPlugin = Plugin.createPlugin({
  name: "bold",
  commands: {
    toggleBold: toggleMarkCommand("bold")
  },
  keys: {
    "Mod-B": toggleMarkCommand("bold")
  },
  toolbar: [{
    name: "bold",
    title: "\u7C97\u4F53",
    icon: "bold",
    command: toggleMarkCommand("bold"),
    active: isMarkActive("bold")
  }]
});
const ItalicPlugin = Plugin.createPlugin({
  name: "italic",
  commands: {
    toggleItalic: toggleMarkCommand("italic")
  },
  keys: {
    "Mod-I": toggleMarkCommand("italic")
  },
  toolbar: [{
    name: "italic",
    title: "\u659C\u4F53",
    icon: "italic",
    command: toggleMarkCommand("italic"),
    active: isMarkActive("italic")
  }]
});
const UnderlinePlugin = Plugin.createPlugin({
  name: "underline",
  commands: {
    toggleUnderline: toggleMarkCommand("underline")
  },
  keys: {
    "Mod-U": toggleMarkCommand("underline")
  },
  toolbar: [{
    name: "underline",
    title: "\u4E0B\u5212\u7EBF",
    icon: "underline",
    command: toggleMarkCommand("underline"),
    active: isMarkActive("underline")
  }]
});
const StrikePlugin = Plugin.createPlugin({
  name: "strike",
  commands: {
    toggleStrike: toggleMarkCommand("strikeThrough")
  },
  keys: {
    "Mod-Shift-X": toggleMarkCommand("strikeThrough")
  },
  toolbar: [{
    name: "strike",
    title: "\u5220\u9664\u7EBF",
    icon: "strikethrough",
    command: toggleMarkCommand("strikeThrough"),
    active: isMarkActive("strikeThrough")
  }]
});
const InlineCodePlugin = Plugin.createPlugin({
  name: "inlineCode",
  commands: {
    toggleInlineCode: (state, dispatch) => {
      if (!dispatch)
        return true;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0)
        return false;
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (selectedText) {
        const parent = range.commonAncestorContainer.parentElement;
        if (parent && parent.tagName === "CODE") {
          const textNode = document.createTextNode(selectedText);
          parent.parentNode?.replaceChild(textNode, parent);
        } else {
          const code = document.createElement("code");
          code.style.cssText = `
            padding: 2px 4px;
            margin: 0 2px;
            background-color: rgba(135, 131, 120, 0.15);
            border-radius: 3px;
            font-size: 85%;
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
          `;
          code.textContent = selectedText;
          range.deleteContents();
          range.insertNode(code);
          const newRange = document.createRange();
          newRange.setStartAfter(code);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
      return true;
    }
  },
  keys: {
    "Mod-`": (state, dispatch) => {
      if (!dispatch)
        return true;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0)
        return false;
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (selectedText) {
        const parent = range.commonAncestorContainer.parentElement;
        if (parent && parent.tagName === "CODE") {
          const textNode = document.createTextNode(selectedText);
          parent.parentNode?.replaceChild(textNode, parent);
        } else {
          document.execCommand("insertHTML", false, `<code style="padding: 2px 4px; margin: 0 2px; background-color: rgba(135, 131, 120, 0.15); border-radius: 3px; font-size: 85%; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;">${selectedText}</code>`);
        }
      }
      return true;
    }
  },
  toolbar: [{
    name: "inlineCode",
    title: "\u884C\u5185\u4EE3\u7801 (Ctrl+`)",
    icon: "code",
    command: (state, dispatch) => {
      if (!dispatch)
        return true;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0)
        return false;
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (selectedText) {
        const parent = range.commonAncestorContainer.parentElement;
        if (parent && parent.tagName === "CODE") {
          const textNode = document.createTextNode(selectedText);
          parent.parentNode?.replaceChild(textNode, parent);
        } else {
          document.execCommand("insertHTML", false, `<code style="padding: 2px 4px; margin: 0 2px; background-color: rgba(135, 131, 120, 0.15); border-radius: 3px; font-size: 85%; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;">${selectedText}</code>`);
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
  }]
});
const CodePlugin = InlineCodePlugin;
const ClearFormatPlugin = Plugin.createPlugin({
  name: "clearFormat",
  commands: {
    clearFormat: (state, dispatch) => {
      if (!dispatch)
        return true;
      document.execCommand("removeFormat", false);
      return true;
    }
  },
  keys: {
    "Mod-\\": (state, dispatch) => {
      if (!dispatch)
        return true;
      document.execCommand("removeFormat", false);
      return true;
    }
  },
  toolbar: [{
    name: "clearFormat",
    title: "\u6E05\u9664\u683C\u5F0F",
    icon: "eraser",
    command: (state, dispatch) => {
      if (!dispatch)
        return true;
      document.execCommand("removeFormat", false);
      return true;
    }
  }]
});

exports.BoldPlugin = BoldPlugin;
exports.ClearFormatPlugin = ClearFormatPlugin;
exports.CodePlugin = CodePlugin;
exports.InlineCodePlugin = InlineCodePlugin;
exports.ItalicPlugin = ItalicPlugin;
exports.StrikePlugin = StrikePlugin;
exports.UnderlinePlugin = UnderlinePlugin;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=formatting.cjs.map
