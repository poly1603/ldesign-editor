/**
 * 格式化相关插件导出
 */

export * from './align'
export * from './color'
export * from './font'
// 重新导出所有插件
export * from './formatting'
export { default as FormattingCommandsPlugin } from './formatting-commands'
export * from './indent'
export * from './line-height'
export * from './script'

// Export all formatting plugins as array
export const formattingPlugins = []

export * from './text-transform'
