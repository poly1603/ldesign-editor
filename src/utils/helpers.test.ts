/**
 * helpers工具函数单元测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  debounce,
  throttle,
  delay,
  retry,
  deepClone,
  deepMerge,
  generateId,
  clamp,
  isEmpty,
  formatFileSize,
  formatDuration
} from './helpers'

describe('helpers', () => {
  describe('debounce', () => {
    it('应该延迟执行函数', async () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced()
      debounced()
      debounced()

      expect(fn).not.toHaveBeenCalled()

      await delay(150)

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('应该支持立即执行模式', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100, true)

      debounced()
      expect(fn).toHaveBeenCalledTimes(1)

      debounced()
      debounced()
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('应该可以取消', async () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced()
      debounced.cancel()

      await delay(150)

      expect(fn).not.toHaveBeenCalled()
    })
  })

  describe('throttle', () => {
    it('应该节流执行函数', async () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 100)

      throttled()
      throttled()
      throttled()

      expect(fn).toHaveBeenCalledTimes(1)

      await delay(150)
      throttled()

      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('应该支持leading和trailing选项', async () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 100, { leading: false, trailing: true })

      throttled()
      expect(fn).not.toHaveBeenCalled()

      await delay(150)
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('delay', () => {
    it('应该延迟指定时间', async () => {
      const start = Date.now()
      await delay(100)
      const duration = Date.now() - start

      expect(duration).toBeGreaterThanOrEqual(95) // 允许一些误差
      expect(duration).toBeLessThan(150)
    })
  })

  describe('retry', () => {
    it('应该在失败后重试', async () => {
      let attempts = 0
      const fn = vi.fn(async () => {
        attempts++
        if (attempts < 3) {
          throw new Error('Failed')
        }
        return 'success'
      })

      const result = await retry(fn, 3, 10)

      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('应该在达到最大重试次数后抛出错误', async () => {
      const fn = vi.fn(async () => {
        throw new Error('Always fails')
      })

      await expect(retry(fn, 2, 10)).rejects.toThrow('Always fails')
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })

  describe('deepClone', () => {
    it('应该深度克隆对象', () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: [3, 4, 5]
        }
      }

      const cloned = deepClone(obj)

      expect(cloned).toEqual(obj)
      expect(cloned).not.toBe(obj)
      expect(cloned.b).not.toBe(obj.b)
      expect(cloned.b.d).not.toBe(obj.b.d)
    })

    it('应该克隆数组', () => {
      const arr = [1, 2, { a: 3 }]
      const cloned = deepClone(arr)

      expect(cloned).toEqual(arr)
      expect(cloned).not.toBe(arr)
      expect(cloned[2]).not.toBe(arr[2])
    })
  })

  describe('deepMerge', () => {
    it('应该深度合并对象', () => {
      const target = { a: 1, b: { c: 2 } }
      const source = { b: { d: 3 }, e: 4 }

      const result = deepMerge(target, source)

      expect(result).toEqual({
        a: 1,
        b: { c: 2, d: 3 },
        e: 4
      })
    })

    it('应该覆盖数组', () => {
      const target = { arr: [1, 2, 3] }
      const source = { arr: [4, 5] }

      const result = deepMerge(target, source)

      expect(result.arr).toEqual([4, 5])
    })
  })

  describe('generateId', () => {
    it('应该生成唯一ID', () => {
      const id1 = generateId()
      const id2 = generateId()

      expect(id1).toBeTruthy()
      expect(id2).toBeTruthy()
      expect(id1).not.toBe(id2)
    })

    it('应该生成指定长度的ID', () => {
      const id = generateId(16)
      expect(id).toHaveLength(16)
    })
  })

  describe('clamp', () => {
    it('应该限制数值范围', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(15, 0, 10)).toBe(10)
    })
  })

  describe('isEmpty', () => {
    it('应该正确判断空值', () => {
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
      expect(isEmpty('')).toBe(true)
      expect(isEmpty([])).toBe(true)
      expect(isEmpty({})).toBe(true)
      expect(isEmpty('text')).toBe(false)
      expect(isEmpty([1])).toBe(false)
      expect(isEmpty({ a: 1 })).toBe(false)
      expect(isEmpty(0)).toBe(false)
    })
  })

  describe('formatFileSize', () => {
    it('应该格式化文件大小', () => {
      expect(formatFileSize(0)).toBe('0 B')
      expect(formatFileSize(1024)).toBe('1.00 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1.00 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.00 GB')
    })
  })

  describe('formatDuration', () => {
    it('应该格式化时间', () => {
      expect(formatDuration(0)).toBe('0ms')
      expect(formatDuration(500)).toBe('500ms')
      expect(formatDuration(1000)).toBe('1.00s')
      expect(formatDuration(60000)).toBe('1.00m')
    })
  })
})


