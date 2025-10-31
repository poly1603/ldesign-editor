/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createLogger } from '../../utils/logger.js';

/**
 * History plugin
 * Provides undo and redo functionality
 *
 * NOTE: The actual History implementation is in src/core/History.ts
 * This plugin just registers the keyboard shortcuts and commands
 */
const logger = createLogger('HistoryPlugin');
const HistoryPlugin = {
    name: 'History',
    install(editor) {
        // Register undo command (uses CommandManager's undo method)
        editor.commands.register('undo', () => {
            return editor.commands.undo();
        });
        // Register redo command (uses CommandManager's redo method)
        editor.commands.register('redo', () => {
            return editor.commands.redo();
        });
        // Add keyboard shortcuts
        if (editor.keymap) {
            editor.keymap.register({
                key: 'Ctrl+Z',
                command: 'undo',
                description: 'Undo',
            });
            editor.keymap.register({
                key: 'Ctrl+Shift+Z',
                command: 'redo',
                description: 'Redo',
            });
            editor.keymap.register({
                key: 'Ctrl+Y',
                command: 'redo',
                description: 'Redo',
            });
        }
        logger.debug('Installed - using CommandManager History');
    },
};

export { HistoryPlugin as default };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=history.js.map
