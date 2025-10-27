# LDesign Editor CLI 使用指南

## 安装

```bash
npm install -g @ldesign/editor-cli
# 或
npm install --save-dev @ldesign/editor-cli
```

## 命令概览

```bash
ldesign-editor <command> [options]
```

### 可用命令

- `create-plugin <name>` - 创建新插件
- `analyze <file>` - 分析性能日志
- `optimize` - 优化构建
- `dev` - 启动开发服务器
- `test` - 运行测试
- `docs` - 生成文档
- `plugin` - 插件管理
- `config` - 配置管理
- `benchmark` - 运行基准测试
- `migrate` - 版本迁移

## 创建插件

### 基础用法

```bash
# 交互式创建
ldesign-editor create-plugin my-plugin

# 使用选项
ldesign-editor create-plugin my-plugin \
  --template toolbar \
  --description "My awesome plugin" \
  --author "Your Name"
```

### 选项

- `-t, --template <template>` - 插件模板 (default|toolbar|formatting|media|ai|table)
- `-d, --description <desc>` - 插件描述
- `-a, --author <author>` - 作者信息
- `--no-git` - 不初始化Git仓库
- `--no-install` - 不自动安装依赖

### 模板类型

#### default - 基础插件模板
最简单的插件结构，包含基本的插件接口实现。

```typescript
import { Plugin } from '@ldesign/editor'

export default class MyPlugin implements Plugin {
  name = 'my-plugin'
  
  init(editor) {
    // 插件初始化
  }
}
```

#### toolbar - 工具栏插件模板
包含工具栏按钮的插件，适合添加新的编辑功能。

```typescript
export default class ToolbarPlugin implements Plugin {
  name = 'toolbar-plugin'
  
  init(editor) {
    editor.toolbar.addButton({
      id: 'my-button',
      icon: 'icon-name',
      title: 'My Button',
      onClick: () => {
        // 按钮点击处理
      }
    })
  }
}
```

#### formatting - 格式化插件模板
文本格式化功能插件，如加粗、斜体等。

#### media - 媒体插件模板
处理图片、视频等媒体内容的插件。

#### ai - AI功能插件模板
集成AI能力的插件，包含AI服务调用示例。

#### table - 表格插件模板
表格编辑功能插件，包含表格操作的完整实现。

### 插件开发流程

1. **创建插件**
   ```bash
   ldesign-editor create-plugin awesome-plugin --template toolbar
   cd awesome-plugin
   ```

2. **开发插件**
   ```bash
   npm run dev
   ```

3. **测试插件**
   ```bash
   npm run test
   npm run test:coverage
   ```

4. **构建插件**
   ```bash
   npm run build
   ```

5. **发布插件**
   ```bash
   npm publish
   ```

## 性能分析

分析编辑器的性能日志，生成可视化报告。

### 基础用法

```bash
# 生成HTML报告
ldesign-editor analyze performance.log

# 指定输出格式
ldesign-editor analyze performance.log \
  --format html \
  --output report.html \
  --open
```

### 选项

- `-o, --output <file>` - 输出文件路径
- `-f, --format <format>` - 报告格式 (html|json|text)
- `--open` - 自动打开HTML报告
- `--threshold <ms>` - 慢操作阈值（默认50ms）

### 性能日志格式

性能日志应该是包含性能条目的JSON数组：

```json
[
  {
    "name": "editor.init",
    "type": "measure",
    "startTime": 0,
    "duration": 123.45
  },
  {
    "name": "plugin.load",
    "type": "measure",
    "startTime": 50,
    "duration": 23.45
  }
]
```

### 生成性能日志

在编辑器中启用性能监控：

```typescript
import { getPerformanceMonitor } from '@ldesign/editor'

const monitor = getPerformanceMonitor()

// 记录性能
const timer = monitor.startTimer('my-operation')
// ... 执行操作
monitor.endTimer(timer)

// 导出日志
const logs = monitor.exportLogs()
```

## 构建优化

针对不同平台优化编辑器构建。

### 基础用法

```bash
# 默认优化（平衡模式）
ldesign-editor optimize

# 针对移动端优化
ldesign-editor optimize --target mobile --mode size

# 针对桌面端优化，速度优先
ldesign-editor optimize --target desktop --mode speed
```

### 选项

- `-t, --target <target>` - 目标平台 (web|mobile|desktop)
- `-m, --mode <mode>` - 优化模式 (size|speed|balanced)
- `--analyze` - 显示包分析报告
- `--modern` - 只支持现代浏览器
- `--no-polyfills` - 移除polyfills
- `--tree-shake` - 激进的tree-shaking

### 优化模式说明

#### size - 体积优先
- 激进压缩
- 移除console
- 代码分割
- 适合移动端

#### speed - 速度优先
- 减少分包
- 增加内联
- 保留sourcemap
- 适合开发环境

#### balanced - 平衡模式
- 适度压缩
- 合理分包
- 默认选项
- 适合生产环境

