<template>
  <div class="app">
    <h1>@ldesign/editor v1.3.0 Vue示例</h1>
    
    <div class="toolbar">
      <button @click="handleSave">💾 保存</button>
      <button @click="handleCreateVersion">📂 创建版本</button>
      <button @click="handleSmartFormat">🤖 AI智能排版</button>
      <button @click="handleTogglePreview">👁️ 切换预览</button>
    </div>
    
    <div ref="editorRef" class="editor-container" />
    
    <div class="info-panel">
      <h3>功能列表</h3>
      <ul>
        <li>✅ 基础编辑功能</li>
        <li>✅ 协作编辑（需WebSocket服务器）</li>
        <li>✅ 版本控制（点击"创建版本"测试）</li>
        <li>✅ 评论系统</li>
        <li>✅ Markdown预览（点击"切换预览"）</li>
        <li>✅ AI功能（需配置API Key）</li>
        <li>✅ 无障碍优化</li>
        <li>✅ 移动端优化</li>
      </ul>
      
      <div class="stats">
        <p>字符数: {{ contentLength }}</p>
        <p>在线用户: {{ onlineUsers }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
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

const editorRef = ref<HTMLDivElement>()
const contentLength = ref(0)
const onlineUsers = ref(0)

let editor: EditorInstance | null = null

onMounted(() => {
  if (!editorRef.value) return
  
  editor = new Editor({
    element: editorRef.value,
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
      contentLength.value = html.length
    }
  }) as EditorInstance
})

onUnmounted(() => {
  if (editor) {
    editor.destroy()
  }
})

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

const handleTogglePreview = () => {
  if (editor) {
    editor.commands.execute('markdown:togglePreview')
  }
}
</script>

<style scoped>
.app {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

button:hover {
  background: #f5f5f5;
  border-color: #999;
}

.editor-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  min-height: 400px;
}

.info-panel {
  margin-top: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
}

.info-panel h3 {
  margin-top: 0;
}

.info-panel ul {
  list-style: none;
  padding: 0;
}

.info-panel li {
  padding: 4px 0;
}

.stats {
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}

.stats p {
  margin: 5px 0;
}
</style>


