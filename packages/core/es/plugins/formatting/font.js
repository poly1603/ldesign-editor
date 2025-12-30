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

const FONT_SIZES = [{
  label: "12px",
  value: "12px"
}, {
  label: "14px",
  value: "14px"
}, {
  label: "16px",
  value: "16px"
}, {
  label: "18px",
  value: "18px"
}, {
  label: "20px",
  value: "20px"
}, {
  label: "24px",
  value: "24px"
}, {
  label: "28px",
  value: "28px"
}, {
  label: "32px",
  value: "32px"
}, {
  label: "36px",
  value: "36px"
}, {
  label: "48px",
  value: "48px"
}, {
  label: "72px",
  value: "72px"
}];
const FONT_FAMILIES = [{
  label: "\u9ED8\u8BA4",
  value: "inherit"
}, {
  label: "\u5B8B\u4F53",
  value: "SimSun, serif"
}, {
  label: "\u9ED1\u4F53",
  value: "SimHei, sans-serif"
}, {
  label: "\u5FAE\u8F6F\u96C5\u9ED1",
  value: "Microsoft YaHei, sans-serif"
}, {
  label: "\u6977\u4F53",
  value: "KaiTi, serif"
}, {
  label: "Arial",
  value: "Arial, sans-serif"
}, {
  label: "Times New Roman",
  value: "Times New Roman, serif"
}, {
  label: "Courier New",
  value: "Courier New, monospace"
}, {
  label: "Georgia",
  value: "Georgia, serif"
}, {
  label: "Verdana",
  value: "Verdana, sans-serif"
}];
function setFontSize(size) {
  return (state, dispatch) => {
    console.log("\u{1F3A8} [FontSize] Command called with size:", size);
    if (!dispatch) {
      console.log("\u274C [FontSize] No dispatch");
      return true;
    }
    const selection = window.getSelection();
    console.log("\u{1F3A8} [FontSize] Selection:", selection);
    if (!selection || selection.rangeCount === 0) {
      console.log("\u274C [FontSize] No selection or range");
      return false;
    }
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    console.log("\u{1F3A8} [FontSize] Selected text:", `"${selectedText}"`);
    if (!selectedText) {
      console.log("\u{1F4DD} [FontSize] No text selected, inserting sample");
      const span2 = document.createElement("span");
      span2.style.fontSize = size;
      span2.textContent = "Text";
      range.insertNode(span2);
      console.log("\u2705 [FontSize] Sample span inserted:", span2);
      const newRange = document.createRange();
      newRange.selectNodeContents(span2);
      selection.removeAllRanges();
      selection.addRange(newRange);
      console.log("\u2705 [FontSize] Sample text selected");
      return true;
    }
    console.log("\u{1F4DD} [FontSize] Applying font size to selected text");
    const span = document.createElement("span");
    span.style.fontSize = size;
    span.textContent = selectedText;
    console.log("\u{1F3A8} [FontSize] Created span:", span);
    range.deleteContents();
    console.log("\u{1F5D1}\uFE0F [FontSize] Deleted selection");
    range.insertNode(span);
    console.log("\u2705 [FontSize] Span inserted:", span);
    range.setStartAfter(span);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    console.log("\u2705 [FontSize] Cursor moved after span");
    setTimeout(() => {
      const editorContent = document.querySelector(".ldesign-editor-content");
      if (editorContent) {
        const event = new Event("input", {
          bubbles: true,
          cancelable: true
        });
        editorContent.dispatchEvent(event);
        console.log("\u2705 [FontSize] Input event dispatched");
      }
    }, 0);
    console.log("\u2705 [FontSize] Command completed successfully");
    return true;
  };
}
function setFontFamily(family) {
  return (state, dispatch) => {
    console.log("\u{1F3A8} [FontFamily] Command called with family:", family);
    if (!dispatch) {
      console.log("\u274C [FontFamily] No dispatch");
      return true;
    }
    const selection = window.getSelection();
    console.log("\u{1F3A8} [FontFamily] Selection:", selection);
    if (!selection || selection.rangeCount === 0) {
      console.log("\u274C [FontFamily] No selection or range");
      return false;
    }
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    console.log("\u{1F3A8} [FontFamily] Selected text:", `"${selectedText}"`);
    if (!selectedText) {
      console.log("\u{1F4DD} [FontFamily] No text selected, inserting sample");
      const span2 = document.createElement("span");
      span2.style.fontFamily = family;
      span2.textContent = "Text";
      range.insertNode(span2);
      console.log("\u2705 [FontFamily] Sample span inserted:", span2);
      const newRange = document.createRange();
      newRange.selectNodeContents(span2);
      selection.removeAllRanges();
      selection.addRange(newRange);
      console.log("\u2705 [FontFamily] Sample text selected");
      return true;
    }
    console.log("\u{1F4DD} [FontFamily] Applying font family to selected text");
    const span = document.createElement("span");
    span.style.fontFamily = family;
    span.textContent = selectedText;
    console.log("\u{1F3A8} [FontFamily] Created span:", span);
    range.deleteContents();
    console.log("\u{1F5D1}\uFE0F [FontFamily] Deleted selection");
    range.insertNode(span);
    console.log("\u2705 [FontFamily] Span inserted:", span);
    range.setStartAfter(span);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    console.log("\u2705 [FontFamily] Cursor moved after span");
    setTimeout(() => {
      const editorContent = document.querySelector(".ldesign-editor-content");
      if (editorContent) {
        const event = new Event("input", {
          bubbles: true,
          cancelable: true
        });
        editorContent.dispatchEvent(event);
        console.log("\u2705 [FontFamily] Input event dispatched");
      }
    }, 0);
    console.log("\u2705 [FontFamily] Command completed successfully");
    return true;
  };
}
const FontSizePlugin = createPlugin({
  name: "fontSize",
  commands: {
    setFontSize: (state, dispatch, size) => {
      return setFontSize(size)(state, dispatch);
    }
  },
  toolbar: [{
    name: "fontSize",
    title: "\u5B57\u4F53\u5927\u5C0F",
    icon: "type",
    command: (state, dispatch) => {
      return true;
    }
  }]
});
const FontFamilyPlugin = createPlugin({
  name: "fontFamily",
  commands: {
    setFontFamily: (state, dispatch, family) => {
      return setFontFamily(family)(state, dispatch);
    }
  },
  toolbar: [{
    name: "fontFamily",
    title: "\u5B57\u4F53",
    icon: "type",
    command: (state, dispatch) => {
      return true;
    }
  }]
});

export { FONT_FAMILIES, FONT_SIZES, FontFamilyPlugin, FontSizePlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=font.js.map
