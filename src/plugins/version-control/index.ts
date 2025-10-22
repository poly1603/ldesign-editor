/**
 * 版本控制插件
 * 文档快照、版本对比、回滚功能
 * 
 * 功能:
 * - 自动快照
 * - 手动保存版本
 * - 版本对比（Diff）
 * - 版本回滚
 * - 变更历史
 * 
 * @packageDocumentation
 */

import { createPlugin } from '../../core/Plugin'
import type { EditorInstance } from '../../types'
import { createLogger } from '../../utils/logger'
import { generateId } from '../../utils/helpers'

const logger = createLogger('VersionControl')

/**
 * 版本快照
 */
export interface Version {
  /** 版本ID */
  id: string
  /** 版本名称 */
  name: string
  /** 创建时间 */
  timestamp: number
  /** 内容 */
  content: string
  /** 创建者 */
  author?: string
  /** 标签 */
  tags?: string[]
  /** 描述 */
  description?: string
}

/**
 * 变更类型
 */
export type ChangeType = 'add' | 'remove' | 'modify'

/**
 * 文档变更
 */
export interface Change {
  /** 变更类型 */
  type: ChangeType
  /** 位置 */
  position: number
  /** 旧内容 */
  oldContent?: string
  /** 新内容 */
  newContent?: string
}

/**
 * Diff结果
 */
export interface DiffResult {
  /** 变更列表 */
  changes: Change[]
  /** 添加的字符数 */
  additions: number
  /** 删除的字符数 */
  deletions: number
  /** 修改的字符数 */
  modifications: number
}

/**
 * 版本控制管理器
 */
export class VersionControlManager {
  private editor: EditorInstance
  private versions: Version[] = []
  private currentVersionId: string | null = null
  private maxVersions: number = 50
  private autoSaveInterval: number = 5 * 60 * 1000 // 5分钟
  private autoSaveTimer: number | null = null

  constructor(editor: EditorInstance, options: { maxVersions?: number; autoSaveInterval?: number } = {}) {
    this.editor = editor
    this.maxVersions = options.maxVersions || 50
    this.autoSaveInterval = options.autoSaveInterval || 5 * 60 * 1000
  }

  /**
   * 启动自动保存
   */
  startAutoSave(): void {
    if (this.autoSaveTimer !== null) {
      return
    }

    this.autoSaveTimer = window.setInterval(() => {
      this.createVersion('Auto-save')
    }, this.autoSaveInterval)

    logger.info('Auto-save started')
  }

  /**
   * 停止自动保存
   */
  stopAutoSave(): void {
    if (this.autoSaveTimer !== null) {
      clearInterval(this.autoSaveTimer)
      this.autoSaveTimer = null
      logger.info('Auto-save stopped')
    }
  }

  /**
   * 创建版本快照
   * @param name - 版本名称
   * @param options - 版本选项
   * @returns 创建的版本
   */
  createVersion(name: string, options: Partial<Omit<Version, 'id' | 'timestamp' | 'content' | 'name'>> = {}): Version {
    const version: Version = {
      id: generateId(),
      name,
      timestamp: Date.now(),
      content: this.editor.getHTML(),
      ...options
    }

    this.versions.push(version)
    this.currentVersionId = version.id

    // 限制版本数量
    if (this.versions.length > this.maxVersions) {
      this.versions.shift()
    }

    logger.info(`Version created: ${name}`)

    return version
  }

  /**
   * 获取所有版本
   * @returns 版本列表
   */
  getVersions(): Version[] {
    return [...this.versions]
  }

  /**
   * 获取指定版本
   * @param id - 版本ID
   * @returns 版本对象
   */
  getVersion(id: string): Version | null {
    return this.versions.find(v => v.id === id) || null
  }

  /**
   * 恢复到指定版本
   * @param id - 版本ID
   * @returns 是否成功
   */
  restoreVersion(id: string): boolean {
    const version = this.getVersion(id)
    if (!version) {
      logger.error(`Version not found: ${id}`)
      return false
    }

    // 在恢复前创建当前版本快照
    this.createVersion('Before restore')

    // 恢复内容
    this.editor.setHTML(version.content)
    this.currentVersionId = version.id

    logger.info(`Restored to version: ${version.name}`)

    return true
  }

  /**
   * 比较两个版本
   * @param fromId - 起始版本ID
   * @param toId - 目标版本ID
   * @returns Diff结果
   */
  compareVersions(fromId: string, toId: string): DiffResult | null {
    const fromVersion = this.getVersion(fromId)
    const toVersion = this.getVersion(toId)

    if (!fromVersion || !toVersion) {
      logger.error('One or both versions not found')
      return null
    }

    return this.diff(fromVersion.content, toVersion.content)
  }

