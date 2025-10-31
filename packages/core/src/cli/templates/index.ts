/**
 * 插件模板管理
 */

export interface PluginTemplate {
  name: string
  description: string
  files?: string[]
}

export function getTemplates(): Record<string, PluginTemplate> {
  return {
    default: {
      name: '基础插件',
      description: '包含基础功能的标准插件模板',
    },
    toolbar: {
      name: '工具栏插件',
      description: '带有工具栏按钮的插件模板',
    },
    formatting: {
      name: '格式化插件',
      description: '文本格式化功能插件模板',
    },
    media: {
      name: '媒体插件',
      description: '图片、视频等媒体处理插件模板',
    },
    ai: {
      name: 'AI功能插件',
      description: '集成AI功能的插件模板',
    },
    table: {
      name: '表格插件',
      description: '表格编辑功能插件模板',
    },
  }
}
