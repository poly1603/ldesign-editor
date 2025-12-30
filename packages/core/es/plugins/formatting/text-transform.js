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

const toUpperCase = (state, dispatch) => {
  if (!dispatch)
    return true;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return false;
  const range = selection.getRangeAt(0);
  const selectedText = range.toString();
  if (!selectedText)
    return false;
  const upperText = selectedText.toUpperCase();
  range.deleteContents();
  range.insertNode(document.createTextNode(upperText));
  setTimeout(() => {
    const editorContent = document.querySelector(".ldesign-editor-content");
    if (editorContent) {
      const event = new Event("input", {
        bubbles: true,
        cancelable: true
      });
      editorContent.dispatchEvent(event);
    }
  }, 0);
  return true;
};
const toLowerCase = (state, dispatch) => {
  if (!dispatch)
    return true;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return false;
  const range = selection.getRangeAt(0);
  const selectedText = range.toString();
  if (!selectedText)
    return false;
  const lowerText = selectedText.toLowerCase();
  range.deleteContents();
  range.insertNode(document.createTextNode(lowerText));
  setTimeout(() => {
    const editorContent = document.querySelector(".ldesign-editor-content");
    if (editorContent) {
      const event = new Event("input", {
        bubbles: true,
        cancelable: true
      });
      editorContent.dispatchEvent(event);
    }
  }, 0);
  return true;
};
const toCapitalize = (state, dispatch) => {
  if (!dispatch)
    return true;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return false;
  const range = selection.getRangeAt(0);
  const selectedText = range.toString();
  if (!selectedText)
    return false;
  const capitalizedText = selectedText.split(/\s+/).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
  range.deleteContents();
  range.insertNode(document.createTextNode(capitalizedText));
  setTimeout(() => {
    const editorContent = document.querySelector(".ldesign-editor-content");
    if (editorContent) {
      const event = new Event("input", {
        bubbles: true,
        cancelable: true
      });
      editorContent.dispatchEvent(event);
    }
  }, 0);
  return true;
};
const toSentenceCase = (state, dispatch) => {
  if (!dispatch)
    return true;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return false;
  const range = selection.getRangeAt(0);
  const selectedText = range.toString();
  if (!selectedText)
    return false;
  const sentenceText = selectedText.charAt(0).toUpperCase() + selectedText.slice(1).toLowerCase();
  range.deleteContents();
  range.insertNode(document.createTextNode(sentenceText));
  setTimeout(() => {
    const editorContent = document.querySelector(".ldesign-editor-content");
    if (editorContent) {
      const event = new Event("input", {
        bubbles: true,
        cancelable: true
      });
      editorContent.dispatchEvent(event);
    }
  }, 0);
  return true;
};
const toHalfWidth = (state, dispatch) => {
  if (!dispatch)
    return true;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return false;
  const range = selection.getRangeAt(0);
  const selectedText = range.toString();
  if (!selectedText)
    return false;
  const halfWidthText = selectedText.replace(/[\uFF01-\uFF5E]/g, (ch) => {
    return String.fromCharCode(ch.charCodeAt(0) - 65248);
  }).replace(/\u3000/g, " ");
  range.deleteContents();
  range.insertNode(document.createTextNode(halfWidthText));
  setTimeout(() => {
    const editorContent = document.querySelector(".ldesign-editor-content");
    if (editorContent) {
      const event = new Event("input", {
        bubbles: true,
        cancelable: true
      });
      editorContent.dispatchEvent(event);
    }
  }, 0);
  return true;
};
const toFullWidth = (state, dispatch) => {
  if (!dispatch)
    return true;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return false;
  const range = selection.getRangeAt(0);
  const selectedText = range.toString();
  if (!selectedText)
    return false;
  const fullWidthText = selectedText.replace(/[\x21-\x7E]/g, (ch) => {
    return String.fromCharCode(ch.charCodeAt(0) + 65248);
  }).replace(/ /g, "\u3000");
  range.deleteContents();
  range.insertNode(document.createTextNode(fullWidthText));
  setTimeout(() => {
    const editorContent = document.querySelector(".ldesign-editor-content");
    if (editorContent) {
      const event = new Event("input", {
        bubbles: true,
        cancelable: true
      });
      editorContent.dispatchEvent(event);
    }
  }, 0);
  return true;
};
const TextTransformPlugin = createPlugin({
  name: "textTransform",
  commands: {
    toUpperCase,
    toLowerCase,
    toCapitalize,
    toSentenceCase,
    toHalfWidth,
    toFullWidth
  },
  toolbar: [{
    name: "textTransform",
    title: "\u6587\u672C\u8F6C\u6362",
    icon: "text",
    command: (state, dispatch) => {
      return true;
    }
  }]
});
const UpperCasePlugin = createPlugin({
  name: "upperCase",
  commands: {
    toUpperCase
  },
  toolbar: [{
    name: "upperCase",
    title: "\u8F6C\u5927\u5199",
    icon: "text",
    command: toUpperCase
  }]
});
const LowerCasePlugin = createPlugin({
  name: "lowerCase",
  commands: {
    toLowerCase
  },
  toolbar: [{
    name: "lowerCase",
    title: "\u8F6C\u5C0F\u5199",
    icon: "text",
    command: toLowerCase
  }]
});
const CapitalizePlugin = createPlugin({
  name: "capitalize",
  commands: {
    toCapitalize
  },
  toolbar: [{
    name: "capitalize",
    title: "\u9996\u5B57\u6BCD\u5927\u5199",
    icon: "text",
    command: toCapitalize
  }]
});

export { CapitalizePlugin, LowerCasePlugin, TextTransformPlugin, UpperCasePlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=text-transform.js.map
