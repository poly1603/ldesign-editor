/**
 * 编辑器预设配置
 *
 * 提供多种预设插件组合，方便快速创建不同功能级别的编辑器
 *
 * @example
 * ```typescript
 * import { Editor } from '@ldesign/editor-core'
 * import { basicPlugins, standardPlugins, fullPlugins } from '@ldesign/editor-core/presets'
 *
 * // 基础编辑器 - 只有基本格式化
 * const basicEditor = new Editor({
 *   element: '#editor',
 *   plugins: basicPlugins,
 * })
 *
 * // 标准编辑器 - 常用功能
 * const standardEditor = new Editor({
 *   element: '#editor',
 *   plugins: standardPlugins,
 * })
 *
 * // 完整功能编辑器
 * const fullEditor = new Editor({
 *   element: '#editor',
 *   plugins: fullPlugins,
 * })
 * ```
 */
import type { Plugin } from '../types';
/**
 * 空预设 - 不加载任何插件
 * 适用于需要完全自定义的场景
 */
export declare const minimalPlugins: Plugin[];
/**
 * 基础预设 - 只包含基本文本格式化
 * 适用于简单的文本输入场景，如评论框
 */
export declare const basicPlugins: Plugin[];
/**
 * 标准预设 - 常用编辑功能
 * 适用于大多数富文本编辑场景
 */
export declare const standardPlugins: Plugin[];
/**
 * 完整预设 - 所有功能
 * 适用于专业文档编辑、CMS 等场景
 */
export declare const fullPlugins: Plugin[];
/**
 * 文档编辑预设 - 专注于文档编辑
 * 适用于知识库、文档系统
 */
export declare const documentPlugins: Plugin[];
/**
 * 博客预设 - 适用于博客写作
 */
export declare const blogPlugins: Plugin[];
/**
 * 创建自定义预设
 * @param base - 基础预设
 * @param additions - 要添加的插件
 * @param removals - 要移除的插件名称
 */
export declare function createPreset(base: Plugin[], additions?: Plugin[], removals?: string[]): Plugin[];
export default standardPlugins;
//# sourceMappingURL=index.d.ts.map