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

var table = require('./table.cjs');
var tableEnhanced = require('./table-enhanced.cjs');
var tableToolbar = require('./table-toolbar.cjs');
var tablePatch = require('./table-patch.cjs');

const tablePlugins = ["TablePlugin", "EnhancedTablePlugin", "TableToolbarPlugin"];

exports.TablePlugin = table.TablePlugin;
exports.EnhancedTablePlugin = tableEnhanced.EnhancedTablePlugin;
exports.TableToolbarPlugin = tableToolbar.TableToolbarPlugin;
exports.patchTableInsertCommand = tablePatch.patchTableInsertCommand;
exports.tablePlugins = tablePlugins;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