### 平台特定优化

#### mobile - 移动端
- 更小的chunk
- 激进的代码分割
- 移除不必要的polyfill
- 优化图片资源

#### desktop - 桌面端
- 更大的chunk容忍度
- 保留更多调试信息
- 完整功能集

#### web - 通用Web
- 标准优化策略
- 兼容性优先

## 开发服务器

启动本地开发服务器。

```bash
# 默认端口3000
ldesign-editor dev

# 自定义配置
ldesign-editor dev \
  --port 8080 \
  --host 0.0.0.0 \
  --open
```

### 选项

- `-p, --port <port>` - 服务器端口
- `-h, --host <host>` - 服务器主机
- `--open` - 自动打开浏览器

## 测试命令

运行测试套件。

```bash
# 运行所有测试
ldesign-editor test

# 监听模式
ldesign-editor test --watch

# 生成覆盖率报告
ldesign-editor test --coverage

# 打开测试UI
ldesign-editor test --ui
```

## 文档生成

生成API文档。

```bash
# 生成HTML文档
ldesign-editor docs

# 生成Markdown文档
ldesign-editor docs --format markdown

# 启动文档服务器
ldesign-editor docs --serve
```

### 选项

- `-o, --output <dir>` - 输出目录
- `-f, --format <format>` - 文档格式 (html|markdown)
- `--serve` - 启动文档服务器

## 插件管理

管理编辑器插件。

### 列出可用插件

```bash
ldesign-editor plugin list
```

### 查看插件信息

```bash
ldesign-editor plugin info formatting
```

### 安装插件

```bash
ldesign-editor plugin install table-advanced --save
```

## 配置管理

管理CLI配置。

### 查看配置

```bash
# 查看所有配置
ldesign-editor config get

# 查看特定配置
ldesign-editor config get defaultTemplate
```

### 设置配置

```bash
ldesign-editor config set defaultTemplate toolbar
ldesign-editor config set author "Your Name"
```

### 重置配置

```bash
ldesign-editor config reset
```

## 基准测试

运行性能基准测试。

```bash
# 运行所有测试
ldesign-editor benchmark

# 运行特定测试套件
ldesign-editor benchmark --suite editor-init

# 自定义迭代次数
ldesign-editor benchmark --iterations 1000
```

### 选项

- `-s, --suite <suite>` - 测试套件名称
- `-i, --iterations <n>` - 迭代次数
- `-o, --output <file>` - 输出结果文件

## 版本迁移

在不同版本间迁移。

```bash
# 从v1迁移到v2
ldesign-editor migrate v1 v2

# 演练模式
ldesign-editor migrate v1 v2 --dry-run

# 创建备份
ldesign-editor migrate v1 v2 --backup
```

## 高级用法

### 在package.json中使用

```json
{
  "scripts": {
    "dev": "ldesign-editor dev",
    "build": "ldesign-editor optimize --target web --mode balanced",
    "build:mobile": "ldesign-editor optimize --target mobile --mode size --modern",
    "analyze": "ldesign-editor analyze performance.log --open",
    "create-plugin": "ldesign-editor create-plugin"
  }
}
```

### 配置文件

创建 `.ldesign-editor.config.js`:

```javascript
module.exports = {
  // 默认模板
  defaultTemplate: 'toolbar',
  
  // 构建优化默认选项
  build: {
    target: 'web',
    mode: 'balanced',
    modern: false
  },
  
  // 开发服务器默认选项
  dev: {
    port: 3000,
    host: 'localhost',
    open: true
  },
  
  // 性能分析默认选项
  analyze: {
    format: 'html',
    threshold: 50,
    open: true
  }
}
```

### CI/CD集成

#### GitHub Actions

```yaml
name: Build and Analyze

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm install -g @ldesign/editor-cli
      
      # 构建优化
      - run: ldesign-editor optimize --target web --analyze
      
      # 性能测试
      - run: ldesign-editor benchmark --output benchmark.json
      
      # 上传报告
      - uses: actions/upload-artifact@v3
        with:
          name: performance-reports
          path: |
            dist/stats.html
            benchmark.json
```

## 故障排查

### 常见问题

#### 命令未找到

确保全局安装了CLI工具：

```bash
npm install -g @ldesign/editor-cli
```

或使用npx：

```bash
npx @ldesign/editor-cli create-plugin my-plugin
```

#### 构建失败

1. 检查Node.js版本（需要 >= 18）
2. 清理缓存：`rm -rf node_modules package-lock.json`
3. 重新安装：`npm install`

#### 性能分析无数据

确保性能日志格式正确，包含必需字段：
- name
- startTime
- duration

### 调试模式

设置环境变量启用调试输出：

```bash
DEBUG=ldesign:* ldesign-editor analyze performance.log
```

## 贡献指南

欢迎贡献新的功能和改进！

1. Fork 仓库
2. 创建功能分支
3. 提交更改
4. 发送 Pull Request

## License

MIT






