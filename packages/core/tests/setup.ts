import { afterEach, beforeEach, vi } from 'vitest'

// 模拟 DOM API
beforeEach(() => {
  // 设置 document.execCommand 模拟
  document.execCommand = vi.fn()
  
  // 模拟 Selection API
  if (!window.getSelection) {
    window.getSelection = vi.fn(() => ({
      rangeCount: 0,
      getRangeAt: vi.fn(),
      removeAllRanges: vi.fn(),
      addRange: vi.fn(),
    } as any))
  }
})

afterEach(() => {
  // 清理
  vi.clearAllMocks()
  document.body.innerHTML = ''
})
