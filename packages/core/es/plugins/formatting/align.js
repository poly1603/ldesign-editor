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

function setAlign(align) {
  return (state, dispatch) => {
    if (!dispatch)
      return true;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
      return false;
    let node = selection.anchorNode;
    let block = null;
    while (node && node !== document.body) {
      if (node instanceof HTMLElement && getComputedStyle(node).display === "block") {
        block = node;
        break;
      }
      node = node.parentNode;
    }
    if (block) {
      block.style.textAlign = align;
      return true;
    }
    return false;
  };
}
function isAlignActive(align) {
  return () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
      return false;
    let node = selection.anchorNode;
    let block = null;
    while (node && node !== document.body) {
      if (node instanceof HTMLElement && getComputedStyle(node).display === "block") {
        block = node;
        break;
      }
      node = node.parentNode;
    }
    return block?.style.textAlign === align;
  };
}
const AlignPlugin = createPlugin({
  name: "align",
  commands: {
    alignLeft: setAlign("left"),
    alignCenter: setAlign("center"),
    alignRight: setAlign("right"),
    alignJustify: setAlign("justify")
  },
  keys: {
    "Mod-Shift-L": setAlign("left"),
    "Mod-Shift-E": setAlign("center"),
    "Mod-Shift-R": setAlign("right"),
    "Mod-Shift-J": setAlign("justify")
  },
  toolbar: [{
    name: "alignLeft",
    title: "\u5DE6\u5BF9\u9F50",
    icon: "align-left",
    command: setAlign("left"),
    active: isAlignActive("left")
  }, {
    name: "alignCenter",
    title: "\u5C45\u4E2D",
    icon: "align-center",
    command: setAlign("center"),
    active: isAlignActive("center")
  }, {
    name: "alignRight",
    title: "\u53F3\u5BF9\u9F50",
    icon: "align-right",
    command: setAlign("right"),
    active: isAlignActive("right")
  }, {
    name: "alignJustify",
    title: "\u4E24\u7AEF\u5BF9\u9F50",
    icon: "align-justify",
    command: setAlign("justify"),
    active: isAlignActive("justify")
  }]
});

export { AlignPlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=align.js.map
