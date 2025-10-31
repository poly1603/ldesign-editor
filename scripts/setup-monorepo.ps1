# LDesign Editor v3.0 Monorepo Setup Script
# This script creates all framework packages with proper structure

$ErrorActionPreference = "Stop"

$ROOT = "D:\WorkBench\ldesign\libraries\editor"
$PACKAGES = "$ROOT\packages"

Write-Host "🚀 Setting up LDesign Editor v3.0 Monorepo..." -ForegroundColor Cyan

# Framework configurations
$frameworks = @{
    "solid" = @{
        deps = "@{`"solid-js`": `"^1.9.3`"}"
        peerDeps = "@{`"solid-js`": `">=1.8.0`"}"
    }
    "svelte" = @{
        deps = "@{`"svelte`": `"^5.19.2`"}"
        peerDeps = "@{`"svelte`": `">=5.0.0`"}"
    }
    "qwik" = @{
        deps = "@{`"@builder.io/qwik`": `"^1.11.2`"}"
        peerDeps = "@{`"@builder.io/qwik`": `">=1.0.0`"}"
    }
    "preact" = @{
        deps = "@{`"preact`": `"^10.26.2`"}"
        peerDeps = "@{`"preact`": `">=10.0.0`"}"
    }
}

# Create package structure function
function New-PackageStructure {
    param(
        [string]$framework,
        [hashtable]$config
    )
    
    $packageDir = "$PACKAGES\$framework"
    Write-Host "  📦 Creating $framework package..." -ForegroundColor Yellow
    
    # Create directories
    New-Item -ItemType Directory -Force -Path "$packageDir\src\components" | Out-Null
    New-Item -ItemType Directory -Force -Path "$packageDir\src\lib" | Out-Null
    New-Item -ItemType Directory -Force -Path "$packageDir\tests" | Out-Null
    New-Item -ItemType Directory -Force -Path "$packageDir\demo\src" | Out-Null
    New-Item -ItemType Directory -Force -Path "$packageDir\.ldesign" | Out-Null
    
    # Create package.json
    $packageJson = @"
{
  "name": "@ldesign/editor-$framework",
  "version": "3.0.0",
  "description": "$($framework.Substring(0,1).ToUpper())$($framework.Substring(1)) wrapper for LDesign Editor",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist", "README.md"],
  "scripts": {
    "dev": "ldesign-builder build --watch",
    "build": "ldesign-builder build",
    "test": "vitest",
    "test:unit": "vitest run",
    "test:visual": "playwright test",
    "test:perf": "vitest bench",
    "lint": "eslint src --max-warnings 0",
    "lint:fix": "eslint src --fix",
    "type-check": "tsc --noEmit",
    "clean": "rimraf dist"
  },
  "dependencies": {
    "@ldesign/editor-core": "workspace:*"
  },
  "devDependencies": {
    "@antfu/eslint-config": "^6.0.0",
    "@ldesign/builder": "workspace:*",
    "@playwright/test": "^1.50.2",
    "@types/node": "^22.10.5",
    "eslint": "^9.18.0",
    "rimraf": "^6.0.1",
    "typescript": "^5.7.3",
    "vitest": "^2.1.8"
  },
  "peerDependencies": $($config.peerDeps),
  "engines": {
    "node": ">=18.0.0"
  }
}
"@
    Set-Content -Path "$packageDir\package.json" -Value $packageJson
    
    # Create tsconfig.json
    $tsconfig = @"
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]
}
"@
    Set-Content -Path "$packageDir\tsconfig.json" -Value $tsconfig
    
    # Create eslint.config.js
    $eslintConfig = @"
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  ignores: ['dist', 'node_modules'],
})
"@
    Set-Content -Path "$packageDir\eslint.config.js" -Value $eslintConfig
    
    # Create builder config
    $builderConfig = @"
