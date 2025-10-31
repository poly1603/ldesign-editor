/**
 * History plugin
 * Provides undo and redo functionality
 *
 * NOTE: The actual History implementation is in src/core/History.ts
 * This plugin just registers the keyboard shortcuts and commands
 */
import type { Plugin } from '../../types';
declare const HistoryPlugin: Plugin;
export default HistoryPlugin;
