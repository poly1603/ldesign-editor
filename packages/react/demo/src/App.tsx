import React, { useState, useRef } from 'react'
import { LdEditor, useEditor, type EditorRef } from '@ldesign/editor-react'
import './App.css'

function App() {
  const [content, setContent] = useState('<h3>使用React组件</h3><p>这是通过 <code>&lt;LdEditor&gt;</code> 组件创建的编辑器。</p>')
  const [charCount, setCharCount] = useState(0)
  const editorRef = useRef<EditorRef>(null)

  // 使用 Hook 方式
  const hookEditor = useEditor({
    content: '<h3>使用Hook</h3><p>这是通过 <code>useEditor()</code> hook创建的编辑器。</p>',
    placeholder: '使用 useEditor 编辑...',
    onChange: (html) => {
      console.log('Hook编辑器内容变化:', html.length, '字节')
    }
  })

  const handleChange = (newContent: string) => {
    const count = newContent.replace(/<[^>]*>/g, '').length
    setCharCount(count)
    console.log('组件内容变化:', newContent.length, '字节')
  }

  const handleBold = () => {
    editorRef.current?.editor?.execCommand?.('bold')
  }

  const handleItalic = () => {
    editorRef.current?.editor?.execCommand?.('italic')
  }

  const handleClear = () => {
    if (confirm('确定清空内容？')) {
      setContent('')
    }
  }

  const handleGetContent = () => {
    const html = editorRef.current?.getContent()
    console.log('当前内容:', html)
    alert('内容已输出到控制台')
  }

  const handleHookContent = () => {
    const html = hookEditor.getContent()
    console.log('Hook内容:', html)
    alert('内容已输出到控制台')
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>⚛️ LDesign Editor React</h1>
        <p>React 组件封装演示</p>
      </div>

      <div className="content">
        <div className="section">
          <h3>组件方式</h3>
          <div className="controls">
            <button onClick={handleBold}>粗体</button>
            <button onClick={handleItalic}>斜体</button>
            <button onClick={handleClear}>清空</button>
            <button onClick={handleGetContent}>获取内容</button>
          </div>

          <LdEditor
            ref={editorRef}
            value={content}
            onChange={setContent}
            placeholder="使用 LdEditor 组件编辑..."
            virtualScroll={{ enabled: true }}
            wasm={{ enabled: true }}
            onFocus={() => console.log('聚焦')}
            onBlur={() => console.log('失焦')}
            onUpdate={handleChange}
          />
        </div>

        <div className="section">
          <h3>Hook方式</h3>
          <div className="controls">
            <button onClick={() => hookEditor.insertText('测试文本 ')}>插入文本</button>
            <button onClick={() => hookEditor.focus()}>聚焦</button>
            <button onClick={handleHookContent}>获取内容</button>
          </div>

          <div ref={hookEditor.containerRef} className="editor-box" />
        </div>

        <div className="stats">
          <div><strong>字符数：</strong>{charCount}</div>
          <div><strong>内容长度：</strong>{content.length}字节</div>
          <div><strong>Hook就绪：</strong>{hookEditor.ready ? '✅' : '⏳'}</div>
        </div>
      </div>
    </div>
  )
}

export default App


