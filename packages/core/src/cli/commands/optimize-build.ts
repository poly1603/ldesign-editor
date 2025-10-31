/**
 * 构建优化命令
 * 针对不同目标平台优化编辑器构建
 */

import type { BuildOptions } from 'vite'
import path from 'node:path'
import autoprefixer from 'autoprefixer'
import chalk from 'chalk'
import cssnano from 'cssnano'
import fs from 'fs-extra'
import ora from 'ora'
import { visualizer } from 'rollup-plugin-visualizer'
import { build } from 'vite'
import { compression } from 'vite-plugin-compression2'

interface OptimizeOptions {
  target?: 'web' | 'mobile' | 'desktop'
  mode?: 'size' | 'speed' | 'balanced'
  analyze?: boolean
  modern?: boolean
  polyfills?: boolean
  treeShake?: boolean
}

export async function optimizeBuild(options: OptimizeOptions) {
  console.log(chalk.blue('\n开始优化构建...\n'))

  const spinner = ora('准备构建配置...').start()

  try {
    // 生成优化配置
    const buildConfig = generateBuildConfig(options)
    spinner.succeed('构建配置准备完成')

    // 执行构建
    spinner.start('执行优化构建...')
    const startTime = Date.now()

    await build(buildConfig)

    const buildTime = Date.now() - startTime
    spinner.succeed(`构建完成 (耗时: ${(buildTime / 1000).toFixed(2)}s)`)

    // 分析构建结果
    await analyzeBuildResult(options)

    // 显示优化建议
    displayOptimizationTips(options)
  }
  catch (error) {
    spinner.fail(chalk.red('构建失败'))
    console.error(error)
    process.exit(1)
  }
}

/**
 * 生成构建配置
 */
function generateBuildConfig(options: OptimizeOptions): BuildOptions {
  const target = options.target || 'web'
  const mode = options.mode || 'balanced'

  const config: BuildOptions = {
    configFile: false,
    root: process.cwd(),
    mode: 'production',
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'terser',
      terserOptions: getTerserOptions(mode),
      rollupOptions: getRollupOptions(options),
      chunkSizeWarningLimit: mode === 'size' ? 200 : 500,
      cssCodeSplit: true,
      assetsInlineLimit: mode === 'size' ? 2048 : 4096,
      modulePreload: {
        polyfill: options.polyfills !== false,
      },
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          ...(mode !== 'speed'
            ? [cssnano({
              preset: ['default', {
                discardComments: {
                  removeAll: true,
                },
                normalizeWhitespace: mode === 'size',
                colormin: true,
                convertValues: true,
                calc: true,
                minifySelectors: true,
                mergeRules: true,
                mergeLonghand: true,
              }],
            })]
            : []),
        ],
      },
    },
    plugins: getPlugins(options),
    esbuild: {
      target: getEsbuildTarget(target, options.modern),
      drop: mode === 'size' ? ['console', 'debugger'] : [],
      legalComments: 'none',
      treeShaking: options.treeShake ?? true,
      minifyIdentifiers: mode === 'size',
      minifySyntax: true,
      minifyWhitespace: true,
    },
    define: {
      'process.env.NODE_ENV': '"production"',
      '__DEV__': 'false',
      '__BROWSER__': target === 'web' ? 'true' : 'false',
      '__MOBILE__': target === 'mobile' ? 'true' : 'false',
      '__DESKTOP__': target === 'desktop' ? 'true' : 'false',
    },
  }

  // 平台特定优化
  applyPlatformOptimizations(config, target, mode)

  return config
}

/**
 * 获取Terser配置
 */
function getTerserOptions(mode: string) {
  const baseOptions = {
    compress: {
      ecma: 2020,
      passes: mode === 'size' ? 3 : 1,
      drop_console: mode === 'size',
      drop_debugger: true,
      pure_funcs: ['console.log', 'console.info', 'console.debug'],
      arrows: true,
      collapse_vars: true,
      comparisons: true,
      computed_props: true,
      hoist_funs: true,
      hoist_vars: false,
      inline: true,
      loops: true,
      negate_iife: true,
      properties: true,
      reduce_funcs: true,
      reduce_vars: true,
      switches: true,
      toplevel: false,
      typeofs: true,
      booleans: true,
      if_return: true,
      sequences: true,
      unused: true,
      conditionals: true,
      dead_code: true,
      evaluate: true,
    },
    mangle: {
      safari10: true,
      properties: mode === 'size'
        ? {
          regex: /^_/,
          reserved: ['__proto__', '__esModule'],
        }
        : false,
    },
    format: {
      ecma: 2020,
      comments: false,
      ascii_only: true,
    },
  }

  return baseOptions
}

