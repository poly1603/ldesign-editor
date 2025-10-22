/**
 * 性能基准测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { Editor } from '../../src/core/Editor'
import { getPerformanceMonitor } from '../../src/utils/PerformanceMonitor'

describe('性能基准测试', () => {
  let container: HTMLElement
  let editor: Editor
  const monitor = getPerformanceMonitor()

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    monitor.clear()
  })

  afterEach(() => {
    if (editor) {
      editor.destroy()
    }
    container.remove()
  })

  it('编辑器初始化应该在500ms内完成', async () => {
    const startTime = performance.now()

    editor = new Editor({
      element: container,
      content: '<p>Test</p>'
    })

    const duration = performance.now() - startTime

    expect(duration).toBeLessThan(500)
    console.log(`Editor initialization: ${duration.toFixed(2)}ms`)
  })

  it('插入1000个字符应该流畅', () => {
    editor = new Editor({
      element: container
    })

    const startTime = performance.now()

    let text = ''
    for (let i = 0; i < 1000; i++) {
      text += 'x'
    }

    editor.setHTML(`<p>${text}</p>`)

    const duration = performance.now() - startTime

    expect(duration).toBeLessThan(100)
    console.log(`Insert 1000 chars: ${duration.toFixed(2)}ms`)
  })

  it('处理100次内容更新应该在1秒内', () => {
    editor = new Editor({
      element: container
    })

    const startTime = performance.now()

    for (let i = 0; i < 100; i++) {
      editor.setHTML(`<p>Content ${i}</p>`)
    }

    const duration = performance.now() - startTime

    expect(duration).toBeLessThan(1000)
    console.log(`100 updates: ${duration.toFixed(2)}ms`)
  })

  it('内存使用应该合理', () => {
    editor = new Editor({
      element: container
    })

    // 插入大量内容
    let content = '<p>'
    for (let i = 0; i < 1000; i++) {
      content += `Paragraph ${i}. `
    }
    content += '</p>'

    editor.setHTML(content)

    // 检查内存（如果可用）
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const usedMB = memory.usedJSHeapSize / 1024 / 1024

      expect(usedMB).toBeLessThan(100)
      console.log(`Memory usage: ${usedMB.toFixed(2)}MB`)
    }
  })

  it('事件处理应该高效', () => {
    editor = new Editor({
      element: container
    })

    const handler = vi.fn()
    editor.on('update', handler)

    const startTime = performance.now()

    // 触发100次更新事件
    for (let i = 0; i < 100; i++) {
      editor.emit('update')
    }

    const duration = performance.now() - startTime

    expect(duration).toBeLessThan(50)
    expect(handler).toHaveBeenCalledTimes(100)
    console.log(`100 events: ${duration.toFixed(2)}ms`)
  })

  it('销毁应该清理所有资源', () => {
    editor = new Editor({
      element: container,
      content: '<p>Test</p>'
    })

    // 添加一些监听器
    editor.on('update', () => { })
    editor.on('focus', () => { })
    editor.on('blur', () => { })

    const startTime = performance.now()
    editor.destroy()
    const duration = performance.now() - startTime

    expect(duration).toBeLessThan(100)
    expect(editor.isDestroyed()).toBe(true)
    expect(container.children.length).toBe(0)

    console.log(`Destroy: ${duration.toFixed(2)}ms`)
  })
})

describe('大文档性能测试', () => {
  let container: HTMLElement
  let editor: Editor

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (editor) {
      editor.destroy()
    }
    container.remove()
  })

  it('应该处理10KB文档', () => {
    const content = '<p>' + 'Lorem ipsum dolor sit amet. '.repeat(500) + '</p>'

    const startTime = performance.now()

    editor = new Editor({
      element: container,
      content
    })

    const duration = performance.now() - startTime

    expect(duration).toBeLessThan(1000)
    console.log(`10KB document load: ${duration.toFixed(2)}ms`)
  })

  it('应该处理100个段落', () => {
    let content = ''
    for (let i = 0; i < 100; i++) {
      content += `<p>Paragraph ${i}: Lorem ipsum dolor sit amet.</p>`
    }

    const startTime = performance.now()

    editor = new Editor({
      element: container,
      content
    })

    const duration = performance.now() - startTime

    expect(duration).toBeLessThan(2000)
    console.log(`100 paragraphs load: ${duration.toFixed(2)}ms`)
  })
})