  /**
   * 与当前内容比较
   * @param versionId - 版本ID
   * @returns Diff结果
   */
  compareWithCurrent(versionId: string): DiffResult | null {
    const version = this.getVersion(versionId)
    if (!version) {
      logger.error(`Version not found: ${versionId}`)
      return null
    }

    return this.diff(version.content, this.editor.getHTML())
  }

  /**
   * 简单的Diff算法（基于字符）
   * @param oldContent - 旧内容
   * @param newContent - 新内容
   * @returns Diff结果
   */
  private diff(oldContent: string, newContent: string): DiffResult {
    const changes: Change[] = []
    let additions = 0
    let deletions = 0
    let modifications = 0

    // 简单的逐字符比较（生产环境应使用更好的diff算法）
    const maxLen = Math.max(oldContent.length, newContent.length)

    for (let i = 0; i < maxLen; i++) {
      const oldChar = oldContent[i]
      const newChar = newContent[i]

      if (oldChar !== newChar) {
        if (!oldChar) {
          // 添加
          changes.push({
            type: 'add',
            position: i,
            newContent: newChar
          })
          additions++
        } else if (!newChar) {
          // 删除
          changes.push({
            type: 'remove',
            position: i,
            oldContent: oldChar
          })
          deletions++
        } else {
          // 修改
          changes.push({
            type: 'modify',
            position: i,
            oldContent: oldChar,
            newContent: newChar
          })
          modifications++
        }
      }
    }

    return {
      changes,
      additions,
      deletions,
      modifications
    }
  }

  /**
   * 删除版本
   * @param id - 版本ID
   * @returns 是否成功
   */
  deleteVersion(id: string): boolean {
    const index = this.versions.findIndex(v => v.id === id)
    if (index === -1) {
      return false
    }

    this.versions.splice(index, 1)
    logger.info(`Version deleted: ${id}`)

    return true
  }

  /**
   * 清空所有版本
   */
  clearVersions(): void {
    this.versions = []
    this.currentVersionId = null
    logger.info('All versions cleared')
  }

  /**
   * 导出版本历史
   * @returns JSON字符串
   */
  exportHistory(): string {
    return JSON.stringify(this.versions, null, 2)
  }

  /**
   * 导入版本历史
   * @param json - JSON字符串
   */
  importHistory(json: string): void {
    try {
      const versions = JSON.parse(json)
      if (Array.isArray(versions)) {
        this.versions = versions
        logger.info(`Imported ${versions.length} versions`)
      }
    } catch (error) {
      logger.error('Failed to import history:', error)
    }
  }

  /**
   * 清理资源
   */
  destroy(): void {
    this.stopAutoSave()
    this.clearVersions()
  }
}

/**
 * 版本控制插件配置
 */
export interface VersionControlPluginConfig {
  /** 最大版本数 */
  maxVersions?: number
  /** 自动保存间隔（毫秒） */
  autoSaveInterval?: number
  /** 是否启用自动保存 */
  enableAutoSave?: boolean
}

/**
 * 创建版本控制插件
 */
export function createVersionControlPlugin(config: VersionControlPluginConfig = {}) {
  let manager: VersionControlManager | null = null

  return createPlugin({
    name: 'version-control',

    commands: {
      // 创建版本
      'version:create': (state, dispatch, editor) => {
        if (manager && editor) {
          manager.createVersion(`Version ${manager.getVersions().length + 1}`)
          return true
        }
        return false
      },

      // 恢复版本
      'version:restore': (state, dispatch, editor) => {
        // 需要传入版本ID
        return false
      }
    },

    init(editor: EditorInstance) {
      manager = new VersionControlManager(editor, {
        maxVersions: config.maxVersions,
        autoSaveInterval: config.autoSaveInterval
      })

        // 暴露到编辑器
        ; (editor as any).versionControl = manager

      // 启用自动保存
      if (config.enableAutoSave) {
        manager.startAutoSave()
      }

      logger.info('Version control initialized')
    },

    destroy() {
      if (manager) {
        manager.destroy()
        manager = null
      }
    }
  })
}

/**
 * 默认导出
 */
export const VersionControlPlugin = createVersionControlPlugin()

/**
 * 获取版本控制管理器
 * @param editor - 编辑器实例
 * @returns 版本控制管理器
 */
export function getVersionControlManager(editor: EditorInstance): VersionControlManager | null {
  return (editor as any).versionControl || null
}


