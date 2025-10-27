/**
 * 核心类型定义
 * @packageDocumentation
 */

// ============================================================================
// 基础类型
// ============================================================================

/**
 * 节点类型联合类型
 * 定义所有可能的节点类型
 */
export type NodeType = 'doc' | 'paragraph' | 'text' | 'heading' | 'blockquote' |
  'codeBlock' | 'bulletList' | 'orderedList' | 'listItem' | 'taskList' | 'taskItem' |
  'table' | 'tableRow' | 'tableCell' | 'tableHeader' | 'image' | 'horizontalRule'

/**
 * 标记类型联合类型
 * 定义所有可能的文本标记类型
 */
export type MarkType = 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'link' | 'textColor' | 'backgroundColor'

/**
 * 基础属性值类型
 */
export type AttrValue = string | number | boolean | null | undefined | Record<string, unknown>

/**
 * 节点属性接口
 * 使用索引签名允许动态属性，但限制值类型为 AttrValue
 */
export interface NodeAttrs {
  [key: string]: AttrValue
}

/**
 * 文本标记
 * 表示应用于文本的格式化标记
 */
export interface Mark {
  /** 标记类型 */
  type: MarkType
  /** 标记属性（如链接的href，颜色的值等） */
  attrs?: NodeAttrs
}

/**
 * 文档节点
 * 表示文档树中的一个节点
 */
export interface Node {
  /** 节点类型 */
  type: NodeType
  /** 节点属性 */
  attrs?: NodeAttrs
  /** 子节点 */
  content?: Node[]
  /** 文本内容（仅文本节点） */
  text?: string
  /** 应用的标记（仅文本节点） */
  marks?: Mark[]
}

/**
 * 位置信息
 * 表示文档中的一个具体位置
 */
export interface Position {
  /** 所在节点 */
  node: Node
  /** 节点内偏移量 */
  offset: number
  /** 节点路径 */
  path: number[]
}

/**
 * 范围
 * 表示文档中的一个范围（起始和结束位置）
 */
export interface Range {
  /** 起始位置 */
  from: number
  /** 结束位置 */
  to: number
}

/**
 * 选区
 * 表示当前的文本选择范围
 */
export interface Selection {
  /** 锚点位置 */
  anchor: number
  /** 头部位置 */
  head: number
  /** 是否为空选区 */
  empty: boolean
  /** 将选区转换为JSON */
  toJSON?: () => { anchor: number; head: number }
}

/**
 * 编辑器状态元数据
 */
export interface StateMetadata {
  /** 时间戳 */
  timestamp?: number
  /** 用户ID（协作编辑） */
  userId?: string
  /** 其他自定义元数据 */
  [key: string]: unknown
}

/**
 * 编辑器状态
 * 表示编辑器的完整状态
 */
export interface EditorState {
  /** 文档内容 */
  doc: Node
  /** 当前选区 */
  selection: Selection
  /** 状态元数据 */
  meta?: StateMetadata
}

// ============================================================================
// 命令和事务
// ============================================================================

/**
 * 命令函数类型
 * 命令可以修改编辑器状态
 * @param state - 当前编辑器状态
 * @param dispatch - 分发事务的函数
 * @param editor - 编辑器实例（可选）
 * @returns 如果命令成功执行返回true，否则返回false
 */
export type Command = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
  editor?: EditorInstance
) => boolean

/**
 * 事务元数据类型
 */
export type TransactionMeta = Map<string, unknown>

/**
 * 事务
 * 表示对文档的一系列变更
 */
export interface Transaction {
  /** 变更后的文档 */
  doc: Node
  /** 变更后的选区 */
  selection?: Selection
  /** 应用的变换步骤 */
  steps: TransformStep[]
  /** 事务元数据 */
  meta: TransactionMeta
}

/**
 * 变换步骤类型
 */
export type TransformStepType = 'replace' | 'addMark' | 'removeMark' | 'setAttrs'

/**
 * 文档切片（用于替换操作）
 */
export interface DocumentSlice {
  content: Node[]
  openStart: number
  openEnd: number
}

