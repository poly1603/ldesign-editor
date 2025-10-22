import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    // 使用happy-dom作为DOM环境
    environment: 'happy-dom',

    // 全局测试API (describe, it, expect等)
    globals: true,

    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'examples/**',
        'docs/**',
        '**/*.config.{js,ts}',
        '**/*.d.ts',
        '**/types/**',
        '**/*.test.ts',
        '**/*.spec.ts'
      ],
      lines: 85,
      functions: 85,
      branches: 80,
      statements: 85
    },

    // 测试文件匹配模式
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],

    // 设置超时
    testTimeout: 10000,
    hookTimeout: 10000,

    // 测试隔离
    isolate: true,

    // 监听模式排除
    watchExclude: ['**/node_modules/**', '**/dist/**'],

    // Mock配置
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@ui': resolve(__dirname, 'src/ui'),
      '@plugins': resolve(__dirname, 'src/plugins'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@config': resolve(__dirname, 'src/config'),
      '@types': resolve(__dirname, 'src/types'),
      '@ai': resolve(__dirname, 'src/ai'),
      '@styles': resolve(__dirname, 'src/styles')
    }
  }
})


