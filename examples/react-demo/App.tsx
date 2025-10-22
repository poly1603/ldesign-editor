/**
 * React集成示例
 * 展示如何在React应用中使用@ldesign/editor
 */

import React, { useEffect, useRef, useState } from 'react'
import {
  Editor,
  CollaborationPlugin,
  VersionControlPlugin,
  CommentsPlugin,
  MarkdownEnhancedPlugin,
  AIEnhancedPlugin,
  AccessibilityPlugin,
  MobilePlugin,
  type EditorInstance
} from '@ldesign/editor'
import '@ldesign/editor/dist/editor.css'

export default function App() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [editor, setEditor] = useState<EditorInstance | null>(null)
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!editorRef.current) return

    const editorInstance = new Editor({
      element: editorRef.current,
      content: '<p>欢迎使用@ldesign/editor v1.3.0!</p>',
      plugins: [
        CollaborationPlugin,
        VersionControlPlugin,
        CommentsPlugin,
        MarkdownEnhancedPlugin,
        AIEnhancedPlugin,
        AccessibilityPlugin,
        MobilePlugin
      ],
      onChange: (html) => {
        setContent(html)
      }
    }) as EditorInstance

    setEditor(editorInstance)

    return () => {
      editorInstance.destroy()
    }
  }, [])

  const handleSave = () => {
    if (editor) {
      const html = editor.getHTML()
      console.log('Saving:', html)
      alert('内容已保存！')
    }
  }

  const handleCreateVersion = () => {
    if (editor) {
      const manager = (editor as any).versionControl
      if (manager) {
        manager.createVersion(`版本 ${new Date().toLocaleTimeString()}`)
        alert('版本已创建！')
      }
    }
  }

  const handleSmartFormat = async () => {
    if (editor) {
      const manager = (editor as any).aiEnhanced
      if (manager) {
        try {
          await manager.smartFormat()
          alert('智能排版完成！')
        } catch (error) {
          alert('AI服务未配置')
        }
      }
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>@ldesign/editor v1.3.0 React示例</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={handleSave} style={buttonStyle}>
          💾 保存
        </button>
        <button onClick={handleCreateVersion} style={buttonStyle}>
          📂 创建版本
        </button>
        <button onClick={handleSmartFormat} style={buttonStyle}>
          🤖 AI智能排版
        </button>
      </div>

      <div
        ref={editorRef}
        style={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          minHeight: '400px'
        }}
      />

      <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
        <h3>功能列表</h3>
        <ul>
          <li>✅ 基础编辑功能</li>
          <li>✅ 协作编辑（需WebSocket服务器）</li>
          <li>✅ 版本控制（点击"创建版本"测试）</li>
          <li>✅ 评论系统</li>
          <li>✅ Markdown预览</li>
          <li>✅ AI功能（需配置API Key）</li>
          <li>✅ 无障碍优化</li>
          <li>✅ 移动端优化</li>
        </ul>
      </div>

      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <p>字符数: {content.length}</p>
      </div>
    </div>
  )
}

const buttonStyle: React.CSSProperties = {
  padding: '8px 16px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  background: 'white',
  cursor: 'pointer',
  fontSize: '14px'
}