/**
 * 变换步骤
 * 表示对文档的单个原子变更
 */
export interface TransformStep {
  /** 步骤类型 */
  type: TransformStepType
  /** 起始位置 */
  from?: number
  /** 结束位置 */
  to?: number
  /** 替换的内容切片 */
  slice?: DocumentSlice
  /** 添加/删除的标记 */
  mark?: Mark
  /** 设置的属性 */
  attrs?: NodeAttrs
}

// ============================================================================
// Schema 定义
// ============================================================================

/**
 * Schema 规范
 * 定义文档的结构规则
 */
export interface SchemaSpec {
  /** 节点规范 */
  nodes?: Record<string, NodeSpec>
  /** 标记规范 */
  marks?: Record<string, MarkSpec>
}

/**
 * DOM 输出规范
 * 定义如何将节点/标记渲染为DOM
 */
export type DOMOutputSpec =
  | string
  | [string, NodeAttrs?, ...DOMOutputSpec[]]
  | { dom: HTMLElement }

/**
 * 属性规范
 * 定义属性的默认值和验证规则
 */
export interface AttrSpec {
  /** 默认值 */
  default?: AttrValue
  /** 验证函数 */
  validate?: (value: AttrValue) => boolean
}

/**
 * 解析规则
 * 定义如何从DOM解析节点/标记
 */
export interface ParseRule {
  /** 匹配的HTML标签 */
  tag?: string
  /** 匹配的CSS样式 */
  style?: string
  /** 静态属性或属性提取函数 */
  attrs?: NodeAttrs | ((dom: HTMLElement) => NodeAttrs | null)
  /** 从DOM元素提取属性 */
  getAttrs?: (dom: HTMLElement) => NodeAttrs | null
}

/**
 * 节点规范
 * 定义节点类型的结构和行为
 */
export interface NodeSpec {
  /** 内容表达式 */
  content?: string
  /** 允许的标记 */
  marks?: string
  /** 节点组 */
  group?: string
  /** 是否为行内节点 */
  inline?: boolean
  /** 是否为原子节点（不可拆分） */
  atom?: boolean
  /** 属性规范 */
  attrs?: Record<string, AttrSpec>
  /** DOM解析规则 */
  parseDOM?: ParseRule[]
  /** 转换为DOM的函数 */
  toDOM?: (node: Node) => DOMOutputSpec
}

/**
 * 标记规范
 * 定义标记类型的结构和行为
 */
export interface MarkSpec {
  /** 属性规范 */
  attrs?: Record<string, AttrSpec>
  /** 是否包含性标记 */
  inclusive?: boolean
  /** 互斥的标记 */
  excludes?: string
  /** DOM解析规则 */
  parseDOM?: ParseRule[]
  /** 转换为DOM的函数 */
  toDOM?: (mark: Mark, inline: boolean) => DOMOutputSpec
}

// ============================================================================
// 插件系统
// ============================================================================

/**
 * 插件配置
 * 定义插件的配置选项
 */
export interface PluginConfig {
  /** 插件名称 */
  name: string
  /** 命令映射 */
  commands?: Record<string, Command>
  /** 快捷键映射 */
  keys?: Record<string, Command>
  /** Schema扩展 */
  schema?: SchemaSpec
  /** 工具栏项 */
  toolbar?: ToolbarItem[]
  /** 初始化钩子 */
  init?: (editor: EditorInstance) => void | Promise<void>
  /** 销毁钩子 */
  destroy?: () => void | Promise<void>
}

/**
 * 插件接口
 * 所有插件必须实现此接口
 */
export interface Plugin {
  /** 插件名称 */
  name: string
  /** 插件配置 */
  config?: PluginConfig
  /** 安装插件 */
  install?: (editor: EditorInstance) => void | Promise<void>
  /** 销毁插件 */
  destroy?: () => void | Promise<void>
}

// ============================================================================
// UI 组件
// ============================================================================

/**
 * 工具栏项
 * 定义工具栏按钮的配置
 */
