import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    vue(),
    react(),
    // Brotli压缩
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024
    }),
    // Gzip压缩
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024
    }),
    // 构建分析（只在ANALYZE=true时启用）
    process.env.ANALYZE === 'true' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),

  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        vue: resolve(__dirname, 'src/adapters/vue/index.ts'),
        react: resolve(__dirname, 'src/adapters/react/index.tsx'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`
    },
    cssCodeSplit: false,
    sourcemap: true,

    // 压缩优化
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug', 'console.info', 'logger.debug'],
        passes: 3,  // 增加压缩轮数
        unsafe: true,  // 启用不安全的优化（更小的体积）
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true
      },
      format: {
        comments: false,
        ecma: 2020
      },
      mangle: {
        safari10: true,
        toplevel: true  // mangle顶级作用域
      }
    },

    // chunk大小警告
    chunkSizeWarningLimit: 500,  // 降低警告阈值

    // 启用CSS代码分割
    cssCodeSplit: true,

    // 目标浏览器（支持更现代的语法，减少polyfill）
    target: 'es2020',

    // Rollup优化
    rollupOptions: {
      external: ['vue', 'react', 'react-dom', 'react/jsx-runtime'],

      output: {
        // 更细粒度的代码分割
        manualChunks: (id) => {
          // node_modules按包分割
          if (id.includes('node_modules')) {
            // CodeMirror（最大的依赖）- 按语言分割
            if (id.includes('@codemirror')) {
              if (id.includes('lang-javascript')) return 'cm-lang-js'
              if (id.includes('lang-python')) return 'cm-lang-py'
              if (id.includes('lang-java')) return 'cm-lang-java'
              if (id.includes('lang-cpp')) return 'cm-lang-cpp'
              if (id.includes('lang-css')) return 'cm-lang-css'
              if (id.includes('lang-html')) return 'cm-lang-html'
              if (id.includes('lang-sql')) return 'cm-lang-sql'
              if (id.includes('lang-json')) return 'cm-lang-json'
              if (id.includes('lang-markdown')) return 'cm-lang-md'
              if (id.includes('/view')) return 'cm-view'
              if (id.includes('/state')) return 'cm-state'
              if (id.includes('/commands')) return 'cm-commands'
              return 'cm-core'
            }
            // 其他依赖
            return 'vendor'
          }

          // 核心模块（保持最小）
          if (id.includes('/src/core/')) {
            return 'core'
          }

          // AI功能（按需加载）
          if (id.includes('/src/ai/')) {
            if (id.includes('/providers/OpenAI')) return 'ai-openai'
            if (id.includes('/providers/Claude')) return 'ai-claude'
            if (id.includes('/providers/DeepSeek')) return 'ai-deepseek'
            if (id.includes('/providers/')) return 'ai-providers'
            return 'ai-core'
          }

          // 插件（按类别细分）
          if (id.includes('/src/plugins/')) {
            if (id.includes('/formatting/')) {
              if (id.includes('/font')) return 'plugin-font'
              if (id.includes('/color')) return 'plugin-color'
              return 'plugin-format'
            }
            if (id.includes('/media/')) {
              if (id.includes('/image')) return 'plugin-image'
              return 'plugin-media'
            }
            if (id.includes('/table/')) return 'plugin-table'
            if (id.includes('/ai/')) return 'plugin-ai'
            if (id.includes('/codeblock')) return 'plugin-code'
            if (id.includes('/markdown')) return 'plugin-markdown'
            return 'plugin-utils'
          }

          // UI组件（细分）
          if (id.includes('/src/ui/')) {
            if (id.includes('/base/')) return 'ui-base'
            if (id.includes('/icons/')) return 'ui-icons'
            if (id.includes('/enhanced/')) return 'ui-enhanced'
            if (id.includes('Dialog')) return 'ui-dialogs'
            if (id.includes('Dropdown')) return 'ui-dropdowns'
            return 'ui-components'
          }

          // 工具函数（按功能分）
          if (id.includes('/src/utils/')) {
            if (id.includes('/logger')) return 'utils-logger'
            if (id.includes('/performance')) return 'utils-perf'
            if (id.includes('/event')) return 'utils-event'
            if (id.includes('/dom')) return 'utils-dom'
            return 'utils'
          }

          // 图标管理
          if (id.includes('/src/icons/')) {
            if (id.includes('/sets/lucide')) return 'icons-lucide'
            if (id.includes('/sets/feather')) return 'icons-feather'
            if (id.includes('/sets/material')) return 'icons-material'
            return 'icons-core'
          }

          // 主题和国际化
          if (id.includes('/src/theme/')) return 'theme'
          if (id.includes('/src/i18n/')) return 'i18n'
          if (id.includes('/src/config/')) return 'config'
        },

        globals: {
          vue: 'Vue',
          react: 'React',
          'react-dom': 'ReactDOM'
        },

        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'editor.css'
          return '[name].[ext]'
        },

        chunkFileNames: 'chunks/[name]-[hash].js',

        // 优化导出
        exports: 'named',

        // 保留模块结构
        preserveModules: false,

        // 压缩选项
        compact: true
      },

      // 增强Tree-shaking优化
      treeshake: {
        moduleSideEffects: false,  // 假设模块没有副作用
        propertyReadSideEffects: false,  // 假设属性读取没有副作用
        unknownGlobalSideEffects: false,  // 假设全局变量没有副作用
        annotations: true,  // 尊重/* #__PURE__ */注释
        preset: 'smallest',  // 最激进的tree-shaking
        // 手动标记有副作用的模块
        moduleSideEffects: (id) => {
          // CSS文件有副作用
          if (id.endsWith('.css')) return true
          // 样式相关文件有副作用
          if (id.includes('/styles/')) return true
          // 其他文件假设无副作用
          return false
        }
      }
    },

    // 优化依赖预构建
    optimizeDeps: {
      include: ['vue', 'react', 'react-dom'],
      exclude: [],
      // 预构建时的esbuild配置
      esbuildOptions: {
        target: 'es2020',
        supported: {
          bigint: true
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@ui': resolve(__dirname, 'src/ui'),
      '@plugins': resolve(__dirname, 'src/plugins'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@config': resolve(__dirname, 'src/config')
    }
  },

  // 开发服务器优化
  server: {
    hmr: {
      overlay: true
    }
  },

  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'react', 'react-dom'],
    exclude: []
  }
})