/**
 * 获取Rollup配置
 */
function getRollupOptions(options: OptimizeOptions) {
  return {
    output: {
      manualChunks: (id: string) => {
        // 第三方依赖分包策略
        if (id.includes('node_modules')) {
          if (id.includes('vue') || id.includes('react'))
            return 'framework'

          if (id.includes('lodash') || id.includes('dayjs') || id.includes('axios'))
            return 'utils'

          if (id.includes('chart') || id.includes('echarts') || id.includes('d3'))
            return 'visualization'

          if (id.includes('editor') || id.includes('codemirror') || id.includes('monaco'))
            return 'editor-vendor'

          return 'vendor'
        }

        // 业务代码分包
        if (id.includes('src/plugins/'))
          return 'plugins'

        if (id.includes('src/ui/'))
          return 'ui'

        if (id.includes('src/core/'))
          return 'core'
      },
      chunkFileNames: (chunkInfo) => {
        const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk'
        return `js/[name]-${facadeModuleId}-[hash].js`
      },
      entryFileNames: 'js/[name]-[hash].js',
      assetFileNames: (assetInfo) => {
        const extType = assetInfo.name?.split('.').pop()
        if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType!))
          return 'images/[name]-[hash][extname]'

        if (/woff|woff2|eot|ttf|otf/i.test(extType!))
          return 'fonts/[name]-[hash][extname]'

        if (extType === 'css')
          return 'css/[name]-[hash][extname]'

        return 'assets/[name]-[hash][extname]'
      },
    },
    plugins: options.analyze
      ? [
        visualizer({
          filename: 'dist/stats.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
      ]
      : [],
  }
}

/**
 * 获取插件
 */
function getPlugins(options: OptimizeOptions) {
  const plugins = []

  // 压缩插件
  if (options.mode === 'size' || options.mode === 'balanced') {
    plugins.push(compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginalAssets: false,
    }))

    plugins.push(compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginalAssets: false,
    }))
  }

  return plugins
}

/**
 * 获取esbuild目标
 */
function getEsbuildTarget(target: string, modern?: boolean) {
  if (modern)
    return ['es2020', 'chrome87', 'firefox78', 'safari14', 'edge88']

  switch (target) {
    case 'mobile':
      return ['es2015', 'chrome63', 'safari11']
    case 'desktop':
      return ['es2018', 'chrome70', 'firefox60', 'safari12', 'edge79']
    default:
      return ['es2015', 'chrome58', 'firefox57', 'safari11', 'edge16']
  }
}

/**
 * 应用平台特定优化
 */
function applyPlatformOptimizations(config: BuildOptions, target: string, mode: string) {
  switch (target) {
    case 'mobile':
      // 移动端优化
      config.build!.rollupOptions!.output!.manualChunks = (id: string) => {
        // 更激进的分包策略
        if (id.includes('node_modules')) {
          // 核心依赖单独打包
          if (id.includes('vue') || id.includes('vue-router'))
            return 'vue-core'

          // 其他依赖按大小分包
          return 'vendor'
        }
        // 插件延迟加载
        if (id.includes('src/plugins/')) {
          const plugin = id.split('src/plugins/')[1].split('/')[0]
          return `plugin-${plugin}`
        }
      }

      // 更小的资源内联限制
      config.build!.assetsInlineLimit = 1024

      // 禁用某些功能
      config.define!.__DISABLE_HEAVY_FEATURES__ = 'true'
      break

    case 'desktop':
      // 桌面端优化
      config.build!.chunkSizeWarningLimit = 1000
      config.build!.sourcemap = 'hidden' // 生成但不引用
      break

    case 'web':
    default:
      // Web端标准优化
      if (mode === 'speed') {
        // 速度优先：减少分包，增加内联
        config.build!.rollupOptions!.output!.manualChunks = undefined
        config.build!.assetsInlineLimit = 8192
      }
      break
  }
}

/**
 * 分析构建结果
 */
