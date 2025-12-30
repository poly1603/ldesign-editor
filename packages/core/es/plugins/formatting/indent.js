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

const indent = (state, dispatch) => {
  if (!dispatch)
    return true;
  document.execCommand("indent", false);
  return true;
};
const outdent = (state, dispatch) => {
  if (!dispatch)
    return true;
  document.execCommand("outdent", false);
  return true;
};
const IndentPlugin = createPlugin({
  name: "indent",
  commands: {
    indent,
    outdent
  },
  keys: {
    "Tab": indent,
    "Shift-Tab": outdent
  },
  toolbar: [{
    name: "indent",
    title: "\u589E\u52A0\u7F29\u8FDB",
    icon: "indent",
    command: indent
  }, {
    name: "outdent",
    title: "\u51CF\u5C11\u7F29\u8FDB",
    icon: "outdent",
    command: outdent
  }]
});

export { IndentPlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=indent.js.map
