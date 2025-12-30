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

const insertHorizontalRule = (state, dispatch) => {
  if (!dispatch)
    return true;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return false;
  const range = selection.getRangeAt(0);
  const hr = document.createElement("hr");
  range.deleteContents();
  range.insertNode(hr);
  const p = document.createElement("p");
  p.innerHTML = "<br>";
  hr.parentNode?.insertBefore(p, hr.nextSibling);
  const newRange = document.createRange();
  newRange.setStart(p, 0);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);
  return true;
};
const HorizontalRulePlugin = Plugin.createPlugin({
  name: "horizontalRule",
  commands: {
    insertHorizontalRule
  },
  keys: {
    "Mod-Shift--": insertHorizontalRule
  },
  toolbar: [{
    name: "horizontalRule",
    title: "\u6C34\u5E73\u7EBF",
    icon: "minus",
    command: insertHorizontalRule
  }]
});

exports.HorizontalRulePlugin = HorizontalRulePlugin;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
