/**
 * Context Menu Plugin - Right-click menu functionality
 */
import type { Plugin } from '../../types';
export declare const ContextMenuPlugin: Plugin;
declare global {
    interface Window {
        Toast?: {
            show: (message: string, type: string) => void;
        };
    }
}
export default ContextMenuPlugin;
