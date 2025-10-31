import { describe, expect, it } from 'vitest'
import { Editor } from '../../src/core/Editor'

describe('Editor', () => {
  it('应该正确创建编辑器实例', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const editor = new Editor({
      element: div,
      content: '<p>测试内容</p>',
    })

    expect(editor).toBeDefined()
    expect(editor.version).toBeDefined()
  })

  it('应该支持设置和获取内容', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const editor = new Editor({
      element: div,
      content: '<p>初始内容</p>',
    })

    expect(editor.getContent()).toContain('初始内容')
  })

  it('应该支持插件注册', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const editor = new Editor({
      element: div,
      plugins: ['bold', 'italic'],
    })

    expect(editor.plugins).toBeDefined()
  })
})