import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'cjs'],
  dts: true,
  external: ['@ldesign/editor-core'],
})
"@
    Set-Content -Path "$packageDir\.ldesign\builder.config.ts" -Value $builderConfig
    
    # Create index.ts
    $indexContent = @"
export * from './lib'
"@
    Set-Content -Path "$packageDir\src\index.ts" -Value $indexContent
    
    # Create README
    $readme = @"
# @ldesign/editor-$framework

$($framework.Substring(0,1).ToUpper())$($framework.Substring(1)) wrapper for LDesign Editor.

## Installation

\`\`\`bash
npm install @ldesign/editor-$framework @ldesign/editor-core
\`\`\`

## Usage

See [documentation](../../docs/frameworks/$framework.md) for details.

## License

MIT
"@
    Set-Content -Path "$packageDir\README.md" -Value $readme
    
    Write-Host "    ✅ $framework package created" -ForegroundColor Green
}

# Create remaining framework packages
foreach ($fw in $frameworks.Keys) {
    if (-not (Test-Path "$PACKAGES\$fw\src\index.ts")) {
        New-PackageStructure -framework $fw -config $frameworks[$fw]
    } else {
        Write-Host "  ⏭️  $fw package already exists, skipping..." -ForegroundColor Gray
    }
}

# Create documentation structure
Write-Host "`n📚 Creating documentation structure..." -ForegroundColor Cyan
$docsDir = "$ROOT\docs"
New-Item -ItemType Directory -Force -Path "$docsDir\.vitepress" | Out-Null
New-Item -ItemType Directory -Force -Path "$docsDir\guide" | Out-Null
New-Item -ItemType Directory -Force -Path "$docsDir\frameworks" | Out-Null
New-Item -ItemType Directory -Force -Path "$docsDir\api" | Out-Null
New-Item -ItemType Directory -Force -Path "$docsDir\examples" | Out-Null

# Create VitePress config
$vitepressConfig = @"
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LDesign Editor',
  description: 'Framework-agnostic rich text editor',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/core' },
      { text: 'Examples', link: '/examples/basic-editor' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' }
          ]
        }
      ],
      '/frameworks/': [
        {
          text: 'Frameworks',
          items: [
            { text: 'Vue', link: '/frameworks/vue' },
            { text: 'React', link: '/frameworks/react' },
            { text: 'Angular', link: '/frameworks/angular' },
            { text: 'Solid.js', link: '/frameworks/solid' },
            { text: 'Svelte', link: '/frameworks/svelte' },
            { text: 'Qwik', link: '/frameworks/qwik' },
            { text: 'Preact', link: '/frameworks/preact' }
          ]
        }
      ]
    }
  }
})
"@
Set-Content -Path "$docsDir\.vitepress\config.ts" -Value $vitepressConfig

# Create docs package.json
$docsPackageJson = @"
{
  "name": "@ldesign/editor-docs",
  "version": "3.0.0",
  "private": true,
  "scripts": {
    "docs:dev": "vitepress dev",
    "docs:build": "vitepress build",
    "docs:preview": "vitepress preview"
  },
  "devDependencies": {
    "vitepress": "^1.6.4",
    "vue": "^3.5.14"
  }
}
"@
Set-Content -Path "$docsDir\package.json" -Value $docsPackageJson

Write-Host "  ✅ Documentation structure created" -ForegroundColor Green

Write-Host "`n✨ Monorepo setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Run 'pnpm install' to install dependencies" -ForegroundColor White
Write-Host "  2. Run 'pnpm build:core' to build the core package" -ForegroundColor White
Write-Host "  3. Run 'pnpm build:all' to build all packages" -ForegroundColor White
Write-Host "  4. Run 'pnpm lint:fix' to fix linting issues" -ForegroundColor White
Write-Host "  5. Run 'pnpm type-check' to check TypeScript" -ForegroundColor White
Write-Host "  6. Run 'pnpm test' to run tests" -ForegroundColor White
Write-Host "  7. Run 'pnpm docs:dev' to start documentation" -ForegroundColor White
