/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { BlockquotePlugin } from './blockquote.js';
import { HeadingPlugin } from './heading.js';
import { LinkPlugin } from './link.js';
import { LinkPreviewPlugin } from './link-preview.js';
import { BulletListPlugin, OrderedListPlugin, TaskListPlugin } from './list.js';

const textPlugins = [HeadingPlugin, BlockquotePlugin, BulletListPlugin, OrderedListPlugin, TaskListPlugin, LinkPlugin, LinkPreviewPlugin];

export { BlockquotePlugin, BulletListPlugin, HeadingPlugin, LinkPlugin, LinkPreviewPlugin, OrderedListPlugin, TaskListPlugin, textPlugins };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
