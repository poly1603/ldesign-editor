/**
 * 创建插件命令
 * 提供插件脚手架功能
 */

import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { execSync } from 'child_process'
import ora from 'ora'
import { getTemplates } from '../templates'

interface PluginOptions {
  template?: string
  description?: string
  author?: string
  git?: boolean
  install?: boolean
}

export async function createPlugin(name: string, options: PluginOptions) {
  console.log(chalk.blue(`\n创建新插件: ${name}\n`))

  // 验证插件名称
  if (!isValidPluginName(name)) {
    console.error(chalk.red('插件名称无效！必须以字母开头，只能包含字母、数字和连字符。'))
    process.exit(1)
  }

  // 目标目录
  const targetDir = path.resolve(process.cwd(), name)

  // 检查目录是否存在
  if (fs.existsSync(targetDir)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `目录 ${name} 已存在，是否覆盖？`,
        default: false
      }
    ])

    if (!overwrite) {
      console.log(chalk.yellow('取消创建'))
      return
    }

    fs.removeSync(targetDir)
  }

  // 收集插件信息
  const pluginInfo = await collectPluginInfo(name, options)

  // 创建插件
  const spinner = ora('创建插件...').start()

  try {
    // 创建目录
    fs.ensureDirSync(targetDir)

    // 复制模板文件
    await copyTemplate(pluginInfo.template, targetDir, pluginInfo)

    spinner.succeed('插件创建成功')

    // 初始化Git仓库
    if (options.git !== false) {
      spinner.start('初始化Git仓库...')
      try {
        execSync('git init', { cwd: targetDir, stdio: 'ignore' })
        execSync('git add .', { cwd: targetDir, stdio: 'ignore' })
        execSync('git commit -m "Initial commit"', { cwd: targetDir, stdio: 'ignore' })
        spinner.succeed('Git仓库初始化成功')
      } catch (error) {
        spinner.fail('Git初始化失败')
      }
    }

    // 安装依赖
    if (options.install !== false) {
      spinner.start('安装依赖...')
      try {
        execSync('npm install', { cwd: targetDir, stdio: 'ignore' })
        spinner.succeed('依赖安装成功')
      } catch (error) {
        spinner.fail('依赖安装失败，请手动运行 npm install')
      }
    }

    // 显示成功信息
    console.log('\n' + chalk.green('✨ 插件创建成功！'))
    console.log('\n接下来：')
    console.log(chalk.cyan(`  cd ${name}`))
    if (options.install === false) {
      console.log(chalk.cyan('  npm install'))
    }
    console.log(chalk.cyan('  npm run dev'))
    console.log('\n开始开发你的插件吧！🚀\n')

  } catch (error) {
    spinner.fail('插件创建失败')
    console.error(chalk.red(error))
    fs.removeSync(targetDir)
    process.exit(1)
  }
}

/**
 * 验证插件名称
 */
function isValidPluginName(name: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9-]*$/.test(name)
}

/**
 * 收集插件信息
 */
async function collectPluginInfo(name: string, options: PluginOptions) {
  const templates = getTemplates()

  const questions: any[] = []

  // 模板选择
  if (!options.template || !templates[options.template]) {
    questions.push({
      type: 'list',
      name: 'template',
      message: '选择插件模板：',
      choices: Object.entries(templates).map(([key, tmpl]) => ({
        name: `${tmpl.name} - ${tmpl.description}`,
        value: key
      })),
      default: 'default'
    })
  }

  // 描述
  if (!options.description) {
    questions.push({
      type: 'input',
      name: 'description',
      message: '插件描述：',
      default: `${name} plugin for LDesign Editor`
    })
  }

  // 作者
  if (!options.author) {
    questions.push({
      type: 'input',
      name: 'author',
      message: '作者：',
      default: getGitUser()
    })
  }

  // 功能选择
  questions.push({
    type: 'checkbox',
    name: 'features',
    message: '选择要包含的功能：',
    choices: [
      { name: '工具栏按钮', value: 'toolbar', checked: true },
      { name: '右键菜单', value: 'contextMenu', checked: false },
      { name: '键盘快捷键', value: 'keyboard', checked: true },
      { name: '弹窗界面', value: 'dialog', checked: false },
      { name: '状态管理', value: 'state', checked: false },
      { name: '国际化支持', value: 'i18n', checked: false },
      { name: '单元测试', value: 'test', checked: true },
      { name: 'TypeScript', value: 'typescript', checked: true }
    ]
  })

  const answers = await inquirer.prompt(questions)

  return {
    name,
    template: options.template || answers.template,
    description: options.description || answers.description,
    author: options.author || answers.author,
    features: answers.features || [],
    className: toPascalCase(name),
    date: new Date().toISOString()
  }
}

