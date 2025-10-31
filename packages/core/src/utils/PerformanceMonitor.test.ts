/**
 * PerformanceMonitor性能监控单元测试
 */

import { beforeEach, describe, expect, it } from 'vitest'
import {
  endTimer,
  getPerformanceMonitor,
  measure,
  PerformanceMonitor,
  startTimer,
} from './PerformanceMonitor'

describe('performanceMonitor', () => {
  let monitor: PerformanceMonitor

  beforeEach(() => {
    monitor = new PerformanceMonitor()
  })

  describe('计时器', () => {
    it('应该测量操作时间', () => {
      monitor.start('test-operation')

      // 模拟一些工作
      let sum = 0
      for (let i = 0; i < 1000; i++)
        sum += i

      const duration = monitor.end('test-operation')

      expect(duration).toBeGreaterThan(0)
      expect(duration).toBeLessThan(1000) // 应该很快
    })

    it('应该记录性能条目', () => {
      monitor.start('operation1')
      monitor.end('operation1')

      monitor.start('operation2')
      monitor.end('operation2')

      const entries = monitor.getEntries()
      expect(entries).toHaveLength(2)
      expect(entries[0].name).toBe('operation1')
      expect(entries[1].name).toBe('operation2')
    })

    it('应该支持元数据', () => {
      monitor.start('operation')
      monitor.end('operation', { custom: 'data' })

      const entries = monitor.getEntries('operation')
      expect(entries[0].metadata).toEqual({ custom: 'data' })
    })
  })

  describe('measure', () => {
    it('应该测量同步函数', async () => {
      const result = await monitor.measure('sync-op', () => {
        return 42
      })

      expect(result).toBe(42)

      const entries = monitor.getEntries('sync-op')
      expect(entries).toHaveLength(1)
      expect(entries[0].duration).toBeGreaterThan(0)
    })

    it('应该测量异步函数', async () => {
      const result = await monitor.measure('async-op', async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return 'done'
      })

      expect(result).toBe('done')

      const entries = monitor.getEntries('async-op')
      expect(entries).toHaveLength(1)
      expect(entries[0].duration).toBeGreaterThanOrEqual(10)
    })

    it('应该捕获错误', async () => {
      await expect(
        monitor.measure('error-op', async () => {
          throw new Error('Test error')
        }),
      ).rejects.toThrow('Test error')

      const entries = monitor.getEntries('error-op')
      expect(entries).toHaveLength(1)
      expect(entries[0].metadata?.error).toBe(true)
    })
  })

  describe('统计信息', () => {
    beforeEach(() => {
      monitor.start('op1')
      monitor.end('op1')

      monitor.start('op1')
      monitor.end('op1')

      monitor.start('op2')
      monitor.end('op2')
    })

    it('应该计算统计信息', () => {
      const stats = monitor.getStats('op1')

      expect(stats.count).toBe(2)
      expect(stats.total).toBeGreaterThan(0)
      expect(stats.average).toBeGreaterThan(0)
      expect(stats.min).toBeGreaterThan(0)
      expect(stats.max).toBeGreaterThan(0)
    })

    it('应该计算所有操作的统计信息', () => {
      const stats = monitor.getStats()

      expect(stats.count).toBe(3)
    })
  })

  describe('指标', () => {
    it('应该更新指标', () => {
      monitor.updateMetrics({
        loadTime: 500,
        renderTime: 100,
      })

      const metrics = monitor.getMetrics()
      expect(metrics.loadTime).toBe(500)
      expect(metrics.renderTime).toBe(100)
    })

    it('应该获取当前指标', () => {
      const metrics = monitor.getMetrics()

      expect(metrics).toHaveProperty('loadTime')
      expect(metrics).toHaveProperty('renderTime')
      expect(metrics).toHaveProperty('memoryUsage')
      expect(metrics).toHaveProperty('fps')
    })
  })

  describe('慢操作检测', () => {
    it('应该识别慢操作', () => {
      // 模拟快操作
      monitor.start('fast')
      monitor.end('fast')

      // 模拟慢操作（手动设置时间）
      const slowEntry = {
        name: 'slow',
        startTime: 0,
        duration: 200,
      }
      monitor.entries.push(slowEntry)

      const slowOps = monitor.getSlowOperations(100)

      expect(slowOps.length).toBeGreaterThan(0)
      expect(slowOps.some(op => op.name === 'slow')).toBe(true)
    })
  })

  describe('报告生成', () => {
    it('应该生成性能报告', () => {
      monitor.updateMetrics({
        loadTime: 500,
        renderTime: 100,
        memoryUsage: 50,
        fps: 60,
      })

      monitor.start('operation')
      monitor.end('operation')

      const report = monitor.generateReport()

      expect(report).toContain('性能报告')
      expect(report).toContain('500')
      expect(report).toContain('100')
      expect(report).toContain('50')
      expect(report).toContain('60')
    })

    it('应该包含建议', () => {
      monitor.updateMetrics({
        fps: 20, // 低FPS
        memoryUsage: 150, // 高内存
      })

      const report = monitor.generateReport()

      expect(report).toContain('建议')
      expect(report).toContain('FPS')
      expect(report).toContain('内存')
    })
  })

  describe('清理', () => {
    it('应该清空所有数据', () => {
      monitor.start('op')
      monitor.end('op')

      expect(monitor.getEntries()).toHaveLength(1)

      monitor.clear()

      expect(monitor.getEntries()).toHaveLength(0)
    })
  })

  describe('导出', () => {
    it('应该导出数据', () => {
      monitor.start('op')
      monitor.end('op')

      const exported = monitor.export()

      expect(exported).toHaveProperty('metrics')
      expect(exported).toHaveProperty('entries')
      expect(exported).toHaveProperty('timestamp')
      expect(exported.entries).toHaveLength(1)
    })
  })
})

describe('全局函数', () => {
  describe('getPerformanceMonitor', () => {
    it('应该返回单例', () => {
      const monitor1 = getPerformanceMonitor()
      const monitor2 = getPerformanceMonitor()

      expect(monitor1).toBe(monitor2)
    })
  })

  describe('measure', () => {
    it('应该测量函数执行时间', async () => {
      const result = await measure('test', () => {
        return 42
      })

      expect(result).toBe(42)
    })
  })

  describe('startTimer 和 endTimer', () => {
    it('应该计时操作', () => {
      startTimer('test-timer')

      // 模拟工作
      let sum = 0
      for (let i = 0; i < 100; i++)
        sum += i

      const duration = endTimer('test-timer')

      expect(duration).toBeGreaterThan(0)
    })
  })
})
