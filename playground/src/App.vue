<script setup lang="ts">
import { ref, onUnmounted, watch, nextTick, computed } from 'vue'
import { LdEditor } from '@ldesign/editor-vue'
import { Editor, standardPlugins, basicPlugins, fullPlugins } from '@ldesign/editor-core'

// 导入编辑器样式
import '../../packages/core/src/styles/editor.css'

// Tab 切换
const activeTab = ref<'vue' | 'native'>('vue')

// 预设选择
const selectedPreset = ref<'basic' | 'standard' | 'full'>('standard')
const presetOptions = {
  basic: basicPlugins,
  standard: standardPlugins,
  full: fullPlugins,
}

// Vue 组件方式
const vueContent = ref('<p>欢迎使用 <strong>LDesign Editor</strong>！</p><p>这是 Vue 组件方式，支持 <em>v-model</em> 双向绑定。</p>')

// 原生 JS 方式
const nativeContent = ref('<p>欢迎使用 <strong>LDesign Editor</strong>！</p><p>这是原生 JS 方式，通过 <code>new Editor()</code> 创建实例。</p>')
let nativeEditor: Editor | null = null
const nativeEditorRef = ref<HTMLDivElement>()

// 销毁原生编辑器
const destroyNativeEditor = () => {
  if (nativeEditor) {
    // 保存内容
    try {
      const html = nativeEditor.getHTML?.()
      if (html) nativeContent.value = html
    } catch (e) {
      // ignore
    }
    nativeEditor.destroy?.()
    nativeEditor = null
  }
}

// 初始化原生编辑器
const initNativeEditor = () => {
  if (nativeEditorRef.value) {
    // 先销毁旧实例
    destroyNativeEditor()
    
    // 使用新的预设系统
    nativeEditor = new Editor({
      content: nativeContent.value,
      placeholder: '开始输入内容...',
      plugins: presetOptions[selectedPreset.value],
      onChange: (content: string) => {
        nativeContent.value = content
      }
    })
    nativeEditor.mount(nativeEditorRef.value)
  }
}

// 监听 Tab 切换
watch(activeTab, (tab, oldTab) => {
  // 切换离开 native 时销毁
  if (oldTab === 'native') {
    destroyNativeEditor()
  }
  // 切换到 native 时初始化
  if (tab === 'native') {
    nextTick(initNativeEditor)
  }
})

onUnmounted(() => {
  destroyNativeEditor()
})

// 当前显示的内容
const currentContent = computed(() => 
  activeTab.value === 'vue' ? vueContent.value : nativeContent.value
)

// 监听预设变化，重新初始化编辑器
watch(selectedPreset, () => {
  if (activeTab.value === 'native') {
    nextTick(initNativeEditor)
  }
})

// 代码示例
const codeExamples = {
  vue: `<script setup lang="ts">
import { ref } from 'vue'
import { LdEditor } from '@ldesign/editor-vue'
import '@ldesign/editor-core/styles/editor.css'

const content = ref('<p>Hello</p>')
<\/script>

<template>
  <LdEditor v-model="content" />
</template>`,

  native: `import { Editor, standardPlugins } from '@ldesign/editor-core'
import '@ldesign/editor-core/styles/editor.css'

// 方式 1: 使用预设
const editor = new Editor({
  element: '#app',
  plugins: standardPlugins,
})

// 方式 2: 链式注册
const editor2 = new Editor({ element: '#app' })
  .use(BoldPlugin)
  .use(ItalicPlugin)
  .use(HeadingPlugin)

// API
editor.getHTML()   // 获取 HTML
editor.setHTML()   // 设置 HTML
editor.destroy()   // 销毁实例`
}
</script>

<template>
  <div class="app">
    <!-- 顶部标题栏 -->
    <header class="header">
      <div class="header-content">
        <h1>LDesign Editor</h1>
        <span class="badge">Playground</span>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main">
      <!-- 左侧：编辑器区域 -->
      <section class="editor-panel">
        <!-- Tab 切换 -->
        <div class="tab-bar">
          <button 
            :class="['tab-btn', { active: activeTab === 'vue' }]"
            @click="activeTab = 'vue'"
          >
            <span class="tab-icon">⚡</span>
            Vue 组件
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'native' }]"
            @click="activeTab = 'native'"
          >
            <span class="tab-icon">📦</span>
            原生 JS
          </button>
          
          <!-- 预设选择器 -->
          <div class="preset-selector">
            <span class="preset-label">预设:</span>
            <select v-model="selectedPreset" class="preset-select">
              <option value="basic">📝 Basic (基础)</option>
              <option value="standard">⭐ Standard (标准)</option>
              <option value="full">🚀 Full (完整)</option>
            </select>
          </div>
        </div>

        <!-- 编辑器容器 -->
        <div class="editor-box">
          <!-- Vue 编辑器 -->
          <div v-if="activeTab === 'vue'" class="editor-inner" :key="'vue-' + selectedPreset">
            <LdEditor 
              v-model="vueContent" 
              placeholder="开始输入..." 
              :plugins="presetOptions[selectedPreset]"
            />
          </div>
          
          <!-- 原生 JS 编辑器 -->
          <div v-else ref="nativeEditorRef" class="editor-inner" key="native"></div>
        </div>
      </section>

      <!-- 右侧：预览面板 -->
      <aside class="preview-panel">
        <!-- HTML 输出 -->
        <div class="preview-section">
          <div class="section-title">
            <span class="icon">📄</span>
            HTML 输出
          </div>
          <pre class="preview-code html">{{ currentContent }}</pre>
        </div>

        <!-- 代码示例 -->
        <div class="preview-section">
          <div class="section-title">
            <span class="icon">💻</span>
            {{ activeTab === 'vue' ? 'Vue 用法' : 'JS 用法' }}
          </div>
          <pre class="preview-code code">{{ codeExamples[activeTab] }}</pre>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  display: flex;
  flex-direction: column;
}

/* 顶部栏 */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 32px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 1600px;
  margin: 0 auto;
}

.header h1 {
  color: white;
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.5px;
}

.badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* 主内容区 */
.main {
  flex: 1;
  display: flex;
  gap: 24px;
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

/* 编辑器面板 */
.editor-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.tab-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.tab-icon {
  font-size: 16px;
}

.preset-selector {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.preset-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.preset-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-select:hover {
  border-color: #667eea;
}

.preset-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.editor-box {
  flex: 1;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  min-height: 500px;
}

.editor-inner {
  height: 100%;
  min-height: 500px;
}

/* 预览面板 */
.preview-panel {
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

.preview-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.icon {
  font-size: 16px;
}

.preview-code {
  margin: 0;
  padding: 16px;
  border-radius: 10px;
  font-size: 12px;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  line-height: 1.6;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.preview-code.html {
  background: #f8fafc;
  color: #475569;
  max-height: 180px;
  border: 1px solid #e2e8f0;
}

.preview-code.code {
  background: #1e293b;
  color: #e2e8f0;
  max-height: 280px;
}

/* 响应式 */
@media (max-width: 1100px) {
  .main {
    flex-direction: column;
  }
  
  .preview-panel {
    width: 100%;
    flex-direction: row;
  }
  
  .preview-section {
    flex: 1;
  }
}

@media (max-width: 700px) {
  .header {
    padding: 12px 16px;
  }
  
  .main {
    padding: 16px;
  }
  
  .preview-panel {
    flex-direction: column;
  }
  
  .tab-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>
