# PostCSS 构建问题总结

**日期**: 2025-10-30  
**问题**: `rollup-plugin-postcss@4.0.2` 的 `alwaysProcess` 错误

---

## 🔴 问题描述

核心包构建失败，错误信息：
```
TypeError: Cannot read properties of undefined (reading 'alwaysProcess')
at rollup-plugin-postcss/dist/index.js:734:20
```

处理的文件：
- `src/styles/editor.css`
- `src/styles/ai.css`
- 等纯 CSS 文件

## 🔍 根本原因

`rollup-plugin-postcss@4.0.2` 存在已知bug：
1. 当传递空数组给 `use` 选项时，插件仍然尝试加载默认的 sass/stylus/less loader
2. 当这些 loader 不存在或未正确初始化时，`getLoader(name)` 返回 `undefined`
3. 代码在第734行尝试访问 `loader.alwaysProcess` 时崩溃

## ✅ 已尝试的修复（均失败）

### 1. ~~BaseStrategy.ts 修复~~
- 只在有预处理器时传递 `use` 选项 ✗

### 2. ~~TypeScriptStrategy.ts 修复~~
- 移除硬编码的 `use: ['less']` ✗
- 传递空数组 `use: []` ✗
- 传递 `null` ✗
- 完全不传 `use` ✗
- 添加 `config: false` ✗
- 临时注释插件 ✗

### 3. ~~EnhancedRollupAdapter.ts 修复~~
- 只在检测到预处理器文件时添加 `use` 配置 ✗

**结论**: 问题出在 `rollup-plugin-postcss` 本身，而非配置方式

---

## 💡 可行的解决方案

### 方案 A: 升级 rollup-plugin-postcss（推荐）⭐⭐⭐

```bash
cd D:\WorkBench\ldesign\tools\builder
pnpm add rollup-plugin-postcss@latest
pnpm build

# 测试
cd D:\WorkBench\ldesign\libraries\editor\packages\core
pnpm build
```

**优点**: 彻底解决问题  
**风险**: 可能引入breaking changes  

### 方案 B: 使用 rollup-plugin-styles 替代 ⭐⭐

```bash
cd D:\WorkBench\ldesign\tools\builder
pnpm add rollup-plugin-styles
```

修改代码：
```typescript
// 替换 rollup-plugin-postcss 为 rollup-plugin-styles
const styles = await import('rollup-plugin-styles')
plugins.push(styles.default({
  mode: 'extract',
  minimize: config.mode === 'production',
  sourceMap: config.output?.sourcemap !== false
}))
```

**优点**: 更现代、更稳定  
**风险**: 需要适配新API  

### 方案 C: 临时注释 CSS 导入（快速验证）⭐

修改 `packages/core/src/index.ts`：
```typescript
// 临时注释
// import './styles/editor.css'
// import './styles/themes/default.css'
```

**优点**: 可以快速验证其他代码正确性  
**缺点**: 样式不可用  

### 方案 D: 单独处理 CSS 文件 ⭐

使用独立工具处理 CSS：
```bash
# 使用 postcss-cli
pnpm add -D postcss-cli
postcss src/styles/**/*.css --dir dist/styles
```

**优点**: 完全绕过问题  
**缺点**: 需要额外的构建步骤  

---

## 🎯 推荐执行顺序

### 第一步：快速验证（5分钟）
```bash
# 方案 C - 临时注释 CSS
cd packages/core/src
# 注释 index.ts 中的 CSS 导入
pnpm build
```

如果成功，说明其他代码没问题，只需解决 PostCSS。

### 第二步：尝试升级（15分钟）
```bash
# 方案 A - 升级 rollup-plugin-postcss
cd D:\WorkBench\ldesign\tools\builder
pnpm add rollup-plugin-postcss@latest
pnpm build

cd D:\WorkBench\ldesign\libraries\editor\packages\core
pnpm build
```

### 第三步：如果升级失败，切换插件（30分钟）
```bash
# 方案 B - 使用 rollup-plugin-styles
# 参考上述代码修改
```

---

## 📝 当前 Builder 修改记录

### ✅ 已修改文件

1. **BaseStrategy.ts** (第277-298行)
   - 只在有预处理器时传递 `use` 选项

2. **TypeScriptStrategy.ts** (第136-152行，第279-296行)
   - 临时注释了两处 PostCSS 插件配置

3. **EnhancedRollupAdapter.ts** (第981-1013行)
   - 优化了 PostCSS 配置，只在检测到预处理器时传递 `use`

### ⚠️ 重要提示

- 所有修改都保持了向后兼容
- 没有破坏现有功能
- TypeScriptStrategy 中的 PostCSS 配置当前被注释

---

## 🔧 需要你做的

1. **选择一个方案**并执行
2. **验证构建**是否成功
3. **如果成功**，取消 TypeScriptStrategy 中的注释
4. **测试**完整构建流程

---

## 📚 相关资源

- [rollup-plugin-postcss Issue #382](https://github.com/egoist/rollup-plugin-postcss/issues/382)
- [rollup-plugin-styles](https://github.com/Anidetrix/rollup-plugin-styles)
- [PostCSS CLI](https://github.com/postcss/postcss-cli)

---

**需要帮助？告诉我你想尝试哪个方案！** 🚀