/**
 * 获取Git用户信息
 */
function getGitUser(): string {
  try {
    const name = execSync('git config --get user.name', { encoding: 'utf8' }).trim()
    const email = execSync('git config --get user.email', { encoding: 'utf8' }).trim()
    return `${name} <${email}>`
  } catch {
    return ''
  }
}

/**
 * 转换为PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * 复制模板文件
 */
async function copyTemplate(templateName: string, targetDir: string, data: any) {
  const templates = getTemplates()
  const template = templates[templateName]

  if (!template) {
    throw new Error(`模板 ${templateName} 不存在`)
  }

  const templateDir = path.join(__dirname, '../templates', templateName)

  // 复制文件
  const files = await getFiles(templateDir)

  for (const file of files) {
    const relativePath = path.relative(templateDir, file)
    const targetPath = path.join(targetDir, relativePath)

    // 创建目标目录
    fs.ensureDirSync(path.dirname(targetPath))

    // 处理模板文件
    if (file.endsWith('.tmpl')) {
      const content = fs.readFileSync(file, 'utf8')
      const processed = processTemplate(content, data)
      fs.writeFileSync(targetPath.replace('.tmpl', ''), processed)
    } else {
      // 直接复制非模板文件
      fs.copyFileSync(file, targetPath)
    }
  }

  // 创建额外的文件
  await createExtraFiles(targetDir, data)
}

/**
 * 获取目录下所有文件
 */
async function getFiles(dir: string): Promise<string[]> {
  const files: string[] = []

  async function walk(currentDir: string) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(fullPath)
      } else {
        files.push(fullPath)
      }
    }
  }

  await walk(dir)
  return files
}

/**
 * 处理模板内容
 */
function processTemplate(content: string, data: any): string {
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match
  })
}

/**
 * 创建额外文件
 */
async function createExtraFiles(targetDir: string, data: any) {
  // package.json
  const packageJson = {
    name: `@ldesign/editor-plugin-${data.name}`,
    version: '0.1.0',
    description: data.description,
    author: data.author,
    license: 'MIT',
    main: 'dist/index.js',
    module: 'dist/index.esm.js',
    types: 'dist/index.d.ts',
    files: ['dist'],
    scripts: {
      dev: 'vite',
      build: 'vite build',
      test: 'vitest',
      'test:coverage': 'vitest --coverage'
    },
    peerDependencies: {
      '@ldesign/editor': '*'
    },
    devDependencies: {
      '@ldesign/editor': 'workspace:*',
      '@types/node': '^20.0.0',
      'typescript': '^5.0.0',
      'vite': '^5.0.0',
      'vitest': '^1.0.0'
    }
  }

  if (data.features.includes('typescript')) {
    packageJson.devDependencies['@vitejs/plugin-vue'] = '^5.0.0'
  }

  fs.writeJsonSync(path.join(targetDir, 'package.json'), packageJson, { spaces: 2 })

  // README.md
  const readme = `# ${data.className} Plugin

${data.description}

## 安装

\`\`\`bash
npm install @ldesign/editor-plugin-${data.name}
\`\`\`

## 使用

\`\`\`typescript
import { Editor } from '@ldesign/editor'
import ${data.className}Plugin from '@ldesign/editor-plugin-${data.name}'

const editor = new Editor({
  plugins: [${data.className}Plugin]
})
\`\`\`

## 开发

\`\`\`bash
npm run dev    # 开发模式
npm run build  # 构建
npm run test   # 测试
\`\`\`

## License

MIT © ${data.author}
`

  fs.writeFileSync(path.join(targetDir, 'README.md'), readme)

  // .gitignore
  const gitignore = `node_modules
dist
.DS_Store
*.log
coverage
.vite-cache
`

  fs.writeFileSync(path.join(targetDir, '.gitignore'), gitignore)
}






