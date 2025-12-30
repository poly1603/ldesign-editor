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

const toggleBlockquote = (state, dispatch) => {
  if (!dispatch)
    return true;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return false;
  let node = selection.anchorNode;
  while (node && node !== document.body) {
    if (node.nodeName === "BLOCKQUOTE") {
      break;
    }
    node = node.parentNode;
  }
  return true;
};
function isBlockquoteActive() {
  return () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
      return false;
    let node = selection.anchorNode;
    while (node && node !== document.body) {
      if (node.nodeName === "BLOCKQUOTE")
        return true;
      node = node.parentNode;
    }
    return false;
  };
}
const BlockquotePlugin = createPlugin({
  name: "blockquote",
  commands: {
    toggleBlockquote
  },
  keys: {
    "Mod-Shift-B": toggleBlockquote
  },
  toolbar: [{
    name: "blockquote",
    title: "\u5F15\u7528",
    icon: "quote",
    command: toggleBlockquote,
    active: isBlockquoteActive()
  }]
});

export { BlockquotePlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=blockquote.js.map
