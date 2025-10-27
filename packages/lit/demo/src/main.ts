import '@ldesign/editor-lit'

// 获取编辑器元素
const editor = document.getElementById('myEditor') as any
let eventCount = 0

// 监听change事件
editor?.addEventListener('change', (e: CustomEvent) => {
  const content = e.detail
  eventCount++

  // 更新统计
  const length = content.replace(/<[^>]*>/g, '').length
  document.getElementById('length')!.textContent = String(length)
  document.getElementById('events')!.textContent = String(eventCount)

  console.log('内容变化:', content.length, '字节')
})

// 监听focus事件
editor?.addEventListener('focus', () => {
  console.log('编辑器获得焦点')
  document.getElementById('status')!.textContent = '✅ 激活'
})

// 监听blur事件
editor?.addEventListener('blur', () => {
  console.log('编辑器失去焦点')
  document.getElementById('status')!.textContent = '⏸️ 非激活'
})

// 绑定按钮
document.getElementById('btnBold')?.addEventListener('click', () => {
  editor?.editor?.execCommand?.('bold')
})

document.getElementById('btnItalic')?.addEventListener('click', () => {
  editor?.editor?.execCommand?.('italic')
})

document.getElementById('btnInsert')?.addEventListener('click', () => {
  editor?.editor?.insertText?.('插入的文本 ')
})

document.getElementById('btnClear')?.addEventListener('click', () => {
  if (confirm('确定清空内容？')) {
    editor?.setContent?.('')
  }
})

document.getElementById('btnGet')?.addEventListener('click', () => {
  const content = editor?.getContent?.()
  console.log('当前内容:', content)
  alert('内容已输出到控制台')
})

console.log('✅ Lit Demo 已加载')
console.log('编辑器元素:', editor)


