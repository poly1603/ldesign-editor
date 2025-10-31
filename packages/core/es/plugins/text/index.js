/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { BlockquotePlugin } from './blockquote.js';
import { HeadingPlugin } from './heading.js';
import { LinkPlugin } from './link.js';
import { BulletListPlugin, OrderedListPlugin, TaskListPlugin } from './list.js';

/**
 * Text-related plugins export
 */
// Export all text plugins as array
const textPlugins = [
    HeadingPlugin,
    BlockquotePlugin,
    BulletListPlugin,
    OrderedListPlugin,
    TaskListPlugin,
    LinkPlugin,
];

export { BlockquotePlugin, BulletListPlugin, HeadingPlugin, LinkPlugin, OrderedListPlugin, TaskListPlugin, textPlugins };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
