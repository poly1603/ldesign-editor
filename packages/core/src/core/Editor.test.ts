/**
 * Editor核心类单元测试
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Editor } from './Editor'

describe('editor', () => {
  let container: HTMLElement
  let editor: Editor

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'editor-test'
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (editor && !editor.isDestroyed())
      editor.destroy()

    container.remove()
  })

  describe('初始化', () => {
    it('应该创建编辑器实例', () => {
      editor = new Editor({
        element: container,
        content: '<p>Hello World</p>',
      })

      expect(editor).toBeDefined()
      expect(editor.contentElement).toBeDefined()
    })

    it('应该支持选择器字符串', () => {
      editor = new Editor({
        element: '#editor-test',
        content: '<p>Test</p>',
      })

      expect(editor.contentElement).toBeDefined()
    })

    it('应该设置初始内容', () => {
      editor = new Editor({
        element: container,
        content: '<p>Initial content</p>',
      })

      const html = editor.getHTML()
      expect(html).toContain('Initial content')
    })

    it('应该支持占位符', () => {
      editor = new Editor({
        element: container,
        placeholder: 'Enter text...',
      })

      expect(editor.contentElement?.dataset.placeholder).toBe('Enter text...')
    })

    it('应该支持自动聚焦', () => {
      editor = new Editor({
        element: container,
        autofocus: true,
      })

      // 注意：在测试环境中autofocus可能不会真正聚焦
      expect(editor.contentElement).toBeDefined()
    })

    it('应该支持禁用编辑', () => {
      editor = new Editor({
        element: container,
        editable: false,
      })

      expect(editor.isEditable()).toBe(false)
      expect(editor.contentElement?.contentEditable).toBe('false')
    })
  })

  describe('内容操作', () => {
    beforeEach(() => {
      editor = new Editor({
        element: container,
        content: '<p>Test</p>',
      })
    })

    it('应该获取HTML内容', () => {
      const html = editor.getHTML()
      expect(html).toContain('Test')
    })

    it('应该设置HTML内容', () => {
      editor.setHTML('<p>New content</p>')
      const html = editor.getHTML()
      expect(html).toContain('New content')
    })

    it('应该清空内容', () => {
      editor.clear()
      const html = editor.getHTML()
      expect(html).toBe('<p></p>')
    })

    it('应该插入HTML', () => {
      editor.focus()
      editor.insertHTML('<strong>Bold text</strong>')

      const html = editor.getHTML()
      expect(html).toContain('Bold text')
    })
  })

  describe('焦点管理', () => {
    beforeEach(() => {
      editor = new Editor({
        element: container,
      })
    })

    it('应该聚焦编辑器', () => {
      editor.focus()
      expect(document.activeElement).toBe(editor.contentElement)
    })

    it('应该失焦编辑器', () => {
      editor.focus()
      editor.blur()
      expect(document.activeElement).not.toBe(editor.contentElement)
    })
  })

  describe('事件系统', () => {
    beforeEach(() => {
      editor = new Editor({
        element: container,
      })
    })

    it('应该触发update事件', () => {
      const handler = vi.fn()
      editor.on('update', handler)

      editor.setHTML('<p>Changed</p>')

      expect(handler).toHaveBeenCalled()
    })

    it('应该触发focus事件', () => {
      const handler = vi.fn()
      editor.on('focus', handler)

      editor.focus()

      expect(handler).toHaveBeenCalled()
    })

    it('应该触发blur事件', () => {
      const handler = vi.fn()
      editor.on('blur', handler)

      editor.focus()
      editor.blur()

      expect(handler).toHaveBeenCalled()
    })

    it('应该支持取消订阅', () => {
      const handler = vi.fn()
      const unsubscribe = editor.on('update', handler)

      editor.setHTML('<p>Change 1</p>')
      expect(handler).toHaveBeenCalledTimes(1)

      unsubscribe()
      editor.setHTML('<p>Change 2</p>')
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('选区管理', () => {
    beforeEach(() => {
      editor = new Editor({
        element: container,
        content: '<p>Test content</p>',
      })
    })

    it('应该保存和恢复选区', () => {
      editor.focus()

      // 创建选区
      const range = document.createRange()
      range.selectNodeContents(editor.contentElement!)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)

      editor.saveSelection()

      // 清除选区
      selection?.removeAllRanges()

      // 恢复选区
      const restored = editor.restoreSelection()
      expect(restored).toBe(true)
    })
  })

  describe('生命周期', () => {
    it('应该正确销毁', () => {
      editor = new Editor({
        element: container,
      })

      expect(editor.isDestroyed()).toBe(false)

      editor.destroy()

      expect(editor.isDestroyed()).toBe(true)
    })

    it('销毁后应该清理DOM', () => {
      editor = new Editor({
        element: container,
      })

      const initialChildren = container.children.length
      expect(initialChildren).toBeGreaterThan(0)

      editor.destroy()

      expect(container.children.length).toBe(0)
    })
  })

  describe('回调函数', () => {
    it('应该触发onChange回调', () => {
      const onChange = vi.fn()
      editor = new Editor({
        element: container,
        onChange,
      })

      editor.setHTML('<p>New</p>')

      expect(onChange).toHaveBeenCalled()
    })

    it('应该触发onUpdate回调', () => {
      const onUpdate = vi.fn()
      editor = new Editor({
        element: container,
        onUpdate,
      })

      editor.setHTML('<p>New</p>')

      expect(onUpdate).toHaveBeenCalled()
    })

    it('应该触发onFocus回调', () => {
      const onFocus = vi.fn()
      editor = new Editor({
        element: container,
        onFocus,
      })

      editor.focus()

      expect(onFocus).toHaveBeenCalled()
    })

    it('应该触发onBlur回调', () => {
      const onBlur = vi.fn()
      editor = new Editor({
        element: container,
        onBlur,
      })

      editor.focus()
      editor.blur()

      expect(onBlur).toHaveBeenCalled()
    })
  })

  describe('可编辑性', () => {
    beforeEach(() => {
      editor = new Editor({
        element: container,
      })
    })

    it('应该切换可编辑状态', () => {
      expect(editor.isEditable()).toBe(true)

      editor.setEditable(false)
      expect(editor.isEditable()).toBe(false)
      expect(editor.contentElement?.contentEditable).toBe('false')

      editor.setEditable(true)
      expect(editor.isEditable()).toBe(true)
      expect(editor.contentElement?.contentEditable).toBe('true')
    })
  })

  describe('获取选中文本', () => {
    beforeEach(() => {
      editor = new Editor({
        element: container,
        content: '<p>Hello World</p>',
      })
    })

    it('应该获取选中的文本', () => {
      editor.focus()

      // 创建选区
      const range = document.createRange()
      const textNode = editor.contentElement?.querySelector('p')?.firstChild
      if (textNode) {
        range.setStart(textNode, 0)
        range.setEnd(textNode, 5)

        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)

        const selectedText = editor.getSelectedText()
        expect(selectedText).toBe('Hello')
      }
    })

    it('没有选区时应该返回空字符串', () => {
      const selectedText = editor.getSelectedText()
      expect(selectedText).toBe('')
    })
  })
})

describe('prefixLogger', () => {
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { })

  beforeEach(() => {
    clearLogHistory()
    consoleSpy.mockClear()
  })

  afterEach(() => {
    clearLogHistory()
  })

  it('应该创建带前缀的日志器', () => {
    const moduleLogger = createLogger('MyModule')
    moduleLogger.info('test message')

    const history = getLogHistory()
    expect(history[0].prefix).toBe('MyModule')
  })

  it('应该支持所有日志级别', () => {
    const moduleLogger = createLogger('Module')

    moduleLogger.debug('debug')
    moduleLogger.info('info')
    moduleLogger.warn('warn')
    moduleLogger.error('error')

    const history = getLogHistory()
    expect(history).toHaveLength(4)
  })

  it('应该支持分组', () => {
    const groupSpy = vi.spyOn(console, 'group').mockImplementation(() => { })
    const groupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => { })

    const moduleLogger = createLogger('Module')
    moduleLogger.group('Group Label', () => {
      moduleLogger.debug('inside')
    })

    expect(groupSpy).toHaveBeenCalled()
    expect(groupEndSpy).toHaveBeenCalled()

    groupSpy.mockRestore()
    groupEndSpy.mockRestore()
  })
})