async function analyzeBuildResult(options: OptimizeOptions) {
  const distPath = path.resolve(process.cwd(), 'dist')

  if (!fs.existsSync(distPath)) {
    console.error(chalk.red('构建输出目录不存在'))
    return
  }

  const spinner = ora('分析构建结果...').start()

  try {
    // 计算文件大小
    const stats = await calculateBuildStats(distPath)

    spinner.succeed('构建分析完成')

    // 显示统计信息
    console.log(`\n${chalk.blue('=== 构建统计 ===')}`)
    console.log(chalk.white(`总文件数: ${stats.fileCount}`))
    console.log(chalk.white(`总大小: ${formatSize(stats.totalSize)}`))
    console.log(chalk.white(`JS大小: ${formatSize(stats.jsSize)} (${stats.jsFiles}个文件)`))
    console.log(chalk.white(`CSS大小: ${formatSize(stats.cssSize)} (${stats.cssFiles}个文件)`))
    console.log(chalk.white(`其他资源: ${formatSize(stats.assetSize)} (${stats.assetFiles}个文件)`))

    if (stats.gzipSize > 0)
      console.log(chalk.green(`\nGzip压缩后: ${formatSize(stats.gzipSize)} (压缩率: ${((1 - stats.gzipSize / stats.totalSize) * 100).toFixed(1)}%)`))

    // 最大文件警告
    if (stats.largestFiles.length > 0) {
      console.log(chalk.yellow('\n最大的文件:'))
      stats.largestFiles.slice(0, 5).forEach((file) => {
        console.log(chalk.yellow(`  ${file.name}: ${formatSize(file.size)}`))
      })
    }
  }
  catch (error) {
    spinner.fail('分析失败')
    console.error(error)
  }
}

/**
 * 计算构建统计
 */
async function calculateBuildStats(dir: string) {
  const stats = {
    fileCount: 0,
    totalSize: 0,
    jsSize: 0,
    jsFiles: 0,
    cssSize: 0,
    cssFiles: 0,
    assetSize: 0,
    assetFiles: 0,
    gzipSize: 0,
    largestFiles: [] as { name: string, size: number }[],
  }

  const files: { name: string, size: number }[] = []

  async function walkDir(currentDir: string) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walkDir(fullPath)
      }
      else {
        const stat = await fs.stat(fullPath)
        const size = stat.size
        const ext = path.extname(entry.name)
        const relativePath = path.relative(dir, fullPath)

        stats.fileCount++
        stats.totalSize += size
        files.push({ name: relativePath, size })

        if (ext === '.js' || ext === '.mjs') {
          stats.jsSize += size
          stats.jsFiles++
        }
        else if (ext === '.css') {
          stats.cssSize += size
          stats.cssFiles++
        }
        else if (ext === '.gz') {
          stats.gzipSize += size
        }
        else {
          stats.assetSize += size
          stats.assetFiles++
        }
      }
    }
  }

  await walkDir(dir)

  // 找出最大的文件
  stats.largestFiles = files
    .filter(f => !f.name.endsWith('.gz') && !f.name.endsWith('.br'))
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)

  return stats
}

/**
 * 格式化文件大小
 */
function formatSize(bytes: number): string {
  if (bytes < 1024)
    return `${bytes} B`
  else if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(2)} KB`
  else
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * 显示优化建议
 */
function displayOptimizationTips(options: OptimizeOptions) {
  console.log(`\n${chalk.blue('=== 优化建议 ===')}`)

  const tips = []

  if (options.target === 'mobile' && !options.modern)
    tips.push('移动端可以考虑使用 --modern 选项，只支持较新的浏览器以减小包体积')

  if (options.mode === 'speed' && !options.analyze)
    tips.push('速度模式下建议使用 --analyze 分析包结构，找出可优化的点')

  if (!options.treeShake)
    tips.push('启用 --tree-shake 可以移除未使用的代码，减小包体积')

  if (options.target === 'web' && options.polyfills !== false)
    tips.push('如果目标用户使用较新浏览器，可以使用 --no-polyfills 减小包体积')

  if (tips.length === 0) {
    tips.push('构建已经过优化，可以考虑：')
    tips.push('- 使用CDN加速资源加载')
    tips.push('- 启用HTTP/2推送关键资源')
    tips.push('- 配置Service Worker缓存策略')
    tips.push('- 使用图片懒加载减少初始加载')
  }

  tips.forEach((tip) => {
    console.log(chalk.cyan(`  • ${tip}`))
  })

  console.log(`\n${chalk.green('✨ 构建优化完成！')}`)
}
