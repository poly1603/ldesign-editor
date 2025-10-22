/**
 * 基础编辑功能E2E测试
 */

import { test, expect } from '@playwright/test'

test.describe('基础编辑功能', () => {
  test.beforeEach(async ({ page }) => {
    // 访问测试页面
    await page.goto('/')

    // 等待编辑器加载
    await page.waitForSelector('.ldesign-editor-content')
  })

  test('应该加载编辑器', async ({ page }) => {
    const editor = await page.locator('.ldesign-editor-content')
    await expect(editor).toBeVisible()
  })

  test('应该能够输入文本', async ({ page }) => {
    const editor = page.locator('.ldesign-editor-content')

    await editor.click()
    await editor.fill('Hello, World!')

    const content = await editor.textContent()
    expect(content).toContain('Hello, World!')
  })

  test('应该能够选中文本', async ({ page }) => {
    const editor = page.locator('.ldesign-editor-content')

    await editor.click()
    await editor.fill('Select this text')

    // 全选
    await page.keyboard.press('Control+A')

    // 检查选中状态（通过执行加粗命令验证）
    const boldBtn = page.locator('button[data-name="bold"]')
    await boldBtn.click()

    const html = await editor.innerHTML()
    expect(html).toContain('<strong>')
  })

  test('应该能够清空内容', async ({ page }) => {
    const editor = page.locator('.ldesign-editor-content')

    await editor.click()
    await editor.fill('Content to clear')

    // 全选并删除
    await page.keyboard.press('Control+A')
    await page.keyboard.press('Delete')

    const content = await editor.textContent()
    expect(content?.trim()).toBe('')
  })
})

test.describe('工具栏操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.ldesign-toolbar')
  })

  test('工具栏应该可见', async ({ page }) => {
    const toolbar = page.locator('.ldesign-toolbar')
    await expect(toolbar).toBeVisible()
  })

  test('加粗按钮应该工作', async ({ page }) => {
    const editor = page.locator('.ldesign-editor-content')
    const boldBtn = page.locator('button[data-name="bold"]')

    await editor.click()
    await editor.fill('Bold text')
    await page.keyboard.press('Control+A')
    await boldBtn.click()

    const html = await editor.innerHTML()
    expect(html).toContain('<strong>Bold text</strong>')
  })

  test('斜体按钮应该工作', async ({ page }) => {
    const editor = page.locator('.ldesign-editor-content')
    const italicBtn = page.locator('button[data-name="italic"]')

    await editor.click()
    await editor.fill('Italic text')
    await page.keyboard.press('Control+A')
    await italicBtn.click()

    const html = await editor.innerHTML()
    expect(html).toContain('<em>Italic text</em>')
  })

  test('下划线按钮应该工作', async ({ page }) => {
    const editor = page.locator('.ldesign-editor-content')
    const underlineBtn = page.locator('button[data-name="underline"]')

    await editor.click()
    await editor.fill('Underline text')
    await page.keyboard.press('Control+A')
    await underlineBtn.click()

    const html = await editor.innerHTML()
    expect(html).toContain('<u>Underline text</u>')
  })
})

test.describe('快捷键', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.ldesign-editor-content')
  })

  test('Ctrl+B应该加粗', async ({ page }) => {
    const editor = page.locator('.ldesign-editor-content')

    await editor.click()
    await editor.fill('Bold text')
    await page.keyboard.press('Control+A')
    await page.keyboard.press('Control+B')

    const html = await editor.innerHTML()
    expect(html).toContain('<strong>Bold text</strong>')
  })

  test('Ctrl+I应该斜体', async ({ page }) => {
    const editor = page.locator('.ldesign-editor-content')

    await editor.click()
    await editor.fill('Italic text')
    await page.keyboard.press('Control+A')
    await page.keyboard.press('Control+I')

    const html = await editor.innerHTML()
    expect(html).toContain('<em>Italic text</em>')
  })

  test('Ctrl+U应该下划线', async ({ page }) => {
    const editor = page.locator('.ldesign-editor-content')

    await editor.click()
    await editor.fill('Underline text')
    await page.keyboard.press('Control+A')
    await page.keyboard.press('Control+U')

    const html = await editor.innerHTML()
    expect(html).toContain('<u>Underline text</u>')
  })

  test('Ctrl+Z应该撤销', async ({ page }) => {
    const editor = page.locator('.ldesign-editor-content')

    await editor.click()
    await editor.fill('First')
    await page.keyboard.press('Enter')
    await editor.fill('Second')

    await page.keyboard.press('Control+Z')

    const content = await editor.textContent()
    expect(content).not.toContain('Second')
  })
})

test.describe('性能', () => {
  test('编辑器应该快速加载', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')
    await page.waitForSelector('.ldesign-editor-content')

    const loadTime = Date.now() - startTime

    // 应该在2秒内加载完成
    expect(loadTime).toBeLessThan(2000)
  })

  test('输入应该流畅（无明显延迟）', async ({ page }) => {
    await page.goto('/')
    const editor = page.locator('.ldesign-editor-content')
    await editor.click()

    const startTime = Date.now()

    // 输入大量文本
    for (let i = 0; i < 100; i++) {
      await editor.pressSequentially('Test ')
    }

    const duration = Date.now() - startTime

    // 输入100个单词应该在3秒内完成
    expect(duration).toBeLessThan(3000)
  })
})


