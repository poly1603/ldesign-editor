/**
 * 性能分析命令
 * 分析编辑器性能日志，生成可视化报告
 */

import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import open from 'open'

interface PerformanceEntry {
  name: string
  type: 'measure' | 'mark' | 'navigation' | 'resource'
  startTime: number
  duration: number
  entryType?: string
  [key: string]: any
}

interface AnalyzeOptions {
  output?: string
  format?: 'html' | 'json' | 'text'
  open?: boolean
  threshold?: string
}

export async function analyzePerformance(file: string, options: AnalyzeOptions) {
  const spinner = ora('读取性能日志...').start()

  try {
    // 检查文件是否存在
    if (!fs.existsSync(file)) {
      spinner.fail(chalk.red(`文件不存在: ${file}`))
      process.exit(1)
    }

    // 读取性能数据
    const rawData = await fs.readFile(file, 'utf8')
    let performanceData: PerformanceEntry[]

    try {
      performanceData = JSON.parse(rawData)
    } catch (error) {
      spinner.fail(chalk.red('无效的JSON文件'))
      process.exit(1)
    }

    spinner.succeed('性能数据读取成功')

    // 分析数据
    spinner.start('分析性能数据...')
    const analysis = analyzeData(performanceData, options)
    spinner.succeed('分析完成')

    // 生成报告
    spinner.start('生成报告...')
    const reportPath = await generateReport(analysis, options)
    spinner.succeed(`报告生成成功: ${reportPath}`)

    // 打开报告
    if (options.open && options.format === 'html') {
      await open(reportPath)
      console.log(chalk.green('已在浏览器中打开报告'))
    }

    // 显示摘要
    displaySummary(analysis)

  } catch (error) {
    spinner.fail(chalk.red('性能分析失败'))
    console.error(error)
    process.exit(1)
  }
}

/**
 * 分析性能数据
 */
function analyzeData(data: PerformanceEntry[], options: AnalyzeOptions) {
  const threshold = parseInt(options.threshold || '50')

  // 基础统计
  const stats = {
    totalEntries: data.length,
    totalDuration: 0,
    avgDuration: 0,
    maxDuration: 0,
    minDuration: Infinity,
    slowOperations: [] as PerformanceEntry[],
    operationsByType: {} as Record<string, PerformanceEntry[]>,
    timeline: [] as any[],
    fps: [] as number[],
    memoryUsage: [] as any[]
  }

  // 处理每个条目
  data.forEach(entry => {
    // 持续时间统计
    if (entry.duration) {
      stats.totalDuration += entry.duration
      stats.maxDuration = Math.max(stats.maxDuration, entry.duration)
      stats.minDuration = Math.min(stats.minDuration, entry.duration)

      // 记录慢操作
      if (entry.duration > threshold) {
        stats.slowOperations.push(entry)
      }
    }

    // 按类型分组
    const type = entry.type || entry.entryType || 'unknown'
    if (!stats.operationsByType[type]) {
      stats.operationsByType[type] = []
    }
    stats.operationsByType[type].push(entry)

    // 时间线
    stats.timeline.push({
      name: entry.name,
      start: entry.startTime,
      duration: entry.duration || 0,
      type: type
    })
  })

  // 计算平均值
  stats.avgDuration = stats.totalDuration / data.length

  // 计算FPS（如果有相关数据）
  const frameData = data.filter(e => e.name === 'frame' || e.type === 'frame')
  if (frameData.length > 0) {
    let lastTime = frameData[0].startTime
    frameData.forEach((frame, index) => {
      if (index > 0) {
        const deltaTime = frame.startTime - lastTime
        const fps = 1000 / deltaTime
        stats.fps.push(fps)
        lastTime = frame.startTime
      }
    })
  }

  // 内存使用情况（如果有）
  const memoryData = data.filter(e => e.name === 'memory' || e.type === 'memory')
  stats.memoryUsage = memoryData.map(m => ({
    time: m.startTime,
    used: m.usedJSHeapSize || 0,
    total: m.totalJSHeapSize || 0
  }))

  // 生成建议
  const suggestions = generateSuggestions(stats, threshold)

  return {
    stats,
    suggestions,
    data: data.slice(0, 1000) // 限制原始数据大小
  }
}

/**
 * 生成优化建议
 */
