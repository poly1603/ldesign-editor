import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E测试配置
 * 
 * 运行测试:
 * ```bash
 * npx playwright test
 * npx playwright test --ui
 * npx playwright test --headed
 * ```
 */
export default defineConfig({
  testDir: './e2e',

  // 测试超时
  timeout: 30 * 1000,

  // 期望超时
  expect: {
    timeout: 5000
  },

  // 完全并行运行测试
  fullyParallel: true,

  // CI环境下失败时不重试
  forbidOnly: !!process.env.CI,

  // CI环境下重试失败的测试
  retries: process.env.CI ? 2 : 0,

  // 并行worker数量
  workers: process.env.CI ? 1 : undefined,

  // 测试报告
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list']
  ],

  // 共享配置
  use: {
    // 基础URL
    baseURL: 'http://localhost:5173',

    // 截图
    screenshot: 'only-on-failure',

    // 视频
    video: 'retain-on-failure',

    // 追踪
    trace: 'retain-on-failure',

    // 视口大小
    viewport: { width: 1280, height: 720 },

    // 操作超时
    actionTimeout: 10 * 1000,

    // 导航超时
    navigationTimeout: 30 * 1000,
  },

  // 配置项目
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // 移动端测试
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // 平板测试
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // 开发服务器（测试前启动）
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})


