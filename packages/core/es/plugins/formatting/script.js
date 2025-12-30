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

const superscript = (state, dispatch) => {
  if (!dispatch)
    return true;
  document.execCommand("superscript", false);
  return true;
};
const subscript = (state, dispatch) => {
  if (!dispatch)
    return true;
  document.execCommand("subscript", false);
  return true;
};
function isSuperscriptActive() {
  return () => {
    return document.queryCommandState("superscript");
  };
}
function isSubscriptActive() {
  return () => {
    return document.queryCommandState("subscript");
  };
}
const SuperscriptPlugin = createPlugin({
  name: "superscript",
  commands: {
    toggleSuperscript: superscript
  },
  keys: {
    "Mod-Shift-.": superscript
  },
  toolbar: [{
    name: "superscript",
    title: "\u4E0A\u6807",
    icon: "superscript",
    command: superscript,
    active: isSuperscriptActive()
  }]
});
const SubscriptPlugin = createPlugin({
  name: "subscript",
  commands: {
    toggleSubscript: subscript
  },
  keys: {
    "Mod-Shift-,": subscript
  },
  toolbar: [{
    name: "subscript",
    title: "\u4E0B\u6807",
    icon: "subscript",
    command: subscript,
    active: isSubscriptActive()
  }]
});

export { SubscriptPlugin, SuperscriptPlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=script.js.map