function generateSuggestions(stats: any, threshold: number) {
  const suggestions = []

  // FPS建议
  if (stats.fps.length > 0) {
    const avgFPS = stats.fps.reduce((a, b) => a + b, 0) / stats.fps.length
    if (avgFPS < 30) {
      suggestions.push({
        level: 'error',
        category: '性能',
        message: `平均FPS仅为 ${avgFPS.toFixed(1)}，严重影响用户体验`,
        recommendation: '考虑减少DOM操作，使用虚拟滚动，优化渲染逻辑'
      })
    } else if (avgFPS < 50) {
      suggestions.push({
        level: 'warning',
        category: '性能',
        message: `平均FPS为 ${avgFPS.toFixed(1)}，可能出现卡顿`,
        recommendation: '优化动画效果，减少重绘和重排'
      })
    }
  }

  // 慢操作建议
  if (stats.slowOperations.length > 0) {
    const slowestOp = stats.slowOperations.sort((a, b) => b.duration - a.duration)[0]
    suggestions.push({
      level: 'warning',
      category: '性能',
      message: `发现 ${stats.slowOperations.length} 个慢操作，最慢的是 "${slowestOp.name}" (${slowestOp.duration.toFixed(2)}ms)`,
      recommendation: '考虑将耗时操作移至Web Worker或使用异步处理'
    })
  }

  // 内存建议
  if (stats.memoryUsage.length > 0) {
    const lastMemory = stats.memoryUsage[stats.memoryUsage.length - 1]
    const memoryMB = lastMemory.used / (1024 * 1024)
    if (memoryMB > 100) {
      suggestions.push({
        level: 'warning',
        category: '内存',
        message: `内存使用达到 ${memoryMB.toFixed(1)} MB`,
        recommendation: '检查内存泄漏，及时清理不用的对象和事件监听器'
      })
    }
  }

  // 操作类型建议
  Object.entries(stats.operationsByType).forEach(([type, operations]: [string, any[]]) => {
    if (operations.length > 100) {
      suggestions.push({
        level: 'info',
        category: '优化',
        message: `${type} 类型操作过多 (${operations.length} 次)`,
        recommendation: `考虑批量处理${type}操作，减少调用频率`
      })
    }
  })

  return suggestions
}

/**
 * 生成报告
 */
async function generateReport(analysis: any, options: AnalyzeOptions): Promise<string> {
  const format = options.format || 'html'
  const outputFile = options.output || `performance-report-${Date.now()}.${format}`
  const outputPath = path.resolve(process.cwd(), outputFile)

  switch (format) {
    case 'html':
      await generateHTMLReport(analysis, outputPath)
      break
    case 'json':
      await fs.writeJSON(outputPath, analysis, { spaces: 2 })
      break
    case 'text':
      await generateTextReport(analysis, outputPath)
      break
  }

  return outputPath
}

/**
 * 生成HTML报告
 */
