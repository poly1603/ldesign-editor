/**
 * 图表类型定义
 */

/**
 * 图表类型
 */
export type DiagramType = 'mindmap' | 'flowchart' | 'uml' | 'sequence' | 'gantt'

/**
 * 图表配置选项
 */
export interface DiagramOptions {
  width?: string | number
  height?: number
  theme?: 'light' | 'dark'
  editable?: boolean
  interactive?: boolean
}

/**
 * 图表数据基础接口
 */
export interface DiagramData {
  [key: string]: any
}

/**
 * 思维导图节点
 */
export interface MindMapNode {
  id?: string
  text: string
  children?: MindMapNode[]
  collapsed?: boolean
  style?: {
    color?: string
    backgroundColor?: string
    fontSize?: number
    fontWeight?: string
  }
}

/**
 * 思维导图数据
 */
export interface MindMapData extends DiagramData {
  root: MindMapNode
  theme?: string
  layout?: 'tree' | 'radial' | 'organization'
}

/**
 * 流程图节点
 */
export interface FlowchartNode {
  id: string
  type: 'start' | 'end' | 'process' | 'decision' | 'io' | 'subroutine'
  text: string
  x: number
  y: number
  width?: number
  height?: number
  style?: {
    fill?: string
    stroke?: string
    strokeWidth?: number
  }
}

/**
 * 流程图连线
 */
export interface FlowchartEdge {
  id?: string
  from: string
  to: string
  text?: string
  type?: 'straight' | 'curved' | 'orthogonal'
  style?: {
    stroke?: string
    strokeWidth?: number
    strokeDasharray?: string
  }
}

/**
 * 流程图数据
 */
export interface FlowchartData extends DiagramData {
  nodes: FlowchartNode[]
  edges: FlowchartEdge[]
  layout?: 'vertical' | 'horizontal'
}

/**
 * UML类
 */
export interface UMLClass {
  id?: string
  name: string
  attributes: string[]
  methods: string[]
  isAbstract?: boolean
  isInterface?: boolean
  x?: number
  y?: number
}

/**
 * UML关系
 */
export interface UMLRelationship {
  id?: string
  from: string
  to: string
  type: 'association' | 'aggregation' | 'composition' | 'inheritance' | 'implementation' | 'dependency'
  multiplicity?: {
    from?: string
    to?: string
  }
  label?: string
}

/**
 * UML数据
 */
export interface UMLData extends DiagramData {
  classes: UMLClass[]
  relationships: UMLRelationship[]
  packages?: {
    name: string
    classes: string[]
  }[]
}

/**
 * 时序图参与者
 */
export interface SequenceActor {
  id?: string
  name: string
  type?: 'actor' | 'participant' | 'database' | 'queue'
}

/**
 * 时序图消息
 */
export interface SequenceMessage {
  id?: string
  from: string
  to: string
  text: string
  type?: 'sync' | 'async' | 'return' | 'create' | 'destroy'
  activation?: boolean
}

/**
 * 时序图数据
 */
export interface SequenceData extends DiagramData {
  actors: (string | SequenceActor)[]
  messages: SequenceMessage[]
  fragments?: {
    type: 'alt' | 'opt' | 'loop' | 'par'
    text: string
    messages: number[]
  }[]
}

/**
 * 甘特图任务
 */
export interface GanttTask {
  id?: string
  name: string
  start: string | Date
  end: string | Date
  progress: number
  dependencies?: string[]
  assignee?: string
  priority?: 'low' | 'medium' | 'high'
  milestone?: boolean
}

/**
 * 甘特图数据
 */
export interface GanttData extends DiagramData {
  tasks: GanttTask[]
  milestones?: {
    name: string
    date: string | Date
  }[]
  resources?: {
    name: string
    capacity: number
  }[]
}

/**
 * 图表编辑器接口
 */
export interface DiagramEditor {
  /**
   * 渲染编辑器
   */
  render: (container: HTMLElement, options: {
    data: DiagramData
    onSave: (data: DiagramData, options?: DiagramOptions) => void
    onCancel: () => void
  }) => Promise<any>

  /**
   * 销毁编辑器
   */
  destroy?: () => void
}

/**
 * 图表渲染器接口
 */
export interface DiagramRendererInterface {
  /**
   * 渲染图表
   */
  render: (container: HTMLElement, type: DiagramType, data: DiagramData, options?: DiagramOptions) => void

  /**
   * 导出图表
   */
  export: (container: HTMLElement, type: DiagramType, data: DiagramData, format?: 'png' | 'svg' | 'pdf') => Promise<void>

  /**
   * 销毁渲染器
   */
  destroy: () => void
}

/**
 * 图表事件
 */
export interface DiagramEvents {
  'node-click': (node: any) => void
  'node-dblclick': (node: any) => void
  'edge-click': (edge: any) => void
  'selection-change': (selected: any[]) => void
  'data-change': (data: DiagramData) => void
}

/**
 * 图表配置
 */
export interface DiagramConfig {
  /**
   * 启用的图表类型
   */
  enabledTypes?: DiagramType[]

  /**
   * 默认主题
   */
  defaultTheme?: 'light' | 'dark'

  /**
   * 是否启用自动保存
   */
  autoSave?: boolean

  /**
   * 自动保存间隔（毫秒）
   */
  autoSaveInterval?: number

  /**
   * 是否启用协作
   */
  collaboration?: boolean

  /**
   * 最大缩放级别
   */
  maxZoom?: number

  /**
   * 最小缩放级别
   */
  minZoom?: number

  /**
   * 默认缩放级别
   */
  defaultZoom?: number

  /**
   * 是否启用网格
   */
  showGrid?: boolean

  /**
   * 是否启用标尺
   */
  showRuler?: boolean

  /**
   * 是否启用导出
   */
  enableExport?: boolean

  /**
   * 导出格式
   */
  exportFormats?: Array<'png' | 'svg' | 'pdf' | 'json'>
}

/**
 * 图表导出选项
 */
export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'json'
  width?: number
  height?: number
  quality?: number
  background?: string
  scale?: number
}

/**
 * 图表样式主题
 */
export interface DiagramTheme {
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    border: string
    grid?: string
  }
  fonts: {
    family: string
    size: number
    weight?: string
  }
  shapes: {
    borderRadius?: number
    strokeWidth?: number
  }
}

/**
 * 图表布局选项
 */
export interface LayoutOptions {
  algorithm?: 'tree' | 'force' | 'circular' | 'hierarchical' | 'radial'
  direction?: 'TB' | 'BT' | 'LR' | 'RL'
  spacing?: {
    node?: number
    rank?: number
  }
  alignment?: 'center' | 'left' | 'right'
  fit?: boolean
  padding?: number
}