export interface ToolbarItem {
  /** 按钮名称（唯一标识） */
  name: string
  /** 按钮标题（提示文本） */
  title: string
  /** 图标名称 */
  icon: string
  /** 命令（函数或命令名称字符串） */
  command: Command | string
  /** 激活状态判断函数 */
  active?: (state: EditorState) => boolean
  /** 禁用状态判断函数 */
  disabled?: (state: EditorState) => boolean
}

/**
 * 上传进度信息
 */
export interface UploadProgress {
  /** 已上传字节数 */
  loaded: number
  /** 总字节数 */
  total: number
  /** 百分比 (0-100) */
  percent: number
}

/**
 * 文件上传处理器
 * @param file - 要上传的文件
 * @param onProgress - 进度回调函数
 * @returns 上传后的文件URL
 */
export type UploadHandler = (
  file: File,
  onProgress?: (progress: UploadProgress) => void
) => Promise<string>

// ============================================================================
// 编辑器配置
// ============================================================================

/**
 * 编辑器选项
 * 用于初始化编辑器
 */
export interface EditorOptions {
  /** 挂载元素（DOM元素或选择器） */
  element?: HTMLElement | string
  /** 初始内容（HTML字符串或节点） */
  content?: string | Node
  /** 插件列表（插件实例或插件名称） */
  plugins?: (Plugin | string)[]
  /** 是否显示工具栏 */
  toolbar?: boolean
  /** 自定义工具栏项 */
  toolbarItems?: ToolbarItem[]
  /** 是否可编辑 */
  editable?: boolean
  /** 自动聚焦 */
  autofocus?: boolean
  /** 占位符文本 */
  placeholder?: string
  /** 文件上传处理器 */
  uploadHandler?: UploadHandler
  /** 内容变更回调 */
  onChange?: (content: string) => void
  /** 状态更新回调 */
  onUpdate?: (state: EditorState) => void
  /** 聚焦回调 */
  onFocus?: () => void
  /** 失焦回调 */
  onBlur?: () => void
  /** 虚拟滚动配置 */
  virtualScroll?: {
    /** 是否启用虚拟滚动 */
    enabled: boolean
    /** 行高（像素） */
    lineHeight?: number
    /** 最大行数限制 */
    maxLines?: number
    /** 启用语法高亮 */
    enableSyntaxHighlight?: boolean
    /** 启用行号 */
    enableLineNumbers?: boolean
    /** 启用自动换行 */
    enableWordWrap?: boolean
  }
  /** 增量渲染配置 */
  incrementalRender?: {
    /** 是否启用增量渲染 */
    enabled?: boolean
    /** 批处理延迟（ms） */
    batchDelay?: number
    /** 最大批处理大小 */
    maxBatchSize?: number
    /** 是否使用RAF调度 */
    useRAF?: boolean
    /** 是否启用Web Worker */
    useWorker?: boolean
    /** 是否启用虚拟DOM */
    useVirtualDOM?: boolean
  }
  /** WebAssembly加速配置 */
  wasm?: {
    /** 是否启用WASM加速 */
    enabled?: boolean
    /** 启用diff加速 */
    enableDiff?: boolean
    /** 启用解析器加速 */
    enableParser?: boolean
    /** 使用Web Worker */
    useWorker?: boolean
    /** 预热策略 */
    warmupStrategy?: 'eager' | 'lazy' | 'none'
  }

  /** 调试面板配置 */
  debugPanel?: {
    /** 是否启用调试面板 */
    enabled?: boolean
    /** 是否默认展开 */
    expanded?: boolean
    /** 初始标签页 */
    initialTab?: 'performance' | 'memory' | 'network' | 'plugins' | 'console' | 'dom' | 'history' | 'config'
    /** 主题 */
    theme?: 'light' | 'dark' | 'auto'
    /** 位置 */
    position?: 'bottom' | 'right' | 'floating'
    /** 高度/宽度 */
    size?: string
    /** 是否可调整大小 */
    resizable?: boolean
    /** 是否在生产环境显示 */
    showInProduction?: boolean
  }

