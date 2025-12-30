/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var blockquote = require('./blockquote.cjs');
var heading = require('./heading.cjs');
var link = require('./link.cjs');
var linkPreview = require('./link-preview.cjs');
var list = require('./list.cjs');

const textPlugins = [heading.HeadingPlugin, blockquote.BlockquotePlugin, list.BulletListPlugin, list.OrderedListPlugin, list.TaskListPlugin, link.LinkPlugin, linkPreview.LinkPreviewPlugin];

exports.BlockquotePlugin = blockquote.BlockquotePlugin;
exports.HeadingPlugin = heading.HeadingPlugin;
exports.LinkPlugin = link.LinkPlugin;
exports.LinkPreviewPlugin = linkPreview.LinkPreviewPlugin;
exports.BulletListPlugin = list.BulletListPlugin;
exports.OrderedListPlugin = list.OrderedListPlugin;
exports.TaskListPlugin = list.TaskListPlugin;
exports.textPlugins = textPlugins;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
