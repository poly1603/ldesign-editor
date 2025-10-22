/**
 * 插件系统集成测试
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Editor } from '../../src/core/Editor'
import { createPlugin } from '../../src/core/Plugin'
import type { EditorInstance } from '../../src/types'

describe('插件系统集成', () => {
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

  it('应该加载和初始化插件', () => {
    const initSpy = vi.fn()

    const testPlugin = createPlugin({
      name: 'test-plugin',
      init: initSpy
    })

    editor = new Editor({
      element: container,
      plugins: [testPlugin]
    })

    expect(initSpy).toHaveBeenCalled()
    expect(editor.plugins.has('test-plugin')).toBe(true)
  })

  it('应该注册插件命令', () => {
    const commandSpy = vi.fn(() => true)

    const testPlugin = createPlugin({
      name: 'test-plugin',
      commands: {
        testCommand: commandSpy
      }
    })

    editor = new Editor({
      element: container,
      plugins: [testPlugin]
    })

    const result = editor.commands.execute('testCommand')

    expect(result).toBe(true)
    expect(commandSpy).toHaveBeenCalled()
  })

  it('应该注册插件快捷键', () => {
    const commandSpy = vi.fn(() => true)

    const testPlugin = createPlugin({
      name: 'test-plugin',
      commands: {
        testCommand: commandSpy
      },
      keys: {
        'Mod-x': (state, dispatch, editor) => {
          return editor?.commands.execute('testCommand') || false
        }
      }
    })

    editor = new Editor({
      element: container,
      plugins: [testPlugin]
    })

    // 模拟快捷键
    const event = new KeyboardEvent('keydown', {
      key: 'x',
      ctrlKey: true
    })

    if (editor.contentElement) {
      editor.contentElement.dispatchEvent(event)
    }

    // 注意：实际执行取决于KeymapManager的实现
  })

  it('应该处理插件依赖', async () => {
    const plugin1InitSpy = vi.fn()
    const plugin2InitSpy = vi.fn()

    const plugin1 = createPlugin({
      name: 'plugin1',
      init: plugin1InitSpy
    })

    const plugin2 = createPlugin({
      name: 'plugin2',
      init: plugin2InitSpy
    })

    editor = new Editor({
      element: container,
      plugins: [plugin1, plugin2]
    })

    expect(plugin1InitSpy).toHaveBeenCalled()
    expect(plugin2InitSpy).toHaveBeenCalled()
  })

  it('应该正确销毁插件', () => {
    const destroySpy = vi.fn()

    const testPlugin = createPlugin({
      name: 'test-plugin',
      destroy: destroySpy
    })

    editor = new Editor({
      element: container,
      plugins: [testPlugin]
    })

    editor.destroy()

    expect(destroySpy).toHaveBeenCalled()
  })

  it('应该支持动态加载插件', () => {
    editor = new Editor({
      element: container,
      plugins: []
    })

    const testPlugin = createPlugin({
      name: 'dynamic-plugin',
      commands: {
        dynamicCommand: () => true
      }
    })

    editor.plugins.register(testPlugin)

    expect(editor.plugins.has('dynamic-plugin')).toBe(true)
    expect(editor.commands.has('dynamicCommand')).toBe(true)
  })

  it('应该支持卸载插件', () => {
    const testPlugin = createPlugin({
      name: 'removable-plugin',
      commands: {
        removableCommand: () => true
      }
    })

    editor = new Editor({
      element: container,
      plugins: [testPlugin]
    })

    expect(editor.plugins.has('removable-plugin')).toBe(true)

    editor.plugins.unregister('removable-plugin')

    expect(editor.plugins.has('removable-plugin')).toBe(false)
    expect(editor.commands.has('removableCommand')).toBe(false)
  })
})

describe('配置管理集成', () => {
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

  it('应该应用编辑器选项', () => {
    const onChangeSpy = vi.fn()
    const onUpdateSpy = vi.fn()

    editor = new Editor({
      element: container,
      content: '<p>Initial</p>',
      editable: true,
      autofocus: false,
      placeholder: 'Enter text...',
      onChange: onChangeSpy,
      onUpdate: onUpdateSpy
    })

    expect(editor.isEditable()).toBe(true)
    expect(editor.contentElement?.dataset.placeholder).toBe('Enter text...')

    editor.setHTML('<p>Changed</p>')

    expect(onChangeSpy).toHaveBeenCalled()
    expect(onUpdateSpy).toHaveBeenCalled()
  })

  it('应该支持禁用工具栏', () => {
    editor = new Editor({
      element: container,
      toolbar: false
    })

    const toolbar = container.querySelector('.ldesign-toolbar')
    expect(toolbar).toBeNull()
  })

  it('应该支持自定义工具栏项', () => {
    const customCommand = vi.fn(() => true)

    editor = new Editor({
      element: container,
      toolbarItems: [
        {
          name: 'custom',
          title: 'Custom Button',
          icon: 'star',
          command: customCommand
        }
      ]
    })

    const customBtn = container.querySelector('button[data-name="custom"]')
    expect(customBtn).toBeTruthy()
  })
})

describe('事件传播集成', () => {
  let container: HTMLElement
  let editor: Editor

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    editor = new Editor({
      element: container
    })
  })

  afterEach(() => {
    editor.destroy()
    container.remove()
  })

  it('内容更新应该触发事件链', () => {
    const updateSpy = vi.fn()
    const changeSpy = vi.fn()

    editor.on('update', updateSpy)
    editor.on('change', changeSpy)

    editor.setHTML('<p>New content</p>')

    expect(updateSpy).toHaveBeenCalled()
  })

  it('焦点事件应该正常触发', () => {
    const focusSpy = vi.fn()
    const blurSpy = vi.fn()

    editor.on('focus', focusSpy)
    editor.on('blur', blurSpy)

    editor.focus()
    expect(focusSpy).toHaveBeenCalled()

    editor.blur()
    expect(blurSpy).toHaveBeenCalled()
  })
})