async function generateHTMLReport(analysis: any, outputPath: string) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>性能分析报告</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .header {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .stat-card {
      padding: 15px;
      background: #f8f9fa;
      border-radius: 4px;
      text-align: center;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #333;
    }
    .stat-label {
      color: #666;
      font-size: 14px;
      margin-top: 5px;
    }
    .suggestion {
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .suggestion.error {
      background: #ffebee;
      border-left: 4px solid #f44336;
    }
    .suggestion.warning {
      background: #fff3cd;
      border-left: 4px solid #ff9800;
    }
    .suggestion.info {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
    }
    .chart-container {
      position: relative;
      height: 300px;
      margin: 20px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #f8f9fa;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>性能分析报告</h1>
      <p>生成时间: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="section">
      <h2>概览</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${analysis.stats.totalEntries}</div>
          <div class="stat-label">总操作数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${analysis.stats.avgDuration.toFixed(2)}ms</div>
          <div class="stat-label">平均耗时</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${analysis.stats.maxDuration.toFixed(2)}ms</div>
          <div class="stat-label">最大耗时</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${analysis.stats.slowOperations.length}</div>
          <div class="stat-label">慢操作数</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h2>优化建议</h2>
      ${analysis.suggestions.map(s => `
        <div class="suggestion ${s.level}">
          <strong>[${s.category}]</strong> ${s.message}
          <br><small>建议: ${s.recommendation}</small>
        </div>
      `).join('')}
    </div>
    
    <div class="section">
      <h2>性能图表</h2>
      <div class="chart-container">
        <canvas id="timeline-chart"></canvas>
      </div>
      ${analysis.stats.fps.length > 0 ? `
      <div class="chart-container">
        <canvas id="fps-chart"></canvas>
      </div>
      ` : ''}
    </div>
    
    <div class="section">
      <h2>慢操作详情</h2>
      <table>
        <thead>
          <tr>
            <th>操作名称</th>
            <th>耗时(ms)</th>
            <th>开始时间(ms)</th>
            <th>类型</th>
          </tr>
        </thead>
        <tbody>
          ${analysis.stats.slowOperations.slice(0, 20).map(op => `
            <tr>
              <td>${op.name}</td>
              <td>${op.duration.toFixed(2)}</td>
              <td>${op.startTime.toFixed(2)}</td>
              <td>${op.type || 'unknown'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  
  <script>
    // 时间线图表
    const timelineCtx = document.getElementById('timeline-chart').getContext('2d');
    new Chart(timelineCtx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: '操作时间线',
          data: ${JSON.stringify(analysis.stats.timeline.slice(0, 1000).map(t => ({
    x: t.start,
    y: t.duration
  })))},
          backgroundColor: 'rgba(33, 150, 243, 0.6)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: '时间 (ms)'
            }
          },
          y: {
            title: {
              display: true,
              text: '耗时 (ms)'
            }
          }
        }
      }
    });
    
    ${analysis.stats.fps.length > 0 ? `
    // FPS图表
    const fpsCtx = document.getElementById('fps-chart').getContext('2d');
    new Chart(fpsCtx, {
      type: 'line',
      data: {
        labels: ${JSON.stringify(analysis.stats.fps.map((_, i) => i))},
        datasets: [{
          label: 'FPS',
          data: ${JSON.stringify(analysis.stats.fps)},
          borderColor: 'rgba(76, 175, 80, 1)',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            suggestedMin: 0,
            suggestedMax: 60,
            title: {
              display: true,
              text: 'FPS'
            }
          }
        }
      }
    });
    ` : ''}
  </script>
</body>
</html>
`

  await fs.writeFile(outputPath, html)
}

/**
 * 生成文本报告
 */
async function generateTextReport(analysis: any, outputPath: string) {
  const lines = [
    '性能分析报告',
    '='.repeat(50),
    '',
    '概览:',
    `  总操作数: ${analysis.stats.totalEntries}`,
    `  平均耗时: ${analysis.stats.avgDuration.toFixed(2)}ms`,
    `  最大耗时: ${analysis.stats.maxDuration.toFixed(2)}ms`,
    `  慢操作数: ${analysis.stats.slowOperations.length}`,
    '',
    '优化建议:',
    ...analysis.suggestions.map(s =>
      `  [${s.level.toUpperCase()}] ${s.category}: ${s.message}\n    建议: ${s.recommendation}`
    ),
    '',
    '慢操作 TOP 10:',
    ...analysis.stats.slowOperations.slice(0, 10).map((op, i) =>
      `  ${i + 1}. ${op.name} - ${op.duration.toFixed(2)}ms`
    )
  ]

  await fs.writeFile(outputPath, lines.join('\n'))
}

/**
 * 显示摘要
 */
function displaySummary(analysis: any) {
  console.log('\n' + chalk.blue('=== 性能分析摘要 ==='))
  console.log(chalk.white(`总操作数: ${analysis.stats.totalEntries}`))
  console.log(chalk.white(`平均耗时: ${analysis.stats.avgDuration.toFixed(2)}ms`))
  console.log(chalk.white(`最大耗时: ${analysis.stats.maxDuration.toFixed(2)}ms`))

  if (analysis.stats.slowOperations.length > 0) {
    console.log(chalk.yellow(`\n发现 ${analysis.stats.slowOperations.length} 个慢操作`))
  }

  if (analysis.suggestions.length > 0) {
    console.log(chalk.blue('\n优化建议:'))
    analysis.suggestions.slice(0, 3).forEach(s => {
      const color = s.level === 'error' ? chalk.red : s.level === 'warning' ? chalk.yellow : chalk.cyan
      console.log(color(`  • [${s.category}] ${s.message}`))
    })
  }
}






