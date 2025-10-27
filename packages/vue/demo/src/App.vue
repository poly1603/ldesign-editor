<template>
  <div class="app-container">
    <div class="header">
      <h1>📝 LDesign Editor Vue</h1>
      <p>Vue 3 组件封装演示</p>
    </div>

    <div class="content">
      <div class="info">
        <h3>组件方式</h3>
        <div class="controls">
          <button @click="handleBold">粗体</button>
          <button @click="handleItalic">斜体</button>
          <button @click="handleClear">清空</button>
          <button @click="handleGetContent">获取内容</button>
        </div>
        
        <LdEditor
          ref="editorRef"
          v-model="content"
          placeholder="使用 LdEditor 组件编辑..."
          :virtual-scroll="{ enabled: true }"
          :wasm="{ enabled: true }"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </div>

      <div class="info">
        <h3>Composable方式</h3>
        <div class="controls">
          <button @click="composableEditor.insertText('测试文本')">插入文本</button>
          <button @click="composableEditor.focus()">聚焦</button>
          <button @click="handleComposableContent">获取内容</button>
        </div>
        
        <div ref="composableContainer" class="editor-box"></div>
      </div>

      <div class="stats">
        <div><strong>字符数：</strong>{{ charCount }}</div>
        <div><strong>内容长度：</strong>{{ content.length }}字节</div>
        <div><strong>状态：</strong>{{ editorReady ? '✅ 就绪' : '⏳ 加载中' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LdEditor, useEditor } from '@ldesign/editor-vue'

// 组件方式
const editorRef = ref()
const content = ref('<h3>使用Vue组件</h3><p>这是通过 <code>&lt;LdEditor&gt;</code> 组件创建的编辑器。</p>')
const editorReady = ref(false)

// Composable方式
const composableContainer = ref<HTMLDivElement>()

const composableEditor = useEditor({
  content: '<h3>使用Composable</h3><p>这是通过 <code>useEditor()</code> composable创建的编辑器。</p>',
  placeholder: '使用 useEditor 编辑...',
  autoMount: false
})

// 挂载composable编辑器
onMounted(() => {
  if (composableContainer.value && composableEditor.editor.value) {
    composableEditor.editor.value.mount(composableContainer.value)
  }
})

// 计算字符数
const charCount = computed(() => {
  return content.value.replace(/<[^>]*>/g, '').length
})

// 事件处理
const handleChange = (newContent: string) => {
  console.log('内容变化:', newContent.length, '字节')
}

const handleFocus = () => {
  console.log('编辑器获得焦点')
  editorReady.value = true
}

const handleBlur = () => {
  console.log('编辑器失去焦点')
}

const handleBold = () => {
  editorRef.value?.editor?.execCommand?.('bold')
}

const handleItalic = () => {
  editorRef.value?.editor?.execCommand?.('italic')
}

const handleClear = () => {
  if (confirm('确定清空内容？')) {
    content.value = ''
  }
}

const handleGetContent = () => {
  const html = editorRef.value?.getContent()
  console.log('当前内容:', html)
  alert('内容已输出到控制台')
}

const handleComposableContent = () => {
  const html = composableEditor.getContent()
  console.log('Composable内容:', html)
  alert('内容已输出到控制台')
}

console.log('✅ Vue Demo 已加载')
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 30px auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.header {
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.header h1 {
  font-size: 32px;
  margin-bottom: 10px;
}

.header p {
  font-size: 16px;
  opacity: 0.9;
}

.content {
  padding: 30px;
}

.info {
  margin-bottom: 30px;
}

.info h3 {
  margin-bottom: 15px;
  color: #333;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.controls button {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.controls button:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.editor-box {
  min-height: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.stats {
  padding: 15px;
  background: #e6f7ff;
  border-radius: 8px;
  font-size: 14px;
}

.stats div {
  margin-bottom: 5px;
}
</style>