  /** PWA配置 */
  pwa?: {
    /** 是否启用PWA */
    enabled?: boolean
    /** Service Worker作用域 */
    scope?: string
    /** 更新检查间隔（毫秒） */
    updateInterval?: number
    /** 缓存策略 */
    cacheStrategy?: 'cache-first' | 'network-first' | 'cache-only' | 'network-only' | 'stale-while-revalidate'
    /** 是否支持离线 */
    offlineSupport?: boolean
    /** 是否启用后台同步 */
    backgroundSync?: boolean
    /** 是否显示安装提示 */
    installPrompt?: boolean
    /** 更新时是否自动重载 */
    updateOnReload?: boolean
  }
}

// ============================================================================
// 编辑器实例
// ============================================================================

/**
 * 命令管理器接口
 */
export interface CommandManager {
  /** 注册命令 */
  register: (name: string, command: Command) => void
  /** 执行命令 */
  execute: (name: string, ...args: unknown[]) => boolean
  /** 获取命令 */
  get: (name: string) => Command | undefined
  /** 检查命令是否存在 */
  has: (name: string) => boolean
  /** 获取所有命令名称 */
  getCommands: () => string[]
  /** 注销命令 */
  unregister: (name: string) => void
  /** 清除所有命令 */
  clear: () => void
}

/**
 * 快捷键管理器接口
 */
export interface KeymapManager {
  /** 注册快捷键 */
  register: (keys: string, command: Command) => void
  /** 处理键盘事件 */
  handleKeyDown: (event: KeyboardEvent) => boolean
  /** 注销快捷键 */
  unregister: (keys: string) => void
  /** 清除所有快捷键 */
  clear: () => void
}

/**
 * 插件管理器接口
 */
export interface PluginManager {
  /** 注册插件 */
  register: (plugin: Plugin) => void
  /** 获取插件 */
  get: (name: string) => Plugin | undefined
  /** 获取所有插件 */
  getAll: () => Plugin[]
  /** 检查插件是否存在 */
  has: (name: string) => boolean
  /** 注销插件 */
  unregister: (name: string) => void
  /** 清除所有插件 */
  clear: () => void
}

/**
 * 编辑器实例接口
 * 定义编辑器的核心API
 */
export interface EditorInstance {
  /** 命令管理器 */
  commands: CommandManager
  /** 快捷键管理器 */
  keymap: KeymapManager
  /** 插件管理器 */
  plugins: PluginManager
  /** 编辑器配置选项 */
  options: EditorOptions
  /** 内容区域元素 */
  contentElement: HTMLElement | null
  /** 获取当前状态 */
  getState: () => EditorState
  /** 分发事务 */
  dispatch: (tr: Transaction) => void
  /** 获取HTML内容 */
  getHTML: () => string
  /** 设置HTML内容 */
  setHTML: (html: string) => void
  /** 获取选中的文本 */
  getSelectedText: () => string
  /** 插入HTML */
  insertHTML: (html: string) => void
  /** 聚焦编辑器 */
  focus: () => void
  /** 失焦编辑器 */
  blur: () => void
  /** 清空内容 */
  clear: () => void
  /** 保存选区 */
  saveSelection: () => void
  /** 恢复选区 */
  restoreSelection: () => boolean
  /** 事件监听 */
  on: (event: string, handler: (...args: unknown[]) => void) => () => void
  /** 事件触发 */
  emit: (event: string, ...args: unknown[]) => void
  /** 销毁编辑器 */
  destroy: () => void
  /** 是否已销毁 */
  isDestroyed: () => boolean
  /** 是否可编辑 */
  isEditable: () => boolean
  /** 设置是否可编辑 */
  setEditable: (editable: boolean) => void
}

// ============================================================================
// 事件类型
// ============================================================================

/**
 * 编辑器键盘事件（扩展自DOM KeyboardEvent）
 */
export interface EditorKeyboardEvent {
  /** 按键 */
  key: string
  /** Shift键是否按下 */
  shiftKey?: boolean
  /** Ctrl键是否按下 */
  ctrlKey?: boolean
  /** Meta键是否按下（Mac的Command键） */
  metaKey?: boolean
  /** Alt键是否按下 */
  altKey?: boolean
}
