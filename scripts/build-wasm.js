#!/usr/bin/env node

/**
 * WebAssembly构建脚本
 * 将.wat文件编译为.wasm并生成Base64内联版本
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const chalk = require('chalk')

const WASM_DIR = path.join(__dirname, '../src/wasm')
const WAT_FILES = ['diff.wat', 'parser.wat']

console.log(chalk.blue('🚀 Building WebAssembly modules...'))

// 检查是否安装了wat2wasm
try {
  execSync('wat2wasm --version', { stdio: 'ignore' })
} catch (error) {
  console.error(chalk.red('❌ wat2wasm not found. Please install wabt:'))
  console.error(chalk.yellow('  npm install -g wabt'))
  console.error(chalk.yellow('  or'))
  console.error(chalk.yellow('  brew install wabt (macOS)'))
  process.exit(1)
}

// 编译每个.wat文件
WAT_FILES.forEach(watFile => {
  const watPath = path.join(WASM_DIR, watFile)
  const wasmFile = watFile.replace('.wat', '.wasm')
  const wasmPath = path.join(WASM_DIR, wasmFile)
  const base64File = watFile.replace('.wat', '.wasm.base64.ts')
  const base64Path = path.join(WASM_DIR, base64File)

  try {
    console.log(chalk.gray(`  Compiling ${watFile}...`))

    // 编译WAT到WASM
    execSync(`wat2wasm ${watPath} -o ${wasmPath}`, { stdio: 'ignore' })

    // 读取WASM文件
    const wasmBuffer = fs.readFileSync(wasmPath)
    const wasmSize = wasmBuffer.length

    // 生成Base64版本（用于生产环境内联）
    const base64Data = wasmBuffer.toString('base64')
    const base64Content = `// Auto-generated WebAssembly Base64 data
// Source: ${watFile}
// Size: ${wasmSize} bytes
// Generated: ${new Date().toISOString()}

export default '${base64Data}'
`

    fs.writeFileSync(base64Path, base64Content)

    // 优化WASM（如果安装了wasm-opt）
    try {
      execSync(`wasm-opt -O3 ${wasmPath} -o ${wasmPath}`, { stdio: 'ignore' })
      const optimizedSize = fs.statSync(wasmPath).size
      console.log(chalk.green(`  ✓ ${wasmFile} (${wasmSize} → ${optimizedSize} bytes)`))
    } catch {
      console.log(chalk.green(`  ✓ ${wasmFile} (${wasmSize} bytes)`))
    }

  } catch (error) {
    console.error(chalk.red(`  ✗ Failed to compile ${watFile}:`))
    console.error(error.message)
    process.exit(1)
  }
})

// 生成类型定义文件
const dtsContent = `// WebAssembly module types
declare module '*.wasm' {
  const content: ArrayBuffer
  export default content
}

declare module '*.wasm.base64' {
  const content: string
  export default content
}
`

fs.writeFileSync(path.join(WASM_DIR, 'wasm.d.ts'), dtsContent)

console.log(chalk.green('\n✨ WebAssembly build complete!'))

// 生成开发环境服务器配置
const serverConfig = `// Vite configuration for WASM files
export default {
  server: {
    fs: {
      allow: ['..']
    }
  },
  assetsInclude: ['**/*.wasm']
}
`

const configPath = path.join(WASM_DIR, 'vite.config.ts')
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, serverConfig)
  console.log(chalk.gray('  Created Vite config for WASM development'))
}




