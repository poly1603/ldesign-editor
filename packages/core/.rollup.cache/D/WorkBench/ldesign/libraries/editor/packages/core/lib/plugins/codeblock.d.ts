/**
 * 代码块插件
 */
import type { Plugin } from '../types';
declare global {
    interface Window {
        CodeMirror?: any;
    }
}
/**
 * 代码块插件
 */
export declare const CodeBlockPlugin: Plugin;
