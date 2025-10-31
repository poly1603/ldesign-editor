/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var blockquote = require('./blockquote.cjs');
var heading = require('./heading.cjs');
var link = require('./link.cjs');
var list = require('./list.cjs');

/**
 * Text-related plugins export
 */
// Export all text plugins as array
const textPlugins = [
    heading.HeadingPlugin,
    blockquote.BlockquotePlugin,
    list.BulletListPlugin,
    list.OrderedListPlugin,
    list.TaskListPlugin,
    link.LinkPlugin,
];

exports.BlockquotePlugin = blockquote.BlockquotePlugin;
exports.HeadingPlugin = heading.HeadingPlugin;
exports.LinkPlugin = link.LinkPlugin;
exports.BulletListPlugin = list.BulletListPlugin;
exports.OrderedListPlugin = list.OrderedListPlugin;
exports.TaskListPlugin = list.TaskListPlugin;
exports.textPlugins = textPlugins;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
