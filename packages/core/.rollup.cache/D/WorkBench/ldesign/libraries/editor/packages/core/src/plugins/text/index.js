/**
 * Text-related plugins export
 */
import { BlockquotePlugin } from './blockquote';
// 确保插件被正确导出
import { HeadingPlugin } from './heading';
import { LinkPlugin } from './link';
import { BulletListPlugin, OrderedListPlugin, TaskListPlugin } from './list';
export * from './blockquote';
export * from './heading';
export * from './link';
export * from './list';
// Export all text plugins as array
export const textPlugins = [
    HeadingPlugin,
    BlockquotePlugin,
    BulletListPlugin,
    OrderedListPlugin,
    TaskListPlugin,
    LinkPlugin,
];
//# sourceMappingURL=index.js.map