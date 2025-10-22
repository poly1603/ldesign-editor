/**
 * @ldesign/editor 构建配置
 * 
 * 富文本编辑器库
 */

import { defineConfig, libraryPackage } from '@ldesign/builder'

export default defineConfig(
  libraryPackage({
    // UMD 构建配置
    umd: {
      enabled: true,
      name: 'LDesignEditor'
    },

    // 输出配置
    output: {
      esm: {
        dir: 'es',
        format: 'esm',
        preserveStructure: true,
        dts: true
      },
      cjs: {
        dir: 'lib',
        format: 'cjs',
        preserveStructure: true,
        dts: true
      },
      umd: {
        dir: 'dist',
        format: 'umd',
        minify: true
      }
    },

    // 排除非生产代码
    exclude: [
      '**/examples/**',
      '**/demo/**',
      '**/__tests__/**',
      '**/*.test.*',
      '**/*.spec.*',
      '**/docs/**',
      '**/tests/**',
      '**/scripts/**'
    ],

    // 样式处理
    style: {
      extract: true,
      minimize: true,
      autoprefixer: true
    },

    // TypeScript 配置
    typescript: {
      declaration: true,
      target: 'ES2020',
      module: 'ESNext'
    }
  })
)

