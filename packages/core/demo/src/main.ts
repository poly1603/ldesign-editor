/**
 * Core Demo 入口文件
 */

import { Editor } from '@ldesign/editor-core'

// 创建编辑器实例
const editor = new Editor({
  content: `
    <h2>欢迎使用 LDesign Editor Core!</h2>
    <p>这是框架无关的核心编辑器库，可以在任何前端框架中使用。</p>
    <h3>核心特性</h3>
    <ul>
      <li>🚀 <strong>极致性能</strong> - 虚拟滚动 + WASM加速</li>
      <li>🤖 <strong>AI赋能</strong> - 7个AI提供商支持</li>
      <li>👥 <strong>实时协作</strong> - CRDT算法</li>
      <li>🏢 <strong>企业级</strong> - 权限 + SSO + 审计</li>
      <li>📱 <strong>移动优先</strong> - PWA + 手势</li>
    </ul>
    <p>开始编辑试试吧！</p>
  `,
  placeholder: '开始输入...',
  virtualScroll: {
    enabled: true
  },
  wasm: {
    enabled: true
  },
  onChange: (content) => {
    updateStats(content)
  }
})

// 挂载编辑器
editor.mount('#editor')

// 绑定按钮事件
document.getElementById('btnBold')?.addEventListener('click', () => {
  editor.execCommand?.('bold')
})

document.getElementById('btnItalic')?.addEventListener('click', () => {
  editor.execCommand?.('italic')
})

document.getElementById('btnUnderline')?.addEventListener('click', () => {
  editor.execCommand?.('underline')
})

document.getElementById('btnH1')?.addEventListener('click', () => {
  editor.execCommand?.('heading', { level: 1 })
})

document.getElementById('btnH2')?.addEventListener('click', () => {
  editor.execCommand?.('heading', { level: 2 })
})

document.getElementById('btnList')?.addEventListener('click', () => {
  editor.execCommand?.('bulletList')
})

document.getElementById('btnLink')?.addEventListener('click', () => {
  const url = prompt('链接地址:')
  if (url) {
    editor.execCommand?.('link', { href: url })
  }
})

document.getElementById('btnImage')?.addEventListener('click', () => {
  const src = prompt('图片地址:')
  if (src) {
    editor.execCommand?.('image', { src })
  }
})

document.getElementById('btnClear')?.addEventListener('click', () => {
  if (confirm('确定清空内容？')) {
    editor.setContent?.('')
  }
})

document.getElementById('btnGetHTML')?.addEventListener('click', () => {
  const html = editor.getContent?.()
  console.log('当前HTML:', html)
  alert('HTML已输出到控制台')
})

// 更新统计信息
function updateStats(content: string) {
  const charCount = content.replace(/<[^>]*>/g, '').length
  document.getElementById('charCount')!.textContent = String(charCount)
}

// 显示版本
document.getElementById('version')!.textContent = editor.version || '2.0.0'

// 显示性能信息
const startTime = performance.now()
editor.on?.('ready', () => {
  const loadTime = performance.now() - startTime
  document.getElementById('performance')!.textContent = `加载时间: ${loadTime.toFixed(2)}ms`
})

console.log('✅ LDesign Editor Core 已加载')
console.log('版本:', editor.version)
console.log('实例:', editor)


