/**
 * 模板插件
 * 提供模板管理和应用功能
 */
import { TemplateManager } from '../template/TemplateManager';
/**
 * 获取或创建模板管理器
 */
declare function getTemplateManager(): TemplateManager;
declare const TemplatePlugin: import("../types").Plugin;
export default TemplatePlugin;
export { getTemplateManager, TemplatePlugin };
