/**
 * 工具函数统一导出
 */

// 颜色处理
export * from './color'
// DOM操作工具（已合并）
export * from './dom' // 主要DOM工具

// DOMUtils exports commented out due to conflicts with ./dom
// export * from './DOMUtils' // 向后兼容
export * from './EditorHelper'

// 编辑器操作工具
export * from './EditorUtils'

// 错误处理 ⭐新增
export * from './error-handler'

// 事件处理 - commented out due to conflicts
// export * from './event'

// 图标工具（向后兼容，实际使用ui/icons）
export * from './icons'

// 日志工具 ⭐新增
export * from './logger'

// 性能优化工具 - commented out due to conflicts
// export * from './performance'

// 位置和坐标 - commented out due to conflicts
// export * from './position'

// 字符串处理工具
export * from './StringUtils'

// 样式常量和工具
export * from './StyleConstants'
