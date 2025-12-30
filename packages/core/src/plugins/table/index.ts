/**
 * 表格相关插件导出
 */

export { TablePlugin } from './table'
export { EnhancedTablePlugin } from './table-enhanced'
export { TableToolbarPlugin } from './table-toolbar'
export { patchTableInsertCommand } from './table-patch'

// 批量导出所有表格插件
export const tablePlugins = [
  'TablePlugin',
  'EnhancedTablePlugin',
  'TableToolbarPlugin',
]
