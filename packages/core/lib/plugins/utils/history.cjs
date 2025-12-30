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

var logger$1 = require('../../utils/logger.cjs');

const logger = logger$1.createLogger("HistoryPlugin");
const HistoryPlugin = {
  name: "History",
  install(editor) {
    editor.commands.register("undo", () => {
      return editor.commands.undo();
    });
    editor.commands.register("redo", () => {
      return editor.commands.redo();
    });
    if (editor.keymap) {
      editor.keymap.register({
        key: "Ctrl+Z",
        command: "undo",
        description: "Undo"
      });
      editor.keymap.register({
        key: "Ctrl+Shift+Z",
        command: "redo",
        description: "Redo"
      });
      editor.keymap.register({
        key: "Ctrl+Y",
        command: "redo",
        description: "Redo"
      });
    }
    logger.debug("Installed - using CommandManager History");
  }
};

exports.default = HistoryPlugin;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=history.cjs.map
