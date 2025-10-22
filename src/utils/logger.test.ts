/**
 * logger日志系统单元测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  logger,
  createLogger,
  setLogLevel,
  getLogHistory,
  exportLogs,
  clearLogHistory
} from './logger'

describe('Logger', () => {
  beforeEach(() => {
    // 清空日志历史
    clearLogHistory()
    // 重置日志级别
    logger.setLevel('debug')
    logger.setEnabled(true)
  })

  afterEach(() => {
    clearLogHistory()
  })

  describe('日志级别', () => {
    it('应该支持设置日志级别', () => {
      logger.setLevel('warn')
      expect(logger.getLevel()).toBe('warn')

      logger.setLevel('error')
      expect(logger.getLevel()).toBe('error')
    })

    it('应该根据级别过滤日志', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { })

      logger.setLevel('warn')
      logger.debug('debug message')
      logger.info('info message')

      expect(consoleSpy).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('日志历史', () => {
    it('应该记录日志历史', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { })

      logger.debug('message 1')
      logger.info('message 2')
      logger.warn('message 3')

      const history = getLogHistory()
      expect(history).toHaveLength(3)
      expect(history[0].message).toBe('message 1')
      expect(history[1].message).toBe('message 2')
      expect(history[2].message).toBe('message 3')

      consoleSpy.mockRestore()
    })

    it('应该支持按级别过滤历史', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })

      logger.debug('debug')
      logger.warn('warn 1')
      logger.warn('warn 2')

      const warnings = getLogHistory('warn')
      expect(warnings).toHaveLength(2)

      consoleSpy.mockRestore()
    })

    it('应该支持清空历史', () => {
      logger.debug('message')
      expect(getLogHistory()).toHaveLength(1)

      clearLogHistory()
      expect(getLogHistory()).toHaveLength(0)
    })
  })

  describe('日志导出', () => {
    it('应该导出为JSON格式', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { })

      logger.debug('test message')

      const json = exportLogs()
      expect(json).toBeTruthy()

      const parsed = JSON.parse(json)
      expect(Array.isArray(parsed)).toBe(true)
      expect(parsed[0].message).toBe('test message')

      consoleSpy.mockRestore()
    })
  })

  describe('PrefixLogger', () => {
    it('应该添加前缀', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { })

      const moduleLogger = createLogger('TestModule')
      moduleLogger.debug('test')

      const history = getLogHistory()
      expect(history[0].prefix).toBe('TestModule')

      consoleSpy.mockRestore()
    })

    it('应该支持启用/禁用', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { })

      const moduleLogger = createLogger('TestModule')
      moduleLogger.setEnabled(false)
      moduleLogger.debug('test')

      expect(getLogHistory()).toHaveLength(0)

      moduleLogger.setEnabled(true)
      moduleLogger.debug('test')

      expect(getLogHistory()).toHaveLength(1)

      consoleSpy.mockRestore()
    })
  })

  describe('分组日志', () => {
    it('应该支持分组', () => {
      const consoleSpy = vi.spyOn(console, 'group').mockImplementation(() => { })
      const consoleEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => { })

      logger.group('Test Group', () => {
        logger.debug('inside group')
      })

      expect(consoleSpy).toHaveBeenCalledWith('Test Group')
      expect(consoleEndSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
      consoleEndSpy.mockRestore()
    })
  })

  describe('日志过滤器', () => {
    it('应该支持添加过滤器', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { })

      // 添加过滤器：只允许包含"important"的日志
      logger.addFilter(entry => entry.message.includes('important'))

      logger.debug('normal message')
      logger.debug('important message')

      const history = getLogHistory()
      expect(history).toHaveLength(1)
      expect(history[0].message).toBe('important message')

      logger.clearFilters()
      consoleSpy.mockRestore()
    })
  })
})


